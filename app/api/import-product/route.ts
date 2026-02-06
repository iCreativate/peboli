import { NextResponse } from 'next/server';

type ImportedProduct = {
  title?: string;
  description?: string;
  images: string[];
  currency?: string;
  price?: number;
  compareAtPrice?: number;
  brand?: string;
  category?: string;
  sku?: string;
  availability?: string;
  stock?: number;
  condition?: string;
  mpn?: string; // Manufacturer Part Number
  gtin?: string; // Global Trade Item Number (UPC, EAN, ISBN)
};

const uniq = (arr: string[]) => Array.from(new Set(arr));

function convertToHighRes(url: string): string {
  try {
    const u = new URL(url);
    
    // Amazon: Remove size constraints (e.g. _SL1500_)
    // Pattern: /images/I/xxxx._SLxxxx_.jpg -> /images/I/xxxx.jpg
    if (u.hostname.includes('amazon') || u.hostname.includes('media-amazon')) {
      const parts = u.pathname.split('/');
      const last = parts[parts.length - 1];
      if (last) {
        // Remove ._SL..._ or ._AC..._ or similar
        const newLast = last.replace(/\._[A-Z]{2}[0-9,]+_\./, '.');
        parts[parts.length - 1] = newLast;
        u.pathname = parts.join('/');
      }
    }

    // Shopify: Remove size suffix (e.g. _100x100, _small, _medium, _large, etc.)
    // Pattern: name_size.ext or name_size.ext?v=...
    // We try to remove the suffix to get the "master" image
    if (u.hostname.includes('cdn.shopify.com')) {
       const path = u.pathname;
       // Regex for _[number]x[number] or standard size names at the end of filename
       const newPath = path.replace(/_(?:pico|icon|thumb|small|compact|medium|large|grande|1024x1024|2048x2048|[0-9]+x[0-9]+)(?=\.[^.]+$)/, '');
       u.pathname = newPath;
    }

    // WordPress/WooCommerce: Remove -[width]x[height] suffix
    // e.g. image-300x300.jpg -> image.jpg
    // But be careful not to match IDs like product-12345.jpg if that's the main name. 
    // Usually resizing adds -NxN.
    if (u.pathname.match(/-\d+x\d+\.(jpg|jpeg|png|webp|gif)$/i)) {
        u.pathname = u.pathname.replace(/-\d+x\d+(\.(jpg|jpeg|png|webp|gif))$/i, '$1');
    }
    
    // General: Remove width/height query params which are often used for resizing
    // Many CDNs use w=, h=, width=, height=
    if (u.searchParams.has('w')) u.searchParams.delete('w');
    if (u.searchParams.has('width')) u.searchParams.delete('width');
    if (u.searchParams.has('h')) u.searchParams.delete('h');
    if (u.searchParams.has('height')) u.searchParams.delete('height');
    if (u.searchParams.has('size')) u.searchParams.delete('size'); // some use size=...

    return u.toString();
  } catch {
    return url;
  }
}

function safeAbsoluteUrl(raw: string, base: string) {
  try {
    return new URL(raw, base).toString();
  } catch {
    return null;
  }
}

async function convertUsdToZar(amount: number) {
  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=USD&to=ZAR&amount=${encodeURIComponent(amount)}`
    );
    if (res.ok) {
      const data = (await res.json()) as { result?: number };
      const r = data?.result;
      if (typeof r === 'number' && Number.isFinite(r)) return r;
    }
  } catch {
    // ignore
  }
  return amount * 19;
}

function extractMeta(content: string, key: string) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
  ];

  for (const p of patterns) {
    const m = content.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

function normalizeCategorySlug(raw?: string) {
  if (!raw) return undefined;
  const s = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return s || undefined;
}

function guessCategoryFromText(text: string) {
  const t = text.toLowerCase();
  const rules: Array<{ slug: string; re: RegExp }> = [
    { slug: 'electronics', re: /(phone|smartphone|laptop|tablet|headphone|earbud|tv|camera|console|gaming|pc|computer|monitor|keyboard|mouse|charger|cable|battery)/i },
    { slug: 'fashion', re: /(shoe|sneaker|dress|shirt|jean|jacket|hoodie|fashion|clothing|pants|socks|underwear|hat|cap|watch|jewelry|bag|purse)/i },
    { slug: 'home', re: /(kitchen|vacuum|bedding|furniture|home|appliance|cookware|microwave|fridge|blender|toaster|kettle|couch|sofa|chair|table|desk|lamp|light|decor)/i },
    { slug: 'beauty', re: /(beauty|skincare|serum|makeup|perfume|lotion|shampoo|conditioner|soap|grooming|hair|face|body)/i },
    { slug: 'sports', re: /(sport|fitness|gym|training|running|bicycle|bike|yoga|weight|dumbbell|ball|racket|club|swim|outdoor|camping|tent)/i },
    { slug: 'baby', re: /(baby|toddler|diaper|nappy|stroller|pram|cot|crib|toy|formula|bottle)/i },
    { slug: 'liquor', re: /(wine|whisky|whiskey|gin|vodka|beer|champagne|liquor|alcohol|spirit|rum|tequila|brandy)/i },
    { slug: 'books', re: /(book|novel|paperback|hardcover|kindle|ebook|reading)/i },
    { slug: 'automotive', re: /(car|auto|vehicle|motor|tire|tyre|oil|accessory|mat|cover|cleaner|wax)/i },
    { slug: 'pets', re: /(pet|dog|cat|food|treat|leash|collar|bed|toy|aquarium|fish)/i },
    { slug: 'toys', re: /(toy|game|puzzle|doll|action figure|lego|block|board game)/i },
    { slug: 'health', re: /(health|vitamin|supplement|protein|mask|sanitizer|thermometer|pressure|monitor)/i },
    { slug: 'office', re: /(office|stationery|pen|pencil|notebook|paper|printer|ink|toner|calculator)/i },
  ];
  for (const r of rules) {
    if (r.re.test(t)) return r.slug;
  }
  return undefined;
}

function extractAllOgImages(html: string) {
  const out: string[] = [];
  const re = /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    if (match[1]) out.push(match[1]);
  }
  return out;
}

function extractAllTwitterImages(html: string) {
  const out: string[] = [];
  const re = /<meta[^>]+(?:property|name)=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    if (match[1]) out.push(match[1]);
  }
  return out;
}

function extractLinkImage(html: string) {
  const m = html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i);
  return m?.[1] || null;
}

function extractInlineImages(html: string) {
  const out: string[] = [];
  const reSrc = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const reDataSrc = /<img[^>]+data-src=["']([^"']+)["'][^>]*>/gi;
  const reDataOriginal = /<img[^>]+data-original=["']([^"']+)["'][^>]*>/gi;
  const reDataLazy = /<img[^>]+data-lazy=["']([^"']+)["'][^>]*>/gi;
  const reSrcset = /<img[^>]+srcset=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = reSrc.exec(html))) {
    if (m[1]) out.push(m[1]);
  }
  while ((m = reDataSrc.exec(html))) {
    if (m[1]) out.push(m[1]);
  }
  while ((m = reDataOriginal.exec(html))) {
    if (m[1]) out.push(m[1]);
  }
  while ((m = reDataLazy.exec(html))) {
    if (m[1]) out.push(m[1]);
  }
  while ((m = reSrcset.exec(html))) {
    const srcset = m[1];
    if (srcset) {
      srcset
        .split(',')
        .map((part) => part.trim().split(' ')[0])
        .filter(Boolean)
        .forEach((u) => out.push(u));
    }
  }
  // Prefer typical product image extensions
  return out.filter((u) => /\.(jpg|jpeg|png|webp|gif)(\?|#|$)/i.test(u));
}

function extractJsonLd(html: string) {
  const blocks: string[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    if (match[1]) blocks.push(match[1]);
  }

  const parsed: any[] = [];
  for (const b of blocks) {
    try {
      parsed.push(JSON.parse(b.trim()));
    } catch {
      // ignore bad json
    }
  }
  return parsed;
}

function findProductJsonLd(nodes: any[]): any[] {
  const found: any[] = [];

  const visit = (n: any) => {
    if (!n) return;
    if (Array.isArray(n)) {
      n.forEach(visit);
      return;
    }
    if (typeof n !== 'object') return;

    const t = n['@type'];
    if (t === 'Product' || (Array.isArray(t) && t.includes('Product'))) {
      found.push(n);
    }

    if (n['@graph']) visit(n['@graph']);
  };

  nodes.forEach(visit);
  return found;
}

function normalizeImages(images: any, baseUrl: string): string[] {
  const imgArr = Array.isArray(images) ? images : images ? [images] : [];
  const out: string[] = [];
  for (const i of imgArr) {
    if (typeof i === 'string') {
      const abs = safeAbsoluteUrl(i, baseUrl);
      if (abs) out.push(abs);
    } else if (i?.url && typeof i.url === 'string') {
      const abs = safeAbsoluteUrl(i.url, baseUrl);
      if (abs) out.push(abs);
    }
  }
  return out;
}

function parsePrice(val: unknown) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    // Remove currency symbols and commas, keep dot
    const clean = val.replace(/[^0-9.]/g, '');
    const n = Number(clean);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function extractPriceCurrency(product: any) {
  const offers = product?.offers;
  const firstOffer = Array.isArray(offers) ? offers[0] : offers;
  const price = firstOffer?.price;
  const highPrice = firstOffer?.highPrice;
  const lowPrice = firstOffer?.lowPrice;
  const currency = firstOffer?.priceCurrency;

  const parsedPrice = parsePrice(price);
  const parsedHigh = parsePrice(highPrice);
  const parsedLow = parsePrice(lowPrice);

  const normalizedPrice = parsedPrice;
  const normalizedLow = parsedLow;
  const normalizedHigh = parsedHigh;

  const baselinePrice = normalizedPrice ?? normalizedLow;
  const compareAt =
    baselinePrice != null && normalizedHigh != null && normalizedHigh > baselinePrice ? normalizedHigh : undefined;

  return {
    price: baselinePrice,
    compareAtPrice: compareAt,
    currency: typeof currency === 'string' ? currency : undefined,
  };
}

function extractBrand(product: any) {
  const b = product?.brand;
  if (typeof b === 'string') return b;
  if (b && typeof b === 'object' && typeof b.name === 'string') return b.name;
  const m = product?.manufacturer;
  if (m && typeof m === 'object' && typeof m.name === 'string') return m.name;
  return undefined;
}

function findBreadcrumbJsonLd(nodes: any[]): any[] {
  const found: any[] = [];
  const visit = (n: any) => {
    if (!n) return;
    if (Array.isArray(n)) {
      n.forEach(visit);
      return;
    }
    if (typeof n !== 'object') return;
    const t = n['@type'];
    if (t === 'BreadcrumbList' || (Array.isArray(t) && t.includes('BreadcrumbList'))) {
      found.push(n);
    }
    if (n['@graph']) visit(n['@graph']);
  };
  nodes.forEach(visit);
  return found;
}

function breadcrumbCategorySlug(breadcrumb: any) {
  const elements = breadcrumb?.itemListElement;
  const arr = Array.isArray(elements) ? elements : [];
  const labels: string[] = [];
  for (const el of arr) {
    const item = el?.item;
    const name = typeof el?.name === 'string' ? el.name : typeof item?.name === 'string' ? item.name : undefined;
    if (name) labels.push(name);
  }
  const candidate = labels.length >= 2 ? labels[labels.length - 2] : labels[0];
  return normalizeCategorySlug(candidate);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    let target: URL;
    try {
      target = new URL(url);
    } catch (e) {
      console.error('[Import Product] Invalid URL:', url, e);
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }

    console.log('[Import Product] Fetching URL:', target.toString());

    // Important: many big ecommerce sites will block bots/scrapers.
    // We try a normal fetch with a browser-like user agent, but it may still fail.
    let res: Response;
    try {
      // Use more realistic browser headers to avoid detection
      const headers: HeadersInit = {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive',
        'DNT': '1',
      };
      
      // Add referer if we can determine it (helps some sites)
      try {
        const urlObj = new URL(target.toString());
        if (urlObj.hostname) {
          headers['Referer'] = `${urlObj.protocol}//${urlObj.hostname}/`;
        }
      } catch {
        // Ignore referer errors
      }
      
      res = await fetch(target.toString(), {
        headers,
        // Avoid caching stale results during dev.
        cache: 'no-store',
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 seconds
        // Add redirect handling
        redirect: 'follow',
      });
    } catch (e: any) {
      console.error('[Import Product] Fetch error:', e.message || e);
      if (e.name === 'AbortError' || e.name === 'TimeoutError') {
        return NextResponse.json({ error: 'Request timeout. The website may be too slow or blocking requests.' }, { status: 504 });
      }
      return NextResponse.json({ error: `Failed to fetch: ${e.message || 'Network error'}` }, { status: 502 });
    }

    if (!res.ok) {
      console.error('[Import Product] HTTP error:', res.status, res.statusText);
      return NextResponse.json(
        { error: `Failed to fetch page (${res.status} ${res.statusText})`, status: res.status },
        { status: 502 }
      );
    }

    const html = await res.text();
    console.log('[Import Product] Fetched HTML, length:', html.length);
    
    // Check if we got valid HTML
    if (!html || html.length < 100) {
      console.error('[Import Product] HTML too short or empty:', html);
      return NextResponse.json(
        { error: 'Received empty or invalid HTML response. The website may be blocking requests or require JavaScript.' },
        { status: 502 }
      );
    }
    
    // Check for common error/blocking pages (but don't block immediately - try extraction first)
    const lowerHtml = html.toLowerCase();
    const isLikelyBlocked = (
      (lowerHtml.includes('cloudflare') && (lowerHtml.includes('checking your browser') || lowerHtml.includes('please wait'))) ||
      (lowerHtml.includes('captcha') && (lowerHtml.includes('verify') || lowerHtml.includes('robot'))) ||
      (res.status === 403 && html.length < 1000) // Very short 403 response likely means blocking
    );
    
    // Log warning but continue - we'll check again after extraction
    if (isLikelyBlocked) {
      console.warn('[Import Product] Possible blocking detected, but continuing extraction. HTML sample:', html.substring(0, 500));
    }
    
    // Log a sample of the HTML for debugging (first 1000 chars)
    if (html.length < 1000) {
      console.log('[Import Product] Full HTML:', html);
    } else {
      console.log('[Import Product] HTML sample (first 1000 chars):', html.substring(0, 1000));
    }

  // Extract title from multiple sources
  const ogTitle = extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title');
  const pageTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
  
  // Extract description from multiple sources
  const ogDesc = extractMeta(html, 'og:description') || extractMeta(html, 'twitter:description') || extractMeta(html, 'description');
  
  // Extract price from multiple meta tag formats
  const ogPrice = extractMeta(html, 'product:price:amount') || 
                  extractMeta(html, 'og:price:amount') ||
                  extractMeta(html, 'product:price') ||
                  extractMeta(html, 'price');
  
  // Extract currency from multiple meta tag formats
  const ogCurrency = extractMeta(html, 'product:price:currency') || 
                     extractMeta(html, 'og:price:currency') ||
                     extractMeta(html, 'product:currency') ||
                     extractMeta(html, 'currency');
  
  // Extract brand from multiple sources
  const ogBrand = extractMeta(html, 'product:brand') || 
                  extractMeta(html, 'og:brand') || 
                  extractMeta(html, 'brand') ||
                  extractMeta(html, 'twitter:data1');
  
  const ogSiteName = extractMeta(html, 'og:site_name');

  const ogImages = extractAllOgImages(html);
  const twitterImages = extractAllTwitterImages(html);
  const linkImage = extractLinkImage(html);
  const inlineImages = extractInlineImages(html);

  const jsonLd = extractJsonLd(html);
  const productNodes = findProductJsonLd(jsonLd);
  const breadcrumbNodes = findBreadcrumbJsonLd(jsonLd);

  let jsonTitle: string | undefined;
  let jsonDesc: string | undefined;
  let jsonImages: string[] = [];
  let jsonPrice: number | undefined;
  let jsonCurrency: string | undefined;
  let jsonCompareAt: number | undefined;
  let jsonBrand: string | undefined;
  let jsonCategory: string | undefined;
  let jsonSku: string | undefined;
  let jsonAvailability: string | undefined;
  let jsonMpn: string | undefined;
  let jsonGtin: string | undefined;
  let jsonCondition: string | undefined;

  if (productNodes[0]) {
    const product = productNodes[0];
    jsonTitle = typeof product.name === 'string' ? product.name : undefined;
    jsonDesc = typeof product.description === 'string' ? product.description : undefined;
    jsonImages = normalizeImages(product.image, target.toString());

    const p = extractPriceCurrency(product);
    jsonPrice = p.price;
    jsonCurrency = p.currency;
    jsonCompareAt = (p as any).compareAtPrice;

    jsonBrand = extractBrand(product);
    jsonCategory = normalizeCategorySlug(product.category);
    
    // Extract additional fields
    jsonSku = typeof product.sku === 'string' ? product.sku : undefined;
    jsonMpn = typeof product.mpn === 'string' ? product.mpn : undefined;
    jsonGtin = typeof product.gtin === 'string' ? product.gtin : 
               typeof product.gtin13 === 'string' ? product.gtin13 :
               typeof product.gtin8 === 'string' ? product.gtin8 :
               typeof product.isbn === 'string' ? product.isbn : undefined;
    
    // Extract availability
    const offers = product?.offers;
    const firstOffer = Array.isArray(offers) ? offers[0] : offers;
    jsonAvailability = typeof firstOffer?.availability === 'string' ? firstOffer.availability :
                      typeof product.offers?.availability === 'string' ? product.offers.availability :
                      typeof product.availability === 'string' ? product.availability : undefined;
    
    // Extract condition
    jsonCondition = typeof firstOffer?.itemCondition === 'string' ? firstOffer.itemCondition :
                   typeof product.condition === 'string' ? product.condition : undefined;
  }
  
  // Also try to extract SKU from meta tags
  const metaSku = extractMeta(html, 'product:retailer_item_id') || 
                  extractMeta(html, 'product:sku') ||
                  extractMeta(html, 'sku');
  
  // Extract availability from meta tags
  const metaAvailability = extractMeta(html, 'product:availability') ||
                           extractMeta(html, 'availability');

  const categoryFromBreadcrumb = breadcrumbNodes[0] ? breadcrumbCategorySlug(breadcrumbNodes[0]) : undefined;
  const categoryFromUrl = normalizeCategorySlug(target.pathname.split('/').filter(Boolean).slice(0, 4).reverse().find((seg) => seg.length > 2));
  const categoryFromText = guessCategoryFromText([jsonTitle, ogTitle, jsonDesc, ogDesc].filter(Boolean).join(' '));
  const category = jsonCategory || categoryFromBreadcrumb || categoryFromText || categoryFromUrl;

  const parsedOgPrice = ogPrice ? Number(ogPrice) : undefined;
  const metaPrice = Number.isFinite(parsedOgPrice as number) ? (parsedOgPrice as number) : undefined;

  const images = uniq(
    [...jsonImages, ...ogImages, ...twitterImages, ...(linkImage ? [linkImage] : []), ...inlineImages]
      .map((i) => safeAbsoluteUrl(i, target.toString()))
      .filter((x): x is string => Boolean(x))
      .map((url) => convertToHighRes(url))
  );

  const finalBrand = jsonBrand || ogBrand || (ogSiteName || undefined);
  const finalSku = jsonSku || metaSku || undefined;
  const finalAvailability = jsonAvailability || metaAvailability || undefined;
  
  // Try to infer stock from availability
  let inferredStock: number | undefined;
  if (finalAvailability) {
    const availLower = finalAvailability.toLowerCase();
    if (availLower.includes('in stock') || availLower.includes('instock') || availLower === 'instock') {
      inferredStock = 100; // Default to 100 if in stock
    } else if (availLower.includes('out of stock') || availLower.includes('outofstock') || availLower === 'outofstock') {
      inferredStock = 0;
    }
  }

  // Try to extract price from HTML if not found in structured data
  let fallbackPrice: number | undefined;
  if (!jsonPrice && !metaPrice) {
    // Look for price patterns in HTML (common e-commerce formats)
    const pricePatterns = [
      /(?:price|cost|amount)[\s:]*[R$]?\s*(\d+[.,]\d{2})/i,
      /[R$]\s*(\d+[.,]\d{2})/,
      /(\d+[.,]\d{2})\s*(?:ZAR|USD|R|rand)/i,
    ];
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const cleaned = match[1].replace(',', '.');
        const num = Number(cleaned);
        if (Number.isFinite(num) && num > 0) {
          fallbackPrice = num;
          break;
        }
      }
    }
  }

  const payload: ImportedProduct = {
    title: jsonTitle || ogTitle || pageTitle || undefined,
    description: jsonDesc || ogDesc || undefined,
    images,
    price: jsonPrice ?? metaPrice ?? fallbackPrice,
    compareAtPrice: jsonCompareAt,
    currency: jsonCurrency || (typeof ogCurrency === 'string' ? ogCurrency : undefined),
    brand: finalBrand,
    category,
    sku: finalSku,
    availability: finalAvailability,
    stock: inferredStock,
    condition: jsonCondition || 'new',
    mpn: jsonMpn,
    gtin: jsonGtin,
  };

  let out = payload;
  if (typeof out.currency === 'string' && out.currency.toUpperCase() === 'USD') {
    const price = typeof out.price === 'number' ? out.price : undefined;
    const compare = typeof out.compareAtPrice === 'number' ? out.compareAtPrice : undefined;
    const [pZar, cZar] = await Promise.all([
      price != null ? convertUsdToZar(price) : Promise.resolve(undefined),
      compare != null ? convertUsdToZar(compare) : Promise.resolve(undefined),
    ]);
    out = {
      ...out,
      price: pZar ?? out.price,
      compareAtPrice: cZar ?? out.compareAtPrice,
      currency: 'ZAR',
    };
  }

    // Ensure images is always an array
    if (!Array.isArray(out.images)) {
      out.images = [];
    }
    
    // Check if we got meaningful data
    const hasData = !!(out.title || out.brand || out.price);
    
    // If we detected blocking AND got no data, return error
    if (isLikelyBlocked && !hasData) {
      console.error('[Import Product] Blocking detected and no data extracted');
      return NextResponse.json(
        { 
          error: 'Website is blocking automated requests. Try a different URL or the site may require JavaScript to load content.',
          warning: 'The website may use Cloudflare protection or require JavaScript to display product information.'
        },
        { status: 403 }
      );
    }
    
    // If no data but no clear blocking, return warning but still return empty data
    if (!hasData) {
      console.warn('[Import Product] No product data extracted. HTML length:', html.length);
      return NextResponse.json({
        ...out,
        warning: 'No product information found. The website may require JavaScript to load content, or the page structure is not recognized.',
      });
    }
    
    console.log('[Import Product] Returning product data:', {
      title: out.title,
      description: out.description ? `${out.description.substring(0, 50)}...` : undefined,
      imagesCount: out.images.length,
      price: out.price,
      compareAtPrice: out.compareAtPrice,
      currency: out.currency,
      brand: out.brand,
      category: out.category,
      sku: out.sku,
      availability: out.availability,
      stock: out.stock,
      hasData,
    });
    
    // Return the data even if some fields are missing
    return NextResponse.json(out);
  } catch (error: any) {
    console.error('[Import Product] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while importing the product' },
      { status: 500 }
    );
  }
}

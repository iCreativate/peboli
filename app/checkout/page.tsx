import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CheckoutFlow />
      </main>
      <Footer />
    </div>
  );
}


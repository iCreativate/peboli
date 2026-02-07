const { execSync } = require('child_process');

if (process.env.VERCEL) {
  console.log('Detected Vercel environment. Running prisma db push...');
  try {
    execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
    console.log('prisma db push completed.');
  } catch (error) {
    console.error('prisma db push failed.');
    process.exit(1);
  }
} else {
  console.log('Not in Vercel. Skipping prisma db push.');
}

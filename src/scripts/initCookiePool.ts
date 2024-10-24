import { cookiePool } from '../lib/CookiePool';

async function initializeCookiePool() {
  await cookiePool.initialize();

  const cookies = process.argv.slice(2);
  if (cookies.length === 0) {
    console.log('No cookies provided. Usage: npm run init-cookie-pool <cookie1> <cookie2> ...');
    return;
  }

  for (const cookie of cookies) {
    await cookiePool.addCookie(cookie.trim());
  }

  console.log(`${cookies.length} cookie(s) added to the pool successfully`);
}

initializeCookiePool().catch(console.error);

import { cookiePool } from '../lib/CookiePool';

async function listCookies() {
  await cookiePool.initialize();
  const cookies = await cookiePool.getAllCookies();
  console.log('Cookies in the pool:');
  cookies.forEach((cookie, index) => {
    console.log(`${index + 1}. ID: ${cookie.id}, Status: ${cookie.status}, Credits Left: ${cookie.credits_left}`);
  });
}

listCookies().catch(console.error);

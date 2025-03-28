import { getRequestConfig } from 'next-intl/server';
 
export default getRequestConfig(async ({ locale }) => {
  // Load messages statically
  const messages = (await import(`../messages/${locale}.json`)).default;
  
  return {
    messages,
    timeZone: 'UTC',
    now: new Date()
  };
});


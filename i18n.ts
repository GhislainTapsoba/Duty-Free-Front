import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'fr' // Par défaut français
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const defaultMessages = (await import(`../../messages/ru.json`)).default;
  const localeMessages =
    locale === "ru"
      ? defaultMessages
      : {
          ...defaultMessages,
          ...(await import(`../../messages/${locale}.json`)).default,
        };

  return { locale, messages: localeMessages };
});

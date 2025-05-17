import { registerAs } from '@nestjs/config';
import { I18nOptions } from 'nestjs-i18n/dist/interfaces/i18n-options.interface';

export const I18N_CONFIG_KEY = 'i18n';

type I18nConfiguration = Pick<I18nOptions, 'fallbackLanguage'> & { watch: boolean; acceptLanguageKey: string };

const i18nConfig = registerAs(
  I18N_CONFIG_KEY,
  (): I18nConfiguration => ({
    fallbackLanguage: process.env.I18N_FALLBACK_LANG || 'en',
    watch: process.env.NODE_ENV !== 'production',
    acceptLanguageKey: 'accept-language',
  }),
);

export default i18nConfig;

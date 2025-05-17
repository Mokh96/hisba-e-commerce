import { registerAs } from '@nestjs/config';
import { I18nOptions } from 'nestjs-i18n/dist/interfaces/i18n-options.interface';


export const I18N_CONFIG_KEY = 'i18n';

const i18nConfig = registerAs(
  I18N_CONFIG_KEY,
  (): Pick<I18nOptions, 'fallbackLanguage'> & {watch: boolean} => ({
    fallbackLanguage: process.env.I18N_FALLBACK_LANG || 'en' ,
    watch: process.env.NODE_ENV !== 'production',
  }),
);

export default i18nConfig;

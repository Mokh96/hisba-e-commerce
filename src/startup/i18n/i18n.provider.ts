import { I18nService } from 'nestjs-i18n';
import { I18nPath, I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';
import { TranslateOptions } from 'nestjs-i18n/dist/services/i18n.service';

let i18nServiceRef: I18nService<I18nTranslations>;

export function setI18nService(i18n: I18nService<I18nTranslations>) {
  i18nServiceRef = i18n;
}

export function getI18nService(): I18nService<I18nTranslations> {
  if (!i18nServiceRef) throw new Error('i18nService is not initialized');
  return i18nServiceRef;
}

export function translate(key: I18nPath, options?: TranslateOptions) {
  return getI18nService().translate(key, options);
}



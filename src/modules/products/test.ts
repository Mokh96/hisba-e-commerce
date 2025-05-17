import { getI18nService } from 'src/startup/i18n/i18n.provider';

export function f() {
  const i18n = getI18nService();
  return i18n.translate('common.greeting', { args: { name: 'world' } });
}

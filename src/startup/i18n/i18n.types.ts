import { translate } from 'src/startup/i18n/i18n.provider';

/**
 * I18nMsgType is a type that is returned by the translate function
 *
 * It represents the type of a translated message and is a function that takes
 * a language code as an argument and returns the translated message for that
 * language.
 */
export type I18nMsgType = ReturnType<typeof translate>
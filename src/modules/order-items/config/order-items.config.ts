import { MD_DESCRIPTION_LENGTH } from 'src/common/constants';
import { ARTICLE_FIELD_LENGTHS } from 'src/modules/articles/config/articles.config';

export const ORDER_ITEM_FIELD_LENGTHS = {
  ARTICLE_REF: ARTICLE_FIELD_LENGTHS.REF,
  ARTICLE_LABEL: ARTICLE_FIELD_LENGTHS.LABEL,
  NOTE: MD_DESCRIPTION_LENGTH,
  CODE: 255,
} as const;

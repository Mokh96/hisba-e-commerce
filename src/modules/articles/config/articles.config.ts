import { MAX_FILE_PATH_LENGTH, MD_DESCRIPTION_LENGTH } from 'src/common/constants/database-constraints.constant';

export const ARTICLE_FIELD_LENGTHS = {
  LABEL: 100,
  REF: 255,
  IMG_PATH: MAX_FILE_PATH_LENGTH,
  DESCRIPTION: MD_DESCRIPTION_LENGTH,
  NOTE: MD_DESCRIPTION_LENGTH,
} as const;

/**
 * For example, if you try to create a new user with a username that already exist,
 * the DBM will throw this error.
 * */
export const MYSQL_UNIQUE_CONSTRAINT_CODE = 'ER_DUP_ENTRY';
/**
 /**
 * This error occurs when the data being inserted is too long for the column.
 */
export const MYSQL_DATA_TOO_LONG_CONSTRAINT_CODE = 'ER_DATA_TOO_LONG';

export const MYSQL_FOREIGN_KEY_CONSTRAINT_CODE = 'ER_NO_REFERENCED_ROW_2';
export const MYSQL_NON_NULL_CONSTRAINT_CODE = 'ER_BAD_NULL_ERROR';

export const MYSQL_FOREIGN_KEY_DELETION_CODE = 'ER_ROW_IS_REFERENCED_2';

export const MYSQL_INVALID_VALUE_CODE = 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD';


/**
 * For example, if you try to create a new user with a username that already exists,
 * the DBM will throw this error.
 * */
export const MYSQL_UNIQUE_CONSTRAINT_CODE = 'ER_DUP_ENTRY';

/**
 * The error code returned when the data being inserted is too long for the column.
 */
export const MYSQL_DATA_TOO_LONG_CONSTRAINT_CODE = 'ER_DATA_TOO_LONG';

/**
 * The error code returned when the data being inserted or updated breaks a foreign key constraint.
 */
export const MYSQL_FOREIGN_KEY_CONSTRAINT_CODE = 'ER_NO_REFERENCED_ROW_2';

/**
 * The error code returned when a `NOT NULL` constraint is broken.
 */
export const MYSQL_NON_NULL_CONSTRAINT_CODE = 'ER_BAD_NULL_ERROR';

/**
 * The error code returned when a `FOREIGN KEY` constraint is broken while deleting a record.
 */
export const MYSQL_FOREIGN_KEY_DELETION_CODE = 'ER_ROW_IS_REFERENCED_2';

/**
 * The error code returned when a value is invalid for the given field.
 */
export const MYSQL_INVALID_VALUE_CODE = 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD';

/**
 * The error code returned when a `CHECK` constraint is broken.
 *
 * Example: if you have a `CHECK` constraint on a price field where it can only be set to a positive number,
 * trying to set it to a negative number will break the constraint and return this error.
 * */
export const MYSQL_CHECK_CONSTRAINT_CODE = 'ER_CHECK_CONSTRAINT_VIOLATED';


export const MYSQL_DEADLOCK_CONSTRAINT_CODE = 'ER_LOCK_DEADLOCK';

export const MYSQL_LOCK_WAIT_TIMEOUT = 'ER_LOCK_WAIT_TIMEOUT';

export const MYSQL_UNKNOWN_COLUMN = 'ER_UNKNOWN_COLUMN';
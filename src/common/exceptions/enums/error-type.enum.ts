/*export enum FileErrorType {
  InvalidType = 'file.invalid_type',
  TooLarge = 'file.too_large',
  TooMany = 'file.too_many',
  TooFew = 'file.too_few',
}*/

export enum ErrorType {
  // Validation
  Validation = 'validation_error',
  CheckConstraintViolation = 'check_constraint_violation',

  // Auth.
  AuthForbidden = 'auth.forbidden',
  AuthUnauthorized = 'auth.unauthorized',
  AuthTokenExpired = 'auth.token_expired',
  AuthInvalidToken = 'auth.invalid_token',

  // Database
  DataTooLong = 'db.data_too_long',
  DbUnknownError = 'db.unknown_error',
  DeadlockDetected = 'db.deadlock_detected',
  DuplicateKey = 'db.duplicate_key',
  EntityNotFound = 'db.entity_not_found',
  ForeignKey = 'db.foreign_key_violation',
  ForeignKeyDeletion = 'db.foreign_key_deletion_violation',
  InvalidValue = 'db.invalid_value',
  LockTimeOut = 'db.lock_wait_timeout',
  NonNull = 'db.not_null_violation',
  SqlSyntaxError = 'db.sql_syntax_error',
  UnknownColumn = 'db.unknown_column',
  DataOutOfRange = 'db.data_out_of_range',

  // Internal
  Internal = 'internal_error',

  //Files
  FileInvalidType = 'file.invalid_type',
  FileTooLarge = 'file.too_large',
  FileMissing = 'file.missing',
  FileTooFew = 'file.too_few',
  FileTooMany = 'file.too_many',

  RateLimitExceeded = 'rate.limit_exceeded',
  ExternalTimeout = 'external.timeout',
  ExternalUnavailable = 'external.unavailable',
  ExternalBadResponse = 'external.bad_response',

  InputRequiredFieldMissing = 'input.required_field_missing',
  InputInvalidFormat = 'input.invalid_format',
  Conflict = 'conflict',
  NotAllowed = 'not_allowed',
}

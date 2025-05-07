export enum ErrorType {
  // Validation
  Validation = 'validation.error',

  // Auth
  AuthForbidden = 'auth.forbidden',
  AuthUnauthorized = 'auth.unauthorized',
  AuthTokenExpired = 'auth.token.expired',
  AuthInvalidToken = 'auth.token.invalid',

  // Database
  DataTooLong = 'db.data_too_long',
  DbUnknownError = 'db.error_unknown',
  DeadlockDetected = 'db.deadlock_detected',
  DuplicateKey = 'db.key_duplicate',
  EntityNotFound = 'db.entity_not_found',
  ForeignKey = 'db.foreign_key_violation',
  ForeignKeyDeletion = 'db.foreign_key_deletion_violation',
  InvalidValue = 'db.value_invalid',
  LockTimeOut = 'db.lock_wait_timeout',
  NonNull = 'db.not.null_violation',
  SqlSyntaxError = 'db.sql_syntax_error',
  UnknownColumn = 'db.column_unknown',
  DataOutOfRange = 'db.data_out_of_range',
  CheckConstraintViolation = 'db.check_constraint_violation',

  // Internal
  Internal = 'internal.server_error',

  // Files
  FileInvalidType = 'file.type.invalid',
  FileTooLarge = 'file.too.large',
  FileMissing = 'file.missing',
  FileTooFew = 'file.too.few',
  FileTooMany = 'file.too.many',

  // Rate Limiting
  RateLimitExceeded = 'rate.limit.exceeded',

  // External
  ExternalTimeout = 'external.timeout',
  ExternalUnavailable = 'external.unavailable',
  ExternalBadResponse = 'external.response.bad',

  // Input
  InputRequiredFieldMissing = 'input.field_required_missing',
  InputInvalidFormat = 'input.format_invalid',
  Conflict = 'error.conflict',
  NotAllowed = 'error.not_allowed',
}

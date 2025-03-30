type ErrorType = string // TODO : change to error type

export interface BulkResponse {
  successes: {
    id: number;
    syncId: number;
  }[];
  failures: {
    index: number;
    syncId: number;
    errors: ErrorType[];
  }[];
}

export interface UpdateBulkResponse {
  successes: {
    id: number;
  }[];
  failures: {
    index: number;
    id: number;
    errors: ErrorType[];
  }[];
}

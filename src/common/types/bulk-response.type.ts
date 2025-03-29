export interface BulkResponse {
  successes: {
    id: number;
    syncId: number;
  }[];
  failures: {
    index?: number;
    syncId: number;
    // TODO : change to error type
    errors: string[];
  }[];
}

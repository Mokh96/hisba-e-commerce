import { ApiErrorResponse } from 'src/common/exceptions/interfaces/api-error-response.interface';

export interface BulkResponseType {
  successes: {
    id: number;
    syncId: number;
  }[];
  failures: {
    index?: number;
    syncId: number;
    error: ApiErrorResponse;
  }[];
}

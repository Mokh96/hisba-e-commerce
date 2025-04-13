import { BulkResponse } from 'src/common/types/bulk-response.type';

export type ClientBulkResponse = {
  successes: (BulkResponse['successes'][number] & {
    shippingAddresses: {
      id: number;
      syncId: number;
    }[];
  })[];
  failures: BulkResponse['failures'];
};

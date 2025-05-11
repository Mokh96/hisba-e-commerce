import {  BulkResponseType } from 'src/common/types/bulk-response.type';

export type ClientBulkResponse = {
  successes: (BulkResponseType['successes'][number] & {
    shippingAddresses: {
      id: number;
      syncId: number;
    }[];
  })[];
  failures: BulkResponseType['failures'];
};

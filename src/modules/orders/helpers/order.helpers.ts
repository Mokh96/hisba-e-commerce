import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { BadRequestException } from '@nestjs/common';

export function mergeOrderItems(existingItems: OrderItem[], updatedItems: Partial<OrderItem>[]): OrderItem[] {
  return updatedItems.map((updated) => {
    const original = existingItems.find((item) => item.id === updated.id);
    if (!original) {
      throw new BadRequestException(`Order item with id ${updated.id} not found`);
    }
    return { ...original, ...updated };
  });
}

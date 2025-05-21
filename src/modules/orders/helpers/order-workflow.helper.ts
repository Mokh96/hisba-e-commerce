import { OrderStatus, getOrderStatusesString } from 'src/modules/orders/enums/order-status.enum';
import { Role, RoleString } from 'src/common/enums/roles.enum';
import { ConflictException } from '@nestjs/common';
import { translate } from 'src/startup/i18n/i18n.provider';

type RoleType = Role.COMPANY | Role.CLIENT;

// Workflow for the company
const companyWorkFlow: Map<OrderStatus, OrderStatus[]> = new Map([
  [OrderStatus.NEW, [OrderStatus.CONFIRMED, OrderStatus.CANCELED]],
  [OrderStatus.CONFIRMED, [OrderStatus.COMPLETED, OrderStatus.CANCELED]],
  [OrderStatus.COMPLETED, []],
  [OrderStatus.CANCELED, []],
]);

// Workflow for the client
const clientWorkFlow: Map<OrderStatus, OrderStatus[]> = new Map([[OrderStatus.NEW, [OrderStatus.CANCELED]]]);

const workflows: { [key in RoleType]: Map<OrderStatus, OrderStatus[]> } = {
  [Role.COMPANY]: companyWorkFlow,
  [Role.CLIENT]: clientWorkFlow,
};

/**
 * Checks if a transition from one status to another is allowed in the given workflow.
 *
 * @param role - The role of the user making the transition.
 * @param from - The current status of the task.
 * @param to - The desired status to transition to.
 * @returns `true` if the transition is allowed, otherwise `false`.
 */
export const isTransitionAllowed = (role: Role, from: OrderStatus, to: OrderStatus): boolean => {
  const workflow = workflows[role];
  const allowedTransitions = workflow.get(from);
  return allowedTransitions?.includes(to) || false;
};

/**
 * Changes the status of an order.
 *
 * @param role - The role of the user making the status change.
 * @param currentStatus - The current status of the order.
 * @param newStatus - The desired status to transition to.
 *
 * @throws ConflictException if the transition is not allowed for the given role.
 */
export const changeOrderStatus = (role: Role, currentStatus: OrderStatus, newStatus: OrderStatus): void => {
  if (!isTransitionAllowed(role, currentStatus, newStatus)) {
    throw new ConflictException(
      translate('orders.actions.changeStatus.transitionNotAllowed', {
        args: {
          currentStatus: getOrderStatusesString(currentStatus),
          newStatus: getOrderStatusesString(newStatus),
          role: RoleString[role],
        },
      }),
    );
  }
};

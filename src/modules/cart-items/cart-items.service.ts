import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { EntityManager, FindManyOptions, In, Repository } from 'typeorm';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ClientsService } from 'src/modules/clients/clients.service';
import { Client } from 'src/modules/clients/entities/client.entity';
import { CurrentUserData } from 'src/common/decorators';
import { getEntitiesByIds } from 'src/common/utils/entity.utils';
import { Article } from 'src/modules/articles/entities/article.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto, activeUserData: CurrentUserData) {
    const cartItem = this.cartItemRepository.create({ ...createCartItemDto, clientId: activeUserData.client.id });
    return this.cartItemRepository.save(cartItem);
  }

  async findAll(activeUserData: CurrentUserData) {
    return this.cartItemRepository.findAndCount({
      where: { clientId: activeUserData.client.id },
      relations: {
        article: true,
      },
      select: {
        article: {
          id: true,
          label: true,
          imgPath: true,
        },
      },
    });
  }

  async findOne(id: number, activeUserData: CurrentUserData) {
    return this.cartItemRepository.findOneOrFail({
      where: { id, clientId: activeUserData.client.id },
      relations: {
        article: true,
      },
    });
  }

  /**
   * Retrieves a list of cart items by their IDs.
   *
   * @param cartItemsIds - An array of cart item IDs to retrieve.
   * @param options - Additional options for the find operation.
   * @returns An array of found CartItem entities.
   */
  public async getCartItems(cartItemsIds: CartItem['id'][], options: FindManyOptions<CartItem> = {}) {
    return await getEntitiesByIds(this.cartItemRepository, cartItemsIds, options);
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOneByOrFail({ id });
    this.cartItemRepository.merge(cartItem, updateCartItemDto);
    return await this.cartItemRepository.save(cartItem);
  }

  async remove(id: number) {
    const cartItem = await this.cartItemRepository.findOneByOrFail({ id });
    return this.cartItemRepository.remove(cartItem);
  }
}

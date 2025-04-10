import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ClientsService } from 'src/modules/clients/clients.service';
import { Client } from 'src/modules/clients/entities/client.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly clientService: ClientsService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto, userId: User['id']) {
    const clientId = await this.clientService.getClientIdByUserId(userId);

    const cartItem = this.cartItemRepository.create({ ...createCartItemDto, clientId });
    return this.cartItemRepository.save(cartItem);
  }

  async findAll(userId: User['id']) {
    const clientId = await this.clientService.getClientIdByUserId(userId);
    return this.cartItemRepository.find({
      where: { clientId },
      relations: {
        article: true,
      },
      select: {
        article: {
          id: true,
          label: true,
          defaultImgPath: true,
        },
      },
    });
  }

  async findOne(id: number, userId: User['id']) {
    const clientId = await this.clientService.getClientIdByUserId(userId);
    return this.cartItemRepository.findOneOrFail({
      where: { id, clientId },
      relations: {
        article: true, //todo : check if all article attributes are needed
      },
    });
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOneByOrFail({ id });
    this.cartItemRepository.merge(cartItem, updateCartItemDto);
    return await this.cartItemRepository.save(cartItem);
  }

  async remove(id: number) {
    const product = await this.cartItemRepository.findOneByOrFail({ id });
    return this.cartItemRepository.remove(product);
  }
}

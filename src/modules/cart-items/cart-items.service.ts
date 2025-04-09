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
    private cartItemRepository: Repository<CartItem>,
    private readonly clientService: ClientsService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto, userId: User['id']) {
    const client = await this.clientService.getClientByUserId<Pick<Client, 'id'>>(userId, { select: { id: true } });

    const cartItem = this.cartItemRepository.create({ ...createCartItemDto, clientId: client.id });
    return this.cartItemRepository.save(cartItem);
  }

  findAll() {
    return `This action returns all cartItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}

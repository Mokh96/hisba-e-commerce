import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { ShippingAddress } from './entities/shipping-address.entity';

@Injectable()
export class ShippingAddressesService {
  constructor(@InjectRepository(ShippingAddress) private shippingAddressRepository: Repository<ShippingAddress>) {}
  async create(createShippingAddressDto: CreateShippingAddressDto) {
    return await this.shippingAddressRepository.save(createShippingAddressDto);
  }

  async update(id: number, updateShippingAddressDto: UpdateShippingAddressDto) {
    return await this.shippingAddressRepository.update(id, updateShippingAddressDto);
  }

  async remove(id: number | number[]) {
    return await this.shippingAddressRepository.delete(id);
  }

  async updateClientAddresses(clientId: number, shippingAddresses: UpdateShippingAddressDto[]) {
    const existingAddresses = await this.shippingAddressRepository.findBy({ clientId });

    const existingAddressMap = new Map(existingAddresses.map((addr) => [addr.id, addr]));

    const incomingIds = new Set<number>();

    for (const address of shippingAddresses) {
      if (address.id && existingAddressMap.has(address.id)) {
        // Update existing address
        await this.update(address.id, address);
        incomingIds.add(address.id);
      } else {
        // Create new address
        await this.create({
          address: address.address,
          clientId,
          townId: address.townId,
        });
      }
    }

    // Delete addresses that are no longer in the list
    const toDelete = existingAddresses.filter((a) => !incomingIds.has(a.id)).map((a) => a.id);

    if (toDelete.length > 0) {
      await this.remove(toDelete);
    }

    // Debug/logging
    console.log('Updated addresses:', shippingAddresses);
  }
}

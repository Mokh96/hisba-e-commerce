import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/enums/roles.enum';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(@InjectRepository(Client) private clientRepository: Repository<Client>) {}

  async create(createClientDto: CreateClientDto, user: any) {
    const client = this.clientRepository.create(createClientDto);

    client.creatorId = user.id;
    client.user.roleId = Roles.CLIENT;
    await this.clientRepository.save(client);

    delete client.user.password;
    delete client.user.roleId;

    return client;
  }

  async findAll() {
    const clients = await this.clientRepository.find({
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          username: true,
        },
      },
    });

    return clients;
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOne({
      relations: {
        user: true,
        shippingAddresses: true,
      },
      select: {
        user: {
          id: true,
          username: true,
        },
        shippingAddresses: {
          id: true,
          address: true,
        },
      },
      where: { id },
    });
    if (!client) {
      throw new NotFoundException(`Client '${id}' not found`);
    }
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOneBy({ id });

    this.clientRepository.merge(client, updateClientDto);

    return await this.clientRepository.update(id, client);
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOneByOrFail({ id });
    await this.clientRepository.remove(client);
    return true;
  }
}

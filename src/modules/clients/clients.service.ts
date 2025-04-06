import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/enums/roles.enum';
import { Repository } from 'typeorm';
import { CreateClientDto, CreateClientSyncDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { ClientBulkResponse } from './types/client-bulk-response.type';

@Injectable()
export class ClientsService {
  constructor(@InjectRepository(Client) private clientRepository: Repository<Client>) {}

  async create(createClientDto: CreateClientDto | CreateClientSyncDto) {
    const client = this.clientRepository.create(createClientDto);
    client.user.roleId = Roles.CLIENT;
    await this.clientRepository.save(client);

    delete client.user.password;
    delete client.user.roleId;

    return client;
  }

  async createBulk(createSyncClientDto: CreateClientSyncDto[]) {
    const response: ClientBulkResponse = {
      successes: [],
      failures: [],
    };

    for (const client of createSyncClientDto) {
      try {
        const newClient = await this.create(client);
        response.successes.push({
          id: newClient.id,
          syncId: client.syncId,
          shippingAddresses: newClient.shippingAddresses.map((address) => ({
            id: address.id,
            syncId: address.syncId,
          })),
        });
      } catch (err) {
        response.failures.push({
          syncId: client.syncId,
          errors: [err.sqlMessage],
        });
      }
    }

    return response;
  }

  async findAll() {
    return await this.clientRepository.find({
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

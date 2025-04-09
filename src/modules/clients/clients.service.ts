import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { Roles } from 'src/enums/roles.enum';
import { DeepPartial, Repository } from 'typeorm';
import { CreateClientDto, CreateClientSyncDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { merge } from 'lodash';

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
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const client of createSyncClientDto) {
      try {
        const newClient = await this.create(client);
        response.successes.push(newClient);
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

  async getClientByUserId<T extends DeepPartial<Client>>(
    userId: number,
    options: FindOneOptions<Client> = {},
  ): Promise<T> {
    const requiredOptions: FindOneOptions<Client> = {
      where: { user: { id: userId } },
    } as const;

    const mergedOptions = merge({}, options, requiredOptions);
    return (await this.clientRepository.findOneOrFail(mergedOptions)) as T;
  }

  async getClientIdByUserId(userId: number) {
    const client = await this.getClientByUserId<Pick<Client, 'id'>>(userId, { select: { id: true } });
    return client.id;
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOneByOrFail({ id });
    await this.clientRepository.remove(client);
    return true;
  }
}

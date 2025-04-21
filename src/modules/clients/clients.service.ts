import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/common/enums/roles.enum';
import { DeepPartial, Repository } from 'typeorm';
import { CreateClientDto, CreateClientSyncDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { merge } from 'lodash';
import { UsersService } from 'src/modules/users/users.service';
import { ShippingAddressesService } from 'src/modules/shipping-addresses/shipping-addresses.service';
import { ClientBulkResponse } from 'src/modules/clients/types/client-bulk-response.type';
import { ClientFilterDto } from 'src/modules/clients/dto/client-filter.dto';
import { fromDtoToQuery } from 'src/helpers/function.global';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly usersService: UsersService,
    private readonly shippingAddressService: ShippingAddressesService,
  ) {}

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

  async findMany(filterDto: ClientFilterDto, paginationDto: BasePaginationDto) {
    const filter = fromDtoToQuery(filterDto);

    const [row, count] = await this.clientRepository.findAndCount({
      where: filter,
      skip: paginationDto.offset,
      take: paginationDto.limit,
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

    return {
      count,
      row,
    };
  }

  /**
   * Finds a client by ID, optionally including specified relations and select fields.
   *
   * @param id - The ID of the client to find.
   * @param relations - An array of strings specifying which relations to include in the query. Defaults to ['user', 'shippingAddresses'].
   * @param select - An optional object to specify which fields to select. If not provided, a default selection is used.
   *
   * @throws NotFoundException - If no client with the given ID is found.
   *
   * @returns The client object, including specified relations and select fields.
   */

  async findOne(id: number, relations: string[] = ['user', 'shippingAddresses'], select?: Record<string, any>) {
    // Dynamically build the `select` if not provided
    const dynamicSelect = select || {
      user: {
        id: true,
        username: true,
      },
      shippingAddresses: {
        id: true,
        address: true,
        townId: true,
      },
    };

    const client = await this.clientRepository.findOne({
      relations: relations.reduce((acc, relation) => {
        acc[relation] = true;
        return acc;
      }, {}),
      select: dynamicSelect,
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client '${id}' not found`);
    }
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const { user: clientUser, ...client } = await this.findOne(id, ['user', 'shippingAddresses'], {
      user: { id: true },
    });

    if (!client) {
      throw new NotFoundException(`Client '${id}' not found`);
    }

    const { user, shippingAddresses, ...rest } = updateClientDto;
    // update user if exists
    if (user) {
      await this.usersService.update(clientUser.id, user);
    }

    // update shipping addresses if exist
    if (shippingAddresses) {
      await this.shippingAddressService.updateClientAddresses(client.id, shippingAddresses);
    }

    await this.clientRepository.update(id, rest);

    return await this.findOne(id);
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

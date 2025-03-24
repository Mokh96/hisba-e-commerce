import { Injectable } from '@nestjs/common';
import { UpdateClientDto } from './dto/update-client.dto';
import { DeepPartial, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/enums/roles.enum';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}
  // DeepPartial<Client>
  async create(createClientDto: DeepPartial<Client>, user: any) {
    const client = this.clientRepository.create(createClientDto);

    client.creatorId = user.id;
    client.user.roleId = Roles.CLIENT;
    await this.clientRepository.save(client);

    delete client.user.password;
    return client;
  }

  async findAll() {
    return await this.clientRepository.find();
  }

  async findOne(id: number) {
    return await this.clientRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOneByOrFail({ id });
    this.clientRepository.merge(client, updateClientDto);

    await this.clientRepository.save(client);
    return client;
  }

  async remove(id: number) {
    const client = await this.clientRepository.findOneByOrFail({ id });
    await this.clientRepository.remove(client);
    return true;
  }
}

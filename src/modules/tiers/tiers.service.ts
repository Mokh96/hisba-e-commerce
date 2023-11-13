import { Injectable } from '@nestjs/common';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';
import { DeepPartial, Repository } from 'typeorm';
import { Tier } from './entities/tier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { roles } from 'src/enums/roles.enum';

@Injectable()
export class TiersService {
  constructor(
    @InjectRepository(Tier) private tierRepository: Repository<Tier>,
  ) {}
  // DeepPartial<Tier>
  async create(createTierDto: DeepPartial<Tier>, user: any) {
    const tier = this.tierRepository.create(createTierDto);

    tier.creatorId = user.id;
    tier.user.roleId = roles.TIER;
    await this.tierRepository.save(tier);

    delete tier.user.password;
    return tier;
  }

  async findAll() {
    const tiers = await this.tierRepository.find();
    return tiers;
  }

  async findOne(id: number) {
    const tier = await this.tierRepository.findOneByOrFail({ id });
    return tier;
  }

  async update(id: number, updateTierDto: UpdateTierDto) {
    const tier = await this.tierRepository.findOneByOrFail({ id });
    this.tierRepository.merge(tier, updateTierDto);

    await this.tierRepository.save(tier);
    return tier;
  }

  async remove(id: number) {
    const tier = await this.tierRepository.findOneByOrFail({ id });
    await this.tierRepository.remove(tier);
    return true;
  }
}

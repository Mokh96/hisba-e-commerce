import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entities/family.entity';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
  ) {}

  async create(createFamilyDto: CreateFamilyDto) {
    const family = this.familyRepository.create(createFamilyDto);
    await this.familyRepository.save(family);
    return family;
  }

  async findAll() {
    const families = await this.familyRepository.find();
    return families;
  }

  async findOne(id: number) {
    const family = await this.familyRepository.findOneBy({ id });
    if (!family) throw new NotFoundException('family not found');
    return family;
  }

  async update(id: number, updateFamilyDto: UpdateFamilyDto) {
    const family = await this.findOne(id);
    const updatedFamily = this.familyRepository.merge(family, updateFamilyDto);
    await this.familyRepository.save(updatedFamily);
    return updatedFamily;
  }

  async remove(id: number) {
    const family = await this.findOne(id);
    await this.familyRepository.remove(family);
    return true;
  }
}

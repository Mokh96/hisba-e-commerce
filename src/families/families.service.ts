import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entities/family.entity';
import { Image } from 'src/types/types.global';
import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { checkChildrenRecursive } from 'src/helpers/function.globa';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
  ) {}

  async create(createFamilyDto: CreateFamilyDto, file: Image) {
    const family = this.familyRepository.create(createFamilyDto);
    const newFamily = this.familyRepository.merge(family, {
      imgPath: file.img ? pathToFile(file.img[0]) : null,
    });
    await this.familyRepository.save(newFamily);
    return newFamily;
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

  async update(id: number, updateFamilyDto: UpdateFamilyDto, file: Image) {
    if (updateFamilyDto.parentId) {
      if (updateFamilyDto.parentId === id)
        throw new BadRequestException(
          'parent Id must be not children of this brand',
        );
      // TODO: edit message of this error
      if (
        checkChildrenRecursive(
          id,
          await this.findAll(),
          updateFamilyDto.parentId,
        ) === false
      )
        throw new BadRequestException(
          'parent Id must be not children of this brand',
        );
    }
    const family = await this.findOne(id);
    const oldPath = file.img ? family.imgPath : null;

    const updatedFamily = this.familyRepository.merge(family, updateFamilyDto, {
      imgPath: file.img ? pathToFile(file.img[0]) : family.imgPath,
    });
    await this.familyRepository.save(updatedFamily);
    if (file.img) removeFileIfExist(oldPath);

    return updatedFamily;
  }

  async remove(id: number) {
    const family = await this.findOne(id);
    await this.familyRepository.remove(family);
    return true;
  }
}

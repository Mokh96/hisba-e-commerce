import { Gallery } from 'src/common-entities/gallery.common.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductGallery extends Gallery {}

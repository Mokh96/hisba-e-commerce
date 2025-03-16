import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class ClientCommon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  fistName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  address: string;

  @Column({ name: 'birth_date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  note: string;

  @Column({ length: 13 })
  phone: string;

  @Column({ length: 13, nullable: true })
  mobile: string;

  @Column({ nullable: true })
  fax: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  rc: string;

  @Column({ nullable: true })
  agr: string;

  @Column({ nullable: true })
  ai: string;

  @Column({ nullable: true })
  activity: string;

  @Column({ name: 'legal_form', nullable: true })
  legalForm: string;

  @Column({ name: 'id_fiscal', nullable: true })
  idFiscal: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}

export class ClientSync extends ClientCommon {
  @Column({ name: 'sync_id', nullable: true })
  @Index('sync_id', { unique: true })
  syncId: number;
}

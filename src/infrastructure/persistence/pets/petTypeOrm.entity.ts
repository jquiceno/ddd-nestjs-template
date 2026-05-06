import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PetAddressValue } from '@context/pets/domain/entities/pet.entity';

@Entity({ name: 'pets' })
export class PetTypeOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'varchar', length: 100 })
  breed: string;

  @Column({ type: 'simple-json', nullable: true })
  address: PetAddressValue | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

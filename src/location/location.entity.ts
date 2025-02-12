import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToMany,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';

@Entity()
@Unique(['country', 'city'])
@Index('idx_country_city', ['country', 'city'])
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'float' })
  temperatureCelsius: number;

  @Column({ type: 'float' })
  temperatureFahrenheit: number;

  @Column({ type: 'float' })
  windSpeed: number;

  @Column({ type: 'float' })
  humidity: number;

  @ManyToMany(() => User, (user) => user.locations, { onDelete: 'CASCADE' })
  users?: User[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  constructor() {
    this.id = uuidv4();
  }
}

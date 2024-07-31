import { Product } from '../../products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: string;

  @Column('text', {
    array: true,
    default: [],
  })
  roles: string[];

  // relaciones
  @OneToMany(() => Product, (producto) => producto.user)
  product: Product;

  // hooks
  @BeforeInsert()
  setEmailLowerCase() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  updateEmailLowerCase() {
    this.setEmailLowerCase();
  }
}

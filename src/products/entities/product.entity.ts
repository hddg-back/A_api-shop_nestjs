import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HelpersService } from 'src/common/helpers/helpers.service';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'products',
})
export class Product {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    description: 'Producto id',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Camisa de Tales',
    description: 'Titulo / nombre del producto',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 134.9,
    description: 'precio del producto',
    default: null,
  })
  @Column('float', {
    nullable: true,
  })
  price: number;

  @ApiProperty({
    example:
      'Esta es una camisa hecha nen tal material con tal cosa y la fabrico son tales',
    description: 'descripción del producto',
  })
  @Column('text', {
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'camisa_de_tales',
    description: 'para SEO de paths (friendly paths)',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
    nullable: true,
  })
  slug: string;

  @ApiProperty({
    example: 5,
    description: 'cantidad disponibele en stock de un producto',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Producto sizes (tallas)',
    type: Array,
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender (Genero {unisex, hombre, mujer, etc...})',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: 'camisa, ropa, ropa hombres',
    description: 'etiquetas',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // relaciones
  @ApiProperty({
    example: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
    description: 'array de imagenes del producto id',
    uniqueItems: true,
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product)
  user: User;

  // hooks
  @BeforeInsert()
  checkSlug() {
    this.slug = HelpersService.removeSpecialCharacters(
      !this.slug ? this.title : this.slug,
    )
      .toLocaleLowerCase()
      .replaceAll(' ', '_');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = HelpersService.removeSpecialCharacters(this.slug)
      .toLocaleLowerCase()
      .replaceAll(' ', '_');
  }
}

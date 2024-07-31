import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../../src/common/dtos/pagination-dto';
import { ProductImage } from './entities/product-image.entity';
import { User } from '../auth/entities/user.entity';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepositori: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}
  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...restProduct } = createProductDto;

      const product = this.productRepository.create({
        ...restProduct,
        images: images.map((image) =>
          this.productImageRepositori.create({ url: image }),
        ),
        user,
      });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDtto: PaginationDto) {
    const { limit, offset } = paginationDtto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map(({ url }) => url),
    }));
  }

  async findOne(termino: string) {
    let product: Product;

    if (isUUID(termino))
      product = await this.productRepository.findOneBy({ id: termino });
    else {
      const queryBuild = this.productRepository.createQueryBuilder('prod');
      product = await queryBuild
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: termino.toUpperCase(),
          slug: termino.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) throw new NotFoundException('Producto no encontrado');

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return { ...rest, images: images.map(({ url }) => url) };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...restProduct } = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...restProduct,
    });

    if (!product)
      throw new NotFoundException(`Producto con id: ${id} no encontrado`);

    // query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepositori.create({ url: image }),
        );
      }

      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
  // TODO: validar que solo se pueda ejecutar en ambiente de desarrollo
  async deleteAll() {
    const query = this.productRepository.createQueryBuilder('productos');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, check logs');
  }
}

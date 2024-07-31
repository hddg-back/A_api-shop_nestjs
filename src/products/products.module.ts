import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HelpersModule } from 'src/common/helpers/helpers.module';
import { ProductImage } from './entities/product-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    HelpersModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
    AuthModule,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}

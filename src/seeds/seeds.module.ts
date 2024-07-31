import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedsController],
  providers: [SeedsService],
  imports: [ProductsModule, AuthModule],
})
export class SeedsModule {}

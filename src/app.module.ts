import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { HelpersService } from './common/helpers/helpers.service';
import { HelpersModule } from './common/helpers/helpers.module';
import { CommonModule } from './common/common.module';
import { SeedsModule } from './seeds/seeds.module';
import { FilesModule } from './files/files.module';
import { ConfigEnv } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validations';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ConfigEnv],
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.PG_DB,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    HelpersModule,
    CommonModule,
    SeedsModule,
    FilesModule,
    AuthModule,
    MessagesWsModule,
  ],
  controllers: [],
  providers: [HelpersService],
  exports: [ConfigModule],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedsService {
  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async executeSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertProducts(adminUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productService.deleteAll();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertProducts(user: User) {
    await this.productService.deleteAll();
    const products = initialData.products;

    const insertProimes = products.map((product) =>
      this.productService.create(product, user),
    );
    await Promise.all(insertProimes);
    return true;
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtServise: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...restUserData } = createUserDto;

      const usuario = this.authRepository.create({
        ...restUserData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.authRepository.save(usuario);
      return {
        ...usuario,
        token: this.getJwToken({ id: usuario.id }),
        password: undefined,
      };
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user = await this.authRepository.findOne({
        select: { email: true, password: true, id: true },
        where: { email },
      });
      if (!user) throw new UnauthorizedException('Credenciales invalidas (e)');

      const isMatchedPassword = bcrypt.compareSync(password, user.password);
      if (!isMatchedPassword)
        throw new UnauthorizedException('Credenciales invalidas (p)');

      return {
        ...user,
        token: this.getJwToken({ id: user.id }),
        password: undefined,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async checkUserStatus(user: User) {
    return {
      ...user,
      token: this.getJwToken({ id: user.id }),
    };
  }

  private getJwToken(payload: JwtPayload) {
    return this.jwtServise.sign(payload);
  }
  private handleErrors(error: any) {
    if (error?.code === '23505') throw new BadRequestException(error.detail);
    if (error?.status === 401) throw new BadRequestException(error.message);
    this.logger.log(error);
    throw new InternalServerErrorException('Check server logs');
  }
}

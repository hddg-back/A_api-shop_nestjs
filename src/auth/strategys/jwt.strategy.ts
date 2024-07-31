import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * La función `validate` en TypeScript valida un payload JWT comprobando si el usuario asociado
   * con el email en el payload existe y está activo.
   * @param {JwtPayload} payload - El parámetro `payload` en la función `validate` es de tipo
   * `JwtPayload`, que probablemente contiene información extraída de un JSON Web Token (JWT).
   * En este caso, usted está específicamente interesado en la propiedad `email` del `payload`.
   * Este email es utilizado para encontrar un usuario, si el usuario esta inactivo o no existe;
   * lanza error de lo contrario retorna el usuario
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    if (!id) throw new UnauthorizedException('Invalid token idF');

    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new UnauthorizedException('Invalid Token');
    if (!user.isActive) throw new UnauthorizedException('Inactive user');

    return user;
  }
}

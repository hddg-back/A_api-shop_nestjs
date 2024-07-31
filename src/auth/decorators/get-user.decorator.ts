import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

const customCalbackParamDecorator = (data: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req?.user;
  if (!user) throw new InternalServerErrorException('request-user not found');

  if (!data) return user;
  return user[data];
};

export const GetUser = createParamDecorator(customCalbackParamDecorator);

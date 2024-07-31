import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const customCallbackParamDecorator = (data: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req?.rawHeaders;
};

export const RawHeaders = createParamDecorator(customCallbackParamDecorator);

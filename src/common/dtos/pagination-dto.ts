import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'cuantos registros deseas?',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'cuantos registros deseas saltarte (paginacion)',
  })
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  offset?: number;
}

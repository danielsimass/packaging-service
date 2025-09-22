import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderDto } from './order.dto';

export class PackagingRequestDto {
  @ApiProperty({
    description: 'Lista de pedidos para processar',
    type: [OrderDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  pedidos: OrderDto[];
}

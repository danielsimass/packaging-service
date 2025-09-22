import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class OrderDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  pedido_id: number;

  @ApiProperty({
    description: 'Lista de produtos do pedido',
    type: [ProductDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  produtos: ProductDto[];
}

import {
  IsNumber,
  IsPositive,
  Min,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DimensoesDto {
  @ApiProperty({
    description: 'Altura do produto em centímetros',
    example: 10,
    minimum: 0.1,
  })
  @IsNumber()
  @IsPositive()
  @Min(0.1)
  altura: number;

  @ApiProperty({
    description: 'Largura do produto em centímetros',
    example: 15,
    minimum: 0.1,
  })
  @IsNumber()
  @IsPositive()
  @Min(0.1)
  largura: number;

  @ApiProperty({
    description: 'Comprimento do produto em centímetros',
    example: 20,
    minimum: 0.1,
  })
  @IsNumber()
  @IsPositive()
  @Min(0.1)
  comprimento: number;
}

export class ProductDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 'PS5',
  })
  @IsString()
  @IsNotEmpty()
  produto_id: string;

  @ApiProperty({
    description: 'Dimensões do produto',
    type: DimensoesDto,
  })
  @ValidateNested()
  @Type(() => DimensoesDto)
  dimensoes: DimensoesDto;
}

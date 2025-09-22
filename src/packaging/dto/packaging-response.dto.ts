import { ApiProperty } from '@nestjs/swagger';

export class PackedBoxDto {
  @ApiProperty({
    description: 'ID da caixa utilizada (null se não couber em nenhuma caixa)',
    example: 'Caixa 1',
    nullable: true,
  })
  caixa_id: string | null;

  @ApiProperty({
    description: 'Lista de IDs dos produtos empacotados nesta caixa',
    type: [String],
    example: ['PS5', 'Volante'],
  })
  produtos: string[];

  @ApiProperty({
    description: 'Observação sobre o empacotamento',
    example: 'Produto não cabe em nenhuma caixa disponível.',
    required: false,
  })
  observacao?: string;
}

export class PackedOrderDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: 1,
  })
  pedido_id: number;

  @ApiProperty({
    description: 'Caixas utilizadas para empacotar o pedido',
    type: [PackedBoxDto],
  })
  caixas: PackedBoxDto[];
}

export class PackagingResponseDto {
  @ApiProperty({
    description: 'Lista de pedidos processados',
    type: [PackedOrderDto],
  })
  pedidos: PackedOrderDto[];
}
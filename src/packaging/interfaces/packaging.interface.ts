export interface Dimensions {
  altura: number;
  largura: number;
  comprimento: number;
}

export interface Product {
  produto_id: string;
  dimensoes: Dimensions;
}

export interface Box {
  type: string;
  dimensions: Dimensions;
}

export interface PackedBox {
  caixa_id: string | null;
  produtos: string[];
  observacao?: string;
}

export interface PackedOrder {
  pedido_id: number;
  caixas: PackedBox[];
}

export interface PackagingResult {
  pedidos: PackedOrder[];
}

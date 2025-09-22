import { Injectable, Logger } from '@nestjs/common';
import {
  PackedOrder,
  PackagingResult,
  PackedBox,
  Box,
  Product,
} from './interfaces/packaging.interface';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class PackagingService {
  private readonly logger = new Logger(PackagingService.name);
  private readonly availableBoxes: Box[] = [
    {
      type: 'Caixa 1',
      dimensions: { altura: 30, largura: 40, comprimento: 80 },
    },
    {
      type: 'Caixa 2',
      dimensions: { altura: 50, largura: 50, comprimento: 40 },
    },
    {
      type: 'Caixa 3',
      dimensions: { altura: 50, largura: 80, comprimento: 60 },
    },
  ];

  processOrders(orders: OrderDto[]): PackagingResult {
    this.logger.log(`Iniciando processamento de ${orders.length} pedido(s)`);
    const startTime = Date.now();
    
    const packedOrders: PackedOrder[] = [];
    for (const order of orders) {
      this.logger.log(`Processando pedido ${order.pedido_id} com ${order.produtos.length} produto(s)`);
      const packedOrder = this.packOrder(order);
      packedOrders.push(packedOrder);
    }
    
    const processingTime = Date.now() - startTime;
    this.logger.log(`Processamento concluído em ${processingTime}ms para ${orders.length} pedido(s)`);
    
    return {
      pedidos: packedOrders,
    };
  }

  private packOrder(order: OrderDto): PackedOrder {
    const products = order.produtos.map((produto) => ({
      produto_id: produto.produto_id,
      dimensoes: produto.dimensoes,
    }));

    this.logger.debug(`Iniciando empacotamento do pedido ${order.pedido_id} com ${products.length} produtos`);
    
    const packedBoxes: PackedBox[] = [];
    const remainingProducts = [...products];
    let iteration = 0;

    while (remainingProducts.length > 0) {
      iteration++;
      this.logger.debug(`Iteração ${iteration}: ${remainingProducts.length} produtos restantes`);
      
      const bestCombination =
        this.findBestProductCombination(remainingProducts);

      if (bestCombination) {
        const { box, fittedProducts } = bestCombination;
        this.logger.debug(`Melhor combinação encontrada: ${fittedProducts.length} produtos na ${box.type}`);
        
        packedBoxes.push({
          caixa_id: box.type,
          produtos: fittedProducts.map((p) => p.produto_id),
        });
        
        fittedProducts.forEach((fitted) => {
          const index = remainingProducts.findIndex(
            (p) => p.produto_id === fitted.produto_id,
          );
          if (index !== -1) {
            remainingProducts.splice(index, 1);
          }
        });
      } else {
        const product = remainingProducts.shift();
        if (product) {
          this.logger.warn(`Produto ${product.produto_id} não cabe em nenhuma caixa disponível`);
          packedBoxes.push({
            caixa_id: null,
            produtos: [product.produto_id],
            observacao: 'Produto não cabe em nenhuma caixa disponível.',
          });
        }
      }
    }

    this.logger.log(`Pedido ${order.pedido_id} empacotado em ${packedBoxes.length} caixa(s) após ${iteration} iteração(ões)`);
    
    return {
      pedido_id: order.pedido_id,
      caixas: packedBoxes,
    };
  }

  private findBestProductCombination(
    products: Product[],
  ): { box: Box; fittedProducts: Product[] } | null {
    this.logger.debug(`Buscando melhor combinação para ${products.length} produtos`);
    
    let bestCombination: { box: Box; fittedProducts: Product[] } | null = null;
    const sortedBoxes = [...this.availableBoxes].sort((a, b) => {
      const volumeA =
        a.dimensions.altura * a.dimensions.largura * a.dimensions.comprimento;
      const volumeB =
        b.dimensions.altura * b.dimensions.largura * b.dimensions.comprimento;
      return volumeA - volumeB;
    });

    for (const box of sortedBoxes) {
      const fittedProducts = this.packProductsInBox(
        products,
        box,
      ).fittedProducts;

      this.logger.debug(`Testando ${box.type}: ${fittedProducts.length} produtos couberam`);

      if (fittedProducts.length > 0) {
        if (
          fittedProducts.length >
            (bestCombination?.fittedProducts.length || 0) ||
          (fittedProducts.length ===
            (bestCombination?.fittedProducts.length || 0) &&
            this.getBoxVolume(box) <
              (bestCombination
                ? this.getBoxVolume(bestCombination.box)
                : Infinity))
        ) {
          this.logger.debug(`Nova melhor combinação: ${box.type} com ${fittedProducts.length} produtos`);
          bestCombination = { box, fittedProducts };
        }
      }
    }

    if (bestCombination) {
      this.logger.debug(`Melhor combinação final: ${bestCombination.box.type} com ${bestCombination.fittedProducts.length} produtos`);
    } else {
      this.logger.debug('Nenhuma combinação válida encontrada');
    }

    return bestCombination;
  }

  private packProductsInBox(
    products: Product[],
    box: Box,
  ): { fittedProducts: Product[] } {
    this.logger.debug(`Empacotando ${products.length} produtos na ${box.type}`);
    
    const fittedProducts: Product[] = [];
    const boxVolume =
      box.dimensions.altura *
      box.dimensions.largura *
      box.dimensions.comprimento;
    let usedVolume = 0;
    
    const sortedProducts = [...products].sort((a, b) => {
      const volumeA =
        a.dimensoes.altura * a.dimensoes.largura * a.dimensoes.comprimento;
      const volumeB =
        b.dimensoes.altura * b.dimensoes.largura * b.dimensoes.comprimento;
      return volumeB - volumeA;
    });

    this.logger.debug(`Produtos ordenados por volume (maior primeiro): ${sortedProducts.map(p => p.produto_id).join(', ')}`);

    for (const product of sortedProducts) {
      const productVolume = product.dimensoes.altura * product.dimensoes.largura * product.dimensoes.comprimento;
      
      if (
        this.canFitProduct(product, box) &&
        this.canFitInRemainingSpace(product, usedVolume, boxVolume)
      ) {
        this.logger.debug(`Produto ${product.produto_id} (${productVolume}cm³) adicionado à ${box.type}`);
        fittedProducts.push(product);
        usedVolume += productVolume;
      } else {
        this.logger.debug(`Produto ${product.produto_id} (${productVolume}cm³) não cabe na ${box.type}`);
      }
    }

    const utilizationPercentage = ((usedVolume / boxVolume) * 100).toFixed(1);
    this.logger.debug(`${box.type}: ${fittedProducts.length} produtos, ${usedVolume}cm³/${boxVolume}cm³ (${utilizationPercentage}% utilização)`);

    return { fittedProducts };
  }

  private canFitProduct(product: Product, box: Box): boolean {
    const productDimensions = [
      {
        altura: product.dimensoes.altura,
        largura: product.dimensoes.largura,
        comprimento: product.dimensoes.comprimento,
      },
      {
        altura: product.dimensoes.altura,
        largura: product.dimensoes.comprimento,
        comprimento: product.dimensoes.largura,
      },
      {
        altura: product.dimensoes.largura,
        largura: product.dimensoes.altura,
        comprimento: product.dimensoes.comprimento,
      },
      {
        altura: product.dimensoes.largura,
        largura: product.dimensoes.comprimento,
        comprimento: product.dimensoes.altura,
      },
      {
        altura: product.dimensoes.comprimento,
        largura: product.dimensoes.altura,
        comprimento: product.dimensoes.largura,
      },
      {
        altura: product.dimensoes.comprimento,
        largura: product.dimensoes.largura,
        comprimento: product.dimensoes.altura,
      },
    ];

    return productDimensions.some(
      (dims) =>
        dims.altura <= box.dimensions.altura &&
        dims.largura <= box.dimensions.largura &&
        dims.comprimento <= box.dimensions.comprimento,
    );
  }

  private canFitInRemainingSpace(
    product: Product,
    usedVolume: number,
    boxVolume: number,
  ): boolean {
    const productVolume =
      product.dimensoes.altura *
      product.dimensoes.largura *
      product.dimensoes.comprimento;
    return usedVolume + productVolume <= boxVolume;
  }

  private getBoxVolume(box: Box): number {
    return (
      box.dimensions.altura *
      box.dimensions.largura *
      box.dimensions.comprimento
    );
  }
}

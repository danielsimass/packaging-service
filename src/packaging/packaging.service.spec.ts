import { Test, TestingModule } from '@nestjs/testing';
import { PackagingService } from './packaging.service';
import { OrderDto } from './dto/order.dto';

describe('PackagingService', () => {
  let service: PackagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagingService],
    }).compile();

    service = module.get<PackagingService>(PackagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processOrders', () => {
    it('should process a single order with one product', async () => {
      const orders: OrderDto[] = [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'PS5',
              dimensoes: {
                altura: 40,
                largura: 10,
                comprimento: 25,
              },
            },
          ],
        },
      ];

      const result = await service.processOrders(orders);

      expect(result).toBeDefined();
      expect(result.pedidos).toHaveLength(1);
      expect(result.pedidos[0].pedido_id).toBe(1);
      expect(result.pedidos[0].caixas).toHaveLength(1);
      expect(result.pedidos[0].caixas[0].produtos).toContain('PS5');
      expect(result.pedidos[0].caixas[0].caixa_id).toBeTruthy();
    });

    it('should process multiple orders', async () => {
      const orders: OrderDto[] = [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'PS5',
              dimensoes: {
                altura: 40,
                largura: 10,
                comprimento: 25,
              },
            },
          ],
        },
        {
          pedido_id: 2,
          produtos: [
            {
              produto_id: 'Volante',
              dimensoes: {
                altura: 40,
                largura: 30,
                comprimento: 30,
              },
            },
          ],
        },
      ];

      const result = await service.processOrders(orders);

      expect(result).toBeDefined();
      expect(result.pedidos).toHaveLength(2);
      expect(result.pedidos[0].pedido_id).toBe(1);
      expect(result.pedidos[1].pedido_id).toBe(2);
    });

    it('should handle products that do not fit in any box', async () => {
      const orders: OrderDto[] = [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'Cadeira Gamer',
              dimensoes: {
                altura: 120,
                largura: 60,
                comprimento: 70,
              },
            },
          ],
        },
      ];

      const result = await service.processOrders(orders);

      expect(result).toBeDefined();
      expect(result.pedidos).toHaveLength(1);
      expect(result.pedidos[0].caixas).toHaveLength(1);
      expect(result.pedidos[0].caixas[0].caixa_id).toBeNull();
      expect(result.pedidos[0].caixas[0].observacao).toContain('não cabe em nenhuma caixa');
    });
  });
});
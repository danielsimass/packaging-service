import { Test, TestingModule } from '@nestjs/testing';
import { PackagingController } from './packaging.controller';
import { PackagingService } from './packaging.service';
import { PackagingRequestDto } from './dto/packaging-request.dto';

describe('PackagingController', () => {
  let controller: PackagingController;
  let service: PackagingService;

  const mockPackagingService = {
    processOrders: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagingController],
      providers: [
        {
          provide: PackagingService,
          useValue: mockPackagingService,
        },
      ],
    }).compile();

    controller = module.get<PackagingController>(PackagingController);
    service = module.get<PackagingService>(PackagingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processOrders', () => {
    it('should process orders successfully', async () => {
      const request: PackagingRequestDto = {
        pedidos: [
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
        ],
      };

      const expectedResult = {
        pedidos: [
          {
            pedido_id: 1,
            caixas: [
              {
                caixa_id: 'Caixa 2',
                produtos: ['PS5'],
              },
            ],
          },
        ],
      };

      mockPackagingService.processOrders.mockResolvedValue(expectedResult);

      const result = controller.processOrders(request);

      expect(service.processOrders).toHaveBeenCalledWith(request.pedidos);
      expect(result).toEqual(expectedResult);
    });

    it('should handle empty orders array', () => {
      const request: PackagingRequestDto = {
        pedidos: [],
      };

      const expectedResult = {
        pedidos: [],
      };

      mockPackagingService.processOrders.mockResolvedValue(expectedResult);

      const result = controller.processOrders(request);

      expect(service.processOrders).toHaveBeenCalledWith([]);
      expect(result).toEqual(expectedResult);
    });
  });
});

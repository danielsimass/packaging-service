import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PackagingController (e2e)', () => {
  let app: INestApplication;
  const apiKey = 'pk_test_abcdef1234567890';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/packaging/process (POST)', () => {
    it('should process a valid order', () => {
      const orderData = {
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

      return request(app.getHttpServer())
        .post('/packaging/process')
        .set('X-API-Key', apiKey)
        .send(orderData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('pedidos');
          expect(res.body.pedidos).toHaveLength(1);
          expect(res.body.pedidos[0]).toHaveProperty('pedido_id', 1);
          expect(res.body.pedidos[0]).toHaveProperty('caixas');
          expect(res.body.pedidos[0].caixas).toHaveLength(1);
          expect(res.body.pedidos[0].caixas[0]).toHaveProperty('caixa_id');
          expect(res.body.pedidos[0].caixas[0]).toHaveProperty('produtos');
          expect(res.body.pedidos[0].caixas[0].produtos).toContain('PS5');
        });
    });

    it('should handle multiple orders', () => {
      const multipleOrdersData = {
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
        ],
      };

      return request(app.getHttpServer())
        .post('/packaging/process')
        .set('X-API-Key', apiKey)
        .send(multipleOrdersData)
        .expect(200)
        .expect((res) => {
          expect(res.body.pedidos).toHaveLength(2);
          expect(res.body.pedidos[0].pedido_id).toBe(1);
          expect(res.body.pedidos[1].pedido_id).toBe(2);
        });
    });

    it('should handle products that do not fit in any box', () => {
      const orderData = {
        pedidos: [
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
        ],
      };

      return request(app.getHttpServer())
        .post('/packaging/process')
        .set('X-API-Key', apiKey)
        .send(orderData)
        .expect(200)
        .expect((res) => {
          expect(res.body.pedidos[0].caixas[0].caixa_id).toBeNull();
          expect(res.body.pedidos[0].caixas[0].observacao).toContain('não cabe em nenhuma caixa');
        });
    });
  });

  describe('/packaging/health (POST)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .post('/packaging/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('service', 'packaging-api');
        });
    });
  });
});
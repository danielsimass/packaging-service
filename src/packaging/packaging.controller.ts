import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { PackagingService } from './packaging.service';
import { PackagingRequestDto } from './dto/packaging-request.dto';
import { PackagingResponseDto } from './dto/packaging-response.dto';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';
import { Public } from '../auth/public.decorator';

@ApiTags('packaging')
@Controller('packaging')
@UseGuards(ApiKeyAuthGuard)
@ApiSecurity('ApiKey')
export class PackagingController {
  private readonly logger = new Logger(PackagingController.name);
  
  constructor(private readonly packagingService: PackagingService) {}

  @Post('process')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Processa pedidos e determina o melhor empacotamento',
    description:
      'Recebe uma lista de pedidos com produtos e suas dimensões, retornando a melhor forma de empacotá-los usando as caixas disponíveis.',
  })
  @ApiBody({
    type: PackagingRequestDto,
    description: 'Lista de pedidos para processar',
    examples: {
      example1: {
        summary: 'Exemplo de entrada',
        value: {
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
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Pedidos processados com sucesso',
    type: PackagingResponseDto,
    examples: {
      example1: {
        summary: 'Exemplo de resposta',
        value: {
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
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  processOrders(@Body() request: PackagingRequestDto): PackagingResponseDto {
    this.logger.log(`Recebida requisição de processamento com ${request.pedidos.length} pedido(s)`);
    const startTime = Date.now();
    
    try {
      const result = this.packagingService.processOrders(request.pedidos);
      const processingTime = Date.now() - startTime;
      
      this.logger.log(`Requisição processada com sucesso em ${processingTime}ms`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao processar requisição: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('health')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary: 'Verifica a saúde da API',
    description:
      'Endpoint simples para verificar se a API está funcionando corretamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'API funcionando corretamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        service: { type: 'string', example: 'packaging-api' },
      },
    },
  })
  healthCheck() {
    this.logger.debug('Health check solicitado');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'packaging-api',
    };
  }
}

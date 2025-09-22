import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  private readonly logger = new Logger(ApiKeyStrategy.name);

  constructor(private configService: ConfigService) {
    super();
  }

  validate(request: Request): any {
    const apiKey = this.extractApiKey(request);
    if (!apiKey) {
      this.logger.warn('Tentativa de acesso sem API Key');
      throw new UnauthorizedException('API Key é obrigatória');
    }
    
    const validApiKey = this.configService.get<string>('API_KEY');
    if (!validApiKey) {
      this.logger.error('API Key não configurada no servidor');
      throw new UnauthorizedException('API Key não configurada no servidor');
    }
    
    if (apiKey !== validApiKey) {
      this.logger.warn(`Tentativa de acesso com API Key inválida: ${apiKey.substring(0, 8)}...`);
      throw new UnauthorizedException('API Key inválida');
    }
    
    this.logger.debug('API Key validada com sucesso');
    return { apiKey, isValid: true };
  }

  private extractApiKey(request: Request): string | null {
    const headers = request?.headers as unknown as Record<
      string,
      string | string[] | undefined
    >;
    const headerKey = headers?.['x-api-key'];
    if (typeof headerKey === 'string') {
      return headerKey;
    }
    return null;
  }
}

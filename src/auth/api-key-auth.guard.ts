import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyAuthGuard extends AuthGuard('api-key') {
  private readonly logger = new Logger(ApiKeyAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      this.logger.debug(`Endpoint público acessado: ${request.method} ${request.url}`);
      return true;
    }
    
    this.logger.debug(`Verificando autenticação para: ${request.method} ${request.url}`);
    return super.canActivate(context);
  }
}

import { applyDecorators, UseInterceptors, SetMetadata, Inject, mixin, Type, ExecutionContext, CallHandler, NestInterceptor } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';

export function UseInjectedInterceptor(token: symbol) {
  class InjectedInterceptor implements NestInterceptor {
    private interceptor: NestInterceptor;

    constructor(private readonly moduleRef: ModuleRef) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      if (!this.interceptor) {
        //@ts-ignore
        this.interceptor = await this.moduleRef.resolve<NestInterceptor>(token, context.getClass(), { strict: false });
      }
      return this.interceptor.intercept(context, next);
    }
  }

  const mixedInterceptor = mixin(InjectedInterceptor);

  return applyDecorators(UseInterceptors(mixedInterceptor));
}

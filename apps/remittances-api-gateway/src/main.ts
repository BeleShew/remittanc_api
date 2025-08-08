import { NestFactory } from '@nestjs/core';
import { RemittancesApiGatewayModule } from './remittances-api-gateway.module';
import { OperationResultInterceptor, OperationResultExceptionFilter } from '../../../libs/common/src/operation.result.interceptor';
async function bootstrap() {
    const app = await NestFactory.create(RemittancesApiGatewayModule)
    app.useGlobalInterceptors(new OperationResultInterceptor());
    app.useGlobalFilters(new OperationResultExceptionFilter());
    await app.listen(3011);
}
bootstrap();

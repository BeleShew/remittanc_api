import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransactionsModule } from './transactions.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransactionsModule,
    {
      transport: Transport.TCP,
      options: { port: 3012 }
    }
  );

  await app.listen();
}
bootstrap();
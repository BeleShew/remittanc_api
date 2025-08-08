import { Controller, Get } from '@nestjs/common';
import { RemittancesApiGatewayService } from './remittances-api-gateway.service';

@Controller()
export class RemittancesApiGatewayController {
  constructor(private readonly remittancesApiGatewayService: RemittancesApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.remittancesApiGatewayService.getHello();
  }
}

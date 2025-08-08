import { Test, TestingModule } from '@nestjs/testing';
import { RemittancesApiGatewayController } from './remittances-api-gateway.controller';
import { RemittancesApiGatewayService } from './remittances-api-gateway.service';

describe('RemittancesApiGatewayController', () => {
  let remittancesApiGatewayController: RemittancesApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RemittancesApiGatewayController],
      providers: [RemittancesApiGatewayService],
    }).compile();

    remittancesApiGatewayController = app.get<RemittancesApiGatewayController>(RemittancesApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(remittancesApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "OK!"', () => {
      expect(appController.health()).toBe('OK!');
    });

    describe('AppController', () => {
      let appController: AppController;
      let appService: AppService;

      beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
          controllers: [AppController],
          providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
        appService = app.get<AppService>(AppService);
      });

      describe('root', () => {
        it('should return "OK!"', () => {
          expect(appController.health()).toBe('OK!');
        });

        it('should return health status', () => {
          const healthStatus = 'Healthy';
          jest.spyOn(appService, 'health').mockImplementation(() => healthStatus);

          expect(appController.health()).toBe(healthStatus);
        });
      });
    });
  });
});

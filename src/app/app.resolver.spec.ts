import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let resolver: AppResolver;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppResolver,
        {
          provide: AppService,
          useValue: {
            health: jest.fn().mockReturnValue('OK'),
          },
        },
      ],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('health', () => {
    it('should return health status', () => {
      expect(resolver.health()).toBe('OK');
      expect(service.health).toHaveBeenCalled();
    });
  });
});

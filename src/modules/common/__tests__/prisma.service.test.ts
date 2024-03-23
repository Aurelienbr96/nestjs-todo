import { PrismaService } from '../prisma.service';

const mockConnect = jest.fn();

jest.mock('@prisma/client', () => ({
  ...jest.requireActual('@prisma/client'),
  PrismaClient: class MockPrismaClient {
    $connect() {
      mockConnect();
    }

    $on(_: string, cb: () => void) {
      cb();
    }
  },
}));

describe('prismaService', () => {
  it('should call connect when app init', () => {
    const service = new PrismaService();
    service.onModuleInit();
    expect(mockConnect).toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it('Should close when app exit', () => {
    const mockApp: any = { close: jest.fn() };
    const service = new PrismaService();
    service.enableShutdownHooks(mockApp);
    expect(mockApp.close).toHaveBeenCalled();
  });
});

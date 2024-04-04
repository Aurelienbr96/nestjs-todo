/* eslint-disable no-global-assign */
import { PrismaService } from '../prisma.service';

const mockConnect = jest.fn();

jest.mock('@prisma/client', () => ({
  ...jest.requireActual('@prisma/client'),
  PrismaClient: class MockPrismaClient {
    $connect() {
      mockConnect();
    }
  },
}));

describe('prismaService', () => {
  const originalProcess = process;
  beforeEach(() => {
    jest.resetModules();
    process = {
      ...originalProcess,
      on: jest.fn((_: string, cb: () => void) => {
        cb();
      }) as any,
    };
  });
  afterEach(() => {
    process = originalProcess;
  });
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

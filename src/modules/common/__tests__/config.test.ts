import { ConfigService } from '../config.service';

describe('configService', () => {
  const configService = new ConfigService();
  process.env = {
    NODE_ENV: 'staging',
    PORT: '2000',
  };

  it('should return a key', () => {
    expect(configService.get('NODE_ENV')).toEqual('staging');
  });

  it('should return a number', () => {
    expect(configService.getNumber('PORT')).toEqual(2000);
  });
});

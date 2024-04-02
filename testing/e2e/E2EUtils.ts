import { Config, ConfigService } from '../../src/modules';

const config = new ConfigService();

export class E2EUtils {
  static get server() {
    return `http://localhost:${config.get(Config.Port)}`;
  }
}

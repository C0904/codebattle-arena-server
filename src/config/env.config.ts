import * as path from 'path';

export class EnvConfig {
  private static readonly ENV_FILES: string[] = ['dev', 'prod'];

  static get nodeFile(): string {
    return path.resolve(`.env.${process.env.NODE_ENV}`);
  }

  static get envFiles(): string[] {
    return EnvConfig.ENV_FILES;
  }
}

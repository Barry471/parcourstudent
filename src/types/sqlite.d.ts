declare module "node:sqlite" {
  export class DatabaseSync {
    constructor(path: string, options?: { timeout?: number });
    exec(sql: string): void;
    prepare(sql: string): {
      get(...args: unknown[]): unknown;
      all(...args: unknown[]): unknown[];
      run(...args: unknown[]): { lastInsertRowid: number | bigint };
    };
  }
}

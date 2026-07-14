export class KyodoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KyodoError';
  }
}

export class CreditNumberGenerator {
  static generate(id: number): string {
    return `CR-${id.toString().padStart(6, '0')}`;
  }
}

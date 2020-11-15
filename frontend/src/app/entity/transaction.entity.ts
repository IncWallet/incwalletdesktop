export class TransactionEntity {
  static isPRV = (token: string) =>
    token === '0000000000000000000000000000000000000000000000000000000000000004'

  static toViewToken = (token: string): string => {
    return token && token.length > 12
      ? `${token.substr(0, 4)} ${token.substr(4, 4)} .. ${token.substr(token.length - 8, 4)} ${token.substr(token.length - 4, 4)}`
      : token;
  }
}

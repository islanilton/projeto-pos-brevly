export class InvalidShortUrlFormat extends Error {
  constructor() {
    super('Invalid short URL format.')
  }
}
export class PlaidSDKError extends Error {
  constructor() {
    super('Plaid SDK not loaded');
  }
}

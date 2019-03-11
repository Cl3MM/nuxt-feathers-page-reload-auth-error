const app = require('../../src/app');

describe('\'secrets\' service', () => {
  it('registered the service', () => {
    const service = app.service('secrets');
    expect(service).toBeTruthy();
  });
});

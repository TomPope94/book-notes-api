import * as handler from '../handler';

test('hello', async () => {
  const event = 'event';
  const context = 'context';
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('string');
  };

  await handler.hello(event, context, callback);
});

// Need to add in tests for all of the API endpoints to make deployment better...

import { validateEnv } from './env.schema.js';

const DATABASE_URL = 'postgres://docs:docs@localhost:5432/docs_assistant';

describe('validateEnv', () => {
  it('applies defaults for optional variables', () => {
    const env = validateEnv({ DATABASE_URL });

    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
  });

  it('converts PORT from a string to a number', () => {
    expect(validateEnv({ DATABASE_URL, PORT: '4000' }).PORT).toBe(4000);
  });

  it('rejects a missing DATABASE_URL', () => {
    expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
  });

  it('rejects a DATABASE_URL that is not a Postgres URL', () => {
    expect(() =>
      validateEnv({ DATABASE_URL: 'mysql://localhost:3306/db' }),
    ).toThrow(/DATABASE_URL/);
  });

  it('rejects an unknown NODE_ENV', () => {
    expect(() => validateEnv({ DATABASE_URL, NODE_ENV: 'staging' })).toThrow(
      /NODE_ENV/,
    );
  });
});

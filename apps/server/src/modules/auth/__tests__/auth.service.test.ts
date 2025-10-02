import { setupTestDb } from '../../../tests/db-setup';
import { AuthService } from '../auth.service';

describe('AuthService with in-memory DB', () => {
  let db: any;
  let authService: AuthService;

  beforeAll(async () => {
    const testDb = await setupTestDb();
    db = testDb.db;
    authService = new AuthService(db);
  });

  it('signs up a user', async () => {
    const result = await authService.signup({ 
      email: 'test@example.com', 
      password: 'secret' 
    });

    expect(result).toHaveProperty('id');
  });

  it('prevents duplicate email signups', async () => {
    await authService.signup({ 
      email: 'test@example.com', 
      password: 'secret' 
    });

    await expect(
      authService.signup({ 
        email: 'test@example.com', 
        password: 'different' 
      })
    ).rejects.toThrow();
  });
});
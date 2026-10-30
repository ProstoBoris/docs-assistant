import { EnablePgvector1793102400000 } from './1793102400000-EnablePgvector.js';
import { CreateUsers1793361270294 } from './1793361270294-CreateUsers.js';

/**
 * Every migration, oldest first. After generating a new migration,
 * import it here and add it to the end of the list.
 */
export const migrations = [
  EnablePgvector1793102400000,
  CreateUsers1793361270294,
];

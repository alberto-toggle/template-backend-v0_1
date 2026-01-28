import { Pool } from 'undici';

export const httpPool = new Pool('http://localhost', {
  connections: 10
});

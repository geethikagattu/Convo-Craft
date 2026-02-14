import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');

const adapter = new JSONFile(file);
const defaultData = { users: [] };
const db = new Low(adapter, defaultData);

// Initialize database
await db.read();

// Ensure data structure exists
if (!db.data) {
  db.data = defaultData;
}

if (!db.data.users) {
  db.data.users = [];
}

await db.write();

console.log('📁 Database file:', file);
console.log('📊 Current users:', db.data.users.length);

export default db;
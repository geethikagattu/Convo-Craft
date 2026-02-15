import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');

const adapter = new JSONFile(file);
const defaultData = { users: [] };
const dbInstance = new Low(adapter, defaultData);

// Initialize database
await dbInstance.read();

// Ensure data structure exists
if (!dbInstance.data) {
  dbInstance.data = defaultData;
}

if (!dbInstance.data.users) {
  dbInstance.data.users = [];
}

await dbInstance.write();

console.log('📁 Database file:', file);
console.log('📊 Current users:', dbInstance.data.users.length);

// Export wrapper functions that work with your server.js
const db = {
  read() {
    // Return the data directly (synchronously access the already loaded data)
    return dbInstance.data;
  },
  
  write(data) {
    // Update the data and write to file
    dbInstance.data = data;
    dbInstance.write();
    return true;
  }
};

export default db;
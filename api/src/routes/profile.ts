import Database from 'better-sqlite3';
import { Router } from 'express';
import path from 'path';

const router = Router();
const db = new Database(path.join(__dirname, '../../data/profile.db'));

// 创建用户表
db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 获取用户 Profile
router.get('/', (_req, res) => {
  const profile = db.prepare('SELECT * FROM profile ORDER BY id DESC LIMIT 1').get();
  res.json(
    profile || {
      username: 'Default User',
      email: 'user@example.com',
      phone: '',
      avatar: '',
      bio: '',
    },
  );
});

// 更新用户 Profile
router.put('/', (req, res) => {
  const profile = req.body;

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO profile (username, email, phone, avatar, bio, updated_at)
    VALUES (@username, @email, @phone, @avatar, @bio, CURRENT_TIMESTAMP)
  `);

  const result = stmt.run(profile);
  res.json({ success: true, id: result.lastInsertRowid });
});

export default router;

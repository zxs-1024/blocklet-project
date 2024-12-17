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

// 验证函数
const validateProfile = (profile: any) => {
  // 验证姓名
  if (!profile.username?.trim()) {
    return { isValid: false, error: '姓名不能为空' };
  }
  if (profile.username.length < 2) {
    return { isValid: false, error: '姓名至少需要2个字符' };
  }

  // 验证手机号码
  if (!profile.phone?.trim()) {
    return { isValid: false, error: '手机号码不能为空' };
  }
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(profile.phone)) {
    return { isValid: false, error: '请输入有效的手机号码' };
  }

  // 验证邮箱
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (profile.email && !emailRegex.test(profile.email)) {
    return { isValid: false, error: '请输入有效的邮箱地址' };
  }

  return { isValid: true };
};

// 验证函数
const validateProfileId = (profile: any) => {
  if (!profile.id) {
    return { isValid: false, error: '用户id不能为空' };
  }
  return { isValid: true };
};

// 获取用户 Profile
router.get('/:id', (req, res) => {
  // 参数校验
  const validation = validateProfileId(req.params);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }
  const profile = db.prepare('SELECT * FROM profile WHERE id = ?').get(req.params.id);
  return res.json(
    profile || {
      error: '用户信息不存在',
    },
  );
});

// 更新用户 Profile
router.put('/', (req, res) => {
  const profile = req.body;

  // 参数校验
  const validation = validateProfile(profile);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  if (profile.id) {
    // 更新用户
    const updateStmt = db.prepare(`
      UPDATE profile
      SET username = @username, email = @email, phone = @phone, avatar = @avatar, bio = @bio, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);
    updateStmt.run(profile);
    return res.json({ success: true, message: '用户信息更新成功' });
  }

  // 创建用户
  const insertStmt = db.prepare(`
      INSERT INTO profile (username, email, phone, avatar, bio, created_at, updated_at)
      VALUES (@username, @email, @phone, @avatar, @bio, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
  insertStmt.run(profile);
  return res.json({ success: true, message: '用户创建成功' });
});

export default router;

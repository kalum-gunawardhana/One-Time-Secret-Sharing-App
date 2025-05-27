import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { createConnection } from 'mysql2/promise';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many attempts, please try again later'
});

// Rate limiting for secret view attempts (to prevent brute force)
const secretViewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 attempts per windowMs
  message: 'Too many attempts, please try again later'
});

// Database connection
let db = null;

async function initializeDatabase() {
  try {
    db = await createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'secret_sharing_db'
    });
    
    console.log('Connected to database');
    
    // Create tables if they don't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS secrets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(255) UNIQUE NOT NULL,
        message TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        secret_token VARCHAR(255) NOT NULL,
        success BOOLEAN DEFAULT FALSE,
        ip_address VARCHAR(255),
        user_agent VARCHAR(255),
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables created');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Generate unique token for secrets
function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Routes
app.post('/api/signup', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if user already exists
    const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    await db.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Get user
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create and assign token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, email, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/secret', authenticateToken, async (req, res) => {
  try {
    const { message, password } = req.body;
    
    if (!message || !password) {
      return res.status(400).json({ message: 'Message and password are required' });
    }
    
    // Hash secret password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate unique token
    const token = generateToken();
    
    // Store secret
    await db.execute(
      'INSERT INTO secrets (token, message, password, user_id) VALUES (?, ?, ?, ?)',
      [token, message, hashedPassword, req.user.id]
    );
    
    // Return shareable link
    res.status(201).json({
      message: 'Secret created successfully',
      secretUrl: `/secret/${token}`
    });
  } catch (error) {
    console.error('Create secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/secret/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Check if secret exists
    const [secrets] = await db.execute('SELECT id FROM secrets WHERE token = ?', [token]);
    
    if (secrets.length === 0) {
      return res.status(404).json({ message: 'Secret not found or already viewed' });
    }
    
    // Secret exists, but we don't return it yet - client needs to provide password
    res.status(200).json({ exists: true });
  } catch (error) {
    console.error('Check secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/secret/:token/view', secretViewLimiter, async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    // Check if secret exists
    const [secrets] = await db.execute('SELECT * FROM secrets WHERE token = ?', [token]);
    
    if (secrets.length === 0) {
      // Log failed attempt for non-existent secret
      await db.execute(
        'INSERT INTO access_logs (secret_token, success, ip_address, user_agent) VALUES (?, ?, ?, ?)',
        [token, false, ip, userAgent]
      );
      
      return res.status(404).json({ message: 'Secret not found or already viewed' });
    }
    
    const secret = secrets[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, secret.password);
    
    if (!validPassword) {
      // Log failed attempt
      await db.execute(
        'INSERT INTO access_logs (secret_token, success, ip_address, user_agent) VALUES (?, ?, ?, ?)',
        [token, false, ip, userAgent]
      );
      
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Log successful access
    await db.execute(
      'INSERT INTO access_logs (secret_token, success, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      [token, true, ip, userAgent]
    );
    
    // Delete secret after successful view
    await db.execute('DELETE FROM secrets WHERE token = ?', [token]);
    
    // Return the message
    res.status(200).json({
      message: 'Secret retrieved successfully',
      secret: secret.message
    });
  } catch (error) {
    console.error('View secret error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
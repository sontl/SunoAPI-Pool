import { Pool } from 'pg';
import pino from 'pino';

const logger = pino();

interface Cookie {
  id: number;
  value: string;
  date_created: Date;
  status: 'VALID' | 'INVALID';
  date_updated: Date;
  credits_left: number;
  monthly_usage: number;
  monthly_limit: number;
}

export class CookiePool {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async initialize() {
    await this.createTable();
  }

  private async createTable() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS suno_cookies (
          id SERIAL PRIMARY KEY,
          value TEXT NOT NULL,
          date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status TEXT CHECK (status IN ('VALID', 'INVALID')) DEFAULT 'VALID',
          date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          credits_left INTEGER DEFAULT 0,
          monthly_usage INTEGER DEFAULT 0,
          monthly_limit INTEGER DEFAULT 0
        )
      `);
    } finally {
      client.release();
    }
  }

  async addCookie(value: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        'INSERT INTO suno_cookies (value) VALUES ($1)',
        [value]
      );
    } finally {
      client.release();
    }
  }

  async getRandomValidCookie(): Promise<Cookie | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query<Cookie>(
        'SELECT * FROM suno_cookies WHERE status = $1 AND credits_left > 0 ORDER BY RANDOM() LIMIT 1',
        ['VALID']
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async updateCookieStatus(id: number, status: 'VALID' | 'INVALID'): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        'UPDATE suno_cookies SET status = $1, date_updated = CURRENT_TIMESTAMP WHERE id = $2',
        [status, id]
      );
    } finally {
      client.release();
    }
  }

  async updateCookieCredits(id: number, credits_left: number, monthly_usage: number, monthly_limit: number): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        'UPDATE suno_cookies SET credits_left = $1, monthly_usage = $2, monthly_limit = $3, date_updated = CURRENT_TIMESTAMP WHERE id = $4',
        [credits_left, monthly_usage, monthly_limit, id]
      );
    } finally {
      client.release();
    }
  }

  async getAllCookies(): Promise<Cookie[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query<Cookie>('SELECT * FROM suno_cookies ORDER BY id');
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export const cookiePool = new CookiePool();

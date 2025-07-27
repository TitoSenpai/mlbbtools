-- MLBB Tools Database Schema for Cloudflare D1
-- Optimized for gaming statistics and user management

-- Users table for authentication and profiles
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  mlbb_id TEXT,
  rank_tier TEXT,
  favorite_heroes TEXT, -- JSON array of hero IDs
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- MLBB Heroes master data
CREATE TABLE heroes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- Tank, Fighter, Assassin, Mage, Marksman, Support
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10),
  release_date DATE,
  win_rate REAL DEFAULT 0.0,
  pick_rate REAL DEFAULT 0.0,
  ban_rate REAL DEFAULT 0.0,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hero builds (community-submitted builds)
CREATE TABLE hero_builds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  build_name TEXT NOT NULL,
  items TEXT NOT NULL, -- JSON array of item IDs
  emblem_set TEXT,
  spells TEXT, -- JSON array of spell IDs
  description TEXT,
  win_rate REAL DEFAULT 0.0,
  votes_up INTEGER DEFAULT 0,
  votes_down INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hero_id) REFERENCES heroes(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Match statistics
CREATE TABLE match_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  hero_id INTEGER NOT NULL,
  game_mode TEXT NOT NULL, -- Classic, Ranked, Brawl, etc.
  result TEXT CHECK (result IN ('win', 'lose')),
  kda_kills INTEGER DEFAULT 0,
  kda_deaths INTEGER DEFAULT 0,
  kda_assists INTEGER DEFAULT 0,
  damage_dealt INTEGER DEFAULT 0,
  damage_taken INTEGER DEFAULT 0,
  gold_earned INTEGER DEFAULT 0,
  match_duration INTEGER, -- in seconds
  mvp BOOLEAN DEFAULT FALSE,
  match_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (hero_id) REFERENCES heroes(id)
);

-- Blog posts for content management
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id INTEGER NOT NULL,
  featured_image TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  tags TEXT, -- JSON array of tags
  view_count INTEGER DEFAULT 0,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Comments system
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  parent_id INTEGER, -- For nested comments
  is_approved BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
);

-- User sessions for authentication
CREATE TABLE user_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Analytics for dashboard metrics
CREATE TABLE analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  user_id INTEGER,
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for optimal performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_heroes_role ON heroes(role);
CREATE INDEX idx_hero_builds_hero_id ON hero_builds(hero_id);
CREATE INDEX idx_hero_builds_user_id ON hero_builds(user_id);
CREATE INDEX idx_match_stats_user_id ON match_stats(user_id);
CREATE INDEX idx_match_stats_hero_id ON match_stats(hero_id);
CREATE INDEX idx_match_stats_date ON match_stats(match_date);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_date ON analytics_events(created_at);

-- Insert sample MLBB heroes data
INSERT INTO heroes (id, name, role, difficulty, win_rate, pick_rate, ban_rate) VALUES
(1, 'Fanny', 'Assassin', 10, 52.5, 8.2, 15.3),
(2, 'Gusion', 'Assassin', 8, 51.8, 12.4, 25.7),
(3, 'Lancelot', 'Assassin', 7, 53.2, 15.1, 18.9),
(4, 'Tigreal', 'Tank', 3, 54.1, 9.8, 5.2),
(5, 'Angela', 'Support', 6, 55.7, 7.3, 8.1),
(6, 'Granger', 'Marksman', 5, 52.9, 11.6, 12.4),
(7, 'Kagura', 'Mage', 9, 51.3, 6.8, 22.1),
(8, 'Chou', 'Fighter', 8, 53.8, 13.2, 19.5),
(9, 'Hayabusa', 'Assassin', 7, 52.1, 14.7, 16.8),
(10, 'Ling', 'Assassin', 9, 50.9, 10.3, 28.4);

-- Insert sample user for demo
INSERT INTO users (email, username, display_name, mlbb_id, rank_tier, favorite_heroes) VALUES
('admin@mlbbtools.com', 'admin', 'Admin User', '123456789', 'Mythic', '[1, 2, 3]');

-- Insert sample blog post
INSERT INTO blog_posts (title, slug, content, excerpt, author_id, status, tags, published_at) VALUES
('Top 10 Heroes for Season 31', 'top-10-heroes-season-31', 
'Discover the most powerful heroes dominating the current meta in Mobile Legends Season 31...', 
'The complete guide to the strongest heroes this season',
1, 'published', '["meta", "heroes", "season31", "guide"]', CURRENT_TIMESTAMP);

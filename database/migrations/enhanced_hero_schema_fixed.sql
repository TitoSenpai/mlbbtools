-- Enhanced MLBB Tools Database Schema for Comprehensive Hero Data
-- Optimized for gaming statistics, esports data, and detailed hero information

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS esports_stats;
DROP TABLE IF EXISTS patches;
DROP TABLE IF EXISTS lore;
DROP TABLE IF EXISTS abilities;
DROP TABLE IF EXISTS base_stats;
DROP TABLE IF EXISTS scraping_metadata;
DROP TABLE IF EXISTS heroes;

-- Enhanced heroes table with additional fields
CREATE TABLE heroes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  region TEXT,
  lane TEXT,
  release_date TEXT,
  slug TEXT UNIQUE,
  image_url TEXT,
  thumbnail_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Base statistics table
CREATE TABLE base_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  level INTEGER DEFAULT 1,
  hp INTEGER,
  mana INTEGER,
  attack INTEGER,
  defense INTEGER,
  magic_defense INTEGER,
  move_speed INTEGER,
  attack_speed REAL,
  crit_rate REAL,
  regen_hp TEXT,
  regen_mana TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE,
  UNIQUE(hero_id, level)
);

-- Abilities table for skills, passives, and ultimates
CREATE TABLE abilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  ability_type TEXT NOT NULL CHECK (ability_type IN ('Passive', 'Skill1', 'Skill2', 'Ultimate')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cooldown TEXT,
  mana_cost TEXT,
  damage_scaling TEXT,
  ap_scaling TEXT,
  ad_scaling TEXT,
  range_value TEXT,
  area_effect TEXT,
  additional_effects TEXT,
  icon_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE,
  UNIQUE(hero_id, ability_type)
);

-- Lore and background information
CREATE TABLE lore (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  background TEXT,
  detailed_story TEXT,
  relationships TEXT, -- JSON array of related heroes
  quotes TEXT, -- JSON array of hero quotes
  trivia TEXT, -- JSON array of interesting facts
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE,
  UNIQUE(hero_id)
);

-- Patch history and balance changes
CREATE TABLE patches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  patch_version TEXT NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('buff', 'nerf', 'rework', 'new', 'other')),
  change_summary TEXT NOT NULL,
  detailed_changes TEXT, -- JSON object with specific changes
  change_date TEXT,
  source_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE
);

-- Esports and competitive statistics
CREATE TABLE esports_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  tournament_name TEXT,
  tournament_tier TEXT,
  season TEXT,
  win_rate REAL,
  pick_rate REAL,
  ban_rate REAL,
  total_games INTEGER,
  wins INTEGER,
  losses INTEGER,
  priority_score REAL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE
);

-- Scraping metadata for tracking data freshness
CREATE TABLE scraping_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  source_url TEXT NOT NULL,
  last_scraped TEXT DEFAULT (datetime('now')),
  scraping_version TEXT,
  data_hash TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE,
  UNIQUE(hero_id)
);

-- Indexes for optimized queries
CREATE INDEX idx_heroes_role ON heroes(role);
CREATE INDEX idx_heroes_lane ON heroes(lane);
CREATE INDEX idx_heroes_slug ON heroes(slug);
CREATE INDEX idx_base_stats_hero_id ON base_stats(hero_id);
CREATE INDEX idx_abilities_hero_id ON abilities(hero_id);
CREATE INDEX idx_abilities_type ON abilities(ability_type);
CREATE INDEX idx_lore_hero_id ON lore(hero_id);
CREATE INDEX idx_patches_hero_id ON patches(hero_id);
CREATE INDEX idx_patches_version ON patches(patch_version);
CREATE INDEX idx_patches_type ON patches(change_type);
CREATE INDEX idx_esports_hero_id ON esports_stats(hero_id);
CREATE INDEX idx_esports_tournament ON esports_stats(tournament_name);
CREATE INDEX idx_esports_season ON esports_stats(season);
CREATE INDEX idx_scraping_hero_id ON scraping_metadata(hero_id);
CREATE INDEX idx_scraping_last_scraped ON scraping_metadata(last_scraped);

-- Insert sample data for testing
INSERT INTO heroes (name, role, region, lane, slug) VALUES 
('Alucard', 'Fighter', 'Moniyan Empire', 'Jungle', 'alucard'),
('Miya', 'Marksman', 'Azrya Woodlands', 'Gold Lane', 'miya'),
('Eudora', 'Mage', 'Eruditio', 'Mid Lane', 'eudora');

-- Insert sample base stats
INSERT INTO base_stats (hero_id, level, hp, mana, attack, defense, magic_defense, move_speed, attack_speed, crit_rate) VALUES 
(1, 1, 2718, 440, 123, 18, 15, 260, 0.85, 0.0),
(2, 1, 2296, 440, 115, 15, 10, 240, 0.83, 5.0),
(3, 1, 2478, 580, 108, 14, 25, 240, 0.69, 0.0);

-- Insert sample abilities
INSERT INTO abilities (hero_id, ability_type, name, description) VALUES 
(1, 'Passive', 'Pursuit', 'Every time Alucard attacks the same enemy unit consecutively, his damage will increase, stacking up to 5 times.'),
(1, 'Skill1', 'Groundsplitter', 'Alucard jumps towards a target location and strikes nearby enemies.'),
(1, 'Skill2', 'Whirling Blade', 'Alucard strikes all nearby enemies and gains lifesteal for a short period.'),
(1, 'Ultimate', 'Fission Wave', 'Alucard strikes in the target direction, dealing massive damage.');

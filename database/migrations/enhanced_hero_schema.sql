-- Enhanced MLBB Tools Database Schema for Comprehensive Hero Data
-- Optimized for gaming statistics, esports data, and detailed hero information

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS esports_stats;
DROP TABLE IF EXISTS patches;
DROP TABLE IF EXISTS lore;
DROP TABLE IF EXISTS abilities;
DROP TABLE IF EXISTS base_stats;

-- Enhanced heroes table with additional fields
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS lane TEXT;
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(hero_id) REFERENCES heroes(id) ON DELETE CASCADE
);

-- Abilities table for detailed skill information
CREATE TABLE abilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  ability_type TEXT NOT NULL, -- Passive, Skill1, Skill2, Ultimate
  name TEXT NOT NULL,
  description TEXT,
  cooldown TEXT,
  mana_cost TEXT,
  damage_scaling TEXT,
  ap_scaling TEXT,
  ad_scaling TEXT,
  range_value TEXT,
  area_effect TEXT,
  additional_effects TEXT, -- JSON string for complex effects
  icon_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(hero_id) REFERENCES heroes(id) ON DELETE CASCADE
);

-- Lore and relationships table
CREATE TABLE lore (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  background TEXT,
  detailed_story TEXT,
  relationships TEXT, -- JSON string for related heroes
  quotes TEXT, -- JSON string for hero quotes
  trivia TEXT, -- JSON string for trivia facts
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(hero_id) REFERENCES heroes(id) ON DELETE CASCADE
);

-- Patch history table for tracking changes
CREATE TABLE patches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  patch_version TEXT NOT NULL,
  change_type TEXT, -- buff, nerf, rework, new
  change_summary TEXT,
  detailed_changes TEXT, -- JSON string for detailed changes
  change_date TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(hero_id) REFERENCES heroes(id) ON DELETE CASCADE
);

-- Esports statistics table
CREATE TABLE esports_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  tournament_name TEXT,
  tournament_tier TEXT, -- professional, amateur, regional
  season TEXT,
  win_rate REAL,
  pick_rate REAL,
  ban_rate REAL,
  total_games INTEGER,
  wins INTEGER,
  losses INTEGER,
  avg_kda REAL,
  first_pick_rate REAL,
  priority_score REAL,
  last_updated TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(hero_id) REFERENCES heroes(id) ON DELETE CASCADE
);

-- Scraping metadata table for tracking scraping status
CREATE TABLE scraping_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_id INTEGER NOT NULL,
  source_type TEXT NOT NULL, -- liquipedia, fandom, official
  source_url TEXT,
  last_scraped DATETIME,
  scraping_status TEXT, -- success, failed, pending
  data_version TEXT,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(hero_id) REFERENCES heroes(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_heroes_slug ON heroes(slug);
CREATE INDEX idx_heroes_role ON heroes(role);
CREATE INDEX idx_base_stats_hero_id ON base_stats(hero_id);
CREATE INDEX idx_abilities_hero_id ON abilities(hero_id);
CREATE INDEX idx_abilities_type ON abilities(ability_type);
CREATE INDEX idx_lore_hero_id ON lore(hero_id);
CREATE INDEX idx_patches_hero_id ON patches(hero_id);
CREATE INDEX idx_patches_version ON patches(patch_version);
CREATE INDEX idx_esports_hero_id ON esports_stats(hero_id);
CREATE INDEX idx_esports_tournament ON esports_stats(tournament_name);
CREATE INDEX idx_scraping_hero_id ON scraping_metadata(hero_id);
CREATE INDEX idx_scraping_status ON scraping_metadata(scraping_status);

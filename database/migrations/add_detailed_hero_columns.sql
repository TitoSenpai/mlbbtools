-- Migration to enhance heroes table with additional columns for detailed hero data
-- Add columns to support comprehensive hero information

-- Add missing columns for detailed hero data
ALTER TABLE heroes ADD COLUMN release_year INTEGER;
ALTER TABLE heroes ADD COLUMN title TEXT; -- Hero title like "The Crimson Shadow"
ALTER TABLE heroes ADD COLUMN specialty TEXT; -- JSON array of specialties like ["Burst", "Mobility"]
ALTER TABLE heroes ADD COLUMN lane TEXT; -- Primary lane: Jungle, Mid, Side, Roam
ALTER TABLE heroes ADD COLUMN price_bp INTEGER; -- Battle Points price
ALTER TABLE heroes ADD COLUMN price_diamonds INTEGER; -- Diamond price
ALTER TABLE heroes ADD COLUMN skill_resource TEXT; -- Mana, Energy, etc.
ALTER TABLE heroes ADD COLUMN damage_type TEXT; -- Physical, Magic, Mixed
ALTER TABLE heroes ADD COLUMN attack_type TEXT; -- Melee, Ranged
ALTER TABLE heroes ADD COLUMN detailed_stats TEXT; -- JSON with all stats (HP, Attack, etc.)
ALTER TABLE heroes ADD COLUMN abilities TEXT; -- JSON with all abilities data
ALTER TABLE heroes ADD COLUMN ratings TEXT; -- JSON with durability, offense, etc. ratings
ALTER TABLE heroes ADD COLUMN lore TEXT; -- Hero background story
ALTER TABLE heroes ADD COLUMN relationships TEXT; -- JSON array of related heroes
ALTER TABLE heroes ADD COLUMN voice_actors TEXT; -- JSON with voice actor info
ALTER TABLE heroes ADD COLUMN trivia TEXT; -- JSON array of trivia facts
ALTER TABLE heroes ADD COLUMN portrait_url TEXT; -- Portrait image URL
ALTER TABLE heroes ADD COLUMN splash_art_url TEXT; -- Splash art image URL

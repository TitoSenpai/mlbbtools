# Cloudflare D1 Database Setup Guide

This guide walks you through setting up Cloudflare D1 for the MLBB Tools platform.

## Prerequisites

- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- Authenticated with Cloudflare (`wrangler login`)

## Step 1: Create D1 Database

```bash
# Create the database
wrangler d1 create mlbb-tools-db

# This will output something like:
# [[d1_databases]]
# binding = "DB"
# database_name = "mlbb-tools-db"
# database_id = "your-database-id-here"
```

## Step 2: Update wrangler.jsonc

Add the D1 database configuration to your `wrangler.jsonc`:

```json
{
  "name": "mlbb-tools",
  "compatibility_date": "2024-12-15",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "mlbb-tools-db",
      "database_id": "your-database-id-here"
    }
  ]
}
```

## Step 3: Initialize Database Schema

Run the SQL schema to create all tables:

```bash
# Execute the schema file
wrangler d1 execute mlbb-tools-db --file=./database/schema.sql
```

## Step 4: Seed Initial Data (Optional)

Create some initial heroes and test data:

```bash
# Create a seed file
wrangler d1 execute mlbb-tools-db --command="
INSERT INTO heroes (name, role, difficulty, win_rate, pick_rate, ban_rate, is_active) VALUES
('Fanny', 'Assassin', 10, 52.5, 8.2, 15.3, true),
('Gusion', 'Assassin', 8, 51.8, 12.1, 22.7, true),
('Kagura', 'Mage', 9, 49.2, 6.8, 18.9, true),
('Layla', 'Marksman', 3, 48.5, 15.2, 2.1, true),
('Tigreal', 'Tank', 4, 52.1, 18.7, 8.4, true);
"
```

## Step 5: Environment Variables

For local development, create a `.dev.vars` file:

```env
# .dev.vars (for local development)
DATABASE_URL=your-d1-database-url
```

## Step 6: Test API Endpoints

Test the API endpoints work with D1:

```bash
# Get heroes
curl http://localhost:3000/api/mlbb?action=get-heroes

# Record a match
curl -X POST http://localhost:3000/api/mlbb \
  -H "Content-Type: application/json" \
  -d '{
    "action": "record-match",
    "matchData": {
      "user_id": 1,
      "hero_id": 1,
      "game_mode": "ranked",
      "result": "win",
      "kda_kills": 8,
      "kda_deaths": 2,
      "kda_assists": 12,
      "damage_dealt": 125000,
      "damage_taken": 45000,
      "gold_earned": 12500,
      "match_duration": 1200,
      "mvp": true
    }
  }'
```

## D1 Features for Gaming

### Why D1 is Perfect for MLBB Tools:

1. **Global Edge Deployment**: Data is replicated globally for low latency
2. **SQLite Compatibility**: Familiar SQL interface with gaming-optimized queries
3. **Real-time Analytics**: Perfect for match statistics and hero performance tracking
4. **Automatic Scaling**: Handles traffic spikes during tournaments/events
5. **Cost Effective**: Generous free tier, pay for what you use

### Performance Optimizations:

1. **Indexed Queries**: All hero lookups and match queries are indexed
2. **Prepared Statements**: All database operations use prepared statements
3. **Connection Pooling**: Automatic connection management
4. **Edge Caching**: Combined with Cloudflare's edge network

### Analytics Capabilities:

- Real-time hero win rates
- Match history tracking
- User performance analytics
- Popular build tracking
- Tournament statistics

## Deployment

When deploying to Cloudflare Pages:

```bash
# Deploy with D1 bindings
wrangler pages deploy dist --d1=DB:your-database-id

# Or deploy automatically with CI/CD
npm run build && npm run deploy
```

## Monitoring

Monitor your D1 database through:
- Cloudflare Dashboard
- Wrangler CLI: `wrangler d1 info mlbb-tools-db`
- Built-in analytics in your application

## Backup & Recovery

```bash
# Export database
wrangler d1 export mlbb-tools-db --output=backup.sql

# Import from backup
wrangler d1 execute mlbb-tools-db --file=backup.sql
```

## Common Issues

1. **Database not found**: Make sure database_id is correct in wrangler.jsonc
2. **Permission errors**: Ensure you're authenticated with correct Cloudflare account
3. **Schema errors**: Check SQL syntax and table dependencies

Your MLBB Tools platform is now ready with a globally distributed, edge-optimized database!

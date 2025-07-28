# MLBB Tools - Comprehensive Scraping System

A complete data ingestion and management system for Mobile Legends: Bang Bang (MLBB) hero information, built with Next.js 15 and deployed on Cloudflare Workers.

## 🚀 Features

### 📊 Enhanced Database Schema
- **Heroes**: Comprehensive hero information with images, regions, and metadata
- **Base Stats**: Level-based statistics (HP, Attack, Defense, etc.)
- **Abilities**: Detailed skill information (Passive, Skills 1-2, Ultimate)
- **Lore**: Background stories, relationships, quotes, and trivia
- **Patches**: Complete patch history with change tracking
- **Esports Stats**: Tournament performance and competitive metrics
- **Scraping Metadata**: Data freshness tracking and version control

### 🕷️ Modular Scraping Architecture
- **Base Scraper**: Rate limiting, retry logic, error handling
- **Liquipedia Scraper**: Specialized MLBB hero data extraction
- **API Integration**: RESTful endpoints for data ingestion
- **Batch Processing**: Efficient bulk hero data updates

### 🎯 Production-Ready Features
- **Cloudflare D1 Database**: Distributed SQL database with global replication
- **OpenNext Deployment**: Optimized for Cloudflare Workers environment
- **Rate Limiting**: Respectful scraping with 2-second delays
- **Error Recovery**: 3-retry attempts with exponential backoff
- **Data Validation**: Type-safe data processing and storage

## 📁 Project Structure

```
mlbbtools/
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin dashboard
│   │   ├── api/
│   │   │   ├── mlbb/             # Hero data API
│   │   │   └── scraping/         # Scraping management API
│   │   └── page.tsx              # Main landing page
│   ├── lib/
│   │   ├── scraping/
│   │   │   ├── base-scraper.ts   # Core scraping utilities
│   │   │   └── liquipedia-scraper.ts # MLBB-specific scraper
│   │   └── utils.ts              # Shared utilities
│   └── components/ui/            # UI components
├── database/
│   └── migrations/
│       └── enhanced_hero_schema_fixed.sql # Database schema
├── wrangler.jsonc               # Cloudflare Workers config
└── package.json                 # Project dependencies
```

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd mlbbtools
npm install
```

### 2. Environment Configuration
Create `.dev.vars` file:
```env
D1_DATABASE_ID=your-database-id
ENVIRONMENT=development
NODE_ENV=development
```

### 3. Database Setup
```bash
# Apply database schema
npx wrangler d1 execute DB --local --file="database/migrations/enhanced_hero_schema_fixed.sql"

# For production
npx wrangler d1 execute DB --remote --file="database/migrations/enhanced_hero_schema_fixed.sql"
```

### 4. Development Server
```bash
# Standard Next.js development
npm run dev

# Wrangler development (with D1 access)
npx wrangler dev
```

## 🌐 API Endpoints

### Hero Data API (`/api/mlbb`)
- `GET /api/mlbb` - Fetch all heroes with basic information
- Supports filtering and pagination
- Returns structured JSON with hero data

### Scraping Management API (`/api/scraping`)

#### GET Endpoints
- `?action=list-heroes` - Get list of available heroes to scrape
- `?action=scrape-hero&hero=HeroName` - Scrape specific hero data
- `?action=ingest-hero&hero=HeroName` - Scrape and store hero data

#### POST Endpoints
```bash
# Batch ingest specific heroes
POST /api/scraping
{
  "action": "batch-ingest",
  "heroes": ["Alucard", "Miya", "Eudora"],
  "batchSize": 3
}

# Ingest all available heroes
POST /api/scraping
{
  "action": "ingest-all",
  "batchSize": 5
}
```

## 🎛️ Admin Dashboard

Access the admin dashboard at `/admin` to:
- View database statistics
- Monitor hero data status
- Trigger scraping operations
- Track data freshness

### Dashboard Features
- **Statistics Cards**: Hero count, roles, regions, image coverage
- **Scraping Status**: Environment detection and operation controls
- **Hero Grid**: Visual display of current database contents
- **Real-time Updates**: Automatic refresh after scraping operations

## 🕷️ Scraping System Details

### Base Scraper (`base-scraper.ts`)
```typescript
// Core features
- Rate limiting (2s between requests)
- Retry logic (3 attempts with exponential backoff)
- Error handling with custom ScrapingError class
- HTML parsing utilities with Cheerio
- Data validation and normalization functions
```

### Liquipedia Scraper (`liquipedia-scraper.ts`)
```typescript
// MLBB-specific extraction
- Hero list discovery from portal pages
- Comprehensive hero data extraction:
  * Basic info (name, role, region, images)
  * Statistics (HP, attack, defense, etc.)
  * Abilities (passive, skills, ultimate)
  * Lore and background information
  * Patch history and balance changes
  * Esports performance metrics
```

### Data Processing Flow
1. **Discovery**: Find all available heroes from Liquipedia portal
2. **Extraction**: Scrape individual hero pages for detailed data
3. **Validation**: Type-check and normalize extracted information
4. **Storage**: Insert/update data in D1 database with relationships
5. **Metadata**: Track scraping timestamps and data versions

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy to Cloudflare Workers
npm run build
npx wrangler deploy

# Apply database migrations to production
npx wrangler d1 execute DB --remote --file="database/migrations/enhanced_hero_schema_fixed.sql"
```

### Environment Variables
- Production environment automatically detects D1 bindings
- No additional configuration needed for Cloudflare Workers
- Database connections handled through Wrangler configuration

## 📊 Database Schema

### Tables Overview
- **heroes**: Main hero information table
- **base_stats**: Level-based statistics with foreign key relationships
- **abilities**: Skill details with type constraints
- **lore**: Background information with JSON fields for arrays
- **patches**: Version history with change type categorization
- **esports_stats**: Tournament performance metrics
- **scraping_metadata**: Data freshness and version tracking

### Key Features
- **Foreign Key Constraints**: Maintain data integrity
- **Unique Constraints**: Prevent duplicate entries
- **Indexes**: Optimized queries for role, lane, and tournament filters
- **JSON Storage**: Flexible data structures for arrays and objects

## 🔧 Configuration

### Wrangler Configuration (`wrangler.jsonc`)
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "mlbb-tools-db",
      "database_id": "your-database-id"
    }
  ]
}
```

### TypeScript Configuration
- Strict type checking enabled
- Path aliases for clean imports
- Next.js 15 app router support

## 📈 Performance Optimizations

### Scraping Efficiency
- **Batch Processing**: Process multiple heroes in parallel
- **Rate Limiting**: Respect source server resources
- **Error Recovery**: Graceful handling of network issues
- **Data Caching**: Avoid re-scraping unchanged content

### Database Optimization
- **Indexed Queries**: Fast filtering and searching
- **Normalized Schema**: Efficient storage and relationships
- **Connection Pooling**: Cloudflare D1 built-in optimization
- **Global Distribution**: Edge database replication

## 🎯 Usage Examples

### Manual Hero Scraping
```bash
# Scrape specific hero
curl "https://your-domain.workers.dev/api/scraping?action=scrape-hero&hero=Alucard"

# Ingest scraped data
curl "https://your-domain.workers.dev/api/scraping?action=ingest-hero&hero=Alucard"
```

### Batch Operations
```bash
# Batch ingest multiple heroes
curl -X POST "https://your-domain.workers.dev/api/scraping" \
  -H "Content-Type: application/json" \
  -d '{"action": "batch-ingest", "heroes": ["Alucard", "Miya"], "batchSize": 2}'
```

### Data Retrieval
```bash
# Get all heroes
curl "https://your-domain.workers.dev/api/mlbb"

# Response includes comprehensive hero data
{
  "heroes": [
    {
      "id": 1,
      "name": "Alucard",
      "role": "Fighter",
      "lane": "Jungle",
      "region": "Moniyan Empire",
      "slug": "alucard",
      "image_url": "https://...",
      "created_at": "2025-07-28T...",
      "updated_at": "2025-07-28T..."
    }
  ]
}
```

## 🛡️ Error Handling

### Scraping Errors
- Network timeouts with retry logic
- Invalid HTML structure handling
- Rate limiting compliance
- Data validation failures

### Database Errors
- Connection failure recovery
- Transaction rollback on errors
- Constraint violation handling
- Data integrity checks

## 📋 Development Workflow

### 1. Local Development
```bash
npm run dev  # Standard Next.js dev server
```
- Scraping API returns development message
- Database operations simulated
- UI development and testing

### 2. Wrangler Development
```bash
npx wrangler dev  # With D1 database access
```
- Full scraping functionality
- Real database operations
- Production environment simulation

### 3. Testing
```bash
# Test scraping endpoints
curl "http://localhost:8787/api/scraping?action=list-heroes"

# Test admin dashboard
open http://localhost:8787/admin
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket connections for live scraping status
- **Advanced Filtering**: Complex query builder for hero search
- **Data Analytics**: Performance trends and meta analysis
- **Image Processing**: Automatic image optimization and CDN integration
- **API Rate Limiting**: Request throttling for public API access
- **User Management**: Authentication and role-based access control

### Scalability Improvements
- **Caching Layer**: Redis for frequently accessed data
- **Queue System**: Background job processing for large scraping operations
- **Monitoring**: Application performance and error tracking
- **CDN Integration**: Global content delivery for static assets

## 📞 Support

For issues, feature requests, or contributions:
- Check the admin dashboard for system status
- Review logs in Cloudflare Workers dashboard
- Monitor database performance in D1 console
- Use the scraping API endpoints for debugging

## 📄 License

This project is part of the MLBB Tools suite for Mobile Legends: Bang Bang data management and analysis.

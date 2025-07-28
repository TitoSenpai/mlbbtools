// Core scraping utilities for MLBB hero data extraction
// Handles rate limiting, error handling, and data normalization

import * as cheerio from 'cheerio'

export interface ScrapingConfig {
  baseUrl: string
  rateLimit: number // milliseconds between requests
  retryAttempts: number
  timeout: number
  userAgent: string
}

export interface ScrapingResult<T> {
  success: boolean
  data?: T
  error?: string
  url?: string
  timestamp: string
}

export class ScrapingError extends Error {
  constructor(
    message: string,
    public url?: string,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message)
    this.name = 'ScrapingError'
  }
}

export class BaseScraper {
  private lastRequestTime = 0
  
  constructor(protected config: ScrapingConfig) {}

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  protected async enforceRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.config.rateLimit) {
      const waitTime = this.config.rateLimit - timeSinceLastRequest
      console.log(`⏱️  Rate limiting: waiting ${waitTime}ms`)
      await this.delay(waitTime)
    }
    
    this.lastRequestTime = Date.now()
  }

  protected async fetchWithRetry(url: string): Promise<Response> {
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        await this.enforceRateLimit()
        
        console.log(`🔍 Fetching (attempt ${attempt}/${this.config.retryAttempts}): ${url}`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': this.config.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new ScrapingError(
            `HTTP ${response.status}: ${response.statusText}`,
            url,
            response.status
          )
        }
        
        return response
        
      } catch (error) {
        lastError = error as Error
        console.warn(`❌ Attempt ${attempt} failed for ${url}:`, error)
        
        if (attempt < this.config.retryAttempts) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
          console.log(`⏳ Retrying in ${backoffDelay}ms...`)
          await this.delay(backoffDelay)
        }
      }
    }
    
    throw new ScrapingError(
      `Failed to fetch after ${this.config.retryAttempts} attempts`,
      url,
      undefined,
      lastError
    )
  }

  protected async scrapeHtml(url: string): Promise<cheerio.CheerioAPI> {
    const response = await this.fetchWithRetry(url)
    const html = await response.text()
    return cheerio.load(html)
  }

  protected normalizeText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
  }

  protected extractNumber(text: string): number | null {
    const match = text.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }

  protected createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  protected logProgress(current: number, total: number, item: string): void {
    const percentage = Math.round((current / total) * 100)
    const progressBar = '='.repeat(Math.floor(percentage / 5)) + 
                       ' '.repeat(20 - Math.floor(percentage / 5))
    console.log(`📊 Progress: [${progressBar}] ${percentage}% (${current}/${total}) - ${item}`)
  }
}

// Default configuration for MLBB scraping
export const MLBB_SCRAPING_CONFIG: ScrapingConfig = {
  baseUrl: 'https://liquipedia.net/mobilelegends',
  rateLimit: 2000, // 2 seconds between requests to be respectful
  retryAttempts: 3,
  timeout: 30000, // 30 seconds
  userAgent: 'MLBB-Tools-Bot/1.0 (Educational purposes; Contact: your-email@domain.com)'
}

// Utility functions for data validation
export function validateHeroData(data: Record<string, unknown>): boolean {
  return !!(data && data.name && data.role)
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
}

export function parseStatValue(value: string): { base: number; growth?: number; max?: number } | null {
  // Handle different stat formats from Liquipedia
  // Examples: "500 (+85)", "100 → 200", "50 per level", etc.
  
  const growthMatch = value.match(/(\d+(?:\.\d+)?)\s*\(\+(\d+(?:\.\d+)?)\)/);
  if (growthMatch) {
    return {
      base: parseFloat(growthMatch[1]),
      growth: parseFloat(growthMatch[2])
    };
  }
  
  const rangeMatch = value.match(/(\d+(?:\.\d+)?)\s*→\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    return {
      base: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2])
    };
  }
  
  const simpleMatch = value.match(/(\d+(?:\.\d+)?)/);
  if (simpleMatch) {
    return {
      base: parseFloat(simpleMatch[1])
    };
  }
  
  return null;
}

"use client"

import { toast } from "sonner"

export interface SearchResult {
  id: string
  type: 'product' | 'supplier' | 'order' | 'article'
  title: string
  description: string
  category?: string
  price?: number
  rating?: number
  relevance: number
  highlights: string[]
  metadata: Record<string, any>
}

export interface SearchFilters {
  category: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
  supplier: string[]
  dateRange: [Date, Date]
  tags: string[]
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilters
  createdAt: Date
  lastUsed: Date
  usageCount: number
}

class SearchService {
  private searchIndex = new Map<string, SearchResult[]>()
  private savedSearches: SavedSearch[] = []

  constructor() {
    this.initializeSearchIndex()
    this.loadSavedSearches()
  }

  private initializeSearchIndex() {
    const mockData: SearchResult[] = [
      {
        id: 'prod-1',
        type: 'product',
        title: 'Wireless Earbuds Pro',
        description: 'Premium wireless earbuds with active noise cancellation and 30-hour battery life',
        category: 'Electronics',
        price: 89.99,
        rating: 4.5,
        relevance: 0.95,
        highlights: ['wireless', 'earbuds', 'noise cancellation'],
        metadata: { brand: 'AudioTech', stock: 150, reviews: 234 }
      },
      {
        id: 'prod-2',
        type: 'product',
        title: 'Smart Watch Ultra',
        description: 'Advanced fitness tracking with heart rate monitor and GPS',
        category: 'Electronics',
        price: 299.99,
        rating: 4.7,
        relevance: 0.92,
        highlights: ['smartwatch', 'fitness', 'GPS'],
        metadata: { brand: 'TechFit', stock: 89, reviews: 567 }
      },
      {
        id: 'sup-1',
        type: 'supplier',
        title: 'Global Electronics Supplier',
        description: 'Reliable electronics supplier with 10+ years experience',
        category: 'Electronics',
        rating: 4.8,
        relevance: 0.88,
        highlights: ['electronics', 'supplier', 'reliable'],
        metadata: { country: 'China', responseTime: '2 hours', products: 1250 }
      },
      {
        id: 'ord-1',
        type: 'order',
        title: 'Order ORD-001',
        description: 'Wireless Earbuds Pro - Customer: John Doe',
        category: 'Electronics',
        price: 89.99,
        relevance: 0.85,
        highlights: ['order', 'earbuds', 'customer'],
        metadata: { status: 'shipped', date: new Date(), customer: 'John Doe' }
      }
    ]

    this.searchIndex.set('default', mockData)
  }

  private loadSavedSearches() {
    const saved = localStorage.getItem('dropease-saved-searches')
    if (saved) {
      this.savedSearches = JSON.parse(saved)
    }
  }

  private saveSavedSearches() {
    localStorage.setItem('dropease-saved-searches', JSON.stringify(this.savedSearches))
  }

  async search(query: string, filters: Partial<SearchFilters> = {}): Promise<SearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const results = this.searchIndex.get('default') || []
    let filteredResults = results

    if (query.trim()) {
      const queryTerms = query.toLowerCase().split(' ')
      filteredResults = results.filter(result => {
        const searchText = `${result.title} ${result.description}`.toLowerCase()
        return queryTerms.some(term => searchText.includes(term))
      }).map(result => {
        const queryTerms = query.toLowerCase().split(' ')
        const searchText = `${result.title} ${result.description}`.toLowerCase()
        const matches = queryTerms.filter(term => searchText.includes(term)).length
        return {
          ...result,
          relevance: matches / queryTerms.length,
          highlights: this.calculateHighlights(searchText, queryTerms)
        }
      }).sort((a, b) => b.relevance - a.relevance)
    }

    if (filters.category && filters.category.length > 0) {
      filteredResults = filteredResults.filter(result => 
        result.category && filters.category!.includes(result.category)
      )
    }

    if (filters.priceRange) {
      filteredResults = filteredResults.filter(result => 
        result.price && result.price >= filters.priceRange![0] && result.price <= filters.priceRange![1]
      )
    }

    if (filters.rating) {
      filteredResults = filteredResults.filter(result => 
        result.rating && result.rating >= filters.rating!
      )
    }

    if (filters.inStock) {
      filteredResults = filteredResults.filter(result => 
        result.metadata.stock > 0
      )
    }

    return filteredResults.slice(0, 50)
  }

  private calculateHighlights(text: string, queryTerms: string[]): string[] {
    const highlights: string[] = []
    queryTerms.forEach(term => {
      const index = text.indexOf(term)
      if (index !== -1) {
        const start = Math.max(0, index - 20)
        const end = Math.min(text.length, index + term.length + 20)
        const snippet = text.substring(start, end)
        highlights.push(`...${snippet}...`)
      }
    })
    return highlights.slice(0, 3)
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return []

    await new Promise(resolve => setTimeout(resolve, 100))

    const results = this.searchIndex.get('default') || []
    const suggestions = new Set<string>()

    results.forEach(result => {
      const titleWords = result.title.toLowerCase().split(' ')
      const descWords = result.description.toLowerCase().split(' ')
      
      const allWords = [...titleWords, ...descWords];
      allWords.forEach(word => {
        if (word.includes(query.toLowerCase()) && word.length > 2) {
          suggestions.add(word)
        }
      })
    })

    return Array.from(suggestions).slice(0, 10)
  }

  saveSearch(name: string, query: string, filters: SearchFilters): void {
    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: name,
      query: query,
      filters: filters,
      createdAt: new Date(),
      lastUsed: new Date(),
      usageCount: 1
    }

    this.savedSearches.push(savedSearch)
    this.saveSavedSearches()
    toast.success('Search saved successfully!')
  }

  getSavedSearches(): SavedSearch[] {
    return this.savedSearches.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
  }

  deleteSavedSearch(id: string): void {
    this.savedSearches = this.savedSearches.filter(search => search.id !== id)
    this.saveSavedSearches()
    toast.success('Search deleted!')
  }

  executeSavedSearch(id: string): { query: string; filters: SearchFilters } | null {
    const search = this.savedSearches.find(s => s.id === id)
    if (search) {
      search.lastUsed = new Date()
      search.usageCount++
      this.saveSavedSearches()
      return { query: search.query, filters: search.filters }
    }
    return null
  }

  getSearchAnalytics() {
    return {
      totalSearches: this.savedSearches.reduce((sum, s) => sum + s.usageCount, 0),
      savedSearches: this.savedSearches.length,
      popularQueries: this.savedSearches
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5)
        .map(s => ({ query: s.query, count: s.usageCount }))
    }
  }
}

export const searchService = new SearchService()
export default searchService

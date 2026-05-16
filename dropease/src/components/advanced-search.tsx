"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Bookmark, TrendingUp, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"

interface SearchResult {
  id: string
  type: 'product' | 'supplier' | 'order' | 'article'
  title: string
  description: string
  category?: string
  price?: number
  rating?: number
  relevance: number
  metadata: Record<string, any>
}

interface SearchFilters {
  category: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
  type: string[]
}

export function AdvancedSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    type: []
  })
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const categories = ["Electronics", "Fashion", "Home & Garden", "Beauty", "Sports", "Toys"]
  const types = ["product", "supplier", "order", "article"]

  useEffect(() => {
    // Load saved searches from localStorage
    const saved = localStorage.getItem('advanced-search-saved')
    if (saved) {
      setSavedSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Generate suggestions as user types
    if (query.length >= 2) {
      const mockSuggestions = [
        "wireless earbuds",
        "smart watch",
        "laptop stand",
        "phone case",
        "bluetooth speaker",
        "fitness tracker",
        "power bank",
        "usb cable",
        "headphones",
        "tablet cover"
      ].filter(s => s.includes(query.toLowerCase()))
      setSuggestions(mockSuggestions.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [query])

  const performSearch = async () => {
    setLoading(true)
    
    // Simulate search API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'product',
        title: 'Wireless Earbuds Pro',
        description: 'Premium wireless earbuds with active noise cancellation and 30-hour battery life',
        category: 'Electronics',
        price: 89.99,
        rating: 4.5,
        relevance: 0.95,
        metadata: { brand: 'AudioTech', stock: 150, reviews: 234 }
      },
      {
        id: '2',
        type: 'product',
        title: 'Smart Watch Ultra',
        description: 'Advanced fitness tracking with heart rate monitor and GPS',
        category: 'Electronics',
        price: 299.99,
        rating: 4.7,
        relevance: 0.92,
        metadata: { brand: 'TechFit', stock: 89, reviews: 567 }
      },
      {
        id: '3',
        type: 'supplier',
        title: 'Global Electronics Supplier',
        description: 'Reliable electronics supplier with 10+ years experience',
        category: 'Electronics',
        rating: 4.8,
        relevance: 0.88,
        metadata: { country: 'China', responseTime: '2 hours', products: 1250 }
      }
    ]

    // Filter results
    let filteredResults = mockResults
    
    if (query.trim()) {
      const queryTerms = query.toLowerCase().split(' ')
      filteredResults = filteredResults.filter(result => {
        const searchText = `${result.title} ${result.description}`.toLowerCase()
        return queryTerms.some(term => searchText.includes(term))
      })
    }

    if (filters.category.length > 0) {
      filteredResults = filteredResults.filter(result => 
        result.category && filters.category.includes(result.category)
      )
    }

    if (filters.type.length > 0) {
      filteredResults = filteredResults.filter(result => 
        filters.type.includes(result.type)
      )
    }

    if (filters.rating > 0) {
      filteredResults = filteredResults.filter(result => 
        result.rating && result.rating >= filters.rating
      )
    }

    if (filters.priceRange) {
      filteredResults = filteredResults.filter(result => 
        result.price && result.price >= filters.priceRange[0] && result.price <= filters.priceRange[1]
      )
    }

    if (filters.inStock) {
      filteredResults = filteredResults.filter(result => 
        result.metadata.stock > 0
      )
    }

    setResults(filteredResults)
    setLoading(false)
  }

  const saveSearch = () => {
    const name = prompt('Enter a name for this search:')
    if (name && query.trim()) {
      const newSearch = {
        id: Date.now().toString(),
        name,
        query,
        filters,
        createdAt: new Date(),
        usageCount: 1
      }
      
      const updated = [...savedSearches, newSearch]
      setSavedSearches(updated)
      localStorage.setItem('advanced-search-saved', JSON.stringify(updated))
      toast.success('Search saved successfully!')
    }
  }

  const executeSavedSearch = (saved: any) => {
    setQuery(saved.query)
    setFilters(saved.filters)
    saved.usageCount++
    const updated = savedSearches.map(s => s.id === saved.id ? saved : s)
    setSavedSearches(updated)
    localStorage.setItem('advanced-search-saved', JSON.stringify(updated))
    performSearch()
  }

  const deleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id)
    setSavedSearches(updated)
    localStorage.setItem('advanced-search-saved', JSON.stringify(updated))
    toast.success('Search deleted!')
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      type: []
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Advanced Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full-text search with smart filters and saved searches.
        </p>
      </div>

      {/* Search Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Search className="size-4" />
            Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search products, suppliers, orders..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button size="sm" onClick={performSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button size="sm" variant="outline" onClick={saveSearch} disabled={!query.trim()}>
                <Bookmark className="size-3" />
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="border rounded-lg p-2 space-y-1">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-2 py-1 text-sm hover:bg-muted rounded cursor-pointer"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <Filter className="size-3 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Filter className="size-4" />
                Smart Filters
              </span>
              <Button size="sm" variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, category: [...prev.category, cat] }))
                          } else {
                            setFilters(prev => ({ ...prev, category: prev.category.filter(c => c !== cat) }))
                          }
                        }}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <div className="space-y-1">
                  {types.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm capitalize">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({ ...prev, type: [...prev.type, type] }))
                          } else {
                            setFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }))
                          }
                        }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [Number(e.target.value), prev.priceRange[1]] 
                    }))}
                    className="w-20"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [prev.priceRange[0], Number(e.target.value)] 
                    }))}
                    className="w-20"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Min Rating</label>
                <Select value={filters.rating.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: Number(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
              />
              In Stock Only
            </label>
          </CardContent>
        </Card>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bookmark className="size-4" />
              Saved Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedSearches.map((saved) => (
              <div key={saved.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">{saved.name}</div>
                  <div className="text-xs text-muted-foreground">{saved.query}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => executeSavedSearch(saved)}>
                    Load
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteSavedSearch(saved.id)}>
                    <X className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Search Results ({results.length})
            </span>
            {results.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Sorted by relevance
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="size-12 mx-auto mb-4 opacity-50" />
              <p>No results found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {result.type}
                        </Badge>
                        {result.category && (
                          <Badge variant="secondary">
                            {result.category}
                          </Badge>
                        )}
                        {result.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <span>⭐</span>
                            <span>{result.rating}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium mb-1">{result.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {result.price && <span>Price: ${result.price}</span>}
                        {result.metadata.stock && <span>Stock: {result.metadata.stock}</span>}
                        <span>Relevance: {Math.round(result.relevance * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

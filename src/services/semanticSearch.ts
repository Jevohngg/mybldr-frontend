import { plans } from '../mock-data/plans'
import { communities } from '../mock-data/communities'

// Response type definitions
export interface SearchResult {
  id: string
  type: 'plan' | 'community'
  name: string
  matchReason: string
}

export interface SemanticSearchResponse {
  summary: string
  results: SearchResult[]
  suggestions?: string[]
}

/**
 * Performs AI-powered semantic search across plans and communities
 * using Claude to understand natural language queries via secure backend API
 */
export async function semanticSearch(query: string): Promise<SemanticSearchResponse> {
  try {
    // Always use the secure backend API — API key is server-side only
    return await callBackendAPI(query)
  } catch (error) {
    return getFallbackResponse(query)
  }
}

/**
 * Calls our secure backend API
 */
async function callBackendAPI(query: string): Promise<SemanticSearchResponse> {
  const response = await fetch('/api/semantic-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      plans,
      communities,
    }),
  })

  if (!response.ok) {
    throw new Error('Backend API error')
  }

  const searchResponse = await response.json()

  if (!searchResponse || !searchResponse.summary || !Array.isArray(searchResponse.results)) {
    throw new Error('Invalid response structure')
  }

  return searchResponse
}

/**
 * Returns a fallback response when the API call fails
 */
function getFallbackResponse(query: string): SemanticSearchResponse {
  // Try to do basic substring matching as fallback
  const lowerQuery = query.toLowerCase()
  const results: SearchResult[] = []

  // Simple plan matching
  plans.forEach(plan => {
    const searchableText = `${plan.name} ${plan.beds} ${plan.baths} ${plan.sqft} ${plan.series} ${plan.specLevel} ${plan.planFeatures.join(' ')} ${plan.description}`.toLowerCase()

    if (searchableText.includes(lowerQuery)) {
      results.push({
        id: plan.id,
        type: 'plan',
        name: plan.name,
        matchReason: `Matches your search for "${query}"`,
      })
    }
  })

  // Simple community matching
  communities.forEach(community => {
    const searchableText = `${community.name} ${community.division} ${community.specs}`.toLowerCase()

    if (searchableText.includes(lowerQuery)) {
      results.push({
        id: community.id,
        type: 'community',
        name: community.name,
        matchReason: `Matches your search for "${query}"`,
      })
    }
  })

  // Limit to top 5 results
  const limitedResults = results.slice(0, 5)

  return {
    summary: limitedResults.length > 0
      ? `Found ${limitedResults.length} result${limitedResults.length === 1 ? '' : 's'} matching "${query}". (Note: AI search temporarily unavailable, showing basic results)`
      : `No results found for "${query}". Try searching for bedrooms, square footage, or plan names.`,
    results: limitedResults,
    suggestions: [
      'Show me 3 bedroom homes',
      'Luxury plans with outdoor kitchen',
      'Communities in DFW',
    ],
  }
}

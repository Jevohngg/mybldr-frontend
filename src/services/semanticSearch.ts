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
  const isDevelopment = import.meta.env.DEV
  const devApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  try {
    // In development: call Anthropic directly (requires VITE_ANTHROPIC_API_KEY in .env)
    // In production: call our secure backend API
    if (isDevelopment && devApiKey) {
      return await callAnthropicDirectly(query, devApiKey)
    } else {
      return await callBackendAPI(query)
    }
  } catch (error) {
    return getFallbackResponse(query)
  }
}

/**
 * Calls Anthropic API directly (development only)
 */
async function callAnthropicDirectly(query: string, apiKey: string): Promise<SemanticSearchResponse> {
  const systemPrompt = buildSystemPrompt()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Search query: "${query}"`,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error('Anthropic API error')
  }

  const data = await response.json()
  const messageContent = data.content?.[0]?.text

  if (!messageContent) {
    throw new Error('No content in response')
  }

  const searchResponse = parseClaudeResponse(messageContent)

  if (!searchResponse || !searchResponse.summary || !Array.isArray(searchResponse.results)) {
    throw new Error('Invalid response structure')
  }

  return searchResponse
}

/**
 * Calls our secure backend API (production)
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
 * Builds the system prompt with full data context
 * Used in development mode for direct API calls
 */
function buildSystemPrompt(): string {
  return `You are a search assistant for myBLDR, a home builder platform. Your job is to help users find floor plans and communities based on natural language queries.

AVAILABLE DATA:

FLOOR PLANS:
${JSON.stringify(plans, null, 2)}

COMMUNITIES:
${JSON.stringify(communities, null, 2)}

INSTRUCTIONS:

1. Analyze the user's search query and understand their intent
2. Match their query against the floor plans and communities data provided above
3. Only return items that genuinely match the query criteria
4. Use the actual data values - never fabricate plans or communities that don't exist
5. Return a JSON response with this EXACT structure:

{
  "summary": "A conversational 1-2 sentence natural language answer to the user's query",
  "results": [
    {
      "id": "actual-plan-or-community-id-from-data",
      "type": "plan" or "community",
      "name": "The actual name from the data",
      "matchReason": "Brief explanation of why this matches (1 sentence)"
    }
  ],
  "suggestions": ["Optional: 2-3 related follow-up queries the user might try"]
}

MATCHING GUIDELINES:

For floor plans, consider:
- Bedrooms, bathrooms, square footage
- Series (25', 30', 40', 50', 60')
- Spec level (Signature, Premium, Luxury)
- Plan features (open concept, flex room, spa bath, etc.)
- Structure type (Single Family, Townhome, Villa)
- Number of floors/stories
- Price per square foot
- Divisions/locations
- Collections (River, Heritage, Luxury, Modern, Urban, Estate)
- Specific amenities mentioned in features or descriptions

For communities, consider:
- Community name
- Division/location
- Spec level (Luxury, Town home, Move up)
- Available plans (via planIds)
- Number of lots, lots available
- Total value
- Active builds

RESPONSE REQUIREMENTS:

- Return ONLY valid JSON, no markdown formatting or explanation text
- Keep summary conversational and helpful
- Limit results to the most relevant matches (typically 2-5 items)
- Order results by relevance (best match first)
- If no matches found, return empty results array and explain why in summary
- Make suggestions actionable and related to the user's apparent intent
- Use the exact IDs from the data (e.g., "aspen", "CM-4456")

EXAMPLES:

Query: "3 bedroom home under 2600 sqft"
Response:
{
  "summary": "I found 4 floor plans with 3 bedrooms under 2,600 square feet, ranging from 2,200 to 2,500 sqft.",
  "results": [
    {
      "id": "aspen",
      "type": "plan",
      "name": "The Aspen",
      "matchReason": "3 bedrooms, 2,500 sqft with open concept and flex room"
    },
    {
      "id": "liam",
      "type": "plan",
      "name": "The Liam",
      "matchReason": "3 bedrooms, 2,500 sqft, most affordable at $155/sqft"
    },
    {
      "id": "waterview",
      "type": "plan",
      "name": "The Waterview",
      "matchReason": "3 bedrooms, 2,200 sqft with rooftop terrace"
    }
  ],
  "suggestions": [
    "Show me 4 bedroom homes",
    "What plans have a flex room?",
    "Plans under $175 per square foot"
  ]
}

Query: "luxury homes in DFW"
Response:
{
  "summary": "I found 2 luxury floor plans available in the DFW division, plus 1 luxury community.",
  "results": [
    {
      "id": "serena",
      "type": "plan",
      "name": "The Serena",
      "matchReason": "Luxury spec level, 4 beds/3.5 baths, available in DFW"
    },
    {
      "id": "elena",
      "type": "plan",
      "name": "The Elena",
      "matchReason": "Luxury estate, largest at 3,800 sqft in DFW/Frisco"
    },
    {
      "id": "CM-4456",
      "type": "community",
      "name": "Whispering Hills",
      "matchReason": "Luxury community in DFW with 35 lots and 3 floor plans"
    }
  ],
  "suggestions": [
    "Show me homes with outdoor kitchens",
    "What's available in Whispering Hills?",
    "Luxury homes with 3 car garage"
  ]
}

Remember: Return ONLY the JSON object, no additional text or markdown formatting.`
}

/**
 * Parses Claude's response and extracts the JSON
 * Used in development mode for direct API calls
 */
function parseClaudeResponse(content: string): SemanticSearchResponse {
  try {
    // Try to parse directly first
    const parsed = JSON.parse(content)
    return parsed
  } catch {
    // If direct parse fails, try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1])
    }

    // Try to find JSON object in the text
    const objectMatch = content.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      return JSON.parse(objectMatch[0])
    }

    throw new Error('Could not extract JSON from response')
  }
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

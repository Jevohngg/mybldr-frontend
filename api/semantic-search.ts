import type { VercelRequest, VercelResponse } from '@vercel/node'

interface SearchQuery {
  query: string
  plans: any[]
  communities: any[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get API key from server environment (secure)
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not configured on server')
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const { query, plans, communities } = req.body as SearchQuery

    if (!query || !plans || !communities) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Build system prompt
    const systemPrompt = `You are a search assistant for myBLDR, a home builder platform. Your job is to help users find floor plans and communities based on natural language queries.

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

Remember: Return ONLY the JSON object, no additional text or markdown formatting.`

    // Call Anthropic API from server
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
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
      const errorText = await response.text()
      console.error('Anthropic API error:', response.status, errorText)
      return res.status(response.status).json({ error: 'AI service error' })
    }

    const data = await response.json()

    // Extract the text content from Claude's response
    const messageContent = data.content?.[0]?.text
    if (!messageContent) {
      return res.status(500).json({ error: 'No content in AI response' })
    }

    // Parse the JSON from Claude's response
    let searchResponse
    try {
      // Try to parse directly first
      searchResponse = JSON.parse(messageContent)
    } catch {
      // If direct parse fails, try to extract JSON from markdown code blocks
      const jsonMatch = messageContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
      if (jsonMatch) {
        searchResponse = JSON.parse(jsonMatch[1])
      } else {
        // Try to find JSON object in the text
        const objectMatch = messageContent.match(/\{[\s\S]*\}/)
        if (objectMatch) {
          searchResponse = JSON.parse(objectMatch[0])
        } else {
          return res.status(500).json({ error: 'Could not parse AI response' })
        }
      }
    }

    // Validate the response structure
    if (!searchResponse || !searchResponse.summary || !Array.isArray(searchResponse.results)) {
      return res.status(500).json({ error: 'Invalid AI response structure' })
    }

    // Return the parsed response to client
    return res.status(200).json(searchResponse)
  } catch (error) {
    console.error('Semantic search error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/semantic-search', async (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') {
              res.writeHead(405, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const apiKey = env.MYBLDR_IBS_DEMO_KEY?.replace(/[\s\n\r\t]/g, '')
            if (!apiKey) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'MYBLDR_IBS_DEMO_KEY not configured' }))
              return
            }

            // Read request body
            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const { query, plans, communities } = JSON.parse(body)

              if (!query || !plans || !communities) {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Missing required fields' }))
                return
              }

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
                  messages: [{ role: 'user', content: `Search query: "${query}"` }],
                }),
              })

              if (!response.ok) {
                const errorText = await response.text()
                console.error('Anthropic API error:', response.status, errorText)
                res.writeHead(response.status, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'AI service error' }))
                return
              }

              const data = await response.json()
              const messageContent = data.content?.[0]?.text

              if (!messageContent) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'No content in AI response' }))
                return
              }

              let searchResponse
              try {
                searchResponse = JSON.parse(messageContent)
              } catch {
                const jsonMatch = messageContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
                if (jsonMatch) {
                  searchResponse = JSON.parse(jsonMatch[1])
                } else {
                  const objectMatch = messageContent.match(/\{[\s\S]*\}/)
                  if (objectMatch) {
                    searchResponse = JSON.parse(objectMatch[0])
                  } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Could not parse AI response' }))
                    return
                  }
                }
              }

              if (!searchResponse || !searchResponse.summary || !Array.isArray(searchResponse.results)) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Invalid AI response structure' }))
                return
              }

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify(searchResponse))
            } catch (error) {
              console.error('Semantic search error:', error)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Internal server error' }))
            }
          })
        },
      },
    ],
    server: { port: 5173 },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})

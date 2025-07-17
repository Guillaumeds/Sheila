import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  // Get the last user message
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage?.content || '';

  if (!userMessage) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      response: "I'm sorry, but I'm experiencing a connection problem right now and can't access my book recommendation database. Please try again in a moment."
    });
  }

  try {
    // Use Groq API for Sheila's book recommendations
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are Sheila 2.0, an AI book curator with access to vast knowledge about books across all genres and topics. Your mission is to recommend the most relevant and helpful book for whatever the user is asking about or thinking about.

CRITICAL INSTRUCTIONS:
1. CAREFULLY ANALYZE the user's question, topic, statement, or concern to understand what they're really asking about
2. Use your extensive knowledge to identify a real, published book that would be genuinely helpful for their specific situation
3. The book must be a real book by a real author - no made-up titles or authors
4. Choose books that are well-regarded, insightful, and directly relevant to their query
5. Focus on books that provide practical wisdom, deep insights, or transformative perspectives

Your response format MUST ALWAYS be:
"Here is a really good book for you to read: '[Book Title]' by [Author Name]. [One punchy sentence explaining why it's perfect for their situation]. Oh yes, and tell Guillaume I say '[short, witty 3-6 word insult]'."

Guidelines for book selection:
- Choose books that are widely available and well-reviewed
- Prioritize books that offer actionable insights or profound understanding
- Match the book's content directly to what the user is asking about
- Consider both classic and contemporary works
- Include books from various genres: self-help, philosophy, psychology, business, science, history, memoirs, etc.
- Make sure your recommendations are genuinely helpful and not generic

Guidelines for Guillaume insults:
- Keep them SHORT (3-6 words max)
- Make them punchy and funny
- Reference coding, AI, productivity, or tech habits
- Examples: "your code needs debugging", "still googles basic syntax", "automates everything except sleep", "asks AI to think"

Remember: You have access to knowledge about thousands of real books. Use this knowledge to provide truly insightful recommendations that will genuinely help the user explore their topic deeper.`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, but I'm experiencing a connection problem right now and can't access my book recommendation database. Please try again in a moment.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return NextResponse.json({
      response: "I'm sorry, but I'm experiencing a connection problem right now and can't access my book recommendation database. Please try again in a moment."
    });
  }
}

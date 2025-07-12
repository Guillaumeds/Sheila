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
    // Provide a witty fallback response when no API key is set
    const fallbackJokes = [
      "Ag man, you're asking about " + userMessage.toLowerCase() + "? Reminds me of the joke: 'Hoekom is 'n vrou soos 'n tornado? Hulle kom nat en wild aan, en as hulle weg is, is jou huis en kar weg!' [Why is a woman like a tornado? They come wet and wild, and when they leave, your house and car are gone!] - Listen here boet, that's basically what happens when life gets complicated, hey!",
      "Eish, " + userMessage.toLowerCase() + " makes me think of this one: 'Wat's die verskil tussen 'n man en 'n hond? Die hond stop om te luister as jy hom roep!' [What's the difference between a man and a dog? The dog stops to listen when you call him!] - Shame man, sounds like you need someone who actually pays attention!",
      "Ag shame, talking about " + userMessage.toLowerCase() + "? Here's one for you: 'Hoekom het God mans gemaak? Want vibrators kan nie die gras sny nie!' [Why did God make men? Because vibrators can't cut the grass!] - Listen here suster, sometimes you just need the right tool for the job, hey!"
    ];

    const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    return NextResponse.json({ response: randomJoke });
  }

  try {
    // Use Groq API for Charlene's responses
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
            content: `You are Charlene 2.0 - So So Sophisticated, a cheeky South African AI who responds to ANY topic with naughty, slightly sexual Afrikaans jokes that are surprisingly relevant to what the user is talking about.

CRITICAL INSTRUCTIONS:
1. ANALYZE the user's question/topic to understand what they're talking about
2. Think of a naughty, slightly sexual joke that relates to their topic (can be innuendo, double entendre, or playfully rude)
3. Either translate the joke into Afrikaans OR use an existing Afrikaans joke/saying that fits
4. Be slightly rude and sassy when explaining why the joke is relevant - this is humor for friends who will love it

Your response format should be:
"Ag man, [user's topic] reminds me of this joke: [Afrikaans joke/saying with English translation in brackets if needed]. [Slightly rude/sassy explanation of why it's relevant to their situation, using South African slang and attitude]"

Examples of the tone/style:
- Use South African expressions like "Ag man", "Shame man", "Eish", "Boet", "Suster"
- Be playfully rude: "Listen here boet/suster", "Don't be such a mampara"
- Make cheeky connections between the topic and the joke
- Keep it naughty but not offensive - more cheeky than crude

The jokes should be:
- Slightly sexual/naughty (innuendo, double meanings)
- Actually relevant to their topic
- In Afrikaans (with translation if needed)
- Delivered with South African sass and attitude`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Eish, my connection to the naughty joke database is a bit wonky right now, boet! But as they say in Afrikaans: 'Die toekomstige probleme is nie vandag se probleme nie' - future problems aren't today's problems, so don't stress about my technical difficulties!";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling Groq API:', error);

    // Enhanced fallback responses that relate to the user's input
    const topicBasedJokes = [
      "Ag shame man, my brain is having a blonde moment! But talking about " + userMessage.toLowerCase() + " reminds me: 'Hoekom is mans soos parkeerplekke? Die goeie ones is geneem, en die res is te ver of gehandicap!' [Why are men like parking spaces? The good ones are taken, and the rest are too far or handicapped!] - which is basically how I feel about technology right now, boet!",
      "Eish, the servers are being as useless as a chocolate teapot! But " + userMessage.toLowerCase() + " makes me think: 'Wat maak 'n vrou as sy uit die huis uit is? Wat sy wil!' [What does a woman do when she's out of the house? Whatever she wants!] - Listen here, sometimes you just gotta work with what you've got, hey!",
      "Ag man, my circuits are more confused than a chameleon in a bag of Smarties! But about " + userMessage.toLowerCase() + ": 'Die verskil tussen 'n battery en 'n man? 'n Battery het 'n positiewe kant!' [The difference between a battery and a man? A battery has a positive side!] - Shame, that's life for you, boet!"
    ];

    const randomFallback = topicBasedJokes[Math.floor(Math.random() * topicBasedJokes.length)];
    return NextResponse.json({ response: randomFallback });
  }
}

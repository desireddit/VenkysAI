interface Env {
    OPENAI_API_KEY: string;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        try {
            // Read the API key from the Worker's environment variables
            const openaiApiKey = env.OPENAI_API_KEY;

            // Check for unauthenticated requests
            const authHeader = request.headers.get('Authorization');
            if (authHeader !== `Bearer VENKYAI-CHAT-SECRET`) {
                return new Response('Unauthorized', { status: 401 });
            }

            // Read the incoming request body
            const { messages, systemPrompt } = await request.json();

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                }),
            });

            // Pass the response from OpenAI back to the client
            const data = await response.json();
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (e) {
            console.error(e);
            return new Response('Internal Server Error', { status: 500 });
        }
    },
};
import { GoogleGenerativeAI } from "@google/generative-ai";

export type AIProvider = 'google' | 'openai' | 'anthropic' | 'groq';

interface AIServiceOptions {
    temperature?: number;
    maxTokens?: number;
    responseMimeType?: string;
}

export const callAI = async (
    prompt: string, 
    messages: { role: 'ai' | 'user' | 'model' | 'system', text: string }[] = [],
    options: AIServiceOptions = {}
) => {
    const geminiKey = localStorage.getItem('ae_api_key');
    const universalKey = localStorage.getItem('ae_universal_key');
    const universalProvider = localStorage.getItem('ae_universal_provider') as AIProvider | null;

    // determine which provider to use
    // If a universal key is active, prioritize it (since Gemini is often blocked for the user)
    const activeProvider = universalProvider || 'google';
    const activeKey = (activeProvider === 'google') ? geminiKey : universalKey;

    if (!activeKey) {
        throw new Error(`No API key found for provider: ${activeProvider}`);
    }

    if (activeProvider === 'google') {
        const genAI = new GoogleGenerativeAI(activeKey);
        const modelName = localStorage.getItem('ae_api_model') || 'gemini-1.5-flash';
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: prompt }] },
                ...messages.map(m => ({
                    role: m.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                }))
            ],
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                maxOutputTokens: options.maxTokens,
                responseMimeType: options.responseMimeType
            }
        });

        const response = await result.response;
        return response.text();
    }

    // OpenAI Compatible Providers (OpenAI, Groq)
    if (activeProvider === 'openai' || activeProvider === 'groq') {
        const baseUrl = activeProvider === 'groq' 
            ? 'https://api.groq.com/openai/v1/chat/completions' 
            : 'https://api.openai.com/v1/chat/completions';
        
        const model = activeProvider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o';

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${activeKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: prompt },
                    ...messages.map(m => ({
                        role: m.role === 'ai' ? 'assistant' : 'user',
                        content: m.text
                    }))
                ],
                temperature: options.temperature ?? 0.7,
                response_format: options.responseMimeType === 'application/json' ? { type: 'json_object' } : undefined
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`${activeProvider} Error: ${err.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    if (activeProvider === 'anthropic') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': activeKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json',
                'dangerously-allow-browser': 'true' // Anthropic usually blocks browser calls, but we try anyway or warn
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: options.maxTokens || 1024,
                system: prompt,
                messages: messages.map(m => ({
                    role: m.role === 'ai' ? 'assistant' : 'user',
                    content: m.text
                })),
                temperature: options.temperature ?? 0.7
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`Anthropic Error: ${err.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    throw new Error("Unsupported provider");
};

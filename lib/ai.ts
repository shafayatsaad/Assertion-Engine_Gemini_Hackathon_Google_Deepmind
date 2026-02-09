import { GoogleGenAI } from "@google/genai";

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
    const geminiKey = localStorage.getItem('ae_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
    const universalKey = localStorage.getItem('ae_universal_key');
    const universalProvider = localStorage.getItem('ae_universal_provider') as AIProvider | null;

    // Debug logging
    console.log('🔑 AI Config:', { 
        hasGeminiKey: !!geminiKey, 
        hasUniversalKey: !!universalKey, 
        universalProvider 
    });

    // Force provider based on key format (Failsafe)
    // This solves the issue where settings might say "google" but the user pasted a Groq key
    const detectProvider = (key: string): AIProvider | null => {
        if (!key) return null;
        if (key.startsWith('gsk_')) return 'groq';
        if (key.startsWith('sk-ant')) return 'anthropic';
        if (key.startsWith('sk-') && !key.startsWith('sk-ant')) return 'openai';
        if (key.startsWith('AIza')) return 'google';
        return null; // Unknown or generic
    };

    // Priority 1: Check Universal Key and auto-detect
    let activeProvider: AIProvider | null = null;
    let activeKey: string | null = null;

    if (universalKey) {
        const detected = detectProvider(universalKey);
        if (detected) {
            activeProvider = detected;
            activeKey = universalKey;
        } else {
             // Fallback to stored provider or default to groq
             activeProvider = universalProvider || 'groq';
             activeKey = universalKey;
        }
    } 
    // Priority 2: Check Gemini Key (Env or Local)
    else if (geminiKey) {
        activeProvider = 'google';
        activeKey = geminiKey;
    } else {
        throw new Error(`No API key found. please configure an API key in Settings.`);
    }

    console.log(`🚀 AI Service Init: Provider=${activeProvider} Key=...${activeKey?.slice(-4)}`);

    console.log('🚀 Using provider:', activeProvider);

    if (activeProvider === 'google') {
        const ai = new GoogleGenAI({ apiKey: activeKey });
        const modelName = localStorage.getItem('ae_api_model') || 'gemini-1.5-flash';

        const result = await ai.models.generateContent({
            model: modelName,
            contents: [
                { role: 'user', parts: [{ text: prompt }] },
                ...messages.map(m => ({
                    role: m.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                }))
            ],
            config: {
                temperature: options.temperature ?? 0.7,
                maxOutputTokens: options.maxTokens,
                responseMimeType: options.responseMimeType
            }
        });

        return result.text;
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

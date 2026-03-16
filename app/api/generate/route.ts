import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Allows the serverless function to run a bit longer for large chapters
export const maxDuration = 30;

export async function POST(req: Request) {
    // 1. Extract the text the user pasted from the incoming request
    const { text } = await req.json();

    // 2. Call Gemini and force it to match our exact Zod schema
    const result = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
            tldr: z.array(z.string()).describe('A 3-bullet point engaging summary of the chapter.'),
            audio_script: z.string().describe('A conversational, 1-minute script summarizing the chapter, written to be read aloud.'),
            questions: z.array(z.string()).describe('4 thought-provoking discussion questions for a small group.'),
        }),
        prompt: `You are an engaging, Reformed Presbyterian Christian small group leader. Read the following book chapter and generate a study guide. Chapter Text: ${text}`,
    });

    // 3. Return the perfectly structured JSON back to the frontend
    return result.toJsonResponse();
}
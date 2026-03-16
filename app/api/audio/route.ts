import OpenAI from 'openai';

// Initialize the OpenAI client using the key from your .env.local file
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    // Extract the script text that we want to turn into audio
    const { text } = await req.json();

    try {
        // Call the OpenAI Text-to-Speech API
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy", // 'alloy' is a great, neutral, podcast-style voice
            input: text,
        });

        // Convert the raw audio data into a Buffer
        const buffer = Buffer.from(await mp3.arrayBuffer());

        // Send the audio file back to the frontend
        return new Response(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });
    } catch (error) {
        console.error("Audio generation failed:", error);
        return new Response("Error generating audio", { status: 500 });
    }
}
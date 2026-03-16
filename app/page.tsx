'use client';

import { useState } from 'react';

export default function Home() {
  // 1. State Management: Tracking the user's input and the app's status
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [studyGuide, setStudyGuide] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // 2. The Orchestration Logic: What happens when they click "Generate"
  const handleGenerate = async () => {
    if (!inputText) return;

    // Reset UI for a new generation
    setIsGenerating(true);
    setStudyGuide(null);
    setAudioUrl(null);

    try {
      // API Call 1: Get the structured data from Gemini
      setStatus('Gemini is reading the chapter...');
      const textResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!textResponse.ok) throw new Error("Failed to generate text");
      const data = await textResponse.json();
      setStudyGuide(data); // Display the text immediately to the user

      // API Call 2: Generate the audio using the script Gemini just wrote
      setStatus('Recording podcast audio...');
      const audioResponse = await fetch('/api/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.audio_script }),
      });

      if (!audioResponse.ok) throw new Error("Failed to generate audio");

      // Convert the raw audio buffer into a playable browser URL
      const audioBlob = await audioResponse.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

    } catch (error) {
      console.error("Generation error:", error);
      alert("Something went wrong. Please check the console and try again.");
    } finally {
      // Clean up the loading states
      setIsGenerating(false);
      setStatus('');
    }
  };

  // 3. The UI Rendering: Using Tailwind CSS for a clean, modern look
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manna | AI Study Tool</h1>
          <p className="text-slate-600 mt-2 text-lg">Turn any book chapter into bite-sized fun and discussion</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: The Input Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Paste Chapter Text
            </label>
            <textarea
              className="w-full h-96 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all"
              placeholder="Paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inputText}
              className="mt-4 w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors shadow-sm"
            >
              {isGenerating ? status : 'Generate Study Guide'}
            </button>
          </div>

          {/* Right Side: The Dynamic Output */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[32rem]">
            {!studyGuide && !isGenerating ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-center">
                <p>Your summary, audio, and questions <br /> will appear here.</p>
              </div>
            ) : isGenerating && !studyGuide ? (
              <div className="h-full flex flex-col items-center justify-center text-indigo-600 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                <p className="font-medium animate-pulse">{status}</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Section 1: TLDR */}
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">💡 Chapter Summary</h2>
                  <ul className="space-y-3 text-slate-700">
                    {studyGuide?.tldr?.map((point: string, i: number) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <hr className="border-slate-100" />

                {/* Section 2: Audio Player */}
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">🎧 Listen on the Go</h2>
                  {audioUrl ? (
                    <audio controls className="w-full outline-none" src={audioUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <p className="text-slate-500 italic animate-pulse">{status}</p>
                  )}
                </section>
                <hr className="border-slate-100" />

                {/* Section 3: Questions */}
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">💬 Discussion Questions</h2>
                  <div className="space-y-4">
                    {studyGuide?.questions?.map((q: string, i: number) => (
                      <div key={i} className="bg-indigo-50/50 p-4 rounded-xl text-indigo-950 font-medium border border-indigo-100">
                        {i + 1}. {q}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
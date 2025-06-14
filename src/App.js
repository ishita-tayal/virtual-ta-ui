// App.jsx
import React, { useState } from 'react';
import './App.css';
import { Sparkles, Loader2, ImagePlus, NotebookPen, HelpCircle, Stars } from 'lucide-react';

function App() {
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    setLoading(true);

    const payload = {
      question,
      image: null,
    };

    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        payload.image = reader.result.split(',')[1];
        await sendRequest(payload);
      };
      reader.readAsDataURL(image);
    } else {
      await sendRequest(payload);
    }
  };

  const sendRequest = async (payload) => {
    try {
      const res = await fetch('https://virtual-ta-khaki.vercel.app/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch response');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "Tell me about the TDS course",
    "When is the GA2 deadline?",
    "If a student scores 10/10 on GA4 as well as a bonus, how would it appear on the dashboard?",
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-yellow-100 text-gray-900 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden"
      style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)' }}
    >
      {/* Sparkles background */}
      <div className="absolute inset-0 bg-[radial-gradient(#fcd5ce_1px,transparent_1px)] [background-size:16px_16px] opacity-50 z-0 pointer-events-none"></div>

      <h1 className="text-4xl md:text-5xl font-extrabold mb-1 tracking-tight text-center flex items-center gap-2 text-pink-700 z-10">
        <Sparkles className="text-yellow-500 animate-ping-slow" /> Virtual TA
      </h1>
      <p className="text-lg md:text-xl mb-6 text-center font-medium italic text-pink-800 z-10">for IIT Madras BS Degree - TDS Course</p>

      <div className="mb-8 bg-white text-black rounded-3xl p-6 shadow-xl w-full max-w-xl border border-pink-200 relative z-10">
        <h2 className="text-xl font-bold mb-3 text-pink-800 flex items-center gap-2">
          <HelpCircle className="text-pink-600" size={20} /> Sample Questions
        </h2>
        <ul className="list-none space-y-3">
          {sampleQuestions.map((q, idx) => (
            <li
              key={idx}
              onClick={() => setQuestion(q)}
              className="cursor-pointer bg-pink-100 hover:bg-pink-200 text-pink-900 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm"
            >
              <NotebookPen className="inline mr-2 text-pink-700" size={16} /> {q}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl text-black border border-pink-200 z-10">
        <label className="block text-lg font-semibold mb-2">Enter your question:</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          rows="4"
          required
        />
        <label className="block mt-4 text-md font-medium mb-1">Upload image (optional):</label>
        <div className="flex items-center gap-2 mb-4">
          <ImagePlus className="text-pink-500" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
        >
          Ask
        </button>
      </form>

      {loading && (
        <div className="mt-6 flex items-center gap-2 text-lg font-medium animate-pulse text-pink-600 z-10">
          <Loader2 className="animate-spin" /> Processing your question...
        </div>
      )}

      {error && <p className="mt-6 text-red-500 font-semibold z-10">{error}</p>}

      {response && (
        <div className="w-full max-w-2xl mt-8 bg-white text-black p-6 rounded-3xl shadow-xl border border-pink-300 z-10">
          <h2 className="text-2xl font-bold mb-3 text-pink-700 flex items-center gap-2">
            <Stars className="text-yellow-400" /> Answer:
          </h2>
          <p className="mb-4 whitespace-pre-wrap leading-relaxed text-gray-800 bg-pink-50 p-4 rounded-lg border border-pink-100">
            {response.answer}
          </p>
          {response.links && response.links.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-pink-800">References:</h3>
              <ul className="list-disc ml-6 space-y-1">
                {response.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 underline hover:text-pink-800"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
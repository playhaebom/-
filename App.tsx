import React, { useState, useCallback } from 'react';
import { generateFlashcards } from './services/geminiService';
import type { FlashcardData } from './types';
import Flashcard from './components/Flashcard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFlashcards([]);

    try {
      const generated = await generateFlashcards(topic);
      setFlashcards(generated);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini 플래시 메이커
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            주제를 입력하고 즉시 플래시 카드를 만드세요.
          </p>
        </header>

        <div className="max-w-2xl mx-auto bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex flex-col gap-4">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 태양계, React Hooks, 제2차 세계대전..."
              className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow duration-300 resize-none h-28"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>생성 중...</span>
                </>
              ) : (
                '플래카드 생성'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-center mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg max-w-2xl mx-auto">
            <p>{error}</p>
          </div>
        )}
        
        <div className="mt-12">
          {isLoading && <LoadingSpinner />}

          {flashcards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((card, index) => (
                <Flashcard key={index} question={card.question} answer={card.answer} />
              ))}
            </div>
          )}

          {!isLoading && flashcards.length === 0 && !error && (
             <div className="text-center text-gray-500 mt-12">
                <p>플래시 카드는 생성되면 여기에 표시됩니다.</p>
                <p>위의 주제를 입력하고 버튼을 클릭하여 시작하세요!</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
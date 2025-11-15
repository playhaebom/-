import React, { useState } from 'react';
import type { FlashcardData } from '../types';

const Flashcard: React.FC<FlashcardData> = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="group w-full h-64 [perspective:1000px] cursor-pointer"
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of the card (Question) */}
        <div className="absolute w-full h-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 flex flex-col justify-center items-center text-center [backface-visibility:hidden]">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">질문</h3>
          <p className="text-gray-200">{question}</p>
           <div className="absolute bottom-4 text-xs text-gray-500">클릭하여 답변 보기</div>
        </div>

        {/* Back of the card (Answer) */}
        <div className="absolute w-full h-full bg-blue-900 border border-blue-700 rounded-lg shadow-lg p-6 flex flex-col justify-center items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">답변</h3>
          <p className="text-gray-100">{answer}</p>
          <div className="absolute bottom-4 text-xs text-blue-300">클릭하여 질문 보기</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Star, Coins, DollarSign, CreditCard } from 'lucide-react';

interface BingoCardProps {
  calledNumbers: string[];
  onBingoLinesChange?: (lines: string[]) => void;
}

export interface BingoCardRef {
  checkBingoLines: () => boolean;
}

const BingoCard = forwardRef<BingoCardRef, BingoCardProps>(({ calledNumbers, onBingoLinesChange }, ref) => {
  const [daubedNumbers, setDaubedNumbers] = useState<Set<string>>(new Set());
  const [bingoLines, setBingoLines] = useState<string[]>([]);

  // Generate BINGO card numbers
  const generateCardNumbers = () => {
    const card: string[][] = [];
    const letters = ['B', 'I', 'N', 'G', 'O'];
    const ranges = [
      [1, 15], [16, 30], [31, 45], [46, 60], [61, 75]
    ];
    
    for (let col = 0; col < 5; col++) {
      const [start, end] = ranges[col];
      const columnNumbers: string[] = [];
      
      // Generate 5 unique numbers for this column
      const numbers = [];
      for (let i = start; i <= end; i++) {
        numbers.push(i);
      }
      
      // Shuffle and take first 5
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        columnNumbers.push(letters[col] + numbers[randomIndex]);
        numbers.splice(randomIndex, 1);
      }
      
      card.push(columnNumbers);
    }
    
    return card;
  };

  const [cardNumbers] = useState(() => generateCardNumbers());

  // Auto-daub numbers when they're called
  useEffect(() => {
    calledNumbers.forEach(number => {
      setDaubedNumbers(prev => new Set([...prev, number]));
    });
  }, [calledNumbers]);

  // Check for BINGO lines
  const checkBingoLines = (): boolean => {
    const lines: string[] = [];
    
    // Check horizontal lines
    for (let row = 0; row < 5; row++) {
      let isComplete = true;
      for (let col = 0; col < 5; col++) {
        if (col === 2 && row === 2) continue; // Skip free space
        if (!daubedNumbers.has(cardNumbers[col][row])) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        lines.push(`Row ${row + 1}`);
      }
    }
    
    // Check vertical lines
    for (let col = 0; col < 5; col++) {
      let isComplete = true;
      for (let row = 0; row < 5; row++) {
        if (col === 2 && row === 2) continue; // Skip free space
        if (!daubedNumbers.has(cardNumbers[col][row])) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        lines.push(`Column ${String.fromCharCode(65 + col)}`);
      }
    }
    
    // Check diagonal lines
    let diagonal1Complete = true;
    let diagonal2Complete = true;
    
    for (let i = 0; i < 5; i++) {
      if (i === 2) continue; // Skip free space
      if (!daubedNumbers.has(cardNumbers[i][i])) {
        diagonal1Complete = false;
      }
      if (!daubedNumbers.has(cardNumbers[i][4 - i])) {
        diagonal2Complete = false;
      }
    }
    
    if (diagonal1Complete) lines.push('Diagonal \\');
    if (diagonal2Complete) lines.push('Diagonal /');
    
    setBingoLines(lines);
    if (onBingoLinesChange) {
      onBingoLinesChange(lines);
    }
    
    return lines.length > 0;
  };

  // Expose checkBingoLines method to parent
  useImperativeHandle(ref, () => ({
    checkBingoLines
  }));

  // Get icon for daubed numbers
  const getDaubIcon = (number: string) => {
    const num = parseInt(number.slice(1));
    if (num % 3 === 0) return <Coins className="w-4 h-4 text-yellow-400" />;
    if (num % 5 === 0) return <DollarSign className="w-4 h-4 text-green-400" />;
    if (num % 7 === 0) return <CreditCard className="w-4 h-4 text-purple-400" />;
    return <Star className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl">
      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
          <div
            key={letter}
            className={`text-center font-black text-lg py-2 rounded-lg ${
              index === 0 ? 'bg-red-500 text-white' :
              index === 1 ? 'bg-orange-500 text-white' :
              index === 2 ? 'bg-green-500 text-white' :
              index === 3 ? 'bg-blue-500 text-white' :
              'bg-purple-500 text-white'
            }`}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* BINGO Grid */}
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 5 }, (_, col) => {
            const number = cardNumbers[col][row];
            const isFreeSpace = col === 2 && row === 2;
            const isDaubed = daubedNumbers.has(number);
            
            return (
              <div
                key={`${col}-${row}`}
                className={`
                  aspect-square flex items-center justify-center rounded-lg border-2 font-bold text-sm relative
                  ${isFreeSpace 
                    ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-500 text-white' 
                    : isDaubed
                    ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors'
                  }
                `}
              >
                {isFreeSpace ? (
                  <Star className="w-6 h-6 text-white" />
                ) : (
                  <>
                    <span className="z-10">{number.slice(1)}</span>
                    {isDaubed && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-80">
                        {getDaubIcon(number)}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* BINGO Lines Status */}
      {bingoLines.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
          <div className="text-center text-white font-bold">
            🎯 BINGO Lines Found: {bingoLines.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
});

BingoCard.displayName = 'BingoCard';

export default BingoCard;
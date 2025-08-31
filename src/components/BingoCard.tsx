import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Star, Coins, DollarSign, CreditCard, Sparkles } from 'lucide-react';

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
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

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
    if (num % 3 === 0) return <Coins className="w-6 h-6 text-yellow-400" />;
    if (num % 5 === 0) return <DollarSign className="w-6 h-6 text-green-400" />;
    if (num % 7 === 0) return <CreditCard className="w-6 h-6 text-purple-400" />;
    return <Star className="w-6 h-6 text-blue-400" />;
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl p-8 shadow-2xl border-4 border-yellow-400/50 transform hover:scale-105 transition-all duration-500">
      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
          <div
            key={letter}
            className={`text-center font-black text-2xl py-4 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300 ${
              index === 0 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/50' :
              index === 1 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/50' :
              index === 2 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/50' :
              index === 3 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/50' :
              'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/50'
            }`}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* BINGO Grid */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 5 }, (_, col) => {
            const number = cardNumbers[col][row];
            const isFreeSpace = col === 2 && row === 2;
            const isDaubed = daubedNumbers.has(number);
            const cellKey = `${col}-${row}`;
            
            return (
              <div
                key={cellKey}
                onMouseEnter={() => setHoveredCell(cellKey)}
                onMouseLeave={() => setHoveredCell(null)}
                className={`
                  aspect-square flex items-center justify-center rounded-2xl border-4 font-bold text-lg relative
                  transform transition-all duration-300 cursor-pointer
                  ${isFreeSpace 
                    ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-500 text-white shadow-lg shadow-red-500/50' 
                    : isDaubed
                    ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-500 text-white shadow-lg shadow-green-500/50 animate-pulse'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-700 hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200 hover:border-blue-400 hover:scale-110 hover:shadow-lg'
                  }
                  ${hoveredCell === cellKey && !isDaubed && !isFreeSpace ? 'ring-4 ring-blue-400/50 ring-offset-2' : ''}
                `}
              >
                {isFreeSpace ? (
                  <div className="relative">
                    <Star className="w-8 h-8 text-white animate-bounce" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                ) : (
                  <>
                    <span className="z-10 font-black text-xl">{number.slice(1)}</span>
                    {isDaubed && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-90 animate-pulse">
                        {getDaubIcon(number)}
                        {/* Sparkle effect */}
                        <div className="absolute -top-1 -right-1">
                          <Sparkles className="w-4 h-4 text-yellow-400 animate-ping" />
                        </div>
                      </div>
                    )}
                    {/* Hover effect for numbers */}
                    {hoveredCell === cellKey && !isDaubed && !isFreeSpace && (
                      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl animate-pulse"></div>
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
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg animate-pulse">
          <div className="text-center text-white font-bold text-lg">
            🎯 BINGO Lines Found: {bingoLines.join(', ')}
          </div>
          <div className="text-center text-white/90 text-sm mt-1">
            You can call BINGO now!
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-6 text-center">
        <div className="text-gray-600 font-medium">
          Daubed: {daubedNumbers.size} / 24
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(daubedNumbers.size / 24) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});

BingoCard.displayName = 'BingoCard';

export default BingoCard;
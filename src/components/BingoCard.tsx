import React, { useState } from 'react';

interface BingoCardProps {
  calledNumbers: number[];
  onBingo: () => void;
  bingoAchieved: boolean;
}

const BingoCard: React.FC<BingoCardProps> = ({ calledNumbers, onBingo, bingoAchieved }) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  // Generate a random BINGO card
  const generateBingoCard = () => {
    const card: number[][] = [];
    const ranges = [
      [1, 15],   // B
      [16, 30],  // I
      [31, 45],  // N
      [46, 60],  // G
      [61, 75]   // O
    ];

    for (let col = 0; col < 5; col++) {
      const [min, max] = ranges[col];
      const column: number[] = [];
      
      // Generate 5 unique numbers for this column
      while (column.length < 5) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!column.includes(num)) {
          column.push(num);
        }
      }
      
      card.push(column);
    }

    // Free space in center
    card[2][2] = 0; // 0 represents free space
    
    return card;
  };

  const [bingoCard] = useState(() => generateBingoCard());

  const isNumberCalled = (number: number) => {
    return calledNumbers.includes(number);
  };

  const getBingoLetter = (colIndex: number) => {
    const letters = ['B', 'I', 'N', 'G', 'O'];
    return letters[colIndex];
  };

  const getBingoColor = (colIndex: number) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
    return colors[colIndex];
  };

  const checkBingo = () => {
    // Check rows
    for (let row = 0; row < 5; row++) {
      if (bingoCard.every((col, colIndex) => col[row] === 0 || isNumberCalled(col[row]))) {
        return true;
      }
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      if (bingoCard[col].every(num => num === 0 || isNumberCalled(num))) {
        return true;
      }
    }
    
    // Check diagonals
    if (bingoCard.every((col, colIndex) => col[colIndex] === 0 || isNumberCalled(col[colIndex]))) {
      return true;
    }
    
    if (bingoCard.every((col, colIndex) => col[4 - colIndex] === 0 || isNumberCalled(col[4 - colIndex]))) {
      return true;
    }
    
    return false;
  };

  // Check for BINGO when called numbers change
  React.useEffect(() => {
    if (!bingoAchieved && checkBingo()) {
      onBingo();
    }
  }, [calledNumbers, bingoAchieved, onBingo]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl border-4 border-blue-400">
      {/* Header Row */}
      <div className="flex mb-4">
        {[0, 1, 2, 3, 4].map((colIndex) => (
          <div
            key={colIndex}
            className={`w-16 h-16 ${getBingoColor(colIndex)} rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-1`}
          >
            {getBingoLetter(colIndex)}
          </div>
        ))}
      </div>

      {/* BINGO Card Grid */}
      <div className="grid grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map((rowIndex) => (
          [0, 1, 2, 3, 4].map((colIndex) => {
            const number = bingoCard[colIndex][rowIndex];
            const isCalled = number === 0 || isNumberCalled(number);
            const isHovered = hoveredCell === rowIndex * 5 + colIndex;
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-16 h-16 rounded-lg border-2 border-gray-300 flex items-center justify-center font-bold text-lg transition-all duration-200 cursor-pointer
                  ${isCalled 
                    ? 'bg-blue-400 text-white shadow-lg transform scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                  ${isHovered ? 'ring-4 ring-yellow-300' : ''}
                `}
                onMouseEnter={() => setHoveredCell(rowIndex * 5 + colIndex)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {number === 0 ? (
                  <div className="text-blue-400 text-2xl">💎</div>
                ) : (
                  <span className={isCalled ? 'animate-pulse' : ''}>
                    {number}
                  </span>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default BingoCard;
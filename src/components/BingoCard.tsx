import React, { useState, useEffect } from 'react';

interface BingoCardProps {
  calledNumbers: number[];
  gameActive: boolean;
  onBingo: (lines: number) => void;
}

const BingoCard: React.FC<BingoCardProps> = ({ calledNumbers, gameActive, onBingo }) => {
  const [markedNumbers, setMarkedNumbers] = useState<Set<number>>(new Set());
  const [autoDaub, setAutoDaub] = useState(true);
  
  const bingoCard = [
    [3, 20, 39, 48, 66],
    [4, 25, 31, 53, 62],
    [8, 19, 'FREE', 46, 72],
    [11, 24, 44, 55, 69],
    [7, 16, 43, 47, 63]
  ];

  // Auto-mark numbers when they're called
  useEffect(() => {
    if (autoDaub && gameActive) {
      const newMarked = new Set(markedNumbers);
      calledNumbers.forEach(num => {
        if (typeof num === 'number') {
          newMarked.add(num);
        }
      });
      setMarkedNumbers(newMarked);
    }
  }, [calledNumbers, autoDaub, gameActive, markedNumbers]);

  // Check for bingo lines
  useEffect(() => {
    if (gameActive && markedNumbers.size >= 5) {
      const lines = checkBingoLines();
      if (lines > 0) {
        onBingo(lines);
      }
    }
  }, [markedNumbers, gameActive, onBingo]);

  const checkBingoLines = (): number => {
    let lines = 0;
    
    // Check rows
    for (let row = 0; row < 5; row++) {
      let rowComplete = true;
      for (let col = 0; col < 5; col++) {
        const cell = bingoCard[row][col];
        if (cell !== 'FREE' && !markedNumbers.has(cell as number)) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) lines++;
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      let colComplete = true;
      for (let row = 0; row < 5; row++) {
        const cell = bingoCard[row][col];
        if (cell !== 'FREE' && !markedNumbers.has(cell as number)) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) lines++;
    }
    
    // Check diagonals
    let diagonal1Complete = true;
    let diagonal2Complete = true;
    
    for (let i = 0; i < 5; i++) {
      const cell1 = bingoCard[i][i];
      const cell2 = bingoCard[i][4 - i];
      
      if (cell1 !== 'FREE' && !markedNumbers.has(cell1 as number)) {
        diagonal1Complete = false;
      }
      if (cell2 !== 'FREE' && !markedNumbers.has(cell2 as number)) {
        diagonal2Complete = false;
      }
    }
    
    if (diagonal1Complete) lines++;
    if (diagonal2Complete) lines++;
    
    return lines;
  };

  const toggleNumber = (num: number | string) => {
    if (!gameActive) return;
    
    if (typeof num === 'number') {
      const newMarked = new Set(markedNumbers);
      if (newMarked.has(num)) {
        newMarked.delete(num);
      } else {
        newMarked.add(num);
      }
      setMarkedNumbers(newMarked);
    }
  };

  const toggleAutoDaub = () => {
    setAutoDaub(!autoDaub);
  };

  const getBingoLines = (): number => {
    return checkBingoLines();
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl p-6 border-2 border-purple-400/30">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-white mb-2">YOUR BINGO CARD</h3>
        <div className="flex justify-center space-x-2 mb-4">
          {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
            <div key={letter} className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-xl ${
              ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'][index]
            }`}>
              {letter}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {bingoCard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => toggleNumber(cell)}
              disabled={!gameActive}
              className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                cell === 'FREE' 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                  : typeof cell === 'number' && markedNumbers.has(cell)
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-95'
                  : 'bg-white/90 text-gray-800 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {cell}
            </button>
          ))
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-white/80 text-sm">
          Numbers marked: {markedNumbers.size} | Bingo lines: {getBingoLines()}
        </div>
        <button 
          onClick={toggleAutoDaub}
          className={`font-bold py-2 px-4 rounded-full text-sm transition-all ${
            autoDaub 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          AUTO-DAUB {autoDaub ? 'ON' : 'OFF'}
        </button>
      </div>
      
      {!gameActive && (
        <div className="mt-4 text-center text-white/60 text-sm">
          Start a game to begin playing!
        </div>
      )}
    </div>
  );
};

export default BingoCard;
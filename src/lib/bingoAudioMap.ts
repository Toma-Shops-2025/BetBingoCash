// BINGO Number to Audio File Mapping for Adam's Voice
// This maps each BINGO number to its corresponding audio file

export interface BingoNumber {
  letter: 'B' | 'I' | 'N' | 'G' | 'O';
  number: number;
  fullCall: string; // e.g., "B1", "I19", "N31"
  audioFile: string; // e.g., "B1.mp3", "I19.mp3"
}

// Generate all BINGO numbers with their audio mappings
export const generateBingoNumbers = (): BingoNumber[] => {
  const numbers: BingoNumber[] = [];
  
  // B numbers: 1-15
  for (let i = 1; i <= 15; i++) {
    numbers.push({
      letter: 'B',
      number: i,
      fullCall: `B${i}`,
      audioFile: `B${i}.mp3`
    });
  }
  
  // I numbers: 16-30
  for (let i = 16; i <= 30; i++) {
    numbers.push({
      letter: 'I',
      number: i,
      fullCall: `I${i}`,
      audioFile: `I${i}.mp3`
    });
  }
  
  // N numbers: 31-45
  for (let i = 31; i <= 45; i++) {
    numbers.push({
      letter: 'N',
      number: i,
      fullCall: `N${i}`,
      audioFile: `N${i}.mp3`
    });
  }
  
  // G numbers: 46-60
  for (let i = 46; i <= 60; i++) {
    numbers.push({
      letter: 'G',
      number: i,
      fullCall: `G${i}`,
      audioFile: `G${i}.mp3`
    });
  }
  
  // O numbers: 61-75
  for (let i = 61; i <= 75; i++) {
    numbers.push({
      letter: 'O',
      number: i,
      fullCall: `O${i}`,
      audioFile: `O${i}.mp3`
    });
  }
  
  return numbers;
};

// Get a specific BINGO number by its value
export const getBingoNumber = (number: number): BingoNumber | null => {
  const allNumbers = generateBingoNumbers();
  return allNumbers.find(n => n.number === number) || null;
};

// Get the audio file path for a specific number
export const getAudioFileForNumber = (number: number): string | null => {
  const bingoNumber = getBingoNumber(number);
  return bingoNumber ? `/audio/adam-voice/${bingoNumber.audioFile}` : null;
};

// Get the display text for a number (e.g., "B1", "I19")
export const getDisplayTextForNumber = (number: number): string | null => {
  const bingoNumber = getBingoNumber(number);
  return bingoNumber ? bingoNumber.fullCall : null;
};

// Validate if a number is a valid BINGO number
export const isValidBingoNumber = (number: number): boolean => {
  return number >= 1 && number <= 75;
};

// Get all numbers for a specific letter
export const getNumbersForLetter = (letter: 'B' | 'I' | 'N' | 'G' | 'O'): number[] => {
  const allNumbers = generateBingoNumbers();
  return allNumbers
    .filter(n => n.letter === letter)
    .map(n => n.number);
}; 
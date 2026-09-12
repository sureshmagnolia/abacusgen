/**
 * Abacus Question Paper & Answer Key Generator
 * Mathematical engine and DOM renderer for competitive abacus exams.
 */

(function () {
  'use strict';

  // --- State Configuration ---
  const state = {
    currentLevel: 'levelA',
    year: '2025',
    time: '08 MINUTES',
    category: 'CATEGORY A (FOR FIRST LEVEL STUDENTS)',
    title: 'PANCHAYAT LEVEL ABACUS EXAM',
    subtitle: 'WITH ABACUS ONLY',
    rows: 5,
    digits: 1, // 1, 2, or 'mixed'
    maxTotal: 9,
    allowNegatives: true,
    paperCode: 'PNC-2025-A-01',
    seed: null,
    zoom: 1.0,
    currentView: 'both',
    questions: [] // Array of { qNum: number, numbers: number[], answer: number }
  };

  // Official Past Panchayat Exam Datasets
  const OFFICIAL_PAPERS = {
    official_2025: {
      name: 'Official Panchayat Exam 2025',
      year: '2025',
      time: '08 MINUTES',
      category: 'CATEGORY A (FOR FIRST LEVEL STUDENTS)',
      title: 'PANCHAYAT LEVEL ABACUS EXAM',
      subtitle: 'WITH ABACUS ONLY',
      paperCode: 'PNC-2025-OFFICIAL-KEY',
      rows: 5,
      digits: 1,
      questions: [{"qNum": 1, "numbers": [2, 5, 1, -2, 2], "answer": 8}, {"qNum": 2, "numbers": [1, 5, 2, -3, 2], "answer": 7}, {"qNum": 3, "numbers": [5, 2, 2, -2, 2], "answer": 9}, {"qNum": 4, "numbers": [2, 1, 1, 5, -4], "answer": 5}, {"qNum": 5, "numbers": [1, 5, 2, -3, 2], "answer": 7}, {"qNum": 6, "numbers": [2, 2, 5, -2, 2], "answer": 9}, {"qNum": 7, "numbers": [2, -1, 5, 3, -2], "answer": 7}, {"qNum": 8, "numbers": [1, 1, 5, 1, -3], "answer": 5}, {"qNum": 9, "numbers": [1, 2, 1, -4, 4], "answer": 4}, {"qNum": 10, "numbers": [8, -3, 2, -1, 3], "answer": 9}, {"qNum": 11, "numbers": [2, 1, 1, -3, 5], "answer": 6}, {"qNum": 12, "numbers": [1, 1, 5, 1, -3], "answer": 5}, {"qNum": 13, "numbers": [4, 5, -2, 2, -2], "answer": 7}, {"qNum": 14, "numbers": [1, 3, -2, 5, -2], "answer": 5}, {"qNum": 15, "numbers": [8, -5, -2, 2, 1], "answer": 4}, {"qNum": 16, "numbers": [3, 5, 1, -2, 1], "answer": 8}, {"qNum": 17, "numbers": [2, 2, -4, 2, 1], "answer": 3}, {"qNum": 18, "numbers": [1, 5, 3, -5, 5], "answer": 9}, {"qNum": 19, "numbers": [6, -5, 1, 2, 5], "answer": 9}, {"qNum": 20, "numbers": [1, 1, 2, -4, 5], "answer": 5}, {"qNum": 21, "numbers": [2, 5, -1, 1, -1], "answer": 6}, {"qNum": 22, "numbers": [8, 1, -5, 5, -4], "answer": 5}, {"qNum": 23, "numbers": [4, -2, 2, -2, 2], "answer": 4}, {"qNum": 24, "numbers": [8, 1, -5, 5, -4], "answer": 5}, {"qNum": 25, "numbers": [2, 1, 1, -3, -1], "answer": 0}, {"qNum": 26, "numbers": [1, 5, 1, -2, 1], "answer": 6}, {"qNum": 27, "numbers": [2, 2, 5, -2, 2], "answer": 9}, {"qNum": 28, "numbers": [2, -1, 5, 3, -2], "answer": 7}, {"qNum": 29, "numbers": [1, 1, 5, 1, -3], "answer": 5}, {"qNum": 30, "numbers": [4, 5, -2, 2, -2], "answer": 7}, {"qNum": 31, "numbers": [2, 2, -4, 2, 1], "answer": 3}, {"qNum": 32, "numbers": [8, -5, 1, 5, -1], "answer": 8}, {"qNum": 33, "numbers": [2, 5, 2, -5, 5], "answer": 9}, {"qNum": 34, "numbers": [5, 1, 2, -1, 1], "answer": 8}, {"qNum": 35, "numbers": [2, 1, 1, -3, -1], "answer": 0}, {"qNum": 36, "numbers": [1, 3, -3, 5, 2], "answer": 8}, {"qNum": 37, "numbers": [1, 3, 5, -5, 5], "answer": 9}, {"qNum": 38, "numbers": [2, 5, 1, 1, -1], "answer": 8}, {"qNum": 39, "numbers": [7, -5, 1, -2, 3], "answer": 4}, {"qNum": 40, "numbers": [2, 1, 5, 1, -4], "answer": 5}, {"qNum": 41, "numbers": [1, 2, 5, -2, 3], "answer": 9}, {"qNum": 42, "numbers": [2, 1, 1, 5, -4], "answer": 5}, {"qNum": 43, "numbers": [1, 2, 5, 1, -4], "answer": 5}, {"qNum": 44, "numbers": [2, 5, -5, 2, -1], "answer": 3}, {"qNum": 45, "numbers": [2, 1, 5, -1, 1], "answer": 8}, {"qNum": 46, "numbers": [1, 2, 5, -2, 3], "answer": 9}, {"qNum": 47, "numbers": [6, 3, -2, 1, -2], "answer": 6}, {"qNum": 48, "numbers": [2, 1, 5, -1, 1], "answer": 8}, {"qNum": 49, "numbers": [2, 1, 1, 5, -4], "answer": 5}, {"qNum": 50, "numbers": [4, -2, 2, -2, 2], "answer": 4}, {"qNum": 51, "numbers": [2, 1, 1, -3, -1], "answer": 0}, {"qNum": 52, "numbers": [1, 5, 1, 1, -2], "answer": 6}, {"qNum": 53, "numbers": [5, 4, -2, 1, -2], "answer": 6}, {"qNum": 54, "numbers": [8, 1, -5, 5, -4], "answer": 5}, {"qNum": 55, "numbers": [4, -1, -3, 3, 5], "answer": 8}, {"qNum": 56, "numbers": [1, 2, 5, 1, -4], "answer": 5}, {"qNum": 57, "numbers": [2, 5, 2, -5, 5], "answer": 9}, {"qNum": 58, "numbers": [5, 1, 1, 2, -4], "answer": 5}, {"qNum": 59, "numbers": [2, 1, 1, -4, 5], "answer": 5}, {"qNum": 60, "numbers": [1, 1, 2, -1, -1], "answer": 2}, {"qNum": 61, "numbers": [2, 1, 5, 1, -3], "answer": 6}, {"qNum": 62, "numbers": [5, 3, 1, -4, 2], "answer": 7}, {"qNum": 63, "numbers": [1, 5, 2, 1, -1], "answer": 8}, {"qNum": 64, "numbers": [1, 2, -3, 3, 5], "answer": 8}, {"qNum": 65, "numbers": [3, 1, 5, -3, 3], "answer": 9}, {"qNum": 66, "numbers": [1, 1, 2, 5, -2], "answer": 7}, {"qNum": 67, "numbers": [4, 5, -3, -1, 4], "answer": 9}, {"qNum": 68, "numbers": [5, 2, -1, 2, 1], "answer": 9}, {"qNum": 69, "numbers": [5, 2, -1, 1, -2], "answer": 5}, {"qNum": 70, "numbers": [8, -5, 1, 5, -1], "answer": 8}, {"qNum": 71, "numbers": [4, 5, -2, 2, -2], "answer": 7}, {"qNum": 72, "numbers": [2, 2, 5, -1, 1], "answer": 9}, {"qNum": 73, "numbers": [5, 1, 2, 1, -2], "answer": 7}, {"qNum": 74, "numbers": [1, 5, 1, -2, -5], "answer": 0}, {"qNum": 75, "numbers": [1, 2, 1, 5, -2], "answer": 7}, {"qNum": 76, "numbers": [2, 5, 2, -5, 5], "answer": 9}, {"qNum": 77, "numbers": [5, 1, 2, -1, 1], "answer": 8}, {"qNum": 78, "numbers": [5, 4, -2, 1, -2], "answer": 6}, {"qNum": 79, "numbers": [2, 1, 1, -3, -1], "answer": 0}, {"qNum": 80, "numbers": [1, 5, 1, 1, -2], "answer": 6}, {"qNum": 81, "numbers": [1, 2, 5, 1, -4], "answer": 5}, {"qNum": 82, "numbers": [2, 5, 2, -5, 5], "answer": 9}, {"qNum": 83, "numbers": [5, 3, 1, -4, 2], "answer": 7}, {"qNum": 84, "numbers": [1, 5, 2, 1, -1], "answer": 8}, {"qNum": 85, "numbers": [1, 1, 2, -1, -1], "answer": 2}, {"qNum": 86, "numbers": [2, 1, 5, 1, -3], "answer": 6}, {"qNum": 87, "numbers": [5, 1, 1, 2, -4], "answer": 5}, {"qNum": 88, "numbers": [2, 1, 1, -4, 5], "answer": 5}, {"qNum": 89, "numbers": [1, 2, -3, 3, 5], "answer": 8}, {"qNum": 90, "numbers": [3, 1, 5, -3, 3], "answer": 9}, {"qNum": 91, "numbers": [1, 1, 2, 5, -2], "answer": 7}, {"qNum": 92, "numbers": [4, 5, -3, -1, 4], "answer": 9}, {"qNum": 93, "numbers": [5, 2, -1, 2, 1], "answer": 9}, {"qNum": 94, "numbers": [5, 2, -1, 1, -2], "answer": 5}, {"qNum": 95, "numbers": [8, -5, 1, 5, -1], "answer": 8}, {"qNum": 96, "numbers": [1, 5, 1, -2, -5], "answer": 0}, {"qNum": 97, "numbers": [1, 2, 1, 5, -2], "answer": 7}, {"qNum": 98, "numbers": [5, 1, 2, 1, -2], "answer": 7}, {"qNum": 99, "numbers": [4, 5, -2, 2, -2], "answer": 7}, {"qNum": 100, "numbers": [2, 2, 5, -1, 1], "answer": 9}]
    },
    official_2023_2024: {
      name: 'Official Panchayat Exam 2023-2024',
      year: '2023-2024',
      time: '10 MINUTES',
      category: 'CATEGORY A (FOR FIRST LEVEL STUDENTS)',
      title: 'PANCHAYATH LEVEL ABACUS EXAM',
      subtitle: 'WITH ABACUS ONLY',
      paperCode: 'PNC-2023-24-OFFICIAL-KEY',
      rows: 5,
      digits: 1,
      questions: [{"qNum": 1, "numbers": [7, 2, -5, -3, 5], "answer": 6}, {"qNum": 2, "numbers": [3, -3, 5, 4, -2], "answer": 7}, {"qNum": 3, "numbers": [1, 2, 1, 5, -1], "answer": 8}, {"qNum": 4, "numbers": [1, 5, 1, -2, 1], "answer": 6}, {"qNum": 5, "numbers": [3, 1, 5, -2, 2], "answer": 9}, {"qNum": 6, "numbers": [2, 2, -4, 2, 1], "answer": 3}, {"qNum": 7, "numbers": [8, -5, 1, 5, -1], "answer": 8}, {"qNum": 8, "numbers": [2, 5, 2, -5, 5], "answer": 9}, {"qNum": 9, "numbers": [5, 1, 2, -1, 1], "answer": 8}, {"qNum": 10, "numbers": [2, 5, 1, 1, -1], "answer": 8}, {"qNum": 11, "numbers": [7, -5, 1, -2, 3], "answer": 4}, {"qNum": 12, "numbers": [1, 3, 5, -5, 5], "answer": 9}, {"qNum": 13, "numbers": [2, 1, 1, -3, -1], "answer": 0}, {"qNum": 14, "numbers": [1, 3, -3, 5, 2], "answer": 8}, {"qNum": 15, "numbers": [2, 1, 5, 1, -4], "answer": 5}, {"qNum": 16, "numbers": [1, 2, 5, -2, 3], "answer": 9}, {"qNum": 17, "numbers": [2, 1, 1, 5, -4], "answer": 5}, {"qNum": 18, "numbers": [1, 2, 5, 1, -4], "answer": 5}, {"qNum": 19, "numbers": [2, 5, -5, 2, -1], "answer": 3}, {"qNum": 20, "numbers": [2, 1, 5, -1, 1], "answer": 8}, {"qNum": 21, "numbers": [2, 1, 1, 5, -4], "answer": 5}, {"qNum": 22, "numbers": [2, 2, 5, -1, 1], "answer": 9}, {"qNum": 23, "numbers": [2, 1, 5, -1, 1], "answer": 8}, {"qNum": 24, "numbers": [1, 1, 2, 5, -2], "answer": 7}, {"qNum": 25, "numbers": [6, 3, -2, 1, -2], "answer": 6}, {"qNum": 26, "numbers": [5, 4, -2, 1, -2], "answer": 6}, {"qNum": 27, "numbers": [4, -1, -3, 3, 5], "answer": 8}, {"qNum": 28, "numbers": [8, 1, -5, 5, -4], "answer": 5}, {"qNum": 29, "numbers": [2, 1, 1, -3, -1], "answer": 0}, {"qNum": 30, "numbers": [1, 5, 1, 1, -2], "answer": 6}, {"qNum": 31, "numbers": [1, 2, 5, 1, -4], "answer": 5}, {"qNum": 32, "numbers": [2, 5, 2, -5, 5], "answer": 9}, {"qNum": 33, "numbers": [5, 3, 1, -4, 2], "answer": 7}, {"qNum": 34, "numbers": [1, 5, 2, 1, -1], "answer": 8}, {"qNum": 35, "numbers": [1, 1, 2, -1, -1], "answer": 2}, {"qNum": 36, "numbers": [2, 1, 5, 1, -3], "answer": 6}, {"qNum": 37, "numbers": [5, 1, 1, 2, -4], "answer": 5}, {"qNum": 38, "numbers": [2, 1, 1, -4, 5], "answer": 5}, {"qNum": 39, "numbers": [1, 2, -3, 3, 5], "answer": 8}, {"qNum": 40, "numbers": [3, 1, 5, -3, 3], "answer": 9}, {"qNum": 41, "numbers": [1, 1, 2, 5, -2], "answer": 7}, {"qNum": 42, "numbers": [4, 5, -3, -1, 4], "answer": 9}, {"qNum": 43, "numbers": [5, 2, -1, 2, 1], "answer": 9}, {"qNum": 44, "numbers": [5, 2, -1, 1, -2], "answer": 5}, {"qNum": 45, "numbers": [8, -5, 1, 5, -1], "answer": 8}, {"qNum": 46, "numbers": [1, 5, 1, -2, -5], "answer": 0}, {"qNum": 47, "numbers": [1, 2, 1, 5, -2], "answer": 7}, {"qNum": 48, "numbers": [1, 5, 1, -2, 1], "answer": 6}, {"qNum": 49, "numbers": [1, 5, 2, -3, 2], "answer": 7}, {"qNum": 50, "numbers": [2, -1, 5, 3, -2], "answer": 7}, {"qNum": 51, "numbers": [2, 5, 2, -2, 1], "answer": 8}, {"qNum": 52, "numbers": [5, 2, -1, 2, 1], "answer": 9}, {"qNum": 53, "numbers": [5, 2, 1, 1, -3], "answer": 6}, {"qNum": 54, "numbers": [1, 3, 5, -3, 1], "answer": 7}, {"qNum": 55, "numbers": [6, 2, -5, 5, 1], "answer": 9}, {"qNum": 56, "numbers": [2, 2, 5, -1, 1], "answer": 9}, {"qNum": 57, "numbers": [1, 1, 2, 5, -2], "answer": 7}, {"qNum": 58, "numbers": [3, 5, -1, 2, -2], "answer": 7}, {"qNum": 59, "numbers": [1, 7, -5, 1, -2], "answer": 2}, {"qNum": 60, "numbers": [3, -1, 5, 2, -1], "answer": 8}, {"qNum": 61, "numbers": [2, 5, -2, 3, 1], "answer": 9}, {"qNum": 62, "numbers": [5, 4, -5, -4, 2], "answer": 2}, {"qNum": 63, "numbers": [1, 1, -2, 5, 4], "answer": 9}, {"qNum": 64, "numbers": [9, -5, -3, 2, 1], "answer": 4}, {"qNum": 65, "numbers": [1, 1, -2, 5, 4], "answer": 9}, {"qNum": 66, "numbers": [2, 5, -1, 1, -1], "answer": 6}, {"qNum": 67, "numbers": [3, 5, -5, 5, 1], "answer": 9}, {"qNum": 68, "numbers": [2, 1, 5, 1, -3], "answer": 6}, {"qNum": 69, "numbers": [2, 1, 1, -4, 5], "answer": 5}, {"qNum": 70, "numbers": [2, -1, 5, 3, -2], "answer": 7}, {"qNum": 71, "numbers": [1, 3, 5, -3, -3], "answer": 3}, {"qNum": 72, "numbers": [2, 5, 1, -2, 2], "answer": 8}, {"qNum": 73, "numbers": [2, 2, 5, -2, 2], "answer": 9}, {"qNum": 74, "numbers": [5, 2, 2, -2, 2], "answer": 9}, {"qNum": 75, "numbers": [5, 2, 2, -3, 2], "answer": 8}, {"qNum": 76, "numbers": [5, 1, 2, 1, -2], "answer": 7}, {"qNum": 77, "numbers": [4, 5, -2, 2, -2], "answer": 7}, {"qNum": 78, "numbers": [2, 2, 5, -1, 1], "answer": 9}, {"qNum": 79, "numbers": [2, 1, 1, 5, -4], "answer": 5}, {"qNum": 80, "numbers": [1, 5, 2, -3, 2], "answer": 7}, {"qNum": 81, "numbers": [7, -5, 2, 5, -1], "answer": 8}, {"qNum": 82, "numbers": [1, 1, 1, 5, -1], "answer": 7}, {"qNum": 83, "numbers": [1, 1, 5, 1, -3], "answer": 5}, {"qNum": 84, "numbers": [1, 2, 1, -4, 4], "answer": 4}, {"qNum": 85, "numbers": [8, -5, -2, 2, 1], "answer": 4}, {"qNum": 86, "numbers": [3, 5, 1, -2, 1], "answer": 8}, {"qNum": 87, "numbers": [1, 1, 5, 1, -3], "answer": 5}, {"qNum": 88, "numbers": [4, 5, -2, 2, -2], "answer": 7}, {"qNum": 89, "numbers": [1, 3, -2, 5, -2], "answer": 5}, {"qNum": 90, "numbers": [8, -3, 2, -1, 3], "answer": 9}, {"qNum": 91, "numbers": [2, 1, 1, -3, 5], "answer": 6}, {"qNum": 92, "numbers": [2, 2, -4, 2, 1], "answer": 3}, {"qNum": 93, "numbers": [1, 5, 3, -5, 5], "answer": 9}, {"qNum": 94, "numbers": [6, -5, 1, 2, 5], "answer": 9}, {"qNum": 95, "numbers": [1, 1, 2, -4, 5], "answer": 5}, {"qNum": 96, "numbers": [2, 5, -1, 1, -1], "answer": 6}, {"qNum": 97, "numbers": [5, 1, 3, -1, -3], "answer": 5}, {"qNum": 98, "numbers": [7, 2, -5, -3, 5], "answer": 6}, {"qNum": 99, "numbers": [1, 2, 5, -2, 3], "answer": 9}, {"qNum": 100, "numbers": [4, -2, 2, -2, 2], "answer": 4}]
    }
  };

  // Preset Level Definitions
  const LEVEL_PRESETS = {
    levelA: {
      name: 'Level A: Panchayat Standard',
      rows: 5,
      digits: 1,
      maxTotal: 9,
      allowNegatives: true,
      category: 'CATEGORY A (FOR FIRST LEVEL STUDENTS)',
      time: '08 MINUTES'
    },
    levelA_plus: {
      name: 'Level A+: 1-Digit Extended',
      rows: 7,
      digits: 1,
      maxTotal: 9,
      allowNegatives: true,
      category: 'CATEGORY A+ (ADVANCED FIRST LEVEL)',
      time: '10 MINUTES'
    },
    levelB: {
      name: 'Level B: Big Friends',
      rows: 5,
      digits: 1,
      maxTotal: 19,
      allowNegatives: true,
      category: 'CATEGORY B (SECOND LEVEL - BIG FRIENDS)',
      time: '08 MINUTES'
    },
    levelB_plus: {
      name: 'Level B+: Big Friends Plus',
      rows: 7,
      digits: 1,
      maxTotal: 25,
      allowNegatives: true,
      category: 'CATEGORY B+ (EXTENDED BIG FRIENDS)',
      time: '10 MINUTES'
    },
    levelC: {
      name: 'Level C: 2-Digits Basic',
      rows: 3,
      digits: 2,
      maxTotal: 99,
      allowNegatives: true,
      category: 'CATEGORY C (THIRD LEVEL - 2-DIGIT BASIC)',
      time: '10 MINUTES'
    },
    levelC_plus: {
      name: 'Level C+: 2-Digits Intermediate',
      rows: 5,
      digits: 2,
      maxTotal: 99,
      allowNegatives: true,
      category: 'CATEGORY C+ (2-DIGIT 5 ROWS)',
      time: '10 MINUTES'
    },
    levelD: {
      name: 'Level D: 2-Digits Advanced',
      rows: 7,
      digits: 2,
      maxTotal: 199,
      allowNegatives: true,
      category: 'CATEGORY D (CHAMPIONSHIP - 2-DIGIT 7 ROWS)',
      time: '12 MINUTES'
    }
  };

  // --- Seedable Pseudo-Random Number Generator ---
  function createRNG(seed) {
    if (!seed) {
      return Math.random;
    }
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  let rng = Math.random;

  function randInt(min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  // --- Question Generator Algorithm ---
  /**
   * Generates a single abacus question obeying strict level rules:
   * - Running sum at every step >= 0.
   * - Running sum at every step <= maxTotal.
   * - No zero steps.
   * - Controlled negative frequency.
   * - No immediate opposite cancellation (+X followed immediately by -X).
   */
  function getValidStep(currentSum, isFirstRow, prevNumber) {
    const maxTotal = state.maxTotal;
    const allowNegatives = state.allowNegatives;
    const digits = state.digits;
    const maxMag = digits === 1 ? 9 : 89;
    const minMag = digits === 1 ? 1 : 10;

    if (isFirstRow) {
      const maxFirst = Math.min(maxMag, maxTotal);
      const minFirst = Math.min(minMag, maxFirst);
      return randInt(minFirst, maxFirst);
    }

    const validMoves = [];
    const maxAdd = Math.min(maxMag, maxTotal - currentSum);
    for (let m = minMag; m <= maxAdd; m++) {
      validMoves.push(m);
    }

    if (allowNegatives && currentSum >= minMag) {
      const maxSub = Math.min(maxMag, currentSum);
      for (let m = minMag; m <= maxSub; m++) {
        validMoves.push(-m);
      }
    }

    if (validMoves.length === 0) {
      if (currentSum >= maxTotal) return -1;
      if (currentSum <= 0) return 1;
      return rng() < 0.5 ? 1 : -1;
    }

    let candidates = validMoves.filter((v) => v !== -prevNumber);
    if (candidates.length === 0) {
      candidates = validMoves;
    }

    // Abacus Level A bead rules: upper bead 5
    if ((state.currentLevel === 'levelA' || state.currentLevel === 'levelA_plus') && digits === 1) {
      candidates = candidates.filter((v) => {
        if (v === -5 && currentSum < 5) return false;
        if (v === 5 && currentSum + 5 > 9) return false;
        return true;
      });
      if (candidates.length === 0) candidates = validMoves;
    }

    const posMoves = candidates.filter((v) => v > 0);
    const negMoves = candidates.filter((v) => v < 0);

    if (negMoves.length > 0 && posMoves.length > 0) {
      let probNeg = 0.35;
      if (currentSum >= 7) probNeg = 0.70;
      else if (currentSum >= 5) probNeg = 0.50;
      else if (currentSum <= 2) probNeg = 0.15;

      if (rng() < probNeg) {
        return negMoves[Math.floor(rng() * negMoves.length)];
      } else {
        return posMoves[Math.floor(rng() * posMoves.length)];
      }
    }

    return candidates[Math.floor(rng() * candidates.length)];
  }

  function generateSingleQuestion(qIndex) {
    const numRows = state.rows;
    let numbers = [];
    let currentSum = 0;
    let prev = 0;

    for (let row = 0; row < numRows; row++) {
      const step = getValidStep(currentSum, row === 0, prev);
      currentSum += step;
      numbers.push(step);
      prev = step;
    }

    return {
      qNum: qIndex,
      numbers: numbers,
      answer: currentSum
    };
  }

  /**
   * Generates all 100 questions for the exam paper.
   */
  function generateExamPaper() {
    state.questions = [];
    for (let i = 1; i <= 100; i++) {
      state.questions.push(generateSingleQuestion(i));
    }
    renderGrids();
    renderMatrix();
  }

  // --- DOM Rendering ---
  function renderGrids() {
    const qpContainer = document.getElementById('qpGridContainer');
    const akContainer = document.getElementById('akGridContainer');

    qpContainer.innerHTML = '';
    akContainer.innerHTML = '';

    // Adjust font size and heights dynamically based on row count
    const numRows = state.rows;
    let digitHeightMm = 4.9;
    let fontSizePt = 11;
    let answerHeightMm = 7.2;

    if (numRows === 7) {
      digitHeightMm = 3.6;
      fontSizePt = 9.5;
      answerHeightMm = 6.2;
    } else if (numRows === 6) {
      digitHeightMm = 4.1;
      fontSizePt = 10;
      answerHeightMm = 6.8;
    } else if (numRows >= 8) {
      digitHeightMm = 3.1;
      fontSizePt = 8.5;
      answerHeightMm = 5.5;
    } else if (numRows <= 4) {
      digitHeightMm = 6.0;
      fontSizePt = 12;
      answerHeightMm = 8.5;
    }

    // Render 4 rows of 25 columns
    for (let r = 0; r < 4; r++) {
      const qpRow = document.createElement('div');
      qpRow.className = 'exam-row';

      const akRow = document.createElement('div');
      akRow.className = 'exam-row';

      for (let c = 0; c < 25; c++) {
        const qIndex = r * 25 + c;
        const qData = state.questions[qIndex];

        // --- Question Paper Column ---
        const qpCol = document.createElement('div');
        qpCol.className = 'question-col';

        const qpBadge = document.createElement('div');
        qpBadge.className = 'q-badge';
        qpBadge.textContent = qData.qNum;

        const qpBox = document.createElement('div');
        qpBox.className = 'q-box';

        qData.numbers.forEach((num) => {
          const cell = document.createElement('div');
          cell.className = 'digit-cell';
          cell.style.height = `${digitHeightMm}mm`;
          cell.style.fontSize = `${fontSizePt}pt`;
          cell.textContent = num > 0 ? num : `${num}`;
          qpBox.appendChild(cell);
        });

        const qpAnsCell = document.createElement('div');
        qpAnsCell.className = 'answer-cell';
        qpAnsCell.style.height = `${answerHeightMm}mm`;
        qpAnsCell.innerHTML = '&nbsp;';
        qpBox.appendChild(qpAnsCell);

        qpCol.appendChild(qpBadge);
        qpCol.appendChild(qpBox);
        qpRow.appendChild(qpCol);

        // --- Answer Key Column ---
        const akCol = document.createElement('div');
        akCol.className = 'question-col';

        const akBadge = document.createElement('div');
        akBadge.className = 'q-badge';
        akBadge.textContent = qData.qNum;

        const akBox = document.createElement('div');
        akBox.className = 'q-box';

        qData.numbers.forEach((num) => {
          const cell = document.createElement('div');
          cell.className = 'digit-cell';
          cell.style.height = `${digitHeightMm}mm`;
          cell.style.fontSize = `${fontSizePt}pt`;
          cell.textContent = num > 0 ? num : `${num}`;
          akBox.appendChild(cell);
        });

        const akAnsCell = document.createElement('div');
        akAnsCell.className = 'answer-cell';
        akAnsCell.style.height = `${answerHeightMm}mm`;
        akAnsCell.textContent = qData.answer;
        akBox.appendChild(akAnsCell);

        akCol.appendChild(akBadge);
        akCol.appendChild(akBox);
        akRow.appendChild(akCol);
      }

      qpContainer.appendChild(qpRow);
      akContainer.appendChild(akRow);
    }

    updateHeaderElements();
  }

  function updateHeaderElements() {
    // Question Paper Header
    document.getElementById('qpMainTitle').textContent = state.title;
    document.getElementById('qpPaperTitle').textContent = `QUESTION PAPER - ${state.year}`;
    document.getElementById('qpExamTime').textContent = `EXAM TIME: ${state.time}`;
    document.getElementById('qpExamSubtitle').textContent = state.subtitle;
    document.getElementById('qpCategoryText').textContent = state.category;

    // Answer Key Header
    document.getElementById('akMainTitle').textContent = state.title;
    document.getElementById('akPaperTitle').textContent = `ANSWER KEY - ${state.year}`;
    document.getElementById('akPaperCode').textContent = state.paperCode;
    document.getElementById('akEvalTime').textContent = `${state.time} ALLOTTED`;
    document.getElementById('akCategoryText').textContent = state.category;
  }

  // --- 100-Question Quick Matrix for Evaluators ---
  function renderMatrix() {
    const container = document.getElementById('matrixTableContainer');
    if (!container) return;
    container.innerHTML = '';

    state.questions.forEach((q) => {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      cell.innerHTML = `
        <div class="matrix-q">Q${q.qNum}</div>
        <div class="matrix-ans">${q.answer}</div>
      `;
      container.appendChild(cell);
    });
  }

  // --- Paper Code Generator ---
  function generateNewPaperCode() {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const levelCode = state.currentLevel.replace('level', '').toUpperCase();
    state.paperCode = `PNC-${state.year}-${levelCode}-${randomHex}`;
  }

  // --- Toast Notification ---
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2400);
  }

  // --- Zoom / Scaling Engine ---
  function applyZoom(scale) {
    state.zoom = Math.max(0.4, Math.min(2.0, scale));
    const wrapper = document.getElementById('sheetScaleWrapper');
    const zoomText = document.getElementById('zoomLevelText');

    wrapper.style.transform = `scale(${state.zoom})`;
    zoomText.textContent = `${Math.round(state.zoom * 100)}%`;
  }

  function fitToScreen() {
    const canvas = document.getElementById('workspaceCanvas');
    const availableWidth = canvas.clientWidth - 80;
    // A4 width in px at 96 DPI: 297mm = ~1122px
    const a4PixelWidth = 1122;
    let targetScale = availableWidth / a4PixelWidth;
    targetScale = Math.min(1.0, Math.max(0.45, targetScale));
    applyZoom(targetScale);
    document.getElementById('zoomLevelText').textContent = 'Fit A4';
  }

  // --- Event Handlers & Initialization ---
  function initEvents() {
    // Level Selection Change
    const levelSelect = document.getElementById('levelSelect');
    levelSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'custom') {
        openCustomModal();
        return;
      }

      state.currentLevel = val;

      if (val.startsWith('official_')) {
        const off = OFFICIAL_PAPERS[val];
        state.rows = off.rows;
        state.digits = off.digits;
        state.year = off.year;
        state.time = off.time;
        state.category = off.category;
        state.title = off.title;
        state.subtitle = off.subtitle;
        state.paperCode = off.paperCode;
        state.questions = JSON.parse(JSON.stringify(off.questions));

        document.getElementById('examYear').value = off.year;
        document.getElementById('examTime').value = off.time;
        document.getElementById('categoryText').value = off.category;

        renderGrids();
        renderMatrix();
        showToast(`Loaded ${off.name}`);
        return;
      }

      const preset = LEVEL_PRESETS[val];
      if (preset) {
        state.rows = preset.rows;
        state.digits = preset.digits;
        state.maxTotal = preset.maxTotal;
        state.allowNegatives = preset.allowNegatives;
        state.category = preset.category;
        state.time = preset.time;
        state.title = 'PANCHAYAT LEVEL ABACUS EXAM';
        state.subtitle = 'WITH ABACUS ONLY';

        document.getElementById('categoryText').value = preset.category;
        document.getElementById('examTime').value = preset.time;
      }

      generateNewPaperCode();
      generateExamPaper();
      showToast(`Switched to ${LEVEL_PRESETS[val].name}`);
    });

    // Quick Setting Inputs
    document.getElementById('examYear').addEventListener('input', (e) => {
      state.year = e.target.value || '2025';
      generateNewPaperCode();
      updateHeaderElements();
    });

    document.getElementById('examTime').addEventListener('change', (e) => {
      state.time = e.target.value;
      updateHeaderElements();
    });

    document.getElementById('categoryText').addEventListener('input', (e) => {
      state.category = e.target.value;
      updateHeaderElements();
    });

    // Generate New Paper Button
    document.getElementById('btnGenerate').addEventListener('click', () => {
      generateNewPaperCode();
      generateExamPaper();
      showToast('🎲 100 New Questions Generated!');
    });

    // Print Button
    document.getElementById('btnPrint').addEventListener('click', () => {
      // Switch view temporarily to both for full print output
      document.body.setAttribute('data-view', 'both');
      window.print();
    });

    // View Segmented Controls
    const segButtons = document.querySelectorAll('.seg-btn');
    segButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        segButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.getAttribute('data-view');
        state.currentView = view;

        if (view === 'matrix') {
          openMatrixModal();
        } else {
          document.body.setAttribute('data-view', view);
        }
      });
    });

    // Zoom Buttons
    document.getElementById('btnZoomIn').addEventListener('click', () => {
      applyZoom(state.zoom + 0.1);
    });

    document.getElementById('btnZoomOut').addEventListener('click', () => {
      applyZoom(state.zoom - 0.1);
    });

    document.getElementById('btnZoomFit').addEventListener('click', () => {
      fitToScreen();
    });

    // Custom Modal Controls
    document.getElementById('btnToggleSettings').addEventListener('click', openCustomModal);
    document.getElementById('btnCloseModal').addEventListener('click', closeCustomModal);
    document.getElementById('btnApplyCustom').addEventListener('click', () => {
      state.currentLevel = 'custom';
      state.title = document.getElementById('customTitle').value;
      state.subtitle = document.getElementById('customSubtitle').value;
      const digitsVal = document.getElementById('customDigits').value;
      state.digits = digitsVal === 'mixed_1_2' ? 'mixed' : parseInt(digitsVal, 10);
      state.rows = parseInt(document.getElementById('customRows').value, 10);
      state.maxTotal = parseInt(document.getElementById('customMaxTotal').value, 10);
      state.allowNegatives = document.getElementById('customAllowNegatives').value === 'yes';

      const seedVal = document.getElementById('customSeed').value.trim();
      if (seedVal) {
        state.seed = seedVal;
        rng = createRNG(seedVal);
      } else {
        rng = Math.random;
      }

      closeCustomModal();
      generateNewPaperCode();
      generateExamPaper();
      showToast('Custom settings applied successfully!');
    });

    document.getElementById('btnRandomizeSeed').addEventListener('click', () => {
      const r = Math.random().toString(36).substring(2, 8).toUpperCase();
      document.getElementById('customSeed').value = `SET-${state.year}-${r}`;
    });

    // Matrix Modal Controls
    document.getElementById('btnCloseMatrix').addEventListener('click', closeMatrixModal);
    document.getElementById('btnCopyMatrix').addEventListener('click', () => {
      const text = state.questions
        .map((q) => `Q${q.qNum}: ${q.answer}`)
        .join('\n');
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 All 100 Answers copied to clipboard!');
      });
    });

    // Auto fit on window resize
    window.addEventListener('resize', () => {
      if (state.zoom === 1.0 || document.getElementById('zoomLevelText').textContent === 'Fit A4') {
        fitToScreen();
      }
    });
  }

  function openCustomModal() {
    document.getElementById('customModal').classList.remove('hidden');
  }

  function closeCustomModal() {
    document.getElementById('customModal').classList.add('hidden');
  }

  function openMatrixModal() {
    document.getElementById('matrixModal').classList.remove('hidden');
  }

  function closeMatrixModal() {
    document.getElementById('matrixModal').classList.add('hidden');
    // Reset view to previous
    const activeSeg = document.querySelector('.seg-btn[data-view="both"]');
    if (activeSeg) {
      document.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
      activeSeg.classList.add('active');
      document.body.setAttribute('data-view', 'both');
    }
  }

  // --- Bootstrapping ---
  window.addEventListener('DOMContentLoaded', () => {
    initEvents();
    generateNewPaperCode();
    generateExamPaper();
    fitToScreen();
  });
})();

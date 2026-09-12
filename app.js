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
      const preset = LEVEL_PRESETS[val];
      if (preset) {
        state.rows = preset.rows;
        state.digits = preset.digits;
        state.maxTotal = preset.maxTotal;
        state.allowNegatives = preset.allowNegatives;
        state.category = preset.category;
        state.time = preset.time;

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

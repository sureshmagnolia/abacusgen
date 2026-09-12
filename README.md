# AbacusGen 🧮

**Panchayat Level & Competition Abacus Question Paper & Answer Key Generator**

A fast, lightweight, and fully offline-capable web application designed to generate competition-grade Abacus Question Papers and verified Answer Keys formatted to fit precisely onto **1 A4 Landscape page each (297mm × 210mm)**.

Live Demo: **https://sureshmagnolia.github.io/abacusgen/**

---

## 🌟 Key Features

- **Exact Competition Template**: Recreated from official Panchayat Level Abacus Examination papers.
- **2-Page Printable Output**:
  - **Page 1: Question Paper** — 100 questions arranged in 4 rows of 25 columns with circular badges and clean answer boxes.
  - **Page 2: Answer Key** — Identical layout with verified answers calculated and filled in each box.
  - **Zero Overflow**: Calibrated with CSS `@media print` rules (`@page { size: A4 landscape; margin: 0; }`) to guarantee that Page 1 and Page 2 each take exactly one sheet with no blank pages.
- **Pedagogical Abacus Math Engine**:
  - **Level A (Panchayat Standard)**: 1-digit numbers, 5 rows. Cumulative intermediate sum at every step stays strictly in `[0, 9]` (no negative sums, single-rod bead moves).
  - **Level A+**: 1-digit, 7 rows (sums `0..9`).
  - **Level B / B+ (Big Friends)**: 1-digit, 5 to 7 rows, crossing 10 (sums `0..19` / `0..25`).
  - **Level C / C+**: 2-digit numbers, 3 to 5 rows.
  - **Level D (Championship)**: 2-digit numbers, 7 rows.
  - **Custom Level Builder**: Fully customizable rows (3-10), digits (1D, 2D, mixed), max total limits, and subtractions.
- **Official 100-Grid Matrix**: Rapid-grading card for evaluators with one-click clipboard copying.
- **Zero Dependencies**: Pure HTML, Vanilla CSS, and JavaScript. Runs directly in any modern browser.

---

## 🚀 Quick Start

### Local Use
Double-click `launch_app.bat` or open `index.html` in Google Chrome, Microsoft Edge, or Firefox.

### Online
Visit the live GitHub Pages site:
[https://sureshmagnolia.github.io/abacusgen/](https://sureshmagnolia.github.io/abacusgen/)

---

## 🖨️ How to Print / Save as PDF

1. Select your desired Exam Level and customize Year or Category.
2. Click **🎲 Generate New Paper** to generate 100 questions.
3. Click **🖨️ Print / Save PDF** (or press `Ctrl + P`).
4. In your browser print dialog:
   - **Destination**: `Save as PDF` or select your printer.
   - **Layout**: `Landscape`.
   - **Paper Size**: `A4`.
   - **Margins**: `None` or `Default`.
   - **Options**: Enable `Background graphics` for full logo and badge styling.

---

## 📄 License
MIT License

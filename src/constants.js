export const QUESTION_DURATION = 1200;
export const ONLINE_THRESHOLD = 5000;
export const HEARTBEAT_INTERVAL = 3000;

export const QUESTIONS = [
  // ==========================================
  // CATEGORY 1: NUMBER RUSH (1-5)
  // ==========================================
  {
    q: "ANGKA LEBIH BESAR",
    options: ["7", "3"],
    correct: "7",
  },
  {
    q: "ANGKA LEBIH KECIL",
    options: ["8", "2"],
    correct: "2",
  },
  {
    q: "PILIH ANGKA GENAP",
    options: ["5", "6"],
    correct: "6",
  },
  {
    q: "PILIH ANGKA GANJIL",
    options: ["7", "4"],
    correct: "7",
  },
  {
    q: "LEBIH DARI 5",
    options: ["3", "8"],
    correct: "8",
  },

  // ==========================================
  // CATEGORY 2: QUICK MATH (6-10)
  // ==========================================
  {
    q: "2 + 3 = ?",
    options: ["5", "4"],
    correct: "5",
  },
  {
    q: "10 - 6 = ?",
    options: ["5", "4"],
    correct: "4",
  },
  {
    q: "3 × 2 = ?",
    options: ["6", "5"],
    correct: "6",
  },
  {
    q: "8 ÷ 2 = ?",
    options: ["3", "4"],
    correct: "4",
  },
  {
    q: "5 + 2 - 3 = ?",
    options: ["5", "4"],
    correct: "4",
  },

  // ==========================================
  // CATEGORY 3: COUNT IT (11-15)
  // ==========================================
  {
    q: "HITUNG: ●●●●●",
    options: ["5", "4"],
    correct: "5",
  },
  {
    q: "HITUNG: ★★★",
    options: ["4", "3"],
    correct: "3",
  },
  {
    q: "HITUNG: ■■■■",
    options: ["4", "5"],
    correct: "4",
  },
  {
    q: "HITUNG: →→",
    options: ["3", "2"],
    correct: "2",
  },
  {
    q: "HITUNG: ♥♥♥♥♥♥",
    options: ["5", "6"],
    correct: "6",
  },

  // ==========================================
  // CATEGORY 4: COLOR BLAST (16-20)
  // ==========================================
  {
    q: "WARNA MERAH?",
    options: ["🔴", "🔵"],
    correct: "🔴",
  },
  {
    q: "WARNA BIRU?",
    options: ["🟢", "🔵"],
    correct: "🔵",
  },
  {
    q: "WARNA HIJAU?",
    options: ["🟢", "🔴"],
    correct: "🟢",
  },
  {
    q: "WARNA KUNING?",
    options: ["🟣", "🟡"],
    correct: "🟡",
  },
  {
    q: "WARNA HITAM?",
    options: ["⚫", "⚪"],
    correct: "⚫",
  },

  // ==========================================
  // CATEGORY 5: SHAPE SNAP (21-25)
  // ==========================================
  {
    q: "PILIH LINGKARAN",
    options: ["■", "●"],
    correct: "●",
  },
  {
    q: "PILIH PERSEGI",
    options: ["■", "●"],
    correct: "■",
  },
  {
    q: "PILIH SEGITIGA",
    options: ["●", "▲"],
    correct: "▲",
  },
  {
    q: "PILIH BINTANG",
    options: ["★", "●"],
    correct: "★",
  },
  {
    q: "PILIH HATI",
    options: ["★", "♥"],
    correct: "♥",
  },

  // ==========================================
  // CATEGORY 6: ARROW RUSH (26-30)
  // ==========================================
  {
    q: "PANAH KE KANAN",
    options: ["→", "←"],
    correct: "→",
  },
  {
    q: "PANAH KE KIRI",
    options: ["→", "←"],
    correct: "←",
  },
  {
    q: "PANAH KE ATAS",
    options: ["↑", "↓"],
    correct: "↑",
  },
  {
    q: "PANAH KE BAWAH",
    options: ["↑", "↓"],
    correct: "↓",
  },
  {
    q: "PANAH DIAGONAL KANAN",
    options: ["↙", "↗"],
    correct: "↗",
  },

  // ==========================================
  // CATEGORY 7: PATTERN NEXT (31-35)
  // ==========================================
  {
    q: "1 - 2 - 3 - ?",
    options: ["4", "5"],
    correct: "4",
  },
  {
    q: "A - B - C - ?",
    options: ["E", "D"],
    correct: "D",
  },
  {
    q: "● ● ○ ● ● ?",
    options: ["○", "●"],
    correct: "○",
  },
  {
    q: "🔴 🔵 🔴 🔵 ?",
    options: ["🔵", "🔴"],
    correct: "🔴",
  },
  {
    q: "2 - 4 - 6 - ?",
    options: ["7", "8"],
    correct: "8",
  },

  // ==========================================
  // CATEGORY 8: SAME or DIFF (36-40)
  // ==========================================
  {
    q: "PILIH YANG SAMA",
    options: ["▲ ●", "▲ ▲"],
    correct: "▲ ▲",
  },
  {
    q: "PILIH YANG BEDA",
    options: ["● ● ○", "● ● ●"],
    correct: "● ● ○",
  },
  {
    q: "WARNA SAMA?",
    options: ["🔴 🔵", "🔴 🔴"],
    correct: "🔴 🔴",
  },
  {
    q: "BENTUK SAMA?",
    options: ["■ ■", "■ ●"],
    correct: "■ ■",
  },
  {
    q: "ARAH SAMA?",
    options: ["→ ←", "→ →"],
    correct: "→ →",
  },

  // ==========================================
  // CATEGORY 9: SYMBOL SPEED (41-45)
  // ==========================================
  {
    q: "PILIH PLUS",
    options: ["✚", "✕"],
    correct: "✚",
  },
  {
    q: "PILIH CENTANG",
    options: ["✕", "✓"],
    correct: "✓",
  },
  {
    q: "PILIH SILANG",
    options: ["✕", "✓"],
    correct: "✕",
  },
  {
    q: "PILIH YANG PENUH",
    options: ["○", "●"],
    correct: "●",
  },
  {
    q: "PILIH YANG KOSONG",
    options: ["○", "●"],
    correct: "○",
  },

  // ==========================================
  // CATEGORY 10: POSITION SNAP (46-50)
  // ==========================================
  {
    q: "SIMBOL DI KIRI",
    options: ["○ ●", "● ○"],
    correct: "● ○",
  },
  {
    q: "SIMBOL DI KANAN",
    options: ["○ ●", "● ○"],
    correct: "○ ●",
  },
  {
    q: "SEGITIGA ATAS",
    options: ["▼", "▲"],
    correct: "▲",
  },
  {
    q: "SEGITIGA BAWAH",
    options: ["▼", "▲"],
    correct: "▼",
  },
  {
    q: "PANAH KANAN",
    options: ["◀", "▶"],
    correct: "▶",
  },
];

export const QUESTION_DURATION = 1200;
export const ONLINE_THRESHOLD = 5000;
export const HEARTBEAT_INTERVAL = 3000;

export const QUESTIONS = [
  // ==========================================
  // CATEGORY 1: NUMBER RUSH (Questions 1-5)
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
  // CATEGORY 2: QUICK MATH
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
  // CATEGORY 3: COUNT IT (Questions 11-15)
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
  // CATEGORY 4: COLOR BLAST (Questions 16-20)
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
  // CATEGORY 5: QUICK CATEGORY (Questions 21-25)
  // ==========================================
  {
    q: "MANA BUAH?",
    options: ["🚗", "🍎"],
    correct: "🍎",
  },
  {
    q: "MANA HEWAN?",
    options: ["🐶", "💻"],
    correct: "🐶",
  },
  {
    q: "BISA TERBANG?",
    options: ["🚗", "✈️"],
    correct: "✈️",
  },
  {
    q: "BISA DIMAKAN?",
    options: ["🍕", "⚽"],
    correct: "🍕",
  },
  {
    q: "YANG HIDUP?",
    options: ["🪨", "🌳"],
    correct: "🌳",
  },

  // ==========================================
  // CATEGORY 6: EMOJI BATTLE (Questions 26-30)
  // ==========================================
  {
    q: "LEBIH CEPAT?",
    options: ["🚀", "🐌"],
    correct: "🚀",
  },
  {
    q: "LEBIH PANAS?",
    options: ["❄️", "🔥"],
    correct: "🔥",
  },
  {
    q: "LEBIH BERAT?",
    options: ["🐘", "🐁"],
    correct: "🐘",
  },
  {
    q: "LEBIH TINGGI?",
    options: ["🏠", "🏔️"],
    correct: "🏔️",
  },
  {
    q: "LEBIH TERANG?",
    options: ["💡", "🌑"],
    correct: "💡",
  },

  // ==========================================
  // CATEGORY 7: PATTERN NEXT (Questions 31-35)
  // ==========================================
  {
    q: "1 - 2 - 3 - ?",
    options: ["5", "4"],
    correct: "4",
  },
  {
    q: "A - B - C - ?",
    options: ["D", "E"],
    correct: "D",
  },
  {
    q: "● ● ○ ● ● ?",
    options: ["●", "○"],
    correct: "○",
  },
  {
    q: "🔴 🔵 🔴 🔵 ?",
    options: ["🔴", "🔵"],
    correct: "🔴",
  },
  {
    q: "2 - 4 - 6 - ?",
    options: ["7", "8"],
    correct: "8",
  },

  // ==========================================
  // CATEGORY 8: SPOT THE ODD (Questions 36-40)
  // ==========================================
  {
    q: "YANG BERBEDA?",
    options: ["🍎 🍊 🚗", "🍎 🍊 🍌"],
    correct: "🍎 🍊 🚗",
  },
  {
    q: "TIDAK COCOK?",
    options: ["🔴 🔵 🚀", "🔴 🔵 🟢"],
    correct: "🔴 🔵 🚀",
  },
  {
    q: "CARI YANG BEDA",
    options: ["● ● ●", "● ● ○"],
    correct: "● ● ○",
  },
  {
    q: "MANA YANG ANEH?",
    options: ["1 2 3 4", "1 2 3 A"],
    correct: "1 2 3 A",
  },
  {
    q: "YANG SALAH?",
    options: ["🐶 🐱 🚗", "🐶 🐱 🐭"],
    correct: "🐶 🐱 🚗",
  },

  // ==========================================
  // CATEGORY 9: ARROW RUSH (Questions 41-45)
  // ==========================================
  {
    q: "PANAH KE KANAN",
    options: ["←", "→"],
    correct: "→",
  },
  {
    q: "PANAH KE KIRI",
    options: ["←", "→"],
    correct: "←",
  },
  {
    q: "PANAH KE ATAS",
    options: ["↑", "↓"],
    correct: "↑",
  },
  {
    q: "PANAH KE BAWAH",
    options: ["↓", "↑"],
    correct: "↓",
  },
  {
    q: "PANAH DIAGONAL KANAN",
    options: ["↙", "↗"],
    correct: "↗",
  },

  // ==========================================
  // CATEGORY 10: EMOJI PAIR (Questions 46-50)
  // ==========================================
  {
    q: "PASANGAN: ☀️",
    options: ["🌞", "🌙"],
    correct: "🌙",
  },
  {
    q: "COCOK: 🔥",
    options: ["💧", "🌳"],
    correct: "💧",
  },
  {
    q: "HUBUNGAN: 🐝",
    options: ["🍯", "🌸"],
    correct: "🍯",
  },
  {
    q: "PASANGAN: 🔑",
    options: ["🚪", "🔓"],
    correct: "🔓",
  },
  {
    q: "COCOK: ☕",
    options: ["🥤", "🍵"],
    correct: "🍵",
  },
];

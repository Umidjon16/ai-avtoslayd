import { Presentation, CreditTransaction, PaymentRequest, AuditLog, SystemPricing, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: "Nodira Karimova",
  id: "48291",
  email: "nodira.karimova@maktab.uz",
  school: "Toshkent sh. 142-maktab",
  credits: 45,
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxSnA8iXGfp_1COvRXbYlqcDbpimT6YsGgUC53gDiYub0Zt26q3LqDmEMuyf6vfDkRaPKuPNxH0XbaA9yb4zP5ClQygBWp_osIMz2yvn6a3gdbDpBovHfetiYJnghyVoR4eSI_Fa3gbAlAVeuCEZy4gAO6PudVORxvWqQ6w-ZU1LWgZH72heS0ijGSw4EKqmcui0SaY9pNGj_iFiptrjck3w3BbflVonSE8ytvXYwGtQR27D04vNj7TA"
};

export const INITIAL_PRICING: SystemPricing = {
  slidePrice: 1,
  aiImagePrice: 2,
  quizPrice: 1,
  welcomeBonus: 15
};

export const INITIAL_SOLAR_SLIDES = [
  {
    id: "slide-1",
    index: 1,
    title: "01. Muqova va Kirish",
    subtitle: "Bosh sahifa & Metodologiya",
    type: "cover" as const,
    bgImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGckkkv2SnqBDnJ5GfV03alOz5jDjd5QGHrL6AL0OIVJdgqOORYHDXZTBJ8ZvN-7Xfx8RYMRhI2HwHn6Z4TONQfry7o8vCJ1O1Z_9qRdTBVWDSiYslYPw4AonN8t6n14JTY2QR0sANczAWF_YuLLZIhZlV9CATgfiW1HBpdFZPz0sEpfbgT6JuRNM9U1QMEdn7rDN2mdFNNXgtU0bYxjrOKjhLfMKlUR6VdgSazhRhUsDDJDXsQFBp5g",
    badges: ["Muqova slaydi", "PPTX"]
  },
  {
    id: "slide-2",
    index: 2,
    title: "02. Mundarija",
    subtitle: "Darsning asosiy bosqichlari",
    type: "outline" as const,
    badges: ["Dars Rejasi", "45 daqiqa"]
  },
  {
    id: "slide-3",
    index: 3,
    title: "03. Ichki sayyoralar",
    subtitle: "4K AI infografik tasvir",
    type: "content" as const,
    bgImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzO4obFpQuASwTwXu7x84VQrB1la2o75d1bIG0YPfcEQElwnuHVv7wuV8H4CMfy-gOs352uKhrVowun2vCmZZ38hwS48-4zkZKQl0E6RZ6bv8_k8mHzZ40BdHbKwvf9RPBrwkE8YUC4_tRMuwzsCTI5veXW_gXqJ7c6-yMAeny-RO4NQ07WIZwvwpyjhDga72-83H0JlQ8Uny2BMv91PRJz9q8feOdT7qJr84KoNd7sEgiiAUg2eZytQ",
    badges: ["AI Generatsiya", "3-Mavzu"]
  },
  {
    id: "slide-4",
    index: 4,
    title: "04. Yupiter & Saturn",
    subtitle: "Taqqosiy parametrlar",
    type: "content" as const,
    bgImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrfXdO7DQhN3Yeodyyaoxg5Fhu-i2Y4YAc0Gejuzo3-s9W8LQJ8UksF3qqLEHu2WfRXJlTalkRJ1e9fcRKz0_IEYB81SH8qF7qImFtgj_N7Z_jAp5i54-MJwIpXl_Cq3lotuEJHC8VXezcHBdg6D1NT4mevzTYqqKGyAzpDLw4qTtozTflPQKfq81teomj0MP9xu8JAtwzVZxLHpw_IdyJYb3X7VlXGGAsLW0ljDBHpFLnrHQlbmIP1Q",
    badges: ["Gaz gigantlari", "Taqqoslash"]
  },
  {
    id: "slide-5",
    index: 5,
    title: "05. Viktorina start",
    subtitle: "Interaktiv dars bo'limi",
    type: "quiz-intro" as const,
    badges: ["5-Qism", "O'YIN REJIMI"]
  },
  {
    id: "slide-6",
    index: 6,
    title: "06. 1-Savol oynasi",
    subtitle: "To'liq interaktiv tugmalar",
    type: "quiz-question" as const,
    options: [
      { label: "A", text: "Mars sayyorasi", isCorrect: false, targetSlide: 8 },
      { label: "B", text: "Yupiter (Eng gigant) ⭐", isCorrect: true, targetSlide: 7 },
      { label: "C", text: "Saturn sayyorasi", isCorrect: false, targetSlide: 8 },
      { label: "D", text: "Venera (Tong yulduzi)", isCorrect: false, targetSlide: 8 }
    ],
    badges: ["Savol #1", "Giperhavola"]
  },
  {
    id: "slide-7",
    index: 7,
    title: "07. Muvaffaqiyatli reaksiya",
    subtitle: "Bog'langan trigger: 06 → B",
    type: "quiz-correct" as const,
    badges: ["To'g'ri javob", "+10 ball"]
  },
  {
    id: "slide-8",
    index: 8,
    title: "08. Xato javob reaksiyasi",
    subtitle: "Bog'langan trigger: Qaytish ↩️",
    type: "quiz-wrong" as const,
    badges: ["Noto'g'ri", "0 ball"]
  }
];

export const INITIAL_PRESENTATIONS: Presentation[] = [
  {
    id: "PPT-92841",
    jobId: "#JOB-88392",
    title: "Quyosh tizimi planetalari va kosmik fazo sirlari",
    subject: "Astronomiya va Tabiatshunoslik",
    grade: "6-sinf",
    language: "O'zbek tili (Lotin)",
    slideCount: 28,
    aiImagesCount: 4,
    quizQuestionsCount: 5,
    style: "Akademik Moviy",
    textDensity: "Muvozanatli",
    objectives: "O'quvchilarda sayyoralar tartibi, ularning hajmi va tortishish kuchi haqida tushuncha shakllantirish, vizual va qiziqarli testlar orqali mustahkamlash.",
    status: "Tayyor",
    date: "Bugun, 14:32",
    fileSize: "18.4 MB (.pptx)",
    slides: INITIAL_SOLAR_SLIDES
  },
  {
    id: "PPT-84192",
    title: "Fotosintez jarayoni va o'simliklar nafas olishi",
    subject: "Biologiya (Davlat standarti)",
    grade: "7-sinf",
    language: "O'zbek tili (Lotin)",
    slideCount: 28,
    aiImagesCount: 4,
    quizQuestionsCount: 5,
    style: "Tabiat va Ekologiya",
    textDensity: "Muvozanatli",
    objectives: "Xlorofill vazifasi, quyosh nuri ta'sirida glyukoza hosil bo'lishi va kislorod ajralishini ilmiy tushuntirish.",
    status: "Tayyor",
    date: "Bugun, 14:20",
    fileSize: "16.2 MB (.pptx)",
    slides: []
  },
  {
    id: "PPT-79104",
    title: "Alisher Navoiy hayoti va ijodi",
    subject: "Adabiyot (Xamsa tahlili)",
    grade: "9-sinf",
    language: "O'zbek tili (Lotin)",
    slideCount: 32,
    aiImagesCount: 6,
    quizQuestionsCount: 8,
    style: "Akademik Moviy",
    textDensity: "Batafsil",
    objectives: "Navoiy dahosi, Xamsa dostonlarining falsafiy mohiyati va g'azallari tahlili.",
    status: "Tayyor",
    date: "Kecha, 18:05",
    fileSize: "22.5 MB (.pptx)",
    slides: []
  },
  {
    id: "PPT-68219",
    title: "Nyuton qonunlari va harakat dinamikasi",
    subject: "Fizika (Laboratoriya asosida)",
    grade: "8-sinf",
    language: "O'zbek tili (Lotin)",
    slideCount: 25,
    aiImagesCount: 4,
    quizQuestionsCount: 0,
    style: "Zamonaviy Minimalist",
    textDensity: "Muvozanatli",
    objectives: "Inersiya qonuni, tezlanish va jism massasi o'rtasidagi munosabat.",
    status: "Jarayonda",
    date: "18 Fevral, 2025",
    fileSize: "14.1 MB (.pptx)",
    slides: []
  },
  {
    id: "PPT-54012",
    title: "Geometrik shakllar va simmetriya",
    subject: "Matematika",
    grade: "5-sinf",
    language: "O'zbek tili (Lotin)",
    slideCount: 20,
    aiImagesCount: 2,
    quizQuestionsCount: 6,
    style: "Ijodiy Yorqin",
    textDensity: "Qisqa",
    objectives: "Ko'pburchaklar, doira, simmetriya o'qlari va fazoviy tasavvurni shakllantirish.",
    status: "Tayyor",
    date: "17 Fevral, 2025",
    fileSize: "12.8 MB (.pptx)",
    slides: []
  }
];

export const INITIAL_TRANSACTIONS: CreditTransaction[] = [
  {
    id: "tx-1",
    date: "Bugun, 14:15",
    title: "Taqdimot generatsiyasi",
    detail: "\"Quyosh tizimi planetalari\" (28 slayd, 4 rasm, 5 viktorina)",
    amount: -41,
    remainingBalance: 45,
    status: "Muvaffaqiyatli"
  },
  {
    id: "tx-2",
    date: "Kecha, 11:30",
    title: "Hisob to'ldirildi",
    detail: "Telegram admini orqali (ID: 48291)",
    amount: +50,
    remainingBalance: 86,
    status: "Tasdiqlangan"
  },
  {
    id: "tx-3",
    date: "17 Fevral, 09:20",
    title: "Taqdimot generatsiyasi",
    detail: "\"Fotosintez jarayoni\" (28 slayd, 4 rasm)",
    amount: -36,
    remainingBalance: 36,
    status: "Muvaffaqiyatli"
  },
  {
    id: "tx-4",
    date: "15 Fevral, 16:45",
    title: "Kredit qaytarildi (Refund)",
    detail: "Tizim texnik uzilishi sababli qaytarildi (#REF-1092)",
    amount: +36,
    remainingBalance: 72,
    status: "Qaytarildi"
  },
  {
    id: "tx-5",
    date: "10 Fevral, 10:00",
    title: "Xush kelibsiz bonusi",
    detail: "Platformadan ro'yxatdan o'tganlik uchun start paketi",
    amount: +15,
    remainingBalance: 15,
    status: "Bonus berildi"
  }
];

export const INITIAL_PAYMENT_REQUESTS: PaymentRequest[] = [
  {
    id: "#PAY-7412",
    teacherName: "Nodira Karimova",
    teacherId: "48291",
    school: "Toshkent sh. 142-maktab",
    requestedCredits: 100,
    amount: "95,000 so'm",
    method: "Payme",
    date: "Bugun, 13:40",
    receiptImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5gEccFwK-0niQhWhMJdT53OAIFuk0sXypEsLr2V1nepcXUdgpCFqsjLcKmCVzRQolikm_BavjQb6RPO08kGf0maBJRlCkKZx6tc_0-OKIir6_4iHiaw5q7QxFeeFYrYXdd_AIGqu52nHoER4TWrb-DmeAWMqMHamhW8vKfQ1ntEWZguN7xIr4MYCE-0hm2LMJPot1WSrVWp9fq7v3IfFkrLHvfuNeH6-KQbgtYzrM-wKmKc31EK63Eg",
    status: "Kutilmoqda"
  },
  {
    id: "#PAY-7411",
    teacherName: "Jahangir Otajonov",
    teacherId: "39104",
    school: "Samarqand 12-IDUM",
    requestedCredits: 50,
    amount: "55,000 so'm",
    method: "Click",
    date: "Bugun, 12:10",
    receiptImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5gEccFwK-0niQhWhMJdT53OAIFuk0sXypEsLr2V1nepcXUdgpCFqsjLcKmCVzRQolikm_BavjQb6RPO08kGf0maBJRlCkKZx6tc_0-OKIir6_4iHiaw5q7QxFeeFYrYXdd_AIGqu52nHoER4TWrb-DmeAWMqMHamhW8vKfQ1ntEWZguN7xIr4MYCE-0hm2LMJPot1WSrVWp9fq7v3IfFkrLHvfuNeH6-KQbgtYzrM-wKmKc31EK63Eg",
    status: "Kutilmoqda"
  },
  {
    id: "#PAY-7409",
    teacherName: "Dilnoza Saidova",
    teacherId: "51208",
    school: "Farg'ona 4-maktab",
    requestedCredits: 250,
    amount: "210,000 so'm",
    method: "Uzum",
    date: "Bugun, 10:25",
    receiptImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5gEccFwK-0niQhWhMJdT53OAIFuk0sXypEsLr2V1nepcXUdgpCFqsjLcKmCVzRQolikm_BavjQb6RPO08kGf0maBJRlCkKZx6tc_0-OKIir6_4iHiaw5q7QxFeeFYrYXdd_AIGqu52nHoER4TWrb-DmeAWMqMHamhW8vKfQ1ntEWZguN7xIr4MYCE-0hm2LMJPot1WSrVWp9fq7v3IfFkrLHvfuNeH6-KQbgtYzrM-wKmKc31EK63Eg",
    status: "Kutilmoqda"
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    time: "14:10",
    adminName: "Rustam Aliyev",
    actionText: "#PAY-7405 to'lovini tasdiqladi (+100 kredit, O'qituvchi ID: 29011)",
    ip: "213.230.87.12"
  },
  {
    id: "log-2",
    time: "12:05",
    adminName: "Rustam Aliyev",
    actionText: "ID: 19842 hisobiga 15 kredit qaytardi (Xatolik kompensatsiyasi)",
    ip: "213.230.87.12"
  }
];

export const TEMPLATES = [
  {
    id: "temp-1",
    title: "Tabiiy fanlar darsi",
    subject: "Biologiya • Kimyo",
    description: "Tajribalar, 3D organlar va viktorina",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqA5E-bzK1tCi1_riJWncRQhsKkX_EXi_gGV5fEM28z0Rt2VNZn38JSQgfEWMtqr3DVlqyuc6just_zCYPgbdW2dUy0Fb-CLMqnNzSMYpqt9qLD5Uc_FmR45F1QwSQ4DgRgmvP0yUAZhmCIKvt0AI0fjV92wAR6rnwdT9FUBv5bEKb02WnF900m5AhyLp-ab50LID2NHh_BJrWQPAxaf34_0Bng0Pnd0qMtGbMglvgW9aUMqnk2mmaAQ"
  },
  {
    id: "temp-2",
    title: "Ona tili va adabiyot",
    subject: "Filologiya",
    description: "G'azallar tahlili, so'z boyligi o'yinlari",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1rr-wgFeL31NSbcUZrz9I2RmnSMtHiWMriQj6luAGcS-Q2tg0M_DZnpExJRWclmgS0zT1BpGq-TTgpPUYBlrqkIk3OnVA0DIkmJwTrTPi7bNBbWNuaoC2bany3wFn7M0q9az1QzzAmsLQkpy1xhRZdbIHv7smYsh-aj-4Om-0pxTqkj3jEv-nljoVhGe6lD2GbHtzJRnDDZNeLlZgfGu8N9ayxyBuhf2gXrCzqg3xAc5pzRYC1Gci6A"
  },
  {
    id: "temp-3",
    title: "Tarix va jamiyat",
    subject: "Ijtimoiy fanlar",
    description: "Xronologik xaritalar va fakt-testlar",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM49XRrrbiKy3SUcCPk34S8PyxBy_AtCy6EnjXBPbh37rQcr5Jrxx1Ajl4zT79JZy1NN4oh5XFLbO76yXSej1187h6QCRQNeStlVNdRiNSqvCT8EkO1iwTaMECbrJY08g_hqE-cSoxQ5eBL27Uzi3k7oe1Pu0LTkZKr0fVYIW59gbH0Jrq9FGO21g19AU48VRCVtdjBXyEqeNHuMc1tqIk8dvUrkcL8hOvwRjh8xtEmNuMajYYKeru8A"
  },
  {
    id: "temp-4",
    title: "Aniq fanlar",
    subject: "STEM • Fizika",
    description: "Formulalar, chizmalar va mini-masalalar",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDisQjJwUlm1aLTb3SCw-AjYR6LTQTBg7RAQ2HEeh9mM_ynmswIxrge6GfrHC7LcfAssLKtLLBP4Ub3qQkxmdHUH0ZOm7sLClB9gFCmML1gaHylhdsUc0NqnVoeHnt0GC5HJ0u7QdVzWRiXq1szn1Q-lGbIaCeEGVkWD4GTBQIGI1jrcvAjwiXlLWRLzen4f0p2SRfali_O7SHFzoc8gDXXOVh-b1hWw-FYAHgQoUwxS9eqy49424Jx6w"
  }
];

export type PageTab = 
  | 'bosh-sahifa' 
  | 'yangi-taqdimot' 
  | 'generatsiya'
  | 'taqdimot-korish'
  | 'mening-taqdimotlarim' 
  | 'kreditlarim' 
  | 'tolovlar' 
  | 'admin-panel';

export interface SlideOption {
  label: string;
  text: string;
  isCorrect?: boolean;
  targetSlide?: number;
}

export interface SlideItem {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  type: 'cover' | 'outline' | 'content' | 'quiz-intro' | 'quiz-question' | 'quiz-correct' | 'quiz-wrong' | 'summary';
  bgImageUrl?: string;
  badges?: string[];
  options?: SlideOption[];
  isGenerating?: boolean;
}

export interface Presentation {
  id: string;
  jobId?: string;
  title: string;
  subject: string;
  grade: string;
  language: string;
  slideCount: number;
  aiImagesCount: number;
  quizQuestionsCount: number;
  style: string;
  textDensity: 'Qisqa' | 'Muvozanatli' | 'Batafsil';
  objectives: string;
  status: 'Tayyor' | 'Jarayonda' | 'Qoralama';
  date: string;
  fileSize: string;
  slides: SlideItem[];
}

export interface CreditTransaction {
  id: string;
  date: string;
  title: string;
  detail: string;
  amount: number; // e.g. -41, +50
  remainingBalance: number;
  status: 'Muvaffaqiyatli' | 'Tasdiqlangan' | 'Qaytarildi' | 'Bonus berildi';
}

export interface PaymentRequest {
  id: string;
  teacherName: string;
  teacherId: string;
  school: string;
  requestedCredits: number;
  amount: string;
  method: 'Payme' | 'Click' | 'Uzum';
  date: string;
  receiptImage: string;
  status: 'Kutilmoqda' | 'Tasdiqlandi' | 'Rad etildi';
}

export interface AuditLog {
  id: string;
  time: string;
  adminName: string;
  actionText: string;
  ip: string;
}

export interface SystemPricing {
  slidePrice: number;
  aiImagePrice: number;
  quizPrice: number;
  welcomeBonus: number;
}

export interface UserProfile {
  name: string;
  id: string;
  email: string;
  school: string;
  credits: number;
  avatarUrl: string;
  role?: 'admin' | 'user';
  password?: string;
  phone?: string;
}


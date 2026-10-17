import {
  UserProfile,
  Presentation,
  CreditTransaction,
  PaymentRequest,
  AuditLog,
  SystemPricing,
} from '../types';
import {
  INITIAL_PRESENTATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_PAYMENT_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PRICING,
} from '../data/mockData';

export const ADMIN_EMAIL = 'qosimovumidjon1602@gmail.com';
export const ADMIN_PASSWORD = '3084455Bk.';
export const TELEGRAM_ADMIN_URL = 'https://t.me/Cyber_Umidjon';

export const INITIAL_USERS: UserProfile[] = [
  {
    name: 'Umidjon Qosimov',
    id: '10001',
    email: ADMIN_EMAIL,
    school: "AI Avto-Slayd Bosh Ma'muriyat",
    credits: 500,
    role: 'admin',
    password: ADMIN_PASSWORD,
    phone: '+998 90 123 45 67',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxSnA8iXGfp_1COvRXbYlqcDbpimT6YsGgUC53gDiYub0Zt26q3LqDmEMuyf6vfDkRaPKuPNxH0XbaA9yb4zP5ClQygBWp_osIMz2yvn6a3gdbDpBovHfetiYJnghyVoR4eSI_Fa3gbAlAVeuCEZy4gAO6PudVORxvWqQ6w-ZU1LWgZH72heS0ijGSw4EKqmcui0SaY9pNGj_iFiptrjck3w3BbflVonSE8ytvXYwGtQR27D04vNj7TA',
  },
  {
    name: 'Nodira Karimova',
    id: '48291',
    email: 'nodira.karimova@maktab.uz',
    school: 'Toshkent sh. 142-maktab',
    credits: 45,
    role: 'user',
    phone: '+998 93 555 12 34',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxSnA8iXGfp_1COvRXbYlqcDbpimT6YsGgUC53gDiYub0Zt26q3LqDmEMuyf6vfDkRaPKuPNxH0XbaA9yb4zP5ClQygBWp_osIMz2yvn6a3gdbDpBovHfetiYJnghyVoR4eSI_Fa3gbAlAVeuCEZy4gAO6PudVORxvWqQ6w-ZU1LWgZH72heS0ijGSw4EKqmcui0SaY9pNGj_iFiptrjck3w3BbflVonSE8ytvXYwGtQR27D04vNj7TA',
  },
  {
    name: 'Jahangir Otajonov',
    id: '39104',
    email: 'jahangir.o@edu.uz',
    school: 'Samarqand 12-IDUM',
    credits: 50,
    role: 'user',
    phone: '+998 91 234 56 78',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxSnA8iXGfp_1COvRXbYlqcDbpimT6YsGgUC53gDiYub0Zt26q3LqDmEMuyf6vfDkRaPKuPNxH0XbaA9yb4zP5ClQygBWp_osIMz2yvn6a3gdbDpBovHfetiYJnghyVoR4eSI_Fa3gbAlAVeuCEZy4gAO6PudVORxvWqQ6w-ZU1LWgZH72heS0ijGSw4EKqmcui0SaY9pNGj_iFiptrjck3w3BbflVonSE8ytvXYwGtQR27D04vNj7TA',
  },
  {
    name: 'Dilnoza Saidova',
    id: '51208',
    email: 'dilnoza.s@edu.uz',
    school: "Farg'ona 4-maktab",
    credits: 250,
    role: 'user',
    phone: '+998 94 987 65 43',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxSnA8iXGfp_1COvRXbYlqcDbpimT6YsGgUC53gDiYub0Zt26q3LqDmEMuyf6vfDkRaPKuPNxH0XbaA9yb4zP5ClQygBWp_osIMz2yvn6a3gdbDpBovHfetiYJnghyVoR4eSI_Fa3gbAlAVeuCEZy4gAO6PudVORxvWqQ6w-ZU1LWgZH72heS0ijGSw4EKqmcui0SaY9pNGj_iFiptrjck3w3BbflVonSE8ytvXYwGtQR27D04vNj7TA',
  },
];

// Helper to safely get from localStorage
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
}

// Helper to safely save to localStorage
function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Users
  getUsers: (): UserProfile[] => {
    const list = getStored<UserProfile[]>('ai_avtoslayd_users', INITIAL_USERS);
    // Ensure admin user has updated ADMIN_PASSWORD
    return list.map((u) => {
      if (u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        return { ...u, password: ADMIN_PASSWORD, role: 'admin' as const };
      }
      return u;
    });
  },
  saveUsers: (users: UserProfile[]): void => {
    setStored('ai_avtoslayd_users', users);
  },
  getActiveUserId: (): string => {
    return getStored<string>('ai_avtoslayd_active_user_id', '48291');
  },
  setActiveUserId: (id: string): void => {
    setStored('ai_avtoslayd_active_user_id', id);
  },
  getCurrentUser: (): UserProfile => {
    const users = StorageService.getUsers();
    const activeId = StorageService.getActiveUserId();
    const found = users.find((u) => u.id === activeId);
    return found || users[0] || INITIAL_USERS[0];
  },
  saveCurrentUser: (user: UserProfile): void => {
    StorageService.setActiveUserId(user.id);
    const users = StorageService.getUsers();
    const exists = users.some((u) => u.id === user.id);
    const updated = exists ? users.map((u) => (u.id === user.id ? user : u)) : [...users, user];
    StorageService.saveUsers(updated);
  },

  // Admin Auth Session
  isAdminAuthenticated: (): boolean => {
    return getStored<boolean>('ai_avtoslayd_admin_auth', false);
  },
  setAdminAuthenticated: (auth: boolean): void => {
    setStored('ai_avtoslayd_admin_auth', auth);
  },

  // Pricing
  getPricing: (): SystemPricing => {
    return getStored<SystemPricing>('ai_avtoslayd_pricing', INITIAL_PRICING);
  },
  savePricing: (pricing: SystemPricing): void => {
    setStored('ai_avtoslayd_pricing', pricing);
  },

  // Presentations
  getPresentations: (): Presentation[] => {
    return getStored<Presentation[]>('ai_avtoslayd_presentations', INITIAL_PRESENTATIONS);
  },
  savePresentations: (presentations: Presentation[]): void => {
    setStored('ai_avtoslayd_presentations', presentations);
  },

  // Transactions
  getTransactions: (): CreditTransaction[] => {
    return getStored<CreditTransaction[]>('ai_avtoslayd_transactions', INITIAL_TRANSACTIONS);
  },
  saveTransactions: (transactions: CreditTransaction[]): void => {
    setStored('ai_avtoslayd_transactions', transactions);
  },

  // Payment requests
  getPaymentRequests: (): PaymentRequest[] => {
    return getStored<PaymentRequest[]>('ai_avtoslayd_payment_requests', INITIAL_PAYMENT_REQUESTS);
  },
  savePaymentRequests: (requests: PaymentRequest[]): void => {
    setStored('ai_avtoslayd_payment_requests', requests);
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    return getStored<AuditLog[]>('ai_avtoslayd_audit_logs', INITIAL_AUDIT_LOGS);
  },
  saveAuditLogs: (logs: AuditLog[]): void => {
    setStored('ai_avtoslayd_audit_logs', logs);
  },
};

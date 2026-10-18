import { useState, useEffect } from 'react';
import {
  PageTab,
  UserProfile,
  Presentation,
  SlideItem,
  CreditTransaction,
  PaymentRequest,
  AuditLog,
  SystemPricing,
} from './types';
import { StorageService, ADMIN_EMAIL, ADMIN_PASSWORD } from './utils/storage';
import { INITIAL_SOLAR_SLIDES } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { BoshSahifa } from './components/BoshSahifa';
import { YangiTaqdimot } from './components/YangiTaqdimot';
import { GeneratsiyaJarayoni } from './components/GeneratsiyaJarayoni';
import { TaqdimotKorish } from './components/TaqdimotKorish';
import { MeningTaqdimotlarim } from './components/MeningTaqdimotlarim';
import { Kreditlarim } from './components/Kreditlarim';
import { Tolovlar } from './components/Tolovlar';
import { AdminPanel } from './components/AdminPanel';
import { EditProfileModal } from './components/EditProfileModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('bosh-sahifa');

  // Multi-user and Persistent state
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => StorageService.getUsers());
  const [user, setUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [presentations, setPresentations] = useState<Presentation[]>(() =>
    StorageService.getPresentations()
  );
  const [activePresentation, setActivePresentation] = useState<Presentation>(() => {
    const list = StorageService.getPresentations();
    return list[0] || ({} as Presentation);
  });
  const [transactions, setTransactions] = useState<CreditTransaction[]>(() =>
    StorageService.getTransactions()
  );
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() =>
    StorageService.getPaymentRequests()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [pricing, setPricing] = useState<SystemPricing>(() => StorageService.getPricing());

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState<{ show: boolean; title: string }>({
    show: false,
    title: '',
  });

  // Pre-fill fields for YangiTaqdimot when selected from template
  const [tplTopic, setTplTopic] = useState<string | undefined>();
  const [tplSubject, setTplSubject] = useState<string | undefined>();
  const [tplGrade, setTplGrade] = useState<string | undefined>();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    StorageService.isAdminAuthenticated()
  );

  // Helper to sync user modifications both in allUsers array and active user
  const updateUserRecord = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    StorageService.saveCurrentUser(updatedUser);

    setAllUsers((prevUsers) => {
      const exists = prevUsers.some((u) => u.id === updatedUser.id);
      const next = exists
        ? prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        : [...prevUsers, updatedUser];
      StorageService.saveUsers(next);
      return next;
    });
  };

  const handleSelectUser = (selected: UserProfile) => {
    setUser(selected);
    StorageService.saveCurrentUser(selected);
  };

  const handleRegisterUser = (
    name: string,
    email: string,
    school: string,
    avatarUrl?: string
  ) => {
    const newId = String(Math.floor(10000 + Math.random() * 90000));
    const defaultAvatar =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxSnA8iXGfp_1COvRXbYlqcDbpimT6YsGgUC53gDiYub0Zt26q3LqDmEMuyf6vfDkRaPKuPNxH0XbaA9yb4zP5ClQygBWp_osIMz2yvn6a3gdbDpBovHfetiYJnghyVoR4eSI_Fa3gbAlAVeuCEZy4gAO6PudVORxvWqQ6w-ZU1LWgZH72heS0ijGSw4EKqmcui0SaY9pNGj_iFiptrjck3w3BbflVonSE8ytvXYwGtQR27D04vNj7TA';
    const newUser: UserProfile = {
      name,
      id: newId,
      email,
      school,
      credits: 15, // 15 bonus credits for new teachers
      role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
      avatarUrl: avatarUrl || defaultAvatar,
    };
    setAllUsers((prev) => {
      const next = [...prev, newUser];
      StorageService.saveUsers(next);
      return next;
    });
    setUser(newUser);
    StorageService.saveCurrentUser(newUser);
  };

  const handleAdminLogin = (email: string, pass: string): boolean => {
    const normEmail = email.trim().toLowerCase();
    if (normEmail === ADMIN_EMAIL.toLowerCase()) {
      const adminUser = allUsers.find((u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) || {
        name: 'Umidjon Qosimov (Admin)',
        id: '99999',
        email: ADMIN_EMAIL,
        school: "AI Avto-Slayd Tizim Ma'muri",
        credits: 9999,
        role: 'admin' as const,
        password: ADMIN_PASSWORD,
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD5gEccFwK-0niQhWhMJdT53OAIFuk0sXypEsLr2V1nepcXUdgpCFqsjLcKmCVzRQolikm_BavjQb6RPO08kGf0maBJRlCkKZx6tc_0-OKIir6_4iHiaw5q7QxFeeFYrYXdd_AIGqu52nHoER4TWrb-DmeAWMqMHamhW8vKfQ1ntEWZguN7xIr4MYCE-0hm2LMJPot1WSrVWp9fq7v3IfFkrLHvfuNeH6-KQbgtYzrM-wKmKc31EK63Eg',
      };
      if (pass === ADMIN_PASSWORD) {
        setIsAdminAuthenticated(true);
        StorageService.setAdminAuthenticated(true);
        setUser(adminUser);
        StorageService.saveCurrentUser(adminUser);
        return true;
      }
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    StorageService.setAdminAuthenticated(false);
  };

  // 1. Template selection
  const handleSelectTemplate = (topic: string, subject: string, grade: string) => {
    setTplTopic(topic);
    setTplSubject(subject);
    setTplGrade(grade);
    setCurrentTab('yangi-taqdimot');
  };

  // 2. Start generation
  const handleStartGeneration = (data: Partial<Presentation>, totalCost: number) => {
    const newId = `PPT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newJobId = `#JOB-${Math.floor(10000 + Math.random() * 90000)}`;

    const newDeck: Presentation = {
      id: newId,
      jobId: newJobId,
      title: data.title || "Yangi taqdimot",
      subject: data.subject || "Umumiy fan",
      grade: data.grade || "6-sinf",
      language: data.language || "O'zbek tili (Lotin)",
      slideCount: data.slideCount || 28,
      aiImagesCount: data.aiImagesCount || 4,
      quizQuestionsCount: data.quizQuestionsCount || 5,
      style: data.style || "Akademik Moviy",
      textDensity: data.textDensity || "Muvozanatli",
      objectives: data.objectives || "",
      status: "Jarayonda",
      date: "Hozirgina",
      fileSize: "18.4 MB (.pptx)",
      slides: INITIAL_SOLAR_SLIDES,
    };

    // Deduct user credits
    const updatedUser: UserProfile = {
      ...user,
      credits: Math.max(0, user.credits - totalCost),
    };
    updateUserRecord(updatedUser);

    // Record credit transaction
    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      date: "Hozirgina",
      title: "Taqdimot generatsiyasi",
      detail: `"${newDeck.title}" (${newDeck.slideCount} slayd, ${newDeck.aiImagesCount} rasm, ${newDeck.quizQuestionsCount} viktorina)`,
      amount: -totalCost,
      remainingBalance: updatedUser.credits,
      status: "Muvaffaqiyatli",
    };
    const nextTxList = [newTx, ...transactions];
    setTransactions(nextTxList);
    StorageService.saveTransactions(nextTxList);

    const nextPresentations = [newDeck, ...presentations];
    setPresentations(nextPresentations);
    StorageService.savePresentations(nextPresentations);

    setActivePresentation(newDeck);
    setCurrentTab('generatsiya');
  };

  // 3. Cancel generation with refund
  const handleCancelGeneration = (refundCredits: number) => {
    const updatedUser: UserProfile = {
      ...user,
      credits: user.credits + refundCredits,
    };
    updateUserRecord(updatedUser);

    const refundTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      date: "Hozirgina",
      title: "Kredit qaytarildi (Refund)",
      detail: "Generatsiya bekor qilinganligi sababli to'liq hisobga qaytarildi",
      amount: +refundCredits,
      remainingBalance: updatedUser.credits,
      status: "Qaytarildi",
    };
    const nextTx = [refundTx, ...transactions];
    setTransactions(nextTx);
    StorageService.saveTransactions(nextTx);

    // Update presentation status
    const updatedPresentations = presentations.map((p) =>
      p.id === activePresentation.id ? { ...p, status: 'Qoralama' as const } : p
    );
    setPresentations(updatedPresentations);
    StorageService.savePresentations(updatedPresentations);

    setCurrentTab('mening-taqdimotlarim');
  };

  // 4. Save draft
  const handleSaveDraft = (data: Partial<Presentation>) => {
    const newId = `PPT-${Math.floor(10000 + Math.random() * 90000)}`;
    const draftDeck: Presentation = {
      id: newId,
      title: data.title || "Qoralama taqdimot",
      subject: data.subject || "Fan",
      grade: data.grade || "6-sinf",
      language: data.language || "O'zbek tili (Lotin)",
      slideCount: data.slideCount || 28,
      aiImagesCount: data.aiImagesCount || 4,
      quizQuestionsCount: data.quizQuestionsCount || 5,
      style: data.style || "Akademik Moviy",
      textDensity: data.textDensity || "Muvozanatli",
      objectives: data.objectives || "",
      status: "Qoralama",
      date: "Hozirgina",
      fileSize: "0 MB",
      slides: [],
    };
    const nextList = [draftDeck, ...presentations];
    setPresentations(nextList);
    StorageService.savePresentations(nextList);
    alert("Qoralama saqlandi!");
    setCurrentTab('mening-taqdimotlarim');
  };

  // 5. Complete generation
  const handleCompleteGeneration = (generatedSlides?: SlideItem[]) => {
    const nextList = presentations.map((p) =>
      p.id === activePresentation.id
        ? {
            ...p,
            status: 'Tayyor' as const,
            slides: generatedSlides && generatedSlides.length > 0 ? generatedSlides : p.slides,
          }
        : p
    );
    setPresentations(nextList);
    StorageService.savePresentations(nextList);
    setActivePresentation((prev) => ({
      ...prev,
      status: 'Tayyor' as const,
      slides: generatedSlides && generatedSlides.length > 0 ? generatedSlides : prev.slides,
    }));
    setCurrentTab('taqdimot-korish');
  };

  // 6. Download PPTX
  const handleDownloadPptx = (p: Presentation) => {
    const blob = new Blob(
      [
        `AI Avto-Slayd Presentation: ${p.title}\nSubject: ${p.subject}\nGrade: ${p.grade}\nTotal Slides: ${p.slideCount}\nCreated for: ${user.name} (#${user.id})\nAdmin contact: @Cyber_Umidjon\nStandard: O'zbekiston Respublikasi DTS`,
      ],
      { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.title.replace(/\s+/g, '_')}.pptx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadToast({ show: true, title: p.title });
    setTimeout(() => {
      setDownloadToast({ show: false, title: '' });
    }, 4000);
  };

  // 7. Delete Presentation
  const handleDeletePresentation = (id: string) => {
    const nextList = presentations.filter((p) => p.id !== id);
    setPresentations(nextList);
    StorageService.savePresentations(nextList);
  };

  // 8. Admin Payment Approval
  const handleApprovePayment = (reqId: string, teacherId: string, credits: number) => {
    const updatedRequests = paymentRequests.map((r) =>
      r.id === reqId ? { ...r, status: 'Tasdiqlandi' as const } : r
    );
    setPaymentRequests(updatedRequests);
    StorageService.savePaymentRequests(updatedRequests);

    // Credit targeted user
    const targetUser = allUsers.find((u) => u.id === teacherId);
    if (targetUser) {
      const nextCreditTotal = targetUser.credits + credits;
      const updatedTargetUser = { ...targetUser, credits: nextCreditTotal };
      const nextAllUsers = allUsers.map((u) => (u.id === teacherId ? updatedTargetUser : u));
      setAllUsers(nextAllUsers);
      StorageService.saveUsers(nextAllUsers);

      if (teacherId === user.id) {
        setUser(updatedTargetUser);
        StorageService.saveCurrentUser(updatedTargetUser);
      }
    }

    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      date: "Hozirgina",
      title: "Hisob to'ldirildi",
      detail: `Admin tasdiqlagan to'lov (${reqId})`,
      amount: +credits,
      remainingBalance: (targetUser?.credits || 0) + credits,
      status: "Tasdiqlangan",
    };
    const nextTx = [newTx, ...transactions];
    setTransactions(nextTx);
    StorageService.saveTransactions(nextTx);

    // Add to Audit logs
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      adminName: user.email === ADMIN_EMAIL ? "Umidjon Qosimov (Admin)" : "Administrator",
      actionText: `${reqId} to'lovini tasdiqladi (+${credits} kredit, O'qituvchi ID: ${teacherId})`,
      ip: "178.218.201.55",
    };
    const nextLogs = [newLog, ...auditLogs];
    setAuditLogs(nextLogs);
    StorageService.saveAuditLogs(nextLogs);
  };

  // 9. Admin Payment Rejection
  const handleRejectPayment = (reqId: string) => {
    const updatedRequests = paymentRequests.map((r) =>
      r.id === reqId ? { ...r, status: 'Rad etildi' as const } : r
    );
    setPaymentRequests(updatedRequests);
    StorageService.savePaymentRequests(updatedRequests);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      adminName: user.email === ADMIN_EMAIL ? "Umidjon Qosimov (Admin)" : "Administrator",
      actionText: `${reqId} to'lov so'rovini rad etdi`,
      ip: "178.218.201.55",
    };
    const nextLogs = [newLog, ...auditLogs];
    setAuditLogs(nextLogs);
    StorageService.saveAuditLogs(nextLogs);
  };

  // 10. Admin Manual Credit Adjustment (+ or -)
  const handleManualCreditAdjust = (teacherId: string, amount: number, reason: string) => {
    const targetUser = allUsers.find((u) => u.id === teacherId);
    if (targetUser) {
      const nextBalance = Math.max(0, targetUser.credits + amount);
      const updatedTargetUser = { ...targetUser, credits: nextBalance };
      const nextAllUsers = allUsers.map((u) => (u.id === teacherId ? updatedTargetUser : u));
      setAllUsers(nextAllUsers);
      StorageService.saveUsers(nextAllUsers);

      if (teacherId === user.id) {
        setUser(updatedTargetUser);
        StorageService.saveCurrentUser(updatedTargetUser);
      }

      const newTx: CreditTransaction = {
        id: `tx-${Date.now()}`,
        date: "Hozirgina",
        title: amount >= 0 ? "Kredit qo'shildi (Admin)" : "Kredit yechildi (Admin)",
        detail: `${reason} (Admin: Umidjon Qosimov)`,
        amount,
        remainingBalance: nextBalance,
        status: amount >= 0 ? "Tasdiqlangan" : "Qaytarildi",
      };
      const nextTx = [newTx, ...transactions];
      setTransactions(nextTx);
      StorageService.saveTransactions(nextTx);
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      adminName: "Umidjon Qosimov (Admin)",
      actionText: `ID: #${teacherId} hisobiga ${amount > 0 ? `+${amount}` : amount} kredit belgiladi (${reason})`,
      ip: "178.218.201.55",
    };
    const nextLogs = [newLog, ...auditLogs];
    setAuditLogs(nextLogs);
    StorageService.saveAuditLogs(nextLogs);
  };

  // 11. User submits a payment request in Tolovlar
  const handleSubmitPaymentRequest = (pkgName: string, credits: number, price: string) => {
    const newReqId = `#PAY-${Math.floor(7420 + Math.random() * 80)}`;
    const newReq: PaymentRequest = {
      id: newReqId,
      teacherName: user.name,
      teacherId: user.id,
      school: user.school,
      requestedCredits: credits,
      amount: price,
      method: "Payme",
      date: "Hozirgina",
      receiptImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5gEccFwK-0niQhWhMJdT53OAIFuk0sXypEsLr2V1nepcXUdgpCFqsjLcKmCVzRQolikm_BavjQb6RPO08kGf0maBJRlCkKZx6tc_0-OKIir6_4iHiaw5q7QxFeeFYrYXdd_AIGqu52nHoER4TWrb-DmeAWMqMHamhW8vKfQ1ntEWZguN7xIr4MYCE-0hm2LMJPot1WSrVWp9fq7v3IfFkrLHvfuNeH6-KQbgtYzrM-wKmKc31EK63Eg",
      status: "Kutilmoqda",
    };
    const nextRequests = [newReq, ...paymentRequests];
    setPaymentRequests(nextRequests);
    StorageService.savePaymentRequests(nextRequests);
  };

  // 12. Update pricing policy
  const handleUpdatePricing = (newPricing: SystemPricing) => {
    setPricing(newPricing);
    StorageService.savePricing(newPricing);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      adminName: "Umidjon Qosimov (Admin)",
      actionText: `Tizim slayd va xizmat narxlari tariflarini yangiladi`,
      ip: "178.218.201.55",
    };
    const nextLogs = [newLog, ...auditLogs];
    setAuditLogs(nextLogs);
    StorageService.saveAuditLogs(nextLogs);
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen flex flex-col font-body">
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenEditProfile={() => setEditProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1">
        {currentTab === 'bosh-sahifa' && (
          <BoshSahifa
            user={user}
            presentations={presentations}
            onSelectPresentation={(p) => {
              setActivePresentation(p);
              setCurrentTab('taqdimot-korish');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTemplate={handleSelectTemplate}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDownloadPptx={handleDownloadPptx}
            onOpenEditProfile={() => setEditProfileModalOpen(true)}
          />
        )}

        {currentTab === 'yangi-taqdimot' && (
          <YangiTaqdimot
            user={user}
            initialTopic={tplTopic}
            initialSubject={tplSubject}
            initialGrade={tplGrade}
            onStartGeneration={handleStartGeneration}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentTab === 'generatsiya' && (
          <GeneratsiyaJarayoni
            currentPresentation={activePresentation}
            onCancel={handleCancelGeneration}
            onComplete={handleCompleteGeneration}
          />
        )}

        {currentTab === 'taqdimot-korish' && (
          <TaqdimotKorish
            presentation={activePresentation}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDownloadPptx={handleDownloadPptx}
            onDeletePresentation={handleDeletePresentation}
          />
        )}

        {currentTab === 'mening-taqdimotlarim' && (
          <MeningTaqdimotlarim
            presentations={presentations}
            onSelectPresentation={(p) => {
              setActivePresentation(p);
              setCurrentTab('taqdimot-korish');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDownloadPptx={handleDownloadPptx}
            onDeletePresentation={handleDeletePresentation}
          />
        )}

        {currentTab === 'kreditlarim' && (
          <Kreditlarim
            user={user}
            transactions={transactions}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenEditProfile={() => setEditProfileModalOpen(true)}
          />
        )}

        {currentTab === 'tolovlar' && (
          <Tolovlar
            user={user}
            paymentRequests={paymentRequests}
            onSubmitPaymentRequest={handleSubmitPaymentRequest}
          />
        )}

        {currentTab === 'admin-panel' && (
          <AdminPanel
            currentUser={user}
            allUsers={allUsers}
            paymentRequests={paymentRequests}
            auditLogs={auditLogs}
            pricing={pricing}
            isAdminAuthenticated={isAdminAuthenticated}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onApprovePayment={handleApprovePayment}
            onRejectPayment={handleRejectPayment}
            onManualCreditAdjust={handleManualCreditAdjust}
            onUpdatePricing={handleUpdatePricing}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        currentUser={user}
        onSaveProfile={updateUserRecord}
      />

      {/* Google & Email Authentication Modal with multi-user persistence */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={user}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        onRegisterUser={handleRegisterUser}
        onAdminLogin={handleAdminLogin}
      />

      {/* Global Download Feedback Toast */}
      {downloadToast.show && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#131b2e] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#3525cd]/40 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-code-md text-xs font-bold flex items-center justify-center">
            P
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">PowerPoint (.pptx) yuklab olindi!</span>
            <span className="text-[11px] text-[#c3c0ff] truncate max-w-xs">
              {downloadToast.title}.pptx
            </span>
          </div>
          <span className="material-symbols-outlined text-[#6cf8bb] text-[20px] ml-2">
            download_done
          </span>
        </div>
      )}
    </div>
  );
}

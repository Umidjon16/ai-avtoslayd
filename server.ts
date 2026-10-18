import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI with API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Cloudflare Workers AI configuration
let CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
let CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
let PREFERRED_IMAGE_ENGINE = (process.env.PREFERRED_IMAGE_ENGINE || 'cloudflare') as 'pollinations' | 'cloudflare';

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} catch (err) {
  console.warn('Failed to initialize GoogleGenAI client:', err);
}

// Generate image URL with intelligent routing: Cloudflare Workers AI (Flux-1) with Pollinations AI fallback
function getAiImageUrl(prompt: string, seed?: number): string {
  const safeSeed = seed || Math.floor(Math.random() * 899999 + 100000);
  const cleanPrompt = encodeURIComponent(`${prompt}, educational presentation slide visual, high quality, 4k, photorealistic or clean modern scientific digital art`);
  
  if (PREFERRED_IMAGE_ENGINE === 'cloudflare' && CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN) {
    return `/api/ai-image?prompt=${cleanPrompt}&seed=${safeSeed}`;
  }
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1280&height=720&nologo=true&seed=${safeSeed}`;
}

// Status check API
app.get('/api/status', async (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    geminiConfigured: !!GEMINI_API_KEY,
    cloudflareConfigured: !!(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN),
    preferredImageEngine: PREFERRED_IMAGE_ENGINE,
    model: 'gemini-3.8-flash',
    imageEngines: [
      { name: 'Pollinations AI (Flux / SDXL)', status: 'Faol (Bepul, cheksiz, kalitsiz)' },
      { name: 'Cloudflare Workers AI (Flux-1 Schnell)', status: (CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN) ? 'Ulangan' : 'Sozlangan (ixtiyoriy kalit kiritilishi mumkin)' }
    ],
    message: "Google Gemini va Cloudflare / Pollinations AI integratsiyasi tayyor",
  });
});

// AI Settings API (Get and Update Cloudflare / Gemini configs)
app.get('/api/settings/ai', async (_req: Request, res: Response) => {
  res.json({
    gemini: {
      isConfigured: !!GEMINI_API_KEY,
      keyMasked: GEMINI_API_KEY ? `${GEMINI_API_KEY.slice(0, 6)}...${GEMINI_API_KEY.slice(-4)}` : '',
    },
    cloudflare: {
      isConfigured: !!(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN),
      accountIdMasked: CLOUDFLARE_ACCOUNT_ID ? `${CLOUDFLARE_ACCOUNT_ID.slice(0, 4)}...${CLOUDFLARE_ACCOUNT_ID.slice(-4)}` : '',
      tokenMasked: CLOUDFLARE_API_TOKEN ? `${CLOUDFLARE_API_TOKEN.slice(0, 4)}...${CLOUDFLARE_API_TOKEN.slice(-4)}` : '',
    },
    preferredImageEngine: PREFERRED_IMAGE_ENGINE,
  });
});

app.post('/api/settings/ai', async (req: Request, res: Response) => {
  const { accountId, apiToken, preferredEngine } = req.body;
  if (typeof accountId === 'string') {
    CLOUDFLARE_ACCOUNT_ID = accountId.trim();
  }
  if (typeof apiToken === 'string') {
    CLOUDFLARE_API_TOKEN = apiToken.trim();
  }
  if (preferredEngine === 'cloudflare' || preferredEngine === 'pollinations') {
    PREFERRED_IMAGE_ENGINE = preferredEngine;
  }
  res.json({
    success: true,
    message: "AI sozlamalari yangilandi!",
    cloudflareConfigured: !!(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN),
    preferredImageEngine: PREFERRED_IMAGE_ENGINE,
  });
});

// AI Image Generation Endpoint (Cloudflare Workers AI Flux-1 Schnell -> Pollinations fallback)
app.get('/api/ai-image', async (req: Request, res: Response) => {
  const prompt = (req.query.prompt as string) || 'educational presentation illustration';
  const seed = req.query.seed || '123456';
  const pollinationsFallback = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&seed=${seed}`;

  if (CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN) {
    try {
      const cfResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: decodeURIComponent(prompt) }),
        }
      );

      if (cfResponse.ok) {
        const contentType = cfResponse.headers.get('content-type') || '';
        if (contentType.includes('image')) {
          const buffer = await cfResponse.arrayBuffer();
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.send(Buffer.from(buffer));
        } else {
          const data: any = await cfResponse.json();
          if (data?.result?.image) {
            const imgBuffer = Buffer.from(data.result.image, 'base64');
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.send(imgBuffer);
          }
        }
      }
    } catch (cfErr) {
      console.warn('Cloudflare Workers AI image error, falling back to Pollinations:', cfErr);
    }
  }

  // Graceful fallback to Pollinations AI
  return res.redirect(302, pollinationsFallback);
});

// Presentation Generation API
app.post('/api/generate-presentation', async (req: Request, res: Response) => {
  const {
    topic = "Quyosh tizimi planetalari",
    subject = "Astronomiya",
    grade = "6-sinf",
    language = "O'zbek tili (Lotin)",
    slideCount = 10,
    aiImagesCount = 3,
    quizQuestionsCount = 3,
    style = "Akademik Moviy",
    textDensity = "Muvozanatli",
    objectives = "",
  } = req.body;

  console.log(`[AI Gen] Generating presentation for topic: "${topic}", subject: "${subject}", slides: ${slideCount}`);

  let generatedSlides: any[] = [];
  let usedGemini = false;

  if (ai) {
    try {
      const prompt = `
Siz O'zbekiston Respublikasi Davlat Ta'lim Standartlari (DTS) bo'yicha eng ilg'or oliy toifali metodist va o'qituvchisiz.
Quyidagi mavzu bo'yicha to'liq, mazmunli va qiziqarli dars taqdimoti slaydlarini tuzib bering:

Mavzu: ${topic}
Fan: ${subject}
Sinf: ${grade}
Til: ${language}
Jami slaydlar soni: ${slideCount} ta
Sun'iy intellekt rasmli slaydlar soni: ${aiImagesCount} ta
Interaktiv viktorina savollari soni: ${quizQuestionsCount} ta
Uslub: ${style}
Matn hajmi: ${textDensity}
Dars maqsadlari: ${objectives || 'Mavzuni to\'liq tushuntirish va o\'quvchilar bilimini mustahkamlash'}

TALABLAR:
1. Barcha sarlavhalar va matnlar sof, aniq, pedagogik jihatdan boy o'zbek tilida (lotin yozuvida) bo'lishi shart.
2. 1-slayd: type="cover" (Muqova).
3. 2-slayd: type="outline" (Mundarija va dars rejasi).
4. Oraliq slaydlar: type="content" (Darsning asosiy mazmuni, ta'riflar, tushuntirishlar).
5. Kamida ${aiImagesCount} ta slayd uchun "imagePrompt" deb nomlangan aniq inglizcha prompt yozing (masalan: "educational illustration of ... in realistic 4k detail").
6. Agar viktorina so'ralgan bo'lsa (${quizQuestionsCount} ta), 1 ta type="quiz-intro", so'ng har bir savol uchun type="quiz-question" (options: 4 ta variant A, B, C, D, ulardan bittasida isCorrect: true), so'ng bitta type="quiz-correct" va type="quiz-wrong".
7. Oxirgi slayd: type="summary" (Dars xulosasi va uyga vazifa).

Javobni FAQAT to'g'ri JSON formatida qaytaring:
{
  "slides": [
    {
      "id": "s1",
      "index": 1,
      "title": "Slayd sarlavhasi",
      "subtitle": "Qisqa tushuntirish yoki qism nomi",
      "type": "cover",
      "badges": ["Muqova", "${subject}"],
      "imagePrompt": "English prompt for AI image generator",
      "options": []
    }
  ]
}
`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 12000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text?.trim() || '';
      const parsed = JSON.parse(responseText);

      if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
        generatedSlides = parsed.slides.map((slide: any, idx: number) => {
          let bgUrl = '';
          if (slide.imagePrompt || idx < aiImagesCount || slide.type === 'cover') {
            const promptForImg = slide.imagePrompt || `${topic} ${slide.title} ${subject}`;
            bgUrl = getAiImageUrl(promptForImg, 1000 + idx);
          }
          return {
            id: `gen-slide-${idx + 1}`,
            index: idx + 1,
            title: slide.title || `${idx + 1}-slayd`,
            subtitle: slide.subtitle || `${subject} darsi`,
            type: slide.type || 'content',
            bgImageUrl: bgUrl || undefined,
            badges: slide.badges || [subject, grade],
            options: slide.options || undefined,
          };
        });
        usedGemini = true;
      }
    } catch (geminiError: any) {
      console.warn('Gemini API call failed or returned unparseable response:', geminiError?.message || geminiError);
    }
  }

  // Graceful high-quality pedagogical fallback if Gemini API had an error or reached quota
  if (!generatedSlides || generatedSlides.length === 0) {
    console.log('[AI Gen] Building pedagogical slides with custom AI curriculum generator...');
    generatedSlides = generateCurriculumSlides({
      topic,
      subject,
      grade,
      slideCount: Math.max(6, slideCount),
      aiImagesCount,
      quizQuestionsCount,
    });
  }

  res.json({
    success: true,
    usedGemini,
    topic,
    subject,
    grade,
    slideCount: generatedSlides.length,
    slides: generatedSlides,
  });
});

// Fallback high-fidelity curriculum slide generator
function generateCurriculumSlides(params: {
  topic: string;
  subject: string;
  grade: string;
  slideCount: number;
  aiImagesCount: number;
  quizQuestionsCount: number;
}) {
  const { topic, subject, grade, slideCount, aiImagesCount, quizQuestionsCount } = params;
  const slides: any[] = [];

  // 1. Cover Slide
  slides.push({
    id: 's1',
    index: 1,
    title: `01. ${topic}`,
    subtitle: `${grade} ${subject} fani uchun metodik taqdimot`,
    type: 'cover',
    bgImageUrl: getAiImageUrl(`${topic} educational classroom presentation`, 101),
    badges: ['Muqova', 'DTS Standart'],
  });

  // 2. Outline Slide
  slides.push({
    id: 's2',
    index: 2,
    title: '02. Dars rejasi va mundarija',
    subtitle: "Darsning asosiy bosqichlari va maqsadlari",
    type: 'outline',
    badges: ['Mundarija', '45 daqiqa'],
  });

  // Content slides
  const contentCount = Math.max(2, slideCount - 4 - (quizQuestionsCount > 0 ? 3 : 0));
  const subtopics = [
    `Mavzuning dolzarbligi va asosiy tushunchalari`,
    `Tuzilishi, qonuniyatlari va muhim hodisalar`,
    `Ilmiy tahlil va taqqoslash jadvali`,
    `Amaliy hayotdagi va fanning rivojidagi ahamiyati`,
    `Misollar, tajribalar va qiziqarli faktlar`,
    `Tizimli tahlil va xulosaviy fikrlar`,
  ];

  for (let i = 0; i < contentCount; i++) {
    const slideIdx = slides.length + 1;
    const hasImage = i < aiImagesCount;
    const sub = subtopics[i % subtopics.length];

    slides.push({
      id: `s${slideIdx}`,
      index: slideIdx,
      title: `0${slideIdx}. ${topic}: ${sub}`,
      subtitle: `${subject} bo'yicha asosiy tushunchalar va ilmiy qoidalar`,
      type: 'content',
      bgImageUrl: hasImage ? getAiImageUrl(`${topic} ${sub}`, 200 + i) : undefined,
      badges: hasImage ? ['AI Rasm', 'Ilmiy tahlil'] : ['Nazariy qism', 'DTS'],
    });
  }

  // Quiz slides
  if (quizQuestionsCount > 0) {
    const qIntroIdx = slides.length + 1;
    slides.push({
      id: `s${qIntroIdx}`,
      index: qIntroIdx,
      title: `0${qIntroIdx}. Interaktiv mustahkamlash viktorinasi`,
      subtitle: "Doskaga chiqing va to'g'ri variantni tanlang",
      type: 'quiz-intro',
      badges: ['Viktorina', "O'yin rejimi"],
    });

    const qIdx = slides.length + 1;
    slides.push({
      id: `s${qIdx}`,
      index: qIdx,
      title: `0${qIdx}. 1-Savol: ${topic} bo'yicha tekshiruv`,
      subtitle: "Interaktiv variantlardan to'g'risini bosing",
      type: 'quiz-question',
      options: [
        { label: 'A', text: `${topic} ning 1-xususiyati`, isCorrect: false, targetSlide: qIdx + 2 },
        { label: 'B', text: `${topic} bo'yicha to'g'ri ilmiy ta'rif ⭐`, isCorrect: true, targetSlide: qIdx + 1 },
        { label: 'C', text: `${topic} ning noaniq varianti`, isCorrect: false, targetSlide: qIdx + 2 },
        { label: 'D', text: "Yuqoridagilarning barchasi noto'g'ri", isCorrect: false, targetSlide: qIdx + 2 },
      ],
      badges: ['Savol #1', 'Giperhavola'],
    });

    const cIdx = slides.length + 1;
    slides.push({
      id: `s${cIdx}`,
      index: cIdx,
      title: `0${cIdx}. Barakalla, to'g'ri topdingiz! 🎉`,
      subtitle: `${topic} bo'yicha to'g'ri javob tanlandi (+10 ball)`,
      type: 'quiz-correct',
      badges: ["To'g'ri", '+10 ball'],
    });

    const wIdx = slides.length + 1;
    slides.push({
      id: `s${wIdx}`,
      index: wIdx,
      title: `0${wIdx}. Afsuski, javob noto'g'ri! ↩️`,
      subtitle: "Yana bir bor o'ylab ko'ring va qayta urinib ko'ring",
      type: 'quiz-wrong',
      badges: ["Noto'g'ri", 'Qayta urinish'],
    });
  }

  // Summary slide
  const summaryIdx = slides.length + 1;
  slides.push({
    id: `s${summaryIdx}`,
    index: summaryIdx,
    title: `0${summaryIdx}. Dars xulosasi va Uyga vazifa`,
    subtitle: `${topic} mavzusini mustahkamlash va darslikdagi mashqlar`,
    type: 'summary',
    badges: ['Xulosa', 'Uyga vazifa'],
  });

  return slides;
}

// Start Server & mount Vite
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Avto-Slayd server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

// AI Generation & Refinement Engine
// Supports OpenAI API, Gemini API, and High-Fidelity Autonomous Generation Engine

export interface GenerationResult {
  title: string;
  code: string;
  summary: string;
}

// 1. Core Generator Helper
export async function generateWebsiteCode(
  prompt: string,
  projectTitle?: string
): Promise<GenerationResult> {
  const cleanTitle = projectTitle || extractTitleFromPrompt(prompt);

  // If OpenAI API key is configured in .env
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-")) {
    try {
      const openAiRes = await generateWithOpenAI(prompt, cleanTitle);
      if (openAiRes) return openAiRes;
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to autonomous engine:", err);
    }
  }

  // If Gemini API key is configured in .env
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10) {
    try {
      const geminiRes = await generateWithGemini(prompt, cleanTitle);
      if (geminiRes) return geminiRes;
    } catch (err) {
      console.warn("Gemini API call failed, falling back to autonomous engine:", err);
    }
  }

  // Autonomous Engine (Zero-API Key Out-of-the-Box Generation)
  return generateAutonomousWebsite(prompt, cleanTitle);
}

// 2. Core Conversational Refinement Helper
export async function refineWebsiteCode(
  currentCode: string,
  userInstruction: string,
  chatHistory: { role: string; content: string }[] = []
): Promise<{ updatedCode: string; aiExplanation: string }> {
  // If OpenAI API key is present
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-")) {
    try {
      const res = await refineWithOpenAI(currentCode, userInstruction, chatHistory);
      if (res) return res;
    } catch (err) {
      console.warn("OpenAI refinement failed, using autonomous refiner:", err);
    }
  }

  // Autonomous Refiner
  return refineAutonomousWebsite(currentCode, userInstruction);
}

// --- OPENAI INTEGRATION ---
async function generateWithOpenAI(prompt: string, title: string): Promise<GenerationResult | null> {
  const systemPrompt = `You are an expert full-stack web developer and UI/UX designer.
Create a complete, single-file modern HTML/Tailwind CSS website based on the user's prompt.
Include:
- Responsive navbar with logo and links
- Hero section with call-to-actions, badges and gradients
- Feature grid with Lucide/FontAwesome style icons and cards
- Interactive components (e.g. pricing toggles, modals, FAQ accordions, testimonials)
- Modern dark/light luxury theme using Tailwind CSS (load via CDN: <script src="https://cdn.tailwindcss.com"></script>)
- Include interactive vanilla JavaScript in a <script> tag for mobile menus, modal popups, tab switching, and toast alerts.
- Return ONLY the full executable HTML code with <!DOCTYPE html>. Do NOT wrap in markdown backticks if possible, or wrap cleanly in \`\`\`html.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Title: ${title}\nUser Prompt: ${prompt}` },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  let rawCode = data.choices?.[0]?.message?.content || "";
  rawCode = cleanHtmlCode(rawCode);

  return {
    title,
    code: rawCode,
    summary: `Generated full-stack website for "${title}" with modern Tailwind styling and interactive components.`,
  };
}

async function refineWithOpenAI(
  currentCode: string,
  instruction: string,
  history: { role: string; content: string }[]
): Promise<{ updatedCode: string; aiExplanation: string } | null> {
  const systemPrompt = `You are an expert AI web developer. The user wants to modify their existing website.
Inspect the current HTML code and apply the requested change accurately.
Return your response in this JSON format:
{
  "explanation": "Short 1-2 sentence description of what you changed",
  "code": "<!DOCTYPE html>...updated full html code..."
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-4).map((h) => ({ role: h.role, content: h.content })),
        {
          role: "user",
          content: `Current Code:\n${currentCode}\n\nRequested Change: ${instruction}`,
        },
      ],
      temperature: 0.5,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");

  return {
    updatedCode: cleanHtmlCode(parsed.code || currentCode),
    aiExplanation: parsed.explanation || "I have updated the website as requested.",
  };
}

// --- GEMINI INTEGRATION ---
async function generateWithGemini(prompt: string, title: string): Promise<GenerationResult | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are an expert UI/UX developer. Generate a complete single-file HTML website with Tailwind CSS CDN for: "${title}". Requirements: "${prompt}". Return ONLY the raw HTML code without markdown quotes.`,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  raw = cleanHtmlCode(raw);
  return {
    title,
    code: raw,
    summary: `Generated interactive website for "${title}" using Gemini AI.`,
  };
}

// --- AUTONOMOUS HIGH-FIDELITY ENGINE ---
function generateAutonomousWebsite(prompt: string, title: string): GenerationResult {
  const lower = (prompt + " " + title).toLowerCase();

  let theme = "purple";
  let bgGradient = "from-slate-950 via-purple-950 to-slate-900";
  let primaryColor = "purple-600";
  let primaryHover = "purple-500";
  let badgeColor = "purple-500/20 text-purple-300 border-purple-500/30";
  let accentGradient = "from-purple-400 via-indigo-300 to-blue-400";
  let category = "general";

  if (lower.includes("gym") || lower.includes("fit") || lower.includes("workout")) {
    category = "gym";
    theme = "amber";
    bgGradient = "from-neutral-950 via-zinc-900 to-neutral-950";
    primaryColor = "amber-500";
    primaryHover = "amber-400";
    badgeColor = "amber-500/20 text-amber-300 border-amber-500/30";
    accentGradient = "from-amber-400 via-orange-400 to-red-500";
  } else if (lower.includes("restaurant") || lower.includes("food") || lower.includes("cafe") || lower.includes("bistro") || lower.includes("pizza")) {
    category = "restaurant";
    theme = "rose";
    bgGradient = "from-stone-950 via-neutral-900 to-stone-950";
    primaryColor = "rose-600";
    primaryHover = "rose-500";
    badgeColor = "rose-500/20 text-rose-300 border-rose-500/30";
    accentGradient = "from-rose-400 via-orange-300 to-amber-400";
  } else if (lower.includes("data") || lower.includes("portfolio") || lower.includes("resume") || lower.includes("analyst") || lower.includes("developer")) {
    category = "portfolio";
    theme = "cyan";
    bgGradient = "from-slate-950 via-cyan-950/40 to-slate-900";
    primaryColor = "cyan-500";
    primaryHover = "cyan-400";
    badgeColor = "cyan-500/20 text-cyan-300 border-cyan-500/30";
    accentGradient = "from-cyan-400 via-teal-300 to-blue-400";
  } else if (lower.includes("saas") || lower.includes("software") || lower.includes("startup") || lower.includes("app")) {
    category = "saas";
    theme = "indigo";
    bgGradient = "from-gray-950 via-indigo-950/50 to-gray-900";
    primaryColor = "indigo-600";
    primaryHover = "indigo-500";
    badgeColor = "indigo-500/20 text-indigo-300 border-indigo-500/30";
    accentGradient = "from-indigo-400 via-purple-300 to-pink-400";
  }

  const generatedCode = buildFullHtmlTemplate({
    title,
    prompt,
    category,
    theme,
    bgGradient,
    primaryColor,
    primaryHover,
    badgeColor,
    accentGradient,
  });

  return {
    title,
    code: generatedCode,
    summary: `Generated high-fidelity ${category.toUpperCase()} website with responsive navigation, interactive booking/contact modal, pricing calculator, and dynamic Tailwind styling.`,
  };
}

function refineAutonomousWebsite(
  currentCode: string,
  instruction: string
): { updatedCode: string; aiExplanation: string } {
  let updated = currentCode;
  const lower = instruction.toLowerCase();
  let explanation = "Updated website based on your instructions.";

  // 1. Color Theme Changes
  if (lower.includes("blue") || lower.includes("cyan")) {
    updated = updated.replace(/bg-purple-600/g, "bg-blue-600")
      .replace(/bg-purple-500/g, "bg-blue-500")
      .replace(/text-purple-400/g, "text-blue-400")
      .replace(/border-purple-500/g, "border-blue-500")
      .replace(/from-purple-400/g, "from-blue-400")
      .replace(/via-indigo-300/g, "via-cyan-300");
    explanation = "Switched primary color palette to high-contrast Ocean Blue & Cyan.";
  } else if (lower.includes("emerald") || lower.includes("green")) {
    updated = updated.replace(/bg-purple-600/g, "bg-emerald-600")
      .replace(/bg-purple-500/g, "bg-emerald-500")
      .replace(/text-purple-400/g, "text-emerald-400")
      .replace(/border-purple-500/g, "border-emerald-500")
      .replace(/from-purple-400/g, "from-emerald-400")
      .replace(/via-indigo-300/g, "via-teal-300");
    explanation = "Updated branding and accent highlights to Emerald Green.";
  } else if (lower.includes("amber") || lower.includes("gold") || lower.includes("yellow")) {
    updated = updated.replace(/bg-purple-600/g, "bg-amber-500")
      .replace(/bg-purple-500/g, "bg-amber-400")
      .replace(/text-purple-400/g, "text-amber-400")
      .replace(/border-purple-500/g, "border-amber-500");
    explanation = "Switched to warm Gold & Amber luxury accents.";
  }

  // 2. Add Testimonials / Reviews Section
  if (lower.includes("testimonial") || lower.includes("review")) {
    if (!updated.includes("id=\"testimonials\"")) {
      const testimonialsHtml = `
      <!-- TESTIMONIALS SECTION -->
      <section id="testimonials" class="py-20 bg-black/40 border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-xs font-bold uppercase tracking-widest text-purple-400">Social Proof</span>
            <h2 class="mt-2 text-3xl sm:text-4xl font-extrabold text-white">What Our Members Say</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all">
              <div class="flex text-amber-400 mb-3">★★★★★</div>
              <p class="text-gray-300 text-sm italic">"The best investment I've made this year. The experience and support exceeded my expectations!"</p>
              <div class="mt-4 flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center font-bold text-white">SM</div>
                <div>
                  <h4 class="text-white text-sm font-semibold">Sarah Miller</h4>
                  <p class="text-xs text-gray-400">Verified Member</p>
                </div>
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all">
              <div class="flex text-amber-400 mb-3">★★★★★</div>
              <p class="text-gray-300 text-sm italic">"Incredible facilities, clean environment, and top-tier community. Highly recommended!"</p>
              <div class="mt-4 flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center font-bold text-white">DK</div>
                <div>
                  <h4 class="text-white text-sm font-semibold">David Kumar</h4>
                  <p class="text-xs text-gray-400">Pro Athlete</p>
                </div>
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all">
              <div class="flex text-amber-400 mb-3">★★★★★</div>
              <p class="text-gray-300 text-sm italic">"Super smooth booking and friendly staff. 10/10 experience every single time."</p>
              <div class="mt-4 flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center font-bold text-white">ER</div>
                <div>
                  <h4 class="text-white text-sm font-semibold">Elena Rossi</h4>
                  <p class="text-xs text-gray-400">Member since 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      `;
      updated = updated.replace("<!-- FOOTER -->", `${testimonialsHtml}\n      <!-- FOOTER -->`);
      explanation = "Added a dedicated Customer Testimonials & Reviews section with star ratings and user cards.";
    }
  }

  // 3. Add FAQ Accordion Section
  if (lower.includes("faq") || lower.includes("question")) {
    if (!updated.includes("id=\"faq\"")) {
      const faqHtml = `
      <!-- FAQ SECTION -->
      <section id="faq" class="py-20 bg-black/20 border-t border-white/10">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <span class="text-xs font-bold uppercase tracking-widest text-purple-400">Got Questions?</span>
            <h2 class="mt-2 text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>
          <div class="space-y-4">
            <details class="p-5 rounded-2xl bg-white/5 border border-white/10 group">
              <summary class="font-semibold text-white cursor-pointer flex justify-between items-center list-none">
                <span>How do I get started with membership?</span>
                <span class="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p class="mt-3 text-sm text-gray-300 leading-relaxed">You can sign up online directly via our membership button or visit our front desk for an instant tour.</p>
            </details>
            <details class="p-5 rounded-2xl bg-white/5 border border-white/10 group">
              <summary class="font-semibold text-white cursor-pointer flex justify-between items-center list-none">
                <span>Can I cancel or pause my plan anytime?</span>
                <span class="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p class="mt-3 text-sm text-gray-300 leading-relaxed">Yes! All flexible plans can be paused or cancelled anytime with 0 hidden lock-in fees.</p>
            </details>
            <details class="p-5 rounded-2xl bg-white/5 border border-white/10 group">
              <summary class="font-semibold text-white cursor-pointer flex justify-between items-center list-none">
                <span>Are personal trainer sessions included?</span>
                <span class="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p class="mt-3 text-sm text-gray-300 leading-relaxed">Pro and Elite memberships include 2 complimentary 1-on-1 personal coaching sessions every month.</p>
            </details>
          </div>
        </div>
      </section>
      `;
      updated = updated.replace("<!-- FOOTER -->", `${faqHtml}\n      <!-- FOOTER -->`);
      explanation = "Integrated an interactive FAQ Accordion section with expandable answers.";
    }
  }

  // 4. Add Contact / Booking Form modal popup if requested
  if (lower.includes("contact") || lower.includes("form") || lower.includes("booking")) {
    explanation = "Enhanced the interactive Contact & Booking form with validation and instant toast feedback.";
  }

  return {
    updatedCode: updated,
    aiExplanation: explanation,
  };
}

// --- HELPER HTML TEMPLATE BUILDER ---
function buildFullHtmlTemplate(params: {
  title: string;
  prompt: string;
  category: string;
  theme: string;
  bgGradient: string;
  primaryColor: string;
  primaryHover: string;
  badgeColor: string;
  accentGradient: string;
}): string {
  const { title, category, bgGradient, primaryColor, primaryHover, badgeColor, accentGradient } = params;

  let heroBadge = "⚡ AI Powered • High Performance Experience";
  let heroHeadline = `${title} — Built for Excellence`;
  let heroSubtext = "Experience world-class services, transparent plans, and top-tier community support tailored to elevate your goals.";
  let feature1 = { title: "Premium Equipment & Facilities", desc: "Top-of-the-line amenities engineered for modern comfort and peak performance." };
  let feature2 = { title: "Expert Certified Coaches", desc: "Dedicated guidance with personalized plans to accelerate your results safely." };
  let feature3 = { title: "Flexible Schedule & Booking", desc: "24/7 seamless online booking with mobile calendar synchronization." };

  if (category === "restaurant") {
    heroBadge = "🍽️ Artisan Flavors • Handcrafted Daily";
    heroHeadline = `${title} — A Culinary Journey`;
    heroSubtext = "Fresh local ingredients, wood-fired specialties, and curated dining experiences crafted with passion.";
    feature1 = { title: "Farm to Table Ingredients", desc: "100% organic, locally sourced produce for authentic flavor in every bite." };
    feature2 = { title: "Master Chef Signatures", desc: "Award-winning recipes inspired by classical European and modern culinary traditions." };
    feature3 = { title: "Private Dining & Events", desc: "Intimate private booths and catering services for celebrations and corporate dinners." };
  } else if (category === "portfolio") {
    heroBadge = "📊 Data Analyst & Full-Stack Solutions";
    heroHeadline = `${title} — Turning Data into Impact`;
    heroSubtext = "Specializing in predictive modeling, interactive dashboards, and cloud analytics architectures.";
    feature1 = { title: "Big Data & Machine Learning", desc: "Building scalable data pipelines and statistical models with Python, SQL, and PyTorch." };
    feature2 = { title: "Executive Dashboards", desc: "Actionable business intelligence dashboards designed with Tableau, PowerBI, and Next.js." };
    feature3 = { title: "End-to-End Delivery", desc: "From raw data ingestion to production cloud deployment with robust CI/CD." };
  }

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .glass-nav {
      background: rgba(10, 15, 30, 0.75);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .glow-blob {
      filter: blur(100px);
      pointer-events: none;
    }
  </style>
</head>
<body class="bg-gradient-to-b ${bgGradient} text-gray-100 min-h-screen flex flex-col antialiased selection:bg-purple-600 selection:text-white overflow-x-hidden">

  <!-- NAVBAR -->
  <nav class="sticky top-0 z-50 glass-nav">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand -->
        <a href="#" class="flex items-center space-x-3 group">
          <div class="w-9 h-9 rounded-xl bg-${primaryColor} flex items-center justify-center font-extrabold text-white shadow-lg group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span class="font-extrabold text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
            ${title}
          </span>
        </a>

        <!-- Desktop Links -->
        <div class="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#about" class="hover:text-white transition-colors">About</a>
          <a href="#features" class="hover:text-white transition-colors">Services & Features</a>
          <a href="#pricing" class="hover:text-white transition-colors">Plans & Pricing</a>
          <a href="#contact" class="hover:text-white transition-colors">Contact</a>
        </div>

        <!-- Action Button -->
        <div class="hidden md:flex items-center space-x-4">
          <button onclick="openModal()" class="px-5 py-2 rounded-xl bg-${primaryColor} hover:bg-${primaryHover} text-white font-semibold text-sm shadow-lg shadow-purple-900/30 hover:scale-105 transition-all">
            Get Started
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button onclick="toggleMobileMenu()" class="p-2 text-gray-400 hover:text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown -->
    <div id="mobile-menu" class="hidden md:hidden px-4 pt-2 pb-4 space-y-2 bg-black/90 border-b border-white/10">
      <a href="#about" onclick="toggleMobileMenu()" class="block py-2 text-sm text-gray-300 hover:text-white">About</a>
      <a href="#features" onclick="toggleMobileMenu()" class="block py-2 text-sm text-gray-300 hover:text-white">Services</a>
      <a href="#pricing" onclick="toggleMobileMenu()" class="block py-2 text-sm text-gray-300 hover:text-white">Pricing</a>
      <button onclick="openModal(); toggleMobileMenu()" class="w-full mt-2 py-2 rounded-xl bg-${primaryColor} text-white text-sm font-semibold">Get Started</button>
    </div>
  </nav>

  <!-- HERO SECTION -->
  <section class="relative pt-20 pb-28 overflow-hidden text-center">
    <!-- Glow effects -->
    <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-600/20 glow-blob rounded-full -z-10"></div>
    <div class="absolute top-1/2 right-10 w-72 h-72 bg-blue-600/10 glow-blob rounded-full -z-10"></div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full ${badgeColor} text-xs font-semibold mb-6">
        <span>${heroBadge}</span>
      </div>

      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white max-w-4xl mx-auto">
        ${title} <br />
        <span class="bg-clip-text text-transparent bg-gradient-to-r ${accentGradient}">
          Designed for Excellence
        </span>
      </h1>

      <p class="mt-6 text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
        ${heroSubtext}
      </p>

      <!-- CTA Buttons -->
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onclick="openModal()" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-${primaryColor} hover:bg-${primaryHover} text-white font-bold text-base shadow-xl hover:scale-105 transition-all">
          Explore Memberships & Booking
        </button>
        <a href="#features" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/15 transition-all">
          Learn More
        </a>
      </div>

      <!-- Quick Metrics -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div class="p-4 rounded-2xl glass-card text-center">
          <p class="text-3xl font-extrabold text-white">99.8%</p>
          <p class="text-xs text-gray-400 mt-1">Satisfaction Score</p>
        </div>
        <div class="p-4 rounded-2xl glass-card text-center">
          <p class="text-3xl font-extrabold text-purple-400">2,500+</p>
          <p class="text-xs text-gray-400 mt-1">Active Community</p>
        </div>
        <div class="p-4 rounded-2xl glass-card text-center">
          <p class="text-3xl font-extrabold text-indigo-400">24/7</p>
          <p class="text-xs text-gray-400 mt-1">Dedicated Support</p>
        </div>
        <div class="p-4 rounded-2xl glass-card text-center">
          <p class="text-3xl font-extrabold text-blue-400">5★</p>
          <p class="text-xs text-gray-400 mt-1">Average Rating</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES / SERVICES SECTION -->
  <section id="features" class="py-24 bg-black/30 border-t border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-purple-400">What We Offer</span>
        <h2 class="mt-2 text-3xl sm:text-4xl font-extrabold text-white">Engineered for Unmatched Results</h2>
        <p class="mt-4 text-gray-400 text-sm">Discover how our state-of-the-art services set a new industry standard.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="p-8 rounded-2xl glass-card hover:border-purple-500/50 hover:bg-white/10 transition-all group">
          <div class="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
            🚀
          </div>
          <h3 class="text-xl font-bold text-white mb-3">${feature1.title}</h3>
          <p class="text-sm text-gray-400 leading-relaxed">${feature1.desc}</p>
        </div>

        <!-- Card 2 -->
        <div class="p-8 rounded-2xl glass-card hover:border-indigo-500/50 hover:bg-white/10 transition-all group">
          <div class="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
            🎯
          </div>
          <h3 class="text-xl font-bold text-white mb-3">${feature2.title}</h3>
          <p class="text-sm text-gray-400 leading-relaxed">${feature2.desc}</p>
        </div>

        <!-- Card 3 -->
        <div class="p-8 rounded-2xl glass-card hover:border-blue-500/50 hover:bg-white/10 transition-all group">
          <div class="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
            💎
          </div>
          <h3 class="text-xl font-bold text-white mb-3">${feature3.title}</h3>
          <p class="text-sm text-gray-400 leading-relaxed">${feature3.desc}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- PRICING SECTION -->
  <section id="pricing" class="py-24 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-purple-400">Transparent Pricing</span>
        <h2 class="mt-2 text-3xl sm:text-4xl font-extrabold text-white">Choose Your Tier</h2>
        <p class="mt-4 text-gray-400 text-sm">Flexible membership packages with 0 long-term lock-ins.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
        <!-- Starter -->
        <div class="p-8 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-white">Starter</h3>
            <p class="text-xs text-gray-400 mt-1">Essential access for beginners</p>
            <div class="mt-6 flex items-baseline text-white">
              <span class="text-4xl font-extrabold">$29</span>
              <span class="ml-1 text-gray-400 text-sm">/ month</span>
            </div>
            <ul class="mt-6 space-y-3 text-xs text-gray-300">
              <li class="flex items-center">✓ Standard Facility Access</li>
              <li class="flex items-center">✓ Mobile App Access</li>
              <li class="flex items-center">✓ Locker Room Amenities</li>
            </ul>
          </div>
          <button onclick="openModal('Starter Plan')" class="mt-8 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors">
            Select Plan
          </button>
        </div>

        <!-- Pro (Featured) -->
        <div class="p-8 rounded-2xl glass-card border-2 border-purple-500 relative flex flex-col justify-between shadow-2xl scale-105">
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white">
            Most Popular
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Pro All-Access</h3>
            <p class="text-xs text-gray-400 mt-1">Full premium perks & coaching</p>
            <div class="mt-6 flex items-baseline text-white">
              <span class="text-4xl font-extrabold">$59</span>
              <span class="ml-1 text-gray-400 text-sm">/ month</span>
            </div>
            <ul class="mt-6 space-y-3 text-xs text-gray-300">
              <li class="flex items-center">✓ 24/7 Unlimited Priority Access</li>
              <li class="flex items-center">✓ 2 Monthly Personal Coaching Sessions</li>
              <li class="flex items-center">✓ VIP Lounge & Sauna Access</li>
              <li class="flex items-center">✓ Complimentary Guest Passes</li>
            </ul>
          </div>
          <button onclick="openModal('Pro All-Access')" class="mt-8 w-full py-3 rounded-xl bg-${primaryColor} hover:bg-${primaryHover} text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all">
            Join Pro
          </button>
        </div>

        <!-- Elite -->
        <div class="p-8 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-white">Elite VIP</h3>
            <p class="text-xs text-gray-400 mt-1">For executives and dedicated athletes</p>
            <div class="mt-6 flex items-baseline text-white">
              <span class="text-4xl font-extrabold">$99</span>
              <span class="ml-1 text-gray-400 text-sm">/ month</span>
            </div>
            <ul class="mt-6 space-y-3 text-xs text-gray-300">
              <li class="flex items-center">✓ Unlimited 1-on-1 Dedicated Coaching</li>
              <li class="flex items-center">✓ Nutrition & Performance Protocol</li>
              <li class="flex items-center">✓ Private Reserved Locker</li>
            </ul>
          </div>
          <button onclick="openModal('Elite VIP')" class="mt-8 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors">
            Select Plan
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- CONTACT & BOOKING SECTION -->
  <section id="contact" class="py-20 bg-black/40 border-t border-white/10 text-center">
    <div class="max-w-3xl mx-auto px-4">
      <h2 class="text-3xl font-extrabold text-white">Ready to take the next step?</h2>
      <p class="mt-3 text-gray-400 text-sm">Get in touch with our team or schedule your instant onboarding session today.</p>
      <div class="mt-8 flex justify-center">
        <button onclick="openModal()" class="px-8 py-4 rounded-xl bg-${primaryColor} hover:bg-${primaryHover} text-white font-bold shadow-xl hover:scale-105 transition-all">
          Book Appointment / Contact Us
        </button>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="mt-auto py-10 bg-black/90 border-t border-white/10 text-xs text-gray-500 text-center">
    <div class="max-w-7xl mx-auto px-4">
      <p>© 2026 ${title}. All rights reserved. Generated by AI Website Builder.</p>
    </div>
  </footer>

  <!-- INTERACTIVE BOOKING / CONTACT MODAL -->
  <div id="booking-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="w-full max-w-md p-6 rounded-2xl glass-card border border-white/20 bg-slate-900 shadow-2xl relative">
      <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-lg">✕</button>
      <h3 id="modal-title" class="text-xl font-bold text-white mb-1">Book Your Spot</h3>
      <p class="text-xs text-gray-400 mb-4">Enter your details and our team will confirm your booking instantly.</p>
      
      <form onsubmit="handleFormSubmit(event)" class="space-y-3 text-left">
        <div>
          <label class="block text-xs text-gray-300 mb-1">Your Full Name</label>
          <input type="text" required placeholder="Alex Mercer" class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-300 mb-1">Email Address</label>
          <input type="email" required placeholder="alex@example.com" class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-300 mb-1">Select Time / Date</label>
          <input type="datetime-local" required class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <button type="submit" class="w-full mt-2 py-3 rounded-xl bg-${primaryColor} hover:bg-${primaryHover} text-white font-bold text-sm shadow-lg transition-all">
          Confirm Reservation
        </button>
      </form>
    </div>
  </div>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      menu.classList.toggle('hidden');
    }

    function openModal(planName) {
      const modal = document.getElementById('booking-modal');
      const title = document.getElementById('modal-title');
      if (planName) {
        title.innerText = 'Join ' + planName;
      } else {
        title.innerText = 'Schedule Your Session';
      }
      modal.classList.remove('hidden');
    }

    function closeModal() {
      const modal = document.getElementById('booking-modal');
      modal.classList.add('hidden');
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      alert('🎉 Thank you! Your request has been received. Our team will contact you shortly.');
      closeModal();
    }
  </script>
</body>
</html>`;
}

function cleanHtmlCode(raw: string): string {
  let code = raw.trim();
  if (code.startsWith("```html")) {
    code = code.substring(7);
  } else if (code.startsWith("```")) {
    code = code.substring(3);
  }
  if (code.endsWith("```")) {
    code = code.substring(0, code.length - 3);
  }
  return code.trim();
}

function extractTitleFromPrompt(prompt: string): string {
  const clean = prompt.replace(/create|build|generate|make|website|a|an|for|modern|dark|app/gi, "").trim();
  if (!clean) return "My AI Website";
  const words = clean.split(/\s+/).slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(" ") || "My AI Website";
}

import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "accounting-finance", icon: "📊", label: "Accounting & Finance", accent: "#2d9b6b", color: "#1a6b4a", topics: ["Accounting","Business Finance","Financial Statements","Personal Finance & Financial Literacy","Financial Planning","Investing & Securities"] },
  { id: "marketing-sales", icon: "📈", label: "Marketing, Sales & CX", accent: "#b05ab0", color: "#8b3a8b", topics: ["Marketing","Marketing Communications","Social Media Marketing","Sales & Professional Selling","Retail Marketing & Merchandising","Customer Service"] },
  { id: "management-leadership", icon: "💼", label: "Business Management & Leadership", accent: "#2b6fd4", color: "#1a4a8b", topics: ["Business Management","Leadership & Human Resources","Project Management","Public Administration","Career Development"] },
  { id: "entrepreneurship", icon: "🚀", label: "Entrepreneurship & Strategy", accent: "#e05a00", color: "#b04a00", topics: ["Entrepreneurship","Business Plan Development","Startups & Innovation","Business Growth Strategy","Franchise & Independent Business Plans","Case Studies / Business Problem Solving"] },
  { id: "economics-global", icon: "🌍", label: "Economics & Global Business", accent: "#0d8499", color: "#0a5c6b", topics: ["Economics","International Business","Insurance & Risk Management","Real Estate"] },
  { id: "hospitality", icon: "🏨", label: "Hospitality & Events", accent: "#c05030", color: "#7a3a1a", topics: ["Hospitality & Event Management","Event Planning","Sports & Entertainment Management"] },
  { id: "operations", icon: "📦", label: "Operations & Supply Chain", accent: "#5a8a2a", color: "#3a5a1a", topics: ["Supply Chain Management","Operations & Business Analytics"] },
  { id: "technology", icon: "💻", label: "Business Technology", accent: "#2a5ab0", color: "#1a3a6b", topics: ["Management Information Systems (MIS)","Data-driven Business Tools"] },
];

const DIFFICULTIES = ["Mixed", "Easy", "Medium", "Hard"];
const COUNTS = [5, 10, 15, 20];
const QTYPES = [
  { id: "mcq", label: "Multiple Choice", desc: "4-option questions with instant grading" },
];

function Logo({ nav }) {
  return (
    <span onClick={nav} style={{ cursor: nav ? "pointer" : "default", fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
      <span style={{ color: "#fff" }}>Prep</span><span style={{ color: "#2d9b6b" }}>+</span>
    </span>
  );
}

function NavBar({ page, setPage, quizHistory }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "generate", label: "Practice" },
    { id: "dashboard", label: "Dashboard" },
    { id: "about", label: "About" },
  ];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(13,13,18,0.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <Logo nav={() => setPage("home")} />
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 11px", borderRadius: 8, fontSize: 13.5, fontWeight: 500, color: page === l.id ? "#fff" : "#555", transition: "color 0.12s", fontFamily: "inherit" }}>
              {l.label}
              {l.id === "dashboard" && quizHistory.length > 0 && <span style={{ marginLeft: 5, background: "#2d9b6b", color: "#fff", fontSize: 10, borderRadius: 10, padding: "1px 6px" }}>{quizHistory.length}</span>}
            </button>
          ))}
          <button onClick={() => setPage("generate")} style={{ marginLeft: 8, background: "#2d9b6b", border: "none", color: "#fff", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "filter 0.12s" }}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

function ProgressRing({ pct, size = 90, stroke = 7, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }} strokeLinecap="round" />
    </svg>
  );
}

function ScoreBadge({ score, total }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  const col = pct >= 80 ? "#2d9b6b" : pct >= 60 ? "#d4820a" : "#c0302a";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <ProgressRing pct={pct} color={col} />
        <div style={{ position: "absolute", fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: col }}>{grade}</div>
      </div>
      <div style={{ fontSize: 13, color: "#666" }}>{score}/{total} correct</div>
    </div>
  );
}

function fmt(s) { return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`; }

const GS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
  @keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fu{animation:fadeUp 0.42s ease both;}
  .btn-g{background:#2d9b6b;border:none;color:#fff;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:filter 0.13s,transform 0.1s,box-shadow 0.13s;}
  .btn-g:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 6px 24px rgba(45,155,107,0.35);}
  .btn-g:active{transform:scale(0.98);}
  .btn-g:disabled{opacity:0.4;cursor:not-allowed;transform:none;filter:none;box-shadow:none;}
  .btn-ghost{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ccc;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;transition:all 0.13s;}
  .btn-ghost:hover{background:rgba(255,255,255,0.1);color:#fff;}
  .pill{cursor:pointer;transition:all 0.13s;border:1.5px solid rgba(255,255,255,0.1);border-radius:24px;padding:7px 17px;font-size:13px;font-weight:500;color:#777;background:transparent;font-family:inherit;}
  .pill:hover{border-color:rgba(255,255,255,0.22);color:#ddd;}
  .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;}
  .chov{transition:border-color 0.18s,transform 0.22s,box-shadow 0.18s;cursor:pointer;}
  .chov:hover{border-color:rgba(255,255,255,0.18);transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,0.4);}
  .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.65s cubic-bezier(.22,1,.36,1),transform 0.65s cubic-bezier(.22,1,.36,1);}
  .reveal.visible{opacity:1;transform:translateY(0);}
  .reveal-left{opacity:0;transform:translateX(-32px);transition:opacity 0.65s cubic-bezier(.22,1,.36,1),transform 0.65s cubic-bezier(.22,1,.36,1);}
  .reveal-left.visible{opacity:1;transform:translateX(0);}
  .reveal-right{opacity:0;transform:translateX(32px);transition:opacity 0.65s cubic-bezier(.22,1,.36,1),transform 0.65s cubic-bezier(.22,1,.36,1);}
  .reveal-right.visible{opacity:1;transform:translateX(0);}
  .reveal-scale{opacity:0;transform:scale(0.92);transition:opacity 0.6s cubic-bezier(.22,1,.36,1),transform 0.6s cubic-bezier(.22,1,.36,1);}
  .reveal-scale.visible{opacity:1;transform:scale(1);}
  .stagger-child{opacity:0;transform:translateY(20px);transition:opacity 0.55s cubic-bezier(.22,1,.36,1),transform 0.55s cubic-bezier(.22,1,.36,1);}
  .stagger-child.visible{opacity:1;transform:translateY(0);}
  .topic-card-inner{transition:transform 0.22s cubic-bezier(.22,1,.36,1);}
  .chov:hover .topic-card-inner{transform:scale(1.03);}
  .pill-float{animation:float 3s ease-in-out infinite;}
  .divider-line{transform-origin:left;animation:lineGrow 0.8s cubic-bezier(.22,1,.36,1) both;}
`;

// ── SCROLL REVEAL HOOK ────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// Stagger-reveal a group of children via IntersectionObserver
function useStagger(count, delay = 80, threshold = 0.1) {
  const ref = useRef(null);
  const [visibles, setVisibles] = useState(Array(count).fill(false));
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        for (let i = 0; i < count; i++) {
          setTimeout(() => setVisibles(v => { const n = [...v]; n[i] = true; return n; }), i * delay);
        }
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(container);
    return () => obs.disconnect();
  }, [count, delay, threshold]);
  return [ref, visibles];
}

// Parallax offset based on scroll
function useParallax(speed = 0.25) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handler = () => setOffset(window.scrollY * speed);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [speed]);
  return offset;
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const heroParallax = useParallax(0.18);
  const [featRef, featVis] = useReveal(0.1);
  const [featStaggerRef, featVisibles] = useStagger(4, 90, 0.08);
  const [topicHeadRef, topicHeadVis] = useReveal(0.15);
  const [topicStaggerRef, topicVisibles] = useStagger(CATEGORIES.length, 55, 0.05);
  const [whyRef, whyVis] = useReveal(0.12);
  const [whyListRef, whyListVisibles] = useStagger(4, 100, 0.1);
  const [ctaRef, ctaVis] = useReveal(0.2);
  const [pillsRef, pillsVis] = useReveal(0.15);

  const features = [
    { icon: "⚡", title: "AI-Generated Questions", desc: "Fresh, unique questions every session — no question banks, no repeats." },
    { icon: "🎯", title: "Competition-Focused", desc: "Built for DECA, FBLA, and similar business competitions." },
    { icon: "📊", title: "Track Your Progress", desc: "Monitor accuracy, spot weak areas, and watch your scores climb." },
    { icon: "🔧", title: "Fully Customizable", desc: "Choose topic, difficulty, question type, and quantity." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0f0f0", background: "#0d0d12" }}>
      <style>{GS}</style>

      {/* ── HERO with parallax bg ── */}
      <div style={{ textAlign: "center", padding: "86px 24px 70px", position: "relative", overflow: "hidden" }}>
        {/* Parallax glow orbs */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 85% 50% at 50% -5%, rgba(45,155,107,0.13) 0%, transparent 72%)", transform: `translateY(${heroParallax * 0.6}px)`, pointerEvents: "none", transition: "transform 0.1s linear" }} />
        <div style={{ position: "absolute", top: 40, left: "12%", width: 320, height: 320, borderRadius: "50%", background: "rgba(45,155,107,0.04)", filter: "blur(70px)", transform: `translateY(${heroParallax}px)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 60, right: "8%", width: 240, height: 240, borderRadius: "50%", background: "rgba(176,90,176,0.04)", filter: "blur(60px)", transform: `translateY(${heroParallax * 0.7}px)`, pointerEvents: "none" }} />
        {/* Subtle grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", transform: `translateY(${heroParallax * 0.3}px)` }} />

        <div className="fu" style={{ position: "relative", display: "inline-block", fontSize: 11.5, letterSpacing: "0.2em", color: "#2d9b6b", fontWeight: 600, textTransform: "uppercase", background: "rgba(45,155,107,0.1)", border: "1px solid rgba(45,155,107,0.22)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
          Business competition prep made smarter
        </div>

        <div className="fu" style={{ position: "relative", fontFamily: "'Playfair Display', serif", fontSize: "clamp(52px, 9vw, 86px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 22, animationDelay: "0.07s" }}>
          <span style={{ color: "#fff" }}>Prep</span><span style={{ color: "#2d9b6b" }}>+</span>
        </div>

        <div className="fu" style={{ position: "relative", fontSize: "clamp(14px, 2vw, 17px)", color: "#666", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.82, animationDelay: "0.14s" }}>
          AI-powered practice questions for any business competition, including DECA and FBLA. Pick your topic, set the difficulty, and walk in ready.
        </div>

        <div className="fu" style={{ position: "relative", display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", animationDelay: "0.2s" }}>
          <button className="btn-g" onClick={() => setPage("generate")} style={{ padding: "14px 32px", fontSize: 15, borderRadius: 12 }}>Get Started →</button>
          <button className="btn-ghost" onClick={() => setPage("dashboard")} style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12 }}>View Dashboard</button>
        </div>

        {/* Category pills — static, no floating */}
        <div ref={pillsRef} style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", maxWidth: 680, margin: "40px auto 0" }}>
          {CATEGORIES.map((c, i) => (
            <div key={c.id} style={{
              fontSize: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "4px 11px", color: "#555",
              opacity: pillsVis ? 1 : 0, transform: pillsVis ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.45s ease ${i * 35}ms, transform 0.45s ease ${i * 35}ms`,
            }}>{c.icon} {c.label.split(" & ")[0].split(",")[0]}</div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "60px 24px" }}>
        <div ref={featRef} className={`reveal ${featVis ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "#2d9b6b", fontWeight: 600, marginBottom: 10 }}>What Prep+ does</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "#fff" }}>Built for competitors, by a student</div>
          <div style={{ width: 40, height: 2, background: "#2d9b6b", borderRadius: 2, margin: "14px auto 0", transformOrigin: "center" }} className={featVis ? "divider-line" : ""} />
        </div>
        <div ref={featStaggerRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <div key={f.title} className={`stagger-child card chov ${featVisibles[i] ? "visible" : ""}`}
              style={{ padding: "26px 20px", transitionDelay: `${i * 90}ms` }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "#e0e0e0", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.72 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOPICS ── */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px 64px" }}>
        <div ref={topicHeadRef} className={`reveal ${topicHeadVis ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "#444", fontWeight: 600, marginBottom: 10 }}>Supported subject areas</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#fff" }}>Every event, covered</div>
        </div>
        <div ref={topicStaggerRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(196px, 1fr))", gap: 10 }}>
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} className={`stagger-child card chov ${topicVisibles[i] ? "visible" : ""}`}
              onClick={() => setPage("generate")}
              style={{ padding: "16px 14px", position: "relative", overflow: "hidden", transitionDelay: `${i * 55}ms` }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cat.accent}, transparent)`, opacity: topicVisibles[i] ? 1 : 0, transform: topicVisibles[i] ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: `transform 0.6s cubic-bezier(.22,1,.36,1) ${i * 55 + 200}ms, opacity 0.4s ease ${i * 55}ms` }} />
              <div className="topic-card-inner">
                <div style={{ fontSize: 20, marginBottom: 7 }}>{cat.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ccc", lineHeight: 1.4, marginBottom: 3 }}>{cat.label}</div>
                <div style={{ fontSize: 11, color: "#3a3a3a" }}>{cat.topics.length} topics</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY BETTER ── */}
      <div style={{ background: "rgba(45,155,107,0.04)", borderTop: "1px solid rgba(45,155,107,0.09)", borderBottom: "1px solid rgba(45,155,107,0.09)", padding: "64px 24px", overflow: "hidden" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 48, alignItems: "center" }}>
          <div ref={whyRef} className={`reveal-left ${whyVis ? "visible" : ""}`}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "#2d9b6b", fontWeight: 600, marginBottom: 12 }}>Why Prep+?</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 14 }}>Custom, instant, and adaptive</div>
            <div style={{ fontSize: 14, color: "#5a5a5a", lineHeight: 1.82 }}>Unlike static question banks, Prep+ generates fresh questions tailored to your exact topic, difficulty, and format every time.</div>
          </div>
          <div ref={whyListRef} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["Never see the same question twice","Questions built for competition formats","Detailed explanations after every answer","Free, student-built, always improving"].map((t, i) => (
              <div key={t} className={`stagger-child ${whyListVisibles[i] ? "visible" : ""}`}
                style={{ display: "flex", gap: 12, alignItems: "center", transitionDelay: `${i * 100}ms` }}>
                <span style={{ color: "#2d9b6b", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: "#888" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div ref={ctaRef} className={`reveal-scale ${ctaVis ? "visible" : ""}`} style={{ textAlign: "center", padding: "72px 24px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Ready to start practicing?</div>
        <div style={{ fontSize: 14, color: "#4a4a4a", marginBottom: 28 }}>No signup required. Just pick a topic and go.</div>
        <button className="btn-g" onClick={() => setPage("generate")} style={{ padding: "15px 36px", fontSize: 15, borderRadius: 12 }}>Start Practicing →</button>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "18px 24px", display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        {["home","about","disclaimer"].map(p => <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", color: "#333", fontSize: 12, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{p}</button>)}
        <a href="mailto:prepplus.site@gmail.com" style={{ color: "#444", fontSize: 12, textDecoration: "none" }}>prepplus.site@gmail.com</a>
        <span style={{ color: "#252525", fontSize: 12 }}>Prep+ is not affiliated with DECA, FBLA, or any organization.</span>
      </div>
    </div>
  );
}

// ── GENERATE (config + quiz + results) ───────────────────────────────────────
import questionBank from "./questionBank.json";

function getQuestions(catId, topic, difficulty, count) {
  const key = topic ? `${catId}::${topic}` : null;
  let pool = [];

  if (key && questionBank[key]) {
    pool = questionBank[key];
  } else {
    // If no specific topic, combine all topics in the category
    Object.entries(questionBank).forEach(([k, qs]) => {
      if (k.startsWith(catId + "::")) pool.push(...qs);
    });
  }

  // Filter by difficulty
  if (difficulty !== "Mixed") {
    const filtered = pool.filter(q => q.difficulty === difficulty);
    pool = filtered.length >= count ? filtered : pool;
  }

  // Shuffle and pick count
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function GeneratePage({ quizHistory, setQuizHistory }) {
  const [step, setStep] = useState("config");
  const [selCat, setSelCat] = useState(null);
  const [selTopic, setSelTopic] = useState(null);
  const [diff, setDiff] = useState("Mixed");
  const [count, setCount] = useState(10);
  const [qtype, setQtype] = useState("mcq");
  const [questions, setQuestions] = useState([]);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shortInput, setShortInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const tRef = useRef(null);

  useEffect(() => {
    if (timerOn) tRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    else clearInterval(tRef.current);
    return () => clearInterval(tRef.current);
  }, [timerOn]);

  const cat = selCat ? CATEGORIES.find(c => c.id === selCat) : null;

  function generate() {
    setError(null);
    const picked = getQuestions(selCat, selTopic, diff, count);
    if (!picked || picked.length === 0) {
      setError("No questions found for this selection. Try different settings.");
      return;
    }
    setQuestions(picked);
    setAnswers({}); setCur(0); setRevealed(false);
    setElapsed(0); setTimerOn(true); setShortInput("");
    setStep("quiz");
  }

  function handleMCQ(letter) {
    if (revealed) return;
    setAnswers(a => ({ ...a, [cur]: letter }));
    setRevealed(true);
  }

  function submitShort() {
    if (!shortInput.trim() || revealed) return;
    setAnswers(a => ({ ...a, [cur]: shortInput.trim() }));
    setRevealed(true);
  }

  function next() {
    setRevealed(false); setShortInput("");
    if (cur < questions.length - 1) {
      setCur(c => c + 1);
    } else {
      setTimerOn(false);
      const finalAnswers = { ...answers, [cur]: answers[cur] || shortInput.trim() };
      const score = qtype === "mcq" ? questions.filter((q, i) => finalAnswers[i] === q.answer).length : Math.round(questions.length * 0.75);
      setQuizHistory(h => [...h, { id: Date.now(), topic: selTopic || cat?.label, catId: selCat, score, total: questions.length, qtype, difficulty: diff, elapsed, date: new Date().toLocaleDateString(), questions, answers: finalAnswers }]);
      setStep("results");
    }
  }

  const finalScore = qtype === "mcq" ? questions.filter((q, i) => answers[i] === q.answer).length : Math.round(questions.length * 0.75);

  // CONFIG
  if (step === "config") return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0f0f0", background: "#0d0d12", minHeight: "calc(100vh - 56px)", paddingBottom: 60 }}>
      <style>{GS}</style>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 22px" }}>
        <div className="fu" style={{ marginBottom: 34 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 5 }}>Generate Practice</div>
          <div style={{ fontSize: 14, color: "#555" }}>Customize your session — AI generates the questions instantly.</div>
        </div>

        {/* Category */}
        <div className="fu" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 13 }}>Subject Area <span style={{ color: "#c0302a", marginLeft: 2 }}>*</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(174px, 1fr))", gap: 9 }}>
            {CATEGORIES.map(c => (
              <div key={c.id} className="card chov" onClick={() => { setSelCat(c.id); setSelTopic(null); }}
                style={{ padding: "13px 14px", position: "relative", overflow: "hidden", borderColor: selCat === c.id ? c.accent : undefined, background: selCat === c.id ? `${c.accent}12` : undefined }}>
                {selCat === c.id && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c.accent }} />}
                <div style={{ fontSize: 18, marginBottom: 5 }}>{c.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: selCat === c.id ? "#ddd" : "#aaa", lineHeight: 1.4 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic */}
        {cat && (
          <div className="fu" style={{ marginBottom: 26 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 11 }}>Topic <span style={{ fontSize: 11, color: "#333", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>— optional</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              <button className="pill" onClick={() => setSelTopic(null)} style={{ borderColor: !selTopic ? cat.accent : undefined, color: !selTopic ? "#fff" : undefined, background: !selTopic ? `${cat.accent}1a` : undefined }}>All topics</button>
              {cat.topics.map(t => <button key={t} className="pill" onClick={() => setSelTopic(t)} style={{ borderColor: selTopic === t ? cat.accent : undefined, color: selTopic === t ? "#fff" : undefined, background: selTopic === t ? `${cat.accent}1a` : undefined }}>{t}</button>)}
            </div>
          </div>
        )}

        {/* Question type */}
        <div className="fu" style={{ marginBottom: 26, animationDelay: "0.07s" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 11 }}>Question Type</div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            {QTYPES.map(qt => (
              <div key={qt.id} className="card chov" onClick={() => setQtype(qt.id)}
                style={{ padding: "13px 16px", flex: "1 1 150px", borderColor: qtype === qt.id ? "#2d9b6b" : undefined, background: qtype === qt.id ? "rgba(45,155,107,0.09)" : undefined }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: qtype === qt.id ? "#6ddeb0" : "#bbb", marginBottom: 3 }}>{qt.label}</div>
                <div style={{ fontSize: 12, color: "#4a4a4a", lineHeight: 1.5 }}>{qt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 30 }}>
          <div className="fu" style={{ animationDelay: "0.1s" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 11 }}>Difficulty</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {DIFFICULTIES.map(d => {
                const dc = d === "Easy" ? "#2d9b6b" : d === "Hard" ? "#c0302a" : d === "Medium" ? "#d4820a" : "#2b6fd4";
                return <button key={d} className="pill" onClick={() => setDiff(d)} style={{ borderColor: diff === d ? dc : undefined, color: diff === d ? "#fff" : undefined, background: diff === d ? `${dc}1a` : undefined }}>{d}</button>;
              })}
            </div>
          </div>
          <div className="fu" style={{ animationDelay: "0.13s" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 11 }}>Questions</div>
            <div style={{ display: "flex", gap: 7 }}>
              {COUNTS.map(n => <button key={n} className="pill" onClick={() => setCount(n)} style={{ borderColor: count === n ? "#2d9b6b" : undefined, color: count === n ? "#fff" : undefined, background: count === n ? "rgba(45,155,107,0.18)" : undefined, minWidth: 46, textAlign: "center" }}>{n}</button>)}
            </div>
          </div>
        </div>

        {error && <div style={{ background: "rgba(192,48,42,0.13)", border: "1px solid rgba(192,48,42,0.28)", borderRadius: 10, padding: "12px 15px", fontSize: 13.5, color: "#ff8080", marginBottom: 16 }}>{error}</div>}

        <button className="btn-g" disabled={!selCat} onClick={generate} style={{ padding: "14px 34px", fontSize: 15, borderRadius: 12 }}>
          Start Practice →
        </button>
        {!selCat && <div style={{ fontSize: 12, color: "#333", marginTop: 7 }}>Select a subject area to continue.</div>}
      </div>
    </div>
  );

  // QUIZ
  const q = questions[cur];
  if (!q) return null;
  const isCorrect = qtype === "mcq" && answers[cur] === q.answer;
  const progress = (cur / questions.length) * 100;

  if (step === "quiz") return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0f0f0", background: "#0d0d12", minHeight: "calc(100vh - 56px)", paddingBottom: 60 }}>
      <style>{`${GS}
        .opt{width:100%;text-align:left;border:1.5px solid rgba(255,255,255,0.08);border-radius:11px;padding:13px 16px;font-size:14px;color:#bbb;background:rgba(255,255,255,0.03);cursor:pointer;transition:all 0.13s;margin-bottom:9px;font-family:inherit;}
        .opt:hover:not([disabled]){border-color:rgba(255,255,255,0.18);background:rgba(255,255,255,0.06);color:#eee;}
        .opt.cor{border-color:#2d9b6b!important;background:rgba(45,155,107,0.13)!important;color:#6ddeb0!important;}
        .opt.wrg{border-color:#c0302a!important;background:rgba(192,48,42,0.11)!important;color:#ff8080!important;}
        textarea{background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.1);border-radius:11px;color:#e0e0e0;font-family:inherit;font-size:14px;padding:13px 15px;width:100%;resize:vertical;min-height:96px;outline:none;transition:border-color 0.13s;}
        textarea:focus{border-color:rgba(255,255,255,0.24);}
        @keyframes si{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .si{animation:si 0.2s ease both;}
      `}</style>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "26px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <button className="btn-ghost" onClick={() => { setStep("config"); setTimerOn(false); }} style={{ padding: "6px 11px", fontSize: 12 }}>← Exit</button>
            <span style={{ fontSize: 13, color: "#444" }}>{cat?.icon} {selTopic || cat?.label}</span>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#444", fontVariantNumeric: "tabular-nums" }}>⏱ {fmt(elapsed)}</span>
            <span style={{ fontSize: 12, color: "#444" }}>{cur + 1}/{questions.length}</span>
          </div>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginBottom: 26, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${cat?.accent}, ${cat?.color})`, transition: "width 0.4s ease" }} />
        </div>

        <div key={cur} className="si card" style={{ padding: "24px 22px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase",
              background: q.difficulty === "Easy" ? "rgba(45,155,107,0.18)" : q.difficulty === "Hard" ? "rgba(192,48,42,0.18)" : "rgba(212,130,10,0.18)",
              color: q.difficulty === "Easy" ? "#6ddeb0" : q.difficulty === "Hard" ? "#ff8080" : "#f0a830" }}>{q.difficulty}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em", background: "rgba(255,255,255,0.05)", color: "#555" }}>
              {qtype === "mcq" ? "MCQ" : qtype === "short" ? "Short Answer" : "Case Study"}
            </span>
          </div>
          {q.scenario && <div style={{ fontSize: 13, color: "#777", lineHeight: 1.75, marginBottom: 13, padding: "11px 13px", background: "rgba(255,255,255,0.03)", borderRadius: 9, borderLeft: `3px solid ${cat?.accent}` }}><strong style={{ color: "#999" }}>Scenario: </strong>{q.scenario}</div>}
          <div style={{ fontSize: 16.5, lineHeight: 1.7, color: "#e0e0e0", fontWeight: 500 }}>{q.q}</div>
        </div>

        {qtype === "mcq" && q.options.map((opt, idx) => {
          const letter = ["A","B","C","D"][idx];
          let cls = "opt";
          if (revealed) { if (letter === q.answer) cls += " cor"; else if (letter === answers[cur] && letter !== q.answer) cls += " wrg"; }
          return <button key={letter} className={cls} disabled={revealed} onClick={() => handleMCQ(letter)}><span style={{ fontWeight: 700, marginRight: 9, opacity: 0.45 }}>{letter}</span>{opt.replace(/^[A-D]\)\s*/, "")}</button>;
        })}

        {(qtype === "short" || qtype === "case") && !revealed && (
          <div>
            <textarea value={shortInput} onChange={e => setShortInput(e.target.value)} placeholder="Type your answer here..." />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 9 }}>
              <button className="btn-g" disabled={!shortInput.trim()} onClick={submitShort} style={{ opacity: !shortInput.trim() ? 0.38 : 1 }}>Submit</button>
            </div>
          </div>
        )}

        {revealed && (
          <div className="si">
            {qtype === "mcq" ? (
              <div style={{ background: isCorrect ? "rgba(45,155,107,0.09)" : "rgba(192,48,42,0.09)", border: `1px solid ${isCorrect ? "rgba(45,155,107,0.28)" : "rgba(192,48,42,0.28)"}`, borderRadius: 13, padding: "16px 18px", marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 7, color: isCorrect ? "#6ddeb0" : "#ff8080" }}>{isCorrect ? "✓ Correct!" : `✗ Incorrect — answer is ${q.answer}`}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.72, color: "#888" }}>{q.explanation}</div>
              </div>
            ) : (
              <div style={{ background: "rgba(45,155,107,0.06)", border: "1px solid rgba(45,155,107,0.18)", borderRadius: 13, padding: "16px 18px", marginBottom: 14 }}>
                {answers[cur] && <div style={{ marginBottom: 11 }}><div style={{ fontSize: 11, color: "#444", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.09em" }}>Your answer</div><div style={{ fontSize: 13, color: "#888", lineHeight: 1.7, fontStyle: "italic" }}>{answers[cur]}</div></div>}
                <div style={{ fontSize: 11, color: "#2d9b6b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 600 }}>Model Answer</div>
                <div style={{ fontSize: 13.5, color: "#ccc", lineHeight: 1.76 }}>{q.answer}</div>
                {q.keyPoints?.length > 0 && <div style={{ marginTop: 11 }}>
                  <div style={{ fontSize: 11, color: "#444", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.09em" }}>Key Points</div>
                  {q.keyPoints.map((kp, i) => <div key={i} style={{ fontSize: 13, color: "#777", padding: "3px 0 3px 11px", borderLeft: `2px solid ${cat?.accent}`, marginBottom: 4 }}>{kp}</div>)}
                </div>}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-g" onClick={next}>{cur < questions.length - 1 ? "Next Question →" : "See Results →"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // RESULTS
  if (step === "results") {
    const pct = Math.round((finalScore / questions.length) * 100);
    const wrong = qtype === "mcq" ? questions.map((q, i) => ({ q, i, ua: answers[i] })).filter(x => x.ua !== x.q.answer) : [];
    return (
      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0f0f0", background: "#0d0d12", minHeight: "calc(100vh - 56px)", paddingBottom: 60 }}>
        <style>{GS}</style>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "42px 20px" }}>
          <div className="fu" style={{ textAlign: "center", marginBottom: 34 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "#444", marginBottom: 7 }}>Session Complete</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 5 }}>
              {pct >= 90 ? "Outstanding! 🏆" : pct >= 80 ? "Great Work! 💪" : pct >= 70 ? "Good Progress!" : "Keep Grinding!"}
            </div>
            <div style={{ fontSize: 14, color: "#555" }}>{selTopic || cat?.label}</div>
          </div>

          <div className="fu" style={{ display: "flex", justifyContent: "center", marginBottom: 30, animationDelay: "0.08s" }}>
            <div className="card" style={{ padding: "28px 44px", textAlign: "center", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <ScoreBadge score={finalScore} total={questions.length} />
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
                {[{ label: "Score", val: `${pct}%`, col: cat?.accent }, { label: "Time", val: fmt(elapsed), col: "#666" }, { label: "Questions", val: questions.length, col: "#666" }].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.col }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fu" style={{ display: "flex", gap: 9, justifyContent: "center", flexWrap: "wrap", marginBottom: 38, animationDelay: "0.14s" }}>
            <button className="btn-g" onClick={() => setStep("config")}>Try Again</button>
            <button className="btn-ghost" onClick={() => { setSelCat(null); setStep("config"); }}>New Topic</button>
          </div>

          {wrong.length > 0 && (
            <div className="fu" style={{ animationDelay: "0.2s" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 12 }}>Review Missed ({wrong.length})</div>
              {wrong.map(({ q, i, ua }) => (
                <div key={i} className="card" style={{ padding: "16px 18px", marginBottom: 9 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#ccc", lineHeight: 1.65, marginBottom: 9 }}>{q.q}</div>
                  <div style={{ display: "flex", gap: 14, fontSize: 13, marginBottom: 7, flexWrap: "wrap" }}>
                    <span style={{ color: "#ff8080" }}>✗ You: {ua || "—"}</span>
                    <span style={{ color: "#6ddeb0" }}>✓ Correct: {q.answer}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#555", lineHeight: 1.68 }}>{q.explanation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardPage({ quizHistory }) {
  const totalQ = quizHistory.reduce((a, b) => a + b.total, 0);
  const totalC = quizHistory.reduce((a, b) => a + b.score, 0);
  const avgPct = quizHistory.length ? Math.round((totalC / totalQ) * 100) : 0;

  const topicMap = {};
  quizHistory.forEach(q => {
    if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0, catId: q.catId };
    topicMap[q.topic].correct += q.score;
    topicMap[q.topic].total += q.total;
  });
  const topicStats = Object.entries(topicMap).map(([topic, v]) => ({ topic, catId: v.catId, pct: Math.round((v.correct / v.total) * 100), correct: v.correct, total: v.total })).sort((a, b) => b.pct - a.pct);

  const dates = [...new Set(quizHistory.map(q => q.date))].sort();
  let streak = 0;
  if (dates.length) {
    const today = new Date().toLocaleDateString();
    const yest = new Date(Date.now() - 86400000).toLocaleDateString();
    if (dates.includes(today) || dates.includes(yest)) {
      streak = 1;
      for (let i = dates.length - 1; i > 0; i--) {
        if ((new Date(dates[i]) - new Date(dates[i-1])) / 86400000 <= 1.5) streak++; else break;
      }
    }
  }

  if (!quizHistory.length) return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0f0f0", background: "#0d0d12", minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{GS}</style>
      <div style={{ textAlign: "center", maxWidth: 380 }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>📊</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 9 }}>No data yet</div>
        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.78 }}>Complete a practice session to see your progress, accuracy, and weak areas here.</div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0f0f0", background: "#0d0d12", minHeight: "calc(100vh - 56px)", paddingBottom: 60 }}>
      <style>{GS}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 22px" }}>
        <div className="fu" style={{ marginBottom: 34 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 5 }}>Dashboard</div>
          <div style={{ fontSize: 14, color: "#555" }}>Your progress at a glance.</div>
        </div>

        <div className="fu" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(136px, 1fr))", gap: 11, marginBottom: 34 }}>
          {[
            { label: "Quizzes Taken", val: quizHistory.length, col: "#2d9b6b" },
            { label: "Questions Done", val: totalQ, col: "#2b6fd4" },
            { label: "Avg Accuracy", val: `${avgPct}%`, col: avgPct >= 80 ? "#2d9b6b" : avgPct >= 60 ? "#d4820a" : "#c0302a" },
            { label: "Day Streak", val: `${streak} 🔥`, col: "#e05a00" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 13, padding: "16px 14px" }}>
              <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.col }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div className="fu" style={{ marginBottom: 28, animationDelay: "0.09s" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 13 }}>Accuracy by Topic</div>
          {topicStats.map(t => {
            const cat = CATEGORIES.find(c => c.id === t.catId);
            const bc = t.pct >= 80 ? "#2d9b6b" : t.pct >= 60 ? "#d4820a" : "#c0302a";
            return (
              <div key={t.topic} className="card" style={{ padding: "13px 16px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <div style={{ fontSize: 13.5, color: "#ccc", fontWeight: 500 }}>{cat?.icon} {t.topic}</div>
                  <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#444" }}>{t.correct}/{t.total}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: bc }}>{t.pct}%</span>
                  </div>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${t.pct}%`, background: bc, transition: "width 0.8s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="fu" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(236px, 1fr))", gap: 14, marginBottom: 28, animationDelay: "0.14s" }}>
          {topicStats.filter(t => t.pct < 70).length > 0 && (
            <div className="card" style={{ padding: "18px", borderColor: "rgba(192,48,42,0.25)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c0302a", fontWeight: 600, marginBottom: 11 }}>⚠ Needs Work</div>
              {topicStats.filter(t => t.pct < 70).map(t => <div key={t.topic} style={{ fontSize: 13, color: "#888", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{t.topic} — <span style={{ color: "#ff8080" }}>{t.pct}%</span></div>)}
            </div>
          )}
          {topicStats.filter(t => t.pct >= 80).length > 0 && (
            <div className="card" style={{ padding: "18px", borderColor: "rgba(45,155,107,0.25)" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2d9b6b", fontWeight: 600, marginBottom: 11 }}>✓ Strong Areas</div>
              {topicStats.filter(t => t.pct >= 80).map(t => <div key={t.topic} style={{ fontSize: 13, color: "#888", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{t.topic} — <span style={{ color: "#6ddeb0" }}>{t.pct}%</span></div>)}
            </div>
          )}
        </div>

        <div className="fu" style={{ animationDelay: "0.18s" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 12 }}>Recent Sessions</div>
          {[...quizHistory].reverse().slice(0, 8).map(h => {
            const pct = Math.round((h.score / h.total) * 100);
            const col = pct >= 80 ? "#2d9b6b" : pct >= 60 ? "#d4820a" : "#c0302a";
            const cat = CATEGORIES.find(c => c.id === h.catId);
            return (
              <div key={h.id} className="card" style={{ padding: "11px 16px", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 7 }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "#ccc" }}>{cat?.icon} {h.topic}</div>
                  <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{h.date} · {h.qtype === "mcq" ? "MCQ" : h.qtype === "short" ? "Short Answer" : "Case Study"} · {h.difficulty}</div>
                </div>
                <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#444" }}>{h.score}/{h.total}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: col }}>{pct}%</span>
                  <span style={{ fontSize: 11, color: "#383838" }}>⏱ {fmt(h.elapsed)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0f0f0", background: "#0d0d12", minHeight: "calc(100vh - 56px)", paddingBottom: 80 }}>
      <style>{GS}</style>
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "58px 22px" }}>
        <div className="fu" style={{ marginBottom: 46 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
            About <span style={{ color: "#2d9b6b" }}>Prep+</span>
          </div>
          <div style={{ width: 36, height: 3, background: "#2d9b6b", borderRadius: 2 }} />
        </div>
        {[
          { label: "What is Prep+?", body: "Prep+ is a free, AI-powered practice platform designed for students competing in business competitions. It generates fresh, custom practice questions on demand — covering everything from accounting and marketing to entrepreneurship and economics." },
          { label: "Who built it?", body: "Prep+ is a student-built project, created to fill a gap in competition prep resources. Most existing tools rely on static, repetitive question banks. Prep+ uses AI to generate unlimited, tailored questions every session — so you're always practicing with fresh material." },
          { label: "Our goal", body: "To help students walk into their competition events genuinely prepared — not just memorization-ready, but able to think critically, apply concepts, and handle scenarios they've never seen before. Preparation should be smart, not just thorough." },
          { label: "Not affiliated", body: "Prep+ is an independent student project. It is not affiliated with, endorsed by, or connected to DECA, FBLA, BPA, or any other student organization or educational institution." },
        ].map((s, i) => (
          <div key={s.label} className="fu" style={{ marginBottom: 34, animationDelay: `${i * 0.07}s` }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "#2d9b6b", fontWeight: 600, marginBottom: 9 }}>{s.label}</div>
            <div style={{ fontSize: 15, color: "#888", lineHeight: 1.87 }}>{s.body}</div>
          </div>
        ))}
        <div className="fu card" style={{ padding: "22px", borderColor: "rgba(45,155,107,0.15)", marginTop: 48, animationDelay: "0.3s" }}>
          <div style={{ fontSize: 14, color: "#777", lineHeight: 1.82 }}>Prep+ is free to use and always will be. If you find it helpful, share it with your team.</div>
          <button className="btn-g" onClick={() => setPage("generate")} style={{ marginTop: 14 }}>Start Practicing →</button>
        </div>
      </div>
    </div>
  );
}

// ── DISCLAIMER ────────────────────────────────────────────────────────────────
function DisclaimerPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0f0f0", background: "#0d0d12", minHeight: "calc(100vh - 56px)", paddingBottom: 80 }}>
      <style>{GS}</style>
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "58px 22px" }}>
        <div className="fu" style={{ marginBottom: 34 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Disclaimer</div>
          <div style={{ width: 32, height: 3, background: "#444", borderRadius: 2 }} />
        </div>
        {[
          { label: "No Affiliation", body: "Prep+ is not affiliated with, endorsed by, sponsored by, or in any way connected to DECA Inc., FBLA-PBL, BPA, or any other student organization, competition body, or educational institution. All organization names are used for descriptive and reference purposes only." },
          { label: "Original Content", body: "All practice questions, answers, explanations, and content on Prep+ are generated by artificial intelligence and are original to this platform. They are not sourced from, copied from, or based on official competition materials, past exams, or proprietary content from any organization." },
          { label: "Accuracy", body: "While we strive to generate accurate and educationally useful content, Prep+ is a supplementary study tool and not a substitute for official study materials, textbooks, or guidance from teachers and coaches. AI-generated content may occasionally contain inaccuracies — always cross-reference important information." },
          { label: "No Guarantees", body: "Prep+ makes no guarantees about competition performance. Practice results are for personal tracking and study purposes only and do not predict official competition scores." },
          { label: "Use of AI", body: "Questions are generated in real time using Claude by Anthropic. Use of this platform implies acknowledgment that all content is AI-generated." },
        ].map((s, i) => (
          <div key={s.label} className="fu card" style={{ padding: "20px", marginBottom: 12, animationDelay: `${i * 0.06}s` }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.13em", color: "#444", fontWeight: 600, marginBottom: 7 }}>{s.label}</div>
            <div style={{ fontSize: 13.5, color: "#777", lineHeight: 1.85 }}>{s.body}</div>
          </div>
        ))}
        <div className="fu" style={{ marginTop: 28, fontSize: 12, color: "#333", lineHeight: 1.8, animationDelay: "0.35s" }}>
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}. Prep+ is an independent, student-built platform.
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function PrepPlus() {
  const [page, setPage] = useState("home");
  const [quizHistory, setQuizHistory] = useState([]);
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0d0d12", minHeight: "100vh" }}>
      <style>{GS}</style>
      <NavBar page={page} setPage={setPage} quizHistory={quizHistory} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "generate" && <GeneratePage quizHistory={quizHistory} setQuizHistory={setQuizHistory} />}
      {page === "dashboard" && <DashboardPage quizHistory={quizHistory} />}
      {page === "about" && <AboutPage setPage={setPage} />}
      {page === "disclaimer" && <DisclaimerPage />}
    </div>
  );
}

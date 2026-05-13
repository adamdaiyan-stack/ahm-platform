import Link from "next/link";

const STEPS = [
  { step: "01", title: "Contact Us on WhatsApp", desc: "Message our team and we'll guide you through every step of the account-opening process." },
  { step: "02", title: "Submit Your Documents",  desc: "CNIC, next of kin details, and a bank account number. We handle the paperwork digitally." },
  { step: "03", title: "Account Activated",       desc: "Your CDC sub-account and trading account are ready within 48 hours. Start investing in KSE-100 stocks." },
];

const FAQS = [
  { q: "How much do I need to start?",    a: "There is no minimum balance requirement to open an account. You can start with as little as PKR 5,000 for your first trade." },
  { q: "What documents are required?",    a: "Original CNIC (both sides), a passport-size photograph, your bank account details (IBAN), and next of kin information." },
  { q: "How long does account opening take?", a: "Typically 24–48 hours once all documents are received and verified." },
  { q: "Can I trade online?",             a: "Yes. Once your account is active, you get access to the online trading portal and mobile app for real-time order execution." },
  { q: "What are the brokerage charges?", a: "Our team will share the full fee schedule on WhatsApp. Standard PSX brokerage applies — no hidden charges." },
];

const WA_LINK = "https://wa.me/923001234567?text=Hi%2C%20I%27d%20like%20to%20open%20a%20PSX%20brokerage%20account";

const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.863L.057 23.886a.5.5 0 0 0 .609.61l6.101-1.526A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.511-5.188-1.402l-.373-.22-3.87.968.999-3.793-.242-.389A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

export default function OpenAccountPage() {
  return (
    <main className="flex-1 bg-base text-tx-primary">

      {/* ── HERO ────────────────────────────────────── */}
      <div className="border-b border-border-theme px-8 pt-14 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">AHM Platform · Brokerage Services</p>
          <h1 className="text-4xl md:text-5xl font-bold text-tx-primary mb-4 leading-tight">
            Start Investing in<br />
            <span className="text-gain">Pakistan Stocks</span>
          </h1>
          <p className="text-tx-secondary text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Open a PSX brokerage account in under 48 hours. Full CDC custody, online trading, and AHM research to guide your decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-mono font-bold px-6 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors uppercase tracking-widest">
              {WA_ICON} Open Account on WhatsApp
            </a>
            <Link href="/research"
              className="flex items-center justify-center text-sm font-mono px-6 py-3 rounded-xl border border-border-theme text-tx-secondary hover:border-tx-secondary hover:text-tx-primary transition-colors uppercase tracking-widest">
              View Research First
            </Link>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <div className="px-8 py-14 border-b border-border-theme">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-10 text-center">How It Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-surface border border-border-theme rounded-xl p-6">
                <p className="text-4xl font-bold text-tx-disabled font-mono mb-4">{s.step}</p>
                <h3 className="text-tx-primary font-bold text-base mb-2">{s.title}</h3>
                <p className="text-tx-secondary text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT YOU GET ────────────────────────────── */}
      <div className="px-8 py-14 border-b border-border-theme">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-8 text-center">What You Get</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "📊", title: "AHM Research Access",      desc: "Full access to our equity notes, sector reports, and earnings coverage — exclusively for account holders." },
              { icon: "📱", title: "Daily WhatsApp Briefing",  desc: "Pre-market summary with KSE-100 outlook, top picks, and macro context — every trading day at 9 AM." },
              { icon: "🏦", title: "CDC Custody",              desc: "Your shares are held directly in your own CDC investor account — fully segregated and secure." },
              { icon: "💻", title: "Online Trading Platform",  desc: "Execute orders in real-time via desktop or mobile. Limit orders, market orders, and portfolio tracking." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-surface border border-border-theme rounded-xl p-5">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-tx-primary font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-tx-secondary text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ─────────────────────────────────────── */}
      <div className="px-8 py-14 border-b border-border-theme">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-8 text-center">Frequently Asked Questions</p>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-border-theme rounded-xl p-5 bg-surface">
                <p className="text-tx-primary font-semibold text-sm mb-2">{faq.q}</p>
                <p className="text-tx-secondary text-xs leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ──────────────────────────────── */}
      <div className="px-8 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-tx-primary mb-3">Ready to start?</h2>
          <p className="text-tx-secondary text-sm mb-6">
            Message us on WhatsApp and our team will guide you through account opening — usually complete within 48 hours.
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono font-bold px-8 py-3.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors uppercase tracking-widest">
            {WA_ICON} Message Us on WhatsApp
          </a>
          <p className="text-xs text-tx-disabled font-mono mt-4">
            For informational purposes only · Not financial advice · Subject to regulatory compliance
          </p>
        </div>
      </div>

    </main>
  );
}

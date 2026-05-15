// constants/learn.ts
// Educational article content for the AHM Learning Center.
// Each article follows the same structure: overview, whyItMatters, keyTerms,
// example, commonMistakes, takeaway.
// Move to database-backed CMS when article count grows beyond ~20.

export type LearnKeyTerm = {
  term:       string;
  definition: string;
};

export type LearnArticle = {
  slug:            string;
  number:          string;
  title:           string;
  desc:            string;
  overview:        string;
  whyItMatters:    string;
  keyTerms:        LearnKeyTerm[];
  example:         string;
  commonMistakes:  string[];
  takeaway:        string;
};

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug:   "psx-basics",
    number: "01",
    title:  "PSX Basics",
    desc:   "How the Pakistan Stock Exchange works — market structure, trading hours, settlement, and indices.",
    overview:
      "The Pakistan Stock Exchange (PSX), headquartered in Karachi, is Pakistan's only regulated stock exchange. It allows listed companies to raise capital from investors, and gives those investors a marketplace to buy and sell shares. The PSX operates under the supervision of the Securities and Exchange Commission of Pakistan (SECP) and is governed by the PSX Rulebook.",
    whyItMatters:
      "Understanding the structure of the PSX helps you make informed decisions about when to trade, what indices to track, and how your orders are executed and settled. Without this foundation, market movements can feel random.",
    keyTerms: [
      { term: "KSE-100 Index",   definition: "A market-cap weighted index of the 100 largest companies listed on PSX. The primary benchmark for the Pakistan equity market." },
      { term: "Trading Hours",   definition: "Regular market hours are Monday–Friday, 09:15 to 15:30 PKT. Pre-open session: 09:15–09:45. Normal trading: 09:45–15:30." },
      { term: "T+2 Settlement",  definition: "Trades are settled two business days after execution. When you buy shares, the debit hits your account on T+2." },
      { term: "Circuit Breaker", definition: "A PSX mechanism that temporarily halts trading if a stock's price moves more than 5% (up or down) within a session." },
      { term: "Lot Size",        definition: "The minimum tradeable quantity for a stock, set by PSX. Most stocks have a lot size of 500 shares." },
      { term: "CDC",             definition: "Central Depository Company — the entity that holds your shares electronically. You need a CDC sub-account linked to your broker account." },
    ],
    example:
      "You buy 500 shares of UBL at PKR 248 on Monday. Your broker executes the trade. By Wednesday (T+2), the shares are transferred into your CDC account and PKR 124,000 plus brokerage is debited from your trading account.",
    commonMistakes: [
      "Confusing the market order price with the price you actually get — prices move between placing and execution.",
      "Not understanding lot sizes, leading to order rejections for quantities below the minimum.",
      "Ignoring settlement dates when planning liquidity — your funds are tied up until T+2.",
      "Treating the KSE-100 as 'the whole market' — many mid- and small-cap stocks are outside the index.",
    ],
    takeaway:
      "The PSX is a regulated, liquid marketplace. Knowing its mechanics — settlement, lot sizes, circuit breakers — gives you an operational edge before you even look at a single stock.",
  },

  {
    slug:   "reading-financial-statements",
    number: "02",
    title:  "Reading Financial Statements",
    desc:   "Income statement, balance sheet, and cash flow — what to look for in Pakistani company accounts.",
    overview:
      "Pakistani listed companies are required to file audited annual accounts and unaudited quarterly results with PSX. These three documents — the income statement, balance sheet, and cash flow statement — together tell you whether a company is profitable, financially stable, and actually generating real cash.",
    whyItMatters:
      "Share prices, in the long run, follow earnings and cash flows. Investors who can read financial statements can verify whether a stock's valuation is justified, spot deteriorating quality early, and avoid traps that fooled others.",
    keyTerms: [
      { term: "Revenue",         definition: "Total sales or income earned from core operations before any deductions." },
      { term: "EBITDA",          definition: "Earnings Before Interest, Tax, Depreciation, and Amortisation. A proxy for operating cash generation." },
      { term: "PAT",             definition: "Profit After Tax — the bottom line. Net profit available to shareholders." },
      { term: "EPS",             definition: "Earnings Per Share = PAT ÷ Total Shares. The per-share profitability measure used to calculate P/E." },
      { term: "Equity",          definition: "Shareholders' equity = Assets minus Liabilities. The book value of the business belonging to shareholders." },
      { term: "Operating CF",    definition: "Cash generated from core business operations — the most reliable indicator of business health." },
      { term: "Debt-to-Equity",  definition: "Total Debt ÷ Equity. Measures financial leverage. High D/E means higher financial risk." },
    ],
    example:
      "A cement company reports PAT of PKR 8 billion on revenue of PKR 80 billion — a 10% net margin. But its operating cash flow is only PKR 2 billion because receivables have surged. This gap warns you that profits are being booked but not collected — a red flag.",
    commonMistakes: [
      "Looking only at PAT and ignoring cash flow — companies can book 'paper profits' through accounting while running out of cash.",
      "Comparing absolute rupee profits without normalising for company size (use margins and EPS instead).",
      "Ignoring the notes to accounts, which often reveal off-balance-sheet liabilities or related-party transactions.",
      "Overlooking changes in working capital — rising receivables or inventory can signal trouble ahead.",
    ],
    takeaway:
      "Revenue tells you size. PAT tells you profitability. Cash flow tells you truth. Always read all three together.",
  },

  {
    slug:   "sector-analysis",
    number: "03",
    title:  "Sector Analysis",
    desc:   "How to analyse individual sectors — key drivers, cost structures, regulatory environment, and cycle positioning.",
    overview:
      "Sector analysis is the practice of understanding the forces that drive an entire industry before selecting individual stocks within it. On the PSX, sector dynamics often matter more than company-specific factors — a rising tide (good macro for banks, falling rates for cement) lifts most boats in that sector.",
    whyItMatters:
      "Picking a great company in a terrible sector is often a losing trade. Understanding sector cycles, cost structures, and regulatory risks helps you position in the right sectors at the right time — and avoid costly mistakes.",
    keyTerms: [
      { term: "Sector Rotation",     definition: "The flow of investment capital from one industry to another as economic conditions change." },
      { term: "Margin Cycle",        definition: "The recurring expansion and compression of profit margins driven by input costs, pricing power, and demand cycles." },
      { term: "Regulatory Risk",     definition: "The risk that government policy, taxes, or regulation will materially change a sector's economics." },
      { term: "CASA Ratio",          definition: "Current Account + Savings Account deposits as % of total deposits. Key for banking sector profitability." },
      { term: "Gross Margin",        definition: "Revenue minus cost of goods sold, divided by revenue. Tells you how much pricing power a company has." },
      { term: "Circular Debt",       definition: "Pakistan's power sector payment chain problem — DISCO arrears owed to IPPs, which owe to fuel suppliers. A persistent sector-level risk." },
    ],
    example:
      "When the SBP cuts interest rates, banking sector NIMs compress (lower lending spreads), but cement and construction sectors benefit from cheaper credit and improved housing affordability. A sector rotation from banking into construction/cement is a logical macro trade.",
    commonMistakes: [
      "Applying the same analytical framework to all sectors — banks need NIM and CASA analysis; cement needs cost-per-bag and utilisation analysis.",
      "Ignoring regulatory changes. The super-tax, CNIC requirements, and SECP rule changes have dramatically impacted specific sectors.",
      "Buying the 'best company' in a sector heading into a structural downcycle.",
      "Underestimating import dependency — sectors reliant on imported inputs (refineries, chemicals) carry PKR depreciation risk.",
    ],
    takeaway:
      "Know the sector before you study the stock. The forces shaping an industry set the ceiling for how well even the best company in it can do.",
  },

  {
    slug:   "valuation-methods",
    number: "04",
    title:  "Valuation Methods",
    desc:   "P/E, P/B, DCF, and dividend yield — how to value PSX stocks using fundamental analysis.",
    overview:
      "Valuation is the process of determining what a stock is worth — and comparing that to the price it's trading at. No single method is perfect, but using multiple approaches together gives you a more confident view of whether a stock is cheap, fair, or expensive.",
    whyItMatters:
      "Buying a fundamentally good company at the wrong price destroys returns. Valuation discipline is what separates investing from gambling. It's the basis of every BUY/SELL/HOLD recommendation our research desk publishes.",
    keyTerms: [
      { term: "P/E Ratio",        definition: "Price ÷ Earnings Per Share. How much investors pay per rupee of earnings. Lower P/E may indicate undervaluation, but context matters." },
      { term: "P/B Ratio",        definition: "Price ÷ Book Value Per Share. Compares market price to net assets. Particularly useful for banks and financial companies." },
      { term: "Dividend Yield",   definition: "Annual DPS ÷ Current Price. The income return from holding a stock. High yield can indicate value — or a dividend at risk." },
      { term: "DCF",              definition: "Discounted Cash Flow. Projects future free cash flows and discounts them back to today at a required rate of return. Most rigorous but most assumption-dependent." },
      { term: "EV/EBITDA",        definition: "Enterprise Value ÷ EBITDA. Useful for comparing companies with different capital structures. Common for industrial and energy sector analysis." },
      { term: "Upside / Downside",definition: "The percentage difference between your estimated intrinsic value (price target) and the current market price." },
    ],
    example:
      "UBL trades at P/B of 0.7x vs. its historical average of 0.9x and sector average of 0.9x. This 0.2x P/B discount, with improving ROE and consistent dividends, suggests the stock is undervalued — supporting a BUY thesis with a re-rating catalyst.",
    commonMistakes: [
      "Using P/E alone without checking earnings quality — inflated earnings produce misleadingly low P/E ratios.",
      "Comparing P/E ratios across sectors. A 6x P/E bank is not the same as a 6x P/E tech company.",
      "Ignoring the risk-free rate. A 12% yield may look attractive, but if T-bills yield 18%, the risk premium is thin.",
      "Anchoring to a single methodology — always triangulate with at least two valuation approaches.",
    ],
    takeaway:
      "No single valuation method is always right. Use P/E for earnings businesses, P/B for banks, EV/EBITDA for industrial companies, and dividend yield for income plays. Then ask: what would have to be true for this valuation to be wrong?",
  },

  {
    slug:   "reading-the-screener",
    number: "05",
    title:  "Reading the Screener",
    desc:   "How to use the AHM Stock Screener to filter, rank, and shortlist investment ideas.",
    overview:
      "The AHM Stock Screener is a tool for narrowing down the ~550 listed PSX companies to a focused shortlist based on criteria you define — sector, market cap, valuation metrics, or price momentum. The screener is a starting point, not a buy signal.",
    whyItMatters:
      "Manually reviewing 550 stocks is impractical. A well-configured screener lets you filter for your investment style — whether you're looking for high-yield dividend stocks, undervalued small-caps, or large-cap sector leaders — in minutes.",
    keyTerms: [
      { term: "Market Cap",      definition: "Total market value of a company = Price × Shares Outstanding. PSX defines Large Cap as >PKR 10bn, Mid Cap PKR 1–10bn, Small Cap <PKR 1bn." },
      { term: "Change %",        definition: "Daily price change as a percentage. Useful for identifying momentum or notable moves requiring investigation." },
      { term: "P/E Filter",      definition: "Screens for companies trading below a specified earnings multiple — commonly used for value-oriented searches." },
      { term: "Volume",          definition: "Number of shares traded in a session. High volume on a price move adds conviction; low volume makes the move less meaningful." },
      { term: "52-Week Range",   definition: "The highest and lowest price over the past 52 weeks. Stocks near 52-week lows may be oversold; near highs may be extended." },
      { term: "Sector Filter",   definition: "Limits results to companies in a specific industry — useful when you have a sector-level thesis you want to express." },
    ],
    example:
      "You have a view that the banking sector is undervalued. You set the screener to: Sector = Banking, P/B < 0.8x, Market Cap > PKR 50bn. The result might return MCB, UBL, and HBL — three candidates for deeper analysis, not automatic buys.",
    commonMistakes: [
      "Treating screener output as a buy list — it's a shortlist for further research, not a recommendation.",
      "Over-filtering to the point where no stocks pass — keep your initial criteria broad, then tighten.",
      "Ignoring sorting — sometimes sorting by volume or change % reveals interesting opportunities the P/E filter would miss.",
      "Focusing only on what the screener shows and ignoring what it can't capture: management quality, earnings trends, or recent corporate actions.",
    ],
    takeaway:
      "The screener is a map, not a destination. Use it to narrow your universe efficiently, then do fundamental analysis on your shortlist before making any investment decision.",
  },

  {
    slug:   "understanding-dividends",
    number: "06",
    title:  "Understanding Dividends",
    desc:   "Dividend policy, payout ratios, book closure dates, and how to evaluate dividend yield on PSX.",
    overview:
      "A dividend is a cash distribution paid by a company to its shareholders from profits. PSX companies may pay interim dividends (mid-year) and final dividends (after year-end results). Some also pay scrip dividends (bonus shares). Dividends are a significant part of total returns on the PSX — particularly for banks, fertiliser, and utility companies.",
    whyItMatters:
      "For many PSX investors, dividend yield is the primary investment rationale. Companies with consistent, high dividend payouts can provide income even in flat or declining markets. Understanding how dividends work helps you avoid common traps like buying after the book closure date.",
    keyTerms: [
      { term: "DPS",              definition: "Dividend Per Share — the rupee amount paid per share. E.g. PKR 3.5/share." },
      { term: "Dividend Yield",   definition: "DPS ÷ Market Price × 100. Tells you the income return as a % of your investment cost." },
      { term: "Payout Ratio",     definition: "Dividends Paid ÷ Net Profit × 100. A 70% payout means the company returns 70% of earnings to shareholders." },
      { term: "Book Closure Date",definition: "The date on which a company closes its share register to determine who gets the dividend. You must own shares BEFORE this date to receive the dividend." },
      { term: "Ex-Dividend Date", definition: "The date after which buying shares no longer entitles you to the declared dividend. Price typically drops by the dividend amount on this date." },
      { term: "Scrip Dividend",   definition: "Instead of cash, the company issues additional shares as dividend. Also called a bonus share. Has tax implications different from cash dividends." },
    ],
    example:
      "UBL declares a final dividend of PKR 6/share with a book closure of June 15. If you buy on June 14 (before book closure), you receive PKR 6 per share held. If you buy on June 15 or after, you do not. The stock price typically falls by approximately PKR 6 on the ex-dividend date as the dividend value separates from the stock.",
    commonMistakes: [
      "Buying after book closure and expecting to receive the dividend — check the dates before you buy.",
      "Chasing high dividend yields without checking payout sustainability — a 20% yield can be a sign the dividend is about to be cut, not a gift.",
      "Ignoring withholding tax — PSX dividends are subject to withholding tax (15% for filers, 30% for non-filers as of 2024/25). Your net yield is after this deduction.",
      "Overlooking scrip dividends — they dilute your per-share value even as they increase your share count.",
    ],
    takeaway:
      "Dividends are a powerful wealth-building tool on the PSX — but only if you understand payout sustainability, book closure mechanics, and tax implications. A high yield that is cut is a double loss: income disappears and the stock price falls.",
  },
];

// Lookup helper
export function getArticleBySlug(slug: string): LearnArticle | null {
  return LEARN_ARTICLES.find((a) => a.slug === slug) ?? null;
}

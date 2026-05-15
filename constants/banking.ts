// constants/banking.ts
// Shared metadata for all listed Pakistani banking sector companies.
// Used by BankingModule, peer comparison tables, and any future banking dashboards.

export type BankProfile = {
  sym:     string;
  name:    string;
  pat:     string;         // latest full-year PAT string for display
  casa:    number;         // CASA ratio as integer (e.g. 73 = 73%)
  adr:     number;         // Advance-to-Deposit Ratio as integer
  nim:     string;         // Net Interest Margin display string
  tagline: string;
  meta:    [string, string][];   // key-value pairs for the detail card
  strength: string;
  weakness: string;
  diff:     string;        // key differentiator vs peers
  risk:     string;
  tags:     string[];
};

export const BANK_PROFILES: BankProfile[] = [
  {
    sym: "HBL", name: "Habib Bank Limited",
    pat: "Rs74B", casa: 73, adr: 43, nim: "4.8%",
    tagline: "Largest by assets, widest network, international income.",
    meta: [["Assets","Rs6.1T"],["Branches","1,700+ domestic, 55 intl"],["PAT CY2024","Rs74B (flat)"],["EPS","Rs38 · Div Rs16.5"],["H1 2025","PAT Rs34.4B (+19% YoY)"]],
    strength: "Largest branch and ATM network plus 55 international branches — widest distribution moat of any listed bank. Overseas operations (Africa, Middle East) generate USD-denominated fee, remittance, and trade-finance income no domestic-only peer replicates at scale.",
    weakness: "Scale means high opex — managing 1,700+ branches is expensive. ETR of 52%+ among the highest in sector, structurally compressing PAT relative to pre-tax income.",
    diff: "International presence. HBL's overseas operations in Africa, the Middle East, and beyond create earnings diversification structurally unavailable to any other listed Pakistani bank.",
    risk: "SBP policy rate (NII repricing on large asset base) and ETR changes. International credit quality adds a variable absent from purely domestic peers.",
    tags: ["Largest Network","International Ops","AKFED Owned"],
  },
  {
    sym: "UBL", name: "United Bank Limited",
    pat: "Rs76B", casa: 70, adr: 45, nim: "5.1%",
    tagline: "Highest dividend, fastest NII growth, proactive Islamic pivot.",
    meta: [["Assets","~Rs3.5T"],["PAT CY2024","Rs75.7B (+34% YoY)"],["EPS","Rs61 · Div Rs44"],["1Q2025 PAT","Rs36.1B (+124% YoY)"],["Islamic","Converting KPK + Balochistan"]],
    strength: "Combination of high dividend payout (Rs44/share), strong PAT growth, and proactive Islamic conversion — the bank most actively repositioning for post-2028 while delivering near-term earnings growth.",
    weakness: "NII grew 200% YoY in 1Q2025 — partly repricing-driven. High base effects make 2026 YoY comparisons challenging. Islamic conversion carries execution and customer retention risk.",
    diff: "Rs44/share dividend — highest absolute payout of any listed bank in CY2024 — combined with the most accelerated Islamic conversion programme among large conventionals.",
    risk: "SBP policy rate (large PIB portfolio). Islamic conversion pace and execution quality. ADR management as rate normalisation changes the investment return calculus.",
    tags: ["Highest Dividend","Islamic Pivot","PAT +34% CY24"],
  },
  {
    sym: "MEBL", name: "Meezan Bank Limited",
    pat: "Rs102B", casa: 80, adr: 60, nim: "5.8%",
    tagline: "Most profitable CY2024. Islamic leader. 2028 mandate beneficiary.",
    meta: [["Assets","~Rs2.5T"],["Islamic Mkt Share","~35%"],["PAT CY2024","Rs101.5B (record)"],["EPS","Rs57 · Div Rs28"],["1Q2025","PAT Rs22.4B (–12% YoY, high base)"]],
    strength: "35% Islamic banking market share built over 22 years — primary beneficiary of the 2028 Islamic mandate. No conventional bank can replicate this Shariah governance credibility and product depth overnight.",
    weakness: "CY2024 record PAT (Rs101.5B) set an extremely high comparison base. More exposed than peers to GIS yield compression as rates fall. Deposit base is rate-sensitive.",
    diff: "The 2028 Islamic mandate. Every conventional bank must transition; MEBL has a 22-year head start. Its Shariah governance board, product suite, and depositor loyalty create a structural tailwind with no expiry date.",
    risk: "GIS yield levels (Islamic equivalent of PIB yields). Increasing competition as all conventional banks convert Islamic windows to full operations by 2028.",
    tags: ["Most Profitable 2024","Islamic Leader","2028 Mandate Beneficiary"],
  },
  {
    sym: "MCB", name: "MCB Bank Limited",
    pat: "Rs58B", casa: 85, adr: 38, nim: "5.5%",
    tagline: "Best CASA ratio. Most conservative credit. Most stable NIM.",
    meta: [["Assets","~Rs2.8T"],["Branches","1,100+ domestic, 8 overseas"],["PAT CY2024","Rs57.6B (–3% YoY)"],["EPS","Rs48 · Div Rs36"],["Fee Income","Rs24.78B (+10% YoY)"]],
    strength: "Highest CASA ratio of any large listed private bank — a sticky low-cost deposit franchise built over three decades that structurally compresses funding costs below peers. Conservative credit culture produces consistently lower NPL ratios.",
    weakness: "EPS declined in CY2024 despite stable pre-tax income — higher taxes and opex eroding PAT. Nishat Group concentration creates affiliated credit exposure risk.",
    diff: "CASA quality and credit discipline. MCB's combination of high CASA and consistently low NPLs creates the most stable, predictable NIM profile in the sector across cycles.",
    risk: "CASA retention in competitive Islamic savings rate environment. ETR movement on Rs118B+ pre-tax income is a direct PAT lever.",
    tags: ["Nishat Group","Highest CASA","Lowest NPL"],
  },
  {
    sym: "NBP", name: "National Bank of Pakistan",
    pat: "Rs27B", casa: 65, adr: 50, nim: "4.2%",
    tagline: "State-owned. SBP fiscal agent. Highest headline NII growth in 1Q25.",
    meta: [["Assets","~Rs3.5T"],["Ownership","Government majority"],["PAT CY2024","Rs26.8B (–50%, one-time charge)"],["EPS","Rs12 · Div Rs8 (first since 2016)"],["1Q2025 NII","+139% YoY"]],
    strength: "Government treasury agent functions — pension disbursements, utility bill collections, government salaries — create a captive deposit base and fee stream no private bank can replicate in its coverage regions.",
    weakness: "Legacy credit portfolio with elevated NPLs. Large workforce relative to peer scale creates operational inefficiency. Government ownership constrains commercial discipline.",
    diff: "Role as SBP fiscal agent is unique — deposit flows and fee income tied to state financial operations creates an entirely different business mix from any private bank.",
    risk: "One-time exceptional charges (pension, court verdicts, provisioning reversals) create extreme quarter-level EPS volatility. Normalised earnings are the only analytically meaningful basis.",
    tags: ["State-Owned","SBP Fiscal Agent","NII +139% 1Q25"],
  },
  {
    sym: "ABL", name: "Allied Bank Limited",
    pat: "Rs35B", casa: 72, adr: 42, nim: "4.6%",
    tagline: "Steady mid-tier performer with improving fee income.",
    meta: [["PAT CY2024","~Rs35B"],["CASA","~72%"],["ADR","~42%"]],
    strength: "Consistent mid-tier profitability. Well-diversified loan book with relatively controlled NPLs.",
    weakness: "Lower brand recognition vs big 5 makes CASA accumulation slower. Less international diversification.",
    diff: "Allied Group backing provides corporate banking relationships and cross-group business referrals.",
    risk: "NIM compression in falling rate cycle. ADR tax below 50% threshold.",
    tags: ["Mid-Tier","Stable"],
  },
  {
    sym: "BAFL", name: "Bank Alfalah Limited",
    pat: "Rs30B", casa: 58, adr: 48, nim: "4.4%",
    tagline: "Growing consumer and retail franchise. Abu Dhabi Group backed.",
    meta: [["PAT CY2024","~Rs30B"],["CASA","~58%"],["ADR","~48%"]],
    strength: "Abu Dhabi Group ownership brings international capital and governance standards. Growing consumer banking footprint.",
    weakness: "Lower CASA ratio than peers means higher funding cost. ADR near the 50% threshold.",
    diff: "UAE-linked ownership and consumer focus differentiates from corporate-heavy peers.",
    risk: "CASA franchise less defensive in falling rate environment than MCB or MEBL.",
    tags: ["Abu Dhabi Group","Consumer Focus"],
  },
  {
    sym: "BAHL", name: "Bank AL Habib Limited",
    pat: "Rs28B", casa: 76, adr: 40, nim: "4.7%",
    tagline: "Conservative. Strong CASA. Lower risk appetite.",
    meta: [["PAT CY2024","~Rs28B"],["CASA","~76%"],["ADR","~40%"]],
    strength: "Strong CASA ratio and conservative credit culture have produced stable, low-volatility earnings over multiple cycles.",
    weakness: "Low ADR means large underweight to private lending — missing credit cycle upside as rates fall.",
    diff: "Habib family governance and conservative management creates low credit risk and stable dividend track record.",
    risk: "NIM compression as investment book yields fall. Low loan growth limits upside in credit expansion cycle.",
    tags: ["Conservative","Strong CASA","Family Governed"],
  },
  {
    sym: "BOP", name: "Bank of Punjab",
    pat: "Rs20B", casa: 55, adr: 52, nim: "4.0%",
    tagline: "Provincial government-linked. Higher risk, higher potential volatility.",
    meta: [["PAT CY2024","~Rs20B"],["CASA","~55%"],["ADR","~52%"]],
    strength: "Punjab government backing creates captive government deposits and public sector business. ADR above 50% avoids ADR tax surcharge.",
    weakness: "Lowest CASA ratio of major listed banks — higher funding cost. Higher NPL risk from SME and government-linked lending.",
    diff: "Only major listed bank with provincial government backing — access to Punjab government accounts and PESCO/utility related flows.",
    risk: "Credit quality — higher SME and government-linked exposure creates elevated NPL risk. Lower CASA makes it most sensitive to deposit cost increases.",
    tags: ["Punjab Govt Link","Highest ADR Risk"],
  },
];

/** Ordered list of PSX symbols for all profiled banking sector companies. */
export const BANK_SYMBOLS: string[] = BANK_PROFILES.map((p) => p.sym);

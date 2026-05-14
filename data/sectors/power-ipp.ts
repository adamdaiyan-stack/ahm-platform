// data/sectors/power-ipp.ts
// Auto-generated from pakistan_power_ipp_sector_module.html
// Content: 13 tabs of sector intelligence for the Power / IPP sector.

import type { SectorData } from "./types";

const sector: SectorData = {
  slug: 'power-ipp',
  name: 'Power / IPP',
  volume: 'Sector Intelligence Module · Volume V',
  subtitle: "A structured analytical framework covering how Pakistan's listed independent power producers generate capacity payments, what drives circular debt dynamics, and how HUBC, KAPCO, NPL, and NCPL differ structurally.",
  accentColor: '#e8c547',
  stats: [
  { val: 'Rs2.1T', lbl: 'Annual Capacity Payments CY2024' },
  { val: 'Rs5.73T', lbl: 'Peak Circular Debt (Jul 2024)' },
  { val: '~41,000 MW', lbl: 'Installed Capacity (vs 12-13 GW demand)' },
  { val: 'Rs1.225T', lbl: 'Circular Debt Refinancing (Sep 2025)' },
  { val: '5+ PPAs', lbl: 'Terminated or Renegotiated FY25' }
  ],
  tabs: [
  {
    id: 'overview',
    label: 'Overview',
    content: `<div class="section">
<div class="section-label">01 &middot; Sector Overview</div>
<h2>What the Sector Does</h2>
<p>Pakistan's power sector is unlike any other on the PSX. Independent Power Producers (IPPs) don't sell to an open market and don't compete for customers. They generate electricity, sell it to a single government-owned buyer &mdash; the Central Power Purchasing Agency (CPPA-G) &mdash; under 25 to 30 year contracts called Power Purchase Agreements (PPAs), and earn guaranteed returns regardless of whether the grid actually dispatches their power. This model creates businesses that look near risk-free on paper: guaranteed income, fuel cost pass-through, and dollar-indexed returns in many cases.</p>
<p>In practice, the sector is riven by the single largest financial distortion in Pakistan's economy &mdash; circular debt &mdash; where the government cannot pay IPPs on time because distribution companies cannot collect enough from consumers, because tariffs are politically suppressed, because system losses and theft consume over 16% of delivered electricity. The gap between what IPPs are contractually owed and what they actually receive is the defining earnings variable for every listed IPP.</p>

<div class="note warn">The Core Paradox: Pakistan has approximately 41,000 MW of installed power capacity but its grid baseload demand is only 12,000 to 12,500 MW. The country pays capacity charges on over 28,000 MW of idle or underutilised power &mdash; Rs2.1 trillion in CY2024 alone. Per-unit capacity charges rose from Rs16.22/kWh in FY24 to Rs17.31/kWh in FY25. This is the financial structure that drives electricity bills to Rs35/kWh for industry, making Pakistani manufacturing uncompetitive globally, and what forced the IMF to demand PPA renegotiations as a condition of Pakistan's bailout programme.</div>

<div class="chain-wrap">
<div class="chain-lbl">Pakistan Power Sector Architecture -- Value Chain</div>
<div class="chain">
<div class="chain-node" style="border-top:2px solid var(--accent3);"><div class="cn-lbl">Fuel Supply</div><div class="cn-val">HFO / Gas / Coal / Wind / Solar</div><div class="cn-sub">Cost fully passed through to CPPA-G under PPA</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--hubc);"><div class="cn-lbl">IPP Generation</div><div class="cn-val">Produce kWh at plant</div><div class="cn-sub">Earns CPP (capacity) + EPP (energy) payments</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--kapco);"><div class="cn-lbl">NTDC Transmission</div><div class="cn-val">National grid (HVDC)</div><div class="cn-sub">~2.4% technical losses</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--npl);"><div class="cn-lbl">DISCOs Distribution</div><div class="cn-val">10 distribution companies</div><div class="cn-sub">T&amp;D losses 16%+; theft; non-collection</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--ncpl);"><div class="cn-lbl">End Consumer</div><div class="cn-val">Rs35/kWh (industry)</div><div class="cn-sub">Load shedding when DISCOs cannot pay</div></div>
</div>
</div>

<div class="divider"></div>
<h2>Why It Matters on PSX</h2>
<ul class="bl">
<li>IPPs collectively account for a meaningful portion of PSX's listed equity market and are tracked closely by institutional investors for their dividend yields and guaranteed-return characteristics.</li>
<li>The PPA renegotiation cycle (2024-2026) is the most consequential event in 30 years of Pakistan's private power history &mdash; it is directly restructuring earnings for every listed IPP and will determine sector valuations for the next decade.</li>
<li>Circular debt resolution is a direct macro indicator: when the government clears receivables (as in the September 2025 Rs1.225T refinancing), IPPs receive large one-time inflows that spike quarterly earnings.</li>
<li>IPP stocks are among the most dividend-yield-sensitive on PSX &mdash; their income-generating characteristics attract investors who track yield spreads relative to fixed-income alternatives.</li>
<li>The EMO (Economic Merit Order) and the transition from take-or-pay to take-and-pay contracts are creating divergent outcomes between efficient plants (KAPCO, Thar Energy) and expensive legacy plants (HFO-fired IPPs) &mdash; the most analytically significant company-differentiation question in the sector.</li>
</ul>

<div class="divider"></div>
<h2>Sector Scale Context</h2>
<div class="bar-chart">
<div class="bar-head">Installed Capacity vs Demand -- FY25 Estimate</div>
<div class="bar-row"><div class="bar-lbl">Installed Total</div><div class="bar-track"><div class="bar-fill" style="width:100%;background:var(--accent4);"></div></div><div class="bar-val">~41,000 MW</div></div>
<div class="bar-row"><div class="bar-lbl">Summer Peak Demand</div><div class="bar-track"><div class="bar-fill" style="width:44%;background:var(--accent3);"></div></div><div class="bar-val">~18,000 MW</div></div>
<div class="bar-row"><div class="bar-lbl">Baseload Demand</div><div class="bar-track"><div class="bar-fill" style="width:30%;background:var(--accent);"></div></div><div class="bar-val">~12,500 MW</div></div>
<div class="bar-row"><div class="bar-lbl">Paying for Idle</div><div class="bar-track"><div class="bar-fill" style="width:68%;background:var(--text3);"></div></div><div class="bar-val">~28,000 MW idle</div></div>
</div>
<p style="margin-top:10px;font-size:12.5px;">Pakistan's ~41,000 MW installed capacity is the result of 30 years of adding generation without addressing transmission, distribution, or demand-side efficiency. The structural oversupply &mdash; paying for capacity that cannot be dispatched &mdash; is the root cause of the capacity payment burden that consumes Rs2.1T annually.</p>
</div>`,
  },
  {
    id: 'economics',
    label: 'Economics',
    content: `<div class="section">
<div class="section-label">02 &middot; How the Sector Makes Money</div>
<h2>The PPA Revenue Model</h2>
<p>Every IPP's revenue has exactly two components defined in its Power Purchase Agreement (PPA). Understanding these two streams is the essential starting point for any IPP financial analysis. The mix between them, and whether IPPs actually receive what is owed, determines all EPS outcomes.</p>

<div class="tbl-wrap">
<table class="var-tbl" style="min-width:700px;">
<thead><tr><th style="width:180px;">Revenue Component</th><th>What It Is</th><th>Who Bears Risk</th><th style="width:140px;">Investor Implication</th></tr></thead>
<tbody>
<tr>
<td class="vname">Capacity Purchase Price (CPP)</td>
<td>Fixed monthly payment for making the plant available &mdash; regardless of how much electricity is actually dispatched. Covers fixed O&amp;M, debt service, and return on equity. Paid even if the plant generates zero units. This is the "take-or-pay" guarantee that made Pakistani IPPs attractive to international investors in 1994.</td>
<td>Government / CPPA-G &mdash; must pay whether or not power is dispatched. The risk is sovereign.</td>
<td class="up">The annuity stream. For debt-free legacy IPPs, CPP is largely pure earnings. All IPP valuation is primarily a CPP receivables story.</td>
</tr>
<tr>
<td class="vname">Energy Purchase Price (EPP)</td>
<td>Variable payment per kWh actually generated and dispatched. Covers fuel cost (fully passed through to CPPA-G &mdash; IPP has zero fuel price risk) plus variable O&amp;M. The IPP earns a margin only on the variable O&amp;M component. EPP increases with actual dispatch.</td>
<td>Shared &mdash; fuel cost is a pure pass-through. Dispatch volume is at NTDC's discretion (EMO-based). IPP carries no fuel price risk but does carry dispatch risk.</td>
<td class="neu">Thin operational margin. More dispatch = more EPP income, but the variable O&amp;M margin is modest. CPP is where the earnings are.</td>
</tr>
<tr>
<td class="vname">Late Payment Interest (LPI)</td>
<td>When CPPA-G delays payments (circular debt), IPPs earn LPI on overdue receivables at KIBOR plus a spread (typically 3 to 4.5%) under PPA terms. During Pakistan's high-rate era (KIBOR at 22%), LPI became a significant income stream for IPPs with large overdue receivables.</td>
<td>Government bears the cost. LPI accrues automatically under PPA terms. IMF pushed for LPI waivers in 2025 renegotiations.</td>
<td class="up">Historically a large income source. Under the September 2025 refinancing, Rs387B of accumulated LPI was waived &mdash; a direct earnings hit at settlement but cash flow normalises afterward.</td>
</tr>
</tbody>
</table>
</div>

<div class="divider"></div>
<h2>Take-or-Pay vs Take-and-Pay</h2>
<div class="two-col">
<div class="col-card">
<div class="col-head"><span class="col-dot" style="background:var(--accent);"></span>Take-or-Pay (Old PPA Structure)</div>
<ul class="col-list">
<li>CPPA-G must pay full capacity charges regardless of dispatch -- even if plant runs at 2% capacity factor</li>
<li>Created guaranteed returns for IPPs; made Pakistani power attractive to foreign investors in 1994-2002</li>
<li>At 41,000 MW installed vs 12,500 MW baseload, Pakistan now pays for 28,000 MW of idle capacity</li>
<li>CPP at Rs2.1T/year is larger than Pakistan's entire defence budget -- fiscally unsustainable</li>
<li>Still applies to most legacy 1994 and 2002 policy IPPs including KAPCO (partially) and NPL/NCPL</li>
<li>IMF made conversion away from take-or-pay a condition of Pakistan's Extended Fund Facility</li>
</ul>
</div>
<div class="col-card">
<div class="col-head"><span class="col-dot" style="background:var(--accent3);"></span>Take-and-Pay (New PPA Structure)</div>
<ul class="col-list">
<li>Buyer (CPPA-G) pays only for electricity actually dispatched -- no guaranteed capacity payment</li>
<li>Transfers demand risk to the IPP -- plants with low EMO ranking and high fuel cost face near-zero revenue</li>
<li>For HFO-fired plants (NPL, NCPL) dispatched at 15-20% capacity factor, a full take-and-pay conversion could eliminate 80%+ of guaranteed revenue</li>
<li>For efficient plants (KAPCO CCGT, Thar coal), take-and-pay is less damaging because they are dispatched more frequently on the EMO</li>
<li>KAPCO's 2024 hybrid deal (500MW at partial guaranteed floor plus minimum dispatch commitment) represents the middle path</li>
<li>HUBC's Hub plant was terminated rather than converted -- government offered compensation instead</li>
</ul>
</div>
</div>

<div class="divider"></div>
<h2>Dollar Indexation of Returns</h2>
<p>Most pre-2015 IPPs have their Return on Equity calculated in US dollars and converted to rupees monthly. When the PKR depreciates, dollar-indexed returns automatically grow in PKR terms with no operational improvement whatsoever. This was the 2002 ECC decision that is widely regarded as the biggest policy error in Pakistan's power sector history: extending dollar-indexed ROE to all IPPs, not just foreign-financed ones. As the rupee depreciated from Rs60 to Rs280+ over the IPP era, dollar-indexed returns ballooned in PKR terms, contributing directly to the circular debt spiral. The IMF-mandated PPA renegotiations have included partial or full delinking of ROE from the dollar.</p>

<div class="divider"></div>
<h2>What Expands and Compresses Earnings</h2>
<div class="two-col">
<div class="col-card">
<div class="col-head"><span class="col-dot" style="background:var(--accent2);"></span>What Expands Earnings</div>
<ul class="col-list">
<li>Timely CPP receipt -- the most direct income variable; clearing circular debt releases blocked receivables</li>
<li>LPI accrual on overdue receivables during high-KIBOR periods (a structural windfall during 2022-24)</li>
<li>PKR depreciation -- for dollar-indexed IPPs, each rupee weakening increases PKR-denominated CPP</li>
<li>Circular debt refinancing events -- one-time cash inflows when CPPA-G pays down arrears</li>
<li>High dispatch rates -- more EPP revenue and variable O&amp;M margin, particularly for plants under hybrid or take-and-pay structures</li>
<li>Diversification income -- for HUBC, Thar Energy dividends, BYD Pakistan, and E&amp;P assets create non-PPA income streams</li>
</ul>
</div>
<div class="col-card">
<div class="col-head"><span class="col-dot" style="background:var(--accent4);"></span>What Compresses Earnings</div>
<ul class="col-list">
<li>CPP payment delays -- when CPPA-G delays payments, IPPs borrow from overdraft facilities at KIBOR+spread to fund operations</li>
<li>Take-or-pay to take-and-pay conversion -- for low-dispatch plants (HFO), eliminates the guaranteed revenue floor</li>
<li>LPI waiver -- the September 2025 Rs387B LPI waiver directly reduced IPP receivables at settlement</li>
<li>IRR reductions negotiated in PPA renegotiations -- lower guaranteed return on equity reduces long-run earnings baseline</li>
<li>Dollar-indexation delinking -- removes the automatic PKR depreciation windfall from future PPA earnings</li>
<li>Circular debt buildup -- forces IPPs to carry large working capital financing costs that erode net income</li>
</ul>
</div>
</div>
</div>`,
  },
  {
    id: 'variables',
    label: 'Variables',
    content: `<div class="section">
<div class="section-label">03 &middot; Key Variables to Track</div>
<h2>Variables That Move Earnings</h2>
<div class="tbl-wrap">
<table class="var-tbl" style="min-width:620px;">
<thead><tr><th style="width:190px;">Variable</th><th>What It Is &amp; Why It Matters</th><th style="width:130px;">Earnings Impact</th></tr></thead>
<tbody>
<tr class="section-row"><td colspan="3">Payments and Cash Flow</td></tr>
<tr>
<td class="vname">Circular Debt Level (Rs)</td>
<td>The total accumulated unpaid obligations in Pakistan's power sector &mdash; primarily what CPPA-G owes to IPPs and fuel suppliers. Peaked at Rs5.73T in July 2024. The September 2025 refinancing reduced the stock to approximately Rs339B from Rs1.6T &mdash; a structural improvement, but the flow mechanisms creating circular debt (DISCO losses, non-collection, excess capacity) remain. When circular debt rises, IPP overdraft borrowing rises and net income falls. When it is cleared, IPPs receive large one-time cash inflows.</td>
<td class="down">Circular debt higher = earnings lower</td>
</tr>
<tr>
<td class="vname">CPP Receipt Timing</td>
<td>The gap between capacity payments contractually owed and actually received. CPPA-G prioritises payment to CPEC plants and nuclear, leaving older thermal IPPs waiting longer. A one-month delay in quarterly CPP payment forces an IPP to borrow Rs3 to 6B at KIBOR+spread, costing Rs300 to 500M+ in additional financing charges. This is the most direct quarterly EPS variable and cannot be read from company disclosures in advance &mdash; only from CPPA-G payment patterns and circular debt stock movements.</td>
<td class="down">Delay = higher borrowing cost = lower PAT</td>
</tr>
<tr>
<td class="vname">Late Payment Interest (LPI)</td>
<td>Interest earned by IPPs on overdue CPPA-G receivables at KIBOR plus 3 to 4.5% under PPA terms. During high-rate periods (KIBOR at 22%), LPI was a major income source. Rs387B of accumulated LPI was waived in the September 2025 refinancing settlement. Future LPI will be lower as circular debt stock reduces. Must be disaggregated from operating income: LPI is non-recurring and inflates PAT in high-delay periods.</td>
<td class="up">LPI higher = PAT higher (non-recurring)</td>
</tr>
<tr class="section-row"><td colspan="3">Contract Structure</td></tr>
<tr>
<td class="vname">PPA Type: Take-or-Pay vs Take-and-Pay</td>
<td>The most consequential structural variable for IPP EPS. Under take-or-pay, CPPA-G pays capacity charges regardless of dispatch &mdash; an HFO plant at 5% capacity factor still earns full CPP. Under take-and-pay, only dispatched electricity generates revenue. A full take-and-pay conversion for a plant with 15% capacity factor eliminates 85% of guaranteed revenue. The government's IMF-mandated push to convert legacy IPPs is the primary sector re-rating risk. Each company's current contract structure is the key analytical input.</td>
<td class="down">Take-and-pay conversion = very negative for HFO</td>
</tr>
<tr>
<td class="vname">Dollar Indexation of ROE</td>
<td>IPPs whose Return on Equity is calculated in USD and converted monthly to PKR earn automatically higher PKR revenues when the rupee weakens. PKR depreciated from Rs60 to Rs280+ during the IPP era, automatically inflating CPP for dollar-indexed plants without any operational improvement. IMF-mandated PPA renegotiations have included partial or full delinking of ROE from USD. Any further depreciation benefits dollar-indexed IPPs; any relink removal reduces future earnings growth from currency.</td>
<td class="up">PKR weakens = PAT higher (for dollar-indexed)</td>
</tr>
<tr>
<td class="vname">PPA Negotiation Outcome</td>
<td>Each individual PPA renegotiation has a binary outcome range: full termination (as HUBC's Hub plant), partial conversion to hybrid take-and-pay (as KAPCO's 500MW deal), or continuation with IRR reduction. The uncertainty itself is a valuation discount even before outcomes are known. NPL share fell 17% in September 2024 on renegotiation fears without any actual terms changing. Once resolved, either outcome (termination or continuation) reduces uncertainty and typically narrows the discount.</td>
<td class="neu">Binary event: highly company-specific</td>
</tr>
<tr class="section-row"><td colspan="3">Dispatch and Operational</td></tr>
<tr>
<td class="vname">Economic Merit Order (EMO) Position</td>
<td>The dispatch priority list ranking plants by cost of generation (cheapest first): hydro, nuclear, local coal (Thar), imported coal, gas CCGT, gas simple cycle, then HFO. HFO plants (NPL, NCPL) rank last &mdash; dispatched only when cheaper options are exhausted, meaning capacity factors of 5 to 20%. Gas CCGTs (KAPCO) rank higher due to lower heat rate. Under take-or-pay, EMO position doesn't affect capacity payments. Under take-and-pay, EMO position determines how much revenue the plant actually earns.</td>
<td class="neu">Under ToP: EMO irrelevant. Under TaP: critical.</td>
</tr>
<tr>
<td class="vname">PKR/USD Exchange Rate</td>
<td>For dollar-indexed IPPs (most pre-2015 plants), each PKR depreciation cycle automatically increases CPP in rupee terms. Rs10 depreciation on USD-indexed CPP for a large plant (e.g. KAPCO, with capacity of ~1,600MW) can add Rs500M to Rs1B in annual CPP income. This is a structural tailwind during currency weakness and is being progressively removed by PPA renegotiations delinking ROE from USD.</td>
<td class="up">Depreciation = higher PKR earnings</td>
</tr>
<tr>
<td class="vname">CTBCM Implementation Progress</td>
<td>The Competitive Trading Bilateral Contract Market (CTBCM) &mdash; NEPRA-approved in 2020, licenses issued 2022 &mdash; is Pakistan's planned transition from single-buyer (CPPA-G) to a competitive wholesale electricity market where IPPs can sell directly to large consumers. Full implementation creates a fundamentally different business model: bilateral contracts with industrial consumers, no guaranteed CPP, and merchant risk. Efficient plants (KAPCO, Thar) would likely do better; HFO plants face structural challenge. CTBCM has been "two years away" since 2020 but is referenced in each IPP earnings call as the long-term structural change to monitor.</td>
<td class="neu">Long-term structural: plant-efficiency dependent</td>
</tr>
</tbody>
</table>
</div>
</div>`,
  },
  {
    id: 'structure',
    label: 'Structure',
    content: `<div class="section">
<div class="section-label">04 &middot; Industry Structure</div>
<h2>The 30-Year Policy History</h2>
<p>Understanding the current sector crisis requires understanding how it was built. Each policy wave embedded structural commitments that accumulated over 30 years into the fiscal distortion now being unwound.</p>

<div class="hist-list">
<div class="hist-item"><div class="hist-year">1994 Policy</div><div class="hist-desc">Pakistan opens to private power after decades of WAPDA underinvestment and rolling blackouts. 16 IPPs licensed including HUBC and KAPCO with generous terms: guaranteed 15% dollar-indexed return on equity, take-or-pay contracts, fuel cost pass-through, and sovereign guarantees. World Bank and IFC backed many early plants. Pakistan solved its power shortage &mdash; but embedded structural costs that would haunt it for 30 years.</div></div>
<div class="hist-item"><div class="hist-year">2002 Policy</div><div class="hist-desc">Second wave: 13 more IPPs licensed including NPL and NCPL under cost-plus tariffs where NEPRA calculated full cost before setting tariffs. The ECC controversially decided to pay Return on Equity in USD to all IPPs &mdash; not just foreign-financed ones. Any PKR depreciation would now automatically increase IPP returns in PKR terms, creating a structural government liability that grew explosively as the rupee moved from Rs60 to Rs280+.</div></div>
<div class="hist-item"><div class="hist-year">2015-2018 CPEC</div><div class="hist-desc">Chinese-financed coal power of 10,000+ MW added in five years. CPEC plants have dollar-denominated tariffs, high upfront capital costs, and are dispatched despite being more expensive than local alternatives &mdash; due to sovereign commitments. CPEC projects now constitute approximately 36% of total CPP burden despite being among the most expensive power in the system.</div></div>
<div class="hist-item"><div class="hist-year">2020 Inquiry Report</div><div class="hist-desc">Government inquiry finds IPPs earned excess profits through: misreporting heat rates (claiming worse efficiency than actual to justify higher fuel billing); over-invoicing O&amp;M; benefiting from the 2002 ECC dollar-indexation decision. MoUs signed to renegotiate; ROE reduced from 15% to 12% for some plants. Forensic audits never fully executed.</div></div>
<div class="hist-item"><div class="hist-year">2024-2025 IMF Mandate</div><div class="hist-desc">With circular debt at Rs5.73T and capacity payments at Rs2.1T/year, the IMF demands structural action as part of Pakistan's Extended Fund Facility. Five PPAs terminated including HUBC's original 1,292MW Hub plant. Eighteen IPPs facing take-or-pay to take-and-pay conversion. The Rs1.225T refinancing deal (September 2025) clears Rs1.6T of circular debt stock to Rs339B. LPI waivers of Rs387B agreed. IRRs reduced. Dollar-indexed returns partially delinked. The defining sector event in a generation.</div></div>
</div>

<div class="divider"></div>
<h2>The Circular Debt Mechanism</h2>
<p>Circular debt is not "one creditor owing another." It is a description of a structural failure where money flows in a loop &mdash; never completing the circuit &mdash; causing a system-wide liquidity crisis that simultaneously harms IPPs, fuel suppliers, consumers, government finances, and economic growth.</p>
<div class="cd-step"><div class="cd-num">01</div><div class="cd-who">NEPRA sets tariff below cost</div><div class="cd-what">NEPRA sets the generation tariff &mdash; what CPPA-G must pay IPPs. Tariff is often set below real cost due to political pressure. Structural underpayment is embedded from step one.</div></div>
<div class="cd-step"><div class="cd-num">02</div><div class="cd-who">DISCOs bill consumers</div><div class="cd-what">10 DISCOs distribute power and bill consumers. Allowed T&amp;D loss in tariff: 12.21%. Actual loss: 16.38%. The 4%+ gap is unfunded. Theft, non-collection, and meter manipulation erode collections further. Actual billing recovery: ~85 to 90%.</div></div>
<div class="cd-step"><div class="cd-num">03</div><div class="cd-who">Consumers don't pay fully</div><div class="cd-what">Industrial tariff at Rs35/kWh makes Pakistani manufacturing uncompetitive. Consumers delay or partially pay. Agricultural and residential consumers get politically protected below-cost tariffs subsidised by industry through cross-subsidies. DISCOs collect less than they spend every month.</div></div>
<div class="cd-step"><div class="cd-num">04</div><div class="cd-who">DISCOs cannot pay CPPA-G</div><div class="cd-what">CPPA-G (the single buyer) is owed money by DISCOs but cannot collect enough. CPPA-G prioritises payment to CPEC plants and nuclear. Older thermal IPPs (HUBC, KAPCO, NPL, NCPL) wait. Receivables accumulate. LPI accrues.</div></div>
<div class="cd-step"><div class="cd-num">05</div><div class="cd-who">CPPA-G cannot pay fuel suppliers</div><div class="cd-what">PSO (HFO), SNGPL/SSGCL (gas), and international coal suppliers don't get paid. They restrict future supply. IPPs face fuel shortages, reduce generation. Load shedding increases, consumer frustration grows.</div></div>
<div class="cd-step"><div class="cd-num">06</div><div class="cd-who">Government injects liquidity (sometimes)</div><div class="cd-what">Power Holding Company (PHC) borrows from commercial banks at KIBOR+ to inject into CPPA-G. This adds to public debt. Budget subsidies cover part of the tariff differential. IMF constrains fiscal space for further subsidies.</div></div>
<div class="cd-step"><div class="cd-num">07</div><div class="cd-who">Circular debt compounds</div><div class="cd-what">The gap between what the system earns and what it owes grows every year because system losses, non-collection, and politically suppressed tariffs are structural, not cyclical. Debt compounds with LPI. The entire economy pays through high tariffs, unreliable supply, and constrained fiscal space.</div></div>

<div class="note warn" style="margin-top:16px;">The September 2025 Rs1.225T refinancing cleared the stock of circular debt from Rs1.6T to approximately Rs339B &mdash; the largest single power sector financial transaction in Pakistan's history. However, this is the fourth time Pakistan has attempted a circular debt solution (1998, 2012, 2020, 2024-2025). The previous three resulted in debt rebuilding within 5 years. Without DISCO privatisation, tariff rationalisation, and loss reduction, the flow mechanisms creating circular debt remain intact.</div>

<div class="divider"></div>
<h2>Regulatory and Policy Architecture</h2>
<ul class="bl">
<li><strong style="color:var(--text)">NEPRA (National Electric Power Regulatory Authority):</strong> Sets generation tariffs, approves Power Acquisition Plans, licenses IPPs. Limited capacity to verify IPP invoices and heat rate declarations has been a persistent governance gap identified in the 2020 inquiry.</li>
<li><strong style="color:var(--text)">CPPA-G (Central Power Purchasing Agency):</strong> The single buyer. Purchases all electricity from IPPs and GENCOs at NEPRA-determined tariffs, then sells to 10 DISCOs at a pooled price. When DISCOs don't pay CPPA-G, the circular debt originates here.</li>
<li><strong style="color:var(--text)">NTDC (National Transmission and Dispatch Company):</strong> Operates the national transmission grid and dispatches plants on the EMO. Controls which plants are called to generate &mdash; critical for take-and-pay plants where dispatch frequency determines revenue.</li>
<li><strong style="color:var(--text)">Ministry of Energy / PPIB:</strong> Sets power policy, approves new capacity, and negotiates IPP terms. The 1994 and 2002 policy frameworks (still binding through existing PPAs) were approved here.</li>
<li><strong style="color:var(--text)">IMF:</strong> The external disciplinarian. Pakistan's Extended Fund Facility conditions have included specific requirements on PPA renegotiations, tariff adjustments, and circular debt management. IMF programme compliance drives the pace of structural change.</li>
</ul>
</div>`,
  },
  {
    id: 'companies',
    label: 'Companies',
    content: `<div class="section">
<div class="section-label">05 &middot; Company Profiles</div>
<h2>Four Major Listed IPPs</h2>
<p>All four operate under PPA frameworks with CPPA-G as the single buyer. Key differences lie in fuel type, EMO position, PPA status, and diversification beyond the original plant.</p>

    <div class="company-grid">

      <div class="company-card card-hubc">
        <div class="company-ticker ticker-hubc">PSX: HUBC</div>
        <div class="company-name">The Hub Power Company</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Pioneer Pakistani IPP (1991); Hub plant PPA terminated Oct 2024; remaining: Narowal (225MW gas), Laraib (84MW hydro), Thar Energy (330MW coal, under development); BYD Pakistan JV and E&P exposure.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> 30-year operational track record; only major listed IPP actively building a diversified non-power business (BYD Pakistan, E&P, Thar mine-mouth coal) at scale.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Hub plant termination removed the largest established earnings asset at below-fair-value compensation (Rs36.5B received vs Rs56B+ claimed); near-term earnings transition while Thar Energy ramps.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Thar Energy commissioning and production ramp-up; Laraib hydro CPP receipts; Narowal gas plant dispatch; BYD Pakistan automotive JV progression.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Thar Energy commissioning delay; circular debt on remaining plant receivables; BYD Pakistan execution risk in an early-stage EV market.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The only listed IPP transforming from a single-plant annuity into a diversified energy and industrial group — Thar coal, hydro, EV, and E&P assets create a portfolio unlike any comparable listed Pakistani company.</li>
        </ul>
      </div>

      <div class="company-card card-kapco">
        <div class="company-ticker ticker-kapco">PSX: KAPCO</div>
        <div class="company-name">Kot Addu Power Company Ltd</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Pakistan's largest CCGT plant (1,600MW, multi-fuel: gas, HFO, diesel); hybrid take-and-pay PPA (500MW, to 2027); highest thermal efficiency of any listed IPP.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> CCGT's lower heat rate earns a high EMO position — KAPCO is dispatched more frequently than HFO plants in a constrained grid. Multi-fuel capability provides resilience during gas curtailments.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> 2027 PPA expiry creates a firm earnings cliff with undefined post-expiry revenue; the 500MW hybrid covers only part of the 1,600MW plant, leaving the balance's economics unclear.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Dispatch volume under the hybrid arrangement; CPP receipt timing from CPPA-G; efficiency advantage translating into EMO ranking.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> 2027 PPA expiry is the primary medium-term uncertainty; gas curtailment reduces dispatch regardless of EMO ranking; CTBCM pace determines whether post-2027 merchant operation is viable.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Pakistan's most thermally efficient listed thermal power plant — CCGT's structural dispatch advantage in any merit-order or take-and-pay framework cannot be replicated by HFO-only plants.</li>
        </ul>
      </div>

      <div class="company-card card-npl">
        <div class="company-ticker ticker-npl">PSX: NPL</div>
        <div class="company-name">Nishat Power Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Nishat Group 420MW HFO plant (Lahore, Punjab); take-and-pay PPA — revenue generated only when dispatched; earnings are directly proportional to dispatch frequency.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Nishat Group financial backing provides debt service certainty; Lahore proximity to load centres may reduce transmission losses and support dispatch priority.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> HFO fuel type receives a low EMO ranking in merit order — take-and-pay structure means low dispatch periods produce near-zero energy revenue with fixed costs intact.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Dispatch frequency under the take-and-pay PPA; CPP receipts from CPPA-G; circular debt resolution pace.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Low EMO ranking means dispatch can be minimal in high-supply, low-demand periods — complete energy revenue loss while financing costs continue.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Nishat Group backing differentiates NPL from independent HFO plants on access to capital and guarantee structures, though the underlying HFO technology creates the same structural dispatch vulnerability as NCPL.</li>
        </ul>
      </div>

      <div class="company-card card-ncpl">
        <div class="company-ticker ticker-ncpl">PSX: NCPL</div>
        <div class="company-name">Nishat Chunian Power Ltd</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Nishat Chunian Group 200MW HFO plant; take-and-pay PPA — energy payment directly linked to dispatch. The smallest and most straightforward of the four listed IPPs to model.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Smaller plant size means lower absolute fixed costs and proportionally smaller circular debt exposure than larger peers.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> HFO take-and-pay is the most exposed earnings model in the listed sector — no dispatch means no energy payment; 200MW scale limits the earnings ceiling.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Dispatch frequency; CPP receipt timing from CPPA-G; any LPI (Late Payment Interest) realisation from outstanding receivables.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Near-zero dispatch is a real operational scenario under take-and-pay for an HFO plant with a low EMO ranking — the primary risk event is straightforward but impactful.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Earnings are almost entirely a function of two variables — dispatch frequency and CPP receipt timing — making NCPL the most analytically transparent of the four listed IPPs.</li>
        </ul>
      </div>

    </div>
<ul class="co-bullets">
<li>Pakistan's first and historically largest IPP, founded 1991; set the template for 30 years of private power policy; original 1,292MW HFO Hub plant PPA terminated October 2024 after 27 years of operation</li>
<li>Remaining portfolio: Narowal Energy (NEL, 225MW gas), Laraib Energy (84MW hydro on Neelum River, KPK), and 60% stake in Thar Energy Limited (TEL, 330MW Thar coal mine-mouth plant under development)</li>
<li>Hub plant compensation of Rs36.5B was approximately Rs20B below HUBC's own valuation of Rs56B+ &mdash; company cited coercion and threat of corruption investigations in accepting the below-value settlement</li>
<li>Diversification beyond power: 50% stake in Mega Motor Company (BYD Pakistan EV joint venture); Prime International (E&amp;P, acquired Eni Pakistan's assets 2022)</li>
</ul>
<div class="co-4grid">
<div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">30-year operational track record and the only major listed IPP actively diversifying into non-power businesses at scale. Thar Energy's mine-mouth coal gives it the lowest-cost fuel structure of its pipeline assets. Hydro (Laraib) provides zero-fuel-cost generation.</span></div>
<div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Hub plant termination removed the company's largest and most established earnings asset for below-fair-value compensation. Near-term earnings transition period as Thar Energy and other new assets ramp up. BYD Pakistan adds non-core business complexity and execution risk.</span></div>
<div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Strategic transformation in real time: the only listed IPP actively converting from a single-plant annuity business into a diversified energy and industrial group. Thar Energy (local coal), Laraib (hydro), BYD Pakistan (EVs), and E&amp;P exposure create an asset mix unavailable in any comparable listed Pakistani company.</span></div>
<div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Thar Energy commissioning timeline and production ramp-up. Circular debt on Narowal and Laraib receivables. BYD Pakistan automotive market execution. Long-term Thar coal viability under global energy transition pressures.</span></div>
</div>
<div class="tags">
<span class="tag b">1994 Pioneer IPP</span>
<span class="tag a">Hub PPA Terminated</span>
<span class="tag g">Thar Coal Development</span>
<span class="tag">Laraib Hydro</span>
<span class="tag">BYD Pakistan JV</span>
<span class="tag">E&amp;P Exposure</span>
</div>
</div>

<div class="company-card card-kapco">
<div class="co-ticker t-kapco">PSX: KAPCO</div>
<div class="co-name">Kot Addu Power Company Ltd</div>
<div class="co-meta">
<div class="co-meta-cell"><span class="co-meta-lbl">Installed Capacity</span><span class="co-meta-val">1,600 MW (CCGT, multi-fuel)</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">CY2024 Dividend</span><span class="co-meta-val">Rs7.5B</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">New PPA Status</span><span class="co-meta-val">Hybrid T&amp;P, 500MW, to 2027</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Plant Type</span><span class="co-meta-val">Pakistan's largest CCGT</span></div>
</div>
<ul class="co-bullets">
<li>Incorporated 1996, operational from 1996; Pakistan's largest combined cycle gas turbine (CCGT) plant at Kot Addu, Punjab &mdash; 10 gas turbines plus 5 steam turbines recovering exhaust heat for additional generation</li>
<li>Multi-fuel capability: natural gas (primary), HFO (backup), diesel (emergency); CCGT's higher thermal efficiency means lower heat rate (fuel consumed per kWh) and therefore higher EMO ranking than simple-cycle or HFO plants</li>
<li>Original PPA expired; NEPRA approved inclusion in Power Acquisition Plan 2023-2027; new arrangement: 500MW hybrid take-and-pay with certain guaranteed fixed costs plus minimum dispatch commitment through 2027</li>
<li>Post-2027 PPA expiry creates a terminal risk that will need resolution: either CTBCM merchant operation, a further PPA extension, or partial retirement</li>
</ul>
<div class="co-4grid">
<div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">CCGT technology is Pakistan's most thermally efficient thermal power plant type. Lower heat rate means higher EMO ranking &mdash; KAPCO is called to generate more frequently than HFO plants. Multi-fuel capability provides operational resilience when gas curtailments occur. Grid needs KAPCO for efficient baseload through 2027.</span></div>
<div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">2027 PPA expiry creates a firm earnings cliff. Post-2027 revenue is undefined: CTBCM merchant risk, further negotiation, or retirement. The 500MW hybrid deal covers only part of the 1,600MW plant, leaving the balance's economics unclear. Gas supply curtailments reduce dispatch when they occur.</span></div>
<div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">CCGT efficiency is the most durable structural advantage in Pakistan's listed IPP universe. In a system transitioning toward pay-for-what-you-dispatch (CTBCM or take-and-pay), efficient generation that earns a high EMO position survives better than legacy HFO plants. KAPCO's 1,600MW CCGT is the most competitive thermal plant configuration in the listed sector.</span></div>
<div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">2027 PPA expiry (the primary medium-term uncertainty). Gas supply availability (dispatch depends on uninterrupted gas). Circular debt delays on CPP receivables. CTBCM implementation pace as the long-term structural transition.</span></div>
</div>
<div class="tags">
<span class="tag g">Largest CCGT Pakistan</span>
<span class="tag g">Multi-Fuel</span>
<span class="tag b">Hybrid T&amp;P Deal 2027</span>
<span class="tag">High EMO Ranking</span>
</div>
</div>

<div class="company-card card-npl">
<div class="co-ticker t-npl">PSX: NPL</div>
<div class="co-name">Nishat Power Limited</div>
<div class="co-meta">
<div class="co-meta-cell"><span class="co-meta-lbl">Installed Capacity</span><span class="co-meta-val">420 MW (HFO)</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">CY2024 Dividend</span><span class="co-meta-val">Rs3.8B</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Original PPA Expiry</span><span class="co-meta-val">2035</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Ownership</span><span class="co-meta-val">Nishat Group (Mian Mansha)</span></div>
</div>
<ul class="co-bullets">
<li>Incorporated 2007; Nishat Group (Mian Mansha) parent; single 420MW HFO-fired plant at Jamber, Punjab; 25-year PPA with CPPA-G commencing 2010; among 18 IPPs identified for take-and-pay conversion discussions</li>
<li>HFO-fired plants rank last on the EMO &mdash; dispatched only when cheaper options are exhausted; actual utilisation rate often below 30%; NPL earns primarily through CPP under take-or-pay, not through actual generation</li>
<li>Share fell 17% in September 2024 on PPA renegotiation fears without any actual terms changing &mdash; illustrating how uncertainty itself is a meaningful valuation discount even before outcomes are determined</li>
<li>Nishat Group's conglomerate connections (MCB Bank, DGKC, Nishat Power) provide group-level financial support but do not directly influence CPPA-G payment terms or renegotiation outcomes</li>
</ul>
<div class="co-4grid">
<div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Original PPA runs to 2035 &mdash; 10+ years of remaining contractual life if take-or-pay terms are preserved. Nishat Group's corporate governance standards and financial discipline provide balance sheet stability. CPP receivables, while at risk of renegotiation, are currently contractually protected under the 2002 PPA framework.</span></div>
<div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">HFO fuel type places NPL at the bottom of the EMO &mdash; the first plants targeted for take-and-pay conversion precisely because they are barely dispatched. A full take-and-pay conversion at 15-20% capacity factor would eliminate the large majority of current earnings. This is NPL's existential structural risk.</span></div>
<div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Nishat Group parentage is the differentiator &mdash; Mian Mansha's direct political relationships and business influence are a factor in negotiation dynamics. The group's cross-sector presence (banking, cement, power) gives NPL access to conglomerate-level resources that smaller IPPs lack.</span></div>
<div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Take-and-pay conversion outcome &mdash; the binary risk that overwhelms all other variables. Circular debt delays (typical for an HFO plant). KIBOR level (affects overdraft costs during payment delays). Any EMO restructuring that changes dispatch priority.</span></div>
</div>
<div class="tags">
<span class="tag a">HFO Plant (Last EMO)</span>
<span class="tag r">Take-and-Pay Risk</span>
<span class="tag">Nishat Group</span>
<span class="tag">PPA to 2035</span>
</div>
</div>

<div class="company-card card-ncpl">
<div class="co-ticker t-ncpl">PSX: NCPL</div>
<div class="co-name">Nishat Chunian Power Ltd</div>
<div class="co-meta">
<div class="co-meta-cell"><span class="co-meta-lbl">Installed Capacity</span><span class="co-meta-val">200 MW (HFO)</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">CY2024 Dividend</span><span class="co-meta-val">Rs1.8B</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Dividend Yield</span><span class="co-meta-val">~10.44% (risk-elevated)</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Ownership</span><span class="co-meta-val">Nishat (Chunian) Limited</span></div>
</div>
<ul class="co-bullets">
<li>Incorporated 2007; subsidiary of Nishat (Chunian) Limited (a large textile company); 200MW HFO plant at Jamber Kalan, Punjab; 25-year PPA with CPPA-G commencing July 2010; structurally similar to NPL but smaller and with a textile parent rather than Mian Mansha's conglomerate</li>
<li>Among the smallest listed IPPs; minimal operational complexity (single plant, 140+ employees, one customer, one fuel); elevated dividend yield (~10.44%) signals the market is pricing in meaningful renegotiation or termination risk</li>
<li>Nishat (Chunian) Limited's textile business provides group financial support but significantly less political leverage than NPL's parent (Mian Mansha's direct Nishat Group holding)</li>
<li>If government imposes take-and-pay, NCPL's 200MW HFO plant &mdash; rarely dispatched due to EMO position &mdash; would face severe earnings compression; no diversification mechanism equivalent to HUBC's Thar or KAPCO's CCGT efficiency</li>
</ul>
<div class="co-4grid">
<div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Simple, focused business with a clear annuity cash flow under existing take-or-pay terms. The elevated dividend yield reflects the market's concern, but if renegotiation is resolved more favourably than feared, the yield provides compensation for uncertainty-bearing. Low operational complexity makes cash generation predictable when CPP is received.</span></div>
<div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Smallest and most exposed of the four listed IPPs: HFO fuel (last EMO), no diversification, textile parent (lower political leverage), and smallest scale (200MW vs 1,600MW KAPCO or 2,289MW HUBC portfolio). In a take-and-pay world at 15% utilisation, NCPL's earnings model is structurally challenged.</span></div>
<div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">The elevated dividend yield itself is the differentiator in a perverse sense: it is the market's visible signal of the risk premium attached to NCPL vs its peers. For an income investor who has formed a specific view on renegotiation outcome, the yield spread over KAPCO or HUBC represents that view's price.</span></div>
<div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Take-and-pay conversion (most exposed of the four). CPP receipt timing (cash flow for a small company with limited balance sheet). Circular debt levels. KIBOR level (overdraft financing cost during payment delays).</span></div>
</div>
<div class="tags">
<span class="tag r">HFO (Last EMO)</span>
<span class="tag r">Take-and-Pay Exposed</span>
<span class="tag a">10.44% Yield (Risk Signal)</span>
<span class="tag">Nishat Chunian Parent</span>
</div>
</div>`,
  },
  {
    id: 'peers',
    label: 'Peers',
    content: `<div class="section">
<div class="section-label">06 &middot; Peer Comparison Grid</div>
<h2>Cross-Company Comparison</h2>
<div class="tbl-wrap">
<table class="peer-tbl" style="min-width:900px;">
<thead><tr><th>Company</th><th>Business Model</th><th>Key Strength</th><th>Key Weakness</th><th>Main Sensitivity</th><th>Distinguishing Feature</th></tr></thead>
<tbody>
<tr>
<td><div class="co-badge b-hubc">HUBC</div><br><span style="font-size:12px;">Hub Power</span></td>
<td>Legacy 1994 pioneer IPP in fundamental transformation. Hub plant terminated Oct 2024. Remaining: Narowal gas, Laraib hydro, Thar Energy coal (development), BYD Pakistan JV, E&amp;P assets.</td>
<td>Strategic diversification depth &mdash; the only listed IPP actively building non-power earnings from Thar coal, EVs, and E&amp;P simultaneously. Laraib hydro is zero-fuel-cost generation.</td>
<td>Hub termination removed largest earnings asset for below-value compensation (Rs36.5B vs Rs56B+ claimed). Near-term earnings gap while Thar Energy and other assets ramp. Non-core complexity from BYD.</td>
<td>Thar Energy commissioning and revenue ramp-up timeline. Circular debt on Narowal/Laraib receivables. BYD Pakistan automotive market execution.</td>
<td>The only listed IPP that has accepted a fundamental transformation of its business model rather than defending the status quo. Hub termination was the most significant corporate event in Pakistan's listed power sector history.</td>
</tr>
<tr>
<td><div class="co-badge b-kapco">KAPCO</div><br><span style="font-size:12px;">Kot Addu Power</span></td>
<td>Single-site CCGT operator. 1,600MW multi-fuel combined cycle plant. Hybrid take-and-pay deal for 500MW through 2027. Focused power operator, no diversification.</td>
<td>CCGT technology = highest EMO ranking among listed thermal IPPs. Multi-fuel flexibility. 2027 PPA provides near-term earnings visibility. Grid relies on KAPCO for efficient baseload.</td>
<td>2027 PPA expiry creates an earnings cliff with no defined resolution. Post-2027 fate (CTBCM merchant risk, further negotiation, or retirement) is the primary unresolved strategic question.</td>
<td>2027 PPA renewal outcome. Gas supply availability for dispatch. Circular debt delays. CTBCM implementation pace as the post-2027 structural context.</td>
<td>CCGT efficiency is the most durable competitive characteristic among listed thermal IPPs. In any dispatch-based payment structure, efficiency determines economic viability &mdash; KAPCO is better positioned than HFO peers for a take-and-pay world.</td>
</tr>
<tr>
<td><div class="co-badge b-npl">NPL</div><br><span style="font-size:12px;">Nishat Power</span></td>
<td>Single-plant 420MW HFO annuity. PPA to 2035 under existing take-or-pay. Among 18 IPPs flagged for take-and-pay conversion. Nishat Group (Mian Mansha) parent.</td>
<td>PPA runs to 2035 if existing terms preserved. Nishat Group parentage provides conglomerate financial support and political relationships relevant to renegotiation dynamics.</td>
<td>HFO fuel places NPL last on EMO &mdash; the most targeted fuel type for take-and-pay conversion. Low actual dispatch rate (often below 30%) makes the existing business model fundamentally dependent on take-or-pay surviving.</td>
<td>Take-and-pay conversion outcome &mdash; the binary risk that dominates all other earnings variables for NPL.</td>
<td>Nishat Group political economy is the differentiator vs NCPL &mdash; Mian Mansha's direct ownership and conglomerate influence is a real factor in negotiation dynamics that smaller Chunian-parented NCPL lacks.</td>
</tr>
<tr>
<td><div class="co-badge b-ncpl">NCPL</div><br><span style="font-size:12px;">Nishat Chunian Power</span></td>
<td>Single-plant 200MW HFO annuity. Structurally identical to NPL but smaller and with textile parent (Nishat Chunian). Elevated yield signals market's risk pricing. Among 18 IPPs in take-and-pay conversion discussions.</td>
<td>Simple, predictable annuity cash flow under existing take-or-pay terms. Elevated yield compensates for uncertainty bearing if renegotiation outcome is more favourable than feared.</td>
<td>Smallest and most exposed: HFO fuel, 200MW scale, no diversification, textile parent with limited power sector political leverage. In a take-and-pay world, 200MW HFO at 15% utilisation is near-zero revenue.</td>
<td>Take-and-pay conversion (most binary and most negative among the four). CPP receipt timing. KIBOR level (overdraft cost).</td>
<td>The market's risk pricing signal &mdash; NCPL's 10.44% yield is the visible expression of how much more risk the market attaches to its renegotiation outcome vs the other three listed IPPs.</td>
</tr>
</tbody>
</table>
</div>

<div class="divider"></div>
<h2>Key Metrics Snapshot</h2>
<div class="tbl-wrap">
<table class="peer-tbl" style="min-width:680px;">
<thead><tr><th>Metric</th><th>HUBC</th><th>KAPCO</th><th>NPL</th><th>NCPL</th></tr></thead>
<tbody>
<tr><td><strong style="color:var(--text)">Capacity (MW)</strong></td><td>2,289 (portfolio)</td><td>1,600 (CCGT)</td><td>420 (HFO)</td><td>200 (HFO)</td></tr>
<tr><td><strong style="color:var(--text)">Fuel Type</strong></td><td>Gas / Hydro / Coal (Thar)</td><td>Gas / HFO / Diesel (CCGT)</td><td>HFO</td><td>HFO</td></tr>
<tr><td><strong style="color:var(--text)">EMO Position</strong></td><td>Mixed (hydro=top, gas=mid)</td><td>High (CCGT efficiency)</td><td>Last (HFO)</td><td>Last (HFO)</td></tr>
<tr><td><strong style="color:var(--text)">PPA Status</strong></td><td>Hub terminated; Narowal/Laraib continue</td><td>Hybrid T&amp;P, 500MW, to 2027</td><td>Take-or-Pay, to 2035 (at risk)</td><td>Take-or-Pay, to 2035 (at risk)</td></tr>
<tr><td><strong style="color:var(--text)">CY2024 Dividend</strong></td><td>Rs20.7B</td><td>Rs7.5B</td><td>Rs3.8B</td><td>Rs1.8B</td></tr>
<tr><td><strong style="color:var(--text)">Diversification</strong></td><td>Thar Energy, BYD Pakistan, E&amp;P</td><td>None (single site)</td><td>None (single plant)</td><td>None (single plant)</td></tr>
<tr><td><strong style="color:var(--text)">Dollar Indexation</strong></td><td>Partially delinked post-Hub termination</td><td>Partial</td><td>Yes (2002 policy)</td><td>Yes (2002 policy)</td></tr>
<tr><td><strong style="color:var(--text)">Take-and-Pay Risk</strong></td><td>Low (Hub gone; Narowal/Laraib continue)</td><td>Medium (hybrid deal navigated)</td><td>Very High (HFO, low dispatch)</td><td>Very High (HFO, low dispatch)</td></tr>
<tr><td><strong style="color:var(--text)">Circular Debt Sensitivity</strong></td><td>Medium (smaller remaining portfolio)</td><td>High (single large plant)</td><td>Very High (small company)</td><td>Very High (smallest company)</td></tr>
</tbody>
</table>
</div>
</div>`,
  },
  {
    id: 'risks',
    label: 'Risks',
    content: `<div class="section">
<div class="section-label">07 &middot; Important Risks</div>
<h2>Sector Risk Register</h2>
<div class="risk-list">
<div class="risk-item">
<div class="risk-name">Take-and-Pay Conversion (HFO Plants)</div>
<div class="risk-desc">The government, under IMF pressure, is converting legacy take-or-pay IPP contracts to take-and-pay structures where only dispatched electricity is paid for. For HFO plants (NPL, NCPL) that operate at 15 to 20% capacity factors due to their last-place EMO ranking, a full take-and-pay conversion would eliminate 80 to 85% of current guaranteed revenue. This is an existential risk for pure HFO annuity businesses that have no diversification mechanism. Each individual negotiation is a binary outcome &mdash; continuation or conversion &mdash; and the timeline for resolution creates prolonged uncertainty that discounts valuations.</div>
</div>
<div class="risk-item">
<div class="risk-name">Circular Debt Rebuilding</div>
<div class="risk-desc">The September 2025 Rs1.225T refinancing cleared the circular debt stock, but it is the fourth such solution in 25 years &mdash; and previous three all resulted in debt rebuilding within 5 years. The structural flow mechanisms remain intact: DISCO losses (actual 16% vs 12% allowed), non-collection (~85 to 90% billing recovery), politically suppressed tariffs, and excess capacity payments. Without DISCO privatisation or tariff rationalisation, circular debt accumulates again as soon as the refinancing facility is drawn down. Any IPP investor must assess whether the September 2025 deal is structural resolution or temporary stock clearance.</div>
</div>
<div class="risk-item">
<div class="risk-name">PPA Renegotiation Uncertainty</div>
<div class="risk-desc">The uncertainty of outcome &mdash; not just the outcome itself &mdash; is a material valuation risk. NPL shares fell 17% in September 2024 without any actual terms changing. Prolonged uncertainty about PPA terms suppresses valuations regardless of eventual outcome because it prevents income investors from forecasting dividend sustainability. The 18 IPPs in various stages of negotiation create multi-year sector-wide uncertainty that will resolve at different times for different companies.</div>
</div>
<div class="risk-item">
<div class="risk-name">IRR Reduction in Renegotiated PPAs</div>
<div class="risk-desc">Even for IPPs that retain some form of contracted payment under renegotiated PPAs, the government has pushed for IRR reductions (from 15% to 12% ROE in earlier rounds, with further reductions in current negotiations). Each percentage point of IRR reduction directly reduces the CPP calculation and therefore all future earnings. Dollar-indexation delinking adds to long-run earnings reduction. For legacy IPPs with 10+ years of remaining PPA life, the compounded effect of lower IRR and currency delinking is material.</div>
</div>
<div class="risk-item">
<div class="risk-name">LPI Waiver at Settlement</div>
<div class="risk-desc">Late Payment Interest (LPI) accrued on overdue CPPA-G receivables was a large income source for IPPs during the high-rate, high-delay era (2022-24). Rs387B of LPI was waived in the September 2025 settlement &mdash; a direct earnings hit in the settlement period. As circular debt reduces and payment patterns normalise, future LPI accruals will be significantly lower than the 2022-24 peak, removing a historical income source that investors had incorporated into earnings expectations.</div>
</div>
<div class="risk-item">
<div class="risk-name">2027 PPA Expiry (KAPCO)</div>
<div class="risk-desc">KAPCO's hybrid 500MW deal runs only to 2027. What happens after is genuinely undefined: further PPA negotiation with NEPRA, CTBCM merchant operation, partial plant retirement, or a combination. If CTBCM is not fully operational by 2027 and no further PPA is agreed, KAPCO faces a revenue cliff. The 2027 deadline is firm and creates an increasing risk premium in KAPCO's forward earnings as the date approaches.</div>
</div>
<div class="risk-item">
<div class="risk-name">HUBC Hub Compensation Shortfall</div>
<div class="risk-desc">HUBC accepted Rs36.5B in compensation for the Hub plant termination &mdash; approximately Rs20B below its own stated valuation of the plant (Rs56B+). HUBC's management publicly cited coercion and threats of corruption investigations. The compensation shortfall was a direct one-time earnings hit and reduces the capital available for reinvestment in Thar Energy, BYD Pakistan, and E&amp;P. Any investor analysing HUBC's transition must incorporate this below-value realisation as the starting capital for the transformation.</div>
</div>
<div class="risk-item">
<div class="risk-name">CTBCM Implementation Risk</div>
<div class="risk-desc">The Competitive Trading Bilateral Contract Market has been "two years from implementation" since 2020. If and when it does operationalise, it restructures the entire sector: IPPs can sell directly to large consumers, DISCOs lose their distribution monopoly, and the guaranteed CPP model phases out. This creates winners (efficient plants with high dispatch economics) and losers (HFO plants in a merchant market). The risk is not just the timing of implementation but whether the transition rules preserve existing PPA commitments or override them.</div>
</div>
</div>
</div>`,
  },
  {
    id: 'monitor',
    label: 'Monitor',
    content: `<div class="section">
<div class="section-label">08 &middot; What to Monitor</div>
<h2>Monitoring Framework</h2>

<div class="monitor-grid">
<div class="monitor-col">
<div class="monitor-head">Monthly</div>
<ul class="monitor-list">
<li><strong style="color:var(--text);">Circular debt stock (CPPA-G reports)</strong> -- Monthly circular debt data from the Ministry of Energy and CPPA-G. Track whether the stock is rebuilding post-September 2025 refinancing. Any uptick above Rs500B signals the structural flow problem is reasserting.</li>
<li><strong style="color:var(--text);">CPPA-G payment releases to IPPs</strong> -- When CPPA-G makes large payment releases, IPPs receive one-time cash inflows that spike quarterly earnings. Track payment announcements and their timing relative to company fiscal quarters.</li>
<li><strong style="color:var(--text);">NEPRA electricity tariff notifications</strong> -- Tariff adjustments affect the revenue flowing into CPPA-G from DISCOs. Higher tariffs reduce circular debt generation; politically suppressed tariffs increase it. Each NEPRA notification has downstream effects on IPP cash flow timing.</li>
<li><strong style="color:var(--text);">System capacity factor data</strong> -- National power generation statistics (published by NTDC) show actual dispatch patterns. Plants running at low capacity factors under take-or-pay are most vulnerable to conversion. Track HFO plant dispatch frequency as an indicator of EMO pressure.</li>
<li><strong style="color:var(--text);">KIBOR rate (SBP)</strong> -- KIBOR affects IPP financing costs during circular debt delays (overdraft at KIBOR+) and LPI accrual rate on overdue receivables. The SBP rate cycle directly influences IPP net income timing.</li>
</ul>
</div>
<div class="monitor-col">
<div class="monitor-head">Quarterly</div>
<ul class="monitor-list">
<li><strong style="color:var(--text);">IPP financial results</strong> -- Key derivations: CPP receipts vs CPP accrued (the collection rate); LPI accrued vs LPI received; financing charges (overdraft during circular debt delays); energy payment receipts; and any exceptional items from PPA settlement or compensation receipt.</li>
<li><strong style="color:var(--text);">Receivables aging analysis</strong> -- From company balance sheets, track trade receivables and their age. Growing receivables signal circular debt delays; rapidly declining receivables signal payment releases. The absolute level of receivables as a multiple of quarterly revenue indicates financing risk.</li>
<li><strong style="color:var(--text);">Borrowings and overdraft levels</strong> -- IPPs finance working capital through overdraft when CPPA-G delays payments. Rising short-term borrowings indicate circular debt pressure; declining borrowings indicate normalisation. For small IPPs (NCPL), overdraft as a share of assets is a key solvency indicator.</li>
<li><strong style="color:var(--text);">HUBC Thar Energy progress</strong> -- Each quarter, track Thar Energy's construction milestones, commissioning timeline, and any first-power announcements. When Thar Energy reaches commercial operations, it becomes HUBC's primary earnings growth driver.</li>
<li><strong style="color:var(--text);">Dividend announcements</strong> -- IPP dividend decisions are the most direct signal of management confidence in receivables collection. Dividend cuts or deferrals signal cash flow stress; maintained or increased dividends (like HUBC's Rs20.7B in 2024 despite Hub termination) signal financial stability.</li>
</ul>
</div>
<div class="monitor-col">
<div class="monitor-head">Event-Driven</div>
<ul class="monitor-list">
<li><strong style="color:var(--text);">PPA renegotiation announcements</strong> -- Any government, NEPRA, or company announcement about PPA terms, termination, or conversion is the highest-impact event for individual IPP valuations. These are announced unpredictably. Track Ministry of Energy press releases, NEPRA orders, and company PSX notifications simultaneously.</li>
<li><strong style="color:var(--text);">Circular debt refinancing deals</strong> -- Large-scale government circular debt settlements (like September 2025) create one-time large cash inflows for all listed IPPs. These are announced by the Ministry of Finance and Ministry of Energy. Track both the amount and the allocation across IPPs when revealed.</li>
<li><strong style="color:var(--text);">IMF programme reviews</strong> -- Each IMF review mission includes assessment of circular debt progress and PPA renegotiation milestones. IMF review outcomes (completion or delay) directly affect the pace of structural changes that determine IPP earnings.</li>
<li><strong style="color:var(--text);">CTBCM implementation milestones</strong> -- NEPRA CTBCM notifications, market operator updates, and first bilateral contract announcements. Each step toward CTBCM operationalisation changes the context for post-PPA IPP revenue planning.</li>
<li><strong style="color:var(--text);">HUBC Thar Energy first-power / COD</strong> -- When Thar Energy announces first power generation or commercial operations date (COD), it triggers revenue recognition for HUBC's single largest growth asset. This is a binary, high-impact event for HUBC's forward earnings.</li>
<li><strong style="color:var(--text);">KAPCO post-2027 PPA decision</strong> -- Any NEPRA or government announcement about KAPCO's arrangement post-2027 (further PPA, CTBCM designation, retirement) is the defining event for KAPCO's long-term earnings trajectory.</li>
<li><strong style="color:var(--text);">NPL / NCPL take-and-pay notifications</strong> -- Any government or NEPRA notification converting NPL or NCPL from take-or-pay to take-and-pay would be the most negative single event for those two companies. Monitor NEPRA's published Power Acquisition Plans and any press coverage of IPP-specific renegotiation outcomes.</li>
</ul>
</div>
</div>

<div class="divider"></div>
<h2>Important Dates &amp; Timeline</h2>
<div class="tl-item"><div class="tl-when">Monthly</div><div class="tl-what">Circular debt stock data from Ministry of Energy. NTDC generation statistics (dispatch by plant/fuel). SBP KIBOR rate announcements. NEPRA tariff notifications as issued.</div></div>
<div class="tl-item"><div class="tl-when">Quarterly (results)</div><div class="tl-what">IPP financial results (HUBC reports June year-end; KAPCO, NPL, NCPL report June year-end). Key focus: CPP collection rate, LPI accrual vs receipt, overdraft level, and receivables aging.</div></div>
<div class="tl-item"><div class="tl-when">Per IMF review schedule</div><div class="tl-what">IMF Extended Fund Facility review missions (typically every 3-6 months). Each review includes power sector structural benchmarks. Successful completion unlocks tranche disbursement and signals continued government commitment to PPA reform pace.</div></div>
<div class="tl-item"><div class="tl-when">As announced (PPA outcomes)</div><div class="tl-what">Individual IPP PPA renegotiation outcomes are announced by companies via PSX notifications and simultaneously by government press releases. No advance schedule is published. These are the highest-impact events for specific company valuations.</div></div>
<div class="tl-item"><div class="tl-when">CY2026 onward</div><div class="tl-what">Thar Energy commissioning timeline &mdash; HUBC has guided toward near-term commercial operations for TEL. First-power announcement and COD are key monitoring events that restructure HUBC's earnings profile when they occur.</div></div>
<div class="tl-item"><div class="tl-when">2027</div><div class="tl-what">KAPCO's current 500MW hybrid PPA expires. Post-2027 arrangements must be determined before this date &mdash; expect NEPRA review, government negotiation, or CTBCM designation process to begin 12-18 months ahead of expiry.</div></div>
<div class="tl-item"><div class="tl-when">2025-2028 (rolling)</div><div class="tl-what">18 IPPs in various stages of take-and-pay conversion discussions. Resolution timelines are staggered and unpredictable. Each company's specific outcome will emerge on a different schedule as negotiations complete.</div></div>
<div class="tl-item"><div class="tl-when">CTBCM (date uncertain)</div><div class="tl-what">Full operationalisation of the competitive wholesale electricity market has been delayed since 2020. When implemented, it restructures all post-PPA IPP revenue frameworks. Track NEPRA CTBCM market operator announcements for actual implementation milestones.</div></div>
</div>`,
  },
  {
    id: 'glossary',
    label: 'Glossary',
    content: `<div class="section">
<div class="section-label">09 &middot; Glossary</div>
<h2>Key Terms</h2>
<div class="glo-grid">
<div class="glo-item"><div class="glo-term">IPP (Independent Power Producer)</div><div class="glo-def">A private company that owns and operates a power plant and sells electricity to a government-designated buyer (CPPA-G in Pakistan) under a long-term Power Purchase Agreement. In Pakistan there are 40+ IPPs, of which approximately 10 are PSX-listed. They do not sell to the open market. Their revenue is derived entirely from the government buyer under contractual terms negotiated decades ago.</div></div>
<div class="glo-item"><div class="glo-term">PPA (Power Purchase Agreement)</div><div class="glo-def">The 25 to 30 year contract between an IPP and CPPA-G defining tariff structure, payment terms, fuel pass-through mechanisms, and termination conditions. The PPA is the IPP's entire business. Every financial analysis starts with its structure: what is guaranteed, who bears what risk, how returns are calculated, and what happens at expiry or termination.</div></div>
<div class="glo-item"><div class="glo-term">CPP (Capacity Purchase Price)</div><div class="glo-def">The fixed monthly payment to an IPP for making its plant available &mdash; regardless of how much electricity is actually dispatched. Covers fixed O&amp;M, debt service, and return on equity. The "take-or-pay" guarantee. CPP is the primary earnings driver for all Pakistani IPPs and the primary source of fiscal strain (Rs2.1T/year in CY2024 on idle capacity).</div></div>
<div class="glo-item"><div class="glo-term">EPP (Energy Purchase Price)</div><div class="glo-def">The variable payment per kWh of electricity actually generated and dispatched. Covers fuel cost (fully passed through &mdash; IPP has zero fuel price risk) plus variable O&amp;M. The IPP earns only the variable O&amp;M margin from EPP &mdash; the thin operational profit component. Under take-or-pay, EPP is secondary to CPP in earnings terms.</div></div>
<div class="glo-item"><div class="glo-term">Take-or-Pay</div><div class="glo-def">Contract structure where CPPA-G must pay capacity charges regardless of whether power is dispatched. Guarantees the IPP's capacity payment. Pakistan's old PPA model for 1994 and 2002 policy IPPs. Creates massive financial burden when installed capacity greatly exceeds demand &mdash; Pakistan pays for 28,000 MW of idle capacity at Rs2.1T/year.</div></div>
<div class="glo-item"><div class="glo-term">Take-and-Pay</div><div class="glo-def">Contract structure where CPPA-G pays only for electricity actually dispatched. No guaranteed capacity payment. Transfers demand risk to the IPP. A full shift to take-and-pay for HFO plants with 15 to 20% utilisation eliminates the large majority of their current earnings. The core PPA renegotiation demand from government and IMF.</div></div>
<div class="glo-item"><div class="glo-term">Circular Debt</div><div class="glo-def">The accumulated unpaid obligations in Pakistan's power sector. DISCOs owe CPPA-G; CPPA-G owes IPPs and fuel suppliers; government owes DISCOs subsidies for politically mandated below-cost tariffs. Peaked at Rs5.73T in July 2024. Not one creditor owing another &mdash; a system-wide liquidity failure cycling without resolution. Pakistan has cleared this stock four times (1998, 2012, 2020, 2024-2025); it has rebuilt each time because flow mechanisms are unchanged.</div></div>
<div class="glo-item"><div class="glo-term">CPPA-G</div><div class="glo-def">Central Power Purchasing Agency (Guarantee) Limited &mdash; the single buyer for all power in Pakistan. Purchases electricity from all IPPs and GENCOs at NEPRA-determined tariffs, then sells to 10 DISCOs at a pooled price. CPPA-G is the critical node where circular debt originates: when DISCOs don't pay CPPA-G, it cannot pay IPPs, triggering LPI accrual and overdraft financing.</div></div>
<div class="glo-item"><div class="glo-term">DISCO (Distribution Company)</div><div class="glo-def">One of 10 electricity distribution companies covering different geographic regions (LESCO, IESCO, GEPCO, FESCO, MEPCO, PESCO, HESCO, QESCO, TESCO, SEPCO). They receive bulk power from CPPA-G, distribute to end consumers, and collect bills. T&amp;D losses average 16%+ vs 12.21% allowed in tariffs. Collection failures are the primary source of circular debt generation.</div></div>
<div class="glo-item"><div class="glo-term">EMO (Economic Merit Order)</div><div class="glo-def">The dispatch priority list ranking plants by cost of generation (cheapest first): hydro, nuclear, local coal (Thar), imported coal, gas CCGT, gas simple cycle, then HFO at the end. When grid demand is low, only the cheapest plants are dispatched. HFO plants (NPL, NCPL) may run at 5 to 20% capacity factor but still earn full capacity payments under take-or-pay. Under take-and-pay, EMO position determines revenue entirely.</div></div>
<div class="glo-item"><div class="glo-term">LPI (Late Payment Interest)</div><div class="glo-def">Interest charged by IPPs on overdue CPPA-G receivables &mdash; typically KIBOR plus 3 to 4.5% under PPA terms. During Pakistan's high-rate era (KIBOR at 22%), LPI was a massive income stream for IPPs with large overdue receivables. Under the September 2025 refinancing, the government negotiated Rs387B in LPI waivers from IPPs. Must be disaggregated from operating income as it is non-recurring and misleads quarter-level EPS analysis.</div></div>
<div class="glo-item"><div class="glo-term">CCGT (Combined Cycle Gas Turbine)</div><div class="glo-def">A highly efficient power plant design where exhaust heat from gas turbines is recovered and used to drive steam turbines, generating additional electricity from the same fuel. KAPCO operates Pakistan's largest CCGT at 1,600MW. CCGTs have lower heat rates (fuel consumption per kWh) than simple-cycle or HFO plants &mdash; giving them lower dispatch cost and higher EMO ranking. In a take-and-pay world, CCGT efficiency is a structural earnings advantage.</div></div>
<div class="glo-item"><div class="glo-term">CTBCM (Competitive Trading Bilateral Contract Market)</div><div class="glo-def">Pakistan's planned transition to a competitive wholesale electricity market where IPPs can sell directly to large industrial consumers and DISCOs lose their distribution monopoly. NEPRA approved in 2020; market operator licenses issued 2022. Full implementation has been repeatedly delayed. When implemented, it restructures post-PPA IPP revenue from guaranteed CPP to bilateral merchant contracts &mdash; benefiting efficient plants, challenging HFO plants.</div></div>
<div class="glo-item"><div class="glo-term">Dollar Indexation</div><div class="glo-def">The practice of calculating IPP Return on Equity in US dollars and converting to PKR monthly. When PKR depreciates, dollar-indexed IPP returns automatically grow in PKR terms with no operational improvement. The 2002 ECC decision extending dollar indexation to all IPPs (not just foreign-financed ones) is widely considered Pakistan's biggest single power policy error &mdash; creating a structural government liability worth hundreds of billions as the rupee depreciated from Rs60 to Rs280+.</div></div>
<div class="glo-item"><div class="glo-term">HFO (Heavy Fuel Oil)</div><div class="glo-def">A residual fuel oil used by older power plants (NPL, NCPL, original Hub). Expensive per kWh of electricity generated due to low thermal efficiency. HFO-based plants rank last in the EMO and are dispatched only during peak demand when all cheaper alternatives are exhausted. Under take-or-pay, this didn't affect earnings. Under take-and-pay, HFO plants face near-zero revenue as they are rarely dispatched.</div></div>
<div class="glo-item"><div class="glo-term">NEPRA</div><div class="glo-def">National Electric Power Regulatory Authority &mdash; Pakistan's power sector regulator. Determines generation tariffs, approves Power Acquisition Plans, and licenses IPPs. NEPRA sets tariff ceilings that PPAs must adhere to. Its limited capacity to monitor plant performance and verify IPP invoices (heat rate and O&amp;M claims) has been identified as a persistent governance gap in the 2020 government inquiry into excess profits.</div></div>
</div>
</div>`,
  },
  {
    id: 'summary',
    label: 'Summary',
    content: `<div class="section">
<div class="section-label">10 &middot; Executive Summary</div>
<h2>Five Bullets</h2>
<div class="exec-list">
<div class="exec-item">
<div class="exec-num">01</div>
<div class="exec-text"><strong>Sector identity.</strong> Pakistan's IPP sector does not function as a conventional power company. IPPs are annuity businesses: they sell electricity to a single government buyer (CPPA-G) under long-term PPA contracts and earn a guaranteed return regardless of actual dispatch &mdash; under the historic take-or-pay model. The sector's defining structural problem is the mismatch between 41,000 MW installed capacity and 12,500 MW baseload demand, creating Rs2.1T in annual capacity payments on idle plant. The sector is currently undergoing its most consequential restructuring in 30 years: IMF-mandated PPA renegotiations, take-or-pay to take-and-pay conversions, LPI waivers, dollar-indexation delinking, and the September 2025 Rs1.225T circular debt refinancing.</div>
</div>
<div class="exec-item">
<div class="exec-num">02</div>
<div class="exec-text"><strong>Core economics.</strong> IPP revenue has two primary components: CPP (fixed monthly capacity payment &mdash; the take-or-pay annuity that is the primary earnings driver) and EPP (variable energy payment per kWh actually dispatched &mdash; fuel cost pass-through plus thin variable O&amp;M margin). Late Payment Interest (LPI) on overdue CPPA-G receivables has been a significant additional income source during the high-rate, high-delay era (2022-2024) &mdash; Rs387B of accumulated LPI was waived in the September 2025 settlement. The gap between what IPPs are owed and what CPPA-G actually pays on time is the circular debt problem in its most direct earnings form. Dollar-indexed ROE amplifies PKR earnings during currency weakness but is being progressively delinked through renegotiation.</div>
</div>
<div class="exec-item">
<div class="exec-num">03</div>
<div class="exec-text"><strong>Major variables.</strong> In order of earnings impact: (1) circular debt level and CPP payment timing &mdash; the most direct earnings variable, determining overdraft financing costs and one-time inflows when cleared; (2) PPA type (take-or-pay vs take-and-pay) &mdash; for HFO plants, the binary risk that determines whether the business model survives; (3) LPI accrual and settlement &mdash; historically large, now declining as circular debt resolves; (4) PKR/USD exchange rate &mdash; relevant only for dollar-indexed plants, and being removed through renegotiation; (5) EMO position and dispatch rate &mdash; under take-or-pay irrelevant, under take-and-pay the primary revenue determinant; (6) CTBCM implementation &mdash; the long-term structural transition, plant-efficiency dependent.</div>
</div>
<div class="exec-item">
<div class="exec-num">04</div>
<div class="exec-text"><strong>Major risks.</strong> Take-and-pay conversion is the existential risk for HFO-fired plants (NPL, NCPL) &mdash; a full conversion at 15 to 20% capacity factor eliminates 80 to 85% of current guaranteed earnings. Circular debt rebuilding risk is structural: the September 2025 refinancing cleared the stock but did not fix the flow mechanisms (DISCO losses, non-collection, suppressed tariffs), making accumulation likely to resume. PPA renegotiation uncertainty suppresses valuations even before outcomes are determined. For KAPCO, 2027 PPA expiry creates a firm earnings cliff. For HUBC, Thar Energy commissioning risk and Hub compensation shortfall (Rs20B below stated value) are the primary transition-period risks.</div>
</div>
<div class="exec-item">
<div class="exec-num">05</div>
<div class="exec-text"><strong>What makes companies different.</strong> <strong>HUBC</strong>: the only listed IPP that accepted a fundamental transformation &mdash; Hub plant termination &mdash; and is now building a diversified energy and industrial portfolio through Thar Energy (local coal, high EMO ranking), Laraib hydro, BYD Pakistan, and E&amp;P. Near-term earnings are transitional; the long-term story is diversification premium as new assets mature. <strong>KAPCO</strong>: CCGT technology gives Pakistan's most thermally efficient listed thermal plant &mdash; the highest EMO ranking among legacy thermal IPPs. The 500MW hybrid deal through 2027 provides near-term earnings visibility; the post-2027 arrangement is the primary unresolved strategic question. <strong>NPL and NCPL</strong>: pure HFO annuity businesses whose entire earnings model depends on take-or-pay terms surviving PPA renegotiation. NCPL's 10.44% yield is the market's explicit pricing of that risk premium vs the sector's more differentiated companies.</div>
</div>
</div>
<div class="note warn" style="margin-top:24px;">This module is based on publicly available secondary sources including company financial disclosures (PSX filings), NEPRA determinations, government circulars, ADB and IEEFA research on Pakistan's power sector, Dawn and Business Recorder reporting, and broker research (Topline Securities, PACRA). It does not constitute investment advice. No buy, sell, or hold recommendations are made or implied. The power sector regulatory environment is highly subject to change; all PPA terms, circular debt figures, and renegotiation outcomes should be verified against current company disclosures and NEPRA publications before use.</div>
</div>`,
  },
  {
    id: 'interpret',
    label: 'Interpret',
    content: `<div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">What Most People Miss</h2>
    <p class="deep-intro">Five non-obvious realities, structural mechanics, and common misreadings that shape how this sector actually works — and why surface-level readings of headlines and results often lead to incorrect conclusions.</p>
    <div class="miss-grid">
      <div class="miss-item">
        <div class="miss-num">01 ·</div>
        <div class="miss-title">LPI Accrued Is Not LPI Received — Cash EPS Differs Materially</div>
        <div class="miss-body">Late Payment Interest (LPI) is earned on overdue receivables from CPPA-G. Companies accrue LPI as revenue when earned — but collect it only when CPPA-G actually pays. In quarters when payment is delayed, LPI accrues into receivables without any cash impact. Reported EPS includes this accrual; cash EPS does not. Companies with large accrued LPI balances that are never collected have systematically overstated earnings relative to their cash generation. The ratio of LPI received vs LPI accrued over time is the most important earnings quality indicator in the sector.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">02 ·</div>
        <div class="miss-title">Take-and-Pay PPAs Can Produce Zero Energy Revenue in a Quarter</div>
        <div class="miss-body">Most IPP contracts include a Capacity Payment (CPP) for making capacity available and an Energy Payment (EPP) for actual electricity produced. Under take-and-pay structures (like KAPCO's hybrid post-2017 arrangement), the company only earns the energy component when NEPRA actually dispatches the plant. In quarters when NTDC does not dispatch the plant (due to merit order or low demand), energy revenue is zero — but the Capacity Payment is still due. Analysts who assume energy income flows quarterly regardless of dispatch are systematically wrong for take-and-pay plants.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">03 ·</div>
        <div class="miss-title">Circular Debt Refinancing Is Not Resolution</div>
        <div class="miss-body">The government's circular debt 'solutions' have repeatedly involved converting IPP receivables into bonds (CPPA-G Sukuk, Energy Sukuk) rather than paying cash. From an IPP's perspective, this replaces a receivable with a bond — but the bond may be at below-market rates, may not be immediately tradeable, and the underlying flow problem (DISCO under-recovery of tariffs) continues accumulating new circular debt. After refinancing, the circular debt stock appears to fall but resumes growing because the structural cause — tariff gaps — is not addressed.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">04 ·</div>
        <div class="miss-title">HUBC's Hub Plant Termination Sets a Precedent for Below-Fair-Value Compensation</div>
        <div class="miss-body">The government terminated HUBC's Hub plant PPA at Rs36.5 billion compensation — significantly below HUBC's claimed fair value of over Rs56 billion. This precedent is directly relevant to every other IPP PPA that may be renegotiated or terminated. The negotiating outcome for HUBC establishes both the government's willingness to contest fair value and its ability to pressure listed IPPs into below-NAV settlements. Any analysis of KAPCO or NPL's future PPA renegotiation should factor in this precedent.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">05 ·</div>
        <div class="miss-title">NTDC Capacity Factor Data Reveals Which Plants Are Actually Running</div>
        <div class="miss-body">The aggregate circular debt figure and IPP earnings cannot be understood without knowing which plants are actually being dispatched. NTDC publishes generation data showing actual capacity utilisation by plant type. HFO plants (NPL, NCPL) run at the bottom of the merit order — only dispatched when gas and coal plants are insufficient. In periods of high gas supply or low demand, HFO plants generate minimal energy revenue despite having capacity payments. The capacity factor — actual generation as a percentage of installed capacity — is the most critical operating metric and is publicly available but rarely tracked by retail observers.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Short-Cycle vs Long-Cycle Drivers</h2>
    <p class="deep-intro">Different variables operate on completely different time horizons. Conflating near-term noise with structural change is one of the most common analytical errors in sector research.</p>
    <div class="cycle-grid">
    <div class="cycle-col">
      <div class="cycle-header" style="color:#4a8fd4">NEAR TERM · 0–3 months</div>
      <div class="cycle-title">Quarterly EPS Drivers</div>
      <div class="cycle-item"><span class="cycle-driver">CPPA-G payment release timing</span>Cash received from CPPA-G in a given quarter determines cash EPS; large payments arriving before quarter-end spike earnings even if accrual-based EPS is smooth.</div><div class="cycle-item"><span class="cycle-driver">LPI collection vs accrual</span>LPI received in the quarter is a direct cash earnings contribution; LPI accrued but uncollected is reported income without cash backing.</div><div class="cycle-item"><span class="cycle-driver">KIBOR on overdraft</span>IPPs finance working capital via overdraft during circular debt delays; KIBOR directly determines the cost of this involuntary financing.</div><div class="cycle-item"><span class="cycle-driver">HFO dispatch rate (NPL, NCPL)</span>Low merit-order plants earn energy revenue only when dispatched; a cold winter or high industrial demand can spike HFO dispatching and energy income.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#6aad6a">MEDIUM TERM · 3–18 months</div>
      <div class="cycle-title">Structural Cash Flow Signals</div>
      <div class="cycle-item"><span class="cycle-driver">Circular debt stock trajectory</span>Rising stock signals worsening payment environment; falling stock (genuine reduction, not refinancing) signals improving cash flow normalisation.</div><div class="cycle-item"><span class="cycle-driver">NEPRA tariff notification</span>Upward tariff adjustments for DISCOs reduce the per-unit loss that generates new circular debt; each notification improves the structural flow problem marginally.</div><div class="cycle-item"><span class="cycle-driver">HUBC Thar Energy construction progress</span>Each construction milestone updates the timeline for when HUBC's primary growth asset begins generating earnings; COD announcement triggers revenue recognition.</div><div class="cycle-item"><span class="cycle-driver">IMF programme review circular debt conditions</span>IMF review outcomes determine whether the government maintains pressure on tariff rationalisation and DISCO losses — the primary structural cause of circular debt.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#c8a96e">STRUCTURAL · 18 months+</div>
      <div class="cycle-title">Decade-Scale Determinants</div>
      <div class="cycle-item"><span class="cycle-driver">CTBCM (Competitive Trading Bilateral Contract Market) implementation</span>A functioning competitive electricity market would allow IPPs to sell beyond their PPA counterparty; whether CTBCM reaches operational status determines the post-PPA earnings model.</div><div class="cycle-item"><span class="cycle-driver">KAPCO 2027 PPA expiry outcome</span>Renewal terms, merchant operation, or partial retirement will define KAPCO's earnings trajectory for the next decade; all options carry materially different earnings profiles.</div><div class="cycle-item"><span class="cycle-driver">DISCO privatisation and DISCO financial recovery</span>If DISCOs are privatised and financially strengthened, they pay IPPs reliably — eliminating the circular debt problem structurally. This is a decade-scale scenario.</div><div class="cycle-item"><span class="cycle-driver">EV and grid demand growth</span>Growing electricity consumption driven by electrification of transport and industry could absorb excess capacity and support merit-order improvements for HFO plants over time.</div>
    </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Sector Interconnections</h2>
    <p class="deep-intro">How this sector connects to the broader macroeconomic and policy environment — and which transmission mechanisms are fastest, strongest, and most frequently misunderstood.</p>
    <div class="connect-grid">
      <div class="connect-card">
        <span class="connect-icon">📉</span>
        <div class="connect-title">Interest Rates</div>
        <div class="connect-body">Dual transmission. First, KIBOR directly determines the cost of IPP overdraft financing during circular debt delays; a rate cut from 22% to 13% materially reduces this involuntary financing cost. Second, lower rates reduce the LPI rate earned on overdue receivables — a counterintuitive negative effect for IPPs with large accrued LPI. The net effect depends on each company's overdraft vs LPI balance ratio.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">💱</span>
        <div class="connect-title">Currency (PKR/USD)</div>
        <div class="connect-body">Moderate direct effect for most IPPs, as PPAs are PKR-denominated. However, HFO fuel costs for NPL and NCPL are USD-indexed; PKR depreciation raises fuel costs without a corresponding revenue increase (revenue is PKR-fixed). For HUBC, the BYD Pakistan JV creates an indirect USD exposure through vehicle import economics. Overall, PKR is less directly important for power IPPs than for E&P or textile companies.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">⚡</span>
        <div class="connect-title">Electricity Demand and Grid Utilisation</div>
        <div class="connect-body">IPP capacity payments are not demand-dependent — they are paid for availability. But energy payments are demand-dependent. Higher grid demand (industrial recovery, hot summer, cold winter) increases dispatch of all plants including lower-merit-order HFO plants. NTDC data on actual system demand is therefore a leading indicator of energy payment revenue for NPL and NCPL specifically.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏛️</span>
        <div class="connect-title">Government Policy</div>
        <div class="connect-body">The overwhelmingly dominant factor. PPA terms (including the capacity payment mechanism) are government contracts. NEPRA tariff notifications determine DISCO revenue. CPPA-G payment schedules are government decisions. Circular debt refinancing structures are Finance Ministry designs. IMF programme conditionalities shape reform pace. There is virtually no aspect of IPP earnings that is not determined or strongly influenced by government policy decisions.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🔧</span>
        <div class="connect-title">Fuel Prices (HFO, Coal, Gas)</div>
        <div class="connect-body">Fuel cost under most PPAs is a pass-through — the fuel cost is recovered from CPPA-G along with capacity and energy charges. This means fuel price changes do not directly affect IPP profitability under standard PPA structures. The exception is when fuel procurement prices exceed the PPA's reference fuel price (creating an under-recovery), or when government renegotiates PPAs and changes the fuel cost recovery terms. Under CPEC-era PPAs, coal cost pass-through was contested in renegotiations.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Business Model Winners &amp; Losers</h2>
    <p class="deep-intro">Different business model structures within this sector face systematically different conditions. The following describes which model characteristics tend to generate or destroy earnings margin under specific environments — without reference to specific companies as recommendations.</p>
    <div class="model-grid">
      <div class="model-card model-card-up">
        <div class="model-card-title">TENDS TO BENEFIT WHEN — High CPP-to-revenue ratio, low HFO dependence, large LPI balance already collected</div>
        <div class="model-row"><span class="model-condition">Circular debt resolution package</span>Companies with large accumulated receivables receive the largest absolute cash inflows from settlement packages; one-time cash earnings can exceed normal quarterly income.</div><div class="model-row"><span class="model-condition">High dispatch environment</span>Plants with high capacity factors earn energy payments on top of guaranteed capacity payments; merit-order improvements (rising gas prices making coal more competitive) benefit coal plants.</div><div class="model-row"><span class="model-condition">Rate cut cycle</span>Reduces overdraft cost during circular debt delays; companies with high revolving overdraft balances benefit most from KIBOR decline.</div><div class="model-row"><span class="model-condition">Post-PPA transition to merchant (CTBCM)</span>If electricity prices in a market structure are above PPA rates, transitioning plants can earn significantly more per MWh generated.</div>
      </div>
      <div class="model-card model-card-dn">
        <div class="model-card-title">TENDS TO FACE PRESSURE WHEN — High HFO dependence, large overdraft, receivables growing faster than collections</div>
        <div class="model-row"><span class="model-condition">System oversupply and low dispatch</span>HFO plants at the bottom of the merit order run minimally; capacity payments continue but energy revenue collapses — operational leverage works against the plant.</div><div class="model-row"><span class="model-condition">PPA termination at below-NAV compensation</span>As established by the Hub plant precedent, government can terminate contracts at below-fair-value; companies with aging or politically exposed PPAs face this structural risk.</div><div class="model-row"><span class="model-condition">Circular debt buildup without resolution</span>Growing receivables that are not collected create an interest burden (overdraft) while inflating reported earnings (accrual); cash generation diverges from reported earnings over time.</div><div class="model-row"><span class="model-condition">Tariff freeze under political pressure</span>If NEPRA tariff adjustments are politically blocked, DISCOs continue under-recovering, generating new circular debt that flows back as payment delays to IPPs.</div>
      </div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Structural Questions</h2>
    <p class="deep-intro">The major unresolved debates, policy uncertainties, and structural questions that will shape this sector over the next three to seven years. These are not predictions — they are the analytical dimensions that require active monitoring.</p>
    <div class="sq-list">
    <div class="sq-item">
      <div class="sq-q">What is KAPCO's post-2027 earnings model and how is the market pricing it?</div>
      <div class="sq-context">KAPCO's current PPA expires in 2027. Possible outcomes include renewal on renegotiated terms, transition to merchant/competitive market operation under CTBCM, or partial decommissioning. Each has radically different earnings implications. The market appears to price some version of continuation, but the actual terms are unknown. This is the most significant single near-term structural question in the sector.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Is the circular debt problem solvable without electricity tariff increases?</div>
      <div class="sq-context">The structural cause of circular debt is the gap between what DISCOs charge consumers and what it costs to buy and distribute electricity. Subsidised tariffs for residential consumers create this gap. Without either raising consumer tariffs to cost-recovery levels or dramatically reducing the cost of electricity generation, the circular debt will continue to accumulate regardless of refinancing structures. Pakistan has not solved this problem in 15 years.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Will CTBCM reach operational status and create a genuinely competitive electricity market?</div>
      <div class="sq-context">NEPRA has been preparing for CTBCM for years. Implementation has been delayed repeatedly. If it operationalises, IPPs can negotiate bilateral contracts beyond their PPA counterparty — potentially earning more if market prices exceed PPA rates, or less if market prices fall below. The outcome determines whether post-PPA operation is commercially viable for aging plants.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Does the Hub plant termination precedent transfer to other IPP PPAs?</div>
      <div class="sq-context">The government's negotiating position on Hub was that the compensation formula in the PPA applied, not the IPP's fair-value claim. If this interpretation is upheld in subsequent terminations, every listed IPP with an aging or politically targeted PPA faces a compensation ceiling significantly below its claimed asset value. The legal and regulatory precedent from Hub shapes the risk profile of every other listed IPP.</div>
    </div>
    </div>
  </div>`,
  },
  {
    id: 'deeppeers',
    label: 'Deeppeers',
    content: `<div class="deep-section">
    <div class="deep-label">12 · Deep Peer Analysis</div>
    <h2 class="deep-h2">Operator Profiles</h2>
    <p class="deep-intro">A structured characterisation of each major listed company — what type of operator it is, what conditions suit its model, and how it compares analytically to its closest peer. This is not a ranking or recommendation.</p>
    <div class="dpeer-grid">
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#4a8fd4"></div>
        <div class="dpeer-ticker">HUBC</div>
        <div class="dpeer-name">Hub Power Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Transitional conglomerate operator — legacy Hub plant being replaced by Thar Energy coal plant; holds BYD Pakistan EV JV; evolving from single-plant IPP to diversified energy company</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Thar Energy COD + circular debt resolution: the combination of Thar Energy commencing operations and a large CPPA-G payment release creates the maximum earnings acceleration for HUBC</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Thar Energy construction delay + continued Hub plant termination litigation: if Thar Energy is delayed and the Hub compensation dispute is not resolved, HUBC earns below capacity with no near-term earnings growth catalyst</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Balance-sheet-led and policy-led — the timing of circular debt payments and Thar Energy commissioning are more important than any operational variable</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">KAPCO — Both are large-format IPPs with significant transition uncertainty; HUBC's transition is from Hub plant to Thar Energy; KAPCO's transition is from its current PPA structure to post-2027. The comparison reveals different phases of the same structural challenge.</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c8a96e"></div>
        <div class="dpeer-ticker">KAPCO</div>
        <div class="dpeer-name">Kot Addu Power Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Hybrid PPA operator with 2027 existential transition — 500MW T&P hybrid under current PPA; post-2027 earnings model undefined</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">High industrial dispatch + KIBOR decline: in periods of high industrial demand, KAPCO dispatches more of its 1,600MW capacity; KIBOR decline reduces financing costs on circular debt overdraft</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Low dispatch environment + PPA expiry uncertainty: if NTDC does not dispatch KAPCO's units, energy revenue is zero under T&P terms; any announcement of adverse PPA renegotiation creates an immediate valuation event</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Policy-led — the 2027 PPA expiry outcome is the dominant earnings determinant; all other operational variables are secondary to what the post-2027 structure looks like</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">HUBC — Both face a defined transition point; HUBC's transition is relatively near-term and the direction (Thar Energy) is known; KAPCO's transition has no defined direction, making it the more uncertain of the two</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#6aad6a"></div>
        <div class="dpeer-ticker">NPL</div>
        <div class="dpeer-name">Nishat Power Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">HFO-fired, merit-order-exposed operator — dependent on system dispatch for energy revenue; Nishat group linkage</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">High grid demand + HFO merit-order improvement: hot summers or cold winters drive system demand up; any event that raises gas prices enough to bring HFO into merit order improves NPL dispatch frequency</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Gas-abundant, low-demand environment: when gas supply is ample and system demand is low, HFO is dispatched minimally; NPL earns capacity payments but little energy revenue</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led (for energy income) and policy-led (for capacity payments): CPP is guaranteed; EPP depends entirely on dispatch decisions by NTDC that are outside the company's control</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">NCPL — Both are HFO plants with similar merit-order vulnerabilities; the analytical comparison reveals the scale difference and the Nishat vs Crescent group ownership distinction — similar operating risks, different financial structures</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c86e8f"></div>
        <div class="dpeer-ticker">NCPL</div>
        <div class="dpeer-name">Nishat Chunian Power Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">HFO-fired small-IPP operator — smallest in the covered peer group; most financially vulnerable to circular debt delays due to limited balance sheet buffer</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Circular debt resolution + high HFO dispatch: payment releases provide outsized relief for a small balance sheet; high dispatch periods are the only time energy income meaningfully supplements CPP</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Sustained circular debt buildup + low dispatch: overdraft cost relative to equity is highest for NCPL; low dispatch means overdraft covers operating expenses with no energy income to offset</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Balance-sheet-led (survivability) and volume-led (earnings upside) — NCPL's primary risk is solvency during prolonged circular debt delays, not operational performance</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">NPL — Both are small HFO IPPs with near-identical operating risks; NCPL is smaller and therefore more financially exposed to any given payment delay; comparing their relative overdraft-to-equity ratios reveals the differential vulnerability</span></div>
      </div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">12 · Deep Peer Analysis</div>
    <h2 class="deep-h2">Comparative Summary</h2>
    <p class="deep-intro">A condensed analytical reference table for comparing operator characteristics across the peer group.</p>
    <div class="pfinal-wrap">
      <table class="pfinal-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Operator Type</th>
            <th>Best Environment</th>
            <th>Worst Environment</th>
            <th>Core Edge</th>
            <th>Main Vulnerability</th>
          </tr>
        </thead>
        <tbody>
      <tr>
        <td><span class="pfinal-ticker">HUBC</span></td>
        <td>Transitional conglomerate / large IPP</td>
        <td>Thar Energy COD + large CPPA-G payment + BYD EV growth</td>
        <td>Hub litigation unresolved + Thar delay + circular debt buildup</td>
        <td>Thar Energy coal asset, BYD Pakistan JV, dividend track record</td>
        <td>Thar Energy timeline risk, Hub compensation uncertainty</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">KAPCO</span></td>
        <td>Hybrid PPA / 2027 transition</td>
        <td>High industrial dispatch + rate cuts + favorable PPA renewal</td>
        <td>Low dispatch + PPA expiry on adverse terms</td>
        <td>Large installed capacity, government-linked operator</td>
        <td>2027 PPA expiry uncertainty — the entire earnings model may change</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">NPL</span></td>
        <td>HFO merit-order operator</td>
        <td>High system demand + HFO merit-order improvement + payment releases</td>
        <td>Gas surplus + low demand + circular debt buildup</td>
        <td>Nishat group backing, CPP guaranteed regardless of dispatch</td>
        <td>Energy revenue fully dispatch-dependent, HFO at bottom of merit order</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">NCPL</span></td>
        <td>Small HFO IPP / balance-sheet vulnerable</td>
        <td>Circular debt resolution + high HFO dispatch</td>
        <td>Prolonged circular debt delay + low dispatch</td>
        <td>CPP floor on earnings, Nishat Chunian group backing</td>
        <td>Smallest balance sheet; most financially vulnerable to payment delays</td>
      </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  },
  {
    id: 'metrics',
    label: 'Metrics',
    content: `<div class="deep-section">
    <div class="deep-label">13 · Metrics Framework</div>
    <h2 class="deep-h2">Sector-Wide Metrics</h2>
    <p class="deep-intro">Datapoints that describe the state of the entire sector. Useful for contextualising individual company results and identifying whether outperformance is company-specific or sector-driven.</p>
    <div class="metric-card">
      <div class="metric-name">Circular Debt Stock (Rs Billion) — Ministry of Energy</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The cumulative unpaid obligations from DISCO under-recovery, flowing from DISCOs through CPPA-G to IPPs and fuel suppliers</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The primary systemic risk indicator for the sector; its trajectory determines whether the payment environment for IPPs is improving or deteriorating</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Government circular debt announcements often involve refinancing (issuing bonds to clear payables) rather than actual cash payment; a falling headline number may reflect refinancing rather than genuine resolution</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Nature of any 'resolution' package (cash vs bond vs refinancing) and DISCO revenue collection rates (to assess whether the underlying structural cause is improving)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">NTDC Monthly Generation Data by Fuel Type</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">National Transmission and Despatch Company data on actual electricity generated by each fuel type (HFO, gas, coal, hydro, renewable)</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Reveals which plants are actually running and at what capacity factor; HFO plant dispatch frequency is a leading indicator for NPL and NCPL energy revenue</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Aggregate system generation data can mask plant-specific changes; a rise in coal plant generation might mean less HFO dispatch even if total generation is growing</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">CPPA-G payment release announcements (to understand whether high dispatch is generating collectable revenue) and seasonal demand patterns (summer AC load vs winter heating demand)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">NEPRA Tariff Notification and DISCO Revenue Recovery Rate</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The electricity tariff charged to end-consumers and the percentage of billed amounts actually collected by DISCOs</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The structural driver of circular debt generation — if tariffs are below cost-recovery and collection rates are low, circular debt continues accumulating regardless of payment packages</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A tariff increase may be offset by falling collection rates (customers default when prices rise), leaving the revenue recovery amount unchanged — track both tariff level and collection rate together</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Circular debt stock trajectory (to verify whether tariff changes are reducing the accumulation rate) and DISCO financial statements (to assess whether their financial position is improving)</span></div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">13 · Metrics Framework</div>
    <h2 class="deep-h2">Company-Level Metrics</h2>
    <p class="deep-intro">Firm-level metrics that matter most when reading quarterly results and annual filings. For each metric: what it measures, why it matters, when it misleads, and what to read alongside it.</p>
    <div class="metric-card">
      <div class="metric-name">CPP Receipts vs CPP Accrued (Collection Rate)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Capacity Payment actually received in cash divided by Capacity Payment earned and accrued in the period — the cash conversion efficiency of the primary revenue stream</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The most important earnings quality indicator in the sector; a collection rate below 80% means reported earnings significantly overstate cash generation; above 90% indicates normalised payment environment</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A large one-time payment receipt can spike the collection rate in a single quarter, suggesting improvement when the underlying structural rate has not changed; track 4-quarter rolling average</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">LPI accrual and receipt (as a confirmation of the overall receivable collection environment) and overdraft balances (to verify whether low collection rate is being funded by bank debt)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">LPI Accrued vs LPI Received</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Late Payment Interest earned on overdue receivables (accrual basis) versus LPI actually collected in cash during the period</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">LPI accrued inflates reported earnings without cash backing; LPI received represents real cash income; the gap between them quantifies the earnings quality risk in any given quarter</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A quarter with high LPI received (perhaps from a large payment release) can look like exceptional earnings when it is simply the collection of previously accrued but uncollected interest — not a trend improvement</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Total receivable aging (to assess whether the LPI accrual base is growing, signalling worsening collection) and subsequent quarter LPI receipts (to see whether collection is consistent or lumpy)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Overdraft and Short-Term Borrowings Level</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Short-term bank borrowings used to finance working capital gap created by CPPA-G payment delays</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Rising overdraft indicates circular debt pressure and involuntary debt financing; for small IPPs (NCPL), overdraft relative to equity signals financial stress that may threaten dividend sustainability</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A sudden drop in overdraft can reflect either genuine CPPA-G payment collection or refinancing of overdraft into longer-term debt — track the full liability side of the balance sheet, not just overdraft in isolation</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Cash and equivalents (to assess net position) and KIBOR (to calculate the cost of overdraft financing as a percentage of quarterly CPP income)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Thar Energy Construction Milestones (HUBC specific)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Progress against the commissioning timeline for HUBC's 1,320MW Thar coal plant — percentage completion, civil works status, equipment delivery, first synchronisation</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Thar Energy is HUBC's primary earnings growth catalyst; each milestone update revises the timeline to when the new CPP stream begins; delays directly defer the earnings uplift</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Management guidance on timelines is consistently optimistic in infrastructure projects; cross-reference with CPPA-G registration status, NTDC interconnection progress, and coal supply logistics readiness</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">HUBC quarterly results (existing plant revenue trend to understand baseline earnings pre-Thar) and coal supply arrangements (to assess whether fuel logistics are ready for commercial operations)</span></div>
    </div>
  </div>`,
  }
  ],
};

export default sector;

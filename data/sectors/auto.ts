// data/sectors/auto.ts
// Auto-generated from pakistan_auto_sector_module.html
// Content: 13 tabs of sector intelligence for the Autos sector.

import type { SectorData } from "./types";

const sector: SectorData = {
  slug: 'auto',
  name: 'Automobile',
  volume: 'Sector Intelligence Module · Volume VI',
  subtitle: "A structured analytical framework covering how Pakistan's listed automakers and assemblers generate earnings, what drives volumes and margins, and how PSMC, INDU, ATLH, and HCAR differ structurally.",
  accentColor: '#e07b54',
  stats: [
  { val: '173,781', lbl: 'Cars Sold CY25 (+40% YoY)' },
  { val: '1.5M+', lbl: 'ATLH Motorcycle Capacity/yr' },
  { val: '46.7%', lbl: 'PSMC Market Share (Cars)' },
  { val: '65%+', lbl: 'ATLH Motorcycle Mkt Share' },
  { val: '94%', lbl: 'Households Without a Car' }
  ],
  tabs: [
  {
    id: 'overview',
    label: 'Overview',
    content: `<div class="section">
    <div class="section-label">01 · Sector Overview</div>
    <h2>What the Sector Does</h2>
    <p>Pakistan's auto sector is fundamentally an assembly-led, policy-protected industry. With one critical exception — Atlas Honda motorcycles — no Pakistani assembler manufactures complete vehicles from raw materials. They import knocked-down kits from parent companies in Japan, South Korea, or China, assemble locally, and sell to Pakistani consumers at prices that include the full burden of import duties, taxes, and assembly costs.</p>
    <p>The sector spans two structurally different sub-markets: passenger cars (PSMC, INDU, HCAR, SAZEW) and motorcycles (ATLH). These two businesses have different cost structures, customer profiles, FX exposures, interest rate sensitivities, and earnings profiles. Analysing them together without acknowledging this distinction produces flawed conclusions.</p>

    <div class="inline-note">
      ⚠ Pakistan has 24 registered car manufacturers but sells only 140,000–175,000 cars annually — compared to India's 4 million and Thailand's 1.5 million. The market is too small for scale economies, which keeps prices high, which keeps penetration low. 94% of Pakistani households do not own a car. This structural paradox is the sector's defining feature.
    </div>

    <div class="divider"></div>

    <h3>Why It Matters on PSX</h3>
    <p>Auto sector companies represent a meaningful component of PSX by market capitalisation. ATLH in particular — with a 10-year PAT CAGR of 21% — is one of the PSX's most consistent compounders. INDU provides extraordinary earnings leverage to Pakistan's rate cycle: its PAT jumped 75% in 9MFY25 as rates fell from 22% to 10.5%. The sector is a direct proxy for consumer credit conditions, PKR/JPY exchange rates, and government trade policy simultaneously.</p>

    <h3>Main Listed Players Covered</h3>
    <div class="bar-chart">
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text3);margin-bottom:16px;">Car Market Share by Volume — CY25</div>
      <div class="bar-row">
        <div class="bar-label">PSMC</div>
        <div class="bar-track"><div class="bar-fill" style="width:46.7%;background:var(--psmc);"></div></div>
        <div class="bar-val">~46.7% (Alto dominant)</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">INDU</div>
        <div class="bar-track"><div class="bar-fill" style="width:22%;background:var(--indu);"></div></div>
        <div class="bar-val">~22% (Corolla, Yaris, Fortuner)</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">HCAR</div>
        <div class="bar-track"><div class="bar-fill" style="width:12%;background:var(--hcar);"></div></div>
        <div class="bar-val">~12% (City, Civic, BR-V)</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">SAZEW</div>
        <div class="bar-track"><div class="bar-fill" style="width:7%;background:var(--sazew);"></div></div>
        <div class="bar-val">~7% (HAVAL H6, growing)</div>
      </div>
      <div class="bar-row">
        <div class="bar-label">Others</div>
        <div class="bar-track"><div class="bar-fill" style="width:12.3%;background:var(--border);"></div></div>
        <div class="bar-val">~12.3% (KIA, Hyundai, etc.)</div>
      </div>
    </div>

    <div class="divider"></div>

    <h3>Two Very Different Sub-Markets</h3>
    <div class="two-col">
      <div class="col-card">
        <div class="col-title"><span class="col-dot" style="background:var(--psmc);"></span>Cars — PSMC, INDU, HCAR, SAZEW</div>
        <ul class="col-list">
          <li>Annual market: ~140,000–175,000 units/yr total</li>
          <li>Customer: upper-middle to high income; Rs3–16M per vehicle</li>
          <li>60–70% of purchases are financed; deeply rate-sensitive</li>
          <li>CKD kits priced in JPY/KRW/CNY — high FX exposure</li>
          <li>Localisation: 40–70% for Japanese brands; 10–35% for Chinese/Korean</li>
          <li>Gross margins: 8–14% with high cyclical variance</li>
          <li>Key risk: used car imports, policy shifts, rising input costs</li>
        </ul>
      </div>
      <div class="col-card">
        <div class="col-title"><span class="col-dot" style="background:var(--atlh);"></span>Motorcycles — ATLH</div>
        <ul class="col-list">
          <li>ATLH capacity: 1.5M+ units/yr; total market ~2.5M units</li>
          <li>Customer: mass market — delivery workers, farmers, students; Rs150,000–250,000</li>
          <li>Primarily cash purchases; minimal interest rate sensitivity</li>
          <li>94.4% localisation on CD70 — effectively a manufacturer, not assembler</li>
          <li>Minimal FX exposure due to high local content</li>
          <li>Gross margins: 10–13%, highly stable across cycles</li>
          <li>10-year PAT CAGR of 21% — exceptional earnings consistency</li>
        </ul>
      </div>
    </div>
  </div>`,
  },
  {
    id: 'economics',
    label: 'Economics',
    content: `<div class="section">
    <div class="section-label">02 · How the Sector Makes Money</div>
    <h2>Revenue Model</h2>
    <p>Pakistan's auto assemblers earn revenue by purchasing CKD (Completely Knocked Down) kits from their parent OEM, assembling vehicles locally, and selling through authorised 3S dealerships at the ex-factory price. The assembler's margin is the difference between the ex-factory price and the landed cost of the CKD kit plus local assembly, overhead, and royalties paid to the parent OEM.</p>
    <p>Revenue recognition occurs at the point of delivery to the dealer. Assemblers do not typically operate dealerships directly — independent franchisee dealers purchase vehicles at ex-factory price and mark up to the retail street price. In high-demand periods, dealers charge booking premiums above ex-factory price, which the assembler does not capture.</p>
    <p>ATLH differs from this model materially. With 94.4% localisation on the CD70, it essentially manufactures in-house — sourcing steel, aluminium, and some imported components, machining parts, and assembling finished motorcycles. It also sells spare parts and engine oil, creating recurring ancillary revenue beyond the initial vehicle sale.</p>

    <div class="divider"></div>

    <h2>Cost Structure</h2>
    <p>For car assemblers, the dominant cost is the CKD kit — which constitutes 60–75% of total cost of goods sold. CKD kits are invoiced by the OEM in the parent currency (JPY for Toyota/Honda/Suzuki), making gross margin highly sensitive to PKR/JPY movements. Other costs include local parts (15–25%), assembly labour, utilities, and plant overhead. These local costs are relatively fixed — providing operating leverage when volumes rise.</p>
    <p>Royalties and technical assistance fees paid to OEM parents typically consume 2–5% of net revenue, representing a structural margin drag that is embedded in the business model and not easily negotiable. ATLH's cost structure is the most favourable: high localisation means minimal currency exposure, and scale across 1.5M units provides cost discipline that smaller car assemblers cannot match.</p>

    <div class="divider"></div>

    <h2>What Expands Earnings</h2>
    <ul class="co-bullets" style="list-style:none;margin-top:0;">
      <li>PKR strengthening vs JPY — directly lowers CKD kit cost in rupee terms, expanding gross margin without any volume change</li>
      <li>SBP rate cuts — lower KIBOR expands the financed buyer pool, driving volume increases and operating leverage</li>
      <li>New model launches — generate pent-up demand, booking queues, and premium pricing from dealers</li>
      <li>Higher localisation — reduces CKD dependency, lowers duties, and compresses input costs over time</li>
      <li>Volume growth — fixed plant overhead spreads over more units, dramatically improving per-unit profitability</li>
      <li>Declining interest on cash surplus (Other Income) — car companies with large advance booking pools earned substantial investment returns at KIBOR 22%</li>
    </ul>

    <div class="divider"></div>

    <h2>What Compresses Earnings</h2>
    <ul class="co-bullets" style="list-style:none;margin-top:0;">
      <li>PKR depreciation vs JPY — each rupee of depreciation inflates CKD cost proportionally; the most volatile earnings driver for INDU and HCAR</li>
      <li>Used car import liberalisation — cheap Japanese used cars (Daihatsu Mira, Toyota Vitz) undercut PSMC's Alto directly, suppressing volume and pricing</li>
      <li>High KIBOR — at 22%, monthly EMI on a Rs5M Corolla exceeded Rs120,000, shutting out the majority of the target buyer pool</li>
      <li>Import restrictions on CKD — government letter-of-credit (LC) controls in FY23 caused severe production disruptions across the sector</li>
      <li>Budget tax changes — WHT shifts (value-based vs engine-size-based), GST increases, and FED changes directly inflate consumer price</li>
      <li>Normalising Other Income — as KIBOR falls from 22% to ~10%, the investment return on advance bookings erodes materially</li>
    </ul>

    <div class="inline-note">
      📌 The auto sector's earnings are best understood as the product of two cycles operating simultaneously: the PKR/JPY exchange cycle (which determines gross margin) and the monetary policy cycle (which determines volume). When both are favourable simultaneously — as in FY25 — earnings surge. When both are adverse simultaneously — as in FY23 — earnings collapse. This double-cycle dynamic makes auto one of the highest-variance sectors on the PSX.
    </div>
  </div>`,
  },
  {
    id: 'variables',
    label: 'Variables',
    content: `<div class="section">
    <div class="section-label">03 · Key Variables to Track</div>
    <h2>Variables That Move Earnings</h2>
    <p>Eight variables account for the majority of quarterly EPS variance across Pakistan's listed auto companies. These are the figures analysts track monthly and quarterly to build earnings models.</p>

    <div class="tbl-wrap">
      <table class="var-table">
        <thead>
          <tr>
            <th style="width:200px;">Variable Name</th>
            <th>What It Is &amp; Why It Matters</th>
            <th style="width:160px;">Earnings Impact ↑</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="3" class="vgroup">MONETARY &amp; FX VARIABLES</td></tr>
          <tr>
            <td><span class="vname">SBP Policy Rate (KIBOR)</span></td>
            <td>The benchmark rate that determines auto financing EMIs. At KIBOR 22%, a Rs5M Corolla carried a monthly EMI exceeding Rs120,000 — unaffordable for most buyers. At KIBOR 10.5%, the same EMI falls to ~Rs90,000, opening the buyer pool dramatically. 60–70% of all car purchases in Pakistan are financed. Rate cuts in FY25 from 22% to 10.5% drove INDU's PAT up 75%. ATLH is largely immune as motorcycle purchases are predominantly cash.</td>
            <td class="impact-up">↑ Positive<br><span style="color:var(--text3);font-size:11px;">Very high for PSMC, INDU, HCAR, SAZEW. Minimal for ATLH.</span></td>
          </tr>
          <tr>
            <td><span class="vname">PKR/JPY Exchange Rate</span></td>
            <td>CKD kits for Toyota, Honda, and Suzuki are invoiced in Japanese Yen. When PKR weakens vs JPY, CKD costs rise proportionally in rupee terms, compressing gross margin with no volume change. INDU's GP margin fell to low single digits in FY23 and recovered to 12.71% in CY24 primarily because the JPY weakened globally while PKR stabilised. ATLH's 94% localisation means this variable has minimal impact on its margins.</td>
            <td class="impact-down">↓ Positive (PKR/JPY fall = lower kit cost = better margin)<br><span style="color:var(--text3);font-size:11px;">Critical for INDU, HCAR. High for PSMC. Negligible for ATLH.</span></td>
          </tr>
          <tr>
            <td><span class="vname">Other Income (Investment Returns)</span></td>
            <td>Car assemblers maintain large advance booking deposits and working capital reserves. At KIBOR 22%, investing these in T-bills earned extraordinary risk-free returns — INDU's Other Income contributed Rs3–5B annually during peak rates. As rates fall, this income stream normalises. Companies that earned Rs5–8/share in Other Income during peak rates will see Rs2–3/share erosion as rates continue declining, partially offsetting the volume and margin gains from rate cuts.</td>
            <td class="impact-down">↓ Positive (lower rates reduce this income)<br><span style="color:var(--text3);font-size:11px;">Material for INDU and ATLH. Moderate for PSMC, HCAR.</span></td>
          </tr>
          <tr><td colspan="3" class="vgroup">VOLUME &amp; DEMAND VARIABLES</td></tr>
          <tr>
            <td><span class="vname">PAMA Monthly Volumes</span></td>
            <td>Pakistan Automotive Manufacturers Association publishes monthly production and sales data by company and model, released around the 10th of each subsequent month. This is the primary real-time indicator analysts watch. Fixed cost leverage means volume growth translates to disproportionately large earnings gains — a 10% volume increase can drive 20–30% PAT improvement when operating leverage is high. PSMC sold ~65,000 cars in FY25 vs ~46,000 in FY24 — a 41% volume jump that drove exceptional earnings recovery.</td>
            <td class="impact-up">↑ Positive<br><span style="color:var(--text3);font-size:11px;">Very high for all car assemblers. Positive but steadier for ATLH.</span></td>
          </tr>
          <tr>
            <td><span class="vname">New Model Launches</span></td>
            <td>New model introductions generate pent-up demand, advance bookings, and dealer waiting lists that allow premium pricing over ex-factory price. A successful launch can add 500–2,000 incremental monthly units for 12–18 months. INDU's Corolla Cross HEV launch in December 2023 sustained volumes through a weak market. SAZEW's HAVAL H6 PHEV launch in August 2025 drove 73% YoY volume growth the following month. Model timing is a key differentiator between assemblers.</td>
            <td class="impact-up">↑ Positive<br><span style="color:var(--text3);font-size:11px;">Significant short-term catalyst for all assemblers. Particularly powerful for INDU and SAZEW.</span></td>
          </tr>
          <tr><td colspan="3" class="vgroup">COST &amp; POLICY VARIABLES</td></tr>
          <tr>
            <td><span class="vname">Localisation Level</span></td>
            <td>The percentage of vehicle content manufactured locally by value or parts count. Higher localisation = lower CKD import duty exposure, lower FX risk, and eligibility for AIDEP duty concessions on remaining imported components. ATLH's CD70 has 94.4% localisation; INDU's Corolla is 40–60% by value; SAZEW's HAVAL is 10–35%. AIDEP policy rewards companies that achieve defined localisation thresholds with reduced duty on remaining CKD components. Each 5% increase in value localisation can reduce per-unit cost by Rs100,000–200,000.</td>
            <td class="impact-up">↑ Positive<br><span style="color:var(--text3);font-size:11px;">Structural for ATLH. Medium-term driver for INDU, PSMC. Low near-term impact for SAZEW/HCAR.</span></td>
          </tr>
          <tr>
            <td><span class="vname">Used Car Import Volume &amp; Policy</span></td>
            <td>Used car imports from Japan — particularly sub-1,300cc kei cars (Daihatsu Mira, Toyota Vitz) — are the single biggest competitive threat to PSMC's Alto and INDU's lower-spec models. In FY24, used imports surged 435% following policy liberalisation, contributing to volume collapse at local assemblers. Policy swings frequently — the government balances revenue (import duties), consumer affordability, and OEM pressure. SRO 499 of 2024 withdrew HEV import duty exemptions within a year, protecting INDU's Corolla Cross HEV. ATLH's motorcycle business is completely unaffected by car import dynamics.</td>
            <td class="impact-down">↓ Positive (lower imports = better volume for assemblers)<br><span style="color:var(--text3);font-size:11px;">Very high for PSMC, INDU. Moderate for HCAR, SAZEW. Zero for ATLH.</span></td>
          </tr>
          <tr>
            <td><span class="vname">Budget Tax Structure (WHT, GST, FED)</span></td>
            <td>Vehicles face a complex tax stack: Withholding Tax (shifted from engine-size to value-based in Finance Bill 2024-25), General Sales Tax (17%), Federal Excise Duty (on larger engines), and a Rs3M SBP financing cap. Finance Act changes can add Rs25,000–200,000 to effective consumer cost per vehicle and are among the least predictable EPS variables. The WHT shift to value-based calculation in FY25 added meaningful cost burden on mid-priced cars. Tax credits for EV/HEV investment are also tracked for ATLH's ICON e development.</td>
            <td class="impact-down">↓ Positive (lower tax burden on consumers = higher demand)<br><span style="color:var(--text3);font-size:11px;">Highly unpredictable. All assemblers exposed. Most acute for PSMC (volume-dependent).</span></td>
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
    <div class="section-label">04 · Industry Structure</div>
    <h2>Competitive Landscape</h2>
    <p>Pakistan's car market is a protected oligopoly. Three Japanese brands — Suzuki (via PSMC), Toyota (via INDU), and Honda (via HCAR) — have dominated for three decades behind high tariff walls. Chinese and Korean entrants (KIA, Hyundai, SAZEW/HAVAL, MG, Proton) gained footholds under AIDEP 2021-26 new-entrant concessions but collectively hold less than 20% market share. No local assembler has achieved a globally competitive cost structure.</p>
    <p>The motorcycle market is even more concentrated. ATLH holds 65%+ market share — a dominance built on the CD70's status as Pakistan's de facto rural transport solution for 60+ years. Chinese motorcycle brands have repeatedly attempted entry on price and repeatedly lost on quality perception.</p>

    <div class="divider"></div>

    <h3>The CKD Tariff Wall — The Industry's Core Protection</h3>
    <p>The entire local assembly model rests on one policy: import duties on completely built units (CBU) are dramatically higher than on CKD parts. This tariff differential is what makes local assembly economically rational. CBU new vehicles face customs duty of 20–25% plus regulatory duty of 15–90% (higher for above-1800cc) plus Additional Customs Duty, GST, and other levies. CKD components face duties of 1–32% depending on part category, making locally assembled cars 30–50% cheaper than their imported equivalents.</p>
    <div class="inline-note">
      ⚠ The IMF-backed National Tariff Policy 2025–30 proposes reducing CBU duties to a 15% flat rate over 5 years with regulatory duties phased out. If implemented, this would be the most structurally negative policy development in the sector's history — reducing the tariff advantage that justifies local assembly. PAMA and assemblers are strongly opposed. Probability of full implementation is assessed as low but the risk is not negligible.
    </div>

    <div class="divider"></div>

    <h3>AIDEP 2021-26 — The Auto Policy Framework</h3>
    <p>The Auto Industry Development and Export Policy (AIDEP 2021-26) governs new-entrant concessions, localisation incentives, and EV/HEV transition policy. Key provisions include time-bound CKD duty concessions (3–5 years) for greenfield assemblers — which enabled KIA, Hyundai Nishat, SAZEW/HAVAL, and MG to enter the market with cost-competitive vehicles. Localisation incentives reward companies that exceed defined thresholds. HEV/EV provisions reduce GST from 17% to 5% on electric vehicles and reduce CKD duties on HEV components. AIDEP's successor (2026-31) is currently under industry consultation.</p>

    <div class="divider"></div>

    <h3>Import &amp; Export Dependence</h3>
    <div class="two-col">
      <div class="col-card">
        <div class="col-title"><span class="col-dot" style="background:var(--indu);"></span>Import Dependence</div>
        <ul class="col-list">
          <li>Total CKD imports: $6B across FY2021–4MFY26 vs only $1.5B in CBU imports — illustrating assembly model dominance</li>
          <li>Japanese assemblers import 35–60% of vehicle content by value</li>
          <li>Engine, transmission, advanced electronics: still entirely imported across all car assemblers</li>
          <li>Chinese/Korean assemblers: 65–90% import content — highest exposure</li>
          <li>ATLH CD70: only 5.6% import content — effectively self-sufficient</li>
          <li>SBP's LC restrictions in FY23 were existential — production halted when CKD financing was constrained</li>
        </ul>
      </div>
      <div class="col-card">
        <div class="col-title"><span class="col-dot" style="background:var(--accent4);"></span>Export Ambition vs Reality</div>
        <ul class="col-list">
          <li>Pakistan has not cracked auto exports at any meaningful scale — volumes are negligible</li>
          <li>AIDEP export incentive exists but uptake has been limited across all assemblers</li>
          <li>Cost structure (energy, logistics, scale) makes Pakistani cars uncompetitive globally</li>
          <li>ATLH exports motorcycles to Bangladesh, Afghanistan: ~5–8% of revenue — growing but small</li>
          <li>INDU's CEO has advocated for maintaining the 40% CKD-CBU tariff differential to preserve assembly economics</li>
          <li>EV export potential: nascent discussions; no concrete pipeline as of 2025</li>
        </ul>
      </div>
    </div>

    <div class="divider"></div>

    <h3>Pricing Power</h3>
    <p>Car assemblers have limited pricing power despite the oligopoly structure. The combination of used car imports (which set a price ceiling), high consumer price sensitivity, low income levels (94% households without a car), and SBP's Rs3M auto financing cap constrains ex-factory pricing. Assemblers primarily compete on product features, warranty terms, and dealership service rather than aggressive price competition — but retail price increases still require careful management to avoid demand destruction.</p>
    <p>ATLH's CD70 has genuine pricing power. The Rs150,000–200,000 Honda motorcycle commands a 10–20% premium over Chinese equivalents — and consumers consistently pay it. Brand loyalty built over 60 years, combined with the CD70's role as a livelihood tool for millions, makes ATLH the sector's strongest pricing position.</p>
  </div>`,
  },
  {
    id: 'companies',
    label: 'Companies',
    content: `<div class="section">
    <div class="section-label">05 · Company Profiles</div>
    <h2>Main Listed Players Covered</h2>
    <p>Each company operates a structurally different business shaped by its OEM parent, localisation level, product positioning, and exposure to Pakistan's rate and FX cycles. The five companies below represent the full listed auto universe that merits detailed coverage.</p>

        <div class="company-grid">

      <div class="company-card card-psmc">
        <div class="company-ticker ticker-psmc">PSX: PSMC</div>
        <div class="company-name">Pak Suzuki Motor Company</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> JV with Suzuki Motor Japan (73.09%); assembles Alto, Ravi, Cultus, Swift, Every from JPY-priced CKD kits; 46.7% car market share; entry-level price segment.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Deepest accessible buyer pool at entry level — when financing conditions ease, PSMC captures the first and largest wave of first-time car buyers entering the market.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Thinnest gross margins of listed car assemblers (8–12%); most exposed to used car import competition — sub-1300cc Japanese kei cars directly target the Alto.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> SBP policy rate (60–70% of Alto buyers finance at KIBOR-linked EMIs); PAMA monthly volume; PKR/JPY rate on CKD kit cost.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Used car import policy (sub-1300cc duty exemption directly cannibalises Alto demand); JPY strengthening vs PKR compresses gross margin immediately.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The only listed assembler with a viable entry-level (<Rs3.5M) car in active production — an addressable market that INDU, HCAR, and SAZEW do not serve.</li>
        </ul>
      </div>

      <div class="company-card card-indu">
        <div class="company-ticker ticker-indu">PSX: INDU</div>
        <div class="company-name">Indus Motor Company</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> House of Habib + Toyota JV; assembles Corolla, Yaris, Fortuner, Hilux, and Corolla Cross HEV (Pakistan's first locally assembled hybrid) from JPY-priced CKD kits.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Toyota brand loyalty generates waiting lists in peak demand — the only listed assembler that has demonstrated ability to price above ex-factory in strong markets. First locally assembled HEV.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Highest FX sensitivity in the sector — Toyota CKD kits are higher unit-value and entirely JPY-priced, making INDU's gross margin the most volatile to PKR/JPY movements of any listed car assembler.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> PKR/JPY exchange rate (gross margin driver) and SBP policy rate (volume driver) — INDU is uniquely exposed to both cycles compounding simultaneously.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Adverse PKR/JPY combined with high KIBOR is the scenario under which INDU's earnings collapse most sharply — demonstrated in FY23 with a 33% volume decline.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Pakistan's first and only locally assembled HEV (Corolla Cross HEV, December 2023) — a technology positioning advantage that neither PSMC nor HCAR have matched at local assembly level.</li>
        </ul>
      </div>

      <div class="company-card card-hcar">
        <div class="company-ticker ticker-hcar">PSX: HCAR</div>
        <div class="company-name">Honda Atlas Cars Pakistan</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Honda Motor Japan + Atlas Group JV; assembles City, Civic, BR-V from JPY-priced CKD kits; 12% car market share; mid-premium segment (Rs4.5–9M).</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Civic brand equity is durable — consumers demonstrably wait specifically for the Civic rather than substituting to a comparable Chinese or Korean alternative.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Most contested market positioning — squeezed from below by PSMC volumes, above by INDU's Toyota quality, and from the side by Chinese brands offering better specification at lower price.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Volume recovery (PAMA monthly data); PKR/JPY rate on Honda CKD costs; SBP rate cycle (City and Civic buyers are heavily financed).</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Chinese brand price competition in the Rs4–7M segment is the primary structural pressure on HCAR's City and BR-V volume and pricing.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The Civic nameplate exhibits brand-specific waiting behaviour from buyers — a qualitative distinction that shows in booking patterns and is not replicated by any Chinese or Korean equivalent at the same price point.</li>
        </ul>
      </div>

      <div class="company-card card-atlh">
        <div class="company-ticker ticker-atlh">PSX: ATLH</div>
        <div class="company-name">Atlas Honda Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Honda Motor Japan + Atlas Group motorcycle JV (since 1962); CD70, CG125, CB150F, Pridor; two plants (Sheikhupura, Karachi); 94.4% CD70 localisation — effectively a manufacturer, not an assembler.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> 94%+ localisation eliminates FX exposure and CKD import dependency. 65%+ motorcycle market share and 10-year PAT CAGR of 21% — the most consistent earnings growth record in Pakistan's listed auto universe.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> CD70 is a 1960s-era technology platform; Chinese electric motorcycle entrants are structurally targeting ATLH's core market on a 10–15 year horizon.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Rural income cycles (harvest timing, remittances) — not KIBOR. Recurring revenue from spare parts and genuine oil provides stable ancillary income above vehicle sales.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Chinese EV motorcycle quality improvement is the long-horizon structural risk; rural income shocks (crop failure, remittance slowdown) are the near-term earnings variable.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The only listed auto company operating as a manufacturer rather than an assembler — 94% local content insulates ATLH from every variable (JPY, LC controls, auto financing rates) that drives car assembler earnings volatility.</li>
        </ul>
      </div>

      <div class="company-card card-sazew">
        <div class="company-ticker ticker-sazew">PSX: SAZEW</div>
        <div class="company-name">Sazgar Engineering Works</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> GWM China JV (HAVAL SUVs, since August 2022) + legacy three-wheeler/rickshaw business; HAVAL H6 PHEV launched August 2025 (Pakistan's first locally assembled PHEV); 10–35% localisation.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> First locally assembled PHEV in Pakistan (HAVAL H6 Hi4, August 2025), ahead of all Japanese peers on EV transition at local assembly level. Rickshaw legacy business provides an earnings floor during HAVAL sales volatility.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Chinese brand trust gap remains real; 10–35% localisation creates high import content and FX exposure; GWM's product pipeline and technology transfer pace are outside SAZEW's control.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> HAVAL monthly volumes (PAMA data); HAVAL H6 PHEV demand uptake; rickshaw segment revenue as earnings stabiliser.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> HAVAL brand quality perception — any high-profile quality incident would disproportionately damage the still-establishing brand. GWM global positioning changes affect the local product pipeline.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The only listed auto company combining Chinese-brand car growth optionality with a legacy mass-market non-car cash-flow business — a structural earnings floor that PSMC, INDU, and HCAR do not carry.</li>
        </ul>
      </div>

    </div>
        <ul class="co-bullets">
          <li>Alto 660cc is Pakistan's best-selling car by volume, consistently breaking monthly sales records due to its entry-level price point (~Rs3M+)</li>
          <li>CKD kits imported from Japan in JPY — significant FX exposure on cost side; benefits materially from PKR/JPY stability</li>
          <li>Thin gross margins (8–12%) compensated by volume scale; fixed cost leverage is the primary earnings driver</li>
          <li>Also produces Ravi pickup and Every van — commercial segments that provide volume stability in weak car market periods</li>
          <li>Sub-1300cc used car import exemption is PSMC's primary competitive threat: cheap Daihatsu Miras directly compete with Alto</li>
        </ul>
        <div class="four-panel">
          <div class="panel">
            <span class="panel-lbl lbl-str">Structural Strength</span>
            <div class="panel-val">Dominant volume position at the entry-level price segment. Most financed buyer pool in Pakistan comes to the Alto first — when rates fall, PSMC is the first and largest beneficiary by unit volume.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-weak">Structural Weakness</span>
            <div class="panel-val">Lowest margin profile in the sector (8–12% gross) — thin margins mean any cost increase or volume shortfall drops directly to the bottom line. Technology royalties to Suzuki Japan are a persistent earnings drag.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-diff">Key Differentiator</span>
            <div class="panel-val">The only company with an established entry-level (sub-Rs3.5M) passenger car. The Alto's price point creates an addressable market that no other listed assembler serves — a structural volume floor in any demand cycle.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-sens">Main Sensitivity</span>
            <div class="panel-val">Used car import policy. Each wave of sub-1300cc import liberalisation directly cannibalises Alto demand. SBP rate cuts and used car restrictions are the two variables that most quickly move PSMC's quarterly earnings.</div>
          </div>
        </div>
        <div class="tags">
          <span class="tag tag-gold">Volume Leader</span>
          <span class="tag tag-blue">Suzuki Japan JV</span>
          <span class="tag tag-green">Rate Cut Beneficiary</span>
          <span class="tag tag-red">Used Car Risk</span>
          <span class="tag">Entry-Level Segment</span>
        </div>
      </div>

      <!-- INDU -->
      <div class="company-card card-indu">
        <div class="company-ticker ticker-indu">PSX: INDU</div>
        <div class="company-name">Indus Motor Company</div>
        <div class="company-desc">JV: House of Habib (Pakistan), Toyota Motor Corporation and Toyota Tsusho (Japan). Assembles Corolla, Yaris, Fortuner, Hilux, and Corolla Cross HEV — Pakistan's first locally assembled hybrid car. Port Qasim, Karachi.</div>
        <div class="company-metrics">
          <div class="metric">
            <span class="metric-val">Rs16.55B</span>
            <span class="metric-lbl">PAT 9MFY25 (+75% YoY)</span>
          </div>
          <div class="metric">
            <span class="metric-val">21,618 units</span>
            <span class="metric-lbl">9MFY25 Sales (+58% YoY)</span>
          </div>
          <div class="metric">
            <span class="metric-val">12.71%</span>
            <span class="metric-lbl">GP Margin CY24</span>
          </div>
          <div class="metric">
            <span class="metric-val">Rs64.77</span>
            <span class="metric-lbl">EPS Q1FY25</span>
          </div>
        </div>
        <ul class="co-bullets">
          <li>Corolla is Pakistan's aspirational car for the upper-middle class; Fortuner and Hilux command premium prices with strong resale value and loyal corporate buyers</li>
          <li>Corolla Cross HEV launched December 2023 — Pakistan's first Make-in-Pakistan hybrid; highest-ever INDU localisation level achieved on this model</li>
          <li>GP margin recovery from low single digits (FY23) to 12.71% (CY24) was primarily driven by PKR/JPY stabilisation — not operational improvement; this distinction matters when assessing sustainability</li>
          <li>Other Income from advance booking pools invested in T-bills earned Rs3–5B annually during peak rates; normalises as KIBOR falls</li>
          <li>House of Habib parentage provides governance quality; 57 authorised 3S dealerships; 1.1M+ cumulative CKD units since 1993</li>
        </ul>
        <div class="four-panel">
          <div class="panel">
            <span class="panel-lbl lbl-str">Structural Strength</span>
            <div class="panel-val">Toyota's quality reputation and the Corolla's aspirational positioning create the highest brand loyalty in Pakistan's car market. Waiting lists develop in peak demand periods — unlike peers who discount to sell.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-weak">Structural Weakness</span>
            <div class="panel-val">The highest FX sensitivity among listed assemblers. INDU's earnings are more exposed to PKR/JPY movements than any peer because Toyota CKD kits carry higher unit value and are entirely JPY-priced.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-diff">Key Differentiator</span>
            <div class="panel-val">First locally assembled HEV in Pakistan (Corolla Cross HEV). This positions INDU for the EV transition with a product pipeline that PSMC and HCAR do not yet have at local assembly level.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-sens">Main Sensitivity</span>
            <div class="panel-val">PKR/JPY exchange rate and SBP policy rate simultaneously — INDU is uniquely exposed to both the FX cycle (cost) and the rate cycle (demand). When both are adverse, earnings can collapse; when both are favourable, earnings surge.</div>
          </div>
        </div>
        <div class="tags">
          <span class="tag tag-blue">Toyota JV</span>
          <span class="tag tag-green">First Pakistan HEV</span>
          <span class="tag tag-gold">Premium Segment</span>
          <span class="tag">House of Habib</span>
          <span class="tag tag-red">High FX Sensitivity</span>
        </div>
      </div>

      <!-- HCAR -->
      <div class="company-card card-hcar">
        <div class="company-ticker ticker-hcar">PSX: HCAR</div>
        <div class="company-name">Honda Atlas Cars Pakistan</div>
        <div class="company-desc">JV between Honda Motor Japan and Atlas Group of Pakistan. Assembles City, Civic, and BR-V. Targets the Rs4.5–9M aspirational segment — above PSMC's entry-level but below INDU's premium SUVs.</div>
        <div class="company-metrics">
          <div class="metric">
            <span class="metric-val">~12%</span>
            <span class="metric-lbl">Car Market Share CY25</span>
          </div>
          <div class="metric">
            <span class="metric-val">12,776 units</span>
            <span class="metric-lbl">9MFY25 Sales (+29% YoY)</span>
          </div>
          <div class="metric">
            <span class="metric-val">City + Civic</span>
            <span class="metric-lbl">Volume Models</span>
          </div>
          <div class="metric">
            <span class="metric-val">Atlas Group</span>
            <span class="metric-lbl">Pakistani Parent</span>
          </div>
        </div>
        <ul class="co-bullets">
          <li>City (Rs4.5–5M) competes directly with INDU's Yaris; Civic (Rs7–9M) has a loyal enthusiast following but faces intense competition at that price point</li>
          <li>Volume recovery has been patchier than PSMC and INDU — HCAR suffered a 35% YoY drop in March 2025 after strong February, illustrating its higher monthly variance</li>
          <li>BR-V SUV competes in the sub-Rs5M 7-seater segment against KIA Sportage and Hyundai Tucson — an intensely competitive space now also contested by Chinese brands</li>
          <li>Honda Japan controls model cycle timing — limiting HCAR's flexibility to respond to local competitive shifts, particularly from Chinese entrants</li>
          <li>Atlas Group parentage provides Pakistani institutional backing; group companies include Atlas Honda (motorcycles), creating some resource sharing</li>
        </ul>
        <div class="four-panel">
          <div class="panel">
            <span class="panel-lbl lbl-str">Structural Strength</span>
            <div class="panel-val">The Civic's brand equity with Pakistani car enthusiasts is genuine and durable. Honda's engineering reputation sustains pricing power above Chinese alternatives even as specs converge.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-weak">Structural Weakness</span>
            <div class="panel-val">Middle-market positioning is structurally the most contested. Squeezed from below by PSMC volumes, from above by INDU's Toyota quality, and from the side by Chinese brands on price, HCAR's competitive space is narrowing.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-diff">Key Differentiator</span>
            <div class="panel-val">The Civic nameplate carries authentic aspirational weight that Chinese brands cannot yet replicate. Among the sub-Rs10M cars, only the Civic has a dedicated enthusiast base willing to wait for it specifically.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-sens">Main Sensitivity</span>
            <div class="panel-val">Chinese brand price competition in the Rs4–7M segment. As Chinese assemblers (SAZEW, MG, KIA, Hyundai Nishat) offer better-specified vehicles at lower price points, the City and BR-V face structural pressure on volume and pricing.</div>
          </div>
        </div>
        <div class="tags">
          <span class="tag">Honda Japan JV</span>
          <span class="tag tag-blue">Mid-Premium Segment</span>
          <span class="tag">Atlas Group</span>
          <span class="tag tag-red">Chinese Competition</span>
          <span class="tag">Civic Brand Equity</span>
        </div>
      </div>

      <!-- ATLH -->
      <div class="company-card card-atlh">
        <div class="company-ticker ticker-atlh">PSX: ATLH</div>
        <div class="company-name">Atlas Honda Limited</div>
        <div class="company-desc">Pakistan's largest motorcycle manufacturer. JV: Atlas Group Pakistan + Honda Motor Japan (since 1962). CD70, CG125, CB150F, Pridor, ICON e. Two plants: Sheikhupura (1.2M units) and Karachi (150K). PSX's most consistent compounder in the auto universe.</div>
        <div class="company-metrics">
          <div class="metric">
            <span class="metric-val">Rs15.25B</span>
            <span class="metric-lbl">PAT FY25 (+57% YoY)</span>
          </div>
          <div class="metric">
            <span class="metric-val">Rs122.91</span>
            <span class="metric-lbl">EPS FY25</span>
          </div>
          <div class="metric">
            <span class="metric-val">Rs74/share</span>
            <span class="metric-lbl">Total Dividend FY25</span>
          </div>
          <div class="metric">
            <span class="metric-val">94.4%</span>
            <span class="metric-lbl">CD70 Localisation</span>
          </div>
        </div>
        <ul class="co-bullets">
          <li>CD70 is not just a motorcycle — it is the primary transport and livelihood vehicle for tens of millions of Pakistani delivery workers, farmers, and tradespeople; brand loyalty is extraordinary</li>
          <li>94.4% localisation on CD70 makes ATLH effectively a local manufacturer rather than an assembler — minimal FX exposure, minimal import dependency, maximum pricing power</li>
          <li>Achieved highest-ever monthly sales of 136,000 units in September 2025; 10-year revenue and PAT CAGR of 16% and 21% respectively — a compounding record unmatched in the sector</li>
          <li>Also manufactures spare parts and genuine oil — recurring ancillary revenue streams beyond vehicle sale; these segments have higher margins than vehicles</li>
          <li>ATLH has developed the ICON e electric motorcycle — positioning ahead of EV transition without waiting for government mandate; this is a structural differentiator against Chinese EV entrants</li>
        </ul>
        <div class="four-panel">
          <div class="panel">
            <span class="panel-lbl lbl-str">Structural Strength</span>
            <div class="panel-val">94%+ localisation combined with 65%+ market share creates a self-reinforcing moat: scale funds localisation investment, which reduces costs, which enables competitive pricing, which maintains scale. This virtuous cycle has operated for 60+ years.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-weak">Structural Weakness</span>
            <div class="panel-val">CD70 is a 1960s-era technology product. As electric alternatives improve in quality and fall in price, the technology gap with Chinese EV motorcycles will narrow. ATLH's lead may be wide but it is not permanent.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-diff">Key Differentiator</span>
            <div class="panel-val">The Honda brand's trust among rural and semi-urban Pakistani consumers is irreplaceable in the near term. Consumers demonstrably pay 10–20% more for the Honda badge over Chinese alternatives. No domestic brand commands this premium.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-sens">Main Sensitivity</span>
            <div class="panel-val">Rural income cycles — crop harvest timings, remittances from Gulf workers, and agricultural commodity prices drive motorcycle demand more than KIBOR. When wheat/rice harvests are strong, motorcycle sales surge in rural markets.</div>
          </div>
        </div>
        <div class="tags">
          <span class="tag tag-green">94% Localisation</span>
          <span class="tag tag-green">65%+ Market Share</span>
          <span class="tag tag-gold">21yr PAT CAGR 21%</span>
          <span class="tag">Mass Market Transport</span>
          <span class="tag tag-blue">EV Transition Ready</span>
        </div>
      </div>

      <!-- SAZEW -->
      <div class="company-card card-sazew">
        <div class="company-ticker ticker-sazew">PSX: SAZEW</div>
        <div class="company-name">Sazgar Engineering Works</div>
        <div class="company-desc">Incorporated 1975 originally as a three-wheeler/rickshaw manufacturer. Pivoted to passenger cars in 2022 via JV with Great Wall Motor (GWM) of China for the HAVAL SUV brand. Pakistan's fastest-volume-growth auto story — and its highest-risk.</div>
        <div class="company-metrics">
          <div class="metric">
            <span class="metric-val">+153%</span>
            <span class="metric-lbl">9MFY25 Volume Growth YoY</span>
          </div>
          <div class="metric">
            <span class="metric-val">HAVAL H6</span>
            <span class="metric-lbl">Flagship 4-Wheeler Model</span>
          </div>
          <div class="metric">
            <span class="metric-val">Aug 2025</span>
            <span class="metric-lbl">PHEV H6 Hi4 Launched</span>
          </div>
          <div class="metric">
            <span class="metric-val">10–35%</span>
            <span class="metric-lbl">Current Localisation Level</span>
          </div>
        </div>
        <ul class="co-bullets">
          <li>HAVAL H6 PHEV launched August 2025 — Pakistan's first locally assembled Plug-in Hybrid; a milestone that significantly elevates SAZEW's EV transition positioning ahead of Japanese peers</li>
          <li>Legacy three-wheeler/rickshaw business is a mature, stable cash generator with deep rural market penetration — providing earnings floor during HAVAL sales volatility</li>
          <li>Volume surged 153% in 9MFY25 and 296% in October 2024 — extraordinary growth from a low base; growth arithmetic becomes harder as base effects fade</li>
          <li>Localisation still at 10–35% — significantly below Japanese assemblers; higher import content means more FX exposure and lower AIDEP concession eligibility</li>
          <li>GWM product pipeline and technology transfer pace are outside SAZEW's control — dependence on a Chinese JV partner that may face its own global challenges is a key governance risk</li>
        </ul>
        <div class="four-panel">
          <div class="panel">
            <span class="panel-lbl lbl-str">Structural Strength</span>
            <div class="panel-val">First-mover in PHEV locally assembled vehicles. At a time when all Japanese competitors are still pre-HEV or HEV-only at local assembly, SAZEW has a PHEV on local roads. This is a genuine technology positioning advantage.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-weak">Structural Weakness</span>
            <div class="panel-val">Chinese brand perception among Pakistani consumers remains mixed. HAVAL volumes grew from a very low base — sustaining growth as base effects normalise and Japanese quality competition intensifies will be the key test of the brand's durability.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-diff">Key Differentiator</span>
            <div class="panel-val">The combination of legacy rickshaw cash flow + HAVAL growth optionality makes SAZEW structurally unique. No other listed auto company has an established mass-market non-car revenue stream that funds the car business during weak periods.</div>
          </div>
          <div class="panel">
            <span class="panel-lbl lbl-sens">Main Sensitivity</span>
            <div class="panel-val">GWM/HAVAL brand perception and product quality consistency in Pakistan. Any high-profile quality incidents with HAVAL vehicles would disproportionately hurt SAZEW, given that Chinese brand trust is still being established.</div>
          </div>
        </div>
        <div class="tags">
          <span class="tag tag-purple">GWM China JV</span>
          <span class="tag tag-green">First Pakistan PHEV</span>
          <span class="tag tag-gold">+153% Volume Growth</span>
          <span class="tag">Rickshaw Legacy</span>
          <span class="tag tag-red">Low Localisation</span>
        </div>
      </div>`,
  },
  {
    id: 'peergrid',
    label: 'Peers',
    content: `<div class="section">
    <div class="section-label">06 · Peer Comparison Grid</div>
    <h2>Peer Comparison Grid</h2>
    <p>The two tables below provide a structured comparison of business model characteristics and quantitative metrics across all five listed companies.</p>

    <h3>Qualitative Business Model Comparison</h3>
    <div class="tbl-wrap">
      <table class="peer-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Business Model</th>
            <th>Key Strength</th>
            <th>Key Weakness</th>
            <th>Main Sensitivity</th>
            <th>Distinguishing Feature</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="company-badge badge-psmc">PSMC</span></td>
            <td>High-volume entry-level car assembler; CKD from Suzuki Japan; mass-market dealership network</td>
            <td>Dominant volume position; deepest accessible buyer pool when financing conditions ease</td>
            <td>Thinnest gross margins in sector (8–12%); most exposed to used car import competition</td>
            <td>Used car import policy (sub-1300cc exemptions) and SBP rate cycle</td>
            <td>Only listed assembler with credible entry-level sub-Rs3.5M car in active production</td>
          </tr>
          <tr>
            <td><span class="company-badge badge-indu">INDU</span></td>
            <td>Premium car assembler; Toyota JV; Corolla + Fortuner + Hilux + Corolla Cross HEV</td>
            <td>Toyota brand loyalty; highest aspiration value; first locally assembled HEV</td>
            <td>Highest FX sensitivity in sector; earnings volatility from dual rate/FX cycle exposure</td>
            <td>PKR/JPY rate and SBP policy rate — both simultaneously</td>
            <td>Pakistan's first and only locally assembled HEV — unique technology positioning</td>
          </tr>
          <tr>
            <td><span class="company-badge badge-hcar">HCAR</span></td>
            <td>Mid-premium car assembler; Honda JV; City + Civic + BR-V</td>
            <td>Civic brand equity with enthusiast buyers; Honda engineering reputation</td>
            <td>Most contested positioning (squeezed from below by PSMC, above by INDU, side by Chinese)</td>
            <td>Chinese brand price competition in the Rs4–7M SUV/sedan segment</td>
            <td>Civic nameplate carries unique aspirational weight among urban young professionals</td>
          </tr>
          <tr>
            <td><span class="company-badge badge-atlh">ATLH</span></td>
            <td>Motorcycle manufacturer (not assembler); Honda JV; CD70 dominant; 94% local content</td>
            <td>94% localisation; 65%+ market share; 10-year PAT CAGR of 21%; minimal rate/FX sensitivity</td>
            <td>CD70 is a 1960s technology platform; EV transition risk over 10–15 year horizon</td>
            <td>Rural income cycles (harvest, remittances) — not KIBOR; structurally different demand driver</td>
            <td>Only company that is effectively a manufacturer rather than an assembler; the structural moat is unmatched</td>
          </tr>
          <tr>
            <td><span class="company-badge badge-sazew">SAZEW</span></td>
            <td>Chinese SUV assembler (HAVAL/GWM JV) + legacy three-wheeler/rickshaw manufacturer</td>
            <td>First locally assembled PHEV in Pakistan; legacy cash flow from rickshaw business</td>
            <td>Low localisation (10–35%); Chinese brand trust gap; GWM JV dependency</td>
            <td>HAVAL brand quality perception; GWM product pipeline and global positioning</td>
            <td>Only listed company with both legacy mass-market non-car revenue and Chinese-brand growth optionality</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>Key Metrics Snapshot</h3>
    <div class="tbl-wrap">
      <table class="peer-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th><span class="company-badge badge-psmc">PSMC</span></th>
            <th><span class="company-badge badge-indu">INDU</span></th>
            <th><span class="company-badge badge-hcar">HCAR</span></th>
            <th><span class="company-badge badge-atlh">ATLH</span></th>
            <th><span class="company-badge badge-sazew">SAZEW</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="color:var(--text);font-weight:500;">Car/Moto Mkt Share</td>
            <td>~46.7% (cars)</td>
            <td>~22% (cars)</td>
            <td>~12% (cars)</td>
            <td>65%+ (motorcycles)</td>
            <td>~7% cars, growing</td>
          </tr>
          <tr>
            <td style="color:var(--text);font-weight:500;">Recent Volume (9MFY25)</td>
            <td>49,946 units (+41%)</td>
            <td>21,618 units (+58%)</td>
            <td>12,776 units (+29%)</td>
            <td>136K/mo peak (Sep'25)</td>
            <td>+153% YoY growth</td>
          </tr>
          <tr>
            <td style="color:var(--text);font-weight:500;">Gross Margin Range</td>
            <td>8–12%</td>
            <td>10–14% (FX-dependent)</td>
            <td>8–12%</td>
            <td>10–13% (stable)</td>
            <td>8–12% (building)</td>
          </tr>
          <tr>
            <td style="color:var(--text);font-weight:500;">Localisation Level</td>
            <td>35–60% by parts</td>
            <td>40–70% (model-dependent)</td>
            <td>40–65%</td>
            <td>94.4% (CD70)</td>
            <td>10–35% (early stage)</td>
          </tr>
          <tr>
            <td style="color:var(--text);font-weight:500;">FX Sensitivity</td>
            <td>High (JPY)</td>
            <td>Very High (JPY + USD)</td>
            <td>High (JPY)</td>
            <td>Very Low (94% local)</td>
            <td>Medium (CNY-adjacent)</td>
          </tr>
          <tr>
            <td style="color:var(--text);font-weight:500;">Rate Cut Sensitivity</td>
            <td>Very High</td>
            <td>Very High</td>
            <td>High</td>
            <td>Low (cash purchases)</td>
            <td>High (SUV financing)</td>
          </tr>
          <tr>
            <td style="color:var(--text);font-weight:500;">Key Recent EPS Data</td>
            <td>9MFY25 strong recovery</td>
            <td>Rs64.77 EPS Q1FY25</td>
            <td>Patchier recovery</td>
            <td>Rs122.91 EPS FY25</td>
            <td>+153% vol growth proxy</td>
          </tr>
          <tr>
            <td style="color:var(--text);font-weight:500;">Parent / JV</td>
            <td>Suzuki Motor Japan 73%</td>
            <td>Toyota + Tsusho (Japan)</td>
            <td>Honda Motor Japan</td>
            <td>Honda Motor Japan</td>
            <td>Great Wall Motor (China)</td>
          </tr>
          <tr>
            <td style="color:var(--text);font-weight:500;">Key EV/Hybrid Status</td>
            <td>None locally assembled</td>
            <td>Corolla Cross HEV ✓</td>
            <td>None locally assembled</td>
            <td>ICON e electric (dev)</td>
            <td>HAVAL H6 PHEV ✓ (2025)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  },
  {
    id: 'risks',
    label: 'Risks',
    content: `<div class="section">
    <div class="section-label">07 · Important Risks</div>
    <h2>Important Risks</h2>
    <p>These risks represent scenarios where key variables move adversely and the earnings outcome is materially worse than expected. Each is sector-specific and grounded in Pakistan's auto market mechanics.</p>

    <div class="risk-list">

      <div class="risk-item">
        <div class="risk-name">IMF-Backed Tariff Liberalisation</div>
        <div class="risk-desc">The National Tariff Policy 2025–30, developed under IMF conditionality, proposes reducing CBU car import duties to a 15% flat rate over 5 years with regulatory duties phased out. If implemented as proposed, this would eliminate the 30–50% price advantage that currently makes local assembly viable. PAMA estimates local assembly volume could decline 30–50% over 5 years as cheap imported cars capture market share. INDU's CEO has publicly opposed this, calling for maintaining the 40% CKD-CBU tariff differential. Political economy strongly favours local assemblers (2.5M jobs), but IMF conditions create real implementation risk.</div>
      </div>

      <div class="risk-item">
        <div class="risk-name">Used Car Import Liberalisation Wave</div>
        <div class="risk-desc">In FY24, used car imports surged 435% following policy relaxation, contributing directly to INDU's 33% volume decline and sector-wide earnings collapse. The sub-1300cc used car exemption from regulatory duty is a structural loophole that allows cheap Japanese kei cars to undercut PSMC's Alto directly. Policy swings frequently between restriction (protecting assemblers) and liberalisation (consumer affordability and overseas Pakistani remittance pressure). Any future liberalisation — including extension of the 3-year age limit to 5 years — would disproportionately hurt PSMC (Alto) and INDU (Yaris, Corolla lower trims) earnings.</div>
      </div>

      <div class="risk-item">
        <div class="risk-name">PKR/JPY Adverse Shock</div>
        <div class="risk-desc">INDU's GP margin fell to low single digits in FY23 primarily because JPY strengthened globally against currencies including PKR while import costs rose. A repeat of this dynamic — PKR weakness combined with JPY strength — would compress INDU's gross margins by 200–400bps on a sustained basis with no operational offset. PSMC and HCAR face the same mechanism but at lower base margins, meaning the percentage earnings impact is higher. ATLH is the only company insulated from this risk due to 94%+ localisation.</div>
      </div>

      <div class="risk-item">
        <div class="risk-name">SBP Financing Cap at Rs3M</div>
        <div class="risk-desc">The State Bank's Rs3M auto financing cap was set when entry-level cars cost Rs2M. All locally assembled cars now exceed Rs3M — meaning the regulatory financing cap is effectively zero for new vehicles. Unless the cap is revised upward, the entire Rs3M+ vehicle market must be purchased with unfinanced cash or other credit facilities. This structurally dampens the transmission of rate cuts to car volumes, reducing the sector's benefit from monetary easing compared to historical cycles.</div>
      </div>

      <div class="risk-item">
        <div class="risk-name">CKD Import Restriction (LC Controls)</div>
        <div class="risk-desc">In FY23, the government imposed foreign exchange conservation measures that constrained banks' ability to open letters of credit for CKD imports. Production halted or slowed at multiple assemblers as kit inventory depleted. This risk re-emerges whenever Pakistan's foreign reserves come under stress. INDU's volume fell 33% in FY23 partly due to LC constraints. ATLH was significantly less affected due to its domestic sourcing base. Any future balance-of-payments crisis that triggers import controls would hit car assemblers first and most severely.</div>
      </div>

      <div class="risk-item">
        <div class="risk-name">Electric Motorcycle Disruption (ATLH)</div>
        <div class="risk-desc">Chinese electric motorcycle manufacturers are introducing sub-Rs200,000 EVs to Pakistan that match the CD70's price point while offering zero running cost. ATLH has responded with the ICON e development project, but EV transition in motorcycles could compress margins and market share over a 10–15 year horizon if Chinese EV quality improves and charging infrastructure develops. ATLH's brand loyalty provides a buffer, but the CD70's technology age is a structural vulnerability that is real even if not near-term.</div>
      </div>

      <div class="risk-item">
        <div class="risk-name">Budget Tax Shock on Vehicle Purchase</div>
        <div class="risk-desc">The Finance Bill 2024-25 shifted Withholding Tax from engine-size-based to value-based calculation, adding Rs25,000–200,000 to effective consumer cost depending on vehicle price. Any further budget measure that increases vehicle purchase tax burden — additional WHT, FED expansion, GST increase — directly reduces demand. This risk is difficult to price in advance because budget decisions are opaque until the Finance Bill is tabled. All car assemblers are exposed; ATLH's motorcycle tax treatment is less volatile but not immune to budget changes.</div>
      </div>

      <div class="risk-item">
        <div class="risk-name">SAZEW / Chinese Brand Quality Perception</div>
        <div class="risk-desc">SAZEW's HAVAL volumes are growing from a low base in a market where Chinese brand trust is still being established. A significant quality incident — warranty failures, safety issues, after-sales service failures — at scale could permanently damage the HAVAL brand in Pakistan's word-of-mouth-driven consumer market. GWM's global positioning and financial health also affect SAZEW's product pipeline; any deterioration in GWM's China business could slow model introductions or technology transfer, stalling SAZEW's local growth story.</div>
      </div>

    </div>
  </div>`,
  },
  {
    id: 'monitor',
    label: 'Monitor',
    content: `<div class="section">
    <div class="section-label">08 · What to Monitor</div>
    <h2>What to Monitor</h2>
    <p>These are the data releases, corporate disclosures, and policy events that analysts track to build real-time earnings views on Pakistan's auto sector.</p>

    <div class="monitor-grid">
      <div class="monitor-col">
        <div class="monitor-col-title">Monthly</div>
        <div class="monitor-item">PAMA monthly sales data (by company and model, released ~10th of each month) — the primary real-time volume indicator for all assemblers</div>
        <div class="monitor-item">SBP policy rate announcements and KIBOR daily fixings — direct driver of auto financing EMIs and buyer pool size</div>
        <div class="monitor-item">PKR/JPY spot exchange rate — daily tracking for INDU, PSMC, HCAR cost-side modelling; critical for gross margin forecasting</div>
        <div class="monitor-item">Used car import volumes and customs data — signals policy direction and competitive threat intensity for PSMC/INDU</div>
        <div class="monitor-item">SBP foreign exchange reserves level — early warning indicator for potential LC restriction risk</div>
        <div class="monitor-item">Fuel prices and petrol/diesel differential — affects motorcycle demand (ATLH) relative to car affordability</div>
      </div>
      <div class="monitor-col">
        <div class="monitor-col-title">Quarterly</div>
        <div class="monitor-item">Quarterly financial results: GP margin trend vs prior quarters — critical for detecting FX and localisation effects</div>
        <div class="monitor-item">Other Income line in INDU and ATLH results — tracks normalisation of T-bill/investment earnings as KIBOR falls</div>
        <div class="monitor-item">Localisation % disclosures by model — INDU's Corolla Cross HEV localisation progress is a key long-term margin driver</div>
        <div class="monitor-item">Booking backlog and waiting list duration — qualitative demand indicator; long waiting lists = pricing power and production capacity running full</div>
        <div class="monitor-item">ATLH's spare parts and engine oil revenue segment — proxy for post-sale market penetration and recurring revenue mix</div>
        <div class="monitor-item">SAZEW three-wheeler volumes — earnings stability indicator for the legacy business funding the HAVAL growth investment</div>
      </div>
      <div class="monitor-col">
        <div class="monitor-col-title">Event-Driven</div>
        <div class="monitor-item">Federal Budget (Finance Bill) announcement — WHT structure, GST changes, FED on larger engines, EV/HEV duty concessions; tabled June each year</div>
        <div class="monitor-item">SRO (Statutory Regulatory Order) issuances — can change tariff rates, LC procedures, or import restrictions at any time; often without parliamentary process</div>
        <div class="monitor-item">AIDEP 2026-31 policy announcement — successor auto policy governs next 5 years of new-entrant concessions, localisation incentives, EV transition timelines</div>
        <div class="monitor-item">New model launch announcements by any assembler — particularly INDU HEV expansion or SAZEW PHEV variants; volume and margin catalyst</div>
        <div class="monitor-item">IMF review conclusions and tariff reform conditionality — any progress on CBU duty liberalisation is a structural negative for all assemblers</div>
        <div class="monitor-item">OEM parent decisions (Toyota, Suzuki, Honda, GWM) on technology transfer, kit pricing, and royalty terms — primarily visible in quarterly filings</div>
        <div class="monitor-item">SBP Rs3M auto financing cap revision — if raised to Rs5M or higher, would immediately expand the financed buyer pool and benefit all car assemblers</div>
      </div>
    </div>

    <div class="divider"></div>

    <h3>Important Dates &amp; Timeline</h3>
    <div class="timeline">
      <div class="tl-item">
        <div class="tl-date">August 2022</div>
        <div class="tl-desc">SAZEW's HAVAL brand commercially launched in Pakistan under GWM JV, marking entry of Chinese SUVs into locally assembled market under AIDEP 2021-26 new-entrant concessions.</div>
      </div>
      <div class="tl-item">
        <div class="tl-date">FY2023 (Jul–Jun)</div>
        <div class="tl-desc">Sector-wide volume collapse: INDU volumes fell 33% to 21,063 units; LC restrictions on CKD imports halted production; used car imports surged 435%; KIBOR peaked at 22%. Sector's worst earnings year in a decade.</div>
      </div>
      <div class="tl-item">
        <div class="tl-date">December 2023</div>
        <div class="tl-desc">INDU launches Corolla Cross HEV — Pakistan's first locally assembled Hybrid Electric Vehicle. Becomes INDU's highest-localisation model ever; sets new benchmark for hybrid vehicle assembly in Pakistan.</div>
      </div>
      <div class="tl-item">
        <div class="tl-date">May 2024 onward</div>
        <div class="tl-desc">SBP begins rate cut cycle, reducing KIBOR from 22% to 10.5% by early 2025 across five consecutive cuts. This triggers the most powerful auto demand recovery in years — INDU PAT +75% in 9MFY25.</div>
      </div>
      <div class="tl-item">
        <div class="tl-date">Finance Bill 2024-25</div>
        <div class="tl-desc">WHT structure shifts from engine-size-based to value-based calculation. Adds Rs25,000–200,000 to effective consumer cost per vehicle depending on price point. SRO 499 grants then withdraws HEV import duty exemptions within the same year.</div>
      </div>
      <div class="tl-item">
        <div class="tl-date">August 2025</div>
        <div class="tl-desc">SAZEW launches HAVAL H6 Hi4 PHEV — Pakistan's first locally assembled Plug-in Hybrid Electric Vehicle. Drives 73% YoY volume growth in the following month; establishes SAZEW's EV positioning ahead of all Japanese peers.</div>
      </div>
      <div class="tl-item">
        <div class="tl-date">September 2025</div>
        <div class="tl-desc">ATLH records 136,000 units — highest-ever monthly motorcycle sales figure. Reflects sustained rural demand recovery, falling fuel costs, and successful new model introductions including CB models.</div>
      </div>
      <div class="tl-item">
        <div class="tl-date">CY25 Full Year</div>
        <div class="tl-desc">Pakistan car market reaches 173,781 units — 40% YoY growth and the strongest annual volume in years. Driven by rate cuts, PKR/JPY stabilisation, and construction/economic recovery.</div>
      </div>
      <div class="tl-item">
        <div class="tl-date">2026 onwards</div>
        <div class="tl-desc">AIDEP 2026-31 successor policy under consultation; national tariff reform agenda continues under IMF conditions. Watch for CBU duty changes, used car age limit revisions, and EV/PHEV transition framework updates. These will define the sector's earnings structure for the next five years.</div>
      </div>
    </div>
  </div>`,
  },
  {
    id: 'glossary',
    label: 'Glossary',
    content: `<div class="section">
    <div class="section-label">09 · Glossary</div>
    <h2>Glossary</h2>
    <p>Essential terminology for reading Pakistan auto company financials, PAMA monthly data, and policy documents.</p>

    <div class="glossary-grid">

      <div class="glossary-item">
        <div class="glossary-term">CKD — Completely Knocked Down</div>
        <div class="glossary-def">A vehicle shipped to Pakistan in separate components for local assembly. CKD kits face lower import duties than complete vehicles (CBU), making local assembly economically viable. Japanese assemblers import 35–70% of vehicle content by value as CKD. Total CKD imports over FY2021–4MFY26 reached $6 billion, illustrating the sector's import dependence despite the "assembly" label.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">CBU — Completely Built Unit</div>
        <div class="glossary-def">A fully assembled vehicle imported into Pakistan. Faces customs duty of 20–25% plus regulatory duty of 15–90% (engine-size dependent) plus ACD, GST, and other levies — making imported new cars 30–50% more expensive than locally assembled equivalents. Used CBU imports (3-year-old Japanese cars) operate under different, lighter duty structures, enabling cheap competition with locally assembled entry-level models.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Localisation</div>
        <div class="glossary-def">The percentage of a vehicle's content manufactured in Pakistan, measured by parts count or by value. ATLH's CD70 achieves 94.4% by parts count — the highest in the sector. INDU's Corolla is 40–70% depending on model trim. Korean/Chinese entrants (SAZEW, MG) start at 10–35%. AIDEP rewards localisation improvement with reduced duty on remaining CKD components, making higher localisation both a cost advantage and a policy incentive.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">PAMA</div>
        <div class="glossary-def">Pakistan Automotive Manufacturers Association — the industry body that publishes monthly production and sales data for member companies. Released around the 10th of each subsequent month, PAMA data is the primary real-time market intelligence source for auto sector analysis. Tracks by company, model, and category (passenger cars, commercial vehicles, motorcycles, tractors).</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Ex-Factory Price</div>
        <div class="glossary-def">The price at which the assembler invoices to the dealer — inclusive of all factory-level taxes (WHT, GST) but before dealer margin. This is the assembler's revenue recognition point. The "street price" or "market price" consumers see includes dealer margin and, in high-demand periods, a dealer premium above ex-factory. Assemblers do not capture this dealer premium.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">3S Dealership</div>
        <div class="glossary-def">Sales, Service, and Spare Parts — the three functions required of an authorised OEM dealership. INDU has 57 authorised 3S dealerships nationwide; ATLH operates through an extensive nationwide motorcycle dealer and service network. Dealerships are independent franchisees but operate under the OEM's quality and branding standards. Dealer service quality is a key differentiator between Japanese and Chinese brand assemblers in Pakistan.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">AIDEP</div>
        <div class="glossary-def">Auto Industry Development and Export Policy (2021-26) — the government's auto sector framework governing new entrant concessions, localisation incentives, and EV/HEV transition policy. Provides CKD duty concessions to greenfield assemblers for 3–5 years, enabling KIA, Hyundai Nishat, SAZEW/HAVAL, and MG to enter at cost-competitive prices. Its successor (AIDEP 2026-31) is currently under industry consultation.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">WHT — Withholding Tax on Vehicles</div>
        <div class="glossary-def">Tax collected at the point of vehicle purchase. Shifted from engine-size-based to value-based in Finance Bill 2024-25. For filers: 1.5% of ex-factory value; for non-filers: 4.5%. On a Rs5M car, this adds Rs75,000 (filer) or Rs225,000 (non-filer) to effective purchase cost, directly affecting demand elasticity — particularly for first-time buyers at the entry level of the market.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">SRO — Statutory Regulatory Order</div>
        <div class="glossary-def">A government regulatory instrument used to implement tariff changes, duty exemptions, or import restrictions without requiring full parliamentary process. SROs are the primary policy tool affecting the auto sector. SRO 499 of 2024 granted then withdrew HEV import duty exemptions within a single year, directly affecting used car pricing and INDU's Corolla Cross HEV competitive position.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">HEV / PHEV / BEV</div>
        <div class="glossary-def">Hybrid Electric Vehicle (HEV): petrol engine + electric motor with no external charging (INDU's Corolla Cross — Pakistan's first locally assembled HEV). Plug-in Hybrid (PHEV): petrol + larger battery with external charging (SAZEW's HAVAL H6 Hi4 — Pakistan's first locally assembled PHEV, launched August 2025). Battery Electric Vehicle (BEV): no petrol engine. Pakistan remains at early HEV/PHEV adoption stage; BEV penetration is negligible.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Auto Financing EMI</div>
        <div class="glossary-def">Equated Monthly Instalment on a vehicle loan. At KIBOR 22%, EMI on a Rs5M Corolla over 5 years exceeded Rs120,000/month — unaffordable for most target buyers. At KIBOR 10.5%, the same EMI falls to ~Rs90,000. SBP's Rs3M auto financing cap means no bank-financed car purchase above Rs3M qualifies — effectively removing institutional financing from the entire locally assembled market as all vehicles now exceed Rs3M.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Waiting List / Booking Premium</div>
        <div class="glossary-def">In high-demand periods, delivery of new cars can take 3–12 months after booking deposit. Dealers charge a premium above ex-factory price — sometimes Rs300,000–1M — to prioritise delivery. This premium is captured by the dealer, not the assembler. Waiting list duration is a leading demand indicator: long waiting lists signal capacity is fully utilised and pricing power has returned to the sector.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">OEM — Original Equipment Manufacturer</div>
        <div class="glossary-def">The parent technology company (Toyota, Honda, Suzuki, GWM). The Pakistani entity is the assembler/licensee. OEMs supply CKD kits, receive royalties and technical assistance fees (typically 2–5% of net revenue), and hold significant equity stakes (Suzuki holds 73.09% in PSMC; Honda holds a majority in ATLH). OEM decisions on model cycles, technology sharing, and kit pricing directly determine Pakistani assembler economics.</div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Regulatory Duty (RD)</div>
        <div class="glossary-def">An additional duty on imports beyond standard customs duty — used as a flexible protective measure. RD on CBU used vehicles above 1,300cc was set at 15% in Finance Bill 2024-25; vehicles above 1,800cc face RD of 70–90%. The duty-free exemption for sub-1,300cc used imports is the policy loophole that allows cheap Japanese kei cars (Daihatsu Mira, Toyota Vitz) to undercut PSMC's Alto without facing the same duty burden as new CBU cars.</div>
      </div>

    </div>
  </div>`,
  },
  {
    id: 'summary',
    label: 'Summary',
    content: `<div class="section">
    <div class="section-label">10 · Executive Summary</div>
    <h2>Executive Summary</h2>
    <p>Five analytical points that ground any informed reading of Pakistan's listed auto sector.</p>

    <div class="exec-items">

      <div class="exec-item">
        <div class="exec-num">01</div>
        <div class="exec-text"><strong style="color:var(--text)">An assembly-led, policy-protected sector structured around a single tariff wall.</strong> Pakistan's car industry exists because CKD import duties are dramatically lower than CBU duties — making local assembly financially viable. Without this tariff differential, locally assembled cars would be uncompetitive against imported alternatives. The sector's earnings are therefore not simply a function of demand and supply — they are a function of government policy decisions that can be revised through a single SRO or Finance Bill provision. This policy dependence is the sector's most fundamental structural characteristic.</div>
      </div>

      <div class="exec-item">
        <div class="exec-num">02</div>
        <div class="exec-text"><strong style="color:var(--text)">Car assembler earnings are driven by two simultaneous cycles: PKR/JPY (which determines gross margin) and SBP policy rate (which determines volume).</strong> When both cycles are favourable — PKR stable/strong against JPY, KIBOR falling — earnings surge disproportionately due to operating leverage. When both are adverse — as in FY23 — earnings collapse. INDU is the most exposed to both cycles simultaneously; ATLH is structurally insulated from both, making its earnings profile fundamentally different from every car peer on the PSX.</div>
      </div>

      <div class="exec-item">
        <div class="exec-num">03</div>
        <div class="exec-text"><strong style="color:var(--text)">ATLH is a motorcycle manufacturer, not an assembler — a distinction that determines everything about its earnings profile.</strong> With 94.4% CD70 localisation, ATLH's cost structure is insensitive to JPY fluctuations, immune to LC restrictions on CKD imports, and unaffected by auto financing conditions (most CD70 purchases are cash). Its 10-year PAT CAGR of 21% reflects a business that earns through volume and pricing discipline rather than through cycle exposure. The analytical error is treating ATLH as comparable to car assemblers simply because both appear under "auto sector" on the PSX.</div>
      </div>

      <div class="exec-item">
        <div class="exec-num">04</div>
        <div class="exec-text"><strong style="color:var(--text)">Three structural risks define the sector's medium-term earnings range.</strong> First, used car import liberalisation — any extension of the sub-1300cc exemption or used car age limit would directly suppress PSMC and INDU volumes in ways that monetary easing cannot offset. Second, the IMF-driven tariff reform agenda — CBU duty reduction to 15% flat, if implemented, would structurally change the economics of local assembly. Third, the SBP Rs3M auto financing cap — set when cars cost Rs2M, it now creates an effective financing blackout for all locally assembled vehicles, dampening the transmission of rate cuts to auto volumes.</div>
      </div>

      <div class="exec-item">
        <div class="exec-num">05</div>
        <div class="exec-text"><strong style="color:var(--text)">Pakistan's auto EV transition is beginning, and it is not led by the incumbents.</strong> INDU launched Pakistan's first locally assembled HEV (Corolla Cross HEV) in December 2023. SAZEW launched Pakistan's first locally assembled PHEV (HAVAL H6 Hi4) in August 2025. ATLH is developing the ICON e electric motorcycle. PSMC and HCAR have no locally assembled EV/HEV products. The EV transition is not an immediate earnings catalyst — Pakistan's charging infrastructure is nascent and BEV penetration is negligible — but the companies that establish assembly capability now will be positioned differently when transition accelerates.</div>
      </div>

    </div>

    <div class="note-warn">
      DISCLAIMER · This module is produced for educational and informational purposes only. It does not constitute investment advice, a securities recommendation, or a solicitation to buy or sell any financial instrument. No buy, sell, or hold recommendation is expressed or implied. All data is sourced from publicly available secondary sources including PAMA, PSX filings, Topline Securities, Business Recorder, Profit Pakistan Today, PakWheels, Toyota Indus, and Atlas Honda public disclosures. Data reflects information available as of March 2026 and may not reflect subsequent developments. Readers should conduct their own independent research before making any financial decisions.
    </div>
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
        <div class="miss-title">Other Income From T-Bills Has Been Inflating EPS — And Will Normalise</div>
        <div class="miss-body">During the KIBOR 22% period (2022–2024), assemblers with large cash balances (primarily INDU and ATLH) earned Rs3–5B+ annually from short-term Treasury Bill placements. This income appeared in Other Income, inflating PAT and EPS dramatically. As KIBOR falls from 22% toward 10.5%, this income compresses proportionally. INDU's PAT surge in 9MFY25 (+75%) was driven by a combination of genuine demand recovery and operating leverage — but the Other Income decline has been absorbing part of those gains simultaneously. Analysts who strip out T-bill income from historical EPS find a structurally lower normalised earnings base.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">02 ·</div>
        <div class="miss-title">ATLH Is a Different Business From the Car Assemblers</div>
        <div class="miss-body">Atlas Honda is a motorcycle manufacturer — not a car assembler. The cost structure (domestic content vs CKD), the customer profile (rural, cash buyer, income-constrained), the demand driver (rural income cycles, KIBOR-insensitive), and the competitive landscape (2-3 domestic competitors, no used import threat) are all fundamentally different. Comparing ATLH's margins or growth rates to PSMC, INDU, or HCAR without acknowledging this structural distinction produces meaningless conclusions. ATLH is better compared to Yamaha Motor Pakistan or other motorcycle manufacturers than to any car assembler.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">03 ·</div>
        <div class="miss-title">The Rs3M SBP Auto Financing Cap Excludes All Locally Assembled Vehicles</div>
        <div class="miss-body">The SBP's auto finance restriction of a Rs3M cap means that no locally assembled passenger car (all of which cost Rs3M or above) is eligible for this type of subsidised financing. The cap was designed for used/affordable vehicles. In practice, this means car buyers rely on conventional commercial bank auto loans, which are KIBOR-linked and therefore sensitive to the rate cycle. The cap has had zero restrictive effect on the primary buyer pool for INDU, PSMC, and HCAR — it only matters if the cap is raised above Rs3M, which would expand the addressable financing-eligible buyer pool.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">04 ·</div>
        <div class="miss-title">Localisation Percentage Determines Gross Margin Trajectory Independently of Volume</div>
        <div class="miss-body">CKD kit costs are USD-denominated (primarily JPY for Japanese brands); localisation replaces imported parts with domestically sourced equivalents at PKR cost. A company that increases its localisation ratio from 55% to 65% has structurally shifted its cost base from FX-exposed to PKR-stable. INDU's Corolla Cross HEV localisation programme is the most important structural margin development in the sector — each percentage point of localisation gained reduces the gross margin sensitivity to JPY/PKR moves permanently. Volume changes are quarterly; localisation improvements are structural and non-reversible.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">05 ·</div>
        <div class="miss-title">Chinese Brand Trust Deficit Is Narrowing Faster Than Consensus Assumes</div>
        <div class="miss-body">When SAZEW launched HAVAL in 2022, the prevailing perception was that Chinese vehicles would struggle against established Japanese brands on quality and reliability. By 2025, SAZEW's HAVAL volumes and PHEV launch (H6 Hi4 PHEV) demonstrated that Pakistani consumers — particularly in the upper-mid segment — are now willing to pay for Chinese vehicles. The 73% volume surge after the PHEV launch was not explained by price alone; it reflected improving consumer confidence in Chinese brand quality. This trust improvement, if it continues, structurally widens the addressable market for SAZEW beyond what traditional Japanese brand loyalty models predicted.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Short-Cycle vs Long-Cycle Drivers</h2>
    <p class="deep-intro">Different variables operate on completely different time horizons. Conflating near-term noise with structural change is one of the most common analytical errors in sector research.</p>
    <div class="cycle-grid">
    <div class="cycle-col">
      <div class="cycle-header" style="color:#d4924a">NEAR TERM · 0–3 months</div>
      <div class="cycle-title">Quarterly EPS Drivers</div>
      <div class="cycle-item"><span class="cycle-driver">PAMA monthly volumes</span>Direct revenue driver; model-level data reveals whether demand growth is broad-based or concentrated in specific price points — critical for margin mix modelling.</div><div class="cycle-item"><span class="cycle-driver">PKR/JPY average rate</span>CKD kit cost moves proportionally with PKR/JPY; a 5% JPY strengthening without a corresponding domestic price increase compresses gross margin in the same quarter.</div><div class="cycle-item"><span class="cycle-driver">KIBOR and auto financing EMI levels</span>Financing-backed purchases reprice as rates change; KIBOR decline directly expands the pool of buyers who can afford EMIs on mid-range vehicles.</div><div class="cycle-item"><span class="cycle-driver">Other Income (T-bill) normalisation</span>Declining KIBOR reduces this income stream quarter-on-quarter; a company with Rs3–5B annual Other Income in FY24 will report significantly less in FY26, creating a headline EPS headwind.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#6aad6a">MEDIUM TERM · 3–18 months</div>
      <div class="cycle-title">Volume and Cost Structure Signals</div>
      <div class="cycle-item"><span class="cycle-driver">Localisation progress by model</span>Each percentage point of localisation gained reduces JPY exposure permanently; INDU's HEV localisation is the most consequential medium-term cost variable.</div><div class="cycle-item"><span class="cycle-driver">New model launch cycle</span>Post-launch demand surges absorb capacity and restore backlog; model gaps create booking slowdowns and inventory pressure.</div><div class="cycle-item"><span class="cycle-driver">AIDEP 2026-31 policy framework</span>New-entrant concessions, EV tariff policy, and localisation requirements will reshape competitive dynamics for all assemblers for the next five years.</div><div class="cycle-item"><span class="cycle-driver">Used car import flow and duty structure</span>Used Japanese imports directly compete with new locally assembled cars; import volumes and duty changes alter the competitive pricing environment for PSMC and INDU primarily.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#4a9eff">STRUCTURAL · 18 months+</div>
      <div class="cycle-title">Decade-Scale Determinants</div>
      <div class="cycle-item"><span class="cycle-driver">Electric and hybrid vehicle transition</span>The pace at which Pakistan's consumers and infrastructure support EVs/HEVs determines whether INDU's HEV investment or SAZEW's PHEV launch represents the direction of the market or an early niche.</div><div class="cycle-item"><span class="cycle-driver">IMF tariff liberalisation</span>If CBU import duties fall toward 15%, fully assembled vehicles from China, Korea, and Japan become competitively priced against locally assembled equivalents — the most structurally negative scenario for all assemblers.</div><div class="cycle-item"><span class="cycle-driver">Chinese brand market share ceiling</span>Whether Chinese vehicles (SAZEW, MG, KIA, Hyundai Nishat) stabilise at 20–25% of the market or continue growing toward 40–50% determines the long-term competitive structure.</div><div class="cycle-item"><span class="cycle-driver">SBP auto finance cap revision</span>If raised above Rs3M, it directly expands the financing-eligible buyer pool for all car assemblers — potentially the most impactful single regulatory change available.</div>
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
        <div class="connect-body">The strongest transmission mechanism in the sector. Auto financing EMIs are KIBOR-linked. At KIBOR 22%, a Rs3.5M vehicle required EMIs of approximately Rs100,000–120,000/month on a 5-year loan — beyond most middle-class incomes. At KIBOR 10.5%, the same vehicle is significantly more affordable. The 2024–2025 rate cut cycle (22% to 10.5%) is the primary explanation for INDU's volume and PAT recovery — more so than any operational improvement.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">💱</span>
        <div class="connect-title">Currency (PKR/JPY)</div>
        <div class="connect-body">The primary cost-side transmission mechanism. CKD kits for Toyota (INDU), Suzuki (PSMC), Honda (HCAR), and partially for SAZEW are JPY-invoiced. A 10% JPY strengthening against PKR raises the landed cost of every kit proportionally. If domestic prices are not raised simultaneously (due to competitive pressure or consumer resistance), the entire FX impact flows directly to gross margin compression. This makes PKR/JPY tracking more important for gross margin forecasting than PKR/USD.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">⛽</span>
        <div class="connect-title">Fuel Prices</div>
        <div class="connect-body">Indirect effect through vehicle category demand. Rising petrol prices make motorcycles and fuel-efficient vehicles (HEV, PHEV) relatively more attractive; falling petrol prices reduce the HEV fuel-saving calculus. For ATLH specifically, higher fuel prices increase the motorcycle's relative affordability advantage over cars — potentially a demand tailwind at the margin. The CD70's fuel efficiency is a primary purchase justification for rural and urban commuter buyers.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏛️</span>
        <div class="connect-title">Government Policy</div>
        <div class="connect-body">Finance Bill WHT changes, FED on large-engine vehicles, EV/HEV duty concessions, SRO issuances, AIDEP frameworks, SBP financing caps — all are direct earnings variables. The auto sector is among the most policy-sensitive on both the demand side (taxation of buyers) and the supply side (tariff structure on CKD and CBU imports). An SRO can restructure competitive dynamics overnight without parliamentary process.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏠</span>
        <div class="connect-title">Consumer Income and Sentiment</div>
        <div class="connect-body">Auto purchases are discretionary and income-correlated. In periods of high inflation eroding real wages, even if KIBOR falls, consumers defer vehicle purchases. Remittance income (Gulf, Saudi Arabia, UK) is an important purchasing power source for both car and motorcycle buyers. Rural income cycles (crop harvest payments) drive ATLH motorcycle demand on an agricultural calendar that is distinct from the urban income cycle driving car demand.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Business Model Winners &amp; Losers</h2>
    <p class="deep-intro">Different business model structures within this sector face systematically different conditions. The following describes which model characteristics tend to generate or destroy earnings margin under specific environments — without reference to specific companies as recommendations.</p>
    <div class="model-grid">
      <div class="model-card model-card-up">
        <div class="model-card-title">TENDS TO BENEFIT WHEN — High localisation, low debt, captive demand model (motorcycles)</div>
        <div class="model-row"><span class="model-condition">KIBOR rate cut cycle</span>Expanding the financing-eligible buyer pool for car assemblers by reducing EMI to accessible levels; direct and proportional volume impact on INDU, PSMC, HCAR, SAZEW.</div><div class="model-row"><span class="model-condition">JPY weakening against PKR</span>Reduces CKD kit cost directly without any operational action; gross margin expands proportionally for the CKD-kit content of the vehicle.</div><div class="model-row"><span class="model-condition">Post-model-launch demand surge</span>New model launches generate booking queues and waiting lists; assemblers in this phase have pricing power (no discount needed) and full capacity utilisation.</div><div class="model-row"><span class="model-condition">Rural income recovery (for ATLH)</span>Strong wheat or cotton harvest increases rural purchasing power; CD70 and related motorcycle demand surges in the post-harvest window from farmers converting crop income to durable goods.</div>
      </div>
      <div class="model-card model-card-dn">
        <div class="model-card-title">TENDS TO FACE PRESSURE WHEN — Low localisation, CKD-dependent, high-price point</div>
        <div class="model-row"><span class="model-condition">JPY strengthening against PKR</span>Raises CKD kit cost immediately; if domestic prices cannot be raised (due to competition or consumer resistance), the full FX impact flows to gross margin compression.</div><div class="model-row"><span class="model-condition">Used Japanese imports surge</span>If SROs reduce used car import duties or restrictions, consumer choice broadens; assemblers face price competition from vehicles with lower total cost of ownership in secondary markets.</div><div class="model-row"><span class="model-condition">KIBOR rate spike (return to 20%+)</span>EMI affordability collapses; booking cancellations and inventory buildup follow; assemblers are forced to either hold inventory at cost or offer price concessions that compress margin.</div><div class="model-row"><span class="model-condition">IMF CBU tariff liberalisation</span>If fully assembled car import duties fall significantly, Chinese and Korean vehicles enter at competitive prices without requiring local manufacturing — the most structurally adverse scenario.</div>
      </div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Structural Questions</h2>
    <p class="deep-intro">The major unresolved debates, policy uncertainties, and structural questions that will shape this sector over the next three to seven years. These are not predictions — they are the analytical dimensions that require active monitoring.</p>
    <div class="sq-list">
    <div class="sq-item">
      <div class="sq-q">Does Pakistan have a viable domestic EV market on a 5-year horizon?</div>
      <div class="sq-context">SAZEW's PHEV launch and INDU's HEV demonstrate that hybrid technology is commercially viable in Pakistan today. Fully electric vehicles require charging infrastructure that does not exist at scale in Pakistan. Whether the government's EV policy creates the demand-side incentives and the supply-side infrastructure needed for genuine EV market development within 5 years determines the strategic relevance of each assembler's EV investment.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">What happens to Pakistani assemblers if CBU tariffs are meaningfully reduced under IMF pressure?</div>
      <div class="sq-context">Pakistan's auto sector currently benefits from very high CBU import tariffs that effectively price fully assembled imports out of the market. If IMF conditionality or WTO commitments force these tariffs toward 15–25%, Chinese vehicles assembled in China (not Pakistan) can be competitively priced against locally assembled equivalents. This is the sector's most structurally threatening policy scenario and has never fully materialised despite repeated IMF programme discussions.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Can SAZEW sustain Chinese brand market share above 15% or does novelty demand normalise?</div>
      <div class="sq-context">The HAVAL H6 PHEV drove a 73% volume surge in the month of launch. Whether this is the beginning of sustained market share capture for Chinese vehicles or a novelty demand spike that normalises will be revealed by 4–6 quarters of post-launch PAMA data. The answer determines whether SAZEW's current market position is defensible or whether Japanese brand loyalty ultimately reasserts itself.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Is INDU's HEV localisation programme commercially viable at Pakistan's production volumes?</div>
      <div class="sq-context">Localisation at small production runs (INDU produces ~30,000 vehicles/year total) carries high per-unit fixed costs for local tooling and supplier development. Whether the HEV localisation programme reaches cost parity with imported kit at Pakistan's production volumes determines whether the margin improvement is real or whether it is being cross-subsidised from other models. The answer emerges from INDU's gross margin trend over the next 4–6 quarters.</div>
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
        <div class="dpeer-accent-bar" style="background:#d4924a"></div>
        <div class="dpeer-ticker">PSMC</div>
        <div class="dpeer-name">Pak Suzuki Motor Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Volume-led mass-market assembler — dominant in entry-level and sub-1000cc segment; highest unit volumes in the sector; most exposed to KIBOR cycle through its affordable-segment buyer profile</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">KIBOR rate cuts + rural income recovery: PSMC's buyer is the most income-constrained and financing-dependent; rate cuts most directly expand PSMC's addressable buyer pool</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">JPY strengthening + used import surge: PSMC's low-price models have the thinnest absolute gross margins; any cost increase cannot be passed through without losing volume to used imports</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led — PAT depends on maintaining high volumes at thin per-unit margins; scale is the primary earnings driver rather than premium positioning</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">INDU — Both are large-volume Japanese brand assemblers; the distinction is PSMC in the entry-level segment (more KIBOR-sensitive, thinner margins) vs INDU in the mid-to-upper segment (better margins, more localisation potential)</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#6aad6a"></div>
        <div class="dpeer-ticker">INDU</div>
        <div class="dpeer-name">Indus Motor Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Margin-led quality assembler — Toyota brand, higher price points, highest localisation investment (HEV), strong Other Income historically from T-bill portfolio</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Mid-upper segment demand recovery + JPY weakening + HEV localisation progress: all three improve INDU's unit economics simultaneously</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">JPY strengthening + Other Income normalisation: INDU's gross margin is most at risk from JPY moves because HEV and Corolla Cross content is still majority CKD; T-bill income declining from KIBOR cuts simultaneously</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Margin-led and balance-sheet-led — operating margin and T-bill income together define EPS; HEV localisation is the structural margin improvement thesis</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">PSMC — The natural comparison within the Japanese-brand CKD segment; INDU is the higher-quality, higher-margin, lower-volume alternative — the comparison isolates whether premium positioning creates durable margin advantage</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c8a96e"></div>
        <div class="dpeer-ticker">HCAR</div>
        <div class="dpeer-name">Honda Atlas Cars Pakistan</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Mid-market volume assembler — Honda brand, civil/government segment strength, smaller volume base than PSMC and INDU</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Civil and corporate fleet demand + stable JPY: HCAR's buyer profile includes corporate fleets and government vehicles that are budget-allocated rather than financing-dependent; less KIBOR-sensitive</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">JPY appreciation + new model gap: HCAR has periodic new model introduction gaps; without a new model driving bookings, volume drops sharply and capacity utilisation falls below fixed-cost absorption threshold</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led — volumes are the primary EPS driver; HCAR does not have INDU's localisation advantage or PSMC's entry-level volume scale</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">INDU — Both are Japanese mid-market brands; HCAR's CKD-dependence is higher than INDU's due to lower localisation investment; the comparison quantifies the value of INDU's localisation programme as a structural cost advantage</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#4fb88a"></div>
        <div class="dpeer-ticker">ATLH</div>
        <div class="dpeer-name">Atlas Honda Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Margin-stable, volume-dominant motorcycle manufacturer — CD70 is essentially a utility commodity product; rural income cycle is the primary demand driver, not KIBOR</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Rural income surge + stable fuel prices: strong agricultural harvest income drives CD70 demand sharply; ATLH also benefits from consistent spare parts and engine oil revenue that is recurring and less cyclical than new vehicle sales</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Rural income collapse + credit restriction in agriculture: if crop yields fail or agricultural credit dries up, ATLH volumes fall sharply — a risk that is largely independent of the urban macro cycle that affects car assemblers</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led and margin-stable — ATLH does not have the JPY/CKD exposure of car assemblers; its costs are more domestically anchored, making margins more predictable across cycles</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">PSMC — Both target volume leadership in their categories; ATLH's motorcycle model is fundamentally different in cost structure, demand driver, and competitive dynamics — the comparison is most useful to show what a genuinely mass-market, rural-oriented Pakistani vehicle business looks like vs an urban, financing-dependent one</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c86e8f"></div>
        <div class="dpeer-ticker">SAZEW</div>
        <div class="dpeer-name">Sazgar Engineering Works</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Disruptive new-entrant operator — first Chinese brand assembled at scale; HAVAL and PHEV launch signal appetite for Chinese vehicle localisation; also holds legacy three-wheeler (CNG rickshaw) business</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Chinese brand trust improvement + hybrid technology adoption: PHEV launch with 73% volume surge validates the hypothesis that Pakistani consumers are ready for Chinese brand quality at competitive prices</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Japanese brand loyalty reassertion + Chinese supply chain disruption: if quality perception deteriorates after initial novelty or Chinese OEM support weakens, SAZEW's volume would revert sharply; three-wheeler revenue decline accelerates if CNG availability falls</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Brand-led and volume-led — the HAVAL brand equity in Pakistan is SAZEW's primary differentiator; volume growth is the proof point; without volume, the legacy rickshaw business alone cannot sustain the strategic rationale for the Chinese brand investment</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">INDU — The most relevant comparison is the HEV/PHEV race: INDU Corolla Cross HEV vs SAZEW HAVAL H6 PHEV represents the Japanese vs Chinese brand competition in the technology-forward vehicle category — the outcome of this comparison will determine relative market share at the segment level</span></div>
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
        <td><span class="pfinal-ticker">PSMC</span></td>
        <td>Volume-led mass-market assembler</td>
        <td>Rate cuts + rural income + stable JPY</td>
        <td>JPY spike + used import surge</td>
        <td>Highest unit volumes, Suzuki brand loyalty in entry segment</td>
        <td>Thinnest margins, entry-level exposure to used import competition</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">INDU</span></td>
        <td>Margin-led quality assembler</td>
        <td>Mid-upper demand recovery + JPY weakening + HEV localisation</td>
        <td>JPY strengthening + Other Income normalisation</td>
        <td>Toyota brand, highest localisation, HEV technology lead</td>
        <td>T-bill income declining, HEV localisation not yet complete</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">HCAR</span></td>
        <td>Mid-market volume assembler</td>
        <td>Corporate fleet demand + stable JPY</td>
        <td>New model gap + JPY appreciation</td>
        <td>Honda brand, corporate/fleet segment strength</td>
        <td>Lowest localisation, volume most sensitive to model cycle</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">ATLH</span></td>
        <td>Volume-dominant motorcycle manufacturer</td>
        <td>Rural income surge + stable fuel prices</td>
        <td>Agricultural income collapse + CNG disruption</td>
        <td>CD70 volume dominance, recurring parts/oil revenue</td>
        <td>Entirely rural income-cycle dependent; not KIBOR-sensitive</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">SAZEW</span></td>
        <td>Disruptive Chinese brand operator</td>
        <td>Chinese trust improvement + PHEV adoption surge</td>
        <td>Brand perception deterioration + Japanese brand reassertion</td>
        <td>HAVAL PHEV first-mover, GWM Chinese OEM backing</td>
        <td>Novelty demand risk, legacy rickshaw business declining</td>
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
      <div class="metric-name">PAMA Monthly Sales Volume — By Company and Model</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Pakistan Automobile Manufacturers Association monthly registration data showing units sold by each assembler, broken down by model</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The primary real-time volume indicator — preceding quarterly results by 6–10 weeks; model-level data reveals demand mix shifts that affect margin composition</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">PAMA data captures registrations, not production; a mismatch between production and registration timing can distort quarterly comparisons — inventory build is not captured in PAMA sales figures</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">SBP auto financing data (to assess what proportion of sales are finance-backed vs cash) and booking/waiting list disclosures (to assess demand pipeline beyond current sales)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">KIBOR 3-Month Rate</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The Karachi Interbank Offered Rate at 3-month tenor — the primary benchmark for auto financing loan pricing</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Directly determines the monthly EMI on a Rs3–4M vehicle over a 5-year term; KIBOR falling from 22% to 10.5% reduced EMI by approximately 35%, directly expanding the addressable buyer pool</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">KIBOR changes affect new financing agreements immediately but do not change existing fixed-rate auto loans; the volume impact of rate changes takes 2–3 months to appear in PAMA data as new buyers act</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">SBP auto finance outstanding balance (to see the actual stock of finance-backed vehicles on the road) and consumer confidence indices (to assess whether rate cuts are translating into actual purchase intent)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">PKR/JPY Monthly Average Exchange Rate</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The exchange rate between Pakistani Rupee and Japanese Yen — the primary cost-side transmission mechanism for all CKD-kit-based Japanese brand assemblers</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">A 10% JPY strengthening against PKR raises CKD kit cost by approximately 10% on the CKD component of each vehicle; if the vehicle is 60% CKD content, gross margin impact is 6% of vehicle cost</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">The PKR/JPY impact is diluted by the localisation ratio — a company with 70% local content is only 30% exposed to JPY; comparing two companies without adjusting for their different localisation ratios produces an incorrect relative sensitivity conclusion</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Localisation % per company (to adjust the FX sensitivity correctly) and domestic vehicle price trends (to assess whether FX pass-through to consumer prices is occurring or is being absorbed)</span></div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">13 · Metrics Framework</div>
    <h2 class="deep-h2">Company-Level Metrics</h2>
    <p class="deep-intro">Firm-level metrics that matter most when reading quarterly results and annual filings. For each metric: what it measures, why it matters, when it misleads, and what to read alongside it.</p>
    <div class="metric-card">
      <div class="metric-name">Gross Margin % (Revenue - COGS) / Revenue</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The percentage of revenue remaining after direct production costs — captures the combined effect of CKD kit costs, localisation, pricing power, and volume leverage</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The most important quarterly margin metric for car assemblers; a sustained decline signals either FX cost pressure, pricing competition, or localisation regression; an improvement signals one or more of these factors moving favourably</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Volume leverage can temporarily improve gross margin as fixed overhead spreads over more units without any underlying improvement in per-unit economics — always check volumes alongside margin to separate leverage from genuine improvement</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">PAMA volumes (for volume leverage context), PKR/JPY rate (for cost context), and localisation disclosures (for structural cost change context)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Other Income — Absolute Level and YoY Trend</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Income from T-bill/money market investments, exchange gains, and other non-operational sources reported below operating profit</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">During KIBOR 22%, Other Income was Rs3–5B annually for INDU and ATLH — a significant portion of PAT. As KIBOR falls, this income normalises. Tracking the decline is essential for understanding real EPS trend vs reported EPS trend</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Other Income decline can be partially offset by operating margin improvement; a company that looks like it is delivering flat EPS despite rate cuts may actually be growing its core automotive margin while absorbing Other Income decline</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Operating profit before Other Income (to see the core business earnings trend), KIBOR trajectory (to estimate the remaining normalisation path), and cash/investment balance (to scale the expected Other Income by the investable asset base)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Localisation Percentage by Model</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The percentage of a vehicle's content that is sourced domestically (in PKR) versus imported (in JPY or USD)</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Determines the structural FX sensitivity of gross margin; higher localisation means lower exposure to PKR/JPY volatility and more predictable cost structure; each percentage point gained is a permanent structural improvement</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A company can report improved localisation by substituting less value-added domestic parts for more value-added imported parts — if the local parts are lower quality or margin-accretive, the effective localisation improvement is less than stated</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Gross margin trend (to verify that localisation improvement is actually flowing to margin) and warranty/recall rates (to monitor whether quality is maintained as local content increases)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Booking Backlog and Waiting List Duration</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The number of undelivered confirmed orders and the estimated delivery wait time — a qualitative demand health indicator</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Long waiting lists indicate demand exceeds current supply capacity; the assembler has pricing power (no discounts needed) and full utilisation; short waiting lists indicate demand softness or excess supply</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Management guidance on waiting lists is inherently optimistic; cross-reference with PAMA monthly data to see whether actual delivery volumes are accelerating or if the backlog is growing because of production constraints rather than demand strength</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Production volumes (to assess whether supply is constrained or demand is genuinely overwhelming capacity) and KIBOR trend (to anticipate whether the demand driving the backlog is financing-dependent and therefore rate-sensitive)</span></div>
    </div>
  </div>`,
  }
  ],
};

export default sector;

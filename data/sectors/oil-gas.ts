// data/sectors/oil-gas.ts
// Auto-generated from pakistan_oil_gas_sector_module.html
// Content: 13 tabs of sector intelligence for the Oil & Gas E&P sector.

import type { SectorData } from "./types";

const sector: SectorData = {
  slug: 'oil-gas',
  name: 'Oil & Gas',
  volume: 'Sector Intelligence Module · Volume I',
  subtitle: 'A structured analytical framework covering how exploration and production companies operate in Pakistan, what drives the oil-linked and gas-linked earnings, and how OGDC, PPL, MARI, and POL differ structurally.',
  accentColor: '#d4a843',
  stats: [
  { val: '$4.15B', lbl: 'OGDC Market Cap (Dec 2025)' },
  { val: 'Rs247B', lbl: '4-Company Combined PAT (1HFY24)' },
  { val: '~239 Mbbl', lbl: 'Listed E&P Oil Reserves (mid-2025)' },
  { val: '~19 Tcf', lbl: 'Listed E&P Gas Reserves (mid-2025)' },
  { val: 'Rs3.0T', lbl: 'E&P Petroleum Circular Debt (mid-2024)' }
  ],
  tabs: [
  {
    id: 'overview',
    label: 'Overview',
    content: `<div class="section">
    <div class="section-label">01 · Sector Overview</div>
    <h2>What the Sector Does</h2>
    <p>Pakistan's upstream oil and gas sector — exploration and production (E&P) — locates hydrocarbon reserves beneath the surface, drills wells to extract them, and sells the output to downstream buyers. E&P companies do not refine, distribute, or retail fuel; they operate at the very first link in the energy supply chain. Their customers are either gas utilities (SNGPL, SSGC) who buy natural gas, or oil refineries (PSO, PARCO, Attock Refinery) that buy crude oil and condensate.</p>
    <p>Pakistan's E&P sector is predominantly gas-oriented. Gas accounts for approximately 70–75% of listed E&P company revenues. Domestic gas production supplies roughly 75–80% of Pakistan's total gas demand; the balance is imported as LNG. Oil production meets only ~20% of domestic crude requirements, with the rest imported. Both deficits are growing as mature fields decline faster than new discoveries offset them — making reserve replacement the sector's defining long-term challenge.</p>

    <div class="chain-wrap">
      <div class="chain-lbl">Pakistan E&amp;P — Full Value Chain Position</div>
      <div class="chain">
        <div class="chain-node" style="border-top:2px solid var(--ogdc);">
          <div class="cn-lbl">Exploration</div>
          <div class="cn-val">Seismic surveys, block bidding, wildcat drilling</div>
          <div class="cn-sub">Where new reserves are found — or dry holes are drilled</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--ogdc);">
          <div class="cn-lbl">Development</div>
          <div class="cn-val">Appraisal wells, facilities construction, field development</div>
          <div class="cn-sub">Converts discoveries to producing assets</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--mari);">
          <div class="cn-lbl">Production</div>
          <div class="cn-val">Wellhead extraction of oil, gas, LPG, condensate</div>
          <div class="cn-sub">E&P revenue starts here — at the wellhead</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--ppl);">
          <div class="cn-lbl">Gas Utilities</div>
          <div class="cn-val">SNGPL / SSGC buy gas at wellhead price</div>
          <div class="cn-sub">Circular debt risk resides here</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--ppl);">
          <div class="cn-lbl">Refineries</div>
          <div class="cn-val">Buy crude oil and condensate</div>
          <div class="cn-sub">Paid in line with international crude benchmarks</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--pol);">
          <div class="cn-lbl">End Consumer</div>
          <div class="cn-val">Industry, power, fertiliser, households</div>
          <div class="cn-sub">Non-payment cascades back up the chain</div>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    <h2>Why It Matters on PSX</h2>
    <ul class="bl">
      <li>OGDC is the single largest company by market capitalisation on PSX (~$4.15B as of Dec 2025), making the E&P sector the most heavily weighted in the KSE-100 index.</li>
      <li>E&P companies are direct PKR/USD proxies — revenues are partially indexed to international oil prices and USD, while costs are mostly PKR. Currency movements create significant and trackable EPS sensitivity.</li>
      <li>The sector's circular debt problem (~Rs3T in the petroleum segment at peak) has been the primary discount applied to E&P share prices for years. Reforms that improve payment flows directly unlock valuation.</li>
      <li>Quarterly results and reserve data are among the most information-rich disclosures on PSX — enabling analysts to track production trends, exploration success rates, and cash recovery rates in real time.</li>
      <li>All four major E&P companies (OGDC, MARI, PPL, POL) are significant dividend payers when cash flows permit — making them income-relevant alongside growth.</li>
    </ul>

    <div class="divider"></div>
    <h2>Main Listed Players Covered</h2>
    <div class="bar-chart">
      <div class="bar-head">Approximate Contribution to Sector PAT (1HFY24)</div>
      <div class="bar-row">
        <div class="bar-lbl">OGDC</div>
        <div class="bar-track"><div class="bar-fill" style="width:100%;background:var(--ogdc);"></div></div>
        <div class="bar-val">Rs123.3B · ~50%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">PPL</div>
        <div class="bar-track"><div class="bar-fill" style="width:56%;background:var(--ppl);"></div></div>
        <div class="bar-val">Rs68.8B · ~28%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">MARI</div>
        <div class="bar-track"><div class="bar-fill" style="width:39%;background:var(--mari);"></div></div>
        <div class="bar-val">Rs48.2B · ~19%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">POL</div>
        <div class="bar-track"><div class="bar-fill" style="width:14%;background:var(--pol);"></div></div>
        <div class="bar-val">Rs17.6B · ~7%</div>
      </div>
    </div>
    <p style="margin-top:10px;font-size:12.5px;">The listed E&P universe also includes smaller companies (PKOL, HASCOL, PEL, NRL). This module focuses on the four largest by revenue, reserves, and institutional analytical coverage.</p>
  </div>`,
  },
  {
    id: 'economics',
    label: 'Economics',
    content: `<div class="section">
    <div class="section-label">02 · How the Sector Makes Money</div>
    <h2>Revenue Model</h2>
    <p>E&P revenue is generated from the sale of three hydrocarbon products: <strong style="color:var(--text)">natural gas</strong> (sold to SNGPL/SSGC at OGRA-notified wellhead prices), <strong style="color:var(--text)">crude oil</strong> (sold to domestic refineries at prices linked to international benchmarks such as Arabian Light Crude, adjusted for quality and geography), and <strong style="color:var(--text)">LPG and condensate</strong> (smaller but higher-margin products priced closer to international parity).</p>
    <p>Critically, E&P revenues in Pakistan are partially USD-linked. Crude oil prices directly track international benchmarks in USD. Gas wellhead prices under post-2012 policies are partly indexed to international crude oil prices. This means PKR/USD movements create automatic revenue changes even with no operational change — a fundamental characteristic that distinguishes E&P from purely domestic sectors.</p>
    <ul class="bl">
      <li><strong style="color:var(--text)">Gas revenue (~70–75% of total):</strong> Priced at OGRA-notified wellhead prices per MMbtu. Prices vary by block, policy regime, and field age. Post-2012 Petroleum Policy fields have crude oil-indexed pricing; older fields (notably MARI's Mari Gas Field) had cost-plus structures that were subsequently revised. Gas is sold to SNGPL/SSGC — utilities that are the primary source of circular debt risk.</li>
      <li><strong style="color:var(--text)">Crude oil revenue (~20–25% of total):</strong> Priced at international benchmarks (Arabian Light/Brent) adjusted for API gravity, sulphur content, and freight. POL and PPL are relatively more oil-weighted than OGDC and MARI. Sold to domestic refineries; payment is generally more reliable than gas utility payments.</li>
      <li><strong style="color:var(--text)">LPG, condensate, sulphur (~5–10%):</strong> Higher unit margins, sold at international-linked prices. MARI and POL have meaningful LPG contributions. Condensate is processed at the field and sold to refineries.</li>
    </ul>

    <div class="divider"></div>
    <h2>Cost Structure</h2>
    <ul class="bl">
      <li><strong style="color:var(--text)">Royalties:</strong> Typically 12.5% of wellhead value — paid to the federal and provincial governments as a first charge on production. Non-discretionary and volume-dependent.</li>
      <li><strong style="color:var(--text)">Operating expenses (field production costs):</strong> Pumping, processing, lifting, and field maintenance. Relatively fixed in the short term — declining production volumes spread these costs over fewer units, raising per-unit cost.</li>
      <li><strong style="color:var(--text)">Depletion, depreciation, and amortisation (DD&A):</strong> Large non-cash charge. As hydrocarbons are extracted, the capitalised cost of finding and developing those reserves is amortised against production. Rising DD&A signals accelerating extraction from ageing fields.</li>
      <li><strong style="color:var(--text)">Exploration expenses:</strong> Seismic survey costs and dry well write-offs are expensed in the period they fail (unsuccessful exploration). A dry well or abandoned prospect creates a one-time earnings hit. A successful discovery is capitalised and then depleted over the field life.</li>
      <li><strong style="color:var(--text)">Taxes:</strong> Corporate income tax, super tax, and petroleum income tax (depending on policy regime). Effective tax rates are structurally high for E&P companies — often 35–50%+ including super tax in recent years. ETR is the most significant and frequently misread non-operational EPS variable in this sector.</li>
    </ul>

    <div class="divider"></div>
    <h2>What Expands Earnings</h2>
    <ul class="bl">
      <li>PKR depreciation — same USD-referenced revenue converts to more rupees at no operational cost; the single most powerful near-term EPS driver historically</li>
      <li>International oil price increase — directly raises crude realisation and, through indexation, some gas wellhead prices</li>
      <li>Gas wellhead price increase — OGRA-notified; directly raises the largest revenue line (government policy-driven)</li>
      <li>Volume growth via new discoveries or development wells — the highest-quality earnings growth, as it improves reserves simultaneously</li>
      <li>Other income from delayed payment surcharges — E&P companies accrue interest on overdue SNGPL/SSGC payments; at Rs3T of overdue receivables and KIBOR rates, this income was very substantial in 2023–2024</li>
      <li>Lower exploration write-offs — fewer dry wells reduce period expenses; success rate varies significantly by company</li>
      <li>Lower super tax / effective tax rate — policy and period-specific</li>
    </ul>

    <h2>What Compresses Earnings</h2>
    <ul class="bl">
      <li>PKR appreciation — reduces rupee value of USD-linked revenues with no change in operations</li>
      <li>International oil price decline — reduces crude realisation and gas price indexation</li>
      <li>Natural field production decline — mature fields lose 10–15% production annually without active investment; OGDC's mature fields are the primary sector challenge</li>
      <li>Higher exploration write-offs — failed wells or abandoned blocks create one-time losses; POL's Balkassar Deep-1A dry well drove a 41% PAT decline in 9MFY25</li>
      <li>Circular debt payment delays — cash not received means inability to fund capex, dividend pressure, and financing costs on overdraft</li>
      <li>Super tax and retrospective tax provisions — higher rates or retroactive impositions create sharp single-quarter EPS compression</li>
      <li>Higher DD&A — as production from older, fully-amortised wells is replaced by newer (higher book cost) wells</li>
    </ul>

    <div class="note amber">Gross margin context: E&P companies run high gross margins (55–65%) because the primary cost items (royalties, DD&A) are not cash costs in the traditional sense. The sector's real cash constraint is receivables — cash margin is often far lower than reported gross margin because a significant portion of billings go uncollected from SNGPL/SSGC for months or years.</div>
  </div>`,
  },
  {
    id: 'variables',
    label: 'Variables',
    content: `<div class="section">
    <div class="section-label">03 · Key Variables to Track</div>
    <h2>Variables That Move Earnings</h2>
    <p>Arrows indicate the directional impact on earnings or margins when the variable moves in the stated direction. "↑ Positive" means an increase in this variable is favourable for earnings.</p>

    <div class="tbl-wrap">
      <table class="var-tbl" style="min-width:620px;">
        <thead>
          <tr>
            <th style="width:200px;">Variable</th>
            <th>What It Is &amp; Why It Matters</th>
            <th style="width:130px;">Earnings Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr class="section-row"><td colspan="3">Price &amp; FX</td></tr>
          <tr>
            <td class="vname">PKR/USD Exchange Rate</td>
            <td>The single most powerful near-term EPS variable for Pakistani E&P companies. Crude oil realisations are USD-benchmarked; gas wellhead prices (post-2012 fields) are partially USD-indexed. PKR depreciation raises rupee revenue automatically with no operational change. In 1HFY24, the 22% PKR depreciation was the primary driver of the sector's 36% PAT jump despite relatively flat volumes. Conversely, PKR appreciation in FY25 (USD/PKR strengthening) compressed EPS across the board.</td>
            <td class="down">PKR depreciation ↓ = ↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">International Crude Price (Brent/Arab Light)</td>
            <td>Pakistan's domestic crude is priced at an international benchmark (typically Arabian Light Crude) adjusted for quality and freight. Brent is the global indicator. Higher oil prices improve crude realisation directly. Also feeds into gas wellhead prices via indexation clauses in post-2012 PPAs. Every $10/barrel move in crude has a material sector-wide EPS impact — primarily for OGDC and PPL which have larger crude components.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Gas Wellhead Price (Rs/MMbtu)</td>
            <td>OGRA-notified price paid by SNGPL/SSGC to E&P companies for gas at the wellhead. Varies by block, policy regime, and field vintage. Price revisions are infrequent but impactful — the government raised wellhead prices significantly twice in late 2023 and early 2024 to reduce utility revenue shortfalls. For MARI, the wellhead price of Mari Gas Field has its own distinct history and was revised to crude oil-indexed pricing in 2014–15. Gas prices matter most for MARI (gas-dominant) and OGDC (largest gas volumes).</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr class="section-row"><td colspan="3">Volume &amp; Production</td></tr>
          <tr>
            <td class="vname">Hydrocarbon Production (BOE/day)</td>
            <td>Total daily output of oil (barrels) and gas (MMscfd), converted to a common unit (BOE). The core volume metric. Production naturally declines 10–15% annually at mature fields without new development wells. OGDC's sector-wide production challenge is its large portfolio of ageing fields (Kunnar, Nashpa, Adhi) whose natural decline rates require ongoing capital reinvestment just to hold flat. MARI's Ghazij/Shawal discoveries represent genuine incremental volume from new reservoirs within the Mari field structure.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Reserve Replacement Rate (RRR)</td>
            <td>New reserves discovered/acquired as a percentage of production in the same period. An RRR below 100% means reserves are being depleted faster than replaced — the company's asset base is shrinking. MARI's 70%+ exploration success rate (vs ~33% national average, ~14% international average) is structurally the strongest in the sector. OGDC's large scale makes RRR harder to sustain but its tight gas programme targets exactly this gap. RRR trends are the best leading indicator of long-term production trajectory.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Exploration Success Rate &amp; Well Results</td>
            <td>Each exploratory well is a binary outcome — discovery (reserves and future revenue) or dry hole (immediate write-off). Quarterly exploration expense is the most volatile cost line for E&P companies. A single dry well can add Rs3–10B in charges to a quarter. Conversely, a significant discovery announcement triggers positive market re-rating and adds to reserve life. POL's 9MFY25 earnings fell 41% primarily because of one dry well (Balkassar Deep-1A). Monitor DGPC well completion notifications.</td>
            <td class="up">Success ↑ Positive</td>
          </tr>
          <tr class="section-row"><td colspan="3">Receivables &amp; Policy</td></tr>
          <tr>
            <td class="vname">Circular Debt &amp; Payment Receipts</td>
            <td>SNGPL and SSGC owe E&P companies for gas delivered but not yet paid for. At peak (mid-2024), the petroleum circular debt stood at Rs3T. E&P companies book revenue when gas is delivered (accrual basis) but receive cash only when utilities pay — sometimes months later. The gap means reported EPS overstates cash earnings. When payments flow (as during the Sep-2025 refinancing), cash earnings surge and dividend capacity improves. When payments halt, capex and dividends are curtailed.</td>
            <td class="up">Payment receipts ↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Other Income (Delayed Payment Surcharge)</td>
            <td>E&P companies are entitled to a delayed payment surcharge (essentially interest) on overdue SNGPL/SSGC receivables. At high KIBOR rates (22%) and Rs3T of overdue receivables, this "other income" line became exceptionally large — nearly doubling OGDC's other income in some periods. As circular debt resolves and KIBOR declines, delayed payment surcharge income will normalise downward. Must be distinguished from operational earnings when reading results.</td>
            <td class="up">↑ Positive (while elevated)</td>
          </tr>
          <tr>
            <td class="vname">Super Tax &amp; Effective Tax Rate (ETR)</td>
            <td>E&P companies face structurally high effective tax rates — corporate income tax, super tax (introduced at 10% for large companies), and petroleum income tax depending on the concession agreement regime. Retrospective super tax applications in FY23 caused sharp single-quarter EPS collapses. ETR can swing from 28% to 61% between quarters depending on provisions, deferred tax, and super tax treatment. Always separate ETR-driven EPS moves from operational changes.</td>
            <td class="down">ETR ↓ Positive</td>
          </tr>
          <tr>
            <td class="vname">Petroleum Policy Regime (Block Vintage)</td>
            <td>Gas pricing, royalty rates, and tax treatment differ by concession block and the petroleum policy under which a field was awarded (1994, 2001, 2012, 2021 policies). Blocks awarded under more recent policies generally have better pricing terms. MARI's flagship Mari Gas Field has a unique regulatory history — originally cost-plus, revised to crude-indexed — creating a pricing structure distinct from standard wells. Understanding which policy governs each field is necessary for accurate price modelling.</td>
            <td class="neutral">Policy-specific</td>
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
    <p>Pakistan's E&P sector is a small, government-dominated oligopoly. There are approximately 30–40 exploration companies operating in Pakistan (including foreign JV partners), but the four listed companies — OGDC, PPL, MARI, and POL — account for the vast majority of domestic production and reserves. OGDC alone holds over 40% of total concession acreage. The government holds majority stakes in OGDC (67%) and PPL and has significant influence over MARI through the Fauji Foundation's controlling position.</p>
    <ul class="bl">
      <li>Competition between listed E&P companies is primarily for block awards in government bidding rounds — not for customers. Whatever each company produces, it sells to the same regulated utilities (SNGPL/SSGC) or refineries at government-set prices.</li>
      <li>Foreign E&P companies (ENI, OMV, China National Petroleum Corporation, Orient Petroleum) participate primarily as JV partners with local E&Ps rather than as standalone producers. Local companies are usually designated operator with foreign partners providing technical capital.</li>
      <li>GHPL (Government Holdings Private Limited) participates in several blocks as a mandatory partner — a government entity that takes a working interest in blocks alongside private E&Ps without contributing exploration risk capital in the same way.</li>
    </ul>

    <div class="divider"></div>
    <h2>Pricing Power</h2>
    <p>Near-zero on gas. All gas wellhead prices are set by OGRA and notified by the government. E&P companies cannot negotiate price; they can apply for revisions through the regulatory process. Crude oil pricing is more transparent — tied to international benchmarks — but still regulated in terms of which refineries buy and at what differential. In practice, Pakistan's E&P companies are price-takers on their largest revenue line.</p>
    <p>The asymmetry is significant: E&P companies can improve production volumes (partial control), reduce costs per BOE (partial control), and improve exploration success rates (high skill/luck component), but they cannot change the price they receive for gas — which is 70–75% of revenue.</p>

    <div class="divider"></div>
    <h2>Regulatory &amp; Policy Influence</h2>
    <ul class="bl">
      <li><strong style="color:var(--text)">Petroleum policies (1994, 2001, 2012, 2021):</strong> Define royalty rates, tax treatment, wellhead pricing formulas, and investment incentives for each generation of concession blocks. Block vintage determines the regulatory economics of each field permanently.</li>
      <li><strong style="color:var(--text)">OGRA wellhead price notifications:</strong> Direct revenue determinant. Price revisions require E&P companies to apply, and OGRA may delay, reduce, or challenge applications. Historically, suppressed wellhead prices discouraged exploration investment — the root cause of declining reserves.</li>
      <li><strong style="color:var(--text)">Tight Gas Policy 2024:</strong> Announced February 2024 to incentivise unconventional gas development. OGDC's programme of 25 tight gas wells in the Indus Basin (each expected to yield 60–75 MMscfd) is the sector's most significant volume catalyst if successful.</li>
      <li><strong style="color:var(--text)">Government ownership:</strong> With GoP holding 67%+ in OGDC and significant stakes in PPL, dividend policy, capex decisions, and management appointments carry political economy dimensions not present in privately-owned companies. Dividend suppression during circular debt periods has been a recurrent constraint.</li>
      <li><strong style="color:var(--text)">DGPC (Directorate General of Petroleum Concessions):</strong> Regulatory agency overseeing compliance, block awards, and production reporting. Work obligations under concessions (minimum well drilling commitments) are enforced through DGPC.</li>
    </ul>

    <div class="divider"></div>
    <h2>Geographic Concentration</h2>
    <ul class="bl">
      <li>Sindh province: ~62% of total gas production; ~40% of oil production. Dominant basin — Lower Indus, Middle Indus. MARI's entire production base; PPL's Sui field (historic flagship), OGDC's multiple Sindh fields.</li>
      <li>Khyber Pakhtunkhwa (KPK): ~41% of crude oil production. Potwar/Kohat basin — POL's core geography; joint ventures between OGDC, PPL, POL in the Tal, Adhi, and Kohat basin blocks. Increasingly active — multiple discoveries in 2024–2025.</li>
      <li>Punjab: ~18% of oil production. Potwar Plateau in northern Punjab hosts PPL's Adhi field (JV with OGDC and POL) and MARI's expanding Ghazij/Shawal reserves.</li>
      <li>Balochistan: ~1% of oil, historically larger gas share (Sui, Uch). Frontier exploration potential but security and infrastructure challenges limit activity.</li>
      <li>Offshore: Limited current production. GoP has offered multiple offshore blocks to international investors; commercial-scale offshore development remains a longer-term prospect.</li>
    </ul>

    <div class="note">Note on import dependence: Pakistan imports ~80% of its crude oil requirements and imports LNG to supplement domestic gas. This means the domestic E&P sector's production directly reduces Pakistan's import bill — making it a strategic economic priority, not just a commercial sector. Every MMscfd of incremental domestic gas production substitutes ~$3–4M in annual LNG import cost at current prices.</div>
  </div>`,
  },
  {
    id: 'companies',
    label: 'Companies',
    content: `<div class="section">
    <div class="section-label">05 · Company Profiles</div>
    <h2>The Four Major Listed E&amp;P Companies</h2>
    <p>Each company has a structurally distinct combination of field vintage, gas vs oil mix, exploration track record, and balance sheet. These differences — not just size — explain why earnings can diverge sharply in any given quarter.</p>

        <div class="company-grid">

      <div class="company-card card-ogdc">
        <div class="company-ticker ticker-ogdc">PSX: OGDC</div>
        <div class="company-name">Oil & Gas Development Company Ltd</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> State-owned E&P; produces oil and gas from 40+ exploration licences; sells to SNGPL/SSGC at OGRA-notified wellhead prices.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Largest acreage and production volume in the sector; tight gas programme (25 wells) is the most consequential near-term volume catalyst of any listed E&P.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Natural decline at mature fields (Nashpa, Kunnar, Adhi) requires constant capex to hold production flat; government ownership creates dividend uncertainty.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Gas wellhead price (OGRA-notified, oil-indexed) and field production volumes. Other Income from overdue-payment surcharge has recently inflated reported PAT and must be segregated.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> PKR/USD is the strongest near-term EPS mover; production decline is the structural drag; super tax and ETR changes create quarterly EPS noise.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> 67% GoP ownership and ~40% of national E&P acreage — scale and state-backing not available to any private peer.</li>
        </ul>
      </div>

      <div class="company-card card-mari">
        <div class="company-ticker ticker-mari">PSX: MARI</div>
        <div class="company-name">Mari Energies Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Operates Pakistan's largest gas field (Mari, Daharki, 10.75 TCF GIIP); sells gas to fertiliser manufacturers and SNGPL; earns oilfield services revenue as a secondary stream.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Exploration success rate of ~70% vs national average ~33%; single mega-field scale provides the longest proven reserve runway of any listed E&P.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Concentration on one mega-field — any production decline at Mari affects virtually all output. Gas wellhead price is OGRA-set and historically below international parity.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Gas wellhead price (crude-oil-indexed since 2015 revision) and production volume from Mari Gas Field.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> OGRA wellhead price revision pace; circular debt on SNGPL receivables; production plateau or decline at the Mari field.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Directly supplies FFC and FATIMA — making MARI's pricing decisions a cross-sector earnings event. 70% exploration success rate is the sector's clearest operational differentiator.</li>
        </ul>
      </div>

      <div class="company-card card-ppl">
        <div class="company-ticker ticker-ppl">PSX: PPL</div>
        <div class="company-name">Pakistan Petroleum Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> E&P company with fields across Balochistan, Sindh, KPK, and Punjab (Sui, Adhi JV, Tal block, Gambat South); gas-dominant with growing oil contribution.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Widest geographic distribution of any listed E&P; JV partnerships with OGDC and POL provide cost and risk sharing across Adhi and Tal blocks.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Sui field — the historic flagship — is in accelerating natural decline; oil reserves fell 16% in the year to Dec 2023; 1QFY25 PAT down 32% YoY on lower volumes.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Combined oil and gas production volumes; oil price on USD-linked sales; PKR/USD translation; new discovery commissioning pace.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Sui production decline with no near-term structural fix; new discovery replacement rate vs existing field depletion; circular debt on gas receivables.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Operator of Sui gas field — whose 1952 discovery built Pakistan's national gas grid. Legacy institutional relationships and Balochistan operational access are not easily replicated.</li>
        </ul>
      </div>

      <div class="company-card card-pol">
        <div class="company-ticker ticker-pol">PSX: POL</div>
        <div class="company-name">Pakistan Oilfields Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> E&P focused on oil-weighted production in Potwar Basin (Punjab/KPK); JV partner at Adhi field (with OGDC, PPL); sells crude to PARCO at Pakistan benchmark price.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Highest oil revenue proportion of listed E&Ps — Pindori, Pariwali, Adhi fields are oil-dominant. Near-zero debt and the sector's most consistent dividend track record.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Smallest production base of the four listed E&Ps; limited exploration acreage; Potwar plateau geology constrains reserve replenishment options.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Crude oil price (Pakistan-set benchmark, partially indexed to Arab Light); Adhi and Pindori production volumes; PKR/USD rate on oil sales.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Production decline at Pindori and Pariwali without sufficient replacement; oil price decline reduces realisation without the gas price floor that gas-heavy peers have.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The only listed E&P where crude oil pricing — not gas wellhead mechanics — is the primary earnings variable. Highest dividend yield of the four listed E&Ps.</li>
        </ul>
      </div>

    </div>
        <ul class="co-bullets">
          <li>Pakistan's largest E&P company by production, reserves, and market cap — state-owned (GoP 67%), listed since 2004; operations since 1961 (originally as OGDC Corporation)</li>
          <li>Largest exploration acreage in Pakistan: 40+ exploration licences covering ~40% of total national acreage awarded; daily production ~39,660 BOE oil + 937 MMcfd gas</li>
          <li>Initiated major tight gas programme (late 2024): 25 wells in Indus Basin, each targeting 60–75 MMscfd — strategic pivot to unconventional resources as conventional fields decline</li>
          <li>Other income nearly doubled in recent periods (to ~Rs82B) driven by delayed payment surcharge on overdue SNGPL/SSGC receivables, FX gains, and TFC interest — a non-recurring item investors must segregate</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Scale and acreage dominance — no other company has OGDC's portfolio breadth. State ownership provides implicit asset-protection and policy access unavailable to private peers. Largest gas producer and largest contributor to national supply security.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Natural production decline at mature fields (Nashpa, Kunnar, Adhi) requires constant capital just to hold flat. Government ownership creates dividend uncertainty — circular debt has repeatedly constrained payouts. ETR variability (from super tax) creates quarter EPS noise.</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Tight gas programme is the sector's most consequential near-term volume catalyst. If even 10 of 25 wells are commercially successful, the aggregate volume impact would exceed any single conventional discovery in the last decade.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">PKR/USD rate is the most powerful near-term EPS variable. Gas wellhead price revisions are high-impact but infrequent. Field production decline rate determines the base case erosion. Super tax and ETR create quarter-specific noise.</span></div>
        </div>
        <div class="tags">
          <span class="tag b">Largest E&P</span>
          <span class="tag b">Tight Gas Pivot</span>
          <span class="tag">GoP 67%</span>
          <span class="tag b">40% of National Acreage</span>
        </div>
      </div>

      <!-- MARI -->
      <div class="company-card card-mari">
        <div class="co-ticker t-mari">PSX: MARI</div>
        <div class="co-name">Mari Energies Limited</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Market Cap</span><span class="co-meta-val">~$2.65B</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Majority Owner</span><span class="co-meta-val">Fauji Foundation</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Core Asset</span><span class="co-meta-val">Mari Gas Field, Daharki (Sindh)</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Exploration Success Rate</span><span class="co-meta-val">~70% (vs 33% national avg)</span></div>
        </div>
        <ul class="co-bullets">
          <li>Operates Pakistan's largest gas field — Mari Gas Field at Daharki, Sindh; GIIP of 10.75 TCF making it one of Pakistan's largest gas assets by balance reserves; renamed from Mari Petroleum to Mari Energies (January 2025)</li>
          <li>Contributes ~30% of Pakistan's total domestic gas production; supplies fertiliser manufacturers (FFC, FATIMA) directly — the gas-fertiliser link makes MARI pricing decisions a cross-sector event</li>
          <li>Exploration success rate of ~70% is far above national (~33%) and international (~14%) averages — the sector's most consistent explorer; Spinwam-1 (North Waziristan, 2025) and Ghazij/Shawal additions demonstrate ongoing reserve growth</li>
          <li>Secured rights to 10 new onshore exploration blocks in early 2025; provides seismic, drilling, and mud logging services as a revenue diversifier</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">The Mari Gas Field's scale and balance reserves provide a production runway that is the envy of the sector. Exploration success rate of 70% is a genuine operational differentiator — most peers drill more dry wells. Relatively gas-pure model with clear pricing mechanics post-2014 revision.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Concentrated on a single mega-field — if Mari Gas Field productivity declines, the company's entire production base is affected. Gas wellhead price is set by OGRA and historically below international equivalent, limiting margin improvement without regulatory support.</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Exploration success rate. No other listed Pakistani E&P company can match MARI's conversion of drilled wells to commercial discoveries. This is the most sustainable competitive advantage in the sector because it compounds: more discoveries extend reserve life and fund future exploration.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Mari Gas Field wellhead price (OGRA-notified, crude-oil-indexed since 2015). Gas volume from Ghazij/Shawal additions. PKR/USD for any crude-oil-indexed component. Circular debt — SNGPL/SSGC are buyers and carry significant receivable risk.</span></div>
        </div>
        <div class="tags">
          <span class="tag g">Largest Gas Field</span>
          <span class="tag g">70% Exploration Success</span>
          <span class="tag">Fauji Foundation</span>
          <span class="tag g">~30% of National Gas</span>
        </div>
      </div>

      <!-- PPL -->
      <div class="company-card card-ppl">
        <div class="co-ticker t-ppl">PSX: PPL</div>
        <div class="co-name">Pakistan Petroleum Limited</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Market Cap</span><span class="co-meta-val">~$1.63B</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Flagship Field</span><span class="co-meta-val">Sui Gas Field, Balochistan</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Mix</span><span class="co-meta-val">Gas-dominant; growing oil</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Active Blocks</span><span class="co-meta-val">Multiple (Sindh, KPK, Punjab, offshore)</span></div>
        </div>
        <ul class="co-bullets">
          <li>Historically Pakistan's premier E&P company — operator of Sui gas field (Dera Bugti, Balochistan), the field whose discovery in 1952 built Pakistan's national gas grid; Sui is a mature, declining asset</li>
          <li>Diversified field portfolio: Sui, Kandhkot, Mazarani, Chachar (Sindh/Balochistan), Adhi (JV with OGDC+POL, Potwar), Tal block (KPK), Gambat South, Hala (JV with MARI), and multiple exploration licences</li>
          <li>September 2025 discovery at Dhok Sultan-03 (Attock district) — 1,469 BOPD oil and 2.56 MMscfd gas; described as second-deepest oil discovery in naturally fractured carbonate in the Potwar region</li>
          <li>1QFY25 PAT Rs20.2B (EPS Rs7.42), down 32% YoY — driven by lower volumes (Sui decline), lower oil prices, and PKR appreciation against USD</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Widest geographic distribution of any listed E&P company — fields across Balochistan, Sindh, Punjab, and KPK. Active JV partnerships with OGDC and POL (Adhi, Tal) provide operational depth. Historical pedigree and institutional relationships give PPL access to politically sensitive blocks.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Sui field — the historic flagship — is in accelerating natural decline: Sui, Kandhkot, and Adhi all show year-on-year reserve and production decreases. Oil reserves fell 16% in the year to Dec 2023. Gas reserves at several core fields also declining. Reserve replacement is the existential challenge.</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Portfolio breadth — PPL's combination of large legacy gas fields, active KPK oil exposure (Tal block), and offshore exploration optionality gives it the most diversified hydrocarbon profile of the four. Potential Dhok Sultan (carbonate) play in Punjab is distinctive if it proves commercial at scale.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Volume decline at Sui and associated legacy fields. PKR/USD for crude oil component. Circular debt from SNGPL/SSGC on gas payments. Oil prices for growing oil/condensate contribution. Exploration success at new blocks to replace declining reserves.</span></div>
        </div>
        <div class="tags">
          <span class="tag a">Sui Gas (Legacy)</span>
          <span class="tag a">Multi-Province Portfolio</span>
          <span class="tag">Tal Block (KPK)</span>
          <span class="tag a">Offshore Optionality</span>
        </div>
      </div>

      <!-- POL -->
      <div class="company-card card-pol">
        <div class="co-ticker t-pol">PSX: POL</div>
        <div class="co-name">Pakistan Oilfields Limited</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Owner</span><span class="co-meta-val">Attock Group (majority)</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Core Geography</span><span class="co-meta-val">Potwar Plateau / KPK</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Mix</span><span class="co-meta-val">Oil-dominant (vs gas-dominant peers)</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">9MFY25 EPS</span><span class="co-meta-val">Rs61.92 (–41% YoY)</span></div>
        </div>
        <ul class="co-bullets">
          <li>Privately controlled by the Attock Group — one of Pakistan's oldest energy conglomerates; also related to Attock Refinery (ARL) and Attock Petroleum (APL), giving the group an integrated oil value chain</li>
          <li>Focused on Potwar Plateau and KPK (Pindori, Pariwali, Balkassar, Joyamair, Adhi JV with OGDC/PPL, Tal block JV) — oil-weighted relative to peers, making POL the strongest crude price proxy among listed E&Ps</li>
          <li>9MFY25 PAT Rs17.6B (EPS Rs61.92), down 41% YoY — driven by Rs7.7B dry well write-off (Balkassar Deep-1A), lower oil prices (–8% YoY), and PKR appreciation; operational performance underlying the dry well is more stable</li>
          <li>Oil reserves ~15 million barrels (stable); gas reserves +17% in FY24 via Pindori upgrades; highest per-share dividend in the sector during good cash flow periods</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Oil-dominant production mix means less exposure to circular debt (oil refineries generally pay more reliably than SNGPL/SSGC). Attock Group integration provides downstream sales certainty — POL can sell crude to Attock Refinery, a related party with relatively reliable payment. Private ownership provides governance clarity.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Smaller scale than peers limits portfolio diversification and bargaining power. Dry well charges create lumpier earnings — single exploration write-offs can destroy multiple quarters of operational profits. High royalty and tax burden relative to smaller absolute earnings base.</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Oil-dominant model with Attock Group integration creates a structurally different receivable risk profile vs gas-dependent peers. When oil prices rise, POL is the clearest pure-play beneficiary. Higher per-share dividend yield relative to OGDC and PPL in cash-rich periods.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">International crude oil price (most sensitive of the four). Dry well charges (one-time, high-volatility). PKR/USD for crude realisation. Exploration success rate at Balkassar Deep follow-up and other KPK targets.</span></div>
        </div>
        <div class="tags">
          <span class="tag p">Attock Group</span>
          <span class="tag p">Oil-Dominant</span>
          <span class="tag p">Potwar / KPK</span>
          <span class="tag g">Integrated Value Chain</span>
        </div>
      </div>`,
  },
  {
    id: 'peers',
    label: 'Peers',
    content: `<div class="section">
    <div class="section-label">06 · Peer Comparison Grid</div>
    <h2>Cross-Company Comparison</h2>
    <p>Based on publicly available disclosures and industry data. Verify against current company filings.</p>

    <div class="tbl-wrap">
      <table class="peer-tbl" style="min-width:900px;">
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
            <td><div class="co-badge b-ogdc">OGDC</div><br><span style="font-size:12px;">Oil &amp; Gas Dev Co</span></td>
            <td>State-owned scale operator. Gas-heavy portfolio. 40%+ of national acreage. Tight gas pioneer.</td>
            <td>Unmatched portfolio breadth and scale. Policy access as government's primary E&P arm.</td>
            <td>Field production decline at large legacy assets. Government ownership constrains dividend policy. High ETR volatility.</td>
            <td>PKR/USD rate (most powerful near-term variable). Gas wellhead price. Field production decline rate.</td>
            <td>Tight gas programme — 25 wells targeting 60–75 MMscfd each. No other company is executing at this scale for unconventional gas.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-mari">MARI</div><br><span style="font-size:12px;">Mari Energies</span></td>
            <td>Fauji Foundation-controlled. Gas-dominant. Single mega-field core + growing exploration portfolio.</td>
            <td>70%+ exploration success rate — sector's strongest. Mari Gas Field reserve depth provides long production life.</td>
            <td>Concentration on one mega-field. Gas pricing governed by OGRA — limited upside without regulatory support.</td>
            <td>Mari Gas wellhead price (OGRA/crude-indexed). Ghazij/Shawal incremental volume. Circular debt from gas utilities.</td>
            <td>Exploration success rate. When MARI drills, the odds of a commercially viable discovery are 2x the national average and 5x international average.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-ppl">PPL</div><br><span style="font-size:12px;">Pakistan Petroleum</span></td>
            <td>Multi-province, diversified portfolio. Sui-anchored gas legacy. Growing oil exposure via KPK JVs.</td>
            <td>Widest geographic diversification of the four. Institutional relationships enabling access to complex blocks.</td>
            <td>Sui field accelerating decline. Reserve replacement challenge is most acute. Oil reserves fell 16% in CY2023.</td>
            <td>Volume trajectory at Sui and legacy gas fields. PKR/USD. New exploration success at KPK/Punjab blocks.</td>
            <td>Portfolio breadth — the only company with meaningful exposure to Balochistan, Sindh, Punjab, KPK, and potential offshore simultaneously.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-pol">POL</div><br><span style="font-size:12px;">Pakistan Oilfields</span></td>
            <td>Privately-held by Attock Group. Oil-weighted. KPK/Potwar focus. Integrated with Attock Refinery.</td>
            <td>Oil-dominant model reduces circular debt exposure (refinery buyers more reliable than gas utilities). Private governance.</td>
            <td>Smallest scale. Dry well charges create lumpy quarterly EPS. High exposure to single-event exploration write-offs.</td>
            <td>International crude oil price — clearest pure-play in the sector. Dry well charges. PKR/USD for crude realisation.</td>
            <td>Attock Group integration — the only listed E&P with a direct related-party crude oil buyer (Attock Refinery), reducing receivable risk for its largest product.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="divider"></div>
    <h2>Key Metrics Snapshot</h2>
    <div class="tbl-wrap">
      <table class="peer-tbl" style="min-width:680px;">
        <thead>
          <tr>
            <th>Metric</th>
            <th>OGDC</th>
            <th>MARI</th>
            <th>PPL</th>
            <th>POL</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong style="color:var(--text)">Market Cap (approx)</strong></td><td>~$4.15B</td><td>~$2.65B</td><td>~$1.63B</td><td>Smaller</td></tr>
          <tr><td><strong style="color:var(--text)">Primary Mix</strong></td><td>Gas ~60%, Oil ~30%, LPG/other</td><td>Gas ~85%, LPG/condensate</td><td>Gas ~70%, Oil ~25%</td><td>Oil ~55%, Gas ~40%</td></tr>
          <tr><td><strong style="color:var(--text)">Core Geography</strong></td><td>Pan-Pakistan (40% acreage)</td><td>Sindh (Daharki) + expansion</td><td>Multi-province (Balo, Sindh, KPK, Punjab)</td><td>KPK + Potwar Plateau</td></tr>
          <tr><td><strong style="color:var(--text)">Oil Reserves (approx)</strong></td><td>82–86 Mbbl</td><td>9.6 Mbbl</td><td>20 Mbbl</td><td>~15 Mbbl</td></tr>
          <tr><td><strong style="color:var(--text)">Gas Reserves (approx)</strong></td><td>6,121 bcf (~5.5+ Tcf)</td><td>5.5 Tcf</td><td>2.2 Tcf</td><td>Smaller</td></tr>
          <tr><td><strong style="color:var(--text)">Circular Debt Exposure</strong></td><td>Very High (largest gas volumes)</td><td>High (gas sold to SNGPL)</td><td>High (Sui sold to SSGC)</td><td>Lower (oil to refineries)</td></tr>
          <tr><td><strong style="color:var(--text)">Exploration Success Rate</strong></td><td>Moderate</td><td>~70% (exceptional)</td><td>Moderate</td><td>Variable (lumpy)</td></tr>
          <tr><td><strong style="color:var(--text)">Ownership</strong></td><td>GoP ~67%</td><td>Fauji Foundation majority</td><td>GoP majority (via GHPL)</td><td>Attock Group (private)</td></tr>
          <tr><td><strong style="color:var(--text)">Key Near-Term Catalyst</strong></td><td>Tight gas programme (25 wells)</td><td>Ghazij/Shawal volume ramp; new exploration blocks</td><td>Dhok Sultan appraisal; Tal block drilling</td><td>Balkassar Deep follow-up; crude price</td></tr>
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
    <h2>Sector Risk Register</h2>
    <div class="risk-list">
      <div class="risk-item">
        <div class="risk-name">Circular Debt &amp; Payment Delays</div>
        <div class="risk-desc">The petroleum sector's circular debt peaked at ~Rs3T by mid-2024. SNGPL and SSGC owe E&P companies for gas delivered months or years prior. The impact: reported earnings overstate cash earnings; dividends are constrained; capex is curtailed, further worsening the reserve replacement problem. Each quarter with delayed payments erodes E&P companies' ability to fund the wells that would solve Pakistan's gas shortage. This is the sector's most chronic and structurally damaging risk.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Natural Field Production Decline</div>
        <div class="risk-desc">All E&P fields decline naturally at 10–15% per year without ongoing investment. Legacy fields — OGDC's Nashpa/Kunnar, PPL's Sui/Kandhkot/Adhi — are in accelerating decline. Sustaining flat production requires continuous drilling to offset depletion. If circular debt constrains capex, decline accelerates. This is a compounding negative feedback loop: constrained cash → less capex → faster decline → less revenue → more circular debt pressure.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Dry Well &amp; Exploration Write-Offs</div>
        <div class="risk-desc">Unsuccessful exploration wells are expensed immediately when a commercial decision is made to abandon the prospect. A single dry well can add Rs3–10B to quarterly expenses, destroying one or more quarters of operating profit. POL's Rs7.7B Balkassar Deep-1A write-off drove a 41% PAT decline in 9MFY25 despite stable underlying operations. This risk is inherent to the E&P business model and not a management failure per se — but it creates earnings lumpiness that must be normalised when assessing operational performance.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">PKR Appreciation</div>
        <div class="risk-desc">PKR appreciation compresses rupee-denominated revenues from USD-linked crude and partially-indexed gas pricing with no offsetting benefit. In 9MFY25, PKR appreciation was cited as a primary driver of earnings declines at OGDC, PPL, and POL. Unlike operational improvements (which are gradual), currency moves create immediate quarter EPS impacts. The sector's FX sensitivity is approximately 2–3% EPS change per 1% PKR/USD movement.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">International Oil Price Decline</div>
        <div class="risk-desc">Pakistan's crude realisations track Brent/Arabian Light. Gas wellhead prices for post-2012 blocks are partially crude-indexed. A sustained decline in global crude (e.g., OPEC+ supply increase, global demand weakness) reduces both oil revenue directly and indirectly compresses gas pricing over time. This is a global macro risk that no Pakistani E&P company can hedge against in the domestic regulatory framework.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Super Tax &amp; Retrospective Taxation</div>
        <div class="risk-desc">Pakistan's government has imposed retrospective super tax, modified depletion allowance provisions, and altered petroleum income tax treatments at the federal budget level. These changes can affect multiple years' worth of deferred tax liability simultaneously, creating single-quarter EPS swings of 20–50%. ETR in this sector is inherently unpredictable from quarter to quarter, making bottom-line EPS estimation harder than in other sectors.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Suppressed Wellhead Gas Prices</div>
        <div class="risk-desc">For legacy fields (pre-2012 policy), wellhead gas prices have historically been regulated below international equivalent levels. This suppressed domestic gas pricing is why exploration activity was inadequate for decades — the economics did not justify the capital risk. While post-2012 policies improved pricing, legacy fields (still producing significant volumes) remain under constrained pricing. Any policy reversal that reduces indexation to crude oil would compress the largest revenue line.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Reserve Depletion Without Adequate Replacement</div>
        <div class="risk-desc">Pakistan's domestic gas production has been unable to keep pace with demand growth, requiring increasing LNG imports. Listed E&P companies' combined reserves have shown mixed trends — MARI growing (Ghazij/Shawal), OGDC's large but gradually declining gas reserves, PPL's declining legacy assets. If tight gas or new conventional exploration does not materialise at scale within 5–7 years, the sector faces a structural production cliff that would significantly reduce its PSX relevance.</div>
      </div>
    </div>
  </div>`,
  },
  {
    id: 'monitor',
    label: 'Monitor',
    content: `<div class="section">
    <div class="section-label">08 · What to Monitor</div>
    <h2>Monitoring Framework</h2>

    <div class="monitor-grid">
      <div class="monitor-col">
        <div class="monitor-head">Monthly</div>
        <ul class="monitor-list">
          <li><strong style="color:var(--text);">International crude oil price (Brent/Arab Light)</strong> — direct realisation indicator for oil revenue; also drives indexed gas pricing over time. Published daily; track monthly averages.</li>
          <li><strong style="color:var(--text);">PKR/USD rate</strong> — most powerful near-term EPS variable. Track average monthly rate for comparison with prior year; a sustained appreciation or depreciation creates predictable quarter EPS direction.</li>
          <li><strong style="color:var(--text);">SNGPL/SSGC payment releases</strong> — any government announcement of payments to gas utilities frees up circular debt flow to E&P companies. Track government finance ministry and OGRA press releases.</li>
          <li><strong style="color:var(--text);">PPIS reserve data</strong> — Pakistan Petroleum Information Service publishes semi-annual reserve updates. Monitor reserve additions, field-level changes, and company-specific RRR trends.</li>
          <li><strong style="color:var(--text);">Well completion announcements (DGPC / PSX filings)</strong> — each company must disclose material discoveries to PSX. Discovery announcements provide immediate reserve and production outlook signals.</li>
        </ul>
      </div>
      <div class="monitor-col">
        <div class="monitor-head">Quarterly</div>
        <ul class="monitor-list">
          <li><strong style="color:var(--text);">Financial results</strong> — key derivations: average realised crude price (oil revenue ÷ oil volumes), average gas price per MMbtu (gas revenue ÷ gas volumes), exploration cost and dry well count, other income disaggregation (surcharge vs FX vs interest).</li>
          <li><strong style="color:var(--text);">Production volumes</strong> — oil (barrels/day) and gas (MMscfd) separately. Compare against prior year and prior quarter. Production decline or unexpected curtailment is an immediate forward earnings signal.</li>
          <li><strong style="color:var(--text);">Receivables from gas utilities</strong> — balance sheet item. Receivable growth vs revenue growth indicates worsening payment delays. Cash conversion ratio (cash received vs billed) is most informative.</li>
          <li><strong style="color:var(--text);">Exploration expense</strong> — level and nature (seismic costs vs dry well write-offs). High seismic costs mean future drilling; dry well charges are past failures. Distinguish the two.</li>
          <li><strong style="color:var(--text);">Effective tax rate</strong> — segregate super tax provisions from operational tax. ETR-driven EPS changes should not be extrapolated. Apply consistent underlying ETR assumption for normalised EPS estimation.</li>
          <li><strong style="color:var(--text);">Cash received vs billed (if disclosed)</strong> — OGDC management has occasionally commented on cash recovery trends. This is the most important liquidity signal in the sector.</li>
        </ul>
      </div>
      <div class="monitor-col">
        <div class="monitor-head">Event-Driven</div>
        <ul class="monitor-list">
          <li><strong style="color:var(--text);">Discovery announcements (PSX material disclosures)</strong> — each commercial discovery triggers reserve revision, production timeline, and long-term EPS upgrade potential. Track flow rate, depth, and reservoir type.</li>
          <li><strong style="color:var(--text);">OGRA wellhead price notifications</strong> — infrequent but high-impact. Any upward revision to MARI, OGDC, or PPL wellhead prices immediately improves the revenue baseline for the affected fields.</li>
          <li><strong style="color:var(--text);">Tight gas well results (OGDC)</strong> — the 25-well programme in the Indus Basin is the sector's most significant near-term volume catalyst. Each well completion and initial flow rate reveals economic viability of the programme.</li>
          <li><strong style="color:var(--text);">Government circular debt resolution announcements</strong> — payment packages to gas utilities (like the Sep-2025 Rs1.225T refinancing) unlock E&P receivables. Track press releases from Power Division, Finance Ministry.</li>
          <li><strong style="color:var(--text);">Federal Budget (June)</strong> — super tax rate, petroleum income tax modifications, depletion allowance treatment. High-impact on effective tax rate across all four companies.</li>
          <li><strong style="color:var(--text);">New block awards (DGPC bidding rounds)</strong> — acreage addition signals long-term production replacement pipeline. Monitor DGPC website for bidding round schedules and awards.</li>
          <li><strong style="color:var(--text);">OPEC+ production decisions</strong> — indirect signal for medium-term crude price trajectory; affects Pakistani E&P crude realisation and gas pricing indexation.</li>
        </ul>
      </div>
    </div>

    <div class="divider"></div>
    <h2>Important Dates &amp; Timeline</h2>
    <div class="tl-item">
      <div class="tl-when">Oct / Nov</div>
      <div class="tl-what">1QFY results (July–Sep) — first quarter after fiscal year start. Set the FY volume and price base rate. Watch for any super tax provisions or depletion allowance adjustments catching prior years.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Feb / Mar</div>
      <div class="tl-what">2QFY and 1HFY results — most-watched semi-annual period. Half-year PAT numbers carry the most analyst attention and often trigger the largest share price reactions.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Apr / May</div>
      <div class="tl-what">3QFY and 9MFY results — useful for extrapolating full-year and for tracking production trend continuity. Exploration charges year-to-date are visible here.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Aug / Sep</div>
      <div class="tl-what">Full-year results (FY ends June 30) — dividend announcements, full-year reserve disclosure, capex programme guidance. Most comprehensive disclosure period of the year.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Semi-Annual (PPIS)</div>
      <div class="tl-what">Pakistan Petroleum Information Service reserve data — published approximately June (Dec-end data) and December (June-end data). Tracks company-level oil and gas reserve changes; key for RRR analysis.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">June (Federal Budget)</div>
      <div class="tl-what">Annual budget. Key items: super tax rate, petroleum income tax modifications, royalty rates, any changes to depletion allowance treatment. Immediate ETR implication for all four companies.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Ongoing (PSX)</div>
      <div class="tl-what">Material information disclosures — well completions, discoveries, block awards, government allocations. E&P companies are among the most active material disclosure filers on PSX. Monitor continuously.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">OGRA price notifications</div>
      <div class="tl-what">Infrequent but high-impact. OGRA notifies wellhead prices for specific fields periodically, typically following company applications. Any MARI, OGDC, or PPL price revision is a material event.</div>
    </div>
  </div>`,
  },
  {
    id: 'glossary',
    label: 'Glossary',
    content: `<div class="section">
    <div class="section-label">09 · Glossary</div>
    <h2>Key Terms</h2>
    <div class="glo-grid">
      <div class="glo-item">
        <div class="glo-term">E&P (Exploration &amp; Production)</div>
        <div class="glo-def">The upstream segment of the oil and gas industry. E&P companies find hydrocarbons through exploration, develop discovered fields, and extract oil and gas for sale. They do not refine, distribute, or retail. The revenue trigger is extraction at the wellhead, not retail sale.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Wellhead Price</div>
        <div class="glo-def">The price paid to the E&P company for gas or crude oil at the point of extraction — before any transportation or processing charges. Gas wellhead prices in Pakistan are OGRA-notified (regulated). Crude oil wellhead prices are based on international benchmarks. Wellhead price is the direct top-line revenue variable for E&P companies.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">BOE (Barrel of Oil Equivalent)</div>
        <div class="glo-def">A unit that converts different hydrocarbons to a common measure for comparison. 1 BOE = 1 barrel of crude oil = ~6,000 cubic feet (6 Mcf) of natural gas = ~1 Mcf/6 for LPG. Used to express total production or reserves across oil, gas, and LPG in one comparable number.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">MMscfd (Million Standard Cubic Feet per Day)</div>
        <div class="glo-def">The standard unit for measuring daily natural gas production or well flow rates in Pakistan. Gas production of 1 MMscfd over one year produces ~365 MMcf of gas. OGDC's daily production of ~937 MMscfd is equivalent to roughly 160,000 BOE/day in gas alone.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Concession / Block</div>
        <div class="glo-def">A defined geographic area awarded by the government to an E&P company for exclusive exploration rights. Blocks are awarded through competitive bidding rounds administered by DGPC. The petroleum policy under which a block was awarded governs its royalty, tax, and pricing terms for the life of the licence.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">DD&amp;A (Depletion, Depreciation &amp; Amortisation)</div>
        <div class="glo-def">Non-cash charge representing the allocation of the capitalised cost of finding and developing a field against production over the field's life. Rising DD&A in a company's accounts indicates either accelerating production draw-down from higher-cost fields or the onboarding of newly-developed (higher book cost) wells replacing old depreciated assets.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Reserve Replacement Rate (RRR)</div>
        <div class="glo-def">New proven reserves added (via discoveries or revisions) divided by production in the same period. RRR of 100% means the company is replacing exactly what it extracts. Below 100%, reserve life is shrinking. MARI's ~70% exploration success rate drives strong RRR; PPL's legacy field declines create RRR pressure. Long-run survival of an E&P company depends on maintaining RRR ≥ 100%.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Dry Well / Exploration Write-Off</div>
        <div class="glo-def">A drilled exploratory well that does not find commercial quantities of hydrocarbons. The capitalised drilling cost is written off as an exploration expense in the period the commercial decision is made. Dry well charges are inherent to E&P — a 30–40% dry well rate is normal internationally; Pakistan's average is ~67% dry (MARI is an exception at ~30%). Always strip dry well charges from operational earnings when assessing underlying performance.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Circular Debt (Petroleum Sector)</div>
        <div class="glo-def">Accumulated unpaid obligations in Pakistan's gas supply chain. SNGPL/SSGC owe E&P companies for gas delivered; they cannot pay because their own tariffs are suppressed below cost; government subsidises the gap but disbursements are delayed. At peak (mid-2024), petroleum circular debt was ~Rs3T. E&P companies book revenue on delivery but receive cash later — sometimes 12–24 months later — creating a structural gap between reported earnings and actual cash generation.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Delayed Payment Surcharge</div>
        <div class="glo-def">Interest charged by E&P companies on overdue SNGPL/SSGC receivables, accruing at a rate tied to benchmark interest rates (KIBOR+). During the high-rate era (KIBOR 22%) and peak circular debt (~Rs3T), delayed payment surcharge became a substantial component of E&P other income — sometimes exceeding operating profit from some fields. As circular debt resolves and rates decline, this income normalises downward rapidly. Must be segregated from operational earnings.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">OGRA</div>
        <div class="glo-def">Oil and Gas Regulatory Authority. Sets wellhead gas prices for domestic E&P companies, regulates SNGPL and SSGC tariffs, and oversees downstream petroleum product pricing. OGRA's wellhead price notifications are binding on gas sales — E&P companies receive exactly what OGRA notifies, regardless of international gas price movements, unless their concession agreement specifies a different formula.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Tight Gas</div>
        <div class="glo-def">Natural gas trapped in low-permeability reservoir rock (tight sands, shales) that does not flow naturally at commercial rates without stimulation (hydraulic fracturing, horizontal drilling). Conventional gas flows with minimal intervention; tight gas requires intensive engineering. OGDC's Tight Gas Policy 2024 programme targets the Indus Basin's tight sand formations, which are estimated to hold significant volumes that have been uneconomic under conventional development methods.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">TCF / BCF / MMscf</div>
        <div class="glo-def">Gas volume measurement units: TCF = Trillion Cubic Feet; BCF = Billion Cubic Feet; MMscf = Million Standard Cubic Feet. Pakistan's total gas reserves (all companies, proven) are approximately 19 Tcf (listed E&Ps only, mid-2025). MARI's Mari Gas Field alone holds ~5.5 Tcf in balance reserves — exceptionally large for a single domestic field.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">DGPC</div>
        <div class="glo-def">Directorate General of Petroleum Concessions — the regulatory body that administers exploration licences, production leases, and block bidding under the Ministry of Energy (Petroleum Division). DGPC monitors compliance with work obligations (minimum drilling commitments per concession), oversees well completion notifications, and manages the block award process.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Working Interest</div>
        <div class="glo-def">The ownership percentage an E&P company holds in a specific concession block — entitling it to that percentage of production and obligating it to pay the same percentage of exploration and development costs. When OGDC holds 55% working interest in a block alongside MARI (30%) and a foreign partner (15%), OGDC receives 55% of production and pays 55% of costs from that block.</div>
      </div>
    </div>
  </div>`,
  },
  {
    id: 'summary',
    label: 'Summary',
    content: `<div class="section">
    <div class="section-label">10 · Executive Summary</div>
    <h2>Five Bullets</h2>
    <div class="exec-list">
      <div class="exec-item">
        <div class="exec-num">01</div>
        <div class="exec-text"><strong>Sector identity.</strong> Pakistan's E&P sector is the foundation of the country's hydrocarbon supply chain — producing the gas that powers industry, fertiliser plants, and household networks, and the crude oil that feeds domestic refineries. It is a government-dominated, regulated sector where four listed companies (OGDC, MARI, PPL, POL) account for the majority of domestic production. OGDC alone is the largest company by market cap on PSX. The sector's strategic importance to Pakistan's energy security gives it policy exposure — both in the form of protection and constraint — that no other PSX sector experiences to the same degree.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">02</div>
        <div class="exec-text"><strong>Core economics.</strong> Revenue comes from three products: gas (70–75%, sold to SNGPL/SSGC at OGRA-regulated wellhead prices), crude oil (20–25%, sold at international benchmarks to refineries), and LPG/condensate (5–10%, highest unit margins). All three have USD linkage to varying degrees, making PKR/USD the single most powerful near-term EPS variable — more impactful than any single operational factor. Costs are dominated by royalties (12.5% of wellhead value), DD&A (non-cash, rising as fields age), and exploration write-offs (binary, lumpy). Reported gross margins of 55–65% overstate cash margins because of the circular debt receivable gap.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">03</div>
        <div class="exec-text"><strong>Major variables.</strong> In order of immediacy: (1) PKR/USD rate — automatic revenue translation impact; (2) gas wellhead prices (OGRA notifications) — large and infrequent; (3) international crude oil price — direct on POL, indirect on MARI/OGDC through gas indexation; (4) production volumes — the structural driver, worsening as fields age; (5) circular debt payment receipts — the gap between accrual earnings and cash earnings. Effective tax rate and dry well charges create high-frequency EPS surprises that must be distinguished from operational trends.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">04</div>
        <div class="exec-text"><strong>Major risks.</strong> Circular debt is the chronic systemic risk — Rs3T of outstanding receivables at peak constrained dividends, capex, and exploration across all four companies simultaneously. Natural field production decline compounds with constrained capex to create a negative feedback loop. Dry well write-offs create earnings lumpiness that can obscure operational performance. Retrospective super tax impositions are an acute, unpredictable fiscal risk. PKR appreciation — the reversal of the FX tailwind — compressed sector EPS materially in FY25 even as operations were broadly stable.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">05</div>
        <div class="exec-text"><strong>What makes leading companies different.</strong> <strong>OGDC</strong>: scale and acreage dominance are unmatched; tight gas programme (25 wells, Indus Basin) is the sector's most significant volume catalyst — if commercial, it transforms the medium-term production outlook. <strong>MARI</strong>: exploration success rate of ~70% is the sector's only genuine operational moat — a skill advantage that compounds through better RRR, longer reserve life, and lower cost per discovery. <strong>PPL</strong>: widest geographic and reservoir-type diversification — the most exposed to a diversified exploration outcome but also carrying the most legacy field decline risk. <strong>POL</strong>: oil-dominant model with Attock Group integration reduces circular debt receivable risk uniquely among the four — and makes it the clearest pure-play on international crude price movements.</div>
      </div>
    </div>

    <div class="note warn" style="margin-top:24px;">This module is based on publicly available secondary sources including company financial disclosures (PSX filings), PPIS reserve data, OGRA notifications, broker research (Topline Securities, AKD Research, AHL, Trade Chronicle), and news coverage (Business Recorder, Profit Pakistan Today, Arab News). It does not constitute investment advice. No buy, sell, or hold recommendations are made or implied. Figures should be verified against current company filings before use.</div>
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
        <div class="miss-title">Other Income Is Not Operating Income</div>
        <div class="miss-body">E&P companies routinely earn 20–40% of their reported PAT from three non-operational sources: overdue-payment surcharges on gas utility receivables, foreign exchange gains on USD-denominated revenues, and interest income on short-term placements. These items inflate headline PAT and are cyclically and policy-dependent. When circular debt is paid down or the PKR stabilises, other income compresses — and reported EPS falls even if the underlying E&P business is unchanged. Reading PAT growth without disaggregating other income produces systematically misleading conclusions about operational improvement.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">02 ·</div>
        <div class="miss-title">Gas Prices Are Regulated, Not Market-Set</div>
        <div class="miss-body">Unlike oil, which is sold at international parity (Arab Light minus quality discount), natural gas wellhead prices in Pakistan are set by OGRA through a formal notification process. Companies cannot negotiate. This means gas revenue is administratively determined, and a company with a structural cost advantage in gas production captures that advantage directly in margin — it cannot translate it into higher prices. MARI's gas cost advantage over OGDC is therefore a margin-per-unit story, not a pricing story. Most retail analysis misses this distinction.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">03 ·</div>
        <div class="miss-title">Production Decline Is Geological, Not Cyclical</div>
        <div class="miss-body">Pakistan's E&P sector faces a structural production decline at its mature fields — OGDC's Qadirpur field, PPL's Sui, MARI's core block. This is not a function of oil prices or demand; it is the natural depletion curve of reservoirs that have been producing for 30–60 years. New wells extend production but rarely fully offset decline. The result is that even a company reporting growing revenue may be masking underlying volume erosion through price gains. Volume and price must always be tracked separately to avoid this conflation.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">04 ·</div>
        <div class="miss-title">The PKR/USD Rate Is the Fastest EPS Variable</div>
        <div class="miss-body">More than oil prices, more than gas price notifications, the PKR/USD monthly average is the single variable with the highest and fastest transmission to quarterly EPS. All oil sales, indexed gas revenues, and FX-denominated contract receivables are translated at the monthly average rate. A 5% PKR depreciation in a single quarter can create the same EPS impact as a $10/bbl oil price increase. This is why quarters with PKR stability often disappoint even when oil prices rise — the translation effect has already been absorbed.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">05 ·</div>
        <div class="miss-title">Receivables Are Not the Same as Revenue</div>
        <div class="miss-body">E&P companies bill gas utilities monthly but collect with varying delays — sometimes 6–18 months. Revenue is recognised when billed; cash is received later. This means a company can report strong EPS for multiple consecutive quarters while its cash position deteriorates. The receivable balance and its growth rate relative to revenue is the most important balance sheet signal in E&P analysis — not the income statement alone. OGDC's receivable-to-revenue ratio is a more informative indicator of financial health than its profit margin.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Short-Cycle vs Long-Cycle Drivers</h2>
    <p class="deep-intro">Different variables operate on completely different time horizons. Conflating near-term noise with structural change is one of the most common analytical errors in sector research.</p>
    <div class="cycle-grid">
    <div class="cycle-col">
      <div class="cycle-header" style="color:#4a9eff">NEAR TERM · 0–3 months</div>
      <div class="cycle-title">Quarterly EPS Drivers</div>
      <div class="cycle-item"><span class="cycle-driver">PKR/USD monthly average</span>Fastest transmission to reported EPS; a 5% move in the exchange rate creates a direct and proportional rupee gain or loss on all USD-denominated revenues.</div><div class="cycle-item"><span class="cycle-driver">Brent/Arab Light crude price</span>Oil revenue moves directly with realised price; tracked against monthly average not spot to avoid quarter-end distortions.</div><div class="cycle-item"><span class="cycle-driver">CPPA-G/utility payment releases</span>Cash receipts from government reduce receivables and generate surcharge other income; quarter of receipt determines when it appears in the P&L.</div><div class="cycle-item"><span class="cycle-driver">ETR adjustments (super tax)</span>Super tax provisions or reversals create large quarter-specific EPS moves that are non-recurring and should not be extrapolated.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#c8a96e">MEDIUM TERM · 3–18 months</div>
      <div class="cycle-title">Production and Price Signals</div>
      <div class="cycle-item"><span class="cycle-driver">New well completions and flow rates</span>Each well result updates the production trajectory for 12–24 months; commercial wells add to dispatch, dry wells write off exploration cost.</div><div class="cycle-item"><span class="cycle-driver">OGRA wellhead price notification</span>Infrequent but creates a permanent step-change in gas revenue per MMbtu; affects all gas volumes going forward from notification date.</div><div class="cycle-item"><span class="cycle-driver">Exploration campaign results</span>2–4 well programmes reveal basin prospectivity; material discoveries take 12–24 months to move from announcement to production contribution.</div><div class="cycle-item"><span class="cycle-driver">Circular debt stock trajectory</span>If the stock is growing, future surcharge income is at risk; if declining, it signals improved cash flow normalisation for E&P receivables.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#6aad6a">STRUCTURAL · 18 months+</div>
      <div class="cycle-title">Decade-Scale Determinants</div>
      <div class="cycle-item"><span class="cycle-driver">Reserve replacement ratio</span>If RRR is below 1.0x for 3+ consecutive years, production decline is inevitable regardless of price or policy; the most important long-term signal.</div><div class="cycle-item"><span class="cycle-driver">Tight gas programme viability</span>OGDC's 25-well Indus Basin programme is the sector's largest near-term volume catalyst; success or failure defines whether OGDC can arrest its production decline curve.</div><div class="cycle-item"><span class="cycle-driver">Gas pricing framework reform</span>Pakistan's administered gas pricing creates structural underinvestment; any shift toward market pricing would fundamentally change E&P economics.</div><div class="cycle-item"><span class="cycle-driver">Basin maturity and new acreage</span>As Sui, Qadirpur, and Adhi fields decline, replacement must come from new blocks — DGPC bidding rounds are therefore the decade-scale supply determinant.</div>
    </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Sector Interconnections</h2>
    <p class="deep-intro">How this sector connects to the broader macroeconomic and policy environment — and which transmission mechanisms are fastest, strongest, and most frequently misunderstood.</p>
    <div class="connect-grid">
      <div class="connect-card">
        <span class="connect-icon">💱</span>
        <div class="connect-title">Interest Rates</div>
        <div class="connect-body">Indirect effect only. Lower interest rates reduce the cost of circular debt servicing for gas utilities, which modestly improves their payment capacity to E&P companies. More directly, KIBOR affects the yield on E&P companies' short-term placements — a component of Other Income that falls as rates decline. The primary earnings sensitivity is not to KIBOR but to PKR stability, which the SBP's rate policy influences.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏦</span>
        <div class="connect-title">Currency (PKR/USD)</div>
        <div class="connect-body">The strongest and fastest single transmission mechanism in the sector. All crude oil revenues are USD-denominated; gas revenues are USD-indexed and converted monthly. A 10% PKR depreciation produces roughly a 10% increase in rupee-denominated oil revenue with no change in volumes or underlying price. This makes PKR trajectory the single highest-priority macro variable to track for E&P EPS forecasting.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🛢️</span>
        <div class="connect-title">Commodity Prices (Crude Oil)</div>
        <div class="connect-body">Oil prices set the revenue ceiling for crude-producing fields and establish the indexation baseline for some gas contracts. However, gas — not oil — is the dominant revenue source for OGDC (75%+ of revenue), PPL (85%), and MARI (nearly 100%). Administered gas prices mean that international gas prices have no direct transmission; only crude oil price changes have a direct and near-immediate EPS impact.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏛️</span>
        <div class="connect-title">Government Policy</div>
        <div class="connect-body">The dominant structural force in the sector. Wellhead gas prices are OGRA-notified; exploration blocks are DGPC-awarded; receivables depend on government payments to utilities; super tax rates are Finance Bill decisions. No other sector in Pakistan is as comprehensively shaped by government decisions across its entire revenue and cost structure. Policy risk — not market risk — is the primary analytical framework for E&P.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏭</span>
        <div class="connect-title">Industrial Demand</div>
        <div class="connect-body">Gas demand from fertiliser, power, and industrial sectors determines how much gas utilities need to purchase from E&P companies. Demand weakness (plant shutdowns, gas rationing) does not reduce billed revenue — contracts are take-or-pay — but it increases the strain on utility cash flows and worsens the receivable collection environment. Domestic gas demand is structurally growing but supply-constrained, making demand a secondary rather than primary EPS variable.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Business Model Winners &amp; Losers</h2>
    <p class="deep-intro">Different business model structures within this sector face systematically different conditions. The following describes which model characteristics tend to generate or destroy earnings margin under specific environments — without reference to specific companies as recommendations.</p>
    <div class="model-grid">
      <div class="model-card model-card-up">
        <div class="model-card-title">TENDS TO BENEFIT WHEN — High gas-to-revenue ratio, low production cost</div>
        <div class="model-row"><span class="model-condition">Administered price stability</span>Gas-dominant companies with low production costs are insulated from oil price volatility and benefit from any upward OGRA wellhead price revision as a permanent step-change.</div><div class="model-row"><span class="model-condition">PKR depreciation cycle</span>All USD-denominated revenues translate at higher rupee rates; companies with larger production volumes and no PKR-denominated costs benefit most.</div><div class="model-row"><span class="model-condition">Circular debt resolution</span>Large receivable balances generate surcharge income when collected; companies with the highest absolute receivable balances capture the most other income when payments arrive.</div><div class="model-row"><span class="model-condition">New field discoveries</span>Companies with active exploration programmes add reserves and production; discovery announcements create re-rating moments that are disproportionate to near-term EPS.</div>
      </div>
      <div class="model-card model-card-dn">
        <div class="model-card-title">TENDS TO FACE PRESSURE WHEN — High cost, oil-heavy, import-dependent</div>
        <div class="model-row"><span class="model-condition">PKR appreciation</span>Reduces rupee translation of all foreign-currency revenues with no offsetting cost reduction, since most costs are already PKR-denominated.</div><div class="model-row"><span class="model-condition">OGRA price freeze</span>Gas price notification delays mean years can pass with no revenue adjustment despite rising costs; cost-push inflation erodes margins directly.</div><div class="model-row"><span class="model-condition">Circular debt buildup</span>Utilities delay payments; receivable balances grow; surcharge income is deferred; cash conversion deteriorates even as revenue looks stable on the income statement.</div><div class="model-row"><span class="model-condition">Sustained oil price decline</span>Directly reduces crude revenue and reduces the indexation baseline for oil-linked gas contracts; most acutely affects companies with a higher oil-to-gas revenue mix.</div>
      </div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Structural Questions</h2>
    <p class="deep-intro">The major unresolved debates, policy uncertainties, and structural questions that will shape this sector over the next three to seven years. These are not predictions — they are the analytical dimensions that require active monitoring.</p>
    <div class="sq-list">
    <div class="sq-item">
      <div class="sq-q">Can Pakistan's domestic gas production decline be arrested without a pricing reform?</div>
      <div class="sq-context">OGDC, PPL, and MARI all face natural field depletion. The tight gas programme provides one mitigation path but requires capital investment that may not be justified under administered wellhead prices that have not kept pace with production costs. The structural question is whether the current pricing regime is compatible with maintaining — let alone growing — domestic gas supply.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">What happens to E&P receivables if the IMF programme ends or conditionalities relax?</div>
      <div class="sq-context">The September 2025 circular debt refinancing was partly IMF-conditioned. If the programme concludes or conditions loosen, the political incentive to resolve utility payments may weaken. The trajectory of E&P receivables over the next 24 months is therefore partly a function of IMF programme continuity, not just sector fundamentals.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Is the OGDC tight gas programme commercially viable at current wellhead prices?</div>
      <div class="sq-context">Tight gas requires higher production cost per MMbtu than conventional fields. At current OGRA-notified prices, the economics may be marginal. If the programme is scaled back, OGDC has no near-term production replacement beyond conventional well drilling — with direct implications for its long-term earnings trajectory.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Will Pakistan ever move toward market-based gas pricing?</div>
      <div class="sq-context">Every IMF programme has included energy pricing reform as a condition. Progress has been incremental. A move toward market-based gas prices would be transformative for E&P companies — dramatically increasing gas revenue per MMbtu — but would create affordability and industrial competitiveness challenges that have historically blocked reform.</div>
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
        <div class="dpeer-accent-bar" style="background:#4a9eff"></div>
        <div class="dpeer-ticker">OGDC</div>
        <div class="dpeer-name">Oil & Gas Development Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Scale operator — state-owned, volume-driven, low margin-per-unit, compensated by volume dominance</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">PKR depreciation + high crude prices + circular debt resolution: all three simultaneously amplify the large receivable and large USD revenue base</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">PKR appreciation, OGRA price freeze, dry well programme: all three compress margin while large fixed cost base remains</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led and policy-led — production volume and government payment decisions drive earnings more than any operational variable</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">PPL — Both are state-owned gas-dominant producers facing the same OGRA pricing constraint, circular debt exposure, and field maturity trajectory — OGDC is the larger, PPL is the more gas-pure</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#6aad6a"></div>
        <div class="dpeer-ticker">MARI</div>
        <div class="dpeer-name">Mari Petroleum Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Structural cost-advantage operator — single-block, low-cost, high-margin gas producer with captive feedstock position</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Gas price notification years + PKR depreciation: MARI earns the highest margin-per-unit on the most predictable production base in the sector</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">OGRA price freeze sustained over multiple years: MARI's feedstock advantage is large but if inflation runs ahead of notified prices for long enough, even low-cost producers face margin compression</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Margin-led — not volume growth but margin per MMbtu on a stable, high-reliability production base</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">PPL — Both are gas-dominant; MARI has the structural cost moat from Mari D&P block; PPL is more geographically diversified but also more exposed to field maturity — the comparison illuminates the value of single-block concentration vs diversification</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c8a96e"></div>
        <div class="dpeer-ticker">PPL</div>
        <div class="dpeer-name">Pakistan Petroleum Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Mature-field operator — gas-dominant, diversified across multiple large aging fields, lower growth potential than MARI but higher absolute volume than POL</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Stable macro: PPL benefits from price stability and predictable production; less upside leverage than OGDC on PKR moves due to smaller absolute revenue base, but less downside risk from field depletion than OGDC</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Sustained Sui field decline without replacement: Sui is PPL's largest asset and its depletion rate is the primary reserve replacement risk; a sharp decline would reduce PPL's volume base without equivalent compensation from smaller fields</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led and policy-led — gas volume at Sui and Kandkhot drives the top line; OGRA pricing decisions determine the per-unit return</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">OGDC — Both are large state-linked gas-dominant producers; the key analytical distinction is that OGDC has the tight gas programme as a near-term volume catalyst while PPL depends more on smaller field additions; OGDC has more upside and more execution risk</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c86e8f"></div>
        <div class="dpeer-ticker">POL</div>
        <div class="dpeer-name">Pakistan Oilfields Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">High-margin oil-concentrated operator — small volumes, highest oil-to-gas revenue ratio in the sector, highest per-unit margins, lowest absolute receivable exposure</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">High crude prices + PKR depreciation: POL receives international parity for its crude and translates it at spot PKR rates — both tailwinds amplify simultaneously with no offsetting administered-price constraint on oil revenue</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Sustained low crude prices + PKR appreciation: POL has no gas price floor to protect earnings when oil prices fall; it is the most directly exposed to the crude oil cycle among the four companies</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Margin-led and export-led (crude oil parity pricing) — POL earns the highest margin per unit and has the least receivable risk because oil buyers pay more reliably than gas utilities</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">MARI — Both are small, high-margin producers — POL on oil, MARI on gas. The key analytical distinction is commodity exposure: POL faces crude oil cycle risk while MARI faces OGRA administrative risk. Investors assess them as the two 'quality' operators in the peer group on different bases.</span></div>
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
        <td><span class="pfinal-ticker">OGDC</span></td>
        <td>Scale / State-owned</td>
        <td>PKR depreciation, high oil, circular debt resolution</td>
        <td>Price freeze, dry wells, receivable buildup</td>
        <td>Largest volume, largest receivable base, state backing</td>
        <td>Production decline at mature fields, OGRA price lag</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">MARI</span></td>
        <td>Structural cost advantage</td>
        <td>Gas price notification + stable PKR</td>
        <td>Multi-year OGRA freeze eroding real margin</td>
        <td>Lowest production cost in sector, captive block</td>
        <td>Single-block concentration, no volume growth path</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">PPL</span></td>
        <td>Mature multi-field operator</td>
        <td>Stable macro, incremental field additions</td>
        <td>Sui field sharp decline without replacement</td>
        <td>Gas volume scale, geographic diversification</td>
        <td>Field maturity, no major new discovery pipeline</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">POL</span></td>
        <td>High-margin oil operator</td>
        <td>High Brent + PKR depreciation</td>
        <td>Low crude + PKR appreciation</td>
        <td>Oil parity pricing, minimal utility receivable risk</td>
        <td>Smallest volume base, fully crude-cycle exposed</td>
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
      <div class="metric-name">Monthly PKR/USD Average Rate</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The exchange rate at which USD-denominated and USD-indexed revenues are converted to rupees in quarterly results</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The fastest and most direct EPS variable; a 5% move changes reported rupee earnings proportionally with no operational change required</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">It creates the illusion of operational improvement when it is purely a translation effect; companies with identical volume and price look different purely due to FX timing</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Production volumes (to separate FX gain from genuine volume-driven earnings) and prior-year comparison rates (to understand YoY base effects)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Brent Crude Monthly Average (USD/bbl)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The international benchmark that determines Pakistani crude oil realisation prices (less quality and transport discount)</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Directly sets oil revenue for OGDC oil fields and POL; also establishes the indexation baseline for some oil-linked gas contracts</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">It appears to affect all E&P companies equally, but gas-dominant companies (MARI, PPL) have very low actual sensitivity because their gas revenues are OGRA-notified, not market-priced</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Revenue mix (oil vs gas %) per company; OGRA notified wellhead price to understand which revenue stream is actually market-exposed</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Circular Debt Stock (Rs Billion)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The cumulative unpaid obligations that CPPA-G and gas utilities owe to power and E&P companies respectively</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The primary indicator of receivable collection risk; a rising stock indicates worsening payment delays ahead; a falling stock indicates improving cash conversion</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Government circular debt announcements often involve refinancing (converting payables into bonds) rather than actual payment — refinancing reduces the headline number without delivering cash to E&P companies</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">E&P company receivables on their balance sheets (to verify whether debt reduction translates to receivable collection) and the nature of any circular debt package (cash vs bond vs refinancing)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">APCMA / PPIS Reserve Data — RRR</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Reserve Replacement Ratio: new reserves added in the year divided by production depleted; measures whether a company is replacing what it extracts</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The single most important long-term earnings signal in E&P; a sustained RRR below 1.0x means production will decline regardless of price or policy</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A large one-time discovery can inflate RRR in a single year, masking a multi-year replacement shortfall; track the 3-year rolling average, not annual figures</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Production volumes (to verify depletion rate used in RRR calculation) and exploration expenditure (to assess how much capital is being deployed to achieve that replacement rate)</span></div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">13 · Metrics Framework</div>
    <h2 class="deep-h2">Company-Level Metrics</h2>
    <p class="deep-intro">Firm-level metrics that matter most when reading quarterly results and annual filings. For each metric: what it measures, why it matters, when it misleads, and what to read alongside it.</p>
    <div class="metric-card">
      <div class="metric-name">Realised Oil Price vs Brent (Discount)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The actual price received per barrel of crude divided by the Brent benchmark, expressed as a discount</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Reveals the quality and logistics adjustment to international price; a widening discount without explanation may signal either quality deterioration or a change in offtake contract terms</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">It can narrow simply because Brent falls faster than the discount in absolute terms, creating the optical illusion of improving realisations on weaker fundamentals</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Volume of oil sold (to ensure the realisation is applied to actual dispatches) and prior-year discount to track trend</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Realised Gas Price vs OGRA Notified Wellhead Price</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Gas revenue divided by gas volumes sold, compared against the OGRA-notified wellhead price for that field</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">If realised price is below notified price, the company is not collecting its full entitlement — a direct signal of non-payment or billing disputes rather than a price reduction</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Averaging across multiple fields with different notified prices can obscure under-collection at specific fields; field-level analysis from disclosure notes is more informative</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Receivable balance growth (growing receivables alongside below-notified realisation confirms non-collection rather than price reduction)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Other Income as % of PAT</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Total other income (surcharges, FX gains, interest) divided by profit after tax — measures how dependent reported earnings are on non-operational sources</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">When this ratio exceeds 25–30%, PAT is materially dependent on non-recurring or policy-sensitive items; the quality of earnings is lower than the headline figure suggests</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">It can appear to improve (fall) when PAT grows faster than other income — but if that PAT growth is itself driven by a PKR depreciation gain, the denominator is also inflated by a different non-operational item</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Operating profit before other income (to see the pure E&P margin) and the individual components of other income broken down by type</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Receivables-to-Revenue Ratio</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Total trade receivables on the balance sheet divided by annual revenue — measures how many months of revenue are outstanding as uncollected billings</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The most important balance sheet signal in E&P; rising ratio means collection is deteriorating even if the income statement looks strong; falling ratio means cash conversion is improving</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A large circular debt payment in a single quarter can cause a sharp one-quarter improvement that reverses in subsequent quarters — the trend over 4–6 quarters is more informative than any single data point</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Cash flow from operations (to verify whether reported profits are converting to actual cash) and short-term borrowings (companies fund the receivable gap through overdraft or short-term debt)</span></div>
    </div>
  </div>`,
  }
  ],
};

export default sector;

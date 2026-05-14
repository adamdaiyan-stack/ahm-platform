// data/sectors/cement.ts
// Auto-generated from pakistan_cement_sector_module.html
// Content: 13 tabs of sector intelligence for the Cement sector.

import type { SectorData } from "./types";

const sector: SectorData = {
  slug: 'cement',
  name: 'Cement',
  volume: 'Sector Intelligence Module · Volume I',
  subtitle: "A structured analytical framework covering sector economics, key variables, industry structure, company profiles, and monitoring signals for Pakistan's listed cement manufacturers.",
  accentColor: '#9b8b6e',
  stats: [
  { val: '86.7 Mt', lbl: 'Total Installed Capacity (FY24)' },
  { val: '~54–61%', lbl: 'Avg Capacity Utilisation' },
  { val: '$3.1B', lbl: 'Sector Revenue FY25' },
  { val: '$593M', lbl: 'Combined PAT FY25 (+38% YoY)' },
  { val: '~31%', lbl: 'Avg Gross Margin FY25' }
  ],
  tabs: [
  {
    id: 'overview',
    label: 'Overview',
    content: `<div class="section">
    <div class="section-label">01 · Sector Overview</div>
    <h2>What the Sector Does</h2>
    <p>Pakistan's cement sector produces Portland cement — the primary construction material for housing, infrastructure, and industrial projects. Production uses the dry-process kiln method: limestone and clay are ground, heated at ~1,450°C to produce clinker, then ground with gypsum to yield finished cement. Output is sold in 50kg bags through dealer networks domestically, or in loose bulk form for export.</p>
    <p>Pakistan is the fifth-largest cement producer globally with 29+ manufacturers. The sector is capital-intensive, energy-intensive, and structurally oversupplied — installed capacity of 86.7 Mt/year significantly exceeds domestic demand of approximately 48–52 Mt/year. Oversupply caps domestic pricing power and makes cost management and export competitiveness the primary margin levers.</p>

    <div class="divider"></div>
    <h2>Why It Matters on PSX</h2>
    <ul class="bl">
      <li>Direct proxy for Pakistan's construction and infrastructure cycle — one of the most observable economic indicators for domestic investors.</li>
      <li>Monthly APCMA dispatch data provides near-real-time volume signals ahead of quarterly results, making the sector highly trackable.</li>
      <li>Dual macro exposure — coal-cost sensitive and PKR-sensitive simultaneously — creates frequent earnings surprises in both directions.</li>
      <li>Combined sector PAT of $593M in FY25 (up 38% YoY) illustrates significant earnings leverage when cost and demand conditions align.</li>
      <li>EV/ton is the primary cross-sectional valuation metric; Pakistan's sector average (~$47.6/ton) remains below global peers, sustaining analytical interest.</li>
    </ul>

    <div class="divider"></div>
    <h2>Listed Players Covered</h2>
    <div class="bar-chart">
      <div class="bar-head">Capacity Share — Top 5 Listed Companies (FY25)</div>
      <div class="bar-row">
        <div class="bar-lbl">LUCK</div>
        <div class="bar-track"><div class="bar-fill" style="width:100%;background:var(--luck);"></div></div>
        <div class="bar-val">15.3 Mt · 17.6%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">BWCL</div>
        <div class="bar-track"><div class="bar-fill" style="width:99%;background:var(--bestway);"></div></div>
        <div class="bar-val">15.3 Mt · 17.5%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">DGKC</div>
        <div class="bar-track"><div class="bar-fill" style="width:44%;background:var(--dgkc);"></div></div>
        <div class="bar-val">6.72 Mt · 7.8%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">MLCF</div>
        <div class="bar-track"><div class="bar-fill" style="width:37%;background:var(--mlcf);"></div></div>
        <div class="bar-val">~5.7 Mt · ~6.5%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">KOHC</div>
        <div class="bar-track"><div class="bar-fill" style="width:26%;background:var(--kohc);"></div></div>
        <div class="bar-val">~3.9 Mt · ~4.5%</div>
      </div>
    </div>
    <p style="margin-top:10px;font-size:12.5px;">These five companies hold ~53–54% of Pakistan's total installed capacity. Other significant listed names include FCCL, PIOC, ACPL, CHCC, and PWCL. This module focuses on the five with the most distinguishing operating models and broadest analyst coverage.</p>
  </div>`,
  },
  {
    id: 'economics',
    label: 'Economics',
    content: `<div class="section">
    <div class="section-label">02 · How the Sector Makes Money</div>
    <h2>Revenue Model</h2>
    <p>Revenue has two channels: <strong style="color:var(--text)">domestic bag sales</strong> (PKR-denominated, ~70–85% of dispatches for most companies) and <strong style="color:var(--text)">exports</strong> (USD-denominated, primarily southern producers via Karachi port, or northern producers via Afghan land routes at higher cost).</p>
    <p>The meaningful revenue figure is not the retail or sticker price — it is the <strong style="color:var(--text)">retention price</strong>: what the manufacturer actually receives per bag after deducting dealer margins, freight, excise duty, and withholding tax. This is the number that feeds directly into gross margin analysis. Currently ~Rs790–920/bag depending on region and quarter.</p>

    <div class="divider"></div>
    <h2>Cost Structure</h2>
    <ul class="bl">
      <li><strong style="color:var(--text)">Coal (fuel) — 55–65% of direct production cost.</strong> The largest and most volatile cost item. Used to heat the clinker kiln. Source mix (Richards Bay at ~$85–110/ton, Afghan coal, domestic Pakistani coal at ~$93/ton) determines cost. Cheaper fuel access is the most durable competitive advantage in this sector.</li>
      <li><strong style="color:var(--text)">Electricity — 15–20% of direct production cost.</strong> Grid power costs Rs36–38/unit. WHR (waste heat recovery) and captive power cost Rs18–25/unit — roughly half the grid rate. This gap makes captive power investment the highest-return capex available in cement.</li>
      <li><strong style="color:var(--text)">Packaging, freight, and distribution — ~Rs80–120/bag.</strong> Relatively fixed per dispatch. Freight matters more for producers supplying distant markets or using trucking rather than port logistics for exports.</li>
      <li><strong style="color:var(--text)">Finance costs.</strong> Significant only for leveraged companies (notably MLCF). Directly and immediately affected by SBP policy rate movements.</li>
    </ul>

    <div class="divider"></div>
    <h2>What Expands Earnings</h2>
    <ul class="bl">
      <li>Retention price increases — even Rs50/bag improvement on large dispatch volumes produces material EPS uplift</li>
      <li>Coal cost decline — switching to cheaper Afghan or domestic coal saves Rs1,000–2,000/ton vs Richards Bay</li>
      <li>WHR or captive power commissioning — halves electricity cost on an ongoing basis; permanent margin improvement</li>
      <li>Volume growth — fixed costs spread over more dispatches; operating leverage is high in this capital-intensive sector</li>
      <li>Export volume growth — maintains utilisation when domestic demand is soft; generates USD earnings</li>
      <li>Interest rate cuts — directly reduce finance costs for leveraged companies (MLCF, DGKC historically)</li>
      <li>Lower effective tax rate (ETR) — WHR/renewable tax credits, or period-specific provisions, can produce quarter EPS spikes</li>
    </ul>

    <h2>What Compresses Earnings</h2>
    <ul class="bl">
      <li>Retention price declines — FY26 prices down ~6% YoY; primary driver of projected ~9% sector PAT contraction in 2QFY26</li>
      <li>Coal price increases or supply disruption — Afghan coal unavailability in FY26 forced reversion to Richards Bay at $85–110/ton</li>
      <li>Low utilisation / overcapacity — below ~60%, pricing discipline breaks down; sector currently at 54–61%</li>
      <li>High interest rates — finance cost burden on leveraged companies erodes operating profit</li>
      <li>PSDP underspending — actual government infrastructure disbursements frequently lag headline allocations by 40–60%</li>
      <li>Grid electricity tariff increases — IMF-driven power sector reforms are raising industrial electricity costs</li>
    </ul>

    <div class="note">Gross margin context: Sector average FY25 was ~31%. KOHC achieved ~38–42%, LUCK ~32–36%, BWCL ~28–32%. The spread is almost entirely explained by power source — companies with WHR or captive power earn structurally higher margins in every cycle.</div>
  </div>`,
  },
  {
    id: 'variables',
    label: 'Variables',
    content: `<div class="section">
    <div class="section-label">03 · Key Variables to Track</div>
    <h2>Variables That Move Earnings</h2>
    <p>For each variable: what it is, why it matters to cement earnings, and the directional impact on earnings or margins when the variable moves favourably (increases, unless noted).</p>

    <div class="tbl-wrap">
      <table class="var-tbl" style="min-width:620px;">
        <thead>
          <tr>
            <th style="width:200px;">Variable</th>
            <th>What It Is &amp; Why It Matters</th>
            <th style="width:110px;">Earnings Impact ↑</th>
          </tr>
        </thead>
        <tbody>
          <tr class="section-row"><td colspan="3">Demand &amp; Pricing</td></tr>
          <tr>
            <td class="vname">Retention Price (Rs/bag)</td>
            <td>Net price received per 50kg bag after dealer margins, freight, excise, and taxes. The actual top-line variable — not retail or sticker price. Down ~6% YoY in FY26; primary driver of current earnings headwind.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Domestic Dispatches (Mt)</td>
            <td>Monthly cement sold domestically (APCMA data). Drives operating leverage — fixed costs spread over higher volume. Below 60% utilisation = no pricing power. Above 75% = margin expansion possible.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Export Volumes (Mt)</td>
            <td>Cement exported globally, primarily Africa, South/SE Asia, and US (DGKC). USD-denominated. Key buffer when domestic demand is soft — southern producers with port access benefit most.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">PSDP Disbursements</td>
            <td>Federal/provincial infrastructure spend generating cement demand. Headline budget allocation overstates actual demand impact — actual utilisation often 50–60% of allocation. Track disbursements, not allocations.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr class="section-row"><td colspan="3">Cost</td></tr>
          <tr>
            <td class="vname">Coal Price ($/ton)</td>
            <td>55–65% of direct production cost. Three sources: Richards Bay ($85–110/ton), Afghan coal ($93–162/ton, supply disrupted FY26), domestic Pakistani coal (~$93/ton). Every $10/ton decline adds ~Rs1–2/share EPS for a mid-sized producer.</td>
            <td class="down">↓ Positive</td>
          </tr>
          <tr>
            <td class="vname">Afghan Coal Availability</td>
            <td>Distinct from price — a binary supply-chain risk. Supply disrupted FY26, forcing northern producers back to Richards Bay immediately. MLCF most exposed; LUCK (South, RB-based) least affected.</td>
            <td class="up">Availability ↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Power Source (WHR / CPP)</td>
            <td>Grid power at Rs36–38/unit vs WHR/captive at Rs18–25/unit. Once installed, a permanent structural cost advantage. Each Rs1/kWh reduction saves ~Rs150–200/ton. KOHC's 30MW coal CPP (FY26) is the sector's largest near-term margin catalyst.</td>
            <td class="up">CPP ↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Finance Cost / SBP Rate</td>
            <td>Policy rate directly moves interest expense for leveraged producers. 100bps cut adds Rs0.5–2/share for high-leverage peers (MLCF, DGKC historically). LUCK and KOHC are largely rate-insensitive due to low debt.</td>
            <td class="down">Rate ↓ Positive</td>
          </tr>
          <tr class="section-row"><td colspan="3">Other</td></tr>
          <tr>
            <td class="vname">Effective Tax Rate (ETR)</td>
            <td>Quarter-to-quarter ETR swings 10–20pp based on super tax, minimum tax, and WHR/renewable investment credits. A 10pp ETR drop can add Rs1–5/share. Frequently mistaken by retail investors for operational improvement. Require confirmation across multiple quarters.</td>
            <td class="down">ETR ↓ Positive</td>
          </tr>
          <tr>
            <td class="vname">PKR/USD Rate</td>
            <td>PKR depreciation is broadly positive for exporters (more PKR per USD earned) and modestly negative for coal importers (coal priced in USD). Net effect for most companies is mildly positive on depreciation. LUCK benefits most given its export scale.</td>
            <td class="down">Depreciation ↓ Positive (net)</td>
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
    <p>29+ producers, but effective competition is regional. Northern and southern markets function independently due to high freight costs. The top five companies hold ~54% of national capacity; the rest is fragmented across smaller regional producers. No single company can enforce pricing discipline across both zones.</p>

    <h3>Concentrated at the Top, Fragmented Below</h3>
    <ul class="bl">
      <li><strong style="color:var(--text)">Northern market (~72% of domestic consumption):</strong> BWCL, LUCK (Pezu), DGKC, KOHC, MLCF, FCCL, Pioneer, Cherat compete for the same dealer pool and construction demand. High competition; periodic pricing pressure.</li>
      <li><strong style="color:var(--text)">Southern market (~28% of domestic consumption, dominant in exports):</strong> LUCK (Karachi), PWCL, ACPL, DCL are the main players. Less crowded domestically; export focus provides an alternative demand channel unavailable in the North.</li>
    </ul>

    <div class="divider"></div>
    <h2>Pricing Power</h2>
    <p>Domestic pricing power is structurally weak due to persistent overcapacity at 54–61% utilisation. Pricing discipline occasionally emerges but breaks down as new capacity comes online. Meaningful sustained pricing power has historically only appeared above ~75% utilisation — not reached in the current cycle. Export pricing is globally determined; Pakistani cement is a price-taker competing against Egypt, Vietnam, and UAE producers on freight-adjusted cost.</p>

    <div class="divider"></div>
    <h2>Regulatory &amp; Policy Influence</h2>
    <ul class="bl">
      <li><strong style="color:var(--text)">PSDP allocation and utilisation:</strong> Government infrastructure spending is the largest single demand driver, particularly in the South. Policy shifts between austerity and expansion directly affect volume.</li>
      <li><strong style="color:var(--text)">Afghan coal border status:</strong> Any diplomatic or trade disruption at the Afghan-Pakistan border creates immediate cost-side risk for northern producers. Binary risk with no easy hedge.</li>
      <li><strong style="color:var(--text)">Tax regime (super tax, ETR provisions):</strong> WHR/renewable investment credits and periodic tax provisions create meaningful EPS variability quarter to quarter. FBR policy changes can shift effective tax rates materially within a year.</li>
      <li><strong style="color:var(--text)">SBP monetary policy:</strong> Rate cuts benefit highly leveraged companies directly. Current declining rate cycle is an EPS tailwind for MLCF and, to a lesser extent, DGKC.</li>
      <li><strong style="color:var(--text)">Power sector reform (IMF-driven):</strong> Tariff increases on grid electricity are raising energy costs for grid-dependent plants. Companies with WHR and captive power are structurally protected from this risk.</li>
    </ul>

    <div class="divider"></div>
    <h2>North vs South — Two Distinct Markets</h2>
    <div class="two-col">
      <div class="col-card">
        <div class="col-head">
          <span class="col-dot" style="background:var(--luck);"></span>
          Northern Market
        </div>
        <ul class="col-list">
          <li>~72% of domestic cement consumption</li>
          <li>Players: LUCK (Pezu), BWCL, DGKC, KOHC, MLCF, FCCL, Pioneer, Cherat</li>
          <li>Coal: Richards Bay, Afghan, domestic Pakistani mix</li>
          <li>Afghan coal historically ~30% cheaper; supply disrupted FY26, driving cost reversion</li>
          <li>Export route: land (Afghanistan) or truck to Karachi — costly; limits export economics</li>
          <li>Seasonal demand peak: March–June</li>
          <li>8MFY25 domestic dispatches: down 5.3% YoY</li>
          <li>Feb 2026 retail price: ~Rs1,409/bag</li>
        </ul>
      </div>
      <div class="col-card">
        <div class="col-head">
          <span class="col-dot" style="background:var(--accent3);"></span>
          Southern Market
        </div>
        <ul class="col-list">
          <li>~28% of domestic consumption; dominant in exports</li>
          <li>Players: LUCK (Karachi), PWCL, ACPL, DCL</li>
          <li>Coal: Richards Bay primary — port logistics efficient</li>
          <li>Port access enables bulk cement exports at competitive global cost</li>
          <li>LUCK's port silos: only company with bulk export capability in Pakistan</li>
          <li>Export markets: Africa, South/SE Asia, Indian Ocean, USA, Brazil</li>
          <li>8MFY25 southern exports: up 34.7% YoY to 4.82 Mt</li>
          <li>Feb 2026 retail price: ~Rs1,440/bag</li>
        </ul>
      </div>
    </div>
    <div class="note info" style="margin-top:14px;">When domestic demand is weak, southern producers outperform via exports. When domestic demand recovers, northern players benefit more from retention price firming due to higher volume base. LUCK is the only company with optionality across both dynamics simultaneously.</div>

    <div class="divider"></div>
    <h2>Export Dependence</h2>
    <p>Pakistan's export capability is asymmetric. Southern producers export competitively via port; northern producers face prohibitive freight costs. LUCK holds ~36.6% of Pakistan's total cement exports. Export growth has buffered domestic demand softness — October 2025 monthly export earnings reached $42.6M, a reported 11-year high. Total export revenue remains a small fraction of domestic revenue but is growing and strategically significant.</p>
  </div>`,
  },
  {
    id: 'companies',
    label: 'Companies',
    content: `<div class="section">
    <div class="section-label">05 · Company Profiles</div>
    <h2>Top 5 Listed Companies</h2>
    <p>Figures are drawn from publicly available company disclosures, APCMA data, and broker research. Verify against current filings.</p>

        <div class="company-grid">

      <div class="company-card card-luck">
        <div class="company-ticker ticker-luck">PSX: LUCK</div>
        <div class="company-name">Lucky Cement Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> YBG conglomerate with two cement plants (Pezu KPK + Karachi Sindh); exports bulk cement via port silos; holds stakes in Lucky Motors, ICI Pakistan, and others.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Only Pakistani cement producer with port silos, enabling bulk/loose cement exports at globally competitive freight cost. Dual-zone geography allows pivot between domestic demand and export.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Conglomerate structure makes cement-only EPS hard to isolate; subsidiary earnings (Lucky Motors, ICI) can dominate consolidated results.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Domestic retention price and dispatch volumes (North plant); export volumes and USD realisation (South plant); subsidiary earnings in consolidated P&L.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Retention price compression; Afghan coal supply disruption for North plant; subsidiary performance adds consolidated EPS volatility unrelated to cement.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Port silos — no other Pakistani cement producer can export bulk cement at competitive global freight cost; a capital-intensive moat built over decades.</li>
        </ul>
      </div>

      <div class="company-card card-bestway">
        <div class="company-ticker ticker-bestway">PSX: BWCL</div>
        <div class="company-name">Bestway Cement Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Pakistan's largest cement producer by capacity (15.3 Mt/yr); 8 production lines across 5 northern locations; majority-owned by UK-based Bestway Group (56.43%); single-business focus.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Maximum northern scale (8 production lines) combined with foreign-parent governance discipline; single-business model produces more readable financials than conglomerate peers.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> No export optionality — entirely northern with no port access; Richards Bay coal dependency limits fuel flexibility vs Afghan coal users when RB prices rise.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Northern retention price and dispatch volume; Richards Bay coal cost on the input side.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Northern retention price compression with no export buffer; RB coal price rises are absorbed fully with no substitution optionality.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> British parent governance and single-business focus create a lower-conglomerate-noise earnings profile — more predictable than family-owned peers with cross-sector holdings.</li>
        </ul>
      </div>

      <div class="company-card card-dgkc">
        <div class="company-ticker ticker-dgkc">PSX: DGKC</div>
        <div class="company-name">D.G. Khan Cement Co. Ltd</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Nishat Group cement company; 4 plants (2 DG Khan, 1 Chakwal, 1 Hub/Balochistan); Richards Bay imported coal; US subsidiary announced July 2024 to export 600,000 tpa low-alkali cement.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> North + South plant presence is rare at this scale; Nishat Group capital access; US low-alkali deal introduces a differentiated, USD-denominated niche revenue stream.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Richards Bay coal inflexibility — less cost optionality vs Afghan coal users; Hub plant adds logistical complexity without port silo export capability.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Finance cost trajectory (high leverage makes rate cuts the primary near-term earnings lever); domestic dispatch volumes; US low-alkali ramp-up timeline.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Imported coal cost exposure; US export ramp-up execution risk; high leverage means rate reversals compress EPS materially.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> US low-alkali cement export deal (600,000 tpa) — a niche specialty grade not widely produced in Pakistan, addressing a market segment no domestic cement peer currently serves.</li>
        </ul>
      </div>

      <div class="company-card card-kohc">
        <div class="company-ticker ticker-kohc">PSX: KOHC</div>
        <div class="company-name">Kohat Cement Company Ltd</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> KPK-focused northern cement producer; low-debt, high-margin operation; 15.4MW solar installed; 30MW coal captive power plant under construction to cut electricity cost from Rs37–38 to Rs20–21/unit.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Sector-leading gross margins (38–42%) through disciplined energy investment; low debt means earnings are structurally insulated from the rate cycle volatility that drives leveraged peers.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Smallest capacity of the five (~3.9 Mt/yr); no southern or export exposure; Khushab greenfield expansion adds near-term capex and execution risk.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Gross margin expansion from captive power commissioning; domestic northern dispatch volume and retention price.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Captive power plant commissioning delay or cost overrun; northern retention price weakness directly compresses already-high margins with no offset.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Highest gross margin in the listed cement sector, achieved through energy investment rather than pricing power or volume scale — a cost-structure differentiation peers have not matched.</li>
        </ul>
      </div>

      <div class="company-card card-mlcf">
        <div class="company-ticker ticker-mlcf">PSX: MLCF</div>
        <div class="company-name">Maple Leaf Cement Factory Ltd</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Mianwali (Punjab) northern cement producer; first mover in Afghan coal adoption and biomass (rice husk) supplementary fuel; parent: Kohinoor Textile Mills (57.9%).</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Pioneer in Afghan coal and biomass fuel mix — fuel innovation that reduced production cost by Rs1,000–2,000/ton before peers adopted the same approach.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Afghan coal supply disruption in FY26 eliminated the cost advantage temporarily; high finance costs (surged 50% in FY24); single-zone plant with no southern or export access.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Afghan coal availability and cost (determines margin advantage vs peers); SBP rate cycle (high leverage amplifies rate cuts as earnings driver); domestic retention price.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Afghan coal supply disruption is the primary near-term risk — already materialised in FY26. High leverage means rate reversals are acutely damaging to earnings.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The company that first adopted Afghan coal and biomass in cement production — innovations subsequently copied by the entire northern cement industry. Fuel mix innovation, not geography or scale, is the structural differentiator.</li>
        </ul>
      </div>

    </div>
        <ul class="co-bullets">
          <li>Two plants: Pezu (KPK, North) and Karachi (Sindh, South) — only company with production scale in both zones</li>
          <li>Only Pakistani cement producer with port silos, enabling bulk/loose cement exports at globally competitive freight cost</li>
          <li>Karachi plant: 65% of power from renewables (solar + 28.8MW wind + BESS); reducing grid dependency permanently</li>
          <li>Yunus Brothers Group (YBG) conglomerate — holds stakes in Lucky Motors, ICI Pakistan, and others; consolidated EPS reflects these subsidiaries</li>
        </ul>
        <div class="co-4grid">
          <div class="co-4cell"><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Dual geography + port silos = ability to pivot between domestic demand and export without structural constraint. Renewable power permanently lowers fixed cost vs. peers.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Conglomerate structure means cement-only EPS is hard to isolate. Subsidiary performance (Lucky Motors, ICI) can dominate consolidated results and obscure cement trends.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Port silos. No other Pakistani cement producer can export bulk cement at competitive global freight cost — a moat that took decades and significant capital to build.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Retention price (domestic volumes) and export realisation (USD). Subsidiary EPS swings add consolidated EPS volatility unrelated to cement operations.</span></div>
        </div>
        <div class="tags">
          <span class="tag a">Export Leader</span>
          <span class="tag g">Renewables</span>
          <span class="tag b">Dual Zone</span>
          <span class="tag">Conglomerate</span>
        </div>
      </div>

      <!-- BWCL -->
      <div class="company-card card-bestway">
        <div class="co-ticker t-bestway">PSX: BWCL</div>
        <div class="co-name">Bestway Cement Limited</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Capacity</span><span class="co-meta-val">15.3 Mt/yr</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Mkt Cap</span><span class="co-meta-val">~$1.1B</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Lines / Plants</span><span class="co-meta-val">8 lines / 5 locations</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Owner</span><span class="co-meta-val">Bestway Group UK (56.43%)</span></div>
        </div>
        <ul class="co-bullets">
          <li>Largest cement producer by installed capacity; all eight production lines in northern Pakistan (Hattar, Farooqia, Chakwal, Kallar Kahar, Mianwali)</li>
          <li>Completed two brownfield line additions in early 2023 (Hattar, Mianwali); FY24 revenue ~$428M at ~16.8% PBT margin</li>
          <li>Primarily uses Richards Bay coal; partial shift toward Afghan/local coal blends in progress</li>
          <li>British parent ownership provides governance standards and capital access above domestic listed peers</li>
        </ul>
        <div class="co-4grid">
          <div class="co-4cell"><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Maximum northern scale (8 lines) with foreign parent governance discipline. Less conglomerate noise — single-business focus makes financials more readable than peers.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">No export optionality — entirely northern, no port access. Richards Bay coal dependency means less fuel flexibility than Afghan coal users when RB prices rise.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Combination of maximum northern capacity and UK-linked governance creates a structurally different risk profile — higher predictability, lower conglomerate or family-governance risk.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Northern retention price and Richards Bay coal cost. No export buffer when both deteriorate simultaneously.</span></div>
        </div>
        <div class="tags">
          <span class="tag b">North Dominant</span>
          <span class="tag">British Parent</span>
          <span class="tag a">8 Lines</span>
        </div>
      </div>

      <!-- DGKC -->
      <div class="company-card card-dgkc">
        <div class="co-ticker t-dgkc">PSX: DGKC</div>
        <div class="co-name">D.G. Khan Cement Co. Ltd</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Capacity</span><span class="co-meta-val">6.72 Mt/yr</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Mkt Cap</span><span class="co-meta-val">~$279M</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">EV/ton</span><span class="co-meta-val">~$28.6</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Dealer Network</span><span class="co-meta-val">2,200+</span></div>
        </div>
        <ul class="co-bullets">
          <li>Nishat Group (Mian Mansha); 4 plants: 2 in DG Khan, 1 in Chakwal (North), 1 in Hub/Balochistan (South)</li>
          <li>Primarily uses Richards Bay imported coal; analyst coverage (Topline) indicates this will continue vs peers shifting to Afghan coal</li>
          <li>US subsidiary announced July 2024 to export 600,000 tons/year of low-alkali cement to the US market — USD-denominated revenue stream</li>
          <li>2QFY25 EPS Rs4.03, up 3.5x YoY — driven by higher dispatches, improved retention prices, and reduced finance costs</li>
        </ul>
        <div class="co-4grid">
          <div class="co-4cell"><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">North + South plant network is rare at this scale. Nishat Group backing provides capital access. US low-alkali deal introduces a differentiated, USD-denominated niche revenue stream.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Richards Bay coal inflexibility — less cost optionality when cheaper Afghan alternatives are available. Hub plant adds logistical complexity without port silo access for export.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">US low-alkali cement export. This specialty grade (used in construction with reactive aggregates) is not widely produced in Pakistan and requires a dedicated market relationship to commercialise.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Coal price (imported RB) and finance costs. Rate cuts have outsized benefit due to historical leverage. Domestic dispatch recovery is the volume catalyst.</span></div>
        </div>
        <div class="tags">
          <span class="tag">Nishat Group</span>
          <span class="tag a">US Export</span>
          <span class="tag b">N+S Plants</span>
        </div>
      </div>

      <!-- KOHC -->
      <div class="company-card card-kohc">
        <div class="co-ticker t-kohc">PSX: KOHC</div>
        <div class="co-name">Kohat Cement Company Ltd</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Capacity</span><span class="co-meta-val">~3.9 Mt/yr</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Mkt Cap</span><span class="co-meta-val">~$292M</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">EV/ton</span><span class="co-meta-val">~$31.6</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Gross Margin</span><span class="co-meta-val">~38–42%</span></div>
        </div>
        <ul class="co-bullets">
          <li>KPK-based, Lahore-HQ; focused low-debt northern operator with sector-leading gross margins</li>
          <li>15.4MW solar installed; 30MW coal captive power plant under construction (expected FY26) to cut electricity from Rs37–38/unit to Rs20–21/unit</li>
          <li>Production cost down from Rs10,653 to Rs9,523/ton; ASP up from Rs14,900 to Rs16,300/ton — margin expansion structural, not cyclical</li>
          <li>Greenfield expansion in Khushab underway; entered real estate via Ultra Properties subsidiary</li>
        </ul>
        <div class="co-4grid">
          <div class="co-4cell"><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Sector-leading gross margins via disciplined energy investment. Low debt means rate changes are irrelevant — KOHC earns high margins in all interest rate environments.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Smaller scale limits market influence. KPK geography means no export optionality. Non-core diversification (real estate, PIA consortium interest) introduces risk for cement-focused investors.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">The 30MW coal CPP is the sector's most impactful near-term capital project. When commissioned, it will halve per-unit electricity cost and permanently widen KOHC's margin advantage over grid-dependent peers.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Northern retention price (no export buffer). ETR variability — 4QFY24 EPS Rs10.50 (+349% YoY) was partly ETR-driven; distinguish from operational improvement.</span></div>
        </div>
        <div class="tags">
          <span class="tag g">Highest Margin</span>
          <span class="tag g">CPP Catalyst</span>
          <span class="tag">Low Debt</span>
          <span class="tag a">Khushab Expansion</span>
        </div>
      </div>

      <!-- MLCF -->
      <div class="company-card card-mlcf">
        <div class="co-ticker t-mlcf">PSX: MLCF</div>
        <div class="co-name">Maple Leaf Cement Factory Ltd</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Capacity</span><span class="co-meta-val">~5.7 Mt/yr</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Mkt Cap</span><span class="co-meta-val">~$314M</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">EV/ton</span><span class="co-meta-val">~$34.2</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">GP Margin FY24</span><span class="co-meta-val">31.55%</span></div>
        </div>
        <ul class="co-bullets">
          <li>Owned by Kohinoor Textile Mills (57.9%); single northern plant in Mianwali, Punjab</li>
          <li>First mover in Afghan coal adoption — cost innovation that later became industry-wide practice; also uses biomass (rice husk) in fuel mix</li>
          <li>FY24 topline Rs66.45B; local sales declined 6%, exports grew 36% YoY; finance costs surged 50% on high interest rates</li>
          <li>FY24 EPS Rs4.98; 2QFY25 EPS Rs1.51 (down 29% YoY) — Afghan coal disruption and lower dispatches</li>
        </ul>
        <div class="co-4grid">
          <div class="co-4cell"><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Fuel innovation leadership — Afghan coal + biomass mix produced FY24's highest sector gross margin (31.55%). Demonstrated willingness to adopt alternative fuels before peers.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Highest leverage of the five — finance costs surge with rates and are MLCF's largest EPS variable. Single northern plant with no port access limits export economics structurally.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">When Afghan coal is available and rates are declining, MLCF's combined operating and financial leverage produces the highest earnings uplift of the five. It is the most rate-cycle-sensitive cement company in this module.</span></div>
          <div class="co-4cell"><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Binary risk: Afghan coal availability (supply chain) + SBP policy rate (finance costs). Both improving simultaneously produces outsized EPS recovery; both adverse simultaneously — as in FY26 — produces deep compression.</span></div>
        </div>
        <div class="tags">
          <span class="tag g">Afghan Coal Pioneer</span>
          <span class="tag g">Biomass Fuel</span>
          <span class="tag r">High Leverage</span>
          <span class="tag">Kohinoor Parent</span>
        </div>
      </div>`,
  },
  {
    id: 'peers',
    label: 'Peers',
    content: `<div class="section">
    <div class="section-label">06 · Peer Comparison Grid</div>
    <h2>Cross-Company Comparison</h2>
    <p>Based on publicly available disclosures and industry data. Cross-reference against current filings.</p>

    <div class="tbl-wrap">
      <table class="peer-tbl" style="min-width:880px;">
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
            <td><div class="co-badge b-luck">LUCK</div><br><span style="font-size:12px;">Lucky Cement</span></td>
            <td>Dual-zone (N+S), conglomerate. Domestic scale + export via port silos. 65% renewable power at Karachi plant.</td>
            <td>Port silos = only bulk export capability. Renewables permanently lower fixed cost.</td>
            <td>Conglomerate structure — subsidiary EPS swings obscure cement-only performance.</td>
            <td>Retention price (domestic) and export realisation (USD). Subsidiary results.</td>
            <td>Only company that can simultaneously lead domestic volumes and international exports without structural cost disadvantage.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-bestway">BWCL</div><br><span style="font-size:12px;">Bestway Cement</span></td>
            <td>Pure northern operator. 8 production lines. Single-business cement. British parent.</td>
            <td>Maximum northern capacity + UK-linked governance discipline. Least conglomerate noise.</td>
            <td>No export optionality. RB coal dependency. Entirely exposed to northern demand cycle.</td>
            <td>Northern retention price and Richards Bay coal cost.</td>
            <td>Largest northern producer with foreign parent oversight — predictable governance profile distinct from domestically-owned peers.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-dgkc">DGKC</div><br><span style="font-size:12px;">D.G. Khan Cement</span></td>
            <td>Mid-sized N+S presence. Nishat Group. RB coal. US low-alkali export agreement.</td>
            <td>Dual-zone network rare at this scale. Nishat capital access. Distinctive US export deal.</td>
            <td>RB coal cost inflexibility. Hub plant logistics without port silo access.</td>
            <td>Coal price (imported) and finance costs. Domestic dispatch volumes.</td>
            <td>US low-alkali cement export — only Pakistani producer in this niche, USD-denominated market segment.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-kohc">KOHC</div><br><span style="font-size:12px;">Kohat Cement</span></td>
            <td>Lean northern focused operator. High margins via energy investment. Low debt, no export.</td>
            <td>Sector-leading gross margins (~38–42%). CPP programme structurally widens cost advantage.</td>
            <td>Small scale. No export option. Non-core diversification creates investor noise.</td>
            <td>Northern retention price. ETR variability can distort quarter EPS.</td>
            <td>30MW coal CPP (FY26 commissioning) — most impactful near-term cost project of the five; will halve electricity unit cost permanently.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-mlcf">MLCF</div><br><span style="font-size:12px;">Maple Leaf</span></td>
            <td>Single northern plant. Afghan coal + biomass fuel pioneer. High leverage. Rate-cycle sensitive.</td>
            <td>Fuel innovation record — highest sector GP margin in FY24 when Afghan coal available.</td>
            <td>Highest leverage — finance costs are largest EPS variable. No export optionality.</td>
            <td>Afghan coal availability (binary supply risk) + SBP policy rate (direct finance cost link).</td>
            <td>When Afghan coal available and rates decline simultaneously, MLCF's earnings leverage is highest of the five — the rate-cycle and fuel proxy in one company.</td>
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
            <th>LUCK</th>
            <th>BWCL</th>
            <th>DGKC</th>
            <th>KOHC</th>
            <th>MLCF</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong style="color:var(--text)">Capacity (Mt/yr)</strong></td><td>15.3</td><td>15.3</td><td>6.72</td><td>~3.9</td><td>~5.7</td></tr>
          <tr><td><strong style="color:var(--text)">Zone</strong></td><td>N + S</td><td>North</td><td>N + S</td><td>North</td><td>North</td></tr>
          <tr><td><strong style="color:var(--text)">Coal Source</strong></td><td>RB + Afghan mix</td><td>RB (shifting)</td><td>Imported RB</td><td>Local + RB</td><td>Afghan + Biomass</td></tr>
          <tr><td><strong style="color:var(--text)">Power Strategy</strong></td><td>28.8MW wind + solar + BESS</td><td>Moderate WHR</td><td>82MW captive</td><td>Solar + 30MW coal CPP</td><td>Moderate</td></tr>
          <tr><td><strong style="color:var(--text)">Export Exposure</strong></td><td>Very high (port silos)</td><td>Low</td><td>Medium (US deal)</td><td>Low</td><td>Medium (land route)</td></tr>
          <tr><td><strong style="color:var(--text)">Leverage / Rate Sensitivity</strong></td><td>Low — cash surplus</td><td>Medium</td><td>Declining</td><td>Low</td><td>High</td></tr>
          <tr><td><strong style="color:var(--text)">Gross Margin (~)</strong></td><td>32–36%</td><td>28–32%</td><td>29–32%</td><td>38–42%</td><td>30–32%</td></tr>
          <tr><td><strong style="color:var(--text)">EV/ton (US$)</strong></td><td>Below avg</td><td>~Avg</td><td>~28.6</td><td>~31.6</td><td>~34.2</td></tr>
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
        <div class="risk-name">Structural Overcapacity</div>
        <div class="risk-desc">86.7 Mt installed vs ~48–52 Mt domestic demand. Utilisation at 54–61% structurally limits pricing power. New capacity additions — several underway — further depress utilisation. Pricing discipline breaks down below ~60% utilisation and no single producer controls enough market share to enforce it. This is an endemic multi-year constraint, not a cyclical one.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Afghan Coal Supply Disruption</div>
        <div class="risk-desc">Supply disrupted in FY26, reverting northern producers to Richards Bay immediately. This is a binary, not gradual, risk — available or not, with no easy substitute in the short term. Any deterioration in Afghanistan-Pakistan trade relations or border logistics creates immediate cost-side impact. MLCF is most exposed; LUCK (South, RB-based) is least affected.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Retention Price Pressure</div>
        <div class="risk-desc">FY26 retention prices down ~6% YoY — the primary driver of projected ~9% sector PAT contraction in 2QFY26 despite better volumes. Price competition among oversupplied northern producers can be rapid and self-reinforcing. No company has demonstrated sustained pricing power in the current cycle without demand recovery first.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">PSDP Disbursement Shortfall</div>
        <div class="risk-desc">Federal and provincial PSDP allocations regularly run 40–60% below headline allocations at actual utilisation. Investors frequently overestimate demand based on announced budgets. IMF fiscal consolidation requirements further compress PSDP, particularly in infrastructure-dependent southern markets.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Energy Cost Inflation</div>
        <div class="risk-desc">Grid electricity tariff increases (IMF-driven power sector reform) raise operating costs for grid-dependent plants. Companies with WHR and captive power are partially protected; those still dependent on the national grid are directly exposed to an accelerating cost headwind.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Finance Cost Risk (Leveraged Companies)</div>
        <div class="risk-desc">MLCF is most exposed — finance costs surged 50% in FY24. While the SBP rate cycle is now declining, any inflationary reversal (currency shock, energy pass-through) would immediately reverse the leverage benefit. LUCK and KOHC are largely immune; DGKC is intermediate.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">International Coal Price Volatility</div>
        <div class="risk-desc">Richards Bay coal is globally traded and USD-priced. Pakistan's cement sector is a price-taker. Supply shocks (shipping, mining disruptions, demand from other coal-dependent economies) can move thermal coal prices significantly without Pakistani-specific triggers. Southern producers and DGKC are most exposed.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Export Competitiveness</div>
        <div class="risk-desc">Pakistan's export economics depend on freight-competitive production — a structural advantage for southern port-access producers only. High grid electricity tariffs structurally limit competitiveness for northern exporters relative to Egyptian, Vietnamese, and UAE competitors operating in the same global markets.</div>
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
          <li><strong style="color:var(--text);">APCMA dispatch data</strong> — total industry + zone (N/S) + company-level volumes. Published ~10th of each month for prior month. Most important leading indicator for quarterly results.</li>
          <li><strong style="color:var(--text);">APCMA export data</strong> — North/South split. Southern export growth signals demand diversification from domestic weakness.</li>
          <li><strong style="color:var(--text);">Afghan coal border status</strong> — any reports of border restrictions affect northern producers' cost outlook immediately and directly.</li>
          <li><strong style="color:var(--text);">Richards Bay coal price (FOB)</strong> — tracks imported coal cost for RB-dependent companies. USD-denominated; PKR move also relevant.</li>
          <li><strong style="color:var(--text);">Retail bag price</strong> — industry-reported. Signal of demand/supply balance and dealer-level pricing conditions.</li>
        </ul>
      </div>
      <div class="monitor-col">
        <div class="monitor-head">Quarterly</div>
        <ul class="monitor-list">
          <li><strong style="color:var(--text);">Financial results</strong> — derive retention price (revenue ÷ dispatches), cost per ton (COGS ÷ dispatches), and gross margin trend. Finance cost absolute and as % of EBIT.</li>
          <li><strong style="color:var(--text);">Coal cost per ton</strong> — reported or derivable. Signals fuel mix changes. Key margin differentiator across companies.</li>
          <li><strong style="color:var(--text);">Capacity utilisation</strong> — total dispatches as % of installed capacity. Below 55% = pricing pressure. Above 65% = margin expansion possible.</li>
          <li><strong style="color:var(--text);">Effective tax rate</strong> — distinguish ETR-driven EPS from operational margin improvement. ETR quarter EPS spikes should not be extrapolated.</li>
          <li><strong style="color:var(--text);">PSDP disbursement data</strong> — Ministry of Finance monthly releases. Actual utilisation vs. headline allocation is the relevant number.</li>
          <li><strong style="color:var(--text);">SBP policy rate decisions</strong> — direct and immediate impact on MLCF and DGKC finance costs.</li>
        </ul>
      </div>
      <div class="monitor-col">
        <div class="monitor-head">Event-Driven</div>
        <ul class="monitor-list">
          <li><strong style="color:var(--text);">Capacity announcements</strong> — any greenfield/brownfield expansion adding to an oversupplied market. Time from announcement to commissioning is 12–24 months; begin tracking sentiment impact early.</li>
          <li><strong style="color:var(--text);">Afghan border status changes</strong> — diplomatic incidents or trade restrictions at the Pak-Afghan border; immediate cost impact for northern producers.</li>
          <li><strong style="color:var(--text);">Federal Budget (June)</strong> — super tax rate, WHR/renewable investment credits, withholding tax changes, regulatory duty changes on coal imports.</li>
          <li><strong style="color:var(--text);">KOHC CPP commissioning</strong> — 30MW coal captive plant expected FY26. Track first commissioning announcement and validate in quarterly cost data.</li>
          <li><strong style="color:var(--text);">DGKC US export commencement</strong> — low-alkali shipments via US subsidiary. Monitor first shipment confirmation and USD export revenue materialisation in financials.</li>
          <li><strong style="color:var(--text);">CPEC/infrastructure project awards</strong> — large project contracts particularly in the South can signal multi-quarter demand catalysts.</li>
        </ul>
      </div>
    </div>

    <div class="divider"></div>
    <h2>Important Dates &amp; Timeline</h2>
    <div class="tl-item">
      <div class="tl-when">~10th monthly</div>
      <div class="tl-what">APCMA dispatch data — North/South zone split, company volumes, domestic vs. export. Most-watched monthly release in cement sector analysis.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Sep / Oct</div>
      <div class="tl-what">1QFY results — captures construction-season peak (April–June) demand. Sets the base rate for annual forecasts.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Jan / Feb</div>
      <div class="tl-what">2QFY results — seasonally softest domestic demand quarter. Afghan coal procurement signals for the next season may be embedded in cost figures.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Apr / May</div>
      <div class="tl-what">3QFY results — captures the construction-season restart. First signal of whether retention prices have shifted for the new season.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Jul / Aug</div>
      <div class="tl-what">4QFY and full-year results — dividend announcements and capex guidance. Full-year EPS comparison most meaningful here.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">June (Federal Budget)</div>
      <div class="tl-what">PSDP allocation, super tax rate, WHR/renewable credits, coal import duties. Highest-impact annual policy event for the sector.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Mar–Jun (Construction)</div>
      <div class="tl-what">Peak domestic demand period. Monthly APCMA data in this window sets the volume narrative for the full year. Retention price trends here are the clearest pricing signal.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Aug–Oct (Post-harvest)</div>
      <div class="tl-what">Post-harvest rural construction pickup — agricultural income realisation drives housing activity. Relevant for northern demand particularly.</div>
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
        <div class="glo-term">Retention Price</div>
        <div class="glo-def">Net price received by the manufacturer per 50kg bag after deducting dealer margins, freight, excise duty, and taxes from retail price. The actual revenue variable. Currently ~Rs790–920/bag depending on region and quarter. Always use retention price, not retail or sticker price, for margin analysis.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Clinker</div>
        <div class="glo-def">Intermediate product formed by heating limestone and clay in the kiln at ~1,450°C. Ground with gypsum to produce cement. All coal cost is incurred at this stage — the kiln is where the sector's primary cost variable lives.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">WHR (Waste Heat Recovery)</div>
        <div class="glo-def">Captures kiln exhaust heat to generate electricity — typically 8–15MW per kiln line. Reduces grid reliance at near-zero marginal cost vs Rs36–38/unit for grid power. Best proxy for above-average gross margins: WHR presence correlates directly with sustained margin outperformance.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Captive Power Plant (CPP)</div>
        <div class="glo-def">On-site power facility owned by the cement company. Can use coal, gas, HFO, solar, or wind. Kohat's 30MW coal CPP will produce power at ~Rs20–21/unit vs Rs37–38/unit for grid — a permanent ~50% reduction in electricity cost per unit.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Richards Bay (RB) Coal</div>
        <div class="glo-def">South African thermal coal exported from Richards Bay. Global benchmark grade for southern Pakistan plants and many northern ones. ~$85–110/ton. USD-denominated — PKR moves affect its rupee cost directly. Higher calorific value but more expensive than Afghan or domestic alternatives.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Afghan Coal</div>
        <div class="glo-def">Imported via land border from Afghanistan. Historically 20–40% cheaper than Richards Bay; MLCF pioneered its adoption. Supply became disrupted in FY26, forcing reversion to Richards Bay. Treat as a binary risk — available or unavailable — not a gradual price signal.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">EV/Ton</div>
        <div class="glo-def">Enterprise Value ÷ annual installed capacity in metric tons. Primary cross-sectional valuation metric for cement globally. Pakistan sector average ~$47.6/ton. Use alongside earnings-based metrics — low EV/ton alone does not indicate value without earnings support.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">APCMA</div>
        <div class="glo-def">All Pakistan Cement Manufacturers Association. Publishes monthly dispatch data (volumes by company, zone N/S, domestic vs. export). The most-watched monthly release in sector analysis — published ~10th of each month for the prior month.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">PSDP</div>
        <div class="glo-def">Public Sector Development Programme — federal government annual infrastructure spending budget. Key demand driver for cement. Critical caveat: actual disbursements are typically 40–60% of headline allocations. Track actual utilisation, not the headline budget number.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Port Silos</div>
        <div class="glo-def">Bulk cement storage and ship-loading infrastructure at port. Lucky Cement is the only Pakistani producer with port silos — enabling export of loose/bulk cement at competitive freight cost. Bagged cement is significantly more expensive per ton to export; port silos make bulk shipments viable.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Low-Alkali Cement</div>
        <div class="glo-def">Specialty grade with reduced alkali content — required for construction with reactive aggregates. DGKC is exporting 600,000 tons/year to the US via its US subsidiary. Not widely produced in Pakistan; higher entry barriers than standard OPC.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Capacity Utilisation</div>
        <div class="glo-def">Actual dispatches as % of installed capacity. Pakistan sector average: 54–61%. Below 60% = pricing power absent. Above 75% = conditions for meaningful price improvement. This ratio is why domestic pricing remains under pressure in the current cycle despite headline volume growth.</div>
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
        <div class="exec-text"><strong>Sector identity.</strong> Pakistan's cement sector is structurally oversupplied — 86.7Mt of installed capacity against ~48–52Mt of domestic demand. It is a volume-driven, energy-intensive industry with systematically constrained domestic pricing power. The two meaningful performance differentiators are <strong>energy cost management</strong> (WHR, captive power, renewables) and <strong>geographic exposure</strong> (northern domestic vs. southern export). Together, these two variables explain most of the gross margin spread observed across listed companies in any given cycle.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">02</div>
        <div class="exec-text"><strong>Core economics.</strong> Revenue flows through retention price on domestic bag dispatches and USD export shipments. Coal (55–65% of production cost) and electricity (15–20%) dominate the cost structure. Earnings leverage is high: when retention prices firm and coal costs decline simultaneously — as in FY25 — sector PAT can jump 38% in a single year. The inverse is equally sharp: FY26's ~6% retention price decline is driving projected ~9% sector PAT contraction despite higher dispatch volumes.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">03</div>
        <div class="exec-text"><strong>Major variables.</strong> In order of immediacy: (1) retention price per bag, (2) APCMA dispatch volumes, (3) coal source mix and price (RB vs. Afghan vs. domestic), (4) power source (grid vs. WHR/captive), and (5) finance costs for leveraged companies. Effective tax rate and PKR/USD movements are secondary but create material quarter-specific EPS surprises — distinguish these from structural trends when reading results.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">04</div>
        <div class="exec-text"><strong>Major risks.</strong> Structural overcapacity is the sector's chronic constraint — pricing power is absent below ~75% utilisation and the sector currently operates at 54–61%. Cyclical risks include Afghan coal supply disruption (binary, immediate, MLCF most exposed), retention price deterioration (ongoing in FY26), PSDP underspending (demand shortfall), and energy tariff inflation (grid-dependent producers). Finance cost risk is company-specific: acute for MLCF, negligible for LUCK and KOHC.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">05</div>
        <div class="exec-text"><strong>What makes leading companies different.</strong> <strong>LUCK</strong>: port silos are a structural moat — no other producer can export bulk cement at globally competitive freight cost. <strong>KOHC</strong>: captive power programme is widening its already sector-leading gross margin advantage permanently. <strong>MLCF</strong>: when Afghan coal is available and rates are falling simultaneously, it generates the highest earnings leverage of the five. <strong>BWCL</strong>: governance quality relative to domestically-owned peers is its distinguishing attribute. <strong>DGKC</strong>: US low-alkali cement export is a unique, USD-denominated niche market entry no other Pakistani producer has pursued.</div>
      </div>
    </div>

    <div class="note warn" style="margin-top:24px;">This module is based on publicly available secondary sources including APCMA data, company financial disclosures, broker research (Topline Securities, AHL Research), and industry publications (Business Recorder, Global Cement). It does not constitute investment advice. No buy, sell, or hold recommendations are made or implied. Readers should refer to current company filings and research for up-to-date figures.</div>
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
        <div class="miss-title">Retail Bag Price Is Not the Revenue Figure</div>
        <div class="miss-body">The retail bag price (Rs1,400–1,450/bag in early 2026) is what appears in news headlines and consumer conversations. The manufacturer receives the retention price — net of dealer margins (Rs100–150/bag), freight (Rs50–100/bag), excise duty, and taxes. The retention price in 2QFY26 was approximately Rs792/bag — roughly 56% of the retail figure. Analysts who track retail prices as a revenue proxy overshoot revenue estimates systematically. The only reliable revenue metric is retention price derived from financial results: net revenue divided by total dispatches.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">02 ·</div>
        <div class="miss-title">Below 55% Utilisation, There Is No Pricing Power</div>
        <div class="miss-body">Pakistan's cement sector has 29+ manufacturers and approximately 87 Mt of installed capacity against demand of roughly 47–52 Mt — structural oversupply. When capacity utilisation is below 55%, no single company or regional cluster can sustain a price increase without losing volume to competitors. Pricing power returns only when utilisation approaches 65–70%, which requires either demand growth or capacity rationalisation. This is why periods of strong volume growth are more important for margins than absolute price levels — volume growth absorbs fixed costs and pushes utilisation into the pricing power zone.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">03 ·</div>
        <div class="miss-title">Coal Source Mix Is a Bigger Short-Term Margin Driver Than Retention Price</div>
        <div class="miss-body">Coal constitutes 60–75% of direct production cost. The difference between Richards Bay coal ($85–110/ton) and Afghan coal (historically $60–90/ton at peak availability) is Rs800–1,500/ton of cement produced. A 10% change in retention price changes revenue per ton by Rs80–90. A shift from imported coal to Afghan coal saves Rs600–1,200/ton. In the short run, the fuel mix decision has more impact on gross margin than the pricing environment. This is why MLCF's gross margin leadership in FY24 (31.55%) came from fuel innovation, not from superior pricing.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">04 ·</div>
        <div class="miss-title">KOHC's Margins Are Cost-Led, Not Price-Led</div>
        <div class="miss-body">Kohat Cement consistently reports among the highest gross margins in the sector — reaching 42% in recent quarters. A common misreading attributes this to pricing power or superior product positioning. The reality is that KOHC's margins are structurally cost-driven: its 15.4MW solar installation, proximity to low-cost coal sources in KPK, and efficient single-location operations reduce cost per ton below the sector average. When the 30MW coal captive plant commissions, per-unit electricity cost halves. Margin leadership from cost efficiency is fundamentally different from margin leadership from pricing power — the latter is more fragile.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">05 ·</div>
        <div class="miss-title">LUCK's Consolidated EPS Includes Non-Cement Subsidiaries</div>
        <div class="miss-body">Lucky Cement's PSX-listed entity consolidates several large non-cement subsidiaries including ICI Pakistan (chemicals), Lucky Motors (Kia vehicles), and investments in financial services. In recent years, these subsidiaries have contributed 30–50% of consolidated PAT. This means LUCK's consolidated EPS is not a pure cement metric — it reflects the sum of cement operations, chemical manufacturing, automobile assembly margins, and investment returns. Comparing LUCK's consolidated EPS directly against pure-play cement companies like MLCF or KOHC without disaggregating segments produces a structurally misleading comparison.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Short-Cycle vs Long-Cycle Drivers</h2>
    <p class="deep-intro">Different variables operate on completely different time horizons. Conflating near-term noise with structural change is one of the most common analytical errors in sector research.</p>
    <div class="cycle-grid">
    <div class="cycle-col">
      <div class="cycle-header" style="color:#c8a96e">NEAR TERM · 0–3 months</div>
      <div class="cycle-title">Quarterly EPS Drivers</div>
      <div class="cycle-item"><span class="cycle-driver">APCMA dispatch volumes</span>Monthly volume directly drives quarterly revenue; northern and southern splits matter because they signal domestic vs export mix and pricing environment.</div><div class="cycle-item"><span class="cycle-driver">Retention price per bag</span>Net revenue per dispatch; a Rs50/bag change in a quarter translates to Rs2–4/share EPS for large producers.</div><div class="cycle-item"><span class="cycle-driver">Coal cost per ton</span>Fuel mix shifts between Richards Bay and Afghan coal can swing gross margin by 200–400bps within a single quarter.</div><div class="cycle-item"><span class="cycle-driver">Finance cost — rate cut pass-through</span>For MLCF and DGKC, each 100bps policy rate cut reduces quarterly finance cost noticeably; the rate cut cycle from 22% to 13% created a multi-quarter earnings tailwind.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#c86e8f">MEDIUM TERM · 3–18 months</div>
      <div class="cycle-title">Structural Margin Signals</div>
      <div class="cycle-item"><span class="cycle-driver">Capacity utilisation trend</span>Sustained movement above 60% signals improving pricing power; movement above 65% historically precedes retention price firming across the sector.</div><div class="cycle-item"><span class="cycle-driver">Export market development</span>Southern export volumes growing above 5% of total dispatches signals that Lucky and peers are diversifying away from domestic oversupply; USD earnings buffer domestic weakness.</div><div class="cycle-item"><span class="cycle-driver">WHR and captive power investments</span>Each commissioning reduces per-unit electricity cost permanently; KOHC's CPP and LUCK's BESS expansions have 12–24 month lead times from announcement to visible earnings impact.</div><div class="cycle-item"><span class="cycle-driver">PSDP disbursement pace</span>Infrastructure-led demand growth in the South requires sustained government spending; PSDP utilisation above 70% of allocation drives meaningful incremental volumes.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#4a9eff">STRUCTURAL · 18 months+</div>
      <div class="cycle-title">Decade-Scale Determinants</div>
      <div class="cycle-item"><span class="cycle-driver">Capacity addition vs demand growth</span>If the industry adds capacity faster than demand grows, utilisation falls further and pricing power remains structurally absent — the primary 10-year risk for the sector.</div><div class="cycle-item"><span class="cycle-driver">Afghan coal supply normalisation</span>If cross-border coal supply restores at historically low prices, northern producers' structural cost advantage vs southern peers widens permanently.</div><div class="cycle-item"><span class="cycle-driver">Export competitiveness</span>Whether Pakistan cement can compete in global markets beyond Afghanistan and East Africa depends on energy cost reduction; DGKC's US export deal is a test of niche market viability.</div><div class="cycle-item"><span class="cycle-driver">Energy transition in manufacturing</span>WHR, solar, and wind are already reducing the sector's grid dependence; a decade of captive power investment would fundamentally change the cost structure and reduce energy tariff sensitivity.</div>
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
        <div class="connect-body">Direct and material impact on two dimensions. First, companies with significant debt (MLCF, DGKC) see finance costs decline proportionally with rate cuts — a 900bps rate cut from 22% to 13% reduced DGKC's quarterly finance cost by roughly 40%, which was a primary driver of the 3.5x EPS jump in 2QFY25. Second, mortgage and consumer credit availability (indirectly affected by rates) influences private sector construction demand — the sector's largest demand driver.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">💱</span>
        <div class="connect-title">Currency (PKR/USD)</div>
        <div class="connect-body">Bidirectional exposure. Cement companies pay for Richards Bay coal in USD — so PKR depreciation raises input costs directly. However, companies with meaningful export revenues (LUCK) earn USD and benefit from depreciation on the revenue side. Net effect depends on the export-to-revenue ratio and coal-source mix. A pure domestic producer using imported coal is uniformly hurt by PKR depreciation; LUCK's dual geography partially offsets this.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">⛏️</span>
        <div class="connect-title">Coal Prices (Global)</div>
        <div class="connect-body">Richards Bay coal is the primary input cost for southern producers and a partial cost for northern ones. A $20/ton increase in RB coal raises production cost by approximately Rs200–350/ton of cement — a direct and significant margin impact. The Afghan coal alternative has historically provided a buffer for northern producers, but its availability is intermittent and politically determined. Pakistani domestic coal is lower quality but provides a partial third option.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏛️</span>
        <div class="connect-title">Government Policy</div>
        <div class="connect-body">PSDP allocation and disbursement determine infrastructure-led demand. Super tax rate determines effective tax burden. WHR and renewable energy investment credits affect capex returns. Coal import regulatory duties affect input costs. The sector is not directly price-regulated — unlike E&P or Power — but government spending and tax policy are primary determinants of demand and after-tax earnings respectively.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏗️</span>
        <div class="connect-title">Construction Demand</div>
        <div class="connect-body">The primary demand driver — private residential construction, commercial real estate, and government infrastructure. Private construction is interest-rate-sensitive and income-sensitive. Government construction is PSDP-dependent. Rural housing demand (post-harvest in Punjab and KPK) is agricultural-income-dependent. The north-south split in demand reflects different underlying drivers: northern demand is more private and residential; southern demand is more infrastructure and government-project-driven.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Business Model Winners &amp; Losers</h2>
    <p class="deep-intro">Different business model structures within this sector face systematically different conditions. The following describes which model characteristics tend to generate or destroy earnings margin under specific environments — without reference to specific companies as recommendations.</p>
    <div class="model-grid">
      <div class="model-card model-card-up">
        <div class="model-card-title">TENDS TO BENEFIT WHEN — Low-debt, captive-power, fuel-flexible operators</div>
        <div class="model-row"><span class="model-condition">Rate cuts + high domestic demand</span>Low-debt producers capture demand growth without a finance cost tailwind; their margin improvement comes purely from volume leverage on fixed costs.</div><div class="model-row"><span class="model-condition">Coal price decline (any source)</span>Fuel-flexible operators with access to Afghan coal and local coal blend benefit from declining input costs before retention prices move — capturing the margin differential before competitors.</div><div class="model-row"><span class="model-condition">Export market strength</span>Companies with port access or Afghan border access can divert capacity to export when domestic demand is weak, maintaining utilisation and USD earnings simultaneously.</div><div class="model-row"><span class="model-condition">Captive power commissioning</span>Each WHR or solar installation permanently reduces per-unit electricity cost; the margin improvement is structural and not reversed when macro conditions deteriorate.</div>
      </div>
      <div class="model-card model-card-dn">
        <div class="model-card-title">TENDS TO FACE PRESSURE WHEN — High-debt, grid-dependent, single-geography operators</div>
        <div class="model-row"><span class="model-condition">Rising interest rates</span>Finance cost rises proportionally; if operating income is insufficient to cover interest, EPS becomes highly sensitive to even small EBIT changes.</div><div class="model-row"><span class="model-condition">Afghan coal supply disruption</span>Northern producers dependent on Afghan coal revert to Richards Bay at 20–40% higher cost; margin compression is immediate and cannot be offset by pricing in an oversupplied market.</div><div class="model-row"><span class="model-condition">Domestic demand weakness + no export option</span>A producer without port access or export infrastructure cannot diversify revenue when domestic volumes fall; revenue falls directly with dispatch volumes at fixed retention prices.</div><div class="model-row"><span class="model-condition">New capacity additions by competitors</span>In an oversupplied market, competitor capacity additions depress utilisation further, preventing any retention price recovery regardless of cost management improvements.</div>
      </div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Structural Questions</h2>
    <p class="deep-intro">The major unresolved debates, policy uncertainties, and structural questions that will shape this sector over the next three to seven years. These are not predictions — they are the analytical dimensions that require active monitoring.</p>
    <div class="sq-list">
    <div class="sq-item">
      <div class="sq-q">Can the sector reach 70%+ utilisation without either demand growth or capacity rationalisation?</div>
      <div class="sq-context">At 54–61% utilisation, structural pricing power is absent. The sector has not voluntarily reduced capacity. Demand growth requires either sustained PSDP spending, private construction recovery, or export market expansion. None of these is guaranteed over a 3-year horizon. The answer to this question determines whether FY27 and beyond see margin recovery or continued compression.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Is DGKC's US low-alkali export deal commercially sustainable at scale?</div>
      <div class="sq-context">Low-alkali cement is a niche product with limited global demand. Shipping from Pakistan to the US adds significant logistics cost. The deal is announced at 600,000 tons/year — roughly 9% of DGKC's capacity. Whether this holds at commercially viable margins against American or Mexican competitors is the key question; the financial results will reveal the answer within 2–3 quarters of first shipment.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Will Afghan coal supply normalise or remain structurally disrupted?</div>
      <div class="sq-context">Afghan coal provided a cost advantage of Rs600–1,200/ton for northern producers at peak availability. Its disruption in FY26 forced reversion to Richards Bay coal. Whether this is a temporary diplomatic/logistics issue or a sustained supply constraint determines the relative cost competitiveness of northern vs southern producers over the medium term.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Does energy self-sufficiency (WHR + solar + captive) create a permanent cost divide within the sector?</div>
      <div class="sq-context">Companies that have invested in WHR, solar, and coal captive plants are reducing electricity costs toward Rs15–20/unit versus the grid's Rs36–38/unit. If this gap persists, energy-efficient producers permanently separate from grid-dependent ones on gross margin — potentially making energy investment history the most important differentiator by FY28.</div>
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
        <div class="dpeer-accent-bar" style="background:#c8a96e"></div>
        <div class="dpeer-ticker">LUCK</div>
        <div class="dpeer-name">Lucky Cement Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Conglomerate anchor — the sector's scale leader with dual geography, export infrastructure, and significant non-cement earnings from subsidiaries</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Export demand strength + PKR depreciation: LUCK earns USD from Karachi port exports and benefits from currency translation across its large revenue base</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Domestic demand collapse without export offset: if both domestic volumes fall and international shipping economics deteriorate, LUCK loses its primary diversification buffer</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led and export-led — dispatch volume dominates the earnings base; consolidated EPS includes non-cement subsidiaries making it misleading as a pure cement metric</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">BWCL — Both are the largest capacity holders in the sector; the analytical distinction is geographic (LUCK is dual-geography, BWCL is north-only) and ownership (LUCK is a listed conglomerate, BWCL has a UK parent with tighter governance)</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#6e8fc8"></div>
        <div class="dpeer-ticker">BWCL</div>
        <div class="dpeer-name">Bestway Cement Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Scale northern operator — largest or co-largest capacity in the sector, UK-parent governed, disciplined capital allocation, predominantly domestic-focused</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Northern demand recovery + coal cost stability: BWCL's 8 production lines benefit most when northern utilisation rises above 60%, spreading fixed costs across more volumes</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Afghan coal disruption: as a Richards Bay-dependent northern operator, coal price spikes compress margins without the fuel flexibility that Afghan-coal-capable peers have built</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led — dispatch volumes drive earnings; no significant non-cement earnings; governance discipline means less financial engineering and more predictable payout ratios</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">LUCK — Both hold the largest capacity in the sector; BWCL is the pure-play northern alternative to LUCK's diversified profile — a useful analytical pair for isolating the value of southern geography and export capability</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c86e8f"></div>
        <div class="dpeer-ticker">DGKC</div>
        <div class="dpeer-name">D.G. Khan Cement Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Turnaround / finance-leverage operator — high debt historically, declining through paydown; dual-geography (Punjab + Hub/Balochistan) with Nishat group strategic backing</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Rate cut cycle + domestic demand recovery: DGKC has outsized earnings sensitivity to rate cuts due to high debt base; the combination of volume recovery and finance cost decline creates disproportionate EPS leverage</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Rising interest rates + imported coal price spike: finance cost rises while coal costs surge; operating income is compressed from both ends simultaneously</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Balance-sheet-led — the rate cut cycle is the primary near-term earnings driver; EV/ton valuation discount reflects the historical leverage rather than operational weakness</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">MLCF — Both are mid-sized northern producers with historically high debt and finance-cost sensitivity; the analytical distinction is fuel mix (DGKC uses imported coal, MLCF pioneered Afghan coal) and export optionality (DGKC has the US deal, MLCF has Afghan border access)</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#7fa87f"></div>
        <div class="dpeer-ticker">KOHC</div>
        <div class="dpeer-name">Kohat Cement Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Efficiency-led, cost-discipline operator — small capacity, highest gross margins in sector, KPK-focused, active energy investment programme</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Captive power commissioning + stable coal costs: each energy investment commissions a structural and permanent cost reduction visible in subsequent gross margin; KOHC is the clearest example of margin expansion through capex rather than pricing</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Pricing pressure in northern market when utilisation is low: KOHC does not have the scale to sustain prices when larger northern peers compete on volume; its advantage is cost, not pricing power</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Margin-led — gross margin improvement through energy cost reduction is the primary earnings driver; volume growth matters less than per-ton margin at this scale</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">MLCF — Both are mid-sized producers with above-average gross margins; the distinction is the source of margin: KOHC's margin comes from energy investment (structural capex), MLCF's from fuel mix innovation (operational procurement). KOHC's margin is more defensible; MLCF's is more variable.</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c8956e"></div>
        <div class="dpeer-ticker">MLCF</div>
        <div class="dpeer-name">Maple Leaf Cement Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Fuel-innovation, finance-leverage operator — first mover in Afghan coal adoption, highest historic gross margin from fuel efficiency, but earnings highly sensitive to finance costs</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Afghan coal availability + rate cuts: when Afghan coal is available and interest rates are falling, MLCF gets a simultaneous cost reduction on both its largest input and its largest financial obligation</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Afghan coal disruption + high interest rates: both happened simultaneously in FY26, compressing margins from the fuel side and inflating finance costs — the worst combination for this specific model</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Margin-led (when coal is available) and balance-sheet-led (when rates are the primary variable) — the dominant driver rotates based on the macro cycle</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">DGKC — Both are mid-sized northern producers with high finance-cost sensitivity; the distinction is fuel source (MLCF = Afghan coal, DGKC = Richards Bay) creating opposite risk profiles when Afghan supply is disrupted</span></div>
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
        <td><span class="pfinal-ticker">LUCK</span></td>
        <td>Conglomerate scale + export anchor</td>
        <td>High export demand + PKR depreciation</td>
        <td>Domestic collapse without export offset</td>
        <td>Port silos, dual geography, USD earnings</td>
        <td>Consolidated EPS includes non-cement subsidiaries, not a pure cement metric</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">BWCL</span></td>
        <td>Scale northern operator</td>
        <td>Northern demand recovery + coal stability</td>
        <td>Afghan coal disruption + northern oversupply</td>
        <td>Largest capacity, UK-parent governance</td>
        <td>No export infrastructure, single geography</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">DGKC</span></td>
        <td>Finance-leverage turnaround</td>
        <td>Rate cut cycle + domestic demand recovery</td>
        <td>Rate hike + imported coal price spike</td>
        <td>Dual geography, Nishat group, US export deal</td>
        <td>Legacy high-debt cost structure, imported coal dependency</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">KOHC</span></td>
        <td>Efficiency / cost-discipline operator</td>
        <td>Captive power commissioning + stable coal</td>
        <td>Pricing pressure in low-utilisation market</td>
        <td>Highest gross margin through energy investment</td>
        <td>Small capacity limits volume earnings leverage</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">MLCF</span></td>
        <td>Fuel-innovation, finance-leverage</td>
        <td>Afghan coal + rate cuts simultaneously</td>
        <td>Afghan coal disruption + high interest rates</td>
        <td>Pioneer fuel mix advantage, high historic GP margin</td>
        <td>Afghan coal supply risk, elevated finance cost exposure</td>
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
      <div class="metric-name">APCMA Monthly Dispatch Volumes — North/South Split</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Total industry cement dispatched, broken down by northern and southern zones, and by domestic vs export destination</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The primary real-time revenue indicator for the sector; volume data precedes quarterly results by 6–10 weeks, allowing forward EPS estimates to be revised before results</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Aggregate volumes can look healthy while the north-south mix shifts dramatically — a surge in southern exports alongside northern domestic decline is a structurally different situation from broad-based domestic demand growth</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Retail bag price trends (to assess whether volume growth is being sacrificed for price or vice versa) and the 12-month moving average (to smooth seasonal patterns)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Sector-Wide Capacity Utilisation Rate</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Total industry dispatches divided by total installed capacity — the structural demand-supply balance indicator</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The threshold metric for pricing power; below 55%, no sustainable retention price increases are possible in an oversupplied market</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Utilisation can appear to improve if capacity is decommissioned or mothballed, even without any demand growth — track both the numerator (dispatches) and denominator (installed capacity) independently</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">New capacity announcement pipeline (to understand where denominator is heading) and PSDP disbursement data (to understand demand trajectory)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Richards Bay Coal Spot Price (FOB, USD/ton)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The benchmark input cost for imported coal used by southern producers and some northern producers; the primary commodity cost driver for the sector</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">A $20/ton move in RB coal is equivalent to roughly Rs200–350/ton of cement cost; this directly determines whether the sector earns above or below trend margins in a given quarter</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Afghan coal availability creates a two-tier cost structure; tracking RB alone misses the full picture for northern producers with fuel flexibility who may be operating at lower effective coal costs</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Afghan coal border status reports (to understand whether alternative supply is available) and PKR/USD rate (coal is priced in USD, so rupee depreciation amplifies the cost increase)</span></div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">13 · Metrics Framework</div>
    <h2 class="deep-h2">Company-Level Metrics</h2>
    <p class="deep-intro">Firm-level metrics that matter most when reading quarterly results and annual filings. For each metric: what it measures, why it matters, when it misleads, and what to read alongside it.</p>
    <div class="metric-card">
      <div class="metric-name">Retention Price per Bag (Derived)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Net revenue from cement operations divided by total cement dispatches in tons, converted to a per-bag equivalent</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The actual revenue metric — not the retail bag price. Retention price is what manufacturers receive after dealer margins, freight, and taxes. Only this figure is relevant for revenue modelling.</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Quarter-end product mix shifts (bulk vs bagged, domestic vs export) change the average without any underlying price change; compare consistently across similar mix conditions, not raw quarter-to-quarter</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">APCMA dispatch volumes (to verify what denominator the derived price is applied to) and retail bag price (to track whether the dealer margin is expanding or compressing)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Cost per Ton (Derived from COGS)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Cost of goods sold divided by total dispatches — the all-in production cost per ton including coal, power, limestone, and labour</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The primary operational efficiency metric; a structural decline in cost per ton indicates genuine fuel mix improvement or energy investment payoff, not just volume leverage</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Volume leverage can temporarily reduce cost per ton as fixed costs spread over more units — does not imply structural efficiency improvement; track cost per ton at similar utilisation levels for comparability</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Coal source mix disclosures (to understand what is driving cost change) and gross margin % (to confirm cost improvement is flowing to margin rather than being offset by retention price decline)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Finance Cost as % of EBIT</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Finance cost divided by operating profit — measures how much of the operational margin is consumed by debt servicing</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">For high-debt producers (MLCF, DGKC historically), this ratio determines whether operational improvement translates to PAT growth or is absorbed by interest expense</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A falling ratio in a rate-cut cycle may reflect lower KIBOR rather than debt reduction; track both the absolute debt level and the interest rate applied to understand which is driving the improvement</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Net debt level (to assess whether finance cost reduction is structural paydown or rate-cycle-driven) and cash conversion ratio (to verify that improving EBIT is actually converting to cash available for debt service)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Effective Tax Rate (ETR)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Tax expense as a % of profit before tax — measures the actual tax burden applied to reported earnings in a given period</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">ETR-driven EPS changes are not indicative of operational performance; KOHC's 4QFY24 EPS spike (+349%) was partly ETR-driven and cannot be extrapolated into subsequent quarters</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A low ETR quarter always looks like a margin improvement unless the income statement is read carefully; look for the tax note to identify one-time credits, WHR investment tax credits, or prior-year adjustments</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Pre-tax operating profit (to see the underlying earnings before the ETR effect) and the tax note disclosure (to identify what drove the ETR deviation from the normalised 29% sector rate)</span></div>
    </div>
  </div>`,
  }
  ],
};

export default sector;

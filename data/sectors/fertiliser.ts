// data/sectors/fertiliser.ts
// Auto-generated from pakistan_fertiliser_sector_module.html
// Content: 13 tabs of sector intelligence for the Fertiliser sector.

import type { SectorData } from "./types";

const sector: SectorData = {
  slug: 'fertiliser',
  name: 'Fertiliser',
  volume: 'Sector Intelligence Module · Volume IV',
  subtitle: 'A structured analytical framework covering how listed fertiliser companies generate earnings, what drives urea and DAP volumes and margins, and how ENGRO, FFC, FFBL, and FATIMA differ structurally.',
  accentColor: '#52b87a',
  stats: [
  { val: '~$4.6B', lbl: 'Sector Market Cap (Sep 2025)' },
  { val: 'Rs489B', lbl: 'Sector PAT CY2024' },
  { val: '~6.6 Mt', lbl: 'Urea Production Capacity' },
  { val: 'Rs580', lbl: 'FFC Mari Gas Rate (Rs/mmbtu)' },
  { val: 'Rs1,597', lbl: 'SNGPL Gas Rate (Rs/mmbtu)' }
  ],
  tabs: [
  {
    id: 'overview',
    label: 'Overview',
    content: `<div class="section">
<div class="section-label">01 &middot; Sector Overview</div>
<h2>What the Sector Does</h2>
<p>Pakistan's fertiliser sector produces and distributes nitrogen and phosphate fertilisers to the country's farming economy. The sector sits at the intersection of agriculture, energy policy, and government regulation. Profitability is not driven by selling price alone; it is determined almost entirely by the price at which each company receives natural gas (the primary feedstock) relative to the price at which it sells urea and DAP. Because different companies receive gas at radically different prices for the same product, the gas pricing architecture is the defining analytical framework for this sector.</p>
<p>Pakistan's agriculture contributes approximately 24% to GDP and employs roughly 40% of the workforce. Wheat alone accounts for approximately 50% of all urea consumed domestically. Cotton accounts for approximately 25% of annual urea demand. These two crops determine the pace and seasonality of fertiliser offtake across the year. When either crop cycle fails, fertiliser volumes fall sharply; when government support schemes pull forward buying, the following quarters face a demand vacuum.</p>
<div class="chain-wrap">
<div class="chain-lbl">Urea Production Chain -- Gas Feedstock to Farmer</div>
<div class="chain">
<div class="chain-node" style="border-top:2px solid var(--ffc);"><div class="cn-lbl">Gas Feedstock</div><div class="cn-val">Rs580-1,597/mmbtu</div><div class="cn-sub">Determines structural margin advantage</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--ffc);"><div class="cn-lbl">Ammonia Plant</div><div class="cn-val">Natural gas to NH3</div><div class="cn-sub">Gas is both feedstock and fuel</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--efert);"><div class="cn-lbl">Urea Plant</div><div class="cn-val">NH3 + CO2 to Urea</div><div class="cn-sub">46% nitrogen; prilled or granular</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--efert);"><div class="cn-lbl">Dealer Network</div><div class="cn-val">50kg bags; rural</div><div class="cn-sub">~90% via private dealer networks</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--fatima);"><div class="cn-lbl">Ex-Factory Price</div><div class="cn-val">Rs3,767-5,489/bag</div><div class="cn-sub">Oligopolistic; FFC-led pricing</div></div>
<div class="chain-arr">to</div>
<div class="chain-node" style="border-top:2px solid var(--fatima);"><div class="cn-lbl">Gross Margin</div><div class="cn-val">29-45%</div><div class="cn-sub">Gas tier is the only variable that matters</div></div>
</div>
</div>
<div class="divider"></div>
<h2>Why It Matters on PSX</h2>
<ul class="bl">
<li>FFC is among PSX's largest listed companies by market cap (~$2.3B) and is a core KSE-100 constituent -- its earnings trajectory influences index-level returns materially.</li>
<li>The sector's gas pricing architecture makes it a direct proxy for energy policy changes -- any government decision on gas allocation or pricing equalisation creates immediate EPS implications for all three companies.</li>
<li>Agricultural seasonality creates predictable quarterly EPS patterns that analysts can model ahead of results -- making this one of the more forecastable sectors on PSX in normal years.</li>
<li>Government agricultural and subsidy decisions (Kissan Card, wheat support price, urea import policy) create sudden, high-amplitude EPS swings that generate significant trading activity around announcement dates.</li>
<li>The FFC-FFBL merger (July 2024) and the December 2025 Ghazij/Shawal gas allocation are restructuring competitive dynamics in ways that will take several reporting periods to fully manifest.</li>
</ul>
<div class="divider"></div>
<h2>Main Listed Players Covered</h2>
<div class="bar-chart">
<div class="bar-head">Urea Production Market Share (CY2024)</div>
<div class="bar-row"><div class="bar-lbl">FFC</div><div class="bar-track"><div class="bar-fill" style="width:100%;background:var(--ffc);"></div></div><div class="bar-val">~45% (post-merger)</div></div>
<div class="bar-row"><div class="bar-lbl">EFERT</div><div class="bar-track"><div class="bar-fill" style="width:71%;background:var(--efert);"></div></div><div class="bar-val">~32%</div></div>
<div class="bar-row"><div class="bar-lbl">FATIMA</div><div class="bar-track"><div class="bar-fill" style="width:36%;background:var(--fatima);"></div></div><div class="bar-val">~16%</div></div>
<div class="bar-row"><div class="bar-lbl">Agritech</div><div class="bar-track"><div class="bar-fill" style="width:13%;background:var(--text3);"></div></div><div class="bar-val">~6%</div></div>
</div>
<p style="margin-top:10px;font-size:12.5px;">Post-FFBL merger (July 2024), FFC holds approximately 45% of urea market and is the only domestic DAP producer. The three companies covered here account for approximately 93% of listed sector production capacity.</p>
<div class="note amber">FFC-FFBL Merger (July 2024): Fauji Fertilizer Company acquired Fauji Fertilizer Bin Qasim Limited effective July 1, 2024 (sanctioned by Lahore High Court). Combined CY2024 consolidated PAT: Rs85.5B. FFC now holds the only domestic DAP production capability -- a structural shift that changed both companies' competitive positions permanently.</div>
</div>`,
  },
  {
    id: 'economics',
    label: 'Economics',
    content: `<div class="section">
<div class="section-label">02 &middot; How the Sector Makes Money</div>
<h2>Revenue Model</h2>
<p>Fertiliser revenue is generated through domestic sales of urea (nitrogen), DAP (phosphate), and for FATIMA uniquely, CAN and NP. Revenue equals volume multiplied by ex-factory price per bag. Urea prices are technically deregulated but function oligopolistically -- the three large producers observe each other's pricing closely and seldom deviate significantly.</p>
<ul class="bl">
<li><strong style="color:var(--text)">Urea (~70-80% of sector revenue):</strong> Sold in 50kg bags through private dealer networks. Ex-factory prices ranged Rs3,767-5,489/bag in CY2024 depending on producer and grade. FFC's "Sona" brand; EFERT's "Engro" brand; FATIMA's "Sarsabz" brand.</li>
<li><strong style="color:var(--text)">DAP (~15-20% of sector revenue):</strong> Phosphate fertiliser critical for wheat and cotton at sowing time. Pakistan imports approximately 50% of DAP requirements; FFC (post-merger) is the only domestic producer. EFERT and FATIMA import and market DAP -- they do not produce it locally. DAP pricing is internationally determined.</li>
<li><strong style="color:var(--text)">CAN and NP (FATIMA-exclusive):</strong> Calcium ammonium nitrate and nitrophos -- produced only by FATIMA in Pakistan's listed sector. No import competition for either product, creating a captive demand pocket for specialty crop farmers.</li>
<li><strong style="color:var(--text)">Other income:</strong> FFC earns significant investment income from strategic holdings (Askari Bank, power companies). This must be disaggregated from operating fertiliser income when analysing the core business.</li>
</ul>
<div class="divider"></div>
<h2>Cost Structure</h2>
<p>Natural gas is approximately 57% of total direct production cost for urea. The gas price a company pays is the primary determinant of which company earns 45% gross margins and which earns 29%. FFC's main plants receive Mari gas at Rs580/mmbtu; EFERT's Enven plant and SNGPL-fed plants pay Rs1,597/mmbtu -- a 175% premium for the same feedstock input, creating an approximately Rs1,200/bag urea production cost difference.</p>
<ul class="bl">
<li><strong style="color:var(--text)">Feedstock gas (primary variable cost):</strong> FFC main plants: Rs580/mmbtu. EFERT base plant: approximately USD 0.7/mmbtu (legacy concessionary rate). EFERT Enven and SNGPL-fed plants: Rs1,597/mmbtu. The Rs1,017/mmbtu gap translates to approximately Rs1,200/bag of urea cost difference between the cheapest and most expensive producers.</li>
<li><strong style="color:var(--text)">GIDC (Gas Infrastructure Development Cess):</strong> Per-mmbtu levy on gas consumption. Sector-wide GIDC payables reached Rs107.9B by 9MCY2024. EFERT's liability grew 26.8% YoY. Companies pay through court-ordered installments.</li>
<li><strong style="color:var(--text)">Packaging, bags, distribution:</strong> Fixed per unit; rural distribution adds logistics cost not present in urban-oriented sectors.</li>
<li><strong style="color:var(--text)">Import cost for DAP (EFERT, FATIMA):</strong> When global DAP prices fall, imported inventory must be marked down -- creating a direct link between international phosphate markets and Pakistani fertiliser company earnings.</li>
</ul>
<div class="divider"></div>
<h2>The Two Crop Seasons</h2>
<div class="two-col">
<div class="col-card">
<div class="col-head"><span class="col-dot" style="background:var(--ffc);"></span>Kharif Season (Summer)</div>
<ul class="col-list">
<li>April to September; monsoon-dependent crops: rice, cotton, sugarcane, maize</li>
<li>Approximately 50% of annual urea offtake occurs in Kharif</li>
<li>Cotton (~25% of annual fertiliser use) -- cotton crop failures collapse Kharif demand</li>
<li>Peak dealer stocking: March-April ahead of sowing; April-May are the highest sales months</li>
<li>2024 cotton yield fell approximately 50% -- Kharif urea offtake fell 35% YoY in September 2024</li>
</ul>
</div>
<div class="col-card">
<div class="col-head"><span class="col-dot" style="background:var(--accent2);"></span>Rabi Season (Winter)</div>
<ul class="col-list">
<li>October to March; wheat, barley, oilseeds</li>
<li>Wheat sowing drives the largest single fertiliser demand event -- the wheat urea window in Oct-Nov</li>
<li>DAP demand peaks in Rabi as farmers phosphate-dress wheat fields before sowing</li>
<li>Punjab Kissan Card (Dec 2024) pulled forward massive volumes -- caused 40-50% demand slump in Q1CY25</li>
<li>Winter gas curtailments historically hit SNGPL-fed plants (Fatimafert) -- forcing shutdowns</li>
<li>Wheat Support Price set by government determines farmer income and input application willingness</li>
</ul>
</div>
</div>
<div class="divider"></div>
<h2>What Expands Earnings</h2>
<ul class="bl">
<li>Lower feedstock gas price -- or protection via Mari field supply agreements (FFC's structural advantage)</li>
<li>Higher urea ex-factory price -- any industry-wide price rise flows directly to margin; FFC benefits most from rises it had no cost reason to absorb</li>
<li>Strong crop seasons -- healthy monsoon and wheat crop sustain offtake and prevent inventory build</li>
<li>Government demand support schemes -- Kissan Card activations create volume surges (followed by demand vacuums)</li>
<li>Rising global DAP prices -- improves FFC's local DAP margin and EFERT/FATIMA's imported DAP resale margin</li>
<li>Gas allocation improvements -- new indigenous gas at lower cost replacing RLNG (Ghazij/Shawal Dec 2025) permanently reduces production cost for recipient plants</li>
</ul>
<h2>What Compresses Earnings</h2>
<ul class="bl">
<li>Gas price increases for SNGPL-fed plants -- each Rs200/mmbtu increase adds approximately Rs600-800/ton to Enven and Fatimafert production cost</li>
<li>Demand vacuums following advance-buying surges -- Q1CY25 saw 40-50% industry volume collapse after Dec 2024 Kissan Card pull-forward</li>
<li>Imported urea undercutting -- when local price exceeds import parity by a wide margin (Rs3,271/bag in Q1CY25), imported urea forces local discounts or volume loss</li>
<li>Cotton crop failure -- reduces Kharif urea demand structurally for the season</li>
<li>GIDC payment obligations -- court-ordered installments reduce cash flow and can create large single-quarter charges</li>
<li>Global DAP price decline -- inventory markdowns for importers (EFERT, FATIMA) and margin compression for FFC's local production</li>
<li>Winter gas curtailments -- SNGPL supply interruptions force SNGPL-fed plants to shut or switch to expensive RLNG</li>
</ul>
<div class="note">Gross margin context: FFC's Mari-fed plants earn 35-45% gross margins. EFERT's blended margin runs 28-38%, with the base plant well above and Enven well below. FATIMA's base plants earn 30-42%; Fatimafert is the drag. The gap between companies in any quarter is almost entirely explained by gas cost -- not operational efficiency, marketing, or management quality.</div>
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
<thead><tr><th style="width:200px;">Variable</th><th>What It Is &amp; Why It Matters</th><th style="width:130px;">Earnings Impact</th></tr></thead>
<tbody>
<tr class="section-row"><td colspan="3">Gas and Production Cost</td></tr>
<tr>
<td class="vname">Feedstock Gas Price (Rs/mmbtu)</td>
<td>The price each company pays for natural gas used as urea production input. Gas is approximately 57% of direct production cost. The gap between FFC's Mari gas (Rs580/mmbtu) and SNGPL (Rs1,597/mmbtu) is the fundamental earnings differentiator in this sector. When government raises SNGPL prices, FFC is largely protected while EFERT's Enven plant and Fatimafert bear the full cost increase. A Rs200/mmbtu increase for SNGPL-fed plants adds approximately Rs600-800/ton to production cost -- equivalent to roughly Rs4-6/share annual EPS headwind for EFERT.</td>
<td class="down">Lower = Positive</td>
</tr>
<tr>
<td class="vname">Gas Supply Security</td>
<td>Distinct from price -- whether gas actually flows to the plant. SNGPL-fed plants face winter curtailments when domestic demand peaks and line pressure drops. Fatimafert (Sheikhupura) has historically faced multi-week shutdowns in December-January. The December 2025 Ghazij/Shawal allocation converts three previously SNGPL-dependent plants to dedicated indigenous supply -- eliminating curtailment risk for those plants when gas flows. Mari-connected plants have historically had more stable supply.</td>
<td class="up">Reliability higher = Positive</td>
</tr>
<tr>
<td class="vname">GIDC (Gas Infra Dev Cess)</td>
<td>Per-mmbtu levy on gas consumption charged to fertiliser companies. Sector payables stood at Rs107.9B by 9MCY2024; EFERT's liability grew 26.8% YoY. Companies pay through court-ordered installments. Any sudden full settlement requirement creates a large one-time cash outflow -- a Rs5B GIDC payment reduces sector PAT by approximately Rs3.5B after tax. EFERT carries the largest absolute GIDC exposure.</td>
<td class="down">GIDC higher = Negative</td>
</tr>
<tr class="section-row"><td colspan="3">Revenue and Demand</td></tr>
<tr>
<td class="vname">Urea Ex-Factory Price (Rs/bag)</td>
<td>Net price manufacturers receive per 50kg bag. Technically deregulated; ranges Rs3,767-5,489/bag depending on producer and grade. Oligopolistic: FFC sets price from its low-cost position, peers follow within a limited range. A Rs100/bag increase in ex-factory price adds approximately Rs5-8/share annual EPS for FFC (largest volume base) and Rs4-6/share for EFERT. FFC earns the entire price rise as margin; EFERT's Enven plant passes less through due to higher cost base.</td>
<td class="up">Higher = Positive</td>
</tr>
<tr>
<td class="vname">NFDC Monthly Urea Offtake (Mt)</td>
<td>Total domestic urea sold, published monthly by the National Fertilizer Development Centre. The primary volume tracking metric. Directly tied to crop season timing, government schemes, and weather. Q1CY25 saw industry-wide offtake collapse approximately 40% YoY following Dec 2024 Kissan Card advance buying. A 10% increase in quarterly offtake (holding price constant) adds approximately Rs2-4/share quarterly EPS for FFC. NFDC data is the most important monthly indicator for this sector.</td>
<td class="up">Higher = Positive</td>
</tr>
<tr>
<td class="vname">Import Parity Price (Urea)</td>
<td>Landed cost of imported urea in Pakistan -- international price plus freight, duties, and port charges. When local ex-factory prices exceed import parity by a wide margin (Rs3,271/bag in Q1CY25), importers undercut local producers, forcing price discounts or market share loss. EFERT's Enven plant, with its high production cost, is most vulnerable. FFC can generally absorb import competition at its ultra-low Mari gas cost.</td>
<td class="down">Cheaper imports = Negative for local producers</td>
</tr>
<tr>
<td class="vname">Global DAP Price ($/ton)</td>
<td>Set by international phosphate markets -- Chinese production, Moroccan phosphate rock, global supply chains. For FFC (local DAP producer post-merger), falling prices compress local production margins. For EFERT and FATIMA (DAP importers), falling prices create inventory markdowns. Rising DAP prices expand everyone's DAP-side earnings. Pakistan has no domestic pricing power for DAP -- it is fully import-parity-linked.</td>
<td class="up">Higher = Positive</td>
</tr>
<tr class="section-row"><td colspan="3">Agricultural and Policy</td></tr>
<tr>
<td class="vname">Crop Season Conditions</td>
<td>Monsoon quality determines Kharif offtake. Wheat area sown and productivity determines Rabi demand. Cotton yield is the highest-variance Kharif variable -- the 2024 cotton crop declined approximately 50% YoY, contributing to Kharif urea offtake falling 35% YoY in September 2024. Water availability (IRSA allocations, rainfall) and crop pest pressure are the upstream indicators. Analysts track cotton acreage and IRSA water releases as leading crop indicators.</td>
<td class="up">Better crops = Positive</td>
</tr>
<tr>
<td class="vname">Government Demand Schemes</td>
<td>Punjab Kissan Card (interest-free farmer loans), urea subsidies, and input support schemes create acute demand timing distortions. Dec 2024 Kissan Card generated a 18% YoY volume surge in Q4CY24 -- followed by a 40-50% collapse in Q1CY25. Wheat Support Price determines farmer income and input spending willingness. These schemes are announced with short notice and are the highest-variance single EPS swing factor in the sector.</td>
<td class="up">Supportive policy = Positive (timing-adjusted)</td>
</tr>
<tr>
<td class="vname">Gas Price Equalisation Risk</td>
<td>The regulatory risk that government equalises feedstock gas prices across all plants -- removing FFC's Rs580 vs Rs1,597 advantage. EFERT has repeatedly demanded parity, calling the differential discriminatory. The Competition Commission has investigated. If equalised, FFC's cost advantage of approximately Rs1,200/bag disappears; its gross margin could compress 10-15 percentage points. This is simultaneously FFC's greatest structural risk and EFERT's greatest potential positive catalyst.</td>
<td class="neu">Binary: FFC negative, EFERT positive</td>
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
<h2>Competitive Landscape</h2>
<p>Pakistan's fertiliser sector is a concentrated oligopoly -- three meaningful listed players (FFC ~45%, EFERT ~32%, FATIMA ~16%) with Agritech at approximately 6%. Together, the three cover approximately 93% of domestic urea production capacity. Entry barriers are high: gas supply agreements with MPCL (Mari) or SNGPL are government-negotiated and not accessible to new entrants; capital requirements for ammonia-urea plants run into billions of rupees; and the regulatory environment requires ongoing government relations at multiple levels.</p>
<ul class="bl">
<li><strong style="color:var(--text)">FFC (post-FFBL merger):</strong> Dominant in urea (45%) and the only domestic DAP producer -- a structural monopoly in local DAP. Fauji Foundation's semi-government status gives FFC access to gas supply agreements that private companies cannot replicate.</li>
<li><strong style="color:var(--text)">EFERT:</strong> Engro Corporation subsidiary; strongest corporate governance and disclosure quality in the sector. Second largest urea producer; imports and markets DAP. The Enven plant's high gas cost is the primary competitive disadvantage. Demands gas price parity as a matter of stated corporate policy.</li>
<li><strong style="color:var(--text)">FATIMA:</strong> JV between Fatima Group and Arif Habib Group. Multi-product (urea, CAN, NP) producer. CAN and NP production creates niche revenue with no import competition. December 2025 Ghazij/Shawal gas allocation is the most significant near-term catalyst.</li>
</ul>
<div class="divider"></div>
<h2>Pricing Power</h2>
<p>Urea pricing is technically deregulated but functions oligopolistically. FFC's price leadership reflects its cost leadership: it sets the lowest competitive price consistent with its ultra-low gas cost. Competitors follow within a limited range. When FFC raises prices -- as it did in 2024 when gas prices increased for SNGPL plants, despite FFC bearing none of the extra cost itself -- all companies benefit from the industry-wide price increase. Import competition sets a ceiling when the local-to-import price gap widens.</p>
<div class="divider"></div>
<h2>Regulatory and Policy Influence</h2>
<ul class="bl">
<li><strong style="color:var(--text)">Gas allocation and pricing (OGRA, Ministry of Energy):</strong> The most powerful policy lever. Feedstock gas price and supply allocation directly determine each company's cost structure. FFC's agreements predate Pakistan's gas sector restructuring and carry legacy pricing unavailable to newer plants.</li>
<li><strong style="color:var(--text)">Competition Commission of Pakistan (CCOP):</strong> Has investigated and fined both FFC and EFERT for pricing-related matters. Ongoing scrutiny of the Rs580 vs Rs1,597 differential is the key regulatory risk for FFC.</li>
<li><strong style="color:var(--text)">Urea import policy:</strong> Government can restrict or allow urea imports. Restrictions tighten the local market and support domestic prices; facilitation does the opposite. Set ad hoc with short notice.</li>
<li><strong style="color:var(--text)">GIDC collection and court orders:</strong> Rs107.9B+ in outstanding GIDC liabilities subject to court-supervised collection. Any Supreme Court order on settlement timeline directly affects sector cash flows.</li>
<li><strong style="color:var(--text)">Agricultural support schemes:</strong> Punjab Kissan Card, fertiliser subsidies, and wheat procurement policy create demand timing distortions with short notice.</li>
</ul>
<div class="divider"></div>
<h2>Gas Pricing Tiers -- The Defining Market Structure</h2>
<p>The same product (urea) is produced at radically different costs because gas agreements were negotiated at different times under different policies. This is not a market inefficiency that will necessarily correct -- it is an embedded structural feature of Pakistan's energy regulatory architecture.</p>
<div class="tbl-wrap">
<table class="gas-tbl" style="min-width:700px;">
<thead><tr><th>Gas Source</th><th>Price (Feedstock)</th><th>Plants Supplied</th><th>Companies</th><th>Competitive Implication</th></tr></thead>
<tbody>
<tr>
<td><div class="tier-badge tier-cheap">Mari HRL</div></td>
<td>Rs580/mmbtu</td>
<td>FFC Goth Machhi I &amp; II, Mirpur Mathelo; EFERT base plant (~USD 0.7/mmbtu); FATIMA Multan &amp; Sadiqabad</td>
<td>FFC (main plants), EFERT (base), FATIMA (base)</td>
<td>Structural cost moat. Approximately Rs1,200/bag cost advantage over SNGPL plants. FFC Gas Supply Agreements valid to approximately 2029.</td>
</tr>
<tr>
<td><div class="tier-badge tier-mid">SNGPL Network</div></td>
<td>Rs1,597/mmbtu</td>
<td>EFERT Enven plant; Fatimafert Sheikhupura (previously)</td>
<td>EFERT (Enven), FATIMA (Fatimafert historically)</td>
<td>175% premium over Mari. Plants carry Rs1,000+/bag higher production cost. Winter curtailments add operational risk on top of cost disadvantage.</td>
</tr>
<tr>
<td><div class="tier-badge tier-new">Ghazij/Shawal (Dec 2025)</div></td>
<td>TBD (wellhead-indexed)</td>
<td>FFC Port Qasim (104 mmcfd), Fatimafert Sheikhupura (68 mmcfd), Agritech Daud Khel (50 mmcfd)</td>
<td>FFC, FATIMA, Agritech</td>
<td>Federal cabinet approved December 2025. Converts SNGPL/RLNG-dependent plants to dedicated indigenous gas -- eliminating curtailment risk. Estimated Rs2-3B annual foreign exchange saving. Material cost improvement for Fatimafert.</td>
</tr>
</tbody>
</table>
</div>
<div class="note warn" style="margin-top:14px;">The Rs580 vs Rs1,597 gas price gap is simultaneously FFC's greatest structural moat and the sector's most acute regulatory risk. If government equalises feedstock gas prices across all plants -- driven by IMF fiscal reform, court orders, or EFERT lobbying -- it would be the single largest negative catalyst for FFC earnings and a corresponding positive for EFERT. Mari Gas Supply Agreements run to approximately 2029 for most FFC plants -- contractual protection that limits but does not eliminate near-term equalisation risk.</div>
<div class="divider"></div>
<h2>Import Dependence</h2>
<ul class="bl">
<li>Pakistan is normally self-sufficient in urea -- domestic production covers domestic demand. Surplus is exported in some years; imports occur when domestic prices rise excessively above import parity.</li>
<li>DAP is approximately 50% imported (post-merger, FFC covers the other 50% through local production at Bin Qasim). DAP import prices are internationally determined with no domestic pricing floor.</li>
<li>CAN and NP (FATIMA-exclusive) have no import competition -- specialty crops requiring these fertilisers have no economical substitute, creating a captive demand pocket unique in the sector.</li>
</ul>
</div>`,
  },
  {
    id: 'companies',
    label: 'Companies',
    content: `<div class="section">
<div class="section-label">05 &middot; Company Profiles</div>
<h2>Three Major Listed Fertiliser Companies</h2>
<p>Figures drawn from CY2024 results, Q1CY25 results, and publicly available broker research. Verify against current filings.</p>
    <div class="company-grid">

      <div class="company-card card-ffc">
        <div class="company-ticker ticker-ffc">PSX: FFC</div>
        <div class="company-name">Fauji Fertilizer Company Ltd</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Pakistan's largest urea producer (~45% market share post-FFBL merger July 2024); sole domestic DAP producer; three plants on Mari gas (Rs580/mmbtu); Fauji Foundation ~43.5% ownership.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Mari gas at Rs580/mmbtu produces an ~Rs1,200/bag urea cost advantage over SNGPL competitors — the most durable structural cost moat of any listed Pakistani industrial company. Post-merger DAP monopoly adds a second structural moat.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Gas price equalisation is the existential regulatory risk — any decision to equalise feedstock prices eliminates the primary advantage in a single policy action.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Urea offtake volume (largest base makes this the primary EPS mover); feedstock cost gap vs SNGPL peers; DAP import and resale margins on post-merger FFBL volumes.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Gas price equalisation (binary, high-impact regulatory risk); cotton and wheat crop performance (determines offtake timing); government scheme distortion to quarterly demand.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The only company in Pakistan whose earnings benefit from a competitor's cost increase — when SNGPL gas prices rise, FFC's feedstock cost is unchanged while its urea price rises with the market.</li>
        </ul>
      </div>

      <div class="company-card card-efert">
        <div class="company-ticker ticker-efert">PSX: EFERT</div>
        <div class="company-name">Engro Fertilizers Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Engro Corporation subsidiary; second largest urea producer (~32% market share); two plants on different gas regimes (legacy concessionary ~USD 0.7/mmbtu + Enven at Rs1,597/mmbtu); imports and markets DAP.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Engro Corporation governance — the highest disclosure standards and institutional quality in the listed fertiliser sector. Base plant legacy gas rate is one of the lowest feedstock costs in the world.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Enven plant gas at Rs1,597/mmbtu raises blended cost above FFC's full fleet; no domestic DAP production — imported inventory creates mark-to-market risk when global DAP prices swing.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Urea volumes (distorted by Kissan Card timing); base plant cost advantage; blended margins across two plants with materially different cost structures.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> SNGPL gas price changes affect Enven cost directly; imported DAP inventory valuation; Q1CY25 showed how sharply earnings collapse when offtake timing is distorted by government schemes.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The gas-equalisation hedge counterpart to FFC — EFERT's competitive position improves most in the scenario where FFC's primary advantage is most at risk. The two form a natural policy-scenario analytical pair.</li>
        </ul>
      </div>

      <div class="company-card card-fatima">
        <div class="company-ticker ticker-fatima">PSX: FATIMA</div>
        <div class="company-name">Fatima Fertilizer Company Ltd</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Fatima Group + Arif Habib JV; produces urea, CAN, and NP; Multan and Sadiqabad on Mari gas; Fatimafert plant transitioning from SNGPL/RLNG to Ghazij/Shawal gas (68 mmcfd approved Dec 2025).</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Sole listed producer of CAN and NP — specialty fertilisers with no domestic listed-company competition. Ghazij/Shawal gas allocation converts Fatimafert from the sector's highest-cost unit to a competitive one.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> Fatimafert was on SNGPL/RLNG — the highest feedstock cost in the sector — before Ghazij/Shawal approval; CAN/NP volumes are smaller than urea, limiting absolute earnings scale.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Ghazij/Shawal gas ramp-up at Fatimafert (primary near-term catalyst); CAN and NP offtake; urea pricing dynamics at Multan and Sadiqabad plants.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Ghazij/Shawal commissioning timeline risk; CAN demand tied to specific crop cycles; transition period creates an earnings gap between SNGPL shutdown and Ghazij startup.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Monopoly on listed CAN and NP production — these products cannot be directly substituted by urea in certain crop applications, giving FATIMA a pricing dynamic that urea-only peers do not face.</li>
        </ul>
      </div>

    </div>
<ul class="co-bullets">
<li>Pakistan's largest fertiliser company; majority-owned by Fauji Foundation (~43.5%); "Sona" brand is the most recognised fertiliser brand in Pakistan</li>
<li>Post-FFBL merger (July 2024): only domestic DAP producer; consolidated CY2024 PAT Rs85.5B; standalone Rs64.7B; H1CY25 PAT Rs38.5B (+48% YoY); EPS Rs27 in H1CY25</li>
<li>Three main urea plants (Goth Machhi I, II, Mirpur Mathelo) on Mari gas at Rs580/mmbtu -- lowest feedstock cost in sector; Q1CY25 gross margin improved to 35.9% vs 29.6% YoY even as volumes dipped</li>
<li>Dividend commitment: Rs19/share distributed H1CY25; Fauji Foundation's pension obligations create institutional incentive to sustain high payouts</li>
</ul>
<div class="co-4grid">
<div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Mari gas at Rs580/mmbtu -- contractually-protected cost advantage producing approximately Rs1,200/bag urea cost gap vs SNGPL competitors. Post-merger DAP monopoly (only domestic producer) adds a second structural moat. Neither is replicable by competitors near-term.</span></div>
<div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Gas price equalisation is FFC's existential regulatory risk: any government decision to equalise feedstock prices eliminates the core advantage overnight. Fauji Foundation's position provides political buffer -- but the risk is structural and non-zero. High dividend expectations also limit balance sheet flexibility.</span></div>
<div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">When SNGPL gas prices were raised 175% in 2024, FFC raised its urea price anyway -- pocketing the full margin expansion with zero cost increase. No other company can do this. FFC earns higher margins when peers' costs rise even when its own costs are unchanged.</span></div>
<div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Urea offtake volume (largest base means volumes drive EPS most); gas price equalisation risk (binary, high impact); government agricultural scheme timing. Cotton crop outcomes determine Kharif revenue visibility.</span></div>
</div>
<div class="tags">
<span class="tag g">Mari Gas Moat</span>
<span class="tag g">Only DAP Producer</span>
<span class="tag g">Highest Dividend</span>
<span class="tag">Fauji Foundation</span>
<span class="tag a">Post-FFBL Merger</span>
</div>
</div>

<!-- EFERT -->
<div class="company-card card-efert">
<div class="co-ticker t-efert">PSX: EFERT</div>
<div class="co-name">Engro Fertilizers Limited</div>
<div class="co-meta">
<div class="co-meta-cell"><span class="co-meta-lbl">Market Cap</span><span class="co-meta-val">~$1.0B (Sep 2025)</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Q1CY25 PAT</span><span class="co-meta-val">Rs2.9B (-63% YoY)</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Urea Market Share</span><span class="co-meta-val">~32%</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Plants</span><span class="co-meta-val">Base (~USD 0.7) + Enven (Rs1,597)</span></div>
</div>
<ul class="co-bullets">
<li>Subsidiary of Engro Corporation (Dawood Hercules Group); Pakistan's second largest urea producer; sells under "Engro" brand with strong commercial farmer penetration</li>
<li>Two plants, two gas regimes: base/old plant at legacy concessionary SNGPL rate (~USD 0.7/mmbtu -- one of the lowest feedstock rates in the world); Enven plant at Rs1,597/mmbtu, raising blended cost above FFC</li>
<li>Q1CY25: PAT Rs2.9B (-63% YoY); revenue fell from Rs53.8B to Rs24.3B; urea sales 260,000t vs 548,000t -- driven by Dec 2024 Kissan Card advance buying creating Q1CY25 demand vacuum; held 51% of all industry urea inventory at March 2025 end</li>
<li>Does not produce DAP locally -- imports and markets DAP; exposed to international DAP price volatility and inventory markdown risk</li>
</ul>
<div class="co-4grid">
<div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Base plant legacy gas rate (~USD 0.7/mmbtu) is a genuine structural moat -- one of the cheapest feedstock rates in the world. Engro Corporation's governance quality, disclosure standards, and institutional relationships are the sector's best by a clear margin.</span></div>
<div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Enven plant's Rs1,597/mmbtu raises blended cost above FFC. No local DAP production -- imported inventory creates mark-to-market risk when global prices swing. Q1CY25 demonstrated how quickly earnings collapse when offtake timing is distorted by government schemes.</span></div>
<div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">The gas equalisation hedge: the only scenario where FFC's structural advantage disappears is the same scenario where EFERT's competitive position improves most. EFERT and FFC form a natural regulatory hedge pair for any analyst expressing a view on gas price policy direction.</span></div>
<div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Enven plant gas cost (SNGPL rate changes are direct); imported DAP price (inventory mark-to-market); urea offtake timing (most volatile quarterly EPS from demand scheme distortions); GIDC payables (largest absolute liability).</span></div>
</div>
<div class="tags">
<span class="tag b">Engro Governance</span>
<span class="tag b">Base Plant Moat</span>
<span class="tag r">Enven High Cost</span>
<span class="tag r">No Local DAP</span>
</div>
</div>

<!-- FATIMA -->
<div class="company-card card-fatima">
<div class="co-ticker t-fatima">PSX: FATIMA</div>
<div class="co-name">Fatima Fertilizer Company Ltd</div>
<div class="co-meta">
<div class="co-meta-cell"><span class="co-meta-lbl">Market Cap</span><span class="co-meta-val">~$915M (Sep 2025)</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Q1CY25 PAT</span><span class="co-meta-val">Rs7.9B (-6% YoY)</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Urea Market Share</span><span class="co-meta-val">~16%</span></div>
<div class="co-meta-cell"><span class="co-meta-lbl">Ownership</span><span class="co-meta-val">Fatima Group + Arif Habib JV</span></div>
</div>
<ul class="co-bullets">
<li>JV between Fatima Group and Arif Habib Group (2003); produces urea, CAN, and NP -- the only listed company in Pakistan making CAN and NP at scale; "Sarsabz" urea brand</li>
<li>Plants: Multan (urea, NP -- Mari gas); Sadiqabad/Pakarab (CAN -- Mari gas); Sheikhupura/Fatimafert (urea -- historically SNGPL/RLNG, now eligible for Ghazij/Shawal allocation)</li>
<li>December 2025: federal cabinet approved 68 mmcfd Ghazij/Shawal gas for Fatimafert -- converting its most problematic plant from expensive SNGPL/RLNG to indigenous gas; winter curtailment risk eliminated when gas flows</li>
<li>July 2025: announced acquisition of 100% of Fatima Petroleum -- diversification into petroleum retailing; Arif Habib Group connection provides capital markets access</li>
</ul>
<div class="co-4grid">
<div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">CAN and NP products have no import competition in Pakistan -- unlike urea and DAP, no global alternative undercuts FATIMA in these segments. These niche products create a captive, loyal base of specialty-crop farmers with no alternative supplier.</span></div>
<div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Fatimafert (Sheikhupura) has historically been FATIMA's chronic cost drag -- expensive SNGPL/RLNG gas and winter curtailments. Until Ghazij/Shawal gas actually flows and proves reliable at committed volumes, this operational risk persists. Smaller scale than FFC and EFERT limits pricing influence.</span></div>
<div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">CAN and NP monopoly -- Pakistan's only listed producer of these fertiliser types. For specialty crop farmers, these products are non-substitutable. The December 2025 Ghazij/Shawal gas allocation is the single most transformative near-term earnings catalyst for FATIMA if gas delivery proceeds as approved.</span></div>
<div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">Ghazij/Shawal gas delivery timeline and actual volumes (Fatimafert economics hinge on this). Urea offtake (core revenue). Winter gas curtailments until Ghazij/Shawal flows. Fatima Petroleum integration adds non-core complexity to earnings analysis.</span></div>
</div>
<div class="tags">
<span class="tag a">CAN Monopoly</span>
<span class="tag a">NP Monopoly</span>
<span class="tag g">Ghazij/Shawal Catalyst</span>
<span class="tag">Arif Habib JV</span>
</div>
</div>`,
  },
  {
    id: 'peers',
    label: 'Peers',
    content: `<div class="section">
<div class="section-label">06 &middot; Peer Comparison Grid</div>
<h2>Cross-Company Comparison</h2>
<p>Based on publicly available disclosures and broker research. Verify against current filings.</p>
<div class="tbl-wrap">
<table class="peer-tbl" style="min-width:900px;">
<thead><tr><th>Company</th><th>Business Model</th><th>Key Strength</th><th>Key Weakness</th><th>Main Sensitivity</th><th>Distinguishing Feature</th></tr></thead>
<tbody>
<tr>
<td><div class="co-badge b-ffc">FFC</div><br><span style="font-size:12px;">Fauji Fertilizer</span></td>
<td>Dominant urea (45%) + only domestic DAP producer post-merger. Mari gas at Rs580/mmbtu. Fauji Foundation-backed with high dividend commitment.</td>
<td>Cheapest feedstock + domestic DAP monopoly. Two structural moats simultaneously; neither replicable near-term.</td>
<td>Gas price equalisation risk eliminates core advantage if enacted. High payout leaves limited retained earnings for growth capex.</td>
<td>Urea offtake volumes (largest base). Government scheme timing. Cotton crop for Kharif. Gas price equalisation (binary, high impact).</td>
<td>The only company where a government gas pricing decision directly threatens its entire earnings model -- and where military pension fund dependency creates institutional protection from that risk simultaneously.</td>
</tr>
<tr>
<td><div class="co-badge b-efert">EFERT</div><br><span style="font-size:12px;">Engro Fertilizers</span></td>
<td>Second largest urea producer. Dual-plant dual-gas structure. DAP importer and marketer. Engro governance pedigree. Demands gas price parity as stated policy.</td>
<td>Base plant legacy gas rate (~USD 0.7/mmbtu) is world-class. Engro governance is sector-best. Gas equalisation is a positive catalyst for EFERT.</td>
<td>Enven plant's Rs1,597/mmbtu raises blended cost above FFC. No local DAP production -- import inventory creates mark-to-market risk.</td>
<td>Enven gas cost (SNGPL rate changes direct). Urea offtake timing (most volatile from government scheme distortions). GIDC payables.</td>
<td>The gas equalisation hedge: the same regulatory event that eliminates FFC's advantage is the event that benefits EFERT most -- making the two companies a natural analytical pair for government policy scenarios.</td>
</tr>
<tr>
<td><div class="co-badge b-fatima">FATIMA</div><br><span style="font-size:12px;">Fatima Fertilizer</span></td>
<td>Multi-product mid-tier (urea + CAN + NP). Mixed gas structure (Mari base + SNGPL/Ghazij Fatimafert). Arif Habib Group JV. December 2025 Ghazij/Shawal gas catalyst.</td>
<td>CAN and NP products face no import competition -- captive niche revenue. Ghazij/Shawal gas transforms Fatimafert economics when realised.</td>
<td>Smaller scale limits pricing and distribution influence. Fatimafert has been a chronic cost drag until Ghazij/Shawal flows reliably at committed volumes.</td>
<td>Ghazij/Shawal gas delivery timeline and volumes. Fatimafert plant economics (swing from SNGPL to indigenous gas). Specialty crop demand for CAN/NP.</td>
<td>CAN and NP -- the only listed producer in Pakistan. For specialty crop farmers, these products are non-substitutable; no import arrives to undercut FATIMA in these segments.</td>
</tr>
</tbody>
</table>
</div>
<div class="divider"></div>
<h2>Key Metrics Snapshot</h2>
<div class="tbl-wrap">
<table class="peer-tbl" style="min-width:680px;">
<thead><tr><th>Metric</th><th>FFC</th><th>EFERT</th><th>FATIMA</th></tr></thead>
<tbody>
<tr><td><strong style="color:var(--text)">Market Cap (~)</strong></td><td>$2.3B</td><td>$1.0B</td><td>$915M</td></tr>
<tr><td><strong style="color:var(--text)">Urea Market Share</strong></td><td>~45% (post-merger)</td><td>~32%</td><td>~16%</td></tr>
<tr><td><strong style="color:var(--text)">Primary Gas Rate</strong></td><td>Rs580/mmbtu (Mari)</td><td>Blended (USD 0.7 base + Rs1,597 Enven)</td><td>Mari base + SNGPL/Ghazij Fatimafert</td></tr>
<tr><td><strong style="color:var(--text)">DAP Position</strong></td><td>Only domestic producer</td><td>Importer/marketer only</td><td>Small importer</td></tr>
<tr><td><strong style="color:var(--text)">Unique Products</strong></td><td>Urea + DAP (local)</td><td>Urea + DAP (imported)</td><td>Urea + CAN + NP (captive niche)</td></tr>
<tr><td><strong style="color:var(--text)">Gross Margin Range</strong></td><td>35-45%</td><td>28-38%</td><td>30-42% (base plant driven)</td></tr>
<tr><td><strong style="color:var(--text)">GIDC Exposure</strong></td><td>Moderate</td><td>Highest absolute</td><td>Moderate</td></tr>
<tr><td><strong style="color:var(--text)">Winter Gas Risk</strong></td><td>Low (Mari supply stable)</td><td>Medium (some SNGPL dependency)</td><td>High until Ghazij/Shawal flows</td></tr>
<tr><td><strong style="color:var(--text)">Ownership</strong></td><td>Fauji Foundation ~43.5%</td><td>Engro Corporation (Dawood Hercules)</td><td>Fatima Group + Arif Habib JV</td></tr>
<tr><td><strong style="color:var(--text)">Gas Equalisation Impact</strong></td><td>Highly negative (loses core moat)</td><td>Highly positive (closes cost gap)</td><td>Moderately positive (base plants)</td></tr>
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
<div class="risk-name">Gas Price Equalisation</div>
<div class="risk-desc">If government equalises feedstock gas prices across all plants -- a long-standing EFERT demand, investigated by the Competition Commission -- FFC's Rs580 vs Rs1,597 advantage disappears. The Rs1,017/mmbtu gap translates to approximately Rs1,200/bag of urea cost difference. Eliminating it would reduce FFC's gross margins by an estimated 10-15 percentage points. Contractual protection (Mari GSAs valid to approximately 2029) and political economy (Fauji Foundation's military pension funding role) provide near-term buffers -- but the risk is structural and non-zero.</div>
</div>
<div class="risk-item">
<div class="risk-name">Demand Vacuum After Pull-Forward</div>
<div class="risk-desc">Punjab Kissan Card (December 2024) generated an 18% YoY volume surge -- followed immediately by a 40-50% industry offtake collapse in Q1CY25. Government demand-support schemes create acute temporal distortions with minimal warning. The following 1-3 quarters see volume shortfalls as farmers work through pre-purchased inventory. This is the primary source of quarterly EPS volatility in the sector and is impossible to fully anticipate in advance.</div>
</div>
<div class="risk-item">
<div class="risk-name">Agricultural Crop Failure</div>
<div class="risk-desc">The 2024 cotton crop yield fell approximately 50% YoY -- contributing to Kharif urea offtake declining 35% YoY in September 2024 and costing the sector approximately Rs8-10B in lost quarterly revenue. Wheat crop failure in Rabi would be equally damaging given wheat's approximately 50% share of annual urea consumption. Both crops are weather-dependent with risks (drought, pest, flood) entirely outside any company's control.</div>
</div>
<div class="risk-item">
<div class="risk-name">Imported Urea Undercutting</div>
<div class="risk-desc">When local urea ex-factory prices exceed import parity by a wide margin (Rs3,271/bag in Q1CY25), importers bring in cheaper international urea. EFERT's Enven plant is most vulnerable as its cost structure leaves less room to match import-priced competition. FFC can absorb the pressure at its ultra-low Mari gas cost. This risk grows when global urea supply expands and international prices fall, compressing the local-to-import price gap.</div>
</div>
<div class="risk-item">
<div class="risk-name">GIDC Settlement Risk</div>
<div class="risk-desc">Outstanding GIDC payables stood at Rs107.9B sector-wide by 9MCY2024, with EFERT carrying the largest absolute exposure. Any Supreme Court or High Court order requiring accelerated full settlement could require a large immediate cash outflow -- creating a multi-quarter PAT impact in the settlement period. GIDC is a persistent background risk for all three companies and is managed separately from operational earnings analysis.</div>
</div>
<div class="risk-item">
<div class="risk-name">Global DAP Price Decline</div>
<div class="risk-desc">For EFERT and FATIMA, falling global DAP prices create inventory markdowns on imported DAP bought at higher prices. For FFC (now the only domestic DAP producer), falling global prices compress local production margins and invite import competition. Global DAP prices are set by Chinese production economics, Moroccan phosphate rock availability, and international demand -- entirely outside Pakistani company control.</div>
</div>
<div class="risk-item">
<div class="risk-name">Winter Gas Curtailments</div>
<div class="risk-desc">SNGPL-fed plants face pressure drops and supply interruptions in winter when domestic household gas demand peaks. Fatimafert (Sheikhupura) has historically faced multi-week shutdowns in December-January -- forcing costly RLNG sourcing or production halts. The December 2025 Ghazij/Shawal gas allocation should eliminate this risk for Fatimafert -- but only once dedicated gas actually flows at committed volumes and on a reliable basis.</div>
</div>
<div class="risk-item">
<div class="risk-name">Ghazij/Shawal Delivery Risk</div>
<div class="risk-desc">The December 2025 federal cabinet approval for Ghazij/Shawal gas to Fatimafert is a policy decision -- not a guarantee of physical delivery. Field development timelines, MPCL production ramp-up, and pipeline connection work must proceed as planned. If gas volumes are delayed or lower than the approved 68 mmcfd, Fatimafert remains on expensive SNGPL/RLNG -- the improvement in plant economics that the market anticipates would take longer to materialise in reported results.</div>
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
<li><strong style="color:var(--text);">NFDC monthly data</strong> -- National Fertilizer Development Centre publishes production, offtake, inventory, and price data monthly. Published approximately mid-month for prior month. The primary leading indicator for quarterly EPS.</li>
<li><strong style="color:var(--text);">Cotton acreage and crop condition reports</strong> -- USDA, Pakistan Cotton Ginners Association, and provincial agriculture departments. Cotton yield outlook sets Kharif urea demand expectations from April onward.</li>
<li><strong style="color:var(--text);">IRSA water availability</strong> -- Indus River System Authority canal allocations. Water availability drives irrigated crop area and therefore fertiliser demand. Drought conditions are a leading negative indicator.</li>
<li><strong style="color:var(--text);">Global urea and DAP prices</strong> -- International benchmarks (Fertecon, ICIS, Bloomberg Agri). Track import parity gap vs domestic ex-factory price. Gap above Rs2,000/bag creates meaningful import competition risk for EFERT.</li>
<li><strong style="color:var(--text);">SNGPL gas pressure and curtailment reports</strong> -- particularly important November-February for Fatimafert and EFERT Enven. Any SNGPL curtailment notice signals near-term production disruption.</li>
</ul>
</div>
<div class="monitor-col">
<div class="monitor-head">Quarterly</div>
<ul class="monitor-list">
<li><strong style="color:var(--text);">Financial results</strong> -- derive: feedstock gas cost per mmbtu (from production volume and COGS), urea gross margin per bag (from revenue and COGS per ton), inventory levels at quarter end, GIDC payments made vs accrued.</li>
<li><strong style="color:var(--text);">Urea offtake vs capacity utilisation</strong> -- compare NFDC data with company-reported production. Low utilisation signals either plant shutdown (gas curtailment) or demand weakness driving inventory build.</li>
<li><strong style="color:var(--text);">DAP import volumes and margin</strong> -- for EFERT and FATIMA, derive the import/resale margin from DAP tonnes sold vs landed cost. A DAP margin collapse signals global price decline or inventory markdown.</li>
<li><strong style="color:var(--text);">Sector closing inventory</strong> -- NFDC-published. High inventory (above 700,000-800,000 tons sector-wide) signals pricing pressure ahead; low inventory signals strong offtake or production shortfall.</li>
<li><strong style="color:var(--text);">GIDC accrual vs payment</strong> -- growing gap between expense accrued and cash payments made increases eventual settlement risk. EFERT's GIDC liability is most closely watched.</li>
<li><strong style="color:var(--text);">Ghazij/Shawal gas delivery progress (FATIMA)</strong> -- from Q1CY26 onward, track whether committed volumes are flowing to Fatimafert. Quarterly cost data will confirm whether plant economics are improving.</li>
</ul>
</div>
<div class="monitor-col">
<div class="monitor-head">Event-Driven</div>
<ul class="monitor-list">
<li><strong style="color:var(--text);">Government demand scheme announcements</strong> -- Kissan Card activations, urea subsidies, input support. Announced with short notice; create immediate demand timing distortions. Watch Punjab and Sindh agriculture budgets.</li>
<li><strong style="color:var(--text);">Wheat Support Price announcement</strong> -- federal and provincial governments (typically October-November). Higher support price signals stronger Rabi urea demand willingness.</li>
<li><strong style="color:var(--text);">OGRA gas price notifications</strong> -- any OGRA notification changing SNGPL industrial/fertiliser gas rates directly impacts EFERT Enven and Fatimafert production cost. Monitor OGRA press releases and gazette.</li>
<li><strong style="color:var(--text);">Gas price equalisation signals</strong> -- any government, court, or CCOP announcement on equalising feedstock gas prices is the highest-impact single event for FFC (negative) and EFERT (positive). Monitor CCOP orders, Ministry of Energy announcements, and court judgments.</li>
<li><strong style="color:var(--text);">GIDC court orders</strong> -- any High Court or Supreme Court ruling on GIDC settlement timeline or amount. An order requiring full payment creates a large one-time cash outflow for EFERT and FATIMA.</li>
<li><strong style="color:var(--text);">Urea import policy changes</strong> -- government notifications restricting or allowing imports. Restrictions tighten the market and support domestic prices; facilitation does the opposite.</li>
<li><strong style="color:var(--text);">Ghazij/Shawal first-flow confirmation</strong> -- physical gas delivery confirmation from MPCL to Fatimafert and FFC Port Qasim. This validates the December 2025 policy announcement and triggers the earnings improvement the market is anticipating.</li>
</ul>
</div>
</div>
<div class="divider"></div>
<h2>Important Dates and Timeline</h2>
<div class="tl-item"><div class="tl-when">Monthly (NFDC)</div><div class="tl-what">National Fertilizer Development Centre data release -- production, offtake, inventory, and price by company. Published mid-month for prior month. The primary forward indicator for quarterly earnings in this sector.</div></div>
<div class="tl-item"><div class="tl-when">March - April (Kharif prep)</div><div class="tl-what">Dealer stocking period ahead of Kharif sowing. NFDC data in March-April sets the tone for Kharif offtake. Cotton planting progress and IRSA water allocations are leading signals for summer urea demand.</div></div>
<div class="tl-item"><div class="tl-when">Apr / May (Q1 results)</div><div class="tl-what">First-quarter (Jan-Mar) financial results. Captures post-Kissan Card demand vacuum if Dec pull-forward occurred. Watch inventory levels -- high closing inventory signals pricing risk in Q2.</div></div>
<div class="tl-item"><div class="tl-when">Aug / Sep (H1 results)</div><div class="tl-what">First-half results -- captures the full Kharif season. Cotton crop outcome for the year is typically visible by August. Analysts use H1 Kharif data to model full-year EPS.</div></div>
<div class="tl-item"><div class="tl-when">Oct - Nov (Wheat window)</div><div class="tl-what">Peak Rabi fertiliser demand -- wheat sowing drives the largest single urea offtake event of the year. NFDC data in October-November is the most consequential monthly release for annual EPS tracking.</div></div>
<div class="tl-item"><div class="tl-when">Oct / Nov (Q3 results)</div><div class="tl-what">Third-quarter (Jul-Sep) results -- captures Kharif season performance and closing inventory entering Rabi. Government scheme announcements (if any) ahead of wheat sowing season are made in this window.</div></div>
<div class="tl-item"><div class="tl-when">Nov (Wheat Support Price)</div><div class="tl-what">Federal and/or provincial governments announce wheat procurement support prices ahead of sowing. Higher price increases farmer income expectations and input application willingness for the season.</div></div>
<div class="tl-item"><div class="tl-when">Dec - Jan (Curtailment Risk)</div><div class="tl-what">Peak winter gas curtailment period for SNGPL-fed plants. Monitor SNGPL notices to Fatimafert and EFERT Enven. Until Ghazij/Shawal gas flows to Fatimafert, this window carries production risk each year.</div></div>
<div class="tl-item"><div class="tl-when">Feb / Mar (Full-year results)</div><div class="tl-what">Full-year results -- dividend announcements, gas cost trajectory commentary, and GIDC payment disclosures. Most comprehensive disclosure period.</div></div>
<div class="tl-item"><div class="tl-when">CY2026 onward</div><div class="tl-what">Monitor quarterly Fatimafert production cost data for evidence of Ghazij/Shawal gas improving plant economics. Also watch for any regulatory movement on gas price equalisation -- the defining sector-wide policy risk.</div></div>
</div>`,
  },
  {
    id: 'glossary',
    label: 'Glossary',
    content: `<div class="section">
<div class="section-label">09 &middot; Glossary</div>
<h2>Key Terms</h2>
<div class="glo-grid">
<div class="glo-item"><div class="glo-term">Urea</div><div class="glo-def">Pakistan's primary nitrogen fertiliser -- a white granular or prilled solid with 46% nitrogen content. Produced from natural gas via ammonia synthesis. The 50kg bag is the standard retail unit; ex-factory prices ranged Rs3,767-5,489/bag in CY2024. Wheat alone accounts for approximately 50% of Pakistan's annual urea consumption.</div></div>
<div class="glo-item"><div class="glo-term">DAP (Di-Ammonium Phosphate)</div><div class="glo-def">Phosphate fertiliser with 18% nitrogen and 46% phosphate. Major input for wheat, cotton, and rice at sowing time. Pakistan imports approximately 50% of its DAP requirements; FFC (post-FFBL merger) is the only domestic producer. DAP prices are set by international markets with no domestic pricing floor.</div></div>
<div class="glo-item"><div class="glo-term">CAN (Calcium Ammonium Nitrate)</div><div class="glo-def">Nitrogen fertiliser with 26% nitrogen; slower release than urea, preferred for fruits, vegetables, and specialty crops. Produced only by FATIMA (Pakarab/Sadiqabad plant) among Pakistan's listed fertiliser companies. CAN has no import equivalent in Pakistan -- FATIMA holds a captive market for farmers requiring this product, with no competitive threat from imports.</div></div>
<div class="glo-item"><div class="glo-term">NP (Nitrophos)</div><div class="glo-def">Compound fertiliser combining nitrogen and phosphate in one granule. Produced only by FATIMA in Pakistan's listed sector. Like CAN, NP has no direct import competition -- specialty crop farmers using NP have no economical alternative, giving FATIMA a protected revenue segment.</div></div>
<div class="glo-item"><div class="glo-term">Feedstock Gas vs Fuel Gas</div><div class="glo-def">Two distinct natural gas uses in a fertiliser plant. Feedstock gas is chemically converted into ammonia and then urea -- it is the raw material input. Fuel gas powers boilers, compressors, and utilities. They are priced differently. Cost analysis must distinguish the two: only feedstock gas directly determines urea production cost per unit and therefore the gross margin differential between companies.</div></div>
<div class="glo-item"><div class="glo-term">Kharif Season</div><div class="glo-def">Pakistan's summer crop season: April-September. Monsoon-dependent crops: rice, cotton, sugarcane, maize, pulses. Approximately 50% of annual urea offtake occurs in Kharif. Cotton (~25% of annual fertiliser use) is the key variable -- a cotton crop failure, as in 2024 (yield down ~50%), can collapse Kharif urea offtake by 30-40% YoY. April-May are the peak fertiliser sales months.</div></div>
<div class="glo-item"><div class="glo-term">Rabi Season</div><div class="glo-def">Pakistan's winter crop season: October-March. Wheat, barley, oilseeds. Wheat sowing drives the largest single fertiliser demand event -- the wheat urea window in October-November. DAP demand peaks in Rabi as farmers phosphate-dress wheat fields before sowing. Government Wheat Support Price (announced October-November) is the leading demand indicator for Rabi urea offtake.</div></div>
<div class="glo-item"><div class="glo-term">NFDC</div><div class="glo-def">National Fertilizer Development Centre -- government body under the Ministry of Food Security. Publishes monthly fertiliser production, offtake, closing inventory, and price data for each manufacturer. The primary data source for analyst models. Every serious fertiliser research note begins with NFDC monthly data. Published approximately mid-month for the prior month.</div></div>
<div class="glo-item"><div class="glo-term">GIDC (Gas Infrastructure Development Cess)</div><div class="glo-def">A per-mmbtu levy charged on industrial gas consumers (including fertiliser companies) to fund gas pipeline development. Sector-wide GIDC payables reached Rs107.9B by 9MCY2024. Fertiliser companies pay through court-ordered installments. EFERT carries the largest absolute GIDC liability. A court order requiring accelerated full settlement would create a large one-time PAT impact in the settlement quarter.</div></div>
<div class="glo-item"><div class="glo-term">Kissan Card Scheme</div><div class="glo-def">Punjab government's interest-free loan programme for registered farmers to purchase agricultural inputs. When activated (as in December 2024), creates a massive advance-buying surge -- followed by 1-3 quarters of sharply below-normal demand as farmers draw on pre-purchased inventory. The Dec 2024 Kissan Card generated an 18% YoY offtake surge in Q4CY24 and a 40-50% collapse in Q1CY25. The single most acute source of quarterly EPS volatility in this sector.</div></div>
<div class="glo-item"><div class="glo-term">Import Parity Price</div><div class="glo-def">Landed cost of imported urea or DAP in Pakistan -- international FOB price plus ocean freight, insurance, port handling, and customs duties. When domestic ex-factory prices exceed import parity, importers bring in cheaper international product to arbitrage the gap. The gap widened to Rs3,271/bag in Q1CY25 for urea -- forcing EFERT to offer selective discounts to move inventory. FFC's ultra-low gas cost allows it to undercut international prices more easily than EFERT's Enven plant.</div></div>
<div class="glo-item"><div class="glo-term">Ghazij/Shawal Gas</div><div class="glo-def">New natural gas discoveries within the Mari Gas Field structure (Daharki, Sindh) -- off-specification gas requiring processing before use. Federal cabinet approved allocation in December 2025: FFC Port Qasim (104 mmcfd), Fatimafert Sheikhupura (68 mmcfd), Agritech Daud Khel (50 mmcfd). For Fatimafert, this converts a chronically expensive and curtailment-prone SNGPL/RLNG-fed plant to dedicated indigenous supply -- the most significant near-term cost catalyst for FATIMA.</div></div>
<div class="glo-item"><div class="glo-term">Gas Supply Agreement (GSA)</div><div class="glo-def">Long-term contractual agreements between gas field operators (MPCL for Mari field) and fertiliser companies specifying gas volumes, prices, and tenor. FFC's main plants operate under GSAs with Mari field at Rs580/mmbtu running to approximately 2029 -- providing contractual protection against gas price equalisation near-term. These agreements are the legal foundation of the cost advantage on which FFC's earnings model is built.</div></div>
<div class="glo-item"><div class="glo-term">Prilled vs Granular Urea</div><div class="glo-def">Two physical forms of urea. Prilled urea (FFC's Sona and most domestic production) forms small spherical beads. Granular urea (Sona Granular, now under FFC post-merger) is larger, harder, and slower to dissolve -- preferred by commercial farmers as it reduces nitrogen loss. Granular commands a slight price premium and is harder to produce. FFC's post-merger control of both forms creates product flexibility no other Pakistani producer can match.</div></div>
<div class="glo-item"><div class="glo-term">FMPAC</div><div class="glo-def">Fertiliser Manufacturers of Pakistan Advisory Council -- the industry body representing major producers. Lobbies government on gas pricing, import policy, and subsidy structures. FMPAC proposed the Ghazij/Shawal gas allocation to secure long-term domestic production viability. Also represents sector interests before OGRA, the Ministry of Energy, and the Competition Commission of Pakistan.</div></div>
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
<div class="exec-text"><strong>Sector identity.</strong> Pakistan's fertiliser sector is a concentrated oligopoly -- three listed companies (FFC ~45%, EFERT ~32%, FATIMA ~16%) control approximately 93% of domestic urea production. The sector sits at the intersection of agricultural economics and energy policy: natural gas is the input, urea is the output, and the price a company pays for gas determines whether it earns 45% or 29% gross margins on the same product. The sector is structurally agricultural -- driven by two crop seasons (Kharif/summer and Rabi/winter), with wheat and cotton as the dominant demand variables. Government policy in both agriculture (support prices, schemes) and energy (gas pricing, GIDC) is the overriding external force on earnings.</div>
</div>
<div class="exec-item">
<div class="exec-num">02</div>
<div class="exec-text"><strong>Core economics.</strong> Revenue is volume multiplied by ex-factory price. Gas feedstock at approximately 57% of direct production cost is the dominant margin variable. The Rs580/mmbtu Mari gas rate vs Rs1,597/mmbtu SNGPL rate creates a structural Rs1,200/bag urea cost gap between companies -- the largest cost divergence for the same product in Pakistan's listed equity universe. DAP revenue (approximately 15-20% of sector revenue) is internationally priced. CAN and NP (FATIMA-exclusive) have no import competition, creating protected niche revenue. Government demand schemes create violent quarterly offtake timing distortions that require multi-quarter smoothing for trend analysis.</div>
</div>
<div class="exec-item">
<div class="exec-num">03</div>
<div class="exec-text"><strong>Major variables.</strong> In order of structural importance: (1) feedstock gas price and source -- determined by government agreements, not operational performance; (2) urea ex-factory price -- oligopolistic, FFC-led; (3) NFDC monthly offtake -- the primary forward earnings indicator; (4) crop season conditions -- cotton yield for Kharif, wheat area and Wheat Support Price for Rabi; (5) government demand scheme timing -- Kissan Card-type events are the highest-variance EPS factor; (6) global DAP prices -- for FFC's production margin and EFERT/FATIMA import economics; (7) GIDC payment obligations -- periodic cash flow drag, largest for EFERT.</div>
</div>
<div class="exec-item">
<div class="exec-num">04</div>
<div class="exec-text"><strong>Major risks.</strong> Gas price equalisation is FFC's existential structural risk -- the regulatory event that collapses the company's core margin advantage overnight. Government demand scheme pull-forwards create demand vacuums that can collapse quarterly EPS by 40-60% with minimal warning (Q1CY25 demonstrates this clearly). Agricultural crop failure (cotton and wheat) reduces demand without any company-level offset available. GIDC settlement risk creates a persistent contingent liability overhang, largest for EFERT. Ghazij/Shawal gas delivery risk is FATIMA-specific -- if committed volumes are delayed, the plant economics improvement the market anticipates takes longer to appear in results.</div>
</div>
<div class="exec-item">
<div class="exec-num">05</div>
<div class="exec-text"><strong>What makes leading companies different.</strong> <strong>FFC</strong>: cheapest feedstock in the sector (Rs580/mmbtu) and the only domestic DAP producer (post-FFBL merger) -- two structural moats simultaneously. Its Fauji Foundation parentage provides political economy protection for the gas pricing advantage, and its dividend commitment (Rs19/share H1CY25) makes it the sector's primary income story. <strong>EFERT</strong>: base plant legacy gas rate (~USD 0.7/mmbtu) is genuinely world-class, and Engro's governance quality is the sector's best -- making EFERT the institutional quality story. The gas equalisation risk that threatens FFC is the same event that benefits EFERT most. <strong>FATIMA</strong>: CAN and NP monopoly creates import-competition-free revenue segments unique in the sector; the December 2025 Ghazij/Shawal gas allocation is the most transformative near-term earnings catalyst for the three companies if gas delivery proceeds as approved.</div>
</div>
</div>
<div class="note warn" style="margin-top:24px;">This module is based on publicly available secondary sources including company financial disclosures (PSX filings), NFDC monthly data, broker research (AKD Research, Adam Securities), Competition Commission of Pakistan rulings, and industry publications (Business Recorder, Profit Pakistan Today). It does not constitute investment advice. No buy, sell, or hold recommendations are made or implied. Figures should be verified against current company filings before use.</div>
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
        <div class="miss-title">FFC's Feedstock Advantage Is a Policy Decision, Not a Geological One</div>
        <div class="miss-body">FFC benefits from captive Mari gas pricing through CCOP (Cabinet Committee on Privatisation/Economic Coordination) arrangements that date to its privatisation. This pricing is not market-derived — it is an administrative allocation at a discounted rate. Any government decision to equalise feedstock gas prices across all fertiliser manufacturers would immediately and permanently close EFERT's structural cost disadvantage relative to FFC. The persistence of FFC's margin advantage depends entirely on the continuation of this policy decision, not on any operational or geological moat.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">02 ·</div>
        <div class="miss-title">The Kissan Card Creates a Timing Distortion, Not a Structural Demand Change</div>
        <div class="miss-body">Government Kissan Card and subsidy schemes create rapid, concentrated urea demand in the quarter of activation. This produces a sharp quarterly volume spike followed by an equally sharp demand vacuum in the following quarter as farmers have pre-purchased their requirement. Quarterly EPS in the activation quarter looks dramatically better than trend; the subsequent quarter looks dramatically worse. Analysing these quarters in isolation — without averaging across the scheme cycle — produces opposite conclusions from the same underlying agricultural demand.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">03 ·</div>
        <div class="miss-title">DAP Import Resale Is Mark-to-Market Exposed</div>
        <div class="miss-body">EFERT and FATIMA import DAP (diammonium phosphate) and sell it domestically. The margin on this trade is the difference between the landed cost at purchase and the domestic selling price at time of sale. International DAP prices are volatile — a 20–30% price swing over 2–3 months is not unusual. A company that buys high and sells into a falling domestic price environment records a negative DAP margin, directly depressing quarterly earnings. This has nothing to do with urea operations — it is a trading book embedded in the fertiliser P&L.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">04 ·</div>
        <div class="miss-title">GIDC Is a Recurring Provisioning Wildcard</div>
        <div class="miss-body">Gas Infrastructure Development Cess (GIDC) is a levy on gas consumers that has been challenged and relitigated in courts for over a decade. EFERT and FATIMA carry large GIDC liabilities on their balance sheets. Any court ruling — upholding the levy, reducing it, or requiring payment — creates a large one-time P&L impact. The liability hangs over the sector's earnings with unpredictable timing. Quarters in which GIDC provisions are reversed or settled can look dramatically different from trend without any underlying business change.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">05 ·</div>
        <div class="miss-title">Urea Domestic Price Is Administratively Influenced Despite Market Competition</div>
        <div class="miss-body">Pakistan has multiple urea producers and technically a competitive market. However, the government frequently influences domestic urea prices through import policy (restricting or allowing imports), subsidy schemes, and dealer price monitoring. When import parity is well above domestic prices, imports are restricted. When domestic prices rise near international parity, imports are facilitated. This administrative floor and ceiling means that urea producers cannot pass through full cost increases to farmers in inflationary environments — the earnings ceiling is policy-determined, not purely market-determined.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Short-Cycle vs Long-Cycle Drivers</h2>
    <p class="deep-intro">Different variables operate on completely different time horizons. Conflating near-term noise with structural change is one of the most common analytical errors in sector research.</p>
    <div class="cycle-grid">
    <div class="cycle-col">
      <div class="cycle-header" style="color:#6aad6a">NEAR TERM · 0–3 months</div>
      <div class="cycle-title">Quarterly EPS Drivers</div>
      <div class="cycle-item"><span class="cycle-driver">NFDC offtake and sector inventory</span>Published monthly; high inventory suppresses pricing; low inventory with high demand supports price — the most immediate demand signal.</div><div class="cycle-item"><span class="cycle-driver">Government demand scheme (Kissan Card)</span>Activations create instant volume spikes; deactivations create demand vacuums; the quarter of scheme change is the most distorted in the calendar.</div><div class="cycle-item"><span class="cycle-driver">DAP import margin</span>International DAP price movement directly affects EFERT and FATIMA import/resale margins quarter-on-quarter with no operational offset possible.</div><div class="cycle-item"><span class="cycle-driver">SNGPL curtailment (winter)</span>Gas curtailment at EFERT Enven and Fatimafert halts production; a missed production quarter cannot be fully recovered even if demand improves subsequently.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#c8a96e">MEDIUM TERM · 3–18 months</div>
      <div class="cycle-title">Input and Demand Signals</div>
      <div class="cycle-item"><span class="cycle-driver">Crop acreage and yield indicators</span>Cotton and wheat planting decisions determine Kharif and Rabi urea demand 3–6 months forward; IRSA water allocations are the earliest leading indicator.</div><div class="cycle-item"><span class="cycle-driver">Feedstock gas cost trajectory</span>OGRA notifications and SNGPL rate changes set the input cost baseline for EFERT and FATIMA; any revision is a permanent step-change in margin.</div><div class="cycle-item"><span class="cycle-driver">Ghazij/Shawal gas delivery (FATIMA)</span>Cheap Sui-equivalent gas from MPCL would reduce Fatimafert feedstock cost by 30–40% vs SNGPL rates — a structural margin improvement for FATIMA if and when it flows.</div><div class="cycle-item"><span class="cycle-driver">Urea import policy signals</span>Government signalling on import restrictions or facilitation determines whether domestic prices can sustain at international parity or must be kept below.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#4fb88a">STRUCTURAL · 18 months+</div>
      <div class="cycle-title">Decade-Scale Determinants</div>
      <div class="cycle-item"><span class="cycle-driver">Gas price equalisation policy</span>If feedstock gas prices are equalised across producers, FFC loses its margin advantage and EFERT gains; the entire competitive landscape of the sector reorganises.</div><div class="cycle-item"><span class="cycle-driver">Domestic gas supply trajectory</span>Pakistan's total gas supply is declining; as gas allocation to fertiliser competes with power, residential, and industrial users, curtailment risk increases structurally.</div><div class="cycle-item"><span class="cycle-driver">Agricultural productivity and crop yields</span>Fertiliser demand is ultimately a function of crop economics; if higher-yield crop varieties or precision agriculture reduce per-acre urea intensity, demand growth slows despite acreage expansion.</div><div class="cycle-item"><span class="cycle-driver">Import substitution vs domestic production balance</span>If Pakistan's domestic production cannot meet demand and import restrictions are lifted, domestic producers face permanent price competition from cheaper global urea.</div>
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
        <div class="connect-body">Significant through two channels. First, LTFF (Long Term Financing Facility) subsidised rates for agricultural and industrial investment track the SBP policy rate; lower rates reduce financing costs for fertiliser plant capex and working capital. Second, higher domestic interest rates increase farmer borrowing costs, reducing fertiliser purchase capability — an indirect demand suppression effect. FATIMA's Ghazij/Shawal pipeline capex is partly LTFF-financed, making the rate level a capex cost variable.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">💱</span>
        <div class="connect-title">Currency (PKR/USD)</div>
        <div class="connect-body">Moderate and mostly indirect. DAP and potash are imported in USD; PKR depreciation directly raises the landed cost of these imports, compressing resale margins if domestic prices cannot adjust upward quickly. Urea is domestically produced, so PKR has no direct cost impact on urea. Internationally, if PKR depreciation makes Pakistan a more attractive export market for cheaper global urea, import competition risk rises simultaneously.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🌾</span>
        <div class="connect-title">Commodity Prices (Global Urea and Gas)</div>
        <div class="connect-body">International urea prices determine the import parity gap — the ceiling above which domestic producers cannot raise prices without triggering government-facilitated imports. Global gas prices affect the opportunity cost framing for Pakistan's domestic gas allocation to fertiliser. High global gas prices make domestic gas allocation more valuable and may incentivise diversion to more profitable uses, increasing curtailment risk for fertiliser plants.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏛️</span>
        <div class="connect-title">Government Policy</div>
        <div class="connect-body">The dominant force in the sector. Feedstock gas prices are CCOP-determined. GIDC is court-contested but government-imposed. Kissan Card demand schemes are federal/provincial budget decisions. Urea import policy directly sets the competitive ceiling. Super tax rates affect the sector's ETR. No other sector has more of its primary revenue and cost variables determined by government decisions rather than market conditions.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🌱</span>
        <div class="connect-title">Agricultural Demand (Crop Cycles)</div>
        <div class="connect-body">The ultimate demand driver. Kharif crops (cotton, rice, sugarcane: June–November) drive urea demand in the pre-planting April–June window. Rabi crops (wheat, canola: October–March) drive demand in September–December. Water availability, support prices, and farmer income from the previous season all affect willingness to apply fertiliser. Poor monsoon years or low cotton prices in one season create fertiliser demand weakness in the next.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Business Model Winners &amp; Losers</h2>
    <p class="deep-intro">Different business model structures within this sector face systematically different conditions. The following describes which model characteristics tend to generate or destroy earnings margin under specific environments — without reference to specific companies as recommendations.</p>
    <div class="model-grid">
      <div class="model-card model-card-up">
        <div class="model-card-title">TENDS TO BENEFIT WHEN — Low-cost feedstock, no GIDC exposure, captive production</div>
        <div class="model-row"><span class="model-condition">Feedstock gas price advantage maintained</span>Producers receiving subsidised gas convert a lower input cost directly to margin; the advantage is largest when SNGPL rates rise for other users while subsidised rates remain fixed.</div><div class="model-row"><span class="model-condition">Agricultural demand surge (crop cycle)</span>Strong Kharif or Rabi seasons drive offtake volume; high sector inventory clearance raises dealer confidence and restores price discipline in the domestic market.</div><div class="model-row"><span class="model-condition">Urea import restriction</span>When government restricts imports, domestic producers can sustain prices near or at international parity; margins widen as the price floor rises with no corresponding input cost increase.</div><div class="model-row"><span class="model-condition">GIDC liability reversal or write-off</span>A court ruling that removes or significantly reduces the GIDC liability creates a one-time PAT boost for exposed producers without any operational change.</div>
      </div>
      <div class="model-card model-card-dn">
        <div class="model-card-title">TENDS TO FACE PRESSURE WHEN — High SNGPL feedstock cost, large GIDC liability, DAP trading exposure</div>
        <div class="model-row"><span class="model-condition">Gas price equalisation</span>Closes FFC's feedstock advantage permanently; simultaneously raises EFERT feedstock cost further if equalisation is at a rate above its current SNGPL tariff.</div><div class="model-row"><span class="model-condition">SNGPL curtailment in winter months</span>Production shortfall in a high-demand season creates inventory gaps that cannot be recovered; domestic price spikes may benefit surviving production but hurt unit volume.</div><div class="model-row"><span class="model-condition">International DAP price collapse</span>DAP import inventory purchased at high global prices and sold domestically into a falling market generates a direct quarterly loss from the trading book.</div><div class="model-row"><span class="model-condition">Kissan Card demand vacuum</span>The quarter following a large demand-scheme activation sees a demand collapse as pre-purchased inventory clears; high-cost producers with no scheme volume cannot recover fixed costs in this window.</div>
      </div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Structural Questions</h2>
    <p class="deep-intro">The major unresolved debates, policy uncertainties, and structural questions that will shape this sector over the next three to seven years. These are not predictions — they are the analytical dimensions that require active monitoring.</p>
    <div class="sq-list">
    <div class="sq-item">
      <div class="sq-q">Will feedstock gas prices ever be equalised across fertiliser manufacturers?</div>
      <div class="sq-context">This is the most consequential unresolved policy question in the sector. Gas price equalisation would fundamentally reorganise competitive dynamics — closing FFC's structural margin advantage and improving EFERT's cost position. Every government has faced pressure from both sides: FFC lobbying to maintain preferential pricing, IMF and reform advocates pushing for equalisation. The answer determines the entire sector's competitive structure over the next decade.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Is FATIMA's Ghazij/Shawal gas supply commercially certain?</div>
      <div class="sq-context">The December 2025 cabinet approval does not guarantee physical delivery on the committed timeline. Gas infrastructure projects in Pakistan have a history of delays between announcement and first flow. The earnings improvement embedded in market expectations for FATIMA depends on both the timeline and the actual volume and pressure at which gas is delivered to Fatimafert. Track quarterly cost data to validate whether the policy announcement is translating into operational reality.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Can Pakistan's fertiliser sector survive without gas curtailment as domestic gas supply declines?</div>
      <div class="sq-context">Pakistan's total gas supply is structurally declining. As fertiliser, power, and residential users compete for a shrinking pie, curtailment becomes increasingly probable in winter months. If fertiliser plants face 2–3 months of curtailment per year structurally, their effective capacity utilisation falls and per-unit fixed cost rises. This structural gas supply question has no near-term resolution and is the most important long-term earnings risk for urea producers.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">At what international urea price does Pakistan face sustained import competition?</div>
      <div class="sq-context">The government has historically restricted imports when domestic prices approach international parity. But if domestic production costs rise faster than international prices fall, the cost of restriction (subsidising an uncompetitive domestic industry) rises. The point at which import competition becomes politically easier than restriction is a function of both cost structures and agricultural policy — and it has not been tested at sustained low global urea prices.</div>
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
        <div class="dpeer-accent-bar" style="background:#6aad6a"></div>
        <div class="dpeer-ticker">FFC</div>
        <div class="dpeer-name">Fauji Fertilizer Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Low-cost structural advantage operator — captive Mari gas feedstock at administered low rates; the most predictable and stable earnings generator in the sector</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Stable macro + urea price discipline + high agricultural demand: FFC converts its feedstock cost advantage most fully when there are no extraordinary disruptors to the urea demand or price environment</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Gas price equalisation: the primary structural threat — if feedstock prices are equalised, FFC's primary competitive advantage disappears permanently; also hurt by sustained government demand schemes that create quarter distortions</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Margin-led — cost advantage per bag is the dominant earnings driver; FFC is not a volume-growth story but a margin-reliability story at stable production rates</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">EFERT — The analytical comparison between FFC and EFERT directly reveals the value of the feedstock cost advantage; in identical demand and price environments, FFC's margin exceeds EFERT's by the feedstock cost differential</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c8a96e"></div>
        <div class="dpeer-ticker">EFERT</div>
        <div class="dpeer-name">Engro Fertilizers Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Scale urea producer + DAP trader — largest urea capacity, integrated with Engro group, exposed to both urea fundamentals and DAP import trading margins</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Gas price equalisation + high DAP margins: EFERT's earnings would improve most under feedstock equalisation (removing FFC's advantage) combined with favourable DAP import margins</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">SNGPL gas curtailment + DAP price collapse: curtailment halts Enven plant production while DAP losses compound through the trading book — both happen simultaneously in difficult quarters</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led and margin-led — both urea production volume and DAP trading margins determine earnings; GIDC liability is the balance sheet wildcard</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">FFC — Comparison with FFC quantifies exactly what EFERT's feedstock disadvantage costs in earnings per quarter; the spread between their gross margins is the policy subsidy gap made visible</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#4fb88a"></div>
        <div class="dpeer-ticker">FATIMA</div>
        <div class="dpeer-name">Fatima Fertilizer Company</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Dual-product, gas-cost-improvement story — produces urea and CAN (calcium ammonium nitrate); earnings improvement thesis depends on Ghazij/Shawal cheap gas replacing expensive SNGPL</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Ghazij/Shawal first gas flow + high urea demand: the primary earnings catalyst is cheap feedstock gas arriving from MPCL; combined with strong agricultural demand, this could drive a step-change in margins</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">SNGPL curtailment + gas equalisation not extending to new sources: if cheap MPCL gas does not flow on schedule, FATIMA remains the highest-cost urea producer in the sector with no near-term margin improvement path</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Policy-led and balance-sheet-led — the Ghazij/Shawal gas delivery is the primary near-term earnings catalyst; FATIMA's debt structure means finance cost is also material</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">EFERT — Both are higher-cost urea producers relative to FFC; the comparison distinguishes EFERT's structural DAP trading exposure from FATIMA's singular dependence on the Ghazij/Shawal gas catalyst</span></div>
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
        <td><span class="pfinal-ticker">FFC</span></td>
        <td>Low-cost structural advantage operator</td>
        <td>Stable demand + feedstock advantage maintained + import restrictions</td>
        <td>Gas price equalisation + sustained demand-scheme distortions</td>
        <td>Lowest feedstock cost in sector (Mari gas)</td>
        <td>Policy-dependent advantage — CCOP decision can eliminate the moat</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">EFERT</span></td>
        <td>Scale urea + DAP trader</td>
        <td>Gas price equalisation + high DAP margins + strong Rabi/Kharif</td>
        <td>SNGPL curtailment + DAP price collapse + GIDC payment order</td>
        <td>Largest urea capacity, Engro group backing</td>
        <td>GIDC liability, SNGPL curtailment, DAP mark-to-market risk</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">FATIMA</span></td>
        <td>Dual-product gas-cost improvement story</td>
        <td>Ghazij/Shawal gas flow + high urea demand</td>
        <td>Cheap gas delayed + SNGPL curtailment + no margin improvement</td>
        <td>CAN product differentiation, potential lowest feedstock cost if gas flows</td>
        <td>Earnings entirely dependent on Ghazij/Shawal gas materialising on schedule</td>
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
      <div class="metric-name">NFDC Monthly Urea Offtake and Closing Inventory</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">National Fertilizer Development Centre data on total urea sold, produced, and held in inventory by all manufacturers</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The primary forward EPS indicator — high closing inventory suppresses pricing and dealer confidence; low inventory with high offtake indicates a tight supply environment and supports price stability</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Inventory can appear low because of production curtailment rather than demand strength — distinguish between inventory decline from high offtake vs from production shortfall by tracking offtake and production simultaneously</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">IRSA water availability (to understand whether high offtake reflects real crop demand or pre-buying before an expected scheme), SNGPL curtailment reports (to understand production-side movements)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Import Parity Gap (International Urea Price vs Domestic Ex-Factory Price)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The spread between international urea prices (import parity including freight and duties) and Pakistan domestic ex-factory price — determines the pricing ceiling for domestic producers</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">When the gap is positive (international is higher than domestic), domestic producers can sustain price increases; when the gap turns negative, import pressure or government import facilitation becomes likely</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">The gap can widen simply because international prices fall rather than because domestic prices are competitively strong; track both sides independently to understand direction of pressure</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Government import policy stance (is restriction currently in effect?) and RD (regulatory duty) rates on urea imports (to understand the effective cost of potential imports)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Sector Gas Curtailment Rate</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Actual gas supplied to fertiliser plants as a percentage of contracted or required volumes — measures the reliability of the production input</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Curtailment in a high-demand season directly reduces production volume and revenue; a 10% curtailment rate in a peak demand quarter can meaningfully reduce annual earnings</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Curtailment at one plant does not imply curtailment at all; SNGPL-dependent plants (EFERT Enven, Fatimafert) are more exposed than Mari-connected plants (FFC); aggregate figures hide this composition</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">NFDC production data (to verify whether lower output matches the curtailment level) and SNGPL system pressure reports (to understand whether curtailment is supply-driven or demand-management-driven)</span></div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">13 · Metrics Framework</div>
    <h2 class="deep-h2">Company-Level Metrics</h2>
    <p class="deep-intro">Firm-level metrics that matter most when reading quarterly results and annual filings. For each metric: what it measures, why it matters, when it misleads, and what to read alongside it.</p>
    <div class="metric-card">
      <div class="metric-name">Feedstock Gas Cost per MMbtu (Derived)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Gas cost of production divided by production volume — the primary input cost metric for urea manufacturers</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The single most important cost variable; determines the floor on which gross margin is built; FFC's structural advantage versus EFERT is entirely captured in this single metric</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Blending across different gas sources (when companies use both SNGPL and alternative supplies) can mask the cost of each component; track the blended rate alongside OGRA and SNGPL notified rates</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Urea gross margin per ton (to see how feedstock cost translates to margin) and competitor feedstock costs (to quantify the competitive advantage or disadvantage)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Urea Gross Margin per Ton (Derived from Segment Results)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Revenue from urea divided by urea volume sold, minus urea COGS divided by volume produced — the per-unit profitability of the core business</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The cleanest measure of whether the urea business is generating sustainable earnings; strips out DAP trading, financial income, and other non-core items</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Quarterly mix (proportion of scheme vs non-scheme sales) can distort the per-ton margin; scheme sales are often at government-set prices that differ from market prices</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">NFDC average ex-factory price (to validate the revenue per ton used in derivation) and feedstock cost per MMbtu (to understand the input cost component)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">GIDC Accrual vs Cash Payment (Balance Sheet Monitoring)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The cumulative GIDC liability accrued on the balance sheet versus the amount actually paid — the gap represents contingent cash outflow risk</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">A large GIDC liability that has not been paid in cash represents a potential sudden earnings and cash flow event when courts order settlement; monitoring the gap is essential for identifying balance sheet risk</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">GIDC reversal can inflate earnings without any operational improvement; if a court rules against the levy, a large provision reversal flows through the income statement as profit</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Court proceedings timeline (to assess probability of near-term cash settlement demand) and available cash/credit facilities (to assess whether settlement is feasible without equity dilution)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">DAP Import Margin (EFERT and FATIMA specific)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Revenue from DAP sales minus the landed cost of DAP imports — the trading margin on the phosphate import/resale business</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">A volatile, non-operational earnings source; positive DAP margin adds to earnings in quarters when international prices are falling (imports are cheap) and domestic prices are supported</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">DAP margin can reverse sharply within a single quarter if global prices spike after import purchases are made; a large import position combined with falling domestic prices is the most adverse scenario</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">International DAP price chart vs purchase dates (from management commentary on import timings) and domestic urea-DAP price ratio (high urea prices relative to DAP indicate farmer preference for urea over phosphate)</span></div>
    </div>
  </div>`,
  }
  ],
};

export default sector;

// data/sectors/monitoring.ts
// PSX Sector Intelligence — Monitoring Framework
// This module is a single-page document (no tabs) — served as embedded HTML.

import type { SectorData } from "./types";

// The monitoring framework is injected as a single-tab page
const sector: SectorData = {
  slug: "monitoring",
  name: "Monitoring Framework",
  volume: "PSX Sector Intelligence · Cross-Sector",
  subtitle: "A unified monitoring framework covering economic indicators, sector triggers, and signal tracking across all major PSX sectors.",
  accentColor: "#5b9bd5",
  stats: [
    { val: "7", lbl: "Sectors Covered" },
    { val: "13", lbl: "Tabs Per Module" },
    { val: "PSX", lbl: "Pakistan Stock Exchange" },
  ],
  tabs: [
    {
      id: "overview",
      label: "Monitoring Framework",
      content: `<div class="disclaimer-bar">
  Educational &amp; informational purposes only &nbsp;·&nbsp; No investment advice &nbsp;·&nbsp; No buy/sell/hold recommendations &nbsp;·&nbsp; Based on publicly available secondary sources
</div>

<div class="hero">
  <div class="hero-label">PSX Sector Intelligence Platform</div>
  <h1>Cross-Sector<br><em>Monitoring Framework</em></h1>
  <p class="hero-sub">Monthly datapoints, quarterly checkpoints, and non-recurring event triggers across all seven covered sectors. Each item explains in one line why it matters for earnings analysis.</p>
</div>

<div class="sector-nav">
  <button class="snav-btn active" style="--active-color:var(--og)" onclick="showSector('og',this)">Vol I · Oil &amp; Gas</button>
  <button class="snav-btn" style="--active-color:var(--ce)" onclick="showSector('ce',this)">Vol II · Cement</button>
  <button class="snav-btn" style="--active-color:var(--bk)" onclick="showSector('bk',this)">Vol III · Banking</button>
  <button class="snav-btn" style="--active-color:var(--fe)" onclick="showSector('fe',this)">Vol IV · Fertiliser</button>
  <button class="snav-btn" style="--active-color:var(--pw)" onclick="showSector('pw',this)">Vol V · Power / IPPs</button>
  <button class="snav-btn" style="--active-color:var(--au)" onclick="showSector('au',this)">Vol VI · Autos</button>
  <button class="snav-btn" style="--active-color:var(--tx)" onclick="showSector('tx',this)">Vol VII · Textiles</button>
</div>


<div id="sector-og" class="sector-content active">
  <div class="sector-header">
    <div>
      <div class="sector-vol">Volume I</div>
      <div class="sector-title" style="color:var(--og)">Oil & Gas E&P</div>
    </div>
    <div class="sector-companies">OGDC · MARI · PPL · POL</div>
  </div>
  <div class="monitor-body">

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--monthly)"></div>
        <span class="col-label label-monthly">Monthly Watchlist</span>
        <span class="col-cadence">~Monthly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">Brent / Arab Light crude price</div>
          <div class="watch-why">Indexed gas wellhead pricing and oil realisation move with international crude; track monthly average, not spot.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">PKR / USD daily rate</div>
          <div class="watch-why">The single strongest near-term EPS variable for all four companies; monthly average determines rupee translation of oil sales and FX gains.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SNGPL / SSGC payment releases</div>
          <div class="watch-why">Any government announcement of utility payments frees circular debt flow to E&P receivables — watch Finance Ministry and OGRA press releases.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">PPIS reserve data</div>
          <div class="watch-why">Pakistan Petroleum Information Service publishes semi-annual field-level reserve updates; reserve replacement ratio (RRR) determines long-term production baseline.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">PSX material disclosure filings</div>
          <div class="watch-why">Each company must disclose commercial discoveries to PSX; flow rate and reservoir type are the two most relevant datapoints in the announcement.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">OPEC+ production decisions</div>
          <div class="watch-why">Indirect signal for medium-term crude price trajectory; affects Pakistani crude realisation and gas pricing indexation over 3–6 month lag.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--quarterly)"></div>
        <span class="col-label label-quarterly">Quarterly Watchlist</span>
        <span class="col-cadence">~Quarterly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">Realised crude price (oil revenue ÷ oil volumes)</div>
          <div class="watch-why">Derive from quarterly results to track the actual price received vs Brent benchmark; discount or premium signals field-quality and contract terms.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Realised gas price (gas revenue ÷ gas MMbtu sold)</div>
          <div class="watch-why">Compare against OGRA-notified wellhead price to validate; below-notified realisation implies non-payment rather than price revision.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Production volumes — oil (bopd) and gas (MMscfd)</div>
          <div class="watch-why">Track separately; decline at one field can be masked by gains at another in aggregate figures. Compare quarter-on-quarter and year-on-year.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Receivables from gas utilities (balance sheet)</div>
          <div class="watch-why">Receivable growth relative to revenue indicates worsening payment collection; cash conversion ratio is more informative than absolute balance.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Exploration expense — seismic vs dry well write-offs</div>
          <div class="watch-why">Seismic costs signal future drilling; dry well charges are past failures. Distinguish the two in the expense note.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Effective tax rate (ETR) disaggregation</div>
          <div class="watch-why">Segregate super tax provisions from operational tax; ETR-driven EPS beats or misses should not be extrapolated into forward estimates.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Other Income breakdown</div>
          <div class="watch-why">Overdue-payment surcharge, FX gains, and interest income are each different in nature; surcharge income is circular-debt-dependent and non-recurring in character.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--event)"></div>
        <span class="col-label label-event">Event Timeline</span>
        <span class="col-cadence">Non-recurring</span>
      </div>
        <div class="watch-item">
          <div class="event-date">June (Annual)</div>
          <div class="watch-name">Federal Budget — super tax rate and depletion allowance</div>
          <div class="watch-why">Super tax changes have an immediate and large impact on PAT; depletion allowance treatment affects taxable income for all four companies.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Semi-annual (PPIS)</div>
          <div class="watch-name">Reserve data publication</div>
          <div class="watch-why">Any field-level reserve decline that exceeds production replacement triggers a long-term earnings revision; watch RRR below 1.0x.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable</div>
          <div class="watch-name">OGRA wellhead price notification</div>
          <div class="watch-why">Infrequent but high-impact; an upward revision immediately improves the revenue baseline for the affected company without any volume change.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable</div>
          <div class="watch-name">PSX commercial discovery disclosure</div>
          <div class="watch-why">Each commercial discovery triggers a reserve revision and production timeline; early flow rate data determines whether the well is material.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable</div>
          <div class="watch-name">Government circular debt resolution package</div>
          <div class="watch-why">Large payment packages to SNGPL/SSGC (like September 2025 Rs1.225T refinancing) unlock E&P receivables and create one-time cash inflows.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">OGDC programme</div>
          <div class="watch-name">Tight gas well results — Indus Basin 25-well programme</div>
          <div class="watch-why">Each OGDC well completion and initial flow rate reveals commercial viability; 10 successful wells would represent the sector largest near-term volume catalyst.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable</div>
          <div class="watch-name">New block awards (DGPC bidding rounds)</div>
          <div class="watch-why">Acreage additions signal the long-term production replacement pipeline; track DGPC website for bidding round schedules and subsequent awards.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable</div>
          <div class="watch-name">PKR devaluation event</div>
          <div class="watch-why">A sudden PKR depreciation creates an immediate and large rupee-translation gain on all USD-denominated oil revenues in the quarter it occurs.</div>
        </div>
    </div>

  </div>
</div>
<div id="sector-ce" class="sector-content">
  <div class="sector-header">
    <div>
      <div class="sector-vol">Volume II</div>
      <div class="sector-title" style="color:var(--ce)">Cement</div>
    </div>
    <div class="sector-companies">LUCK · BWCL · DGKC · KOHC · MLCF</div>
  </div>
  <div class="monitor-body">

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--monthly)"></div>
        <span class="col-label label-monthly">Monthly Watchlist</span>
        <span class="col-cadence">~Monthly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">APCMA dispatch data — total, zone (N/S), company</div>
          <div class="watch-why">Published ~10th of each month for the prior month; the primary leading indicator for quarterly revenue; North/South split reveals export vs domestic mix.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">APCMA export volumes — North/South split</div>
          <div class="watch-why">Southern export growth signals demand diversification when domestic market is weak; northern export gains are structural signal for Afghan route.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Afghan border status</div>
          <div class="watch-why">Any reports of Pak-Afghan border restrictions or trade disruptions directly affect northern producers coal cost and export optionality within days.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Richards Bay (RB) FOB coal price</div>
          <div class="watch-why">USD-denominated imported coal benchmark for BWCL and DGKC; PKR movement also affects rupee cost; track alongside coal futures for forward cost visibility.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Retail cement bag price (Rs/50kg) — North and South</div>
          <div class="watch-why">Published by industry and commodity portals; signal of current supply-demand balance and dealer-level pricing conditions; retention price lags retail price by dealer margin.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">PSDP disbursement data</div>
          <div class="watch-why">Ministry of Finance monthly releases; actual utilisation vs headline allocation is the relevant number — government infrastructure projects drive southern demand.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--quarterly)"></div>
        <span class="col-label label-quarterly">Quarterly Watchlist</span>
        <span class="col-cadence">~Quarterly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">Retention price (net revenue ÷ dispatches)</div>
          <div class="watch-why">Derive from quarterly results; the single most important revenue metric in cement analysis — more informative than retail bag price because it captures dealer and freight deductions.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Cost per ton (COGS ÷ dispatches)</div>
          <div class="watch-why">Tracks the combined impact of coal source mix, energy costs, and localisation; a structural decline in cost per ton indicates fuel mix improvement, not just volume leverage.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Capacity utilisation (dispatches ÷ installed capacity)</div>
          <div class="watch-why">Below 55%: limited pricing power. Above 65%: margin expansion conditions improving. Above 75%: pricing power has likely returned.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Finance cost — absolute level and as % of EBIT</div>
          <div class="watch-why">MLCF and DGKC are most sensitive; declining finance cost is the primary near-term earnings driver for both when it drops quarter-on-quarter.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Coal cost per ton — derive or track disclosures</div>
          <div class="watch-why">Signals fuel mix changes between quarters; a sudden cost drop indicates a shift toward Afghan or local coal; a spike signals reversion to imported RB coal.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Effective tax rate</div>
          <div class="watch-why">Distinguish ETR-driven EPS from operational margin improvement; KOHC 4QFY24 EPS spike was partly ETR-driven — do not extrapolate without checking the ETR note.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--event)"></div>
        <span class="col-label label-event">Event Timeline</span>
        <span class="col-cadence">Non-recurring</span>
      </div>
        <div class="watch-item">
          <div class="event-date">June (Annual)</div>
          <div class="watch-name">Federal Budget — super tax, WHR credits, coal import duties</div>
          <div class="watch-why">Super tax rate changes affect all producers equally; WHR/renewable investment credits affect KOHC and LUCK most; coal regulatory duty changes affect input cost.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">March–June (Seasonal)</div>
          <div class="watch-name">Construction season — peak domestic demand window</div>
          <div class="watch-why">Monthly APCMA data in this window sets the volume and retention price narrative for the full fiscal year; the most important three months of the annual data calendar.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Aug–Oct (Seasonal)</div>
          <div class="watch-name">Post-harvest rural construction pickup</div>
          <div class="watch-why">Agricultural income realisation drives housing activity in rural Punjab and KPK; signals northern demand recovery ahead of results.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">FY26 expected</div>
          <div class="watch-name">KOHC 30MW coal captive power plant commissioning</div>
          <div class="watch-why">Reduces KOHC electricity cost from Rs37–38 to Rs20–21/unit; a structural and permanent gross margin improvement that will be visible in the first full quarterly results post-commissioning.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing (DGKC)</div>
          <div class="watch-name">DGKC US low-alkali export — first shipment confirmation</div>
          <div class="watch-why">Validates the July 2024 announcement; first USD export revenue from a niche specialty product that no domestic peer currently addresses.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable</div>
          <div class="watch-name">Capacity announcements — greenfield or brownfield additions</div>
          <div class="watch-why">New capacity in an already-oversupplied market (54–61% utilisation) extends the pricing power recovery timeline; time from announcement to commissioning is 12–24 months.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable</div>
          <div class="watch-name">Afghan border closure or trade restriction</div>
          <div class="watch-why">Immediately removes Afghan coal supply for northern producers and Afghan export route for LUCK North plant; most acute impact on MLCF which has highest Afghan coal dependency.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing</div>
          <div class="watch-name">CPEC and major infrastructure project contract awards</div>
          <div class="watch-why">Large government project awards — particularly in southern Pakistan — can signal multi-quarter demand catalysts for southern producers and LUCK Karachi plant.</div>
        </div>
    </div>

  </div>
</div>
<div id="sector-bk" class="sector-content">
  <div class="sector-header">
    <div>
      <div class="sector-vol">Volume III</div>
      <div class="sector-title" style="color:var(--bk)">Banking</div>
    </div>
    <div class="sector-companies">HBL · UBL · MEBL · MCB · NBP</div>
  </div>
  <div class="monitor-body">

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--monthly)"></div>
        <span class="col-label label-monthly">Monthly Watchlist</span>
        <span class="col-cadence">~Monthly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">SBP Monetary Policy Committee (MPC) decision</div>
          <div class="watch-why">Single most impactful recurring event for banking sector NII; schedule is published in advance on the SBP website; each rate change immediately reprices the entire earning-asset base.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">KIBOR (3-month and 6-month fixings)</div>
          <div class="watch-why">Most bank asset pricing is KIBOR-referenced; tracks policy rate with a small lag; rising KIBOR = NIM expansion; falling KIBOR = NIM compression for the subsequent repricing window.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SBP banking sector aggregate data — deposits, advances, investments</div>
          <div class="watch-why">Published ~6–8 weeks after month-end; track ADR (Advance-to-Deposit Ratio) and IDR (Investment-to-Deposit Ratio) across the sector to assess structural lending vs investment positioning.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">CPI inflation data (PBS)</div>
          <div class="watch-why">Shapes SBP forward rate path; falling inflation opens room for further rate cuts, which signals the NIM compression ahead; rising inflation signals rate hold or hike risk.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">PIB auction results and cut-off yields</div>
          <div class="watch-why">Monthly government securities auctions show yields at which new PIBs are issued; signals the reinvestment rate banks will earn on maturing securities over the next 3–10 years.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SBP Islamic banking quarterly data</div>
          <div class="watch-why">Market share trends between full Islamic banks and conventional Islamic windows; the primary leading indicator for assessing MEBL deposit growth trajectory and competitive pressure.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--quarterly)"></div>
        <span class="col-label label-quarterly">Quarterly Watchlist</span>
        <span class="col-cadence">~Quarterly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">Net Interest Margin — NII ÷ average earning assets</div>
          <div class="watch-why">The primary structural profitability metric; a falling NIM in a rate-cut cycle is expected but the pace and floor matter for forward EPS calibration.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">NII vs non-interest income composition</div>
          <div class="watch-why">Capital gains from PIB sales are non-recurring; fee and commission income is recurring. A surge in non-interest income driven by PIB gains should not be extrapolated into the next quarter.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">CASA ratio — current and savings deposits ÷ total deposits</div>
          <div class="watch-why">High CASA = low funding cost = structural margin advantage; erosion of CASA toward term deposits signals rising funding cost pressure as depositors seek higher yields.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">ADR (Advances-to-Deposits Ratio) vs 50% threshold</div>
          <div class="watch-why">Banks below 50% face an additional tax on investment income; track end-of-quarter ADR to assess whether tactical lending (discounted short-term loans) is distorting credit quality data.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Effective tax rate (ETR) vs pre-tax profit</div>
          <div class="watch-why">Normalise PAT growth by holding ETR constant to isolate operational earnings momentum from tax-driven beats or misses; ETR has varied between 49% and 56% in recent quarters.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">NPL ratio and provisioning coverage</div>
          <div class="watch-why">Asset quality trends; rising NPLs in a falling rate cycle may reflect delayed recognition of stress during the high-rate period — track provisions relative to NPL additions.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">NBP exceptional charges — pension and litigation</div>
          <div class="watch-why">Supreme Court pension judgments have created large one-time charges; track whether new cases or actuarial revaluations are pending from management commentary and notes to accounts.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--event)"></div>
        <span class="col-label label-event">Event Timeline</span>
        <span class="col-cadence">Non-recurring</span>
      </div>
        <div class="watch-item">
          <div class="event-date">6–8× per year (MPC)</div>
          <div class="watch-name">SBP rate decision</div>
          <div class="watch-why">Each meeting can change or hold the policy rate; bank stocks typically gap on MPC day. The schedule is published on the SBP website in advance.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">June (Annual)</div>
          <div class="watch-name">Federal Budget — super tax, ADR tax threshold, minimum tax</div>
          <div class="watch-why">Super tax rate and ADR-linked tax provisions are set in the Finance Bill; immediate ETR implication for all listed banks from the date of royal assent.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing (Parliamentary)</div>
          <div class="watch-name">26th Constitutional Amendment — 2028 Islamic banking deadline</div>
          <div class="watch-why">Any court ruling, SBP circular, or parliamentary action on the conversion timeline directly affects competitive positioning between MEBL and conventional banks.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (SBP)</div>
          <div class="watch-name">SBP regulatory circular — savings rate floor, CAR, ADR/IDR thresholds</div>
          <div class="watch-why">Any new SBP circular affects all banks simultaneously; minimum profit rate on savings deposits, for example, sets a floor on CASA funding costs.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (Courts)</div>
          <div class="watch-name">Supreme Court or High Court ruling on banking sector (NBP pension)</div>
          <div class="watch-why">A single ruling can trigger a multi-Rs10B exceptional charge at NBP; track ongoing pension litigation and any actuarial revaluation orders.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (IMF)</div>
          <div class="watch-name">IMF programme review conclusions</div>
          <div class="watch-why">IMF conditions constrain fiscal borrowing and directly affect government securities volumes and yields that banks depend on for investment income.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">2028 mandate (Structural)</div>
          <div class="watch-name">Full Islamic banking conversion deadline</div>
          <div class="watch-why">The structural deadline that makes every conventional bank Islamic window strategy a near-term earnings and deposit-base question; MEBL is the primary structural beneficiary.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing (SBP)</div>
          <div class="watch-name">RAAST P2M integration milestones</div>
          <div class="watch-why">Digitisation of retail payments shifts transaction fee income toward banks with superior digital infrastructure; each SBP-mandated merchant integration deadline is a fee income inflection point.</div>
        </div>
    </div>

  </div>
</div>
<div id="sector-fe" class="sector-content">
  <div class="sector-header">
    <div>
      <div class="sector-vol">Volume IV</div>
      <div class="sector-title" style="color:var(--fe)">Fertiliser</div>
    </div>
    <div class="sector-companies">FFC · EFERT · FATIMA</div>
  </div>
  <div class="monitor-body">

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--monthly)"></div>
        <span class="col-label label-monthly">Monthly Watchlist</span>
        <span class="col-cadence">~Monthly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">NFDC monthly data — production, offtake, inventory, price</div>
          <div class="watch-why">National Fertilizer Development Centre; published mid-month for prior month; the primary forward indicator for quarterly EPS — sector closing inventory level is the most critical single figure.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Local cotton acreage and crop condition reports</div>
          <div class="watch-why">USDA, Pakistan Cotton Ginners Association, and provincial agriculture departments; cotton yield outlook sets Kharif urea demand expectations from April onward.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">IRSA canal water availability</div>
          <div class="watch-why">Indus River System Authority allocations; water availability drives irrigated crop area and therefore fertiliser demand; drought conditions are a leading negative demand indicator.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">International urea and DAP prices (Fertecon / ICIS / Bloomberg)</div>
          <div class="watch-why">Track import parity gap vs domestic ex-factory price; a gap above Rs2,000/bag creates meaningful import competition risk for EFERT; DAP price swings affect EFERT and FATIMA import inventory values.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SNGPL gas pressure and curtailment notices</div>
          <div class="watch-why">Any SNGPL curtailment notice — particularly November–February — signals near-term production disruption at EFERT Enven and Fatimafert; gas availability is the primary production risk in winter months.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SBP policy rate (LTFF rate implication)</div>
          <div class="watch-why">LTFF subsidised financing rate tracks policy rate; each 100bps rate cut saves large composites Rs50–100M+ annually in capex financing; directly affects FATIMA Ghazij/Shawal pipeline capex cost.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--quarterly)"></div>
        <span class="col-label label-quarterly">Quarterly Watchlist</span>
        <span class="col-cadence">~Quarterly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">Feedstock gas cost per mmbtu (derive from COGS and production volumes)</div>
          <div class="watch-why">The single most important cost metric; compare FFC Mari gas cost vs EFERT Envens SNGPL cost to track the structural advantage gap each quarter.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Urea offtake vs sector inventory level</div>
          <div class="watch-why">High sector inventory (above 700,000–800,000 tons) signals pricing pressure ahead; low inventory signals strong demand or production shortfall — both affect forward price expectations.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">DAP import volume and margin — EFERT and FATIMA</div>
          <div class="watch-why">Derive import/resale margin from DAP tonnes sold vs landed cost; a DAP margin collapse signals either global price decline or inventory markdown — both are non-operational earnings drivers.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">GIDC accrual vs cash payment</div>
          <div class="watch-why">Growing gap between GIDC expense accrued and cash paid increases settlement risk; EFERT absolute GIDC liability is the largest in the sector and the most closely tracked.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Ghazij/Shawal gas delivery progress at Fatimafert</div>
          <div class="watch-why">From Q1CY26 onward, track whether committed volumes are flowing; a sustained quarterly cost improvement in FATIMA financials validates the December 2025 policy announcement.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Sector utilisation rate (production ÷ nameplate capacity)</div>
          <div class="watch-why">Low utilisation signals gas curtailment or demand weakness; high utilisation signals a tight supply environment — both conditions have different implications for pricing and margin.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--event)"></div>
        <span class="col-label label-event">Event Timeline</span>
        <span class="col-cadence">Non-recurring</span>
      </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (Govt)</div>
          <div class="watch-name">Kissan Card activation or urea subsidy announcement</div>
          <div class="watch-why">Creates an immediate short-term demand spike followed by a demand vacuum; distorts quarterly offtake timing — Q1CY25 showed how sharply earnings can collapse in the post-scheme quarter.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Oct–Nov (Seasonal)</div>
          <div class="watch-name">Wheat Support Price announcement (Rabi setup)</div>
          <div class="watch-why">Higher support price signals stronger Rabi urea demand willingness from farmers; lower support price or delay signals demand weakness in the October–December planting window.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Apr–Jun (Seasonal)</div>
          <div class="watch-name">Kharif crop planting season — urea demand peak</div>
          <div class="watch-why">Cotton, rice, and sugarcane planting drives the highest quarterly urea offtake; NFDC data in April–June is the most important seasonal window for volume forecasting.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (OGRA/CCOP)</div>
          <div class="watch-name">OGRA gas price notification — SNGPL industrial rate</div>
          <div class="watch-why">Any OGRA notification changing SNGPL industrial gas rates directly impacts EFERT Enven and Fatimafert production cost; a 10% rate increase on Rs1,597/mmbtu base is a material cost event.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Highest impact event</div>
          <div class="watch-name">Gas price equalisation announcement</div>
          <div class="watch-why">Any government, court, or CCOP announcement on equalising feedstock gas prices is the highest-impact single event for FFC (negative) and EFERT (positive); monitor CCOP orders and Ministry of Energy releases.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (Courts)</div>
          <div class="watch-name">GIDC court order — settlement timeline or amount</div>
          <div class="watch-why">A High Court or Supreme Court ruling requiring full and immediate GIDC payment creates a large one-time cash outflow; EFERT and FATIMA are most exposed.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing (FATIMA)</div>
          <div class="watch-name">Ghazij/Shawal first-flow confirmation at Fatimafert</div>
          <div class="watch-why">Physical gas delivery confirmation from MPCL validates the December 2025 cabinet approval and triggers the cost reduction the market is anticipating.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Annual (June)</div>
          <div class="watch-name">Federal Budget — urea import policy, DLTL rates, agricultural tax</div>
          <div class="watch-why">Import restrictions tighten domestic supply and support prices; facilitation does the opposite. DLTL rebate changes affect margins on value-added exports.</div>
        </div>
    </div>

  </div>
</div>
<div id="sector-pw" class="sector-content">
  <div class="sector-header">
    <div>
      <div class="sector-vol">Volume V</div>
      <div class="sector-title" style="color:var(--pw)">Power / IPPs</div>
    </div>
    <div class="sector-companies">HUBC · KAPCO · NPL · NCPL</div>
  </div>
  <div class="monitor-body">

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--monthly)"></div>
        <span class="col-label label-monthly">Monthly Watchlist</span>
        <span class="col-cadence">~Monthly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">Circular debt stock (Ministry of Energy / CPPA-G)</div>
          <div class="watch-why">Monthly; track whether the debt stock is rebuilding post-September 2025 refinancing — any uptick above Rs500B signals the structural flow problem is reasserting before next year results.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">CPPA-G payment releases to IPPs</div>
          <div class="watch-why">When CPPA-G makes large bulk payments, IPPs receive cash inflows that spike the quarter they arrive; track payment announcements to anticipate which quarter absorbs the inflow.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">NEPRA electricity tariff notifications</div>
          <div class="watch-why">Tariff adjustments affect revenue flowing into CPPA-G from DISCOs; politically suppressed tariffs increase circular debt generation; upward revisions reduce it — both affect IPP cash flow timing.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">NTDC system capacity factor by plant type</div>
          <div class="watch-why">National power generation statistics; shows actual dispatch patterns by fuel type — HFO plant dispatch frequency is the leading operational indicator for NPL and NCPL quarterly earnings.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">KIBOR rate (SBP)</div>
          <div class="watch-why">Affects IPP financing costs during circular debt delays (overdraft at KIBOR+) and LPI accrual rate on overdue receivables; rate cuts reduce the cost of waiting for CPPA-G payments.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">HUBC Thar Energy construction milestones</div>
          <div class="watch-why">Track any press release or PSX disclosure on Thar Energy construction progress; commissioning date is the primary earnings growth catalyst for HUBC and the sector largest upcoming asset addition.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--quarterly)"></div>
        <span class="col-label label-quarterly">Quarterly Watchlist</span>
        <span class="col-cadence">~Quarterly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">CPP receipts vs CPP accrued — the collection rate</div>
          <div class="watch-why">Derive from CPPA-G payments received vs energy revenue accrued in the quarter; collection rate below 70% signals circular debt stress; above 90% signals normalisation.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">LPI (Late Payment Interest) accrued vs received</div>
          <div class="watch-why">LPI is earned on overdue receivables but is only cash when collected; track accrual vs receipt rate; large LPI accruals with low collection rates overstate reported earnings quality.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Borrowings and overdraft levels — short-term</div>
          <div class="watch-why">IPPs finance working capital via overdraft when CPPA-G delays payments; rising short-term borrowings indicate circular debt pressure; for NCPL specifically, overdraft as a share of assets is a solvency indicator.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Receivables aging — trade receivables age on balance sheet</div>
          <div class="watch-why">Growing absolute receivables signal payment delays; rapidly declining receivables signal a large payment release occurred — often visible before the formal announcement.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Dividend announcement and payout ratio</div>
          <div class="watch-why">IPP dividend decisions are the most direct management signal of confidence in receivables collection; dividend cut or deferral signals cash flow stress regardless of reported earnings.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">KAPCO dispatch volume under hybrid arrangement</div>
          <div class="watch-why">500MW hybrid T&P means KAPCO only earns energy income when dispatched; low dispatch = low energy payment despite high installed capacity. Compare dispatched MW to total 1,600MW to assess utilisation.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--event)"></div>
        <span class="col-label label-event">Event Timeline</span>
        <span class="col-cadence">Non-recurring</span>
      </div>
        <div class="watch-item">
          <div class="event-date">Highest impact event</div>
          <div class="watch-name">PPA renegotiation or termination announcement</div>
          <div class="watch-why">Unpredictable but most impactful; Hub plant termination at below-fair-value compensation was the defining event of FY24. Track Ministry of Energy and NEPRA orders continuously.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (Govt)</div>
          <div class="watch-name">Circular debt refinancing deal</div>
          <div class="watch-why">Large-scale settlements (like September 2025 Rs1.225T) create one-time large cash inflows for all listed IPPs; announced by Ministry of Finance and Ministry of Energy.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Each IMF review</div>
          <div class="watch-name">IMF programme review — circular debt milestones</div>
          <div class="watch-why">IMF reviews include assessment of circular debt and PPA renegotiation progress; review delays or missed conditions signal slower structural reform pace.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">NEPRA notifications</div>
          <div class="watch-name">CTBCM implementation milestones</div>
          <div class="watch-why">Each NEPRA notification toward market operationalisation changes the context for post-PPA revenue planning; progress or delay determines whether merchant operation becomes viable after 2027.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">2027 expiry (KAPCO)</div>
          <div class="watch-name">KAPCO PPA expiry — post-2027 revenue undefined</div>
          <div class="watch-why">The most important medium-term structural event in the sector; outcome (extension, merchant, partial retirement) will define KAPCO earnings trajectory beyond 2027.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">HUBC programme</div>
          <div class="watch-name">Thar Energy first-power / COD announcement</div>
          <div class="watch-why">Commercial operations declaration by Thar Energy triggers revenue recognition for HUBC most significant growth asset; watch for CPPA-G PPA certification alongside the COD announcement.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Annual (June)</div>
          <div class="watch-name">Federal Budget — return on equity treatment, WHT on dividends, fuel tax</div>
          <div class="watch-why">ROE guarantee mechanisms and withholding tax on IPP dividends are set or confirmed in the Finance Bill; changes affect cash distribution capacity.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing (HUBC)</div>
          <div class="watch-name">BYD Pakistan automotive sales data</div>
          <div class="watch-why">As a proxy for HUBC EV JV progress; initial EV sales volumes in Pakistan and any government EV policy announcements directly affect the strategic value of HUBC BYD stake.</div>
        </div>
    </div>

  </div>
</div>
<div id="sector-au" class="sector-content">
  <div class="sector-header">
    <div>
      <div class="sector-vol">Volume VI</div>
      <div class="sector-title" style="color:var(--au)">Autos</div>
    </div>
    <div class="sector-companies">PSMC · INDU · HCAR · ATLH · SAZEW</div>
  </div>
  <div class="monitor-body">

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--monthly)"></div>
        <span class="col-label label-monthly">Monthly Watchlist</span>
        <span class="col-cadence">~Monthly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">PAMA monthly sales — by company and model</div>
          <div class="watch-why">Published ~10th of each month; the primary real-time volume indicator for all assemblers; model-level data reveals demand mix shifts (e.g., Alto vs Yaris vs Civic vs HAVAL).</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SBP policy rate and KIBOR daily fixings</div>
          <div class="watch-why">Direct driver of auto financing EMIs; 60–70% of car purchases are financed at KIBOR-linked rates — each 100bps cut meaningfully expands the addressable buyer pool for PSMC, INDU, HCAR, and SAZEW.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">PKR / JPY exchange rate</div>
          <div class="watch-why">CKD kits for Toyota, Honda, and Suzuki are invoiced in JPY; daily tracking determines the monthly average cost differential that drives gross margin for INDU, PSMC, and HCAR.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Used car import volumes (FBR / customs data)</div>
          <div class="watch-why">Monthly customs data on used vehicle imports; any surge in sub-1300cc Japanese used car arrivals directly signals competitive pressure on PSMC Alto and INDU Yaris volumes.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SBP foreign exchange reserves level</div>
          <div class="watch-why">Early warning indicator for potential LC (letter of credit) restriction risk; reserves below USD 8–10B have historically preceded CKD import controls that halt production.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">ATLH motorcycle demand proxies — rural income, crop prices</div>
          <div class="watch-why">Rural income cycles (wheat and rice harvest timing, Gulf remittances) drive CD70 demand more than KIBOR; track PCGA cotton data and SBP remittance figures as leading ATLH volume signals.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--quarterly)"></div>
        <span class="col-label label-quarterly">Quarterly Watchlist</span>
        <span class="col-cadence">~Quarterly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">Gross margin % — derive from quarterly results</div>
          <div class="watch-why">The most important quarterly metric for car assemblers; directly reflects the combined effect of PKR/JPY rate, localisation improvement, and volume leverage on fixed costs.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Other Income — absolute level and YoY trend</div>
          <div class="watch-why">INDU and ATLH earned Rs3–5B+ annually in T-bill/money market returns during KIBOR 22%; track the quarterly decline as rates fall to 10.5% — normalisation is a predictable EPS headwind.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SAZEW three-wheeler volumes — quarterly segment disclosure</div>
          <div class="watch-why">Legacy rickshaw revenue is the earnings floor supporting HAVAL investment; segment decline signals a structural issue beyond just auto market weakness.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Localisation % disclosures by model (INDU)</div>
          <div class="watch-why">INDU Corolla Cross HEV localisation progress determines the rate at which the cost base shifts from JPY-priced to PKR-priced inputs — a gradual but structural margin improvement.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Booking backlog and waiting list duration</div>
          <div class="watch-why">Qualitative disclosure in management commentary; long waiting lists indicate full utilisation and pricing power; zero waiting lists indicate excess supply relative to demand.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">ATLH spare parts and engine oil revenue segment</div>
          <div class="watch-why">Recurring ancillary revenue with higher margins than vehicle sales; track as a % of total revenue to assess the quality of ATLH earnings mix vs pure motorcycle assemblers.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--event)"></div>
        <span class="col-label label-event">Event Timeline</span>
        <span class="col-cadence">Non-recurring</span>
      </div>
        <div class="watch-item">
          <div class="event-date">June (Annual)</div>
          <div class="watch-name">Finance Bill — WHT structure, GST, FED, EV/HEV duty concessions</div>
          <div class="watch-why">WHT changes directly affect consumer vehicle cost; EV/HEV duty concessions affect INDU Corolla Cross HEV and SAZEW HAVAL PHEV competitiveness vs imports.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (SRO)</div>
          <div class="watch-name">SRO issuance — tariff, LC, or import restriction</div>
          <div class="watch-why">Statutory Regulatory Orders can change tariff rates or LC procedures overnight without parliamentary process; any SRO affecting used car duties or CKD categories is immediately material.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (IMF)</div>
          <div class="watch-name">IMF review — CBU tariff liberalisation conditionality</div>
          <div class="watch-why">Any IMF condition requiring CBU duty reduction toward a 15% flat rate is the most structurally negative policy scenario for all car assemblers — track IMF review communications.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">2026 (AIDEP)</div>
          <div class="watch-name">AIDEP 2026-31 policy announcement</div>
          <div class="watch-why">Successor auto policy governs new-entrant concessions, localisation incentives, and EV/HEV framework for the next five years — shapes competitive dynamics for SAZEW, MG, KIA, and Hyundai Nishat.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (SBP)</div>
          <div class="watch-name">SBP Rs3M auto financing cap revision</div>
          <div class="watch-why">Current cap excludes all locally assembled vehicles (all exceed Rs3M); any upward revision to Rs5M would immediately expand the financed buyer pool and benefit all car assemblers.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Mar–Jun (Seasonal)</div>
          <div class="watch-name">Construction and pre-summer buying season</div>
          <div class="watch-why">The strongest quarter for car sales demand; PAMA data in this window sets the annual volume narrative and is the most watched seasonal period for all assemblers.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Jul–Sep (Seasonal)</div>
          <div class="watch-name">Post-Eid recovery period</div>
          <div class="watch-why">Eid typically creates a brief demand pause; post-Eid recovery pace in July–September sets the tone for the second half of the fiscal year.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing (INDU, SAZEW)</div>
          <div class="watch-name">New model launch announcements</div>
          <div class="watch-why">Each new model generates pent-up demand and booking queues; INDU HEV expansion and SAZEW PHEV variants are the two most closely followed launch pipelines.</div>
        </div>
    </div>

  </div>
</div>
<div id="sector-tx" class="sector-content">
  <div class="sector-header">
    <div>
      <div class="sector-vol">Volume VII</div>
      <div class="sector-title" style="color:var(--tx)">Textiles</div>
    </div>
    <div class="sector-companies">ILP · NML · GATM · KTML · SAPT</div>
  </div>
  <div class="monitor-body">

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--monthly)"></div>
        <span class="col-label label-monthly">Monthly Watchlist</span>
        <span class="col-cadence">~Monthly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">PBS textile export data — by HS category and destination</div>
          <div class="watch-why">Pakistan Bureau of Statistics; monthly export figures by HS 50–60 (commodity) vs HS 61–63 (value-added) reveal the structural shift toward or away from value-added; the primary demand indicator for exporters.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Local cotton price (Rs/maund) — PCGA</div>
          <div class="watch-why">Pakistan Cotton Ginners Association; compare vs New York Futures import parity to measure the EFS distortion cost on domestic cotton; divergence above Rs2,000/maund signals the distortion is acute.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">PKR / USD exchange rate</div>
          <div class="watch-why">Daily tracking; directly translates USD export revenue into rupees for ILP, NML, GATM, and SAPT — a 5% move materially changes quarterly reported earnings without any operational change.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SBP policy rate — LTFF/ERF rate implication</div>
          <div class="watch-why">LTFF subsidised financing tracks policy rate (~3% below); each 100bps rate cut saves NML, GATM, and KTML Rs50–200M+ annually in finaning charges; track the cumulative rate cut benefit across the leverage base.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">APTMA press releases and advocacy statements</div>
          <div class="watch-why">Leading indicator of sector-wide operating stress; APTMA statements on EFS distortion, mill closures, and energy tariffs typically precede financial impact by one to two quarters.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">SNGPL curtailment notices — winter months</div>
          <div class="watch-why">Any SNGPL gas curtailment notice (particularly November–February) signals near-term production disruption for NML and GATM captive power; energy availability is an operational risk in winter.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--quarterly)"></div>
        <span class="col-label label-quarterly">Quarterly Watchlist</span>
        <span class="col-cadence">~Quarterly</span>
      </div>
        <div class="watch-item">
          <div class="watch-name">Gross margin % — energy and cotton cost pass-through</div>
          <div class="watch-why">The primary quarterly metric; separates companies that have partially mitigated energy costs (GATM with 30MW solar, ILP with LEED efficiencies) from those fully exposed to grid electricity tariffs.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">Revenue mix — value-added (HS 61–63) as % of total export revenue</div>
          <div class="watch-why">A rising value-added share signals structural migration up the value chain; a falling share signals reversion to commodity yarn/greige fabric exports, which compresses both margin and DLTL eligibility.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">ILP segment utilisation — hosiery, denim, knitwear</div>
          <div class="watch-why">Track separately; hosiery utilisation (82% FY24), denim (88%), spinning (92%) reveal which segment is constraining revenue growth toward the $700M target.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">NML finance cost trajectory</div>
          <div class="watch-why">NML large debt base means each quarter finance cost line is a key earnings variable; track against LTFF rate changes to model the benefit of the rate cut cycle on the full-year earnings base.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">GATM "Ideas" retail revenue as % of total</div>
          <div class="watch-why">Proxy for Pakistani consumer discretionary health; if domestic retail share is rising, GATM earnings are partially insulated from Western buyer cycles — a positive structural mix shift.</div>
        </div>
        <div class="watch-item">
          <div class="watch-name">KTML: textile segment operating profit vs MLCF contribution</div>
          <div class="watch-why">Decompose the conglomerate to apply appropriate valuation; MLCF cement earnings affect KTML consolidated results independently of the textile business performance.</div>
        </div>
    </div>

    <div class="monitor-col">
      <div class="col-header">
        <div class="col-dot" style="background:var(--event)"></div>
        <span class="col-label label-event">Event Timeline</span>
        <span class="col-cadence">Non-recurring</span>
      </div>
        <div class="watch-item">
          <div class="event-date">Highest impact (FBR/Govt)</div>
          <div class="watch-name">EFS distortion resolution — zero-rating of local inputs</div>
          <div class="watch-why">Reinstating SRO 957(I)/2021 or equivalent would immediately restore domestic cotton economics for composite mills and halt the spinner closure wave; the single highest-priority policy event for the sector.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (Govt)</div>
          <div class="watch-name">RCET reinstatement — Regionally Competitive Energy Tariff</div>
          <div class="watch-why">Reducing industrial electricity from ~15.4 cents/kWh toward ~9 cents/kWh would add Rs15–20B annually to the sector collective earnings; the most structurally significant energy policy event.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Periodic (EU)</div>
          <div class="watch-name">EU GSP+ review outcome</div>
          <div class="watch-why">Any negative European Commission assessment could trigger suspension proceedings; GSP+ underpins Pakistan ~$3.67B EU textile export market and any threat to it is immediately and severely negative.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Oct–Feb (Seasonal)</div>
          <div class="watch-name">Winter order placement and delivery window — EU buyers</div>
          <div class="watch-why">European retailers place autumn-winter orders in Q4; order volume in this window determines H1 export revenue for home textile exporters (GATM, NML, SAPT) and garment exporters.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Mar–Jun (Seasonal)</div>
          <div class="watch-name">Spring-summer order execution window — US buyers</div>
          <div class="watch-why">US retailer spring-summer order fulfilment; ILP largest delivery window for Nike/H&M/Target; capacity utilisation data in this period is the most important quarterly signal for ILP revenue trajectory.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing (ILP)</div>
          <div class="watch-name">ILP Plant 6 commissioning + denim capacity milestone</div>
          <div class="watch-why">Each commissioning milestone adds capacity toward the $700M revenue target; track PSX disclosures and management quarterly guidance on timeline.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Unpredictable (US)</div>
          <div class="watch-name">US-Pakistan trade policy — preferential arrangement</div>
          <div class="watch-why">Any US tariff preference for Pakistani textiles would be immediately positive for ILP (largest US revenue base) and structurally change the export economics for the entire sector.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Ongoing (Bangladesh)</div>
          <div class="watch-name">Bangladesh political and operational stability</div>
          <div class="watch-why">Bangladesh normalisation removes the 2024 order diversion windfall; further instability extends the benefit — track Bangladesh Garment Manufacturers and Exporters Association (BGMEA) data.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Jun–Aug (Seasonal)</div>
          <div class="watch-name">Domestic cotton crop harvest — Kharif season</div>
          <div class="watch-why">Pakistan cotton harvest determines domestic supply for the spinning and weaving season; a poor harvest (as in FY25, −34% YoY) forces imports and triggers the EFS cost penalty on domestic buyers.</div>
        </div>
        <div class="watch-item">
          <div class="event-date">Annual (June)</div>
          <div class="watch-name">Federal Budget — DLTL rebates, WHT on exports, energy levy</div>
          <div class="watch-why">DLTL rate changes affect value-added exporter margins directly; any energy levy change on industrial gas or electricity affects all listed textile companies simultaneously.</div>
        </div>
    </div>

  </div>
</div>
<div class="footer">
  <div class="footer-note">PSX Sector Intelligence Platform · Monitoring Framework · All Seven Sectors</div>
  <div class="footer-note">Compiled March 2026 · Educational &amp; informational purposes only · No investment advice</div>
</div>

<script>
function showSector(id, btn) {
  document.querySelectorAll('.sector-content').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.snav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sector-' + id).classList.add('active');
  btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
</body>
</html>`,
    },
  ],
};

export default sector;

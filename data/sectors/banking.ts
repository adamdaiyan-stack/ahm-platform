// data/sectors/banking.ts
// Auto-generated from pakistan_banking_sector_module.html
// Content: 13 tabs of sector intelligence for the Banking sector.

import type { SectorData } from "./types";

const sector: SectorData = {
  slug: 'banking',
  name: 'Banking',
  volume: 'Sector Intelligence Module · Volume III',
  subtitle: 'A structured analytical framework covering how listed commercial banks generate earnings, what variables drive NII and profitability, and how HBL, UBL, MEBL, MCB, and NBP differ structurally.',
  accentColor: '#5b9bd5',
  stats: [
  { val: 'Rs594.6B', lbl: 'Listed Sector PAT CY2024 (+5% YoY)' },
  { val: 'Rs1.84T', lbl: 'Net Interest Income CY2024' },
  { val: '~53%', lbl: 'Effective Tax Rate 1Q2025' },
  { val: 'Rs30.78T', lbl: 'Total Deposits (Aug 2024)' },
  { val: '2028', lbl: 'Deadline: Full Islamic Banking Mandate' }
  ],
  tabs: [
  {
    id: 'overview',
    label: 'Overview',
    content: `<div class="section">
    <div class="section-label">01 · Sector Overview</div>
    <h2>What the Sector Does</h2>
    <p>Pakistan's commercial banking sector intermediates between depositors and borrowers — collecting deposits from households and businesses, deploying those funds into loans and government securities, and earning the spread between the two rates. Banks also generate non-interest income through transaction fees, trade finance, foreign exchange, and wealth management. The sector is regulated by the State Bank of Pakistan (SBP) and operates under the Banking Companies Ordinance, 1962.</p>
    <p>Pakistan's banking sector consists of approximately 34 scheduled banks including 20 private, 5 foreign, 5 public sector, and 4 specialized banks. Listed on PSX, there are 14 commercial banks in the KSE-100 banking index. The top five banks by PAT — MEBL, UBL, MCB, HBL, and NBP — collectively account for the large majority of sector profitability. The sector's defining structural feature in recent years has been its heavy reliance on government securities (MTBs and PIBs) rather than private sector lending — a pattern shaped by high real interest rates, low credit risk appetite, and the ADR tax architecture.</p>

    <div class="chain-wrap">
      <div class="chain-lbl">Banking Earnings Flow — Simplified P&amp;L Chain</div>
      <div class="chain">
        <div class="chain-node" style="border-top:2px solid var(--hbl);">
          <div class="cn-lbl">Deposit Gathering</div>
          <div class="cn-val">CASA + Term Deposits</div>
          <div class="cn-sub">Cost of funds — lower CASA ratio = higher funding cost</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--ubl);">
          <div class="cn-lbl">Fund Deployment</div>
          <div class="cn-val">Loans + Govt Securities</div>
          <div class="cn-sub">ADR = loans ÷ deposits; IDR = investments ÷ deposits</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--mebl);">
          <div class="cn-lbl">Net Interest Income</div>
          <div class="cn-val">Yield earned − Cost paid</div>
          <div class="cn-sub">NIM = NII ÷ avg earning assets; 70–75% of total income</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--mcb);">
          <div class="cn-lbl">Non-Interest Income</div>
          <div class="cn-val">Fees, FX, capital gains</div>
          <div class="cn-sub">25–30% of total income; grows with transaction volume</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--nbp);">
          <div class="cn-lbl">Operating Expenses</div>
          <div class="cn-val">Staff, admin, digital</div>
          <div class="cn-sub">Rising 25–30% YoY as banks invest in tech and branches</div>
        </div>
        <div class="chain-arr">→</div>
        <div class="chain-node" style="border-top:2px solid var(--accent4);">
          <div class="cn-lbl">Provisions + Tax</div>
          <div class="cn-val">Loan losses + ETR ~53%</div>
          <div class="cn-sub">High ETR is the primary sector-level earnings compressor</div>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    <h2>Why It Matters on PSX</h2>
    <ul class="bl">
      <li>Banking is the single largest sector by weight in the KSE-100 index — movements in major bank stocks drive index-level returns more than any other sector.</li>
      <li>Banks are the primary transmission mechanism for SBP monetary policy — rate cuts or hikes affect the entire sector's NII within one to two quarters.</li>
      <li>The Islamic banking transformation mandate (26th Constitutional Amendment, deadline 2028) is the most consequential structural shift in Pakistan's financial sector in decades — creating divergent earnings trajectories for conventional vs Islamic players.</li>
      <li>Banks are large dividend payers when ETR and provisioning allow — sector dividend income is a material component of institutional investor returns in Pakistan.</li>
      <li>SBP data transparency (monthly deposit, advances, and investment aggregates) makes banking one of the most data-trackable sectors on PSX.</li>
    </ul>

    <div class="divider"></div>
    <h2>Main Listed Players Covered</h2>
    <div class="bar-chart">
      <div class="bar-head">PAT Contribution — Top 5 Listed Banks (CY2024)</div>
      <div class="bar-row">
        <div class="bar-lbl">MEBL</div>
        <div class="bar-track"><div class="bar-fill" style="width:100%;background:var(--mebl);"></div></div>
        <div class="bar-val">Rs101.5B · ~17%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">UBL</div>
        <div class="bar-track"><div class="bar-fill" style="width:75%;background:var(--ubl);"></div></div>
        <div class="bar-val">Rs75.7B · ~13%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">MCB</div>
        <div class="bar-track"><div class="bar-fill" style="width:57%;background:var(--mcb);"></div></div>
        <div class="bar-val">Rs57.6B · ~10%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">HBL</div>
        <div class="bar-track"><div class="bar-fill" style="width:57%;background:var(--hbl);"></div></div>
        <div class="bar-val">Rs57.8B · ~10%</div>
      </div>
      <div class="bar-row">
        <div class="bar-lbl">NBP</div>
        <div class="bar-track"><div class="bar-fill" style="width:26%;background:var(--nbp);"></div></div>
        <div class="bar-val">Rs26.8B · ~5% (–50% YoY)</div>
      </div>
    </div>
    <p style="margin-top:10px;font-size:12.5px;">Sector total PAT (14 listed banks): Rs594.6B in CY2024 (+5% YoY). Other significant listed banks include ABL (Rs43–49B), Bank Alfalah (Rs39.9B), and Habib Metro (Rs24.6B).</p>
  </div>`,
  },
  {
    id: 'economics',
    label: 'Economics',
    content: `<div class="section">
    <div class="section-label">02 · How the Sector Makes Money</div>
    <h2>Revenue Model</h2>
    <p>Bank revenue has two primary streams: <strong style="color:var(--text)">Net Interest Income (NII)</strong> — the spread between interest or profit earned on assets (loans, government securities) and interest or profit paid on liabilities (deposits, borrowings) — and <strong style="color:var(--text)">Non-Interest Income (Non-II)</strong> — fees, trade finance commissions, FX income, and capital gains on securities.</p>
    <p>For most listed Pakistani banks, NII constitutes 70–75% of total income. The remaining 25–30% comes from non-interest income, which grew rapidly in recent periods as capital gains on PIBs (when rates declined and bond prices rose) supplemented the traditional fee base. Understanding which income stream is driving a given quarter's results is the most important analytical distinction in banking.</p>

    <h3>Conventional vs Islamic Revenue Mechanics</h3>
    <div class="two-col">
      <div class="col-card">
        <div class="col-head">
          <span class="col-dot" style="background:var(--hbl);"></span>
          Conventional Banking (Interest-Based)
        </div>
        <ul class="col-list">
          <li>Collects deposits at a stated interest rate (SBP policy rate-linked)</li>
          <li>Lends at a spread above the base rate (KIBOR + margin)</li>
          <li>Invests in MTBs/PIBs at government-set yields</li>
          <li>NIM = yield on earning assets minus cost of funds</li>
          <li>Rate cuts compress NIM as asset yields reprice faster than deposit costs in Pakistan's structure</li>
          <li>HBL, MCB, UBL (partially), NBP operate primarily under this model</li>
        </ul>
      </div>
      <div class="col-card">
        <div class="col-head">
          <span class="col-dot" style="background:var(--mebl);"></span>
          Islamic Banking (Profit-and-Loss Sharing)
        </div>
        <ul class="col-list">
          <li>Collects deposits under Mudarabah (profit-sharing) structures — depositors share in pool returns</li>
          <li>Finances customers via Murabaha (cost-plus sale), Ijarah (lease), Musharakah (partnership)</li>
          <li>Invests in Shariah-compliant government Sukuk (GIS) rather than conventional MTBs/PIBs</li>
          <li>Profit is distributed to depositors based on pool returns and weightage</li>
          <li>MEBL is the only full-fledged listed Islamic bank — holds ~35% of Pakistan's Islamic banking market</li>
          <li>26th Constitutional Amendment (2028 deadline) requires all banks to convert to Islamic model</li>
        </ul>
      </div>
    </div>

    <div class="divider"></div>
    <h2>Cost Structure</h2>
    <ul class="bl">
      <li><strong style="color:var(--text)">Cost of funds:</strong> Interest paid on deposits — the largest cost item. CASA-heavy banks (high current/savings account mix) pay lower rates and earn structurally better NIMs. MCB and MEBL have historically had among the highest CASA ratios in the sector.</li>
      <li><strong style="color:var(--text)">Operating expenses (opex):</strong> Staff costs, branch network, technology. Non-interest expenses grew 29% YoY to Rs1.09T in CY2024. Banks investing in digital transformation (HBL, UBL, MEBL) are running elevated opex. Cost-to-income ratio is the efficiency metric — lower is better.</li>
      <li><strong style="color:var(--text)">Provisions (ECL):</strong> Expected credit losses set aside against loan defaults. In periods of high interest rates, provisioning tends to rise as borrowers struggle with debt service. Conversely, provisioning reversals in good periods add to PAT.</li>
      <li><strong style="color:var(--text)">Effective tax rate (ETR):</strong> The largest compressor of banking sector PAT. ETR reached 53% in 1Q2025 — structurally above the standard 35% corporate rate due to super tax, additional ADR-linked taxes, and minimum tax provisions. Every percentage point of ETR change has a large PAT impact on Rs1T+ pre-tax income.</li>
    </ul>

    <div class="divider"></div>
    <h2>What Expands Earnings</h2>
    <ul class="bl">
      <li>Rising interest rates — widen NIM as asset yields reprice upward; banks with short-duration asset books and sticky CASA deposits benefit most</li>
      <li>PIB/MTB capital gains — when rates decline, bond prices rise; banks with large government securities portfolios book mark-to-market gains in non-interest income</li>
      <li>CASA growth — cheaper deposit mix reduces funding cost, expanding NIM without requiring higher rates</li>
      <li>ADR improvement — higher lending at policy-rate spread reduces the tax burden on investment income; also reflects real economic activity growth</li>
      <li>Non-interest income growth — fees, FX income, and trade finance commissions grow with economic activity and digital adoption</li>
      <li>Provisioning reversals — write-backs of prior credit loss provisions add directly to PAT in the period recognised</li>
      <li>Lower ETR — through legislative changes, tax credits, or shift in income mix</li>
    </ul>

    <h2>What Compresses Earnings</h2>
    <ul class="bl">
      <li>Rate cuts — compress NIM as earning asset yields fall; banks with large floating-rate loan books or short-tenor securities reprice downward most quickly; CY2025 rate cuts from 22% to 12% are the primary sector earnings headwind</li>
      <li>High ETR — sector ETR consistently above 50% is the largest structural drag; any upward revision compounds quickly on a Rs1T+ pre-tax base</li>
      <li>Rising opex — digital investment and wage inflation erode cost-to-income ratios; sector opex growing 25–30% YoY</li>
      <li>Credit provisioning spikes — economic stress or specific corporate defaults trigger large provision charges; NBP's Rs68B pension charge in 2024 is an example of a non-credit but analogous one-time PAT hit</li>
      <li>Deposit repricing lag failure — in rate-cut cycles, if deposit rates fall slower than asset yields, NIM compresses further than expected</li>
    </ul>

    <div class="note amber">NIM context: Pakistan's banking sector NIM is structurally influenced by the government's heavy borrowing from banks. IDR (investment-to-deposit ratio) averaged 85%+ in 2024 — meaning banks invest the large majority of deposits in government securities rather than private sector loans. This creates a sector that is highly correlated to government bond yields and SBP policy rate, not to private credit demand.</div>
  </div>`,
  },
  {
    id: 'variables',
    label: 'Variables',
    content: `<div class="section">
    <div class="section-label">03 · Key Variables to Track</div>
    <h2>Variables That Move Earnings</h2>
    <p>Directional impact noted when the variable moves in the stated direction. "↑ Positive" = increase is favourable for earnings.</p>

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
          <tr class="section-row"><td colspan="3">Interest Rate &amp; NIM</td></tr>
          <tr>
            <td class="vname">SBP Policy Rate</td>
            <td>The benchmark rate set by the State Bank of Pakistan at each Monetary Policy Committee (MPC) meeting. In Pakistan, most banking assets (loans, MTBs, reverse repos) reprice against KIBOR — which closely tracks the policy rate. Banks with large floating-rate loan books and short-tenor MTBs are most sensitive. The policy rate was cut from 22% (peak, May 2024) to 12% through mid-2025 — the dominant driver of NII compression in the current cycle. Rate cuts reduce both earning asset yields and funding costs, but asset yields typically reprice faster.</td>
            <td class="up">↑ Positive (for NII)</td>
          </tr>
          <tr>
            <td class="vname">CASA Ratio</td>
            <td>Current Account + Savings Account deposits as a percentage of total deposits. CASA deposits cost substantially less than term deposits — current accounts often pay nothing, savings accounts pay SBP-mandated minimum. Banks with higher CASA ratios have structurally lower cost of funds and therefore better NIM resilience. MCB Bank and MEBL have historically maintained among the highest CASA ratios in the listed sector (~80%+). A rising CASA ratio expands NIM regardless of rate direction.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">PIB Duration &amp; Repricing</td>
            <td>Pakistan Investment Bonds (PIBs) are fixed-rate government securities with 3, 5, 10, 15, or 20-year tenors. Banks that locked into high-yield PIBs during the peak rate era (CY2022–24) continue earning those elevated yields even as policy rates fall. When those PIBs mature and are reinvested at lower rates, NII contracts. Banks with longer PIB duration have a higher "NIM buffer" against rate cuts. Conversely, those PIBs rise in market value when rates decline — creating capital gains in non-interest income (but only if realised).</td>
            <td class="up">Longer duration = ↑ NIM buffer</td>
          </tr>
          <tr class="section-row"><td colspan="3">Lending &amp; Asset Quality</td></tr>
          <tr>
            <td class="vname">Advance-to-Deposit Ratio (ADR)</td>
            <td>Total advances (loans) divided by total deposits. The government imposes an additional tax on banks with ADR below 50% — a measure to push banks toward private sector lending. As of mid-2024, sector ADR was ~40%, well below the threshold. Banks scrambled to push ADR above 50% to avoid the tax — some reportedly offering loans at 3–4% (vs 14–15% KIBOR) in a compressed window. When ADR improves genuinely through economic credit growth, NIM improves and the ADR-linked tax burden falls. This is one of the most actively gamed variables in Pakistan banking.</td>
            <td class="up">ADR ↑ toward 50% = positive</td>
          </tr>
          <tr>
            <td class="vname">Non-Performing Loans (NPLs)</td>
            <td>Loans where principal or interest has not been paid for 90+ days. NPL ratio = NPLs ÷ gross advances. High NPLs require provision charges that reduce PAT directly. In Pakistan's current cycle, private sector credit growth has been subdued and asset quality broadly stable — but a resumption of credit growth as rates fall creates NPL monitoring risk. NBP carries historically elevated NPL ratios due to its government-directed legacy lending. Banks with tighter underwriting (MCB, MEBL) have consistently lower NPL ratios.</td>
            <td class="down">NPL ↑ = ↓ Negative</td>
          </tr>
          <tr>
            <td class="vname">Private Sector Credit Growth</td>
            <td>The pace of new lending to businesses and households. In Pakistan's high-rate era, private credit growth collapsed — car financing fell for 26 consecutive months through August 2024. As rates normalize, private credit growth should recover. Higher lending improves ADR, earns higher spreads than government securities, and diversifies revenue. Banks with stronger SME, consumer, and corporate lending franchises (HBL, UBL) benefit more when private credit recovers than pure government securities players.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr class="section-row"><td colspan="3">Tax &amp; Policy</td></tr>
          <tr>
            <td class="vname">Effective Tax Rate (ETR)</td>
            <td>The total tax burden as a percentage of pre-tax profit. Banking sector ETR has been structurally elevated — 49–56% in recent quarters — due to super tax (10%), ADR-linked additional tax, minimum tax provisions, and deferred tax adjustments. ETR reached 53% in 1Q2025. Every 1pp ETR change on ~Rs1.24T sector pre-tax profit equates to Rs12B+ in PAT impact. ETR is volatile quarter to quarter due to deferred tax timing and can mislead if not normalised. No Pakistani bank operates near the 35% standard corporate rate.</td>
            <td class="down">ETR ↓ = ↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Islamic Banking Transition Progress</td>
            <td>The 26th Constitutional Amendment mandates Pakistan's complete transition from interest-based to Islamic banking by 2028. Banks further along the Islamic conversion path (MEBL — already fully Islamic; UBL — converting KPK/Balochistan operations; Standard Chartered — planning full Islamic conversion) will face less transition risk and potentially capture the Islamic deposits market that other banks must abandon. This is a decade-long structural variable, not quarterly.</td>
            <td class="neutral">Structural — 2028 deadline</td>
          </tr>
          <tr>
            <td class="vname">Remittances &amp; FX Income</td>
            <td>Pakistan's worker remittances exceeded $35B (projected 2025) — a major source of foreign exchange flowing through banking channels. Banks with strong international corridors and exchange companies (HBL's international presence, UBL's FX operations) earn FX conversion spreads and handling fees. Remittance policy shifts (e.g., the SBP's MoU with Arab Monetary Fund to link RAAST and Buna systems) directly affect which banks capture this flow.</td>
            <td class="up">↑ Positive</td>
          </tr>
          <tr>
            <td class="vname">Capital Gains on Securities</td>
            <td>When interest rates decline, the market price of fixed-rate government bonds (PIBs) rises. Banks that hold PIBs in their Available-for-Sale (AFS) portfolio can realise gains by selling them — this shows in non-interest income. Capital gains can swing non-interest income by 50–100% quarter to quarter. In 1Q2025, non-interest income fell 28% QoQ partly due to lower capital gains. Understanding whether a non-interest income surge is fee-based (recurring) or capital-gains-based (non-recurring) is essential for earnings quality analysis.</td>
            <td class="up">Rate cuts ↑ = PIB gains positive</td>
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
    <p>Pakistan's banking sector is concentrated at the top and fragmented below. The five largest banks (by deposits or PAT) account for a substantial majority of sector assets, leaving the remaining ~29 smaller banks competing for a smaller share of deposits and lending. This concentration has been increasing as digital banking raises scale advantages and the Islamic banking transition rewards incumbents with established Shariah frameworks.</p>
    <ul class="bl">
      <li><strong style="color:var(--text)">Large private commercial banks (HBL, UBL, MCB, ABL):</strong> Compete across retail, corporate, SME, and trade finance. Network scale and digital investment drive competitive differentiation.</li>
      <li><strong style="color:var(--text)">Islamic banks (MEBL, BankIslami, Dubai Islamic Bank Pakistan):</strong> MEBL holds ~35% of Pakistan's Islamic banking market — a commanding lead. UBL and others are converting windows and operations to Islamic. By 2028, all banks must be Islamic by mandate.</li>
      <li><strong style="color:var(--text)">Public sector banks (NBP, The Bank of Punjab, Bank of Khyber):</strong> NBP is the largest state-owned commercial bank — handles government treasury operations as SBP agent, manages pension disbursements. Legacy credit quality and governance challenges differentiate them from private peers.</li>
      <li><strong style="color:var(--text)">Foreign banks (Standard Chartered, Deutsche Bank Pakistan):</strong> Focus on corporate and trade finance; small retail footprints. SCB committed to full Islamic conversion in 2024 — a signal of where the market is heading.</li>
    </ul>

    <div class="divider"></div>
    <h2>Pricing Power</h2>
    <p>Banks have meaningful pricing power on the lending side — loan pricing is generally KIBOR-referenced, and individual banks can apply differentiated spreads based on creditworthiness and relationship. On the deposit side, pricing is constrained by SBP's minimum profit rate on savings accounts (currently set to ensure banks do not underpay depositors). This floor limits banks from paying artificially low savings rates to widen NIM — a meaningful regulatory constraint on cost-of-funds management.</p>
    <p>In practice, CASA composition is the primary tool for managing funding costs: banks compete intensively for current accounts (zero-cost) and savings accounts (below-market) through branch network, digital channels, and service quality. MEBL's CASA strength is its most durable structural advantage — high CASA banks earn better NIMs in every rate environment.</p>

    <div class="divider"></div>
    <h2>Regulatory &amp; Policy Influence</h2>
    <ul class="bl">
      <li><strong style="color:var(--text)">SBP Monetary Policy Committee (MPC):</strong> Sets policy rate 6–8 times per year. The single most impactful event for banking sector NII. Rate changes translate to KIBOR shifts within days and begin repricing floating-rate assets immediately.</li>
      <li><strong style="color:var(--text)">ADR tax architecture:</strong> Banks with ADR below 50% face additional tax on investment income — originally imposed to force private-sector lending. ADR management has become a major strategic and quarterly-results variable for all listed banks.</li>
      <li><strong style="color:var(--text)">26th Constitutional Amendment (Islamic banking mandate, 2028):</strong> The most structurally significant long-term policy event. All interest-based banking must convert. Banks further behind on Islamic frameworks face transition risk; MEBL's first-mover position is an enduring competitive advantage.</li>
      <li><strong style="color:var(--text)">SBP capital adequacy requirements:</strong> Banks must maintain CAR (Capital Adequacy Ratio) above minimum thresholds (Basel III framework). Constrains dividend capacity when retained earnings are insufficient and limits aggressive lending growth.</li>
      <li><strong style="color:var(--text)">Digital payments regulation:</strong> SBP's RAAST P2M (person-to-merchant) payment system rollout, e-commerce integration mandate (March 2025 deadline), and exchange company regulations affect fee income, transaction volumes, and competitive positioning of digital-first banks.</li>
    </ul>

    <div class="divider"></div>
    <h2>Government Borrowing Dominance</h2>
    <p>Pakistan's banks are the primary creditors of the federal government. IDR (investments-to-deposits ratio) averaged 85%+ in 2024 — meaning for every Rs100 of deposits, Rs85+ was invested in government bonds rather than lent to private parties. This creates a banking sector that functions as a government debt intermediary, not a traditional financial intermediary driving private investment. When the government borrows less or rates fall, the equilibrium earnings power of the sector contracts. This is the structural context behind NIM compression concerns as rates normalise.</p>
  </div>`,
  },
  {
    id: 'companies',
    label: 'Companies',
    content: `<div class="section">
    <div class="section-label">05 · Company Profiles</div>
    <h2>Five Major Listed Banks</h2>
    <p>Figures drawn from CY2024 annual results, 1Q2025 quarterly results, and publicly available broker research. Verify against current filings.</p>

        <div class="company-grid">

      <div class="company-card card-hbl">
        <div class="company-ticker ticker-hbl">PSX: HBL</div>
        <div class="company-name">Habib Bank Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Pakistan's largest bank by assets (Rs6.1T) and branch network (1,700+ domestic + 55 international); commercial, retail, SME, corporate, and Islamic banking; majority-owned by AKFED.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Widest branch and ATM distribution of any listed bank; 55 international branches provide USD-denominated income and geographic diversification no domestic-only peer replicates.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> ETR of ~52%+ is among the highest in the sector, structurally compressing PAT relative to pre-tax income; large opex from managing 1,700+ branches.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Net Interest Income from large PKR asset base; international operations income (USD-denominated fees, trade finance, remittances); PIB/T-bill portfolio repricing as rates move.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> High ETR amplifies each percentage point of tax rate change on a large pre-tax income base; international credit quality adds a variable absent from purely domestic peers.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> 55 international branches generating USD income — the only listed bank with material overseas operations providing earnings diversification that is structurally unavailable to domestic-only peers.</li>
        </ul>
      </div>

      <div class="company-card card-ubl">
        <div class="company-ticker ticker-ubl">PSX: UBL</div>
        <div class="company-name">United Bank Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Second-largest listed bank by PAT (CY2024 Rs75.7B); commercial, retail, Islamic (UBL Ameen), and international banking; proactively converting KPK and Balochistan to full Islamic operations.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Highest dividend payout of listed banks (Rs44/share CY2024); 1Q2025 NII growth of 200% YoY — fastest repricing of the major banks. Most proactive Islamic banking conversion among large conventionals.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> 200% YoY NII growth is not sustainable — base effects will make 2026 comparisons challenging; Islamic conversion carries execution and customer retention risk.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> NII from PIB/lending portfolio repricing; dividend and fee income; Islamic window profit-sharing pools as conversion accelerates.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Rate normalisation compresses NII when PIB yields fall; ADR management; Islamic conversion pace and execution quality.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Rs44/share dividend — highest absolute payout of any listed bank in CY2024 — combined with the most accelerated Islamic conversion programme among large conventional banks.</li>
        </ul>
      </div>

      <div class="company-card card-mebl">
        <div class="company-ticker ticker-mebl">PSX: MEBL</div>
        <div class="company-name">Meezan Bank Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Pakistan's largest full-fledged Islamic bank (~35% Islamic banking market share); operates exclusively on Shariah-compliant structures (Mudarabah, Murabaha, Ijarah, Musharakah); no interest-based products.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> 35% Islamic banking market share built over 22 years — the structural primary beneficiary of the 26th Constitutional Amendment mandating complete Islamic banking by 2028.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> 1Q2025 PAT down 12% YoY — GIS (Govt Islamic Securities) yield compression as rates fall; Islamic product repricing dynamics differ from conventional banks and require separate modelling.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Profit-sharing ratios on Mudarabah pools; GIS and sukuk yields on investment portfolio; deposit growth into Islamic CASA as 2028 mandate drives conventional-to-Islamic conversion.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> GIS yield compression as SBP rates fall; execution risk of absorbing the conventional banking system's compulsory Islamic conversion mandate flow from 2028.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The only Pakistani bank that can absorb the 2028 Islamic banking mandate without a fundamental business model change — every other listed bank must adapt to what MEBL already does.</li>
        </ul>
      </div>

      <div class="company-card card-mcb">
        <div class="company-ticker ticker-mcb">PSX: MCB</div>
        <div class="company-name">MCB Bank Limited</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Nishat Group private bank (privatised 1991); commercial, retail, corporate, SME banking; wholly-owned Islamic subsidiary. One of Pakistan's two highest-CASA listed banks.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Consistently highest CASA ratio of any large listed private bank — a sticky low-cost deposit franchise built over three decades that structurally compresses funding costs below peers.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> CY2024 PAT slipped 2.8% to Rs63.47B — higher markup expenses and increased operational costs; fee income growth lagged more agile peers in the same period.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> CASA ratio and cost-of-funds (primary structural profitability differentiator); NII from the spread between cheap deposits and earning asset yields.</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Rate normalisation reduces the spread between zero-cost CASA deposits and earning assets; ADR pressure to increase lending as NIMs compress.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> Highest CASA ratio of any large listed private bank — a funding cost advantage that does not depend on the interest rate environment and compounds across every rate cycle.</li>
        </ul>
      </div>

      <div class="company-card card-nbp">
        <div class="company-ticker ticker-nbp">PSX: NBP</div>
        <div class="company-name">National Bank of Pakistan</div>
        <ul class="co-bullets">
          <li><span style="color:var(--text);font-weight:500;">Business model:</span> Government-owned commercial bank; SBP's fiscal agent for government treasury transactions; manages government salary, pension, and utility payments; commercial, retail, and Islamic banking.</li>
          <li><span style="color:var(--accent2);">Better than peers:</span> Handles government treasury and pension disbursements unavailable to private banks; Gold Loan portfolio exceeded Rs100B (June 2025) — a revenue stream no private peer operates at comparable scale.</li>
          <li><span style="color:var(--accent4);">Worse than peers:</span> CY2024 PAT fell 50.3% to Rs26.5B on an Rs68B extraordinary pension cost (Supreme Court ruling); NPL ratios and management quality historically trail private peers.</li>
          <li><span style="color:var(--accent3);">Main earnings driver:</span> Government treasury functions and commission income; pension lending; commercial NII; dividend reinstatement (Rs8/share CY2024 — first payout since 2016).</li>
          <li><span style="color:var(--accent4);">Main risk / sensitivity:</span> Pension liability execution risk from further Supreme Court rulings; NPL provisioning on legacy commercial book; government policy constraints limit balance sheet optimisation.</li>
          <li><span style="color:var(--accent);">Why distinct:</span> The only listed bank functioning as SBP's fiscal agent — managing government transactions and pension disbursements at a scale that is structurally protected from commercial competition.</li>
        </ul>
      </div>

    </div>
        <ul class="co-bullets">
          <li>Pakistan's largest bank by total assets and branch network (1,700+ branches, 55 international); established 1941 (Mumbai), privatised 2004; majority-owned by Aga Khan Fund for Economic Development (AKFED)</li>
          <li>CY2024: PAT flat at Rs57.8B despite Rs120B pre-tax profit — Rs62.5B tax drag reflects ETR ~52%; EPS Rs38, dividend Rs16.5/share</li>
          <li>H1 2025: Pre-tax profit Rs75.3B (+30% YoY); PAT Rs34.4B (+19% YoY) — outperformed sector on NII growth and international operations contribution</li>
          <li>International operations (Africa, Middle East, GCC) provide geographic diversification and USD-denominated income unavailable to purely domestic peers</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Largest branch and ATM network in Pakistan plus 55 international branches — the widest distribution moat of any listed bank. International operations provide diversified revenue and USD income that domestic-only peers cannot access.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Scale also means higher opex — managing 1,700+ branches is expensive. ETR of 52%+ is among the highest in the sector, structurally compressing PAT relative to pre-tax income. Flat CY2024 earnings despite strong pre-tax growth illustrate the tax burden.</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">International presence. HBL's overseas operations in Africa, the Middle East, and beyond generate USD-denominated fee, remittance, and trade finance income that creates earnings diversification no other listed Pakistani bank replicates at scale.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">SBP policy rate (NII repricing on large asset base) and ETR changes (large pre-tax income amplifies each point of ETR movement). International credit quality is an additional variable absent from purely domestic peers.</span></div>
        </div>
        <div class="tags">
          <span class="tag b">Largest Network</span>
          <span class="tag b">International Ops</span>
          <span class="tag">AKFED Owned</span>
          <span class="tag b">55 Overseas Branches</span>
        </div>
      </div>

      <!-- UBL -->
      <div class="company-card card-ubl">
        <div class="co-ticker t-ubl">PSX: UBL</div>
        <div class="co-name">United Bank Limited</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Market Cap</span><span class="co-meta-val">~$3.35B</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">CY2024 PAT</span><span class="co-meta-val">Rs75.7B (+34% YoY)</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">EPS</span><span class="co-meta-val">Rs61, Div Rs44/share</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">1Q2025 PAT</span><span class="co-meta-val">Rs36.1B (+124% YoY)</span></div>
        </div>
        <ul class="co-bullets">
          <li>Second most profitable listed bank in CY2024; market cap surged 6x in two years (from under $0.5B to $3.35B per Topline Securities) — the most dramatic market-cap re-rating in Pakistani banking</li>
          <li>CY2024: PAT Rs75.7B (+34% YoY); pre-tax profit Rs150B; taxes Rs74.3B; EPS Rs61; dividend Rs44/share (highest payout among listed banks)</li>
          <li>1Q2025: PAT Rs36.1B (+124% YoY) — sector-leading NII growth of 200% YoY; actively converting KPK and Balochistan operations to Islamic banking</li>
          <li>Digital banking is a stated strategic priority; launched UBL Ameen Islamic window with competitive profit-sharing rates; expanding exchange company operations for remittance capture</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Combination of high dividend payout (Rs44/share), strong PAT growth trajectory, and proactive Islamic banking conversion positions UBL as the bank most actively repositioning for the post-2028 landscape while simultaneously delivering near-term earnings growth.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">NII grew 200% YoY in 1Q2025 — a pace driven partly by repricing of the PIB/lending book that will not sustain as rates normalise. High base effects will make YoY NII comparisons challenging in 2026. Islamic conversion execution risk is non-trivial.</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">The combination of market-cap re-rating speed, dividend growth, and proactive Islamic conversion is unique. UBL's dividend of Rs44/share is the highest of any listed bank — a signal of confidence in cash generation that no peer matched in CY2024.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">SBP policy rate (large PIB portfolio and NII sensitivity). Islamic conversion pace and execution. ADR — UBL needs to manage the lending-investment mix to avoid ADR-related tax burden as rate normalization changes the investment return calculus.</span></div>
        </div>
        <div class="tags">
          <span class="tag g">Highest Dividend</span>
          <span class="tag g">Islamic Pivot</span>
          <span class="tag g">PAT +34% CY24</span>
          <span class="tag">6x Market Cap Growth</span>
        </div>
      </div>

      <!-- MEBL -->
      <div class="company-card card-mebl">
        <div class="co-ticker t-mebl">PSX: MEBL</div>
        <div class="co-name">Meezan Bank Limited</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Market Cap</span><span class="co-meta-val">~$2.52B</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">CY2024 PAT</span><span class="co-meta-val">Rs101.5B (record)</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">EPS</span><span class="co-meta-val">Rs57, Div Rs28/share</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Islamic Mkt Share</span><span class="co-meta-val">~35% of Islamic banking</span></div>
        </div>
        <ul class="co-bullets">
          <li>Pakistan's largest full-fledged Islamic bank — and in CY2024, the most profitable listed bank in Pakistan by a wide margin (Rs101.5B PAT vs Rs75.7B for second-placed UBL)</li>
          <li>Pre-tax profit Rs222B; taxes Rs121B (ETR ~54%); EPS Rs57; dividend Rs28; 940+ branches; Pakistan's first dedicated Islamic bank (licensed 2002)</li>
          <li>Holds ~35% of Pakistan's Islamic banking market — the largest share of any Islamic bank; serves as the structural beneficiary of the 2028 Islamic banking mandate driving conventional deposits toward Shariah-compliant channels</li>
          <li>1Q2025: PAT Rs22.4B (down 12% YoY) — reflects high base from CY2024 record quarter and early-stage NIM compression as the GIS (Govt Islamic Securities) yield environment adjusts with falling rates</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">35% Islamic banking market share is a moat built over 22 years of first-mover advantage, Shariah governance credibility, and product depth. As the 2028 Islamic mandate approaches, MEBL's brand is the natural destination for Islamic deposits — no conventional bank can replicate this overnight.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">CY2024's record PAT (Rs101.5B) set an extremely high comparison base — 1Q2025 PAT was already down 12% YoY. MEBL is more exposed than peers to compression in GIS yields as the rate cycle normalises, and its deposit base is highly rate-sensitive (competitive Islamic profit rates attract rate-seeking depositors who may shift).</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">The 2028 Islamic banking mandate. Every conventional bank must transition; MEBL has 22 years of head start. Its Shariah governance board, product suite, and depositor loyalty create a transition flywheel that will attract deposits and talent from converting conventional banks — a structural tailwind with no expiry date.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">GIS yield levels (Islamic equivalent of PIB yields) — MEBL's NII is directly exposed to Sukuk/GIS yields the way conventional banks are to MTB/PIB yields. Increasing competition as all conventional banks convert Islamic windows to full operations by 2028.</span></div>
        </div>
        <div class="tags">
          <span class="tag a">Most Profitable 2024</span>
          <span class="tag a">Islamic Leader</span>
          <span class="tag a">2028 Mandate Beneficiary</span>
          <span class="tag">Rs101.5B PAT Record</span>
        </div>
      </div>

      <!-- MCB -->
      <div class="company-card card-mcb">
        <div class="co-ticker t-mcb">PSX: MCB</div>
        <div class="co-name">MCB Bank Limited</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Market Cap</span><span class="co-meta-val">~$1.50B</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">CY2024 PAT</span><span class="co-meta-val">Rs57.6B (–3% YoY)</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">EPS</span><span class="co-meta-val">Rs48, Div Rs36/share</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">Fee Income</span><span class="co-meta-val">Rs24.78B (+10% YoY)</span></div>
        </div>
        <ul class="co-bullets">
          <li>Pakistan's third most profitable bank; oldest surviving bank (est. 1947); first privatized bank (1991); Nishat Group controlling stake; 1,100+ branches domestically and 8 overseas</li>
          <li>CY2024: PAT Rs57.6B (slight decline on higher taxes and opex); pre-tax Rs118.4B; EPS Rs48 (decline from Rs54.94); dividend Rs36; fee income +10% to Rs24.78B — among the stronger fee growth figures</li>
          <li>MCB is Pakistan's first bank to list GDRs on the London Stock Exchange (2006); first to incorporate a wholly owned Islamic subsidiary; known for conservative credit underwriting and consistently low NPL ratios</li>
          <li>Nishat Group linkage (MCB is part of the same group as DGKC, Nishat Power, Nishat Mills) provides cross-sector synergy but also concentration of group credit exposure risk</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Highest CASA ratios in the sector historically — MCB's low-cost deposit franchise is its most durable advantage. Conservative credit culture has produced consistently lower NPL ratios than peers, reducing provisioning volatility. Fee income growing at 10% YoY signals diversified revenue.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">EPS declined in CY2024 despite stable pre-tax income — higher taxes and opex are eroding PAT growth despite strong underlying operations. Nishat Group concentration creates credit exposure risk: group affiliate distress would flow through to MCB's loan book.</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">CASA quality and credit discipline. MCB's combination of high CASA ratio and consistently low NPLs creates the most stable NIM profile in the sector — not the highest NIM, but the most predictable and least volatile across cycles.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">CASA retention in a competitive Islamic savings rate environment (MEBL and Islamic windows competing for the same deposits). ETR movement on Rs118B+ pre-tax income is a direct PAT lever.</span></div>
        </div>
        <div class="tags">
          <span class="tag p">Nishat Group</span>
          <span class="tag p">High CASA</span>
          <span class="tag p">Low NPL</span>
          <span class="tag">Conservative Credit</span>
        </div>
      </div>

      <!-- NBP -->
      <div class="company-card card-nbp">
        <div class="co-ticker t-nbp">PSX: NBP</div>
        <div class="co-name">National Bank of Pakistan</div>
        <div class="co-meta">
          <div class="co-meta-cell"><span class="co-meta-lbl">Market Cap</span><span class="co-meta-val">~$1.30B</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">CY2024 PAT</span><span class="co-meta-val">Rs26.8B (–50% YoY)</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">EPS</span><span class="co-meta-val">Rs12 (from Rs24 prior year)</span></div>
          <div class="co-meta-cell"><span class="co-meta-lbl">1Q2025 NII growth</span><span class="co-meta-val">+139% YoY (sector-leading)</span></div>
        </div>
        <ul class="co-bullets">
          <li>State-owned bank (government majority shareholder); acts as SBP agent for government treasury; handles pension disbursements, utility bill collections, and government salary payments — functions no private bank replicates</li>
          <li>CY2024: PAT fell 50% to Rs26.8B from Rs53.3B — primarily due to Rs68B extraordinary charge related to Supreme Court judgment on pension liability settlement; dividend resumed at Rs8/share (first since 2016)</li>
          <li>1Q2025: PAT Rs22.1B — NII growth of 139% YoY (highest of the five), driven by PIB yield repricing and deposit growth; EPS and profitability rebounding post the one-time charge</li>
          <li>Historically high NPL ratios from legacy government-directed lending; operational inefficiencies from large workforce and legacy systems; however, improving asset quality under current management</li>
        </ul>
        <div class="co-4grid">
          <div><span class="co-4label lbl-str">Structural Strength</span><span class="co-4val">Government agency functions — treasury management, pension disbursement, government salary accounts — create a captive deposit base and fee income stream no private bank can replicate. Every government payroll, BISP payment, and utility collection flows through NBP's network in regions where private banks have no presence.</span></div>
          <div><span class="co-4label lbl-weak">Structural Weakness</span><span class="co-4val">Legacy credit portfolio with elevated NPLs from historical government-directed lending. Operational inefficiency — very large workforce relative to peer scale. Government ownership creates governance constraints and priority-lending mandates that reduce commercial discipline.</span></div>
          <div><span class="co-4label lbl-diff">Key Differentiator</span><span class="co-4val">Government treasury agent status is unique. NBP's role as the operational arm of SBP (for government transactions) creates deposit flows and fee income tied to the state's financial operations — an entirely different business mix from any private sector bank.</span></div>
          <div><span class="co-4label lbl-sens">Main Sensitivity</span><span class="co-4val">One-time exceptional charges (pension, court verdicts, provisioning reversals) create extreme quarter-level EPS volatility — normalised earnings are the only analytically meaningful basis. NII growth (139% in 1Q2025) is the genuine operational signal; headline PAT is distorted by exceptional items.</span></div>
        </div>
        <div class="tags">
          <span class="tag r">State-Owned</span>
          <span class="tag r">SBP Agent</span>
          <span class="tag">NII +139% 1Q25</span>
          <span class="tag r">Exceptional Item Risk</span>
        </div>
      </div>`,
  },
  {
    id: 'peers',
    label: 'Peers',
    content: `<div class="section">
    <div class="section-label">06 · Peer Comparison Grid</div>
    <h2>Cross-Company Comparison</h2>
    <p>Based on publicly available disclosures and broker research. Verify against current company filings.</p>

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
            <td><div class="co-badge b-hbl">HBL</div><br><span style="font-size:12px;">Habib Bank</span></td>
            <td>Largest network, international operations. Full-service commercial bank across retail, corporate, trade finance. AKFED-owned.</td>
            <td>1,700+ branches + 55 international. Only listed bank with material overseas operations generating USD income at scale.</td>
            <td>Scale brings high opex. ETR ~52% structurally compresses PAT below peers on a pre-tax-adjusted basis.</td>
            <td>SBP policy rate (large NII base). International credit quality and FX exposure. ETR on Rs120B+ pre-tax.</td>
            <td>International presence — Africa, Middle East, GCC — provides USD income and geographic diversification no other listed Pakistani bank offers at scale.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-ubl">UBL</div><br><span style="font-size:12px;">United Bank</span></td>
            <td>Full-service private bank actively converting to Islamic. Highest CY2024 dividend payer. Expanding digital and exchange company operations.</td>
            <td>Rs44/share dividend (highest listed bank). Proactive Islamic pivot. 1Q2025 NII growth 200% YoY — ahead of peers in repricing benefit.</td>
            <td>High base effect — CY2024 NII growth creates difficult YoY comparisons in 2025–26 as repricing normalises. Islamic conversion execution risk.</td>
            <td>PIB book repricing pace as rates normalize. Islamic conversion timeline. ADR tax optimization.</td>
            <td>The bank making the most aggressive simultaneous moves: highest dividend, fastest Islamic conversion, strongest 2024 PAT growth, largest market cap re-rating.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-mebl">MEBL</div><br><span style="font-size:12px;">Meezan Bank</span></td>
            <td>Pakistan's only listed full-fledged Islamic bank. 35% Islamic banking market share. Mudarabah-based deposit model; Murabaha/Ijarah financing.</td>
            <td>22-year Islamic first-mover advantage. Most profitable listed bank (CY2024). 2028 Islamic mandate is a structural tailwind with no expiry.</td>
            <td>CY2024 set an extremely high earnings base — 1Q2025 PAT already –12% YoY. Growing competition from converting conventional peers erodes exclusive positioning.</td>
            <td>GIS (Islamic govt securities) yield levels. Pace of conventional bank Islamic conversion creating deposit competition.</td>
            <td>2028 Islamic mandate structural beneficiary. The 26th Constitutional Amendment creates a regulatory tailwind that no other listed bank has a comparable position to exploit.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-mcb">MCB</div><br><span style="font-size:12px;">MCB Bank</span></td>
            <td>High-CASA private bank with conservative credit culture. Nishat Group affiliate. Strong fee income franchise. Pioneer of GDR listing and Islamic subsidiary.</td>
            <td>Highest and most stable CASA ratio in listed sector. Consistently lowest NPL ratio — minimising provisioning risk across cycles.</td>
            <td>CY2024 EPS declined despite stable pre-tax — higher taxes and opex eroding growth. Nishat Group concentration in lending creates correlated credit risk.</td>
            <td>CASA retention as Islamic banks attract savings-oriented depositors. ETR on Rs118B+ pre-tax income.</td>
            <td>CASA quality + credit discipline combination. MCB's NIM is not the highest but is the most stable — across rising and falling rate cycles, its cost-of-funds advantage persists.</td>
          </tr>
          <tr>
            <td><div class="co-badge b-nbp">NBP</div><br><span style="font-size:12px;">Nat. Bank of Pakistan</span></td>
            <td>State-owned bank and SBP treasury agent. Government salary/pension disbursements, utility collections. Legacy commercial banking alongside agency role.</td>
            <td>Government agency functions create captive deposit base in rural/government segments private banks cannot reach. NII rebounding strongly (1Q2025 +139% YoY).</td>
            <td>Exceptional charges (pension, court verdicts) create extreme quarterly PAT volatility. Legacy high NPL ratios from government-directed lending. Governance constraints of state ownership.</td>
            <td>One-time exceptional items — the dominant short-term PAT variable. Normalised NII trajectory (positive) vs headline PAT (volatile).</td>
            <td>SBP treasury agent function — the only bank that directly handles government payments at scale, creating a deposit and fee base entirely distinct from commercial banking competition.</td>
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
            <th>HBL</th>
            <th>UBL</th>
            <th>MEBL</th>
            <th>MCB</th>
            <th>NBP</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong style="color:var(--text)">CY2024 PAT</strong></td><td>Rs57.8B</td><td>Rs75.7B</td><td>Rs101.5B</td><td>Rs57.6B</td><td>Rs26.8B</td></tr>
          <tr><td><strong style="color:var(--text)">CY2024 EPS</strong></td><td>Rs38</td><td>Rs61</td><td>Rs57</td><td>Rs48</td><td>Rs12</td></tr>
          <tr><td><strong style="color:var(--text)">CY2024 Dividend</strong></td><td>Rs16.5</td><td>Rs44</td><td>Rs28</td><td>Rs36</td><td>Rs8</td></tr>
          <tr><td><strong style="color:var(--text)">Market Cap (~)</strong></td><td>$1.36B</td><td>$3.35B</td><td>$2.52B</td><td>$1.50B</td><td>$1.30B</td></tr>
          <tr><td><strong style="color:var(--text)">Model</strong></td><td>Conventional</td><td>Converting Islamic</td><td>Full Islamic</td><td>Conventional + Islamic sub</td><td>Conventional (state)</td></tr>
          <tr><td><strong style="color:var(--text)">CASA Strength</strong></td><td>Strong</td><td>Strong</td><td>Very strong</td><td>Highest (sector)</td><td>Moderate</td></tr>
          <tr><td><strong style="color:var(--text)">NPL Profile</strong></td><td>Moderate</td><td>Moderate</td><td>Low</td><td>Lowest (sector)</td><td>Elevated (legacy)</td></tr>
          <tr><td><strong style="color:var(--text)">International Ops</strong></td><td>Yes (material)</td><td>Limited</td><td>No</td><td>Limited</td><td>Limited</td></tr>
          <tr><td><strong style="color:var(--text)">ADR (approx)</strong></td><td>Below 50%</td><td>Below 50%</td><td>Below 50%</td><td>Below 50%</td><td>Below 50%</td></tr>
          <tr><td><strong style="color:var(--text)">Key 2028 Catalyst</strong></td><td>Islamic window scale-up</td><td>Full KPK/Balo conversion</td><td>Dominant market position</td><td>Islamic subsidiary growth</td><td>Agency function retention</td></tr>
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
        <div class="risk-name">NIM Compression from Rate Cuts</div>
        <div class="risk-desc">SBP cut the policy rate from 22% to 12% through mid-2025. Banks' earning asset yields are repricing downward while deposit costs fall more slowly — compressing NIM. Banks that locked into long-duration PIBs are partially protected during the transition, but as those bonds mature and are reinvested at lower yields, NIM compression accelerates. For every 100bps of rate cut, sector NII falls by several percentage points depending on asset book duration and CASA mix. This is the primary earnings risk for CY2025–26.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Elevated &amp; Unpredictable Effective Tax Rate</div>
        <div class="risk-desc">Banking sector ETR consistently runs at 49–56% — well above the 35% corporate standard rate — due to super tax, ADR-linked additional tax, and minimum tax provisions. ETR has been volatile quarter to quarter, swinging 5–10 percentage points based on deferred tax adjustments and legislative changes. On Rs1.24T+ sector pre-tax income, each 1pp ETR change is a Rs12B+ PAT swing. Any upward revision to the super tax rate or removal of tax credits would be an immediate sector-wide PAT compressor. The government's fiscal position creates ongoing risk of additional tax levies on banks.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">ADR Tax — Gaming vs Genuine Lending Growth</div>
        <div class="risk-desc">Banks with ADR below 50% face additional tax on investment income. As of mid-2024, sector ADR was ~40%. Banks have responded by making short-term loans at deeply subsidised rates (as low as 3–4%) to hit the threshold — distorting credit allocation without creating genuine economic lending. When the window closes, ADR may fall back. Genuine ADR improvement requires private credit demand recovery, which depends on economic growth and normalised borrowing rates. This creates a recurring end-of-year tactical lending scramble that obscures loan book quality trends.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Islamic Banking Transition Execution Risk</div>
        <div class="risk-desc">The 2028 Constitutional mandate for full Islamic banking is the largest structural change in Pakistan's financial history. Banks that move too slowly risk losing Islamic deposits to MEBL and other first movers; those that move too fast risk operational disruption and client attrition in their conventional books. Product conversion, Shariah board governance, systems reengineering, and staff retraining at scale have not been done before in Pakistan — the execution risk across the entire sector is systemic.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Rising Operating Expenses</div>
        <div class="risk-desc">Non-interest expenses grew 29% YoY to Rs1.09T in CY2024, driven by a 30% jump in operating expenses — wage inflation, digital investment, and branch network costs. Cost-to-income ratios are rising sector-wide. Banks that fail to demonstrate revenue growth outpacing opex growth will see PAT growth eroded despite strong NII. The digital banking buildout required for competitive positioning in the post-2028 landscape requires sustained opex investment with a long payback period.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Exceptional &amp; One-Time Charges (NBP-type Risk)</div>
        <div class="risk-desc">NBP's Rs68B pension charge in 2024 — triggered by a Supreme Court judgment — is an example of the legal and regulatory risk that state-linked or historically large banks carry. Any bank with legacy litigation, legacy employee benefit obligations, or large NPL legacy books is exposed to similar extraordinary charges. These are non-operational and must be stripped out for any meaningful trend analysis, but they create significant near-term PAT distortion and dividend uncertainty.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Government Borrowing Dominance &amp; Crowding Out</div>
        <div class="risk-desc">Banks deploying 85%+ of deposits into government securities (IDR 85%+ in 2024) are structurally dependent on the government's borrowing appetite and yields. If fiscal consolidation reduces government borrowing, or if yields compress faster than expected, sector income falls sharply. The alternative — more private sector lending — carries NPL risk in a developing economy with limited credit infrastructure. Pakistan's banking sector is effectively a leveraged play on government fiscal dynamics, not a traditional credit intermediary.</div>
      </div>
      <div class="risk-item">
        <div class="risk-name">Credit Quality Risk as Private Lending Recovers</div>
        <div class="risk-desc">As interest rates normalize and private sector credit recovers, banks will face NPL risk on new lending at scale for the first time in several years. The high-rate era of 22% rates suppressed private borrowing — banks did not lend much, so NPLs stayed contained. In the recovery, banks with weaker underwriting culture (those that rushed ADR lending at 3–4%) may carry under-screened loans that show NPL stress 12–18 months later. Banks with consistently tight credit standards (MCB, MEBL) are better positioned for this cycle.</div>
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
          <li><strong style="color:var(--text);">SBP Monetary Policy Committee (MPC) decisions</strong> — policy rate change or hold. Communicated via SBP press release; schedule published in advance. Immediate signal for sector NIM direction.</li>
          <li><strong style="color:var(--text);">SBP banking sector data (monthly)</strong> — aggregate deposits, advances, and investments by scheduled banks. Published ~6–8 weeks after month-end. Track ADR and IDR trends across the sector.</li>
          <li><strong style="color:var(--text);">KIBOR rate</strong> — 3-month and 6-month Karachi Interbank Offered Rate tracks policy rate with a small lag. Most banking asset pricing is KIBOR-referenced. Published daily by MUFAP/SBP.</li>
          <li><strong style="color:var(--text);">CPI inflation data</strong> — published monthly by PBS. Shapes SBP's forward rate path assessment; falling inflation creates room for further cuts, amplifying NIM compression risk.</li>
          <li><strong style="color:var(--text);">Pakistan Investment Bond (PIB) auction results</strong> — monthly government securities auctions show yields at which new PIBs are issued. Signal the reinvestment rate banks will earn on maturing securities.</li>
        </ul>
      </div>
      <div class="monitor-col">
        <div class="monitor-head">Quarterly</div>
        <ul class="monitor-list">
          <li><strong style="color:var(--text);">Bank financial results (quarterly)</strong> — key derivations: NIM (NII ÷ avg earning assets), cost-to-income ratio, ADR, ETR, NPL ratio, and provisioning cover. Distinguish between capital gains (non-recurring) and fee income (recurring) within non-interest income.</li>
          <li><strong style="color:var(--text);">NII vs non-interest income mix</strong> — a surge in non-interest income driven by PIB capital gains should not be extrapolated. Track each component separately to assess earnings quality.</li>
          <li><strong style="color:var(--text);">CASA ratio trends</strong> — if CASA is eroding as Islamic banks attract savings deposits, NIMs will compress for conventional banks even before rates move. Track total deposits and breakdown by type.</li>
          <li><strong style="color:var(--text);">ADR management</strong> — end-of-quarter ADR is the key threshold. Track whether loan growth is genuine (economically driven) or tactical (subsidised short-term lending to hit 50% threshold before deadline).</li>
          <li><strong style="color:var(--text);">ETR vs pre-tax profit</strong> — normalise PAT growth by holding ETR constant to understand operational earnings momentum vs tax-driven beats or misses.</li>
          <li><strong style="color:var(--text);">Islamic banking growth data (SBP quarterly report)</strong> — market share trends between full Islamic banks and conventional Islamic windows; relevant for assessing MEBL's competitive position.</li>
        </ul>
      </div>
      <div class="monitor-col">
        <div class="monitor-head">Event-Driven</div>
        <ul class="monitor-list">
          <li><strong style="color:var(--text);">MPC meeting outcomes</strong> — each rate change (or hold) creates an immediate market repricing of bank earnings expectations. Bank stocks often gap on MPC days.</li>
          <li><strong style="color:var(--text);">Federal Budget (June)</strong> — super tax rate, ADR tax thresholds, minimum tax provisions, and any new banking-sector-specific levies are set here. Immediate ETR implication for all listed banks.</li>
          <li><strong style="color:var(--text);">26th Amendment implementation progress</strong> — any government announcement, court ruling, or SBP circular on the 2028 Islamic banking conversion timeline directly affects the competitive dynamics between MEBL and conventional banks.</li>
          <li><strong style="color:var(--text);">SBP regulatory changes</strong> — minimum profit rate on savings accounts, capital adequacy requirements, ADR/IDR thresholds, and digital banking regulations. Any SBP circular affects all banks simultaneously.</li>
          <li><strong style="color:var(--text);">Exceptional charges &amp; court verdicts</strong> — particularly for NBP (pension litigation) and other state-linked banks. A Supreme Court judgment or pension actuarial revaluation can create a multi-Rs10B charge in a single quarter.</li>
          <li><strong style="color:var(--text);">IMF programme conditions</strong> — Pakistan's IMF programme constrains fiscal policy, government borrowing, and directly affects the government securities market (yields, volumes) that banks depend on for investment income.</li>
          <li><strong style="color:var(--text);">RAAST / digital payments milestones</strong> — SBP's e-commerce P2M integration deadlines and RAAST expansion signal the pace of digital payment adoption. Banks with stronger digital infrastructure capture more non-interest fee income as volumes shift.</li>
        </ul>
      </div>
    </div>

    <div class="divider"></div>
    <h2>Important Dates &amp; Timeline</h2>
    <div class="tl-item">
      <div class="tl-when">6–8× per year (MPC)</div>
      <div class="tl-what">SBP Monetary Policy Committee meetings — each meeting can change the policy rate or hold. Schedule published in advance on SBP website. Single most impactful recurring event for banking sector NII.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">~6–8 weeks lag monthly</div>
      <div class="tl-what">SBP banking sector aggregate data — monthly deposits, advances, and investments. Track ADR and IDR trends. Publication typically 6–8 weeks after month-end.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Feb / Mar</div>
      <div class="tl-what">CY4Q and full-year results — full-year EPS, dividend announcements, and guidance. Most consequential results period for dividend-oriented investors. ETR for the full year provides the cleanest read on tax dynamics.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Apr / May</div>
      <div class="tl-what">1Q results (Jan–Mar) — first quarter of the year; early read on whether the rate-cut NIM compression thesis is playing out as expected. CASA trends are visible. ADR position before year-end tactical lending.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Aug / Sep</div>
      <div class="tl-what">2Q and H1 results — the most-watched semi-annual reporting period. H1 PAT is the clearest signal of full-year earnings trajectory. Capital gains realisation (or lack thereof) from PIB portfolio is often visible in H1 non-interest income.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">Oct / Nov</div>
      <div class="tl-what">3Q and 9M results — by this point, ADR management for the year-end deadline is in full swing. Watch for any unusual lending growth or subsidised loan volumes that may reverse in Q4.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">June (Federal Budget)</div>
      <div class="tl-what">Annual budget — super tax rate, ADR tax thresholds, minimum tax changes, and any banking-sector-specific fiscal measures. Immediate ETR impact. The single largest annual policy event for the sector after MPC decisions.</div>
    </div>
    <div class="tl-item">
      <div class="tl-when">December 2028</div>
      <div class="tl-what">Constitutional deadline for full Islamic banking conversion for all Pakistani banks. The approach of this deadline will increasingly dominate strategic positioning, deposit flow analysis, and differential earnings between MEBL and peers in 2026–2028.</div>
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
        <div class="glo-term">Net Interest Income (NII)</div>
        <div class="glo-def">Interest earned on loans and government securities minus interest paid on deposits and borrowings. Pakistan's banking sector NII reached Rs1.84T in CY2024 (+9% YoY) — the primary income driver at 70–75% of total income. NII moves with the policy rate, CASA mix, and asset book duration. It should be tracked separately from non-interest income to assess earnings quality.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Net Interest Margin (NIM)</div>
        <div class="glo-def">NII divided by average earning assets — the efficiency of a bank's balance sheet in generating interest income. A bank with better NIM earns more per rupee of assets deployed. CASA-heavy banks (MCB, MEBL) maintain structurally higher NIMs because their funding cost is lower, not because they take more credit risk.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">CASA Ratio</div>
        <div class="glo-def">Current Account + Savings Account deposits as a percentage of total deposits. CASA deposits carry the lowest cost of funding — current accounts are typically zero-cost; savings accounts pay the SBP-mandated minimum rate. Higher CASA ratios mean lower average cost of funds, wider NIMs, and greater resilience when rates fall. MCB and MEBL have historically led the listed sector on CASA ratios.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">ADR (Advance-to-Deposit Ratio)</div>
        <div class="glo-def">Total advances (loans) divided by total deposits. Pakistan's government imposes an additional tax on banks with ADR below 50% to incentivise private-sector lending. Sector ADR was ~40% in mid-2024 — below the threshold. Banks have responded by tactical short-term lending at subsidised rates to hit 50% temporarily, creating ADR management as a recurring annual dynamic that distorts loan book quality assessments.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">IDR (Investment-to-Deposit Ratio)</div>
        <div class="glo-def">Total investments (primarily government securities — MTBs, PIBs) divided by total deposits. Pakistan's sector IDR averaged 85%+ in 2024 — meaning Rs85 of every Rs100 deposit was invested in government bonds rather than lent commercially. This reflects the government's heavy borrowing and banks' preference for risk-free returns at high yields during the peak rate era.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">PIB (Pakistan Investment Bond)</div>
        <div class="glo-def">Fixed-rate government bonds with tenors of 3, 5, 10, 15, or 20 years. The primary long-term government borrowing instrument in Pakistan. Banks holding PIBs issued during the high-rate era (2022–24) earn elevated yields until maturity — this is the "PIB duration buffer" that protects NIM in falling rate cycles. When rates fall, PIB prices rise — banks can realise capital gains if they sell PIBs before maturity.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">MTB (Market Treasury Bill)</div>
        <div class="glo-def">Short-term government discount instruments issued at 3, 6, or 12-month tenors. MTBs reprice at each auction — they are the floating-rate portion of a bank's government securities book. Banks with large MTB portfolios reprice faster in both directions when rates change. MTBs are the main instrument through which SBP controls short-term interest rates.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">GIS (Government Ijarah Sukuk)</div>
        <div class="glo-def">Shariah-compliant government securities — the Islamic equivalent of PIBs for Islamic banks and windows. GIS are structured as lease-based instruments where the government leases public assets to investors. MEBL deploys its investments in GIS rather than conventional PIBs. GIS yields track PIB yields but carry the Shariah compliance that full Islamic banks require.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Mudarabah</div>
        <div class="glo-def">An Islamic profit-and-loss sharing contract. The depositor (Rabb-ul-Maal) provides capital; the bank (Mudarib) manages it and earns a share of profits. Losses are borne by the depositor. This is the primary structure for Islamic savings and deposit accounts. Profit distribution is based on a weightage system — higher balances or longer tenors typically receive higher weightages. MEBL's entire deposit base operates under this or similar Shariah-compliant contracts.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">Murabaha</div>
        <div class="glo-def">An Islamic trade finance structure where the bank buys an asset and resells it to the customer at a pre-agreed markup. The markup (not "interest") is disclosed upfront and fixed — making it Shariah-compliant. Murabaha is one of the most widely used Islamic financing modes in Pakistan, used for working capital, trade finance, and consumer purchases. The profit rate effectively functions similarly to a loan interest rate in economic terms.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">KIBOR</div>
        <div class="glo-def">Karachi Interbank Offered Rate — the benchmark lending rate between banks in Pakistan, set daily for various tenors (1-week, 1-month, 3-month, 6-month). Most commercial loans in Pakistan are priced at KIBOR plus a spread. KIBOR closely tracks the SBP policy rate. A 100bps policy rate cut typically translates to a near-equivalent KIBOR decline within days, immediately reducing earning asset yields for floating-rate loan portfolios.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">ETR (Effective Tax Rate)</div>
        <div class="glo-def">Total tax paid divided by pre-tax profit — the actual tax burden expressed as a percentage. Pakistan's banking sector ETR runs at 49–56%, far above the 35% standard corporate rate, due to super tax (10%), ADR-linked additional tax, and minimum tax provisions. ETR swings quarter to quarter by 5–10pp due to deferred tax movements and provisions. A quarter's PAT surge should be checked against ETR to ensure it reflects operational improvement rather than a one-time tax benefit.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">26th Constitutional Amendment</div>
        <div class="glo-def">Pakistan's constitutional amendment mandating complete conversion from interest-based banking to Islamic banking by 2028. All scheduled commercial banks must operate under Shariah-compliant frameworks by the deadline. This is the most consequential structural policy change in Pakistan's banking history — it will reshape deposit flows, product offerings, regulatory frameworks, and competitive positions across the entire sector. MEBL, as the only fully Islamic listed bank, is structurally positioned to benefit from this transition.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">NPL (Non-Performing Loan)</div>
        <div class="glo-def">A loan where principal or interest payments are 90+ days overdue. NPL ratio = NPLs ÷ gross advances. High NPL ratios require provision charges against earnings. Pakistan's banking sector has historically had elevated NPLs due to government-directed lending (NBP) and SME credit infrastructure limitations. MCB and MEBL have maintained the sector's lowest NPL ratios through conservative underwriting discipline.</div>
      </div>
      <div class="glo-item">
        <div class="glo-term">RAAST</div>
        <div class="glo-def">Pakistan's SBP-built instant payment system — the national real-time retail payment infrastructure. RAAST enables instant person-to-person (P2P) and person-to-merchant (P2M) transfers. The SBP mandated all e-commerce stores to integrate RAAST P2M by March 2025. RAAST expansion directly affects which banks capture digital transaction fee income as Pakistan's economy digitalises. Banks with stronger RAAST integration and digital banking stacks (UBL, HBL) are positioned to benefit from rising digital payment volumes.</div>
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
        <div class="exec-text"><strong>Sector identity.</strong> Pakistan's commercial banking sector functions primarily as a government debt intermediary — with IDR at 85%+ in 2024, banks deploy most deposits into government securities rather than private loans. This makes the sector a leveraged play on government bond yields and SBP monetary policy rather than a traditional credit cycle story. 14 listed banks generated Rs594.6B in combined PAT in CY2024; the top five (MEBL, UBL, MCB, HBL, NBP) account for ~50–55% of that. The sector's defining structural event over the next three years is the 2028 Islamic banking conversion mandate.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">02</div>
        <div class="exec-text"><strong>Core economics.</strong> Banks earn NII (70–75% of income) from the spread between earning asset yields (KIBOR-referenced loans, MTB/PIB yields) and funding costs (CASA + term deposits). Non-interest income (25–30%) includes fees, FX spreads, and capital gains on government securities. ETR at 49–56% is the largest structural earnings compressor — making the gap between pre-tax and post-tax profit far wider in Pakistan banking than in most sectors. CASA ratio is the most durable determinant of NIM quality: high-CASA banks earn better margins in every rate environment.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">03</div>
        <div class="exec-text"><strong>Major variables.</strong> In order of earnings impact: (1) SBP policy rate — NII repricing on the entire balance sheet within one to two quarters; (2) ETR — each 1pp change on Rs1.24T+ pre-tax income equals Rs12B+ in PAT; (3) PIB/GIS duration and reinvestment rate — the buffer or acceleration of NIM compression; (4) CASA ratio maintenance — as Islamic banks attract savings deposits, conventional banks face funding cost pressure; (5) ADR management — the recurring year-end tactical lending dynamic. Capital gains on securities are material but non-recurring and should not be extrapolated.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">04</div>
        <div class="exec-text"><strong>Major risks.</strong> NIM compression from rate normalisation (policy rate cut from 22% to 12% through mid-2025) is the primary cyclical earnings headwind for CY2025–26. The ADR tax architecture creates distorted lending behaviour that obscures true credit quality. Rising opex (29% YoY in CY2024) is a structural cost drag. ETR unpredictability creates quarter-level PAT volatility. Islamic banking conversion execution risk is systemic — every bank must transform operations, products, and systems by 2028. For NBP specifically, exceptional charges (pension, litigation) can compress any given quarter's PAT irrespective of operational performance.</div>
      </div>
      <div class="exec-item">
        <div class="exec-num">05</div>
        <div class="exec-text"><strong>What makes leading companies different.</strong> <strong>MEBL</strong>: 22-year Islamic first-mover advantage + Rs101.5B CY2024 PAT record + 35% Islamic market share — and the 2028 mandate creates a structural tailwind with no comparable parallel. <strong>UBL</strong>: most aggressive Islamic pivot among conventional banks + highest dividend (Rs44/share CY2024) + 6x market-cap re-rating in two years — the bank repositioning fastest for post-2028. <strong>MCB</strong>: highest CASA ratio + lowest NPL ratio in listed sector — most stable NIM and least provisioning risk across cycles. <strong>HBL</strong>: only listed bank with material international operations generating USD income at scale. <strong>NBP</strong>: government treasury agency functions create an entirely different deposit and revenue base — government payrolls, pensions, and utility collections that private banks cannot access.</div>
      </div>
    </div>

    <div class="note warn" style="margin-top:24px;">This module is based on publicly available secondary sources including company financial disclosures (PSX filings), SBP banking sector data, broker research (Topline Securities, AKD Research, JS Global), and industry publications (Business Recorder, Profit Pakistan Today, Mettis Global). It does not constitute investment advice. No buy, sell, or hold recommendations are made or implied. Figures should be verified against current company filings before use.</div>
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
        <div class="miss-title">Banks Make More Money When They Lend Less</div>
        <div class="miss-body">During Pakistan's high-rate cycle (2022–2024), listed banks significantly increased their Government Securities (PIB) portfolios and reduced private sector lending. This was rational: risk-free government bonds yielding 20–22% were more attractive than commercial loans at equivalent or lower risk-adjusted returns. The paradox is that banking sector PAT surged during a period of economic slowdown when private credit growth was near zero. Banks optimised by not doing what their conventional purpose implies. Understanding this PIB vs ADR dynamic is essential for reading Pakistani bank results.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">02 ·</div>
        <div class="miss-title">ETR of 50%+ Caps PAT Growth Disproportionately</div>
        <div class="miss-body">Pakistan's banks face an effective tax rate of 49–56% — among the highest for any listed sector. This includes the corporate tax rate, the super tax (10% from FY23), a minimum tax regime, and additional tax on income where ADR is below 50%. The result is that pre-tax profit growth of 20% translates to PAT growth of significantly less after ETR. Analysts who apply equity market valuations to pre-tax earnings comparisons without adjusting for this ETR structure systematically overestimate PAT growth potential.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">03 ·</div>
        <div class="miss-title">NIM Compresses Faster in Rate-Cut Cycles Than It Expanded</div>
        <div class="miss-body">When rates rise, banks reprice lending assets upward — but fixed-rate deposits, PIB holdings at locked yields, and CASA deposits create a lag that temporarily expands NIM. When rates fall, the reverse is asymmetric: KIBOR-linked loans reprice immediately downward, but the bank's PIB book (fixed-rate instruments) reprices only as they mature. However, the CASA rate floor and competition for deposits can push funding costs up even as earning-asset yields fall. The net effect is that NIM compression in the rate-cut cycle is faster than expansion was in the rate-rise cycle.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">04 ·</div>
        <div class="miss-title">PIB Capital Gains Are Non-Recurring and Should Not Be Modelled Forward</div>
        <div class="miss-body">When interest rates fall, the mark-to-market value of existing fixed-rate PIBs rises. Banks that sell these securities realise capital gains — which flow through non-interest income and inflate quarterly PAT. These gains are one-time events tied to the rate cycle position, not repeatable business income. They appear in non-interest income but are not fee income, not recurring, and will not be present in subsequent quarters at the same rate. Multiple quarters of apparent income growth can be almost entirely explained by this one item if the rate cycle timing aligns.</div>
      </div>
      <div class="miss-item">
        <div class="miss-num">05 ·</div>
        <div class="miss-title">The 2028 Islamic Banking Mandate Is a Present Deposit Competition Reality</div>
        <div class="miss-body">The 26th Constitutional Amendment includes a target for full Islamic banking conversion. Whether or not this deadline is met, it has already triggered intensified competition for deposits between full Islamic banks (MEBL) and conventional banks' Islamic windows (HBL Islamic, MCB Islamic, UBL Ameen). Islamic deposit products often offer profit-sharing returns tied to benchmark rates. This competition is already affecting CASA composition for conventional banks — it is not a future structural story to be discounted; it is a present deposit-mix pressure affecting NIM today.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Short-Cycle vs Long-Cycle Drivers</h2>
    <p class="deep-intro">Different variables operate on completely different time horizons. Conflating near-term noise with structural change is one of the most common analytical errors in sector research.</p>
    <div class="cycle-grid">
    <div class="cycle-col">
      <div class="cycle-header" style="color:#5b9bd5">NEAR TERM · 0–3 months</div>
      <div class="cycle-title">Quarterly EPS Drivers</div>
      <div class="cycle-item"><span class="cycle-driver">KIBOR repricing on KIBOR-linked assets</span>Variable-rate loans and T-bills reprice immediately with each rate change; quarterly NII reflects the average KIBOR during the period, not end-period rates.</div><div class="cycle-item"><span class="cycle-driver">PIB capital gains (non-recurring)</span>In a rate-cut cycle, banks realising PIB gains inflate non-interest income; this is timing-dependent and creates noise in quarterly comparisons.</div><div class="cycle-item"><span class="cycle-driver">ADR threshold management</span>Banks below 50% ADR face additional tax; tactical short-term lending to hit 50% at quarter-end distorts both credit quality and NIM for the quarter.</div><div class="cycle-item"><span class="cycle-driver">Provisioning charges</span>Exceptional provisions (court orders at NBP, large corporate NPL recognition) can materially change PAT in any quarter without trend-level credit deterioration.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#6aad6a">MEDIUM TERM · 3–18 months</div>
      <div class="cycle-title">Balance Sheet Repositioning</div>
      <div class="cycle-item"><span class="cycle-driver">PIB portfolio duration and maturity profile</span>As high-rate PIBs mature, banks reinvest at lower current yields — the primary mechanism of NIM compression in the rate-cut cycle; portfolio duration determines how quickly this occurs.</div><div class="cycle-item"><span class="cycle-driver">CASA vs term deposit mix</span>Erosion of CASA share toward Islamic or term deposits raises funding cost; track quarterly CASA ratio to assess whether funding cost advantage is being maintained.</div><div class="cycle-item"><span class="cycle-driver">Private sector credit demand recovery</span>As rates fall and economic activity recovers, loan growth revives; expanding ADR improves the earning-asset yield mix and avoids the ADR-linked tax penalty.</div><div class="cycle-item"><span class="cycle-driver">Provisioning cycle normalisation</span>NPLs recognised during the high-rate stress period may require elevated provisions for 2–4 quarters before the coverage ratio stabilises.</div>
    </div>
    <div class="cycle-col">
      <div class="cycle-header" style="color:#c8a96e">STRUCTURAL · 18 months+</div>
      <div class="cycle-title">Decade-Scale Determinants</div>
      <div class="cycle-item"><span class="cycle-driver">Islamic banking share of total deposits</span>If Islamic banks capture 40%+ of deposits (up from 25% today), conventional banks face structurally higher funding costs; MEBL is the primary beneficiary of this structural shift.</div><div class="cycle-item"><span class="cycle-driver">Digital banking and transaction fee income</span>RAAST, Easypaisa, JazzCash, and bank-owned digital platforms are competing for transaction fee income; banks with inferior digital capabilities will lose non-interest income share over time.</div><div class="cycle-item"><span class="cycle-driver">Government borrowing requirement</span>The size of government borrowing determines how many PIBs are available for banks to hold; fiscal consolidation would reduce this balance sheet buffer and force banks toward private lending.</div><div class="cycle-item"><span class="cycle-driver">NIM floor under full rate-cut scenario</span>If the policy rate falls below 10%, NIMs may compress to levels where government securities barely cover funding costs — forcing banks to genuinely expand private credit or accept lower ROE.</div>
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
        <div class="connect-body">The primary earnings driver for the sector. Rate rises expand NIM as earning-asset yields reprice upward; rate cuts compress NIM. The transmission is asymmetric — lending reprices faster than funding in both directions, but the net NIM effect depends on the fixed vs floating split of each bank's book. SBP rate decisions also determine the yield at which PIBs are purchased and KIBOR at which loans are priced.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">💱</span>
        <div class="connect-title">Currency (PKR/USD)</div>
        <div class="connect-body">Moderate direct effect. Banks with large foreign currency deposits and foreign currency lending books have currency mismatch risk. FX gains or losses appear in trading income. Pakistani banks are predominantly PKR-denominated, so currency is less dominant than in E&P or textiles. The indirect effect — PKR depreciation driving inflation driving rate policy — is more important than the direct FX translation effect.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">📊</span>
        <div class="connect-title">Government Fiscal Position</div>
        <div class="connect-body">The most underappreciated structural driver. Government borrowing from the banking system creates the PIB supply that banks hold as their primary earning asset in the high-rate cycle. If fiscal discipline reduces government borrowing needs, the investment opportunity at high yields contracts, forcing banks toward private credit at lower risk-adjusted returns. IMF programme discipline is therefore directly relevant to bank earning-asset yields.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏛️</span>
        <div class="connect-title">Government Policy</div>
        <div class="connect-body">Super tax, ADR-linked additional tax, minimum profit rate on savings deposits, Islamic banking conversion mandate — all are direct earnings determinants set by policy. No other listed sector has as many earnings variables determined annually by the Finance Bill rather than market conditions. Banks manage around policy constraints rather than competing purely on commercial terms.</div>
      </div>
      <div class="connect-card">
        <span class="connect-icon">🏭</span>
        <div class="connect-title">Industrial and Consumer Demand</div>
        <div class="connect-body">Private sector credit demand from industry, SMEs, and consumers determines loan growth — the medium-term path to NIM diversification away from government securities. In economic slowdowns, credit demand collapses and banks default to PIB holdings. In recoveries, loan growth provides higher-yielding and more diversified earning assets. The economic cycle therefore determines whether banks earn through government or private channels.</div>
      </div>
    </div>
  </div>

  <div class="deep-section">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Business Model Winners &amp; Losers</h2>
    <p class="deep-intro">Different business model structures within this sector face systematically different conditions. The following describes which model characteristics tend to generate or destroy earnings margin under specific environments — without reference to specific companies as recommendations.</p>
    <div class="model-grid">
      <div class="model-card model-card-up">
        <div class="model-card-title">TENDS TO BENEFIT WHEN — High CASA, long-duration PIBs, low NPLs</div>
        <div class="model-row"><span class="model-condition">Rate-cut cycle begins</span>Banks with long-duration PIBs locked in at high yields earn above-market returns while funding costs fall; high CASA ratios mean funding reprices slowly downward, temporarily protecting NIM.</div><div class="model-row"><span class="model-condition">PIB capital gain realisation opportunity</span>Banks holding large PIB books can selectively realise gains as rates fall, creating one-time non-interest income that inflates quarterly PAT.</div><div class="model-row"><span class="model-condition">Fiscal expansion by government</span>Higher government borrowing creates more PIB supply at elevated yields; banks holding or acquiring more government securities benefit from this carry trade.</div><div class="model-row"><span class="model-condition">Islamic banking conversion leadership</span>Banks with established Islamic windows or full Islamic charters are positioned to capture the deposit inflow as the 2028 mandate approaches.</div>
      </div>
      <div class="model-card model-card-dn">
        <div class="model-card-title">TENDS TO FACE PRESSURE WHEN — High fixed-rate funding costs, large NPL backlog, low CASA</div>
        <div class="model-row"><span class="model-condition">Rapid rate-cut cycle</span>Banks with a large proportion of fixed-rate deposits locked at high rates continue paying premium funding costs as earning assets reprice downward — NIM contracts sharply.</div><div class="model-row"><span class="model-condition">ADR-linked tax penalties</span>Banks consistently below 50% ADR face an additional tax that raises ETR further above the sector average, compressing PAT even when pre-tax profits are growing.</div><div class="model-row"><span class="model-condition">Sovereign credit risk events</span>Banks with high concentration in government securities (PIBs) bear sovereign credit risk; any deterioration in government creditworthiness affects the earning-asset base directly.</div><div class="model-row"><span class="model-condition">NPL recognition cycle from stress period</span>Banks with large corporate and SME NPL backlogs face elevated provisioning charges through the recovery cycle; provisioning can consume a significant share of operating profit.</div>
      </div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">11 · Interpretation Layer</div>
    <h2 class="deep-h2">Structural Questions</h2>
    <p class="deep-intro">The major unresolved debates, policy uncertainties, and structural questions that will shape this sector over the next three to seven years. These are not predictions — they are the analytical dimensions that require active monitoring.</p>
    <div class="sq-list">
    <div class="sq-item">
      <div class="sq-q">What is the NIM floor when the SBP policy rate reaches 8–10%?</div>
      <div class="sq-context">If the rate cut cycle continues toward single digits, government securities yield near or below the CASA funding cost plus operating cost. At that point, banks must either grow private sector lending (accepting credit risk) or accept structurally lower ROE. The industry has not operated at sub-10% policy rates in recent memory — the answer will emerge only as the rate cycle plays out.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Does the 2028 Islamic banking conversion mandate have legal enforceability?</div>
      <div class="sq-context">The constitutional amendment sets a target. The mechanism for enforcement — how a conventional bank becomes fully Islamic, what happens to existing contracts, how profit-sharing replaces fixed-rate lending — remains legislatively undefined. Whether MEBL's advantage is cemented by 2028 or whether the deadline effectively slides depends on implementation clarity that does not yet exist.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Can Pakistan's banks sustain current ROE levels when the PIB carry trade compresses?</div>
      <div class="sq-context">The high-rate environment generated ROEs above 30% at several listed banks — well above historical norms. As rates fall and PIB yields compress, the carrying trade unwinds. Whether banks can substitute private credit growth, fee income expansion, and cost discipline to maintain ROE above 20% is the defining medium-term question for the sector's valuation.</div>
    </div>
    <div class="sq-item">
      <div class="sq-q">Will RAAST and digital payment platforms erode bank fee income structurally?</div>
      <div class="sq-context">Interbank transfer fee income, processing margins, and transaction banking revenue are being displaced by zero-cost digital transfers. Banks investing in their own digital infrastructure can offset volume losses with new digital product revenue. Banks that are digital infrastructure followers rather than leaders may see non-interest income under sustained pressure from SBP-mandated payment network expansion.</div>
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
        <div class="dpeer-accent-bar" style="background:#5b9bd5"></div>
        <div class="dpeer-ticker">HBL</div>
        <div class="dpeer-name">Habib Bank Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Scale franchise operator — largest private bank by assets, broad geographic and segment coverage, strong international presence (especially MENAP corridors)</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">High-rate environment + strong CASA: HBL's large CASA base earns more when rates are high and funding costs are anchored by non-interest deposits; scale distributes fixed costs efficiently</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Sharp NIM compression + provisioning cycle: HBL's large loan book creates provisioning risk in downturns; NIM compression hits a larger absolute revenue base</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led and franchise-led — deposit mobilisation scale and geographic reach define the earnings base more than product innovation or margin management</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">UBL — Both are large full-service banks with international operations; the distinction is HBL's larger domestic branch network and UBL's historically stronger corporate and international banking focus</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#4a9eff"></div>
        <div class="dpeer-ticker">UBL</div>
        <div class="dpeer-name">United Bank Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Corporate and international franchise operator — strong in corporate banking, Gulf remittance corridors, and international operations</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Corporate credit cycle + international growth: UBL benefits when corporate loan demand recovers and Gulf-Pakistan remittance flows remain strong</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Corporate NPL cycle: UBL's corporate lending concentration means large corporate defaults create disproportionate provisioning charges versus retail-diversified peers</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Volume-led and balance-sheet-led — loan book size and quality determine earnings more than fee income or product mix</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">HBL — Both are large full-service banks; analytical comparison reveals the value of HBL's larger retail CASA vs UBL's corporate focus — different risk profiles under the same macro conditions</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#6aad6a"></div>
        <div class="dpeer-ticker">MEBL</div>
        <div class="dpeer-name">Meezan Bank Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Islamic franchise operator — largest full Islamic bank, beneficiary of both the Islamic banking growth trend and the 2028 constitutional mandate</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Islamic deposit growth + rate-cut cycle: as Islamic banking grows, MEBL attracts more deposits; in rate cuts, its profit-sharing returns fall with market but its deposit base continues to grow from structural mandate tailwind</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Conventional bank Islamic window improvements: if HBL Islamic or MCB Islamic significantly improve their Shariah offerings and customer experience, MEBL's deposit growth advantage narrows</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Franchise-led and policy-led — the 2028 Islamic banking mandate is the most important structural tailwind; MEBL's earnings are less rate-sensitive than conventional peers because profit-sharing reprices differently from fixed-rate instruments</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">MCB — Comparison with MCB is useful because both have been considered high-quality, high-efficiency operators — MEBL on the Islamic side, MCB on the conventional side; the comparison illuminates Islamic vs conventional franchise value</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c8a96e"></div>
        <div class="dpeer-ticker">MCB</div>
        <div class="dpeer-name">MCB Bank Limited</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">Efficiency-led conventional operator — consistently among the best cost-to-income ratios in Pakistan banking, Nishat group owned, strong CASA franchise</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">High-rate environment + low credit costs: MCB's efficient cost structure maximises the spread between earning-asset yield and funding cost; low NPL ratios reduce provisioning drag on PAT</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Rapid rate cuts + Islamic competition: NIM compression hits MCB's PIB-heavy book quickly; competition from Islamic banking erodes its CASA advantage in the savings deposit segment</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Margin-led — cost efficiency and NIM management drive ROE; MCB consistently earns more per unit of assets than larger peers, compensating for its smaller absolute balance sheet</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">MEBL — Both are considered 'quality' operators in their respective categories (MCB = conventional, MEBL = Islamic); comparing their margin profiles and growth rates reveals the relative earnings quality of scale vs franchise efficiency</span></div>
      </div>
      <div class="dpeer-card">
        <div class="dpeer-accent-bar" style="background:#c86e8f"></div>
        <div class="dpeer-ticker">NBP</div>
        <div class="dpeer-name">National Bank of Pakistan</div>
        <div class="dpeer-row"><span class="dpeer-lbl">Operator Type</span><span class="dpeer-val">State-linked utility operator — largest bank by assets when including state deposits, but structurally different from private banks; earnings heavily affected by exceptional charges and government mandates</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Best Cycle</span><span class="dpeer-val">Government deposit concentration + high-rate environment: NBP holds large government deposits at zero or low cost; when rates are high, the spread earned on these funds is substantial</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Worst Env.</span><span class="dpeer-val">Pension litigation + court orders: NBP carries the largest known institutional litigation risk in Pakistan banking; a single Supreme Court ruling can create a Rs20–40B exceptional charge</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Led By</span><span class="dpeer-val">Policy-led and balance-sheet-led — government mandate determines what NBP does with its balance sheet; operational efficiency is secondary to government banking relationships</span></div>
        <div class="dpeer-row"><span class="dpeer-lbl">Closest Peer</span><span class="dpeer-val">HBL — Comparison with HBL reveals what a similarly-sized private bank can earn from a given balance sheet without government mandate constraints and exceptional charge risk</span></div>
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
        <td><span class="pfinal-ticker">HBL</span></td>
        <td>Scale franchise / full-service</td>
        <td>High rates + strong CASA + economic growth</td>
        <td>NIM compression + large NPL cycle</td>
        <td>Largest private network, MENAP international corridor</td>
        <td>Provisioning exposure on large retail and corporate book</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">UBL</span></td>
        <td>Corporate + international franchise</td>
        <td>Corporate credit recovery + Gulf remittances</td>
        <td>Corporate NPL cycle + international headwinds</td>
        <td>Gulf corridor strength, corporate relationship depth</td>
        <td>Corporate loan concentration risk</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">MEBL</span></td>
        <td>Islamic franchise / policy beneficiary</td>
        <td>Islamic deposit growth + 2028 mandate tailwind</td>
        <td>Conventional Islamic window competition improving</td>
        <td>Only full Islamic bank at scale, structural mandate tailwind</td>
        <td>Profit-sharing NIM less predictable than fixed-rate NIMs</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">MCB</span></td>
        <td>Efficiency-led conventional operator</td>
        <td>High rates + low credit costs + CASA stability</td>
        <td>Rate cuts + Islamic competition for CASA</td>
        <td>Best-in-class cost-to-income, Nishat group backing</td>
        <td>Smaller balance sheet limits absolute PAT versus HBL/UBL</td>
      </tr>
      <tr>
        <td><span class="pfinal-ticker">NBP</span></td>
        <td>State-linked utility operator</td>
        <td>High government deposit rates + fiscal expansion</td>
        <td>Court orders + pension provisions + government mandates</td>
        <td>Largest asset base including state deposits</td>
        <td>Exceptional charge risk from litigation, not commercially optimised</td>
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
      <div class="metric-name">SBP Policy Rate and KIBOR Trajectory</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The benchmark interest rate set by the State Bank of Pakistan and the Karachi Interbank Offered Rate derived from it</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The primary macro variable for bank earnings; determines NII on floating-rate assets, PIB yields on new purchases, and cost of short-term interbank funding</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">KIBOR reflects spot rate; the bank's actual NIM reflects the average rate earned on its entire earning-asset book, which changes slowly as fixed-rate instruments mature and reprice</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">PIB portfolio duration (to understand how quickly the book reprices) and CASA ratio (to understand how quickly the funding side reprices)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Banking Sector ADR (Advance-to-Deposit Ratio)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Total advances in the system divided by total deposits — measures whether banks are channelling deposits toward private lending or government securities</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">ADR below 50% triggers additional tax; rising ADR signals improving private credit demand, which is generally associated with economic recovery and higher-quality earning-asset diversification</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Tactical quarter-end lending to hit 50% ADR artificially inflates the ratio without genuine credit intermediation; the quality of the loan growth matters as much as the quantity</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">NPL ratio growth (to assess whether ADR expansion is creating future credit quality risk) and PIB portfolio size (to understand the counterfactual — what the bank is choosing not to do with its deposits)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">PIB Portfolio Size and Duration Profile</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The aggregate government securities holdings of the banking system and their average maturity to repricing</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">Determines the sensitivity and pace of NIM change when interest rates move; long-duration PIBs lock in high yields for years in a rate-cut cycle but lock in low yields for years in a rate-rise cycle</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">A large PIB portfolio at high yields looks beneficial in the near term but represents a reinvestment risk cliff when those securities mature and must be rolled at lower rates</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">New PIB auction cut-off yields (to understand the reinvestment rate) and each bank's disclosure of PIB maturity profile (most banks disclose this in annual reports)</span></div>
    </div>
  </div>

  <div class="deep-section" style="border-bottom:none">
    <div class="deep-label">13 · Metrics Framework</div>
    <h2 class="deep-h2">Company-Level Metrics</h2>
    <p class="deep-intro">Firm-level metrics that matter most when reading quarterly results and annual filings. For each metric: what it measures, why it matters, when it misleads, and what to read alongside it.</p>
    <div class="metric-card">
      <div class="metric-name">Net Interest Margin (NIM = NII / Average Earning Assets)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Net interest income divided by average earning assets — the core profitability metric for the lending and investment business</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">The primary operating efficiency indicator for any bank; rising NIM indicates improving spread between earning-asset yield and funding cost; falling NIM indicates compression from either side</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">NIM can be maintained artificially high by concentrating in risky assets (high-yield loans with high NPL risk); a high NIM alongside rising NPL ratios is a warning signal, not a strength indicator</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">NPL ratio and provisioning charge (to assess whether high NIM is being purchased by credit risk) and CASA ratio (to understand the funding cost component of the spread)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">CASA Ratio (Current and Savings Deposits / Total Deposits)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">The proportion of deposits that are current accounts (zero cost) or savings accounts (regulated minimum rate) versus term deposits (market-rate funded)</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">High CASA = low funding cost = structural NIM advantage; CASA deposits are the primary determinant of funding cost differential between banks</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">CASA can be maintained at high levels through relationship inertia even as Islamic banking competition targets the savings component; CASA stability masks emerging funding cost pressure if the composition is shifting toward savings from current</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">CASA growth rate vs deposit growth rate (to assess whether CASA share is growing or being diluted) and savings deposit outflow trends toward Islamic accounts</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Cost-to-Income Ratio (Operating Cost / Operating Income)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Total operating expenses divided by total operating income — measures operational efficiency</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">A lower ratio indicates more efficient conversion of revenue into pre-provision profit; banks with below-sector-average cost-to-income ratios generate more earnings from the same income base</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">Can improve simply because income (the denominator) grows from non-recurring PIB gains rather than from genuine cost discipline — always check the income quality before concluding efficiency has improved</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Income quality (proportion of recurring fee and NII income vs non-recurring gains) and absolute cost growth (to ensure cost-to-income improvement is not just income-denominator inflation)</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-name">Effective Tax Rate (ETR)</div>
      <div class="metric-row"><span class="metric-lbl">Measures</span><span class="metric-val">Income tax expense as a percentage of profit before tax — encompasses corporate tax, super tax, minimum tax, and ADR-linked penalties</span></div>
      <div class="metric-row"><span class="metric-lbl">Why it matters</span><span class="metric-val">ETR of 49–56% means pre-tax profit growth of 20% produces PAT growth of significantly less; understanding ETR is essential for translating pre-tax performance into shareholder earnings</span></div>
      <div class="metric-row"><span class="metric-lbl">Can mislead when</span><span class="metric-warn metric-val">An unusually low ETR quarter (under 45%) may reflect a prior-year tax adjustment, WHT credit, or specific deduction — it should not be assumed to represent the normalised rate going forward</span></div>
      <div class="metric-row"><span class="metric-lbl">Read alongside</span><span class="metric-alongside metric-val">Pre-tax operating profit (to see the underlying performance before the ETR filter) and tax note disclosures (to identify what drove any ETR deviation from the expected 50–55% range)</span></div>
    </div>
  </div>`,
  }
  ],
};

export default sector;

-- ============================================================
-- Migration 029: Seed sector_macro_drivers
--
-- Covers all 7 active PSX sectors.
-- 4-6 drivers per sector, ordered by impact_magnitude DESC.
-- All rows set is_active = true.
-- Uses INSERT ... ON CONFLICT DO UPDATE so re-runs are safe.
-- ============================================================

INSERT INTO sector_macro_drivers
  (sector_slug, macro_driver, driver_category, relationship,
   current_direction, impact_magnitude, impact_description,
   lag_months, tags)
VALUES

-- ════════════════════════════════════════════════════════════
-- BANKING  (5 drivers)
-- Key levers: SBP policy rate, KIBOR, PIB yields, ADR/IDR
-- ════════════════════════════════════════════════════════════

(
  'banking', 'sbp_policy_rate', 'monetary',
  'Banks earn the spread between what they pay depositors and what they receive on '
  'government securities (PIBs, T-bills). PIBs and MTBs are the dominant earning asset '
  'for large-cap banks (~50-65% of assets). Each 100bps rate cut compresses sector NII '
  'within 1-2 quarters as maturing PIBs re-invest at lower yields. Rate cuts also reduce '
  'KIBOR, compressing variable-rate lending income.',
  'negative', 5,
  'SBP has cut 1,000bps from the June 2023 peak of 22%; further cuts in 2025 will compress '
  'NIM as banks re-invest maturing PIBs at sub-15% yields vs. prior 20-22% yields.',
  2,
  ARRAY['rate_sensitive', 'nim_pressure', 'easing_cycle', 'pib_repricing']
),
(
  'banking', 'pkr_usd_rate', 'fx',
  'PKR depreciation creates two effects on banks: (1) positive — FX income from spreads on '
  'foreign currency transactions and trade finance; (2) negative — inflates NPL risk on '
  'USD-linked borrower obligations. Net effect is modestly positive for banks with strong '
  'trade finance and remittance businesses (MCB, HBL).',
  'neutral', 2,
  'PKR has stabilised near PKR 278-282 range in 2025; FX income contribution is modest '
  'and not a primary earnings driver at current volatility levels.',
  1,
  ARRAY['fx_income', 'trade_finance', 'npl_risk', 'pkr_stability']
),
(
  'banking', 'inflation_cpi', 'demand',
  'Higher inflation erodes household purchasing power and increases the risk of defaults '
  'on consumer lending. It also raises operating costs (salary inflation, IT costs). '
  'Historically, high inflation in Pakistan coincides with high rates, which benefits NIM '
  '— so the relationship is complex. In isolation, moderating inflation (current trend) '
  'supports asset quality.',
  'positive', 3,
  'CPI moderating toward 8-10% range (vs. 38% peak) improves household debt serviceability '
  'and supports asset quality improvement in consumer and SME portfolios.',
  3,
  ARRAY['asset_quality', 'consumer_lending', 'npl', 'inflation_moderation']
),
(
  'banking', 'adv_deposit_ratio', 'regulatory',
  'SBP periodically revises ADR/IDR requirements to channel credit toward productive sectors '
  'and reduce banks'' reliance on risk-free government securities. An increase in minimum ADR '
  'forces banks to lend more to the private sector, compressing risk-free PIB income but '
  'potentially improving loan yields if private-sector spreads are wider.',
  'neutral', 3,
  'ADR requirements currently under review; any increase above current levels would require '
  'banks to shift assets from PIBs to private-sector lending — NIM impact depends on '
  'relative yields.',
  0,
  ARRAY['adr_idor', 'regulatory', 'private_credit', 'sbp_directive']
),
(
  'banking', 'npl_cycle', 'fiscal',
  'Non-performing loans rise during economic stress (high inflation, PKR depreciation, '
  'energy cost shocks) and fall during recovery. Provisioning charges directly reduce PAT '
  'in the year they are taken. The 2022-23 stress cycle forced large provisions at HBL, '
  'UBL, and NBP. Recovery in 2024-25 is releasing provisions, boosting reported earnings.',
  'positive', 4,
  'Provision reversals and improving NPL ratios are supporting PAT growth across the '
  'large-cap banking sector as the 2022-23 stress cycle normalises.',
  0,
  ARRAY['npl', 'provisioning', 'asset_quality', 'provision_reversal']
),

-- ════════════════════════════════════════════════════════════
-- CEMENT  (5 drivers)
-- Key levers: coal prices, gas prices, construction activity,
--             interest rates (demand + borrowing cost), PKR
-- ════════════════════════════════════════════════════════════

(
  'cement', 'coal_prices', 'commodity',
  'Coal is the primary fuel for cement kilns in Pakistan (~60-65% of energy cost). '
  'Most cement plants use imported South African or Afghan coal. Coal costs translate '
  'directly to cost-of-goods-sold with a 1-2 month lag as inventories turn. '
  'International coal benchmark (Richards Bay) drives import parity cost in PKR terms.',
  'positive', 5,
  'International coal prices have declined materially from 2022 highs; cement manufacturers '
  'are benefiting from lower energy costs, partially restoring margins compressed during '
  'the 2022-23 energy cost supercycle.',
  2,
  ARRAY['coal', 'energy_cost', 'cogs', 'imported_coal', 'margin_recovery']
),
(
  'cement', 'sbp_policy_rate', 'monetary',
  'Interest rates affect cement demand through two channels: (1) cost of borrowing for '
  'real estate developers and construction contractors who finance projects; (2) cement '
  'company leverage costs — sector average D/E is moderate but companies with expansion '
  'capex are more sensitive. High rates suppress housing demand and delay infrastructure '
  'spending, compressing volumes.',
  'positive', 4,
  'Rate cuts from 22% to current levels are beginning to unlock pent-up real estate '
  'and construction activity; volume recovery is expected to lag rate cuts by 2-3 quarters.',
  3,
  ARRAY['rate_sensitive', 'construction_demand', 'housing', 'infrastructure', 'easing_cycle']
),
(
  'cement', 'pkr_usd_rate', 'fx',
  'A weaker PKR raises the PKR cost of imported coal and other imported raw materials. '
  'Cement companies with dollar-linked equipment financing also face higher interest costs. '
  'Partially offset: stronger PKR-denominated revenues when prices are raised. Net effect '
  'is negative in the near term as cost increases outpace price pass-through.',
  'positive', 3,
  'PKR stabilisation is reducing imported coal cost pressure; companies that hedged '
  'coal procurement in H2 2024 are seeing favourable cost tailwinds.',
  1,
  ARRAY['pkr', 'import_cost', 'coal_cost', 'fx_negative']
),
(
  'cement', 'construction_activity', 'demand',
  'Cement is an intermediate good — 100% of demand is construction-linked. The three '
  'demand pillars are: (1) private housing (55-60% of cement consumption); '
  '(2) PSDP/infrastructure (25-30%); (3) commercial construction (15-20%). '
  'Housing finance penetration in Pakistan is among the lowest globally; demand is '
  'primarily self-financed or developer-financed, making it rate-sensitive.',
  'positive', 4,
  'Post-floods reconstruction and pent-up housing demand are supporting local cement '
  'offtake; PSDP utilisation remains below target but improving.',
  0,
  ARRAY['housing', 'psdp', 'construction', 'volume_recovery', 'demand_drivers']
),
(
  'cement', 'gas_prices', 'commodity',
  'Gas-fired kilns use RLNG or natural gas at regulated rates. OGRA-set gas prices '
  'are revised periodically and can materially affect the 30-40% of cement capacity '
  'that uses gas. Price deregulation or supply curtailments create cost uncertainty. '
  'Coal-fired plants are insulated from gas price risk.',
  'neutral', 3,
  'Gas price hike risk persists; companies with mixed coal-gas capacity have moderate '
  'exposure but full coal-fired plants are insulated.',
  0,
  ARRAY['gas', 'rlng', 'energy_cost', 'ogra', 'gas_price']
),

-- ════════════════════════════════════════════════════════════
-- TEXTILES  (5 drivers)
-- Key levers: PKR, cotton prices, energy costs, global demand,
--             DLTL/export incentives
-- ════════════════════════════════════════════════════════════

(
  'textiles', 'pkr_usd_rate', 'fx',
  'Textile exporters invoice in USD/EUR and bear costs in PKR. A weaker PKR mechanically '
  'improves export revenue in PKR terms — each 10% PKR depreciation adds ~10% to '
  'PKR-denominated revenue for dollar-billed exporters. However, imported inputs '
  '(viscose, polyester, dyes, chemicals) become more expensive, partially offsetting the '
  'benefit. Net impact is positive for value-added exporters; negative for spinners '
  'who import raw fibre.',
  'neutral', 5,
  'PKR stabilisation has reduced the mechanical FX tailwind that boosted reported revenues '
  'in 2022-23; exporters now compete on quality and lead times rather than currency advantage.',
  1,
  ARRAY['fx_positive', 'export_revenue', 'import_cost', 'pkr', 'value_added']
),
(
  'textiles', 'cotton_prices', 'commodity',
  'Cotton is the primary raw material for spinning and composite mills. Domestic cotton '
  'prices track international Cotlook A Index. Poor domestic harvests force Pakistan to '
  'import at international parity prices. High cotton prices compress spinning margins '
  'but can be partly passed through in downstream value-added products with a 2-4 month lag.',
  'positive', 4,
  'International cotton prices have moderated from 2022 highs; domestic crop recovery '
  'is reducing import dependence and supporting spinner margins.',
  3,
  ARRAY['cotton', 'raw_material', 'spinner', 'composite_mill', 'cotlook']
),
(
  'textiles', 'energy_cost', 'commodity',
  'Textile manufacturing is energy-intensive — gas and electricity account for 18-25% '
  'of COGS for spinning and 12-18% for value-added segments. Industrial gas prices and '
  'captive power generation costs (RLNG, coal) directly affect competitiveness vs. '
  'Bangladesh and Vietnam. High energy costs are cited as the primary competitiveness '
  'disadvantage vs. regional peers.',
  'negative', 4,
  'Industrial gas and electricity prices remain elevated relative to regional competitors; '
  'this continues to erode export order conversion rates vs. Bangladesh.',
  0,
  ARRAY['energy_cost', 'gas', 'electricity', 'competitiveness', 'bangladesh']
),
(
  'textiles', 'global_apparel_demand', 'demand',
  'Pakistan''s textile exports are heavily weighted toward the EU and USA. Global apparel '
  'demand follows consumer confidence and retail inventory cycles. A slowdown in developed '
  'market consumer spending causes order cancellations or deferrals with a 1-2 quarter lag. '
  'EU GSP+ status provides preferential access that is periodically under review.',
  'positive', 4,
  'US and EU retail inventory restocking is supporting order placement for H2 2025; '
  'EU GSP+ status remains intact, supporting duty-free market access for compliant exporters.',
  2,
  ARRAY['export_demand', 'eu', 'usa', 'gsp_plus', 'apparel', 'global_demand']
),
(
  'textiles', 'dltl_export_incentives', 'regulatory',
  'Duty and Tax Remission for Exporters (DLTL) and similar refund schemes directly '
  'supplement exporter margins. Delays in DLTL payments create working capital pressure '
  'and cash flow deficits. Scheme availability and disbursement timing are subject to '
  'federal budget and FBR processing constraints.',
  'negative', 3,
  'DLTL refund backlogs are creating working capital pressure for smaller exporters; '
  'larger listed companies have stronger balance sheets to absorb payment delays.',
  0,
  ARRAY['dltl', 'refund', 'working_capital', 'fbr', 'export_incentive']
),

-- ════════════════════════════════════════════════════════════
-- FERTILISER  (5 drivers)
-- Key levers: gas prices, urea prices, crop prices (offtake),
--             subsidy policy, PKR (for import competition)
-- ════════════════════════════════════════════════════════════

(
  'fertiliser', 'gas_prices', 'commodity',
  'Natural gas is both the primary feedstock and fuel for urea manufacturing — accounting '
  'for ~70-80% of urea production cost. Fertiliser producers in Pakistan receive gas at '
  'concessional rates under sector-specific pricing arrangements. Any increase in feedstock '
  'gas price or withdrawal of the concession directly compresses margins. The cost advantage '
  'vs. imported urea narrows when local gas prices rise.',
  'negative', 5,
  'Gas price revisions and supply curtailments to fertiliser plants remain the single '
  'biggest near-term risk to sector margins; SNGPL supply reliability is a recurring concern.',
  0,
  ARRAY['gas_feedstock', 'urea_cost', 'concessional_gas', 'sngpl', 'margin_risk']
),
(
  'fertiliser', 'urea_international_price', 'commodity',
  'International urea prices (Black Sea benchmark) set an import parity ceiling for '
  'domestic urea pricing. When international prices are low, domestic producers face '
  'pricing pressure from cheaper imports unless protected by tariffs. When international '
  'prices are high, domestic producers can maintain premium pricing, widening margins.',
  'positive', 4,
  'International urea prices have recovered from 2023 lows; this provides headroom for '
  'domestic pricing and reduces import pressure on local producers.',
  1,
  ARRAY['urea', 'import_parity', 'black_sea', 'international_pricing', 'tariff']
),
(
  'fertiliser', 'crop_prices_offtake', 'demand',
  'Fertiliser demand is directly linked to farmer economics. When crop prices (wheat, rice, '
  'sugarcane, cotton) are high, farmers invest more in inputs including fertiliser. '
  'Low crop prices or government price controls suppress fertiliser offtake. Kharif and '
  'Rabi planting seasons create strong demand seasonality (Feb-March and July-August peaks).',
  'positive', 4,
  'Wheat support price increase and strong cotton prices are supporting farmer economics '
  'and fertiliser offtake in the current Rabi season.',
  0,
  ARRAY['offtake', 'farmer_economics', 'wheat', 'cotton', 'rabi', 'kharif']
),
(
  'fertiliser', 'government_subsidy_policy', 'regulatory',
  'The federal government periodically provides fertiliser subsidies to support the '
  'agriculture sector. Subsidies can take the form of direct retail price caps, '
  'cash subsidies to farmers, or concessional gas pricing for producers. '
  'Sudden subsidy withdrawals create demand shock as farmers face sharply higher prices.',
  'neutral', 3,
  'Current subsidy framework is stable; no major subsidy withdrawal risk flagged for '
  'current season. Long-term fiscal pressure may result in incremental subsidy rationalisation.',
  0,
  ARRAY['subsidy', 'government_policy', 'retail_price', 'farmer_support']
),
(
  'fertiliser', 'pkr_usd_rate', 'fx',
  'Fertiliser companies import phosphatic and potassic fertilisers (DAP, SOP) in USD. '
  'A weaker PKR raises the PKR cost of these imports. Urea (which is domestically produced) '
  'is insulated, but composite companies with DAP imports face FX cost pressure. '
  'Export revenue from urea exports is modest; most production is for domestic consumption.',
  'neutral', 2,
  'PKR stabilisation reduces import cost pressure for phosphatic fertiliser importers; '
  'impact is modest for producers who are primarily urea-focused.',
  1,
  ARRAY['dap', 'pkr', 'import_cost', 'phosphatic', 'potassic']
),

-- ════════════════════════════════════════════════════════════
-- OIL & GAS  (5 drivers)
-- Key levers: international oil price, gas pricing/allocation,
--             circular debt (receivables), PKR, exploration policy
-- ════════════════════════════════════════════════════════════

(
  'oil-gas', 'crude_oil_prices', 'commodity',
  'E&P companies (OGDC, PPL, POL) receive crude oil and condensate prices at international '
  'parity (Arabian Light). Higher oil prices directly increase revenue and PAT for E&P '
  'companies. Refining companies (ATRL, NRL) earn a refining margin (crack spread) that '
  'is NOT directly linked to crude price — they benefit from crack spread expansion '
  'and inventory gains when prices rise. OMCs (PSO) are minimally affected by crude price '
  'as they pass through to pump prices.',
  'positive', 5,
  'Brent crude in the USD 70-80 range provides a stable revenue environment for E&P; '
  'crack spreads for refiners remain positive, supporting refining profitability.',
  1,
  ARRAY['crude_oil', 'ep_revenue', 'brent', 'arabian_light', 'refining', 'crack_spread']
),
(
  'oil-gas', 'gas_allocation_pricing', 'regulatory',
  'OGRA regulates wellhead gas prices and allocates gas production volumes to categories '
  '(domestic, power, industrial, fertiliser). E&P companies'' gas revenue depends on '
  'both the regulated wellhead price and the volume of gas accepted by buyers. '
  'SSGC and SNGPL payment delays create receivable risk. New gas discoveries must '
  'be monetised through the regulated framework.',
  'negative', 4,
  'Gas allocation and pricing disputes, combined with circular debt in the gas chain, '
  'are creating receivable pressure for OGDC and PPL. Wellhead price revisions are '
  'pending with OGRA.',
  0,
  ARRAY['gas_pricing', 'ogra', 'wellhead_price', 'gas_allocation', 'receivables']
),
(
  'oil-gas', 'circular_debt_petroleum', 'fiscal',
  'The petroleum circular debt — accumulated unpaid receivables owed by power sector '
  'and gas distribution companies to E&P producers — is one of the largest structural '
  'risks to the sector. PSO is owed significant amounts by DISCOs; OGDC and PPL are owed '
  'by SSGC and SNGPL. This impairs cash flow, increases working capital requirements, '
  'and defers dividend capacity.',
  'negative', 4,
  'Petroleum circular debt stock remains elevated; government has committed to '
  'partial clearance tranches but the pace of resolution is slow.',
  0,
  ARRAY['circular_debt', 'receivables', 'pso', 'ogdc', 'ppl', 'cash_flow']
),
(
  'oil-gas', 'pkr_usd_rate', 'fx',
  'E&P revenues are linked to USD-denominated crude prices and USD-denominated wellhead '
  'gas prices. Revenue is converted to PKR at the prevailing exchange rate. A weaker PKR '
  'mechanically increases PKR-denominated revenue for E&P companies. Dollar-linked debt '
  'creates an offsetting FX cost for companies with foreign currency borrowings.',
  'positive', 3,
  'PKR stabilisation has moderated the FX translation benefit for E&P companies '
  'that benefited from the 2022-23 PKR depreciation cycle.',
  0,
  ARRAY['fx', 'pkr', 'usd_revenue', 'translation', 'ep']
),
(
  'oil-gas', 'exploration_policy', 'regulatory',
  'New exploration and production policy defines the fiscal terms (royalty rates, '
  'windfall profit tax, signature bonuses) for new exploration blocks. Attractive '
  'E&P policy encourages domestic and international exploration investment. '
  'Pakistan''s hydrocarbon reserves are declining in matured fields; new discoveries '
  'are essential for long-term reserve replacement.',
  'neutral', 3,
  'Current E&P policy under review; uncertainty around fiscal terms has modestly '
  'delayed new block applications from international operators.',
  0,
  ARRAY['exploration_policy', 'ep_policy', 'fiscal_terms', 'reserves', 'ogra']
),

-- ════════════════════════════════════════════════════════════
-- POWER / IPP  (5 drivers)
-- Key levers: circular debt, NEPRA tariff, coal/RLNG fuel cost,
--             capacity payments, PKR (dollar-linked PPA)
-- ════════════════════════════════════════════════════════════

(
  'power-ipp', 'circular_debt_power', 'fiscal',
  'The power sector circular debt — accumulated government-owed capacity payments and '
  'energy payments not passed through in consumer tariffs — is the defining structural '
  'risk for IPPs. Unpaid capacity payments impair IPP cash flows, suppress dividends, '
  'and in extreme cases threaten covenant breaches. CPEC power projects have '
  'USD-linked capacity payments making circular debt particularly acute for '
  'coal-fired projects.',
  'negative', 5,
  'Power circular debt stock exceeds PKR 2.5 trillion; government''s circular debt '
  'management plan (CDMP) targets partial clearance but pace of payment remains '
  'well below accrual rate.',
  0,
  ARRAY['circular_debt', 'capacity_payment', 'nepra', 'ipp_receivables', 'cdmp']
),
(
  'power-ipp', 'nepra_tariff_regime', 'regulatory',
  'NEPRA sets the consumer end tariff and determines which costs are passable to '
  'consumers. IPP revenues are governed by Power Purchase Agreements (PPAs) with '
  'CPPA-G. Tariff revisions that renegotiate PPA terms directly affect IPP capacity '
  'payment revenues. The 2023-2024 PPA renegotiation process created significant '
  'uncertainty for CPEC-linked projects.',
  'negative', 5,
  'Ongoing PPA renegotiation discussions have created revenue uncertainty for '
  'multiple CPEC-era IPPs; outcomes are expected in mid-2025.',
  0,
  ARRAY['nepra', 'ppa', 'tariff', 'cppa_g', 'renegotiation', 'revenue_certainty']
),
(
  'power-ipp', 'coal_rlng_fuel_cost', 'commodity',
  'Coal-fired and RLNG-fired power plants receive fuel on a pass-through basis under '
  'PPAs — fuel cost is not borne by the IPP but is recovered from the grid. However, '
  'fuel payment delays create working capital pressure and off-balance-sheet exposure. '
  'Plants with fuel procurement risk (no PPA fuel pass-through) are directly exposed '
  'to commodity price movements.',
  'positive', 3,
  'Lower international coal prices reduce fuel pass-through billing, modestly reducing '
  'receivable accumulation; net benefit to IPPs with pass-through structures is indirect.',
  0,
  ARRAY['coal', 'rlng', 'fuel_passthrough', 'working_capital', 'ppa_fuel']
),
(
  'power-ipp', 'pkr_usd_rate', 'fx',
  'CPEC-era IPPs have USD-linked capacity payments in their PPAs — when PKR depreciates, '
  'PKR-denominated capacity payment receipts increase, which is positive in PKR terms '
  'but increases the overall fiscal burden on Pakistan''s power sector. IPPs with '
  'USD-denominated debt also see FX translation costs. Stabilisation of PKR reduces '
  'the FX translation benefit but also reduces the fiscal pressure argument for PPA renegotiation.',
  'positive', 4,
  'PKR stabilisation reduces the CPEC IPP revenue advantage from FX translation while '
  'also easing the political pressure to renegotiate USD-linked PPA terms.',
  0,
  ARRAY['pkr', 'cpec', 'usd_ppa', 'fx_translation', 'capacity_payment']
),
(
  'power-ipp', 'power_demand_growth', 'demand',
  'Pakistan''s annual electricity demand growth is structurally driven by population '
  'growth, electrification of previously off-grid areas, and industrial activity. '
  'However, load management (loadshedding) means effective demand is administratively '
  'constrained. IPPs with capacity payments earn revenues regardless of dispatch '
  'levels, but plants with energy payment dependency (take-and-pay structures) '
  'need grid dispatch to earn revenues.',
  'neutral', 2,
  'Grid capacity significantly exceeds dispatch levels; IPPs earn primarily through '
  'capacity payments rather than energy sales, making demand growth less directly '
  'relevant to short-term earnings.',
  0,
  ARRAY['power_demand', 'dispatch', 'loadshedding', 'capacity_factor', 'grid']
),

-- ════════════════════════════════════════════════════════════
-- AUTOMOBILE  (5 drivers)
-- Key levers: interest rates (auto financing), PKR (imported CKD),
--             inflation (purchasing power), regulatory/import policy
-- ════════════════════════════════════════════════════════════

(
  'auto', 'sbp_policy_rate', 'monetary',
  'Auto financing accounts for 40-55% of new vehicle purchases in Pakistan (urban market). '
  'Monthly installment affordability is directly tied to car financing rates, which track '
  'KIBOR plus a spread. Each 100bps rate cut reduces monthly installments, directly '
  'expanding the addressable market for financed vehicles. Rate cycle is the '
  'single biggest demand lever for auto assemblers.',
  'positive', 5,
  'SBP rate cuts from 22% to current levels are materially improving auto financing '
  'affordability; assemblers are reporting improving booking volumes as KIBOR declines.',
  1,
  ARRAY['auto_financing', 'kibor', 'rate_sensitive', 'easing_cycle', 'affordability']
),
(
  'auto', 'pkr_usd_rate', 'fx',
  'Auto assemblers import CKD (completely knocked-down) kits and components, priced '
  'predominantly in JPY, USD, and EUR. PKR depreciation directly raises CKD costs in '
  'PKR terms. Assemblers can pass through cost increases in ex-factory prices but face '
  'demand elasticity constraints — large price hikes suppress bookings. '
  'Local content levels (30-45% for major assemblers) partially insulate from FX.',
  'positive', 4,
  'PKR stabilisation is providing cost relief on CKD imports; assemblers have been able '
  'to moderate price increases, supporting volume recovery.',
  1,
  ARRAY['ckd', 'import_cost', 'pkr', 'local_content', 'price_passthrough']
),
(
  'auto', 'inflation_purchasing_power', 'demand',
  'Vehicle ownership remains aspirational in Pakistan — even at the entry segment, '
  'vehicles represent 3-5 years of median household income. Sustained high inflation '
  'compresses real household incomes, reducing the pool of creditworthy buyers. '
  'Inflation also makes vehicle ownership alternatives (motorcycles, public transport) '
  'relatively more attractive.',
  'positive', 4,
  'CPI moderation toward 8-10% is improving real household income and restoring '
  'consumer confidence in big-ticket purchases including vehicles.',
  3,
  ARRAY['purchasing_power', 'consumer_confidence', 'demand', 'real_income', 'inflation']
),
(
  'auto', 'import_used_vehicle_policy', 'regulatory',
  'Periodic relaxation of used vehicle import restrictions provides low-cost competition '
  'to new vehicle assemblers. Amnesty schemes and baggage vehicle policies can temporarily '
  'depress new vehicle demand as consumers opt for cheaper imported alternatives. '
  'Local assemblers lobby strongly against liberalisation.',
  'neutral', 3,
  'No active used vehicle import liberalisation scheme; current policy supports '
  'domestic assemblers. This is a periodic political risk rather than a current headwind.',
  0,
  ARRAY['used_vehicle', 'import_policy', 'competition', 'baggage', 'amnesty']
),
(
  'auto', 'local_content_policy', 'regulatory',
  'NEVP (National Electric Vehicle Policy) and Auto Development Policy set local content '
  'requirements and import duty structures for CKD vs. CBU vehicles. Higher local '
  'content requirements protect assemblers from import competition but increase '
  'manufacturing complexity. EV policy changes can disrupt investment plans for '
  'internal combustion assemblers.',
  'neutral', 2,
  'Auto development policy framework is stable; NEVP implementation is behind schedule '
  'and does not pose near-term disruption risk to conventional ICE assemblers.',
  0,
  ARRAY['nevp', 'adp', 'local_content', 'ev_policy', 'ckd_duty']
)

ON CONFLICT (sector_slug, macro_driver)
DO UPDATE SET
  driver_category    = EXCLUDED.driver_category,
  relationship       = EXCLUDED.relationship,
  current_direction  = EXCLUDED.current_direction,
  impact_magnitude   = EXCLUDED.impact_magnitude,
  impact_description = EXCLUDED.impact_description,
  lag_months         = EXCLUDED.lag_months,
  tags               = EXCLUDED.tags,
  last_reviewed_at   = now();

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Filter,
  Gauge,
  GitBranch,
  LayoutDashboard,
  LineChart,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

const initiatives = [
  {
    id: 1,
    name: 'Claims intake redesign',
    owner: 'Operations',
    stage: 'Discovery',
    health: 'At risk',
    impact: 92,
    effort: 58,
    due: 'Aug 28',
    summary: 'Map intake pain points, define handoff rules, and reduce rework in the first review pass.',
    nextStep: 'Run process walk-through with frontline reviewers.',
  },
  {
    id: 2,
    name: 'Billing exception dashboard',
    owner: 'Finance',
    stage: 'Ready for build',
    health: 'Healthy',
    impact: 86,
    effort: 42,
    due: 'Sep 04',
    summary: 'Prioritize exception categories, write acceptance criteria, and validate reporting fields.',
    nextStep: 'Package measures and dashboard states for engineering.',
  },
  {
    id: 3,
    name: 'Customer portal backlog',
    owner: 'Product',
    stage: 'Validation',
    health: 'Needs review',
    impact: 74,
    effort: 64,
    due: 'Sep 12',
    summary: 'Score customer requests and link every release candidate to a measurable business outcome.',
    nextStep: 'Confirm release score weights with product leadership.',
  },
  {
    id: 4,
    name: 'Vendor onboarding controls',
    owner: 'Compliance',
    stage: 'Approved',
    health: 'Healthy',
    impact: 68,
    effort: 36,
    due: 'Sep 18',
    summary: 'Tighten approval checkpoints and document audit evidence for new vendor setup.',
    nextStep: 'Hand approved controls to implementation lead.',
  },
]

const requirements = [
  {
    id: 'BR-104',
    text: 'Auto-route high-value exceptions to finance leads',
    status: 'Ready',
    project: 'Billing exception dashboard',
    owner: 'Finance',
    acceptance: 'Exceptions above threshold appear in the owner queue within 2 minutes.',
  },
  {
    id: 'BR-118',
    text: 'Capture reason codes before escalation',
    status: 'Drafting',
    project: 'Claims intake redesign',
    owner: 'Operations',
    acceptance: 'Every escalated claim requires one validated reason code and reviewer note.',
  },
  {
    id: 'BR-127',
    text: 'Expose release impact score on backlog items',
    status: 'Validated',
    project: 'Customer portal backlog',
    owner: 'Product',
    acceptance: 'Backlog cards show customer count, revenue exposure, and effort score.',
  },
  {
    id: 'BR-132',
    text: 'Require compliance evidence before vendor activation',
    status: 'Approved',
    project: 'Vendor onboarding controls',
    owner: 'Compliance',
    acceptance: 'Activation remains blocked until all required evidence files are attached.',
  },
]

const risks = [
  {
    id: 'R-21',
    risk: 'Duplicate intake fields',
    level: 'High',
    project: 'Claims intake redesign',
    owner: 'Operations',
    action: 'Workshop with frontline users',
    status: 'Open',
  },
  {
    id: 'R-27',
    risk: 'Unclear source of truth',
    level: 'Medium',
    project: 'Billing exception dashboard',
    owner: 'Finance',
    action: 'Data dictionary review',
    status: 'Mitigating',
  },
  {
    id: 'R-31',
    risk: 'Stakeholder signoff delay',
    level: 'Medium',
    project: 'Customer portal backlog',
    owner: 'Product',
    action: 'Decision log reminders',
    status: 'Monitoring',
  },
]

const stakeholders = [
  ['Operations', 84, 'Needs shorter intake path', 'Schedule journey-map review'],
  ['Finance', 76, 'Wants trusted exception totals', 'Validate metrics dictionary'],
  ['Product', 69, 'Needs value scoring clarity', 'Align backlog score weights'],
  ['Compliance', 91, 'Requires evidence traceability', 'Attach audit-ready controls'],
]

const decisions = [
  ['D-08', 'Use finance as the exception-data owner', 'Finance', 'Aug 20', 'Reduces reporting ambiguity'],
  ['D-09', 'Require reason code before claim escalation', 'Operations', 'Aug 24', 'Improves handoff quality'],
  ['D-10', 'Rank backlog by impact minus effort drag', 'Product', 'Aug 27', 'Makes prioritization repeatable'],
]

const processSteps = [
  ['Request', 28, 'New work entering intake'],
  ['Triage', 17, 'Needs owner or scope'],
  ['Analysis', 12, 'Requirements in progress'],
  ['Approval', 6, 'Waiting on decisions'],
  ['Build-ready', 9, 'Ready for delivery'],
]

const stageOptions = ['All stages', 'Discovery', 'Validation', 'Ready for build', 'Approved']
const navItems = [
  ['Dashboard', LayoutDashboard],
  ['Requirements', ClipboardList],
  ['Stakeholders', Users],
  ['Risks', ShieldCheck],
  ['Decision Log', MessageSquareText],
  ['Prioritization', Target],
]

function App() {
  const [activeView, setActiveView] = useState('Dashboard')
  const [stage, setStage] = useState('All stages')
  const [query, setQuery] = useState('')
  const [selectedInitiative, setSelectedInitiative] = useState(initiatives[0].id)
  const [reviewedDecisions, setReviewedDecisions] = useState(new Set())
  const [acknowledgedRisks, setAcknowledgedRisks] = useState(new Set())
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filtered = useMemo(() => {
    return initiatives.filter((item) => {
      const stageMatch = stage === 'All stages' || item.stage === stage
      const queryMatch = `${item.name} ${item.owner} ${item.summary}`.toLowerCase().includes(query.toLowerCase())
      return stageMatch && queryMatch
    })
  }, [stage, query])

  const rankedInitiatives = useMemo(() => {
    return [...initiatives].sort((a, b) => b.impact - b.effort / 2 - (a.impact - a.effort / 2))
  }, [])

  const selected = initiatives.find((item) => item.id === selectedInitiative) ?? initiatives[0]
  const averageImpact = Math.round(initiatives.reduce((sum, item) => sum + item.impact, 0) / initiatives.length)
  const buildReady = initiatives.filter((item) => ['Ready for build', 'Approved'].includes(item.stage)).length
  const atRisk = initiatives.filter((item) => item.health !== 'Healthy').length

  function showToast(message) {
    setToast(message)
  }

  function toggleDecision(id) {
    setReviewedDecisions((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleRisk(id) {
    setAcknowledgedRisks((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openPrioritization(id) {
    setSelectedInitiative(id)
    setActiveView('Prioritization')
  }

  return (
    <main className="min-h-screen bg-[#f5f2ed] text-[#231f2c]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1540px] grid-cols-[258px_minmax(0,1fr)] max-lg:grid-cols-1">
        <aside className="border-r border-[#dfd7cc] bg-[#241930] px-5 py-6 text-white max-lg:hidden">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2dd4bf] text-[#111827]">
              <BarChart3 size={20} />
            </span>
            <div>
              <strong className="block text-sm">BA Command</strong>
              <span className="text-xs text-[#c8b8d5]">Portfolio workspace</span>
            </div>
          </div>
          <nav className="mt-8 space-y-1">
            {navItems.map(([label, Icon]) => (
              <button
                className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                  activeView === label ? 'bg-white/12 text-white ring-1 ring-white/15' : 'text-[#c8b8d5] hover:bg-white/8 hover:text-white'
                }`}
                key={label}
                onClick={() => setActiveView(label)}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-lg border border-white/10 bg-white/6 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2dd4bf]">
              <Sparkles size={15} />
              Analyst focus
            </div>
            <p className="mt-2 text-xs leading-5 text-[#eadff2]">Turn messy requests into ranked, build-ready decisions.</p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-4 border-b border-[#dfd7cc] bg-[#f5f2ed]/95 px-8 backdrop-blur max-md:flex-col max-md:items-stretch max-md:px-4 max-md:py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b45309]">Business analyst portfolio app</p>
              <h1 className="mt-1 text-2xl font-bold tracking-normal text-[#1b1624]">{activeView}</h1>
            </div>
            <div className="flex gap-2 max-sm:grid max-sm:grid-cols-2">
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#d0c5b8] bg-white px-3 text-xs font-semibold transition hover:border-[#0f766e] hover:text-[#0f766e]"
                onClick={() => setActiveView('Decision Log')}
              >
                <MessageSquareText size={16} />
                Decision log
              </button>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-3 text-xs font-semibold text-white transition hover:bg-[#115e59]"
                onClick={() => {
                  setStage('All stages')
                  setQuery('')
                  setActiveView('Prioritization')
                }}
              >
                <Target size={16} />
                Prioritize
              </button>
            </div>
          </header>

          <div className="border-b border-[#dfd7cc] bg-white/55 px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {navItems.map(([label, Icon]) => (
                <button
                  className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold ${
                    activeView === label ? 'bg-[#241930] text-white' : 'border border-[#d0c5b8] bg-white text-[#493f55]'
                  }`}
                  key={label}
                  onClick={() => setActiveView(label)}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 px-8 py-6 max-md:px-4">
            {activeView === 'Dashboard' && (
              <Dashboard
                averageImpact={averageImpact}
                atRisk={atRisk}
                buildReady={buildReady}
                filtered={filtered}
                onOpenPrioritization={openPrioritization}
                query={query}
                setQuery={setQuery}
                setStage={setStage}
                stage={stage}
              />
            )}
            {activeView === 'Requirements' && <RequirementsView onCopy={showToast} />}
            {activeView === 'Stakeholders' && <StakeholdersView onSchedule={showToast} />}
            {activeView === 'Risks' && <RisksView acknowledgedRisks={acknowledgedRisks} onToggleRisk={toggleRisk} />}
            {activeView === 'Decision Log' && <DecisionLog reviewedDecisions={reviewedDecisions} onToggleDecision={toggleDecision} />}
            {activeView === 'Prioritization' && (
              <PrioritizationView
                rankedInitiatives={rankedInitiatives}
                selected={selected}
                selectedInitiative={selectedInitiative}
                setSelectedInitiative={setSelectedInitiative}
              />
            )}
          </div>
        </section>
      </div>
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-30 w-[min(92vw,440px)] -translate-x-1/2 rounded-lg bg-[#1b1624] px-4 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </main>
  )
}

function Dashboard({ averageImpact, atRisk, buildReady, filtered, onOpenPrioritization, query, setQuery, setStage, stage }) {
  return (
    <>
      <section className="grid grid-cols-[1.35fr_0.65fr] gap-5 max-xl:grid-cols-1">
        <div className="rounded-lg border border-[#dfd7cc] bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-normal">Portfolio-grade analyst control room</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6b6174]">
                A focused workspace for business analysts to organize requests, trace requirements, watch risks,
                and translate stakeholder needs into delivery-ready priorities.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-bold text-[#0369a1]">
              <CheckCircle2 size={15} />
              Live sample data
            </span>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <Metric icon={Gauge} label="Impact score" value={`${averageImpact}%`} detail="Weighted value" />
            <Metric icon={ClipboardList} label="Requirements" value="38" detail="Mapped to outcomes" />
            <Metric icon={GitBranch} label="Build-ready" value={buildReady} detail="Approved packages" />
            <Metric icon={AlertTriangle} label="Needs attention" value={atRisk} detail="Risk or review" />
          </div>
        </div>

        <div className="rounded-lg border border-[#2c2140] bg-[#241930] p-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Stakeholder pulse</h2>
            <Users size={18} className="text-[#2dd4bf]" />
          </div>
          <div className="mt-5 space-y-4">
            {stakeholders.map(([name, value]) => (
              <div key={name}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-[#d7c9e5]">{name}</span>
                  <strong>{value}% aligned</strong>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <span className="block h-2 rounded-full bg-[#2dd4bf]" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#dfd7cc] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece4dc] p-4">
          <div>
            <h2 className="text-base font-bold">Initiative triage</h2>
            <p className="text-xs text-[#6b6174]">Filter business requests by stage, owner, and value.</p>
          </div>
          <div className="flex gap-2 max-md:w-full max-md:flex-col">
            <label className="flex h-10 items-center gap-2 rounded-md border border-[#d0c5b8] px-3 max-md:w-full">
              <Search size={16} className="text-[#6b6174]" />
              <input
                className="w-56 bg-transparent text-sm outline-none max-md:w-full"
                placeholder="Search initiatives"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label className="relative flex h-10 items-center gap-2 rounded-md border border-[#d0c5b8] bg-white px-3 max-md:w-full">
              <Filter size={16} className="text-[#6b6174]" />
              <select
                className="w-40 appearance-none bg-transparent text-sm outline-none max-md:w-full"
                value={stage}
                onChange={(event) => setStage(event.target.value)}
              >
                {stageOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
              <ChevronDown size={15} className="text-[#6b6174]" />
            </label>
          </div>
        </div>
        <div className="grid divide-y divide-[#ece4dc]">
          {filtered.map((item) => (
            <InitiativeRow item={item} key={item.id} onOpen={() => onOpenPrioritization(item.id)} />
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-sm text-[#6b6174]">No matching initiatives. Clear the search or choose another stage.</div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-[0.9fr_1.1fr] gap-5 max-xl:grid-cols-1">
        <Panel title="Process bottleneck map" icon={LineChart}>
          <div className="space-y-4">
            {processSteps.map(([label, count, detail]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-semibold">{label}</span>
                  <span className="text-[#6b6174]">{count} items</span>
                </div>
                <div className="h-8 rounded-md bg-[#eee7df]">
                  <span
                    className="flex h-8 items-center rounded-md bg-[#fde68a] px-3 text-xs font-bold text-[#6b3f00]"
                    style={{ width: `${Math.min(count * 3, 100)}%` }}
                  >
                    {detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Analyst deliverables" icon={ClipboardCheck}>
          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            {[
              ['Requirement writing', 'Acceptance criteria, scope, and decision history.'],
              ['Stakeholder alignment', 'Owner visibility and readiness tracking.'],
              ['Data storytelling', 'KPI cards, risk signals, and process flow counts.'],
              ['Delivery handoff', 'Build-ready backlog packaging for teams.'],
            ].map(([title, text]) => (
              <div className="rounded-md border border-[#ece4dc] bg-[#fffdf9] p-4" key={title}>
                <Clock3 size={17} className="text-[#be123c]" />
                <strong className="mt-3 block text-sm">{title}</strong>
                <p className="mt-1 text-xs leading-5 text-[#6b6174]">{text}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  )
}

function RequirementsView({ onCopy }) {
  return (
    <Panel title="Requirements traceability" icon={ClipboardList}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-[#6b6174]">
              <th className="border-b border-[#ece4dc] pb-3">ID</th>
              <th className="border-b border-[#ece4dc] pb-3">Requirement</th>
              <th className="border-b border-[#ece4dc] pb-3">Owner</th>
              <th className="border-b border-[#ece4dc] pb-3">Status</th>
              <th className="border-b border-[#ece4dc] pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((item) => (
              <tr key={item.id}>
                <td className="border-b border-[#f0e9e2] py-4 font-bold">{item.id}</td>
                <td className="border-b border-[#f0e9e2] py-4 pr-4">
                  <strong>{item.text}</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#6b6174]">{item.acceptance}</span>
                </td>
                <td className="border-b border-[#f0e9e2] py-4">{item.owner}</td>
                <td className="border-b border-[#f0e9e2] py-4"><RequirementStatus value={item.status} /></td>
                <td className="border-b border-[#f0e9e2] py-4">
                  <button className="rounded-md bg-[#0f766e] px-3 py-2 text-xs font-bold text-white" onClick={() => onCopy(`${item.id} summary copied to handoff notes.`)}>
                    Add to handoff
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function StakeholdersView({ onSchedule }) {
  return (
    <section className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
      {stakeholders.map(([name, value, concern, nextAction]) => (
        <div className="rounded-lg border border-[#dfd7cc] bg-white p-5" key={name}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">{name}</h2>
              <p className="mt-1 text-sm text-[#6b6174]">{concern}</p>
            </div>
            <span className="rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-bold text-[#0369a1]">{value}% aligned</span>
          </div>
          <div className="mt-5 h-2 rounded-full bg-[#eee7df]">
            <span className="block h-2 rounded-full bg-[#6366f1]" style={{ width: `${value}%` }} />
          </div>
          <button
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-[#d0c5b8] px-3 text-sm font-bold hover:border-[#6366f1] hover:text-[#4f46e5]"
            onClick={() => onSchedule(`${name} next action queued: ${nextAction}`)}
          >
            <Clock3 size={16} />
            Queue next action
          </button>
        </div>
      ))}
    </section>
  )
}

function RisksView({ acknowledgedRisks, onToggleRisk }) {
  return (
    <Panel title="Risk and blocker log" icon={ShieldCheck}>
      <div className="grid gap-3">
        {risks.map((item) => {
          const acknowledged = acknowledgedRisks.has(item.id)
          return (
            <div className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-[#ece4dc] p-4 max-md:grid-cols-1" key={item.id}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{item.risk}</strong>
                  <RiskLevel value={item.level} />
                  {acknowledged && <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[10px] font-bold uppercase text-[#166534]">acknowledged</span>}
                </div>
                <p className="mt-2 text-sm text-[#6b6174]">{item.project} · {item.action}</p>
                <span className="mt-1 block text-xs text-[#8a7d92]">Owner: {item.owner} · Status: {item.status}</span>
              </div>
              <button className="h-10 rounded-md bg-[#241930] px-3 text-xs font-bold text-white" onClick={() => onToggleRisk(item.id)}>
                {acknowledged ? 'Reopen' : 'Acknowledge'}
              </button>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function DecisionLog({ reviewedDecisions, onToggleDecision }) {
  return (
    <Panel title="Decision log" icon={MessageSquareText}>
      <div className="grid gap-3">
        {decisions.map(([id, decision, owner, date, impact]) => {
          const reviewed = reviewedDecisions.has(id)
          return (
            <article className="rounded-md border border-[#ece4dc] bg-[#fffdf9] p-4" key={id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#fee2e2] px-2 py-1 text-[10px] font-bold text-[#be123c]">{id}</span>
                    <strong>{decision}</strong>
                  </div>
                  <p className="mt-2 text-sm text-[#6b6174]">{impact}</p>
                  <span className="mt-1 block text-xs text-[#8a7d92]">{owner} · Decision needed by {date}</span>
                </div>
                <button className="h-10 rounded-md bg-[#0f766e] px-3 text-xs font-bold text-white" onClick={() => onToggleDecision(id)}>
                  {reviewed ? 'Mark unread' : 'Mark reviewed'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </Panel>
  )
}

function PrioritizationView({ rankedInitiatives, selected, selectedInitiative, setSelectedInitiative }) {
  return (
    <section className="grid grid-cols-[1fr_0.78fr] gap-5 max-xl:grid-cols-1">
      <Panel title="Value ranking" icon={ArrowUpDown}>
        <div className="grid gap-3">
          {rankedInitiatives.map((item, index) => {
            const score = Math.round(item.impact - item.effort / 2)
            return (
              <button
                className={`grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-md border p-3 text-left max-sm:grid-cols-1 ${
                  selectedInitiative === item.id ? 'border-[#0f766e] bg-[#ecfeff]' : 'border-[#ece4dc] bg-white hover:border-[#0f766e]'
                }`}
                key={item.id}
                onClick={() => setSelectedInitiative(item.id)}
              >
                <span className="grid h-10 w-10 place-items-center rounded-md bg-[#241930] text-sm font-bold text-white">#{index + 1}</span>
                <span>
                  <strong className="block">{item.name}</strong>
                  <small className="text-[#6b6174]">{item.owner} · {item.stage}</small>
                </span>
                <span className="rounded-full bg-[#fde68a] px-3 py-1 text-xs font-bold text-[#6b3f00]">Score {score}</span>
              </button>
            )
          })}
        </div>
      </Panel>

      <div className="rounded-lg border border-[#dfd7cc] bg-[#241930] p-5 text-white">
        <Target className="text-[#2dd4bf]" size={20} />
        <h2 className="mt-3 text-lg font-bold">{selected.name}</h2>
        <p className="mt-2 text-sm leading-6 text-[#eadff2]">{selected.summary}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <DarkMetric label="Impact" value={selected.impact} />
          <DarkMetric label="Effort" value={selected.effort} />
          <DarkMetric label="Due" value={selected.due} />
          <DarkMetric label="Health" value={selected.health} />
        </div>
        <div className="mt-5 rounded-md border border-white/10 bg-white/6 p-4">
          <span className="text-xs font-bold uppercase text-[#2dd4bf]">Recommended next step</span>
          <p className="mt-2 text-sm text-white">{selected.nextStep}</p>
        </div>
      </div>
    </section>
  )
}

function InitiativeRow({ item, onOpen }) {
  return (
    <article className="grid grid-cols-[1.2fr_130px_110px_120px_92px] items-center gap-4 p-4 max-xl:grid-cols-[1fr_1fr] max-sm:grid-cols-1">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold">{item.name}</h3>
          <Status value={item.health} />
        </div>
        <p className="mt-1 text-sm leading-6 text-[#6b6174]">{item.summary}</p>
      </div>
      <DataPair label="Owner" value={item.owner} />
      <DataPair label="Stage" value={item.stage} />
      <div>
        <div className="mb-2 flex justify-between text-xs">
          <span>Impact</span>
          <strong>{item.impact}</strong>
        </div>
        <div className="h-2 rounded-full bg-[#eee7df]">
          <span className="block h-2 rounded-full bg-[#0f766e]" style={{ width: `${item.impact}%` }} />
        </div>
      </div>
      <button className="h-10 rounded-md bg-[#241930] px-3 text-xs font-bold text-white" onClick={onOpen}>
        Open
      </button>
    </article>
  )
}

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-lg border border-[#ece4dc] bg-[#fffdf9] p-4">
      <Icon size={18} className="text-[#be123c]" />
      <span className="mt-3 block text-xs text-[#6b6174]">{label}</span>
      <strong className="mt-1 block text-2xl">{value}</strong>
      <small className="text-xs text-[#6b6174]">{detail}</small>
    </div>
  )
}

function DarkMetric({ label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/6 p-3">
      <span className="text-xs text-[#d7c9e5]">{label}</span>
      <strong className="mt-1 block text-lg">{value}</strong>
    </div>
  )
}

function DataPair({ label, value }) {
  return (
    <div className="text-sm">
      <span className="block text-xs text-[#6b6174]">{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Status({ value }) {
  const styles = {
    Healthy: 'bg-[#dcfce7] text-[#166534]',
    'At risk': 'bg-[#fee2e2] text-[#be123c]',
    'Needs review': 'bg-[#fde68a] text-[#6b3f00]',
  }
  return <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${styles[value]}`}>{value}</span>
}

function RequirementStatus({ value }) {
  const styles = {
    Ready: 'bg-[#ccfbf1] text-[#0f766e]',
    Drafting: 'bg-[#fee2e2] text-[#be123c]',
    Validated: 'bg-[#e0e7ff] text-[#4338ca]',
    Approved: 'bg-[#dcfce7] text-[#166534]',
  }
  return <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${styles[value]}`}>{value}</span>
}

function RiskLevel({ value }) {
  const styles = {
    High: 'bg-[#fee2e2] text-[#be123c]',
    Medium: 'bg-[#fde68a] text-[#6b3f00]',
  }
  return <span className={`h-max rounded-full px-2 py-1 text-[10px] font-bold uppercase ${styles[value]}`}>{value}</span>
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-lg border border-[#dfd7cc] bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">{title}</h2>
        <Icon size={18} className="text-[#0f766e]" />
      </div>
      {children}
    </section>
  )
}

export default App

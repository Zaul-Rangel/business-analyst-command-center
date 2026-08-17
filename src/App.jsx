import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
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
  },
]

const requirements = [
  ['BR-104', 'Auto-route high-value exceptions to finance leads', 'Ready', 'Billing exception dashboard'],
  ['BR-118', 'Capture reason codes before escalation', 'Drafting', 'Claims intake redesign'],
  ['BR-127', 'Expose release impact score on backlog items', 'Validated', 'Customer portal backlog'],
  ['BR-132', 'Require compliance evidence before vendor activation', 'Approved', 'Vendor onboarding controls'],
]

const risks = [
  ['Duplicate intake fields', 'High', 'Claims intake redesign', 'Workshop with frontline users'],
  ['Unclear source of truth', 'Medium', 'Billing exception dashboard', 'Data dictionary review'],
  ['Stakeholder signoff delay', 'Medium', 'Customer portal backlog', 'Decision log reminders'],
]

const processSteps = [
  ['Request', 28, 'New work entering intake'],
  ['Triage', 17, 'Needs owner or scope'],
  ['Analysis', 12, 'Requirements in progress'],
  ['Approval', 6, 'Waiting on decisions'],
  ['Build-ready', 9, 'Ready for delivery'],
]

const stageOptions = ['All stages', 'Discovery', 'Validation', 'Ready for build', 'Approved']

function App() {
  const [stage, setStage] = useState('All stages')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    return initiatives.filter((item) => {
      const stageMatch = stage === 'All stages' || item.stage === stage
      const queryMatch = `${item.name} ${item.owner} ${item.summary}`.toLowerCase().includes(query.toLowerCase())
      return stageMatch && queryMatch
    })
  }, [stage, query])

  const averageImpact = Math.round(initiatives.reduce((sum, item) => sum + item.impact, 0) / initiatives.length)
  const buildReady = initiatives.filter((item) => ['Ready for build', 'Approved'].includes(item.stage)).length
  const atRisk = initiatives.filter((item) => item.health !== 'Healthy').length

  return (
    <main className="min-h-screen bg-[#f6f7f3] text-[#17211d]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1540px] grid-cols-[250px_minmax(0,1fr)] max-lg:grid-cols-1">
        <aside className="border-r border-[#dfe4dc] bg-[#17211d] px-5 py-6 text-white max-lg:hidden">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#9fe29f] text-[#152119]">
              <BarChart3 size={20} />
            </span>
            <div>
              <strong className="block text-sm">BA Command</strong>
              <span className="text-xs text-[#a7b5ad]">Portfolio workspace</span>
            </div>
          </div>
          <nav className="mt-8 space-y-1">
            {[
              ['Dashboard', LayoutDashboard],
              ['Requirements', ClipboardList],
              ['Stakeholders', Users],
              ['Risks', ShieldCheck],
            ].map(([label, Icon], index) => (
              <button
                className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm ${index === 0 ? 'bg-white/10 text-white' : 'text-[#a7b5ad]'}`}
                key={label}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#9fe29f]">
              <Sparkles size={15} />
              Analyst focus
            </div>
            <p className="mt-2 text-xs leading-5 text-[#cbd5ce]">Turn messy requests into ranked, build-ready decisions.</p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-4 border-b border-[#dfe4dc] bg-[#f6f7f3]/95 px-8 backdrop-blur max-md:flex-col max-md:items-stretch max-md:px-4 max-md:py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3a7a4f]">Business analyst portfolio app</p>
              <h1 className="mt-1 text-2xl font-bold tracking-normal text-[#111815]">Decision Operations Dashboard</h1>
            </div>
            <div className="flex gap-2 max-sm:grid max-sm:grid-cols-2">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#cfd8cf] bg-white px-3 text-xs font-semibold">
                <MessageSquareText size={16} />
                Decision log
              </button>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#1f6f49] px-3 text-xs font-semibold text-white">
                <Target size={16} />
                Prioritize
              </button>
            </div>
          </header>

          <div className="space-y-5 px-8 py-6 max-md:px-4">
            <section className="grid grid-cols-[1.35fr_0.65fr] gap-5 max-xl:grid-cols-1">
              <div className="rounded-lg border border-[#dfe4dc] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-normal">Portfolio-grade analyst control room</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667267]">
                      A focused workspace for business analysts to organize requests, trace requirements, watch risks,
                      and translate stakeholder needs into delivery-ready priorities.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#edf7ee] px-3 py-1 text-xs font-bold text-[#23653d]">
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

              <div className="rounded-lg border border-[#dfe4dc] bg-[#18231f] p-5 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold">Stakeholder pulse</h2>
                  <Users size={18} className="text-[#9fe29f]" />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ['Operations', 84],
                    ['Finance', 76],
                    ['Product', 69],
                    ['Compliance', 91],
                  ].map(([name, value]) => (
                    <div key={name}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-[#cbd5ce]">{name}</span>
                        <strong>{value}% aligned</strong>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <span className="block h-2 rounded-full bg-[#9fe29f]" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#dfe4dc] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6ebe4] p-4">
                <div>
                  <h2 className="text-base font-bold">Initiative triage</h2>
                  <p className="text-xs text-[#667267]">Filter business requests by stage, owner, and value.</p>
                </div>
                <div className="flex gap-2 max-md:w-full max-md:flex-col">
                  <label className="flex h-10 items-center gap-2 rounded-md border border-[#cfd8cf] px-3 max-md:w-full">
                    <Search size={16} className="text-[#667267]" />
                    <input
                      className="w-56 bg-transparent text-sm outline-none max-md:w-full"
                      placeholder="Search initiatives"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </label>
                  <label className="relative flex h-10 items-center gap-2 rounded-md border border-[#cfd8cf] bg-white px-3 max-md:w-full">
                    <Filter size={16} className="text-[#667267]" />
                    <select className="w-40 appearance-none bg-transparent text-sm outline-none max-md:w-full" value={stage} onChange={(event) => setStage(event.target.value)}>
                      {stageOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                    <ChevronDown size={15} className="text-[#667267]" />
                  </label>
                </div>
              </div>
              <div className="grid divide-y divide-[#e9ede8]">
                {filtered.map((item) => (
                  <article className="grid grid-cols-[1.2fr_130px_110px_120px] items-center gap-4 p-4 max-lg:grid-cols-1" key={item.id}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{item.name}</h3>
                        <Status value={item.health} />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#667267]">{item.summary}</p>
                    </div>
                    <div className="text-sm">
                      <span className="block text-xs text-[#667267]">Owner</span>
                      <strong>{item.owner}</strong>
                    </div>
                    <div className="text-sm">
                      <span className="block text-xs text-[#667267]">Stage</span>
                      <strong>{item.stage}</strong>
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span>Impact</span>
                        <strong>{item.impact}</strong>
                      </div>
                      <div className="h-2 rounded-full bg-[#eef2ed]">
                        <span className="block h-2 rounded-full bg-[#2f7d52]" style={{ width: `${item.impact}%` }} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-[1fr_0.9fr] gap-5 max-xl:grid-cols-1">
              <Panel title="Requirements traceability" icon={ClipboardList}>
                <div className="space-y-3">
                  {requirements.map(([id, text, status, project]) => (
                    <div className="rounded-md border border-[#e3e8e1] p-3" key={id}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm">{id}</strong>
                        <span className="rounded-full bg-[#eef3ee] px-2 py-1 text-[10px] font-bold uppercase text-[#4f5e52]">{status}</span>
                      </div>
                      <p className="mt-2 text-sm text-[#303a34]">{text}</p>
                      <span className="mt-2 block text-xs text-[#667267]">{project}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Risk and blocker log" icon={ShieldCheck}>
                <div className="space-y-3">
                  {risks.map(([risk, level, project, action]) => (
                    <div className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-[#e3e8e1] p-3" key={risk}>
                      <div>
                        <strong className="text-sm">{risk}</strong>
                        <p className="mt-1 text-xs leading-5 text-[#667267]">{project} · {action}</p>
                      </div>
                      <span className={`h-max rounded-full px-2 py-1 text-[10px] font-bold uppercase ${level === 'High' ? 'bg-[#fff0ed] text-[#a44332]' : 'bg-[#fff5df] text-[#875712]'}`}>
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>

            <section className="grid grid-cols-[0.9fr_1.1fr] gap-5 max-xl:grid-cols-1">
              <Panel title="Process bottleneck map" icon={LineChart}>
                <div className="space-y-4">
                  {processSteps.map(([label, count, detail]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="font-semibold">{label}</span>
                        <span className="text-[#667267]">{count} items</span>
                      </div>
                      <div className="h-8 rounded-md bg-[#edf1ec]">
                        <span className="flex h-8 items-center rounded-md bg-[#bfe3c5] px-3 text-xs font-bold text-[#173a24]" style={{ width: `${Math.min(count * 3, 100)}%` }}>
                          {detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <div className="rounded-lg border border-[#dfe4dc] bg-[#fdfdfb] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold">Analyst deliverables</h2>
                    <p className="text-xs text-[#667267]">What this project demonstrates on a portfolio.</p>
                  </div>
                  <ArrowUpRight size={18} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 max-md:grid-cols-1">
                  {[
                    ['Requirement writing', 'Acceptance criteria, scope, and decision history.'],
                    ['Stakeholder alignment', 'Owner visibility and readiness tracking.'],
                    ['Data storytelling', 'KPI cards, risk signals, and process flow counts.'],
                    ['Delivery handoff', 'Build-ready backlog packaging for teams.'],
                  ].map(([title, text]) => (
                    <div className="rounded-md border border-[#e3e8e1] bg-white p-4" key={title}>
                      <Clock3 size={17} className="text-[#2f7d52]" />
                      <strong className="mt-3 block text-sm">{title}</strong>
                      <p className="mt-1 text-xs leading-5 text-[#667267]">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-lg border border-[#e2e7df] bg-[#fbfcfa] p-4">
      <Icon size={18} className="text-[#2f7d52]" />
      <span className="mt-3 block text-xs text-[#667267]">{label}</span>
      <strong className="mt-1 block text-2xl">{value}</strong>
      <small className="text-xs text-[#667267]">{detail}</small>
    </div>
  )
}

function Status({ value }) {
  const styles = {
    Healthy: 'bg-[#edf8ef] text-[#20603a]',
    'At risk': 'bg-[#fff0ed] text-[#9a3b2d]',
    'Needs review': 'bg-[#fff5df] text-[#805312]',
  }
  return <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${styles[value]}`}>{value}</span>
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-lg border border-[#dfe4dc] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold">{title}</h2>
        <Icon size={18} className="text-[#2f7d52]" />
      </div>
      {children}
    </section>
  )
}

export default App

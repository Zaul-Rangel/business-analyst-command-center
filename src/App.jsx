import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, BarChart3, CheckSquare, ClipboardList, Download, FileText, LayoutDashboard, Menu, Plus, RotateCcw, Search, ShieldCheck, Trash2, Users, X } from 'lucide-react'

const seed = {
  initiatives: [
    {id:'I-101',name:'Claims intake redesign',owner:'Maya Chen',status:'Discovery',score:82,due:'2026-09-10'},
    {id:'I-102',name:'Billing exception dashboard',owner:'Jordan Ellis',status:'Build ready',score:91,due:'2026-08-28'},
    {id:'I-103',name:'Customer portal backlog',owner:'Sam Rivera',status:'Validation',score:73,due:'2026-09-18'},
  ],
  requirements: [
    {id:'BR-104',name:'Route high-value exceptions to finance leads',owner:'Jordan Ellis',status:'Validated',score:88,due:'2026-08-25'},
    {id:'BR-118',name:'Capture reason codes before escalation',owner:'Maya Chen',status:'Draft',score:76,due:'2026-09-02'},
  ],
  risks: [
    {id:'R-07',name:'Duplicate intake fields',owner:'Maya Chen',status:'High',score:86,due:'2026-08-22'},
    {id:'R-11',name:'Stakeholder signoff delay',owner:'Sam Rivera',status:'Medium',score:61,due:'2026-08-30'},
  ],
  stakeholders: [
    {id:'S-01',name:'Avery Brooks — Operations VP',owner:'Maya Chen',status:'Supportive',score:90,due:'2026-08-21'},
    {id:'S-02',name:'Drew Patel — Finance Director',owner:'Jordan Ellis',status:'Neutral',score:68,due:'2026-08-23'},
  ],
  decisions: [
    {id:'D-14',name:'Use reason-code taxonomy v2',owner:'Jordan Ellis',status:'Approved',score:84,due:'2026-08-16'},
    {id:'D-15',name:'Phase portal release by customer tier',owner:'Sam Rivera',status:'Pending',score:72,due:'2026-08-26'},
  ],
}

const config = {
  initiatives:{label:'Initiatives',icon:BarChart3,statuses:['Discovery','Validation','Build ready','Complete']},
  requirements:{label:'Requirements',icon:ClipboardList,statuses:['Draft','In review','Validated','Approved']},
  risks:{label:'Risks',icon:ShieldCheck,statuses:['Low','Medium','High','Mitigated']},
  stakeholders:{label:'Stakeholders',icon:Users,statuses:['Supportive','Neutral','Resistant','Engaged']},
  decisions:{label:'Decision log',icon:FileText,statuses:['Pending','Approved','Rejected','Deferred']},
}
const cloneSeed=()=>JSON.parse(JSON.stringify(seed))

export default function App(){
  const [data,setData]=useState(()=>{try{return JSON.parse(localStorage.getItem('ba-command-data'))||cloneSeed()}catch{return cloneSeed()}})
  const [page,setPage]=useState('dashboard'), [menu,setMenu]=useState(false), [query,setQuery]=useState(''), [filter,setFilter]=useState('All'), [sort,setSort]=useState('score'), [modal,setModal]=useState(null), [selected,setSelected]=useState([])
  useEffect(()=>localStorage.setItem('ba-command-data',JSON.stringify(data)),[data])
  useEffect(()=>{setSelected([]);setQuery('');setFilter('All')},[page])
  const all=Object.values(data).flat(), avg=all.length?Math.round(all.reduce((s,x)=>s+Number(x.score),0)/all.length):0
  const nav=[['dashboard','Overview',LayoutDashboard],...Object.entries(config).map(([k,v])=>[k,v.label,v.icon])]
  const items=page==='dashboard'?[]:data[page]
  const visible=items.filter(x=>(filter==='All'||x.status===filter)&&`${x.id} ${x.name} ${x.owner}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='score'?b.score-a.score:sort==='due'?a.due.localeCompare(b.due):a.name.localeCompare(b.name))
  const save=(item)=>{setData(d=>({...d,[page]:modal.mode==='edit'?d[page].map(x=>x.id===item.id?item:x):[...d[page],item]}));setModal(null)}
  const remove=(ids)=>{if(confirm(`Delete ${ids.length} selected item${ids.length===1?'':'s'}? This cannot be undone.`)){setData(d=>({...d,[page]:d[page].filter(x=>!ids.includes(x.id))}));setSelected([])}}
  const bulkStatus=(status)=>{setData(d=>({...d,[page]:d[page].map(x=>selected.includes(x.id)?{...x,status}:x)}));setSelected([])}
  const reset=()=>{if(confirm('Reset all workspace data to the fictional demo dataset?')){setData(cloneSeed());localStorage.removeItem('ba-command-data')}}
  const exportCsv=()=>{const rows=[['Type','ID','Name','Owner','Status','Priority','Due'],...Object.entries(data).flatMap(([type,list])=>list.map(x=>[type,x.id,x.name,x.owner,x.status,x.score,x.due]))];const safe=value=>{const text=String(value);return /^[=+\-@]/.test(text)?`'${text}`:text};const csv=rows.map(r=>r.map(v=>`"${safe(v).replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='analyst-command-center.csv';a.click();URL.revokeObjectURL(a.href)}
  return <main className="min-h-screen bg-slate-950 text-slate-100">
    <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[255px_1fr]">
      <aside className={`${menu?'fixed inset-0 z-40 flex':'hidden'} flex-col bg-slate-950 p-5 lg:static lg:flex lg:border-r lg:border-slate-800`}>
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400"><BarChart3/></span><div><b>AnalystOS</b><small className="block text-slate-400">Decision workspace</small></div><button className="ml-auto lg:hidden" onClick={()=>setMenu(false)} aria-label="Close menu"><X/></button></div>
        <nav className="mt-8 space-y-1" aria-label="Primary navigation">{nav.map(([key,label,Icon])=><button key={key} aria-current={page===key?'page':undefined} onClick={()=>{setPage(key);setMenu(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${page===key?'bg-indigo-500 text-white':'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><Icon size={18}/>{label}<span className="ml-auto text-xs">{key==='dashboard'?'':data[key].length}</span></button>)}</nav>
        <div className="mt-auto rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-4 text-xs leading-5 text-indigo-100">All records are fictional seeded portfolio data and persist only in this browser.</div>
      </aside>
      <section className="min-w-0 bg-slate-100 text-slate-900">
        <header className="sticky top-0 z-30 flex min-h-20 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7"><button className="lg:hidden" onClick={()=>setMenu(true)} aria-label="Open menu"><Menu/></button><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Business analysis command center</p><h1 className="text-xl font-black sm:text-2xl">{page==='dashboard'?'Portfolio overview':config[page].label}</h1></div><div className="ml-auto hidden gap-2 sm:flex"><button className="btn secondary" onClick={reset}><RotateCcw size={16}/>Reset demo</button><button className="btn primary" onClick={exportCsv}><Download size={16}/>Export CSV</button></div></header>
        <div className="space-y-5 p-4 sm:p-7">
          {page==='dashboard'?<Dashboard data={data} avg={avg} go={setPage} exportCsv={exportCsv}/>:<>
            <div className="flex flex-wrap gap-2"><label className="search"><span className="sr-only">Search records</span><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${config[page].label.toLowerCase()}`}/></label><select aria-label="Filter by status" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{config[page].statuses.map(x=><option key={x}>{x}</option>)}</select><select aria-label="Sort records" value={sort} onChange={e=>setSort(e.target.value)}><option value="score">Priority: high first</option><option value="due">Due date</option><option value="name">Name</option></select><button className="btn primary ml-auto" onClick={()=>setModal({mode:'add'})}><Plus size={17}/>Add record</button></div>
            {selected.length>0&&<div className="flex flex-wrap items-center gap-2 rounded-xl bg-indigo-950 p-3 text-white"><b>{selected.length} selected</b><select aria-label="Change status for selected records" className="ml-auto text-slate-900" defaultValue="" onChange={e=>e.target.value&&bulkStatus(e.target.value)}><option value="" disabled>Change status…</option>{config[page].statuses.map(x=><option key={x}>{x}</option>)}</select><button className="btn danger" onClick={()=>remove(selected)}><Trash2 size={16}/>Delete</button></div>}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="table-head"><input type="checkbox" aria-label="Select all" checked={visible.length>0&&visible.every(x=>selected.includes(x.id))} onChange={e=>setSelected(e.target.checked?visible.map(x=>x.id):[])}/><span>Record</span><span>Owner</span><span>Status</span><span>Priority</span><span>Due</span><span></span></div>{visible.length?visible.map(x=><article className="table-row" key={x.id}><input type="checkbox" aria-label={`Select ${x.name}`} checked={selected.includes(x.id)} onChange={e=>setSelected(s=>e.target.checked?[...s,x.id]:s.filter(id=>id!==x.id))}/><div><b>{x.name}</b><small>{x.id}</small></div><span data-label="Owner">{x.owner}</span><span data-label="Status"><em>{x.status}</em></span><span data-label="Priority"><b>{x.score}</b>/100</span><span data-label="Due">{x.due}</span><div className="row-actions"><button onClick={()=>setModal({mode:'edit',item:x})}>Edit</button><button aria-label={`Delete ${x.name}`} onClick={()=>remove([x.id])}><Trash2 size={17}/></button></div></article>):<Empty add={()=>setModal({mode:'add'})}/>}</section>
          </>}
          <div className="flex gap-2 sm:hidden"><button className="btn secondary flex-1" onClick={reset}>Reset demo</button><button className="btn primary flex-1" onClick={exportCsv}>Export CSV</button></div>
        </div>
      </section>
    </div>{modal&&<RecordModal cfg={config[page]} initial={modal.item} mode={modal.mode} existing={data[page]} close={()=>setModal(null)} save={save}/>}</main>
}

function Dashboard({data,avg,go,exportCsv}){const openRisks=data.risks.filter(x=>x.status!=='Mitigated').length, ready=data.initiatives.filter(x=>['Build ready','Complete'].includes(x.status)).length, approved=data.decisions.filter(x=>x.status==='Approved').length;return <><section className="hero"><div><span>FICTIONAL DEMO WORKSPACE</span><h2>Turn ambiguity into decisions teams can ship.</h2><p>Track initiatives, requirements, people, risk, and governance in one traceable analyst workspace.</p><button className="btn light" onClick={()=>go('initiatives')}>Open initiative portfolio</button></div><CheckSquare className="hidden text-cyan-300 sm:block" size={92}/></section><div className="metrics"><Metric label="Average priority" value={`${avg}/100`}/><Metric label="Build ready" value={ready}/><Metric label="Open risks" value={openRisks}/><Metric label="Approved decisions" value={approved}/></div><div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><section className="card"><h3>Workstream health</h3><p className="muted">Live totals derived from saved records.</p><div className="mt-5 space-y-4">{Object.entries(config).map(([k,v])=>{const Icon=v.icon;return <button onClick={()=>go(k)} className="workstream" key={k}><Icon size={19}/><span>{v.label}</span><b>{data[k].length}</b><div><i style={{width:`${Math.min(data[k].length*24,100)}%`}}/></div></button>})}</div></section><section className="card"><h3>Executive briefing</h3><p className="muted">A concise, data-derived delivery snapshot.</p><ul className="brief"><li><b>{data.requirements.length}</b> requirements are being traced.</li><li><b>{openRisks}</b> risks still require mitigation.</li><li><b>{data.stakeholders.length}</b> stakeholders are mapped.</li><li><b>{approved}</b> decisions have approval evidence.</li></ul><button className="btn primary w-full" onClick={exportCsv}><Download size={16}/>Download executive data</button></section></div></>}
function Metric({label,value}){return <div className="metric"><small>{label}</small><strong>{value}</strong></div>}
function Empty({add}){return <div className="empty"><ClipboardList size={36}/><b>No matching records</b><p>Adjust the filters or create a new record.</p><button className="btn primary" onClick={add}><Plus size={16}/>Add record</button></div>}

function RecordModal({cfg,initial,mode,existing,close,save}){
  const [form,setForm]=useState(initial||{id:'',name:'',owner:'',status:cfg.statuses[0],score:70,due:new Date().toISOString().slice(0,10)})
  const [error,setError]=useState('')
  const modalRef=useRef(null)
  const returnFocusRef=useRef(document.activeElement)
  const titleId='record-dialog-title'

  useEffect(()=>{
    const dialog=modalRef.current
    const returnFocus=returnFocusRef.current
    const focusable=()=>[...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    dialog.querySelector('input:not([disabled]), textarea:not([disabled]), select:not([disabled])')?.focus()
    const onKeyDown=event=>{
      if(event.key==='Escape'){event.preventDefault();close();return}
      if(event.key!=='Tab')return
      const elements=focusable()
      if(!elements.length)return
      const first=elements[0],last=elements[elements.length-1]
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
    dialog.addEventListener('keydown',onKeyDown)
    return()=>{
      dialog.removeEventListener('keydown',onKeyDown)
      returnFocus?.focus?.()
    }
  },[close])

  const submit=event=>{
    event.preventDefault()
    const score=Number(form.score)
    if(!form.id.trim()||!form.name.trim()||!form.owner.trim())return setError('ID, name, and owner are required.')
    if(!form.due||Number.isNaN(new Date(`${form.due}T00:00:00`).getTime()))return setError('A valid due date is required.')
    if(form.score===''||!Number.isFinite(score)||score<0||score>100)return setError('Priority must be a number from 0 through 100.')
    if(mode==='add'&&existing.some(x=>x.id.toLowerCase()===form.id.toLowerCase()))return setError('That ID already exists.')
    save({...form,score})
  }
  const field=(key,value)=>setForm(current=>({...current,[key]:value}))

  return <div className="modal-backdrop" onMouseDown={event=>event.target===event.currentTarget&&close()}>
    <form ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onSubmit={submit}>
      <div className="flex items-center"><div><small>{mode==='edit'?'UPDATE RECORD':'CREATE RECORD'}</small><h2 id={titleId}>{mode==='edit'?'Edit':'Add'} {cfg.label.slice(0,-1)}</h2></div><button type="button" className="ml-auto" onClick={close} aria-label="Close dialog"><X/></button></div>
      {error&&<p className="error" role="alert"><AlertTriangle size={16}/>{error}</p>}
      <label>ID<input autoFocus value={form.id} disabled={mode==='edit'} onChange={event=>field('id',event.target.value)} placeholder="e.g. I-104"/></label>
      <label>Name / summary<textarea value={form.name} onChange={event=>field('name',event.target.value)} placeholder="Describe the record"/></label>
      <div className="grid gap-3 sm:grid-cols-2"><label>Owner<input value={form.owner} onChange={event=>field('owner',event.target.value)} placeholder="Full name"/></label><label>Status<select value={form.status} onChange={event=>field('status',event.target.value)}>{cfg.statuses.map(x=><option key={x}>{x}</option>)}</select></label><label>Priority score<input required type="number" min="0" max="100" value={form.score} onChange={event=>field('score',event.target.value)}/></label><label>Due date<input required type="date" value={form.due} onChange={event=>field('due',event.target.value)}/></label></div>
      <div className="flex justify-end gap-2"><button type="button" className="btn secondary" onClick={close}>Cancel</button><button className="btn primary">{mode==='edit'?'Save changes':'Create record'}</button></div>
    </form>
  </div>
}

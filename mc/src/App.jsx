import React, { useState, useEffect, useCallback } from 'react'
import { api } from './api.js'
import Auth from './Auth.jsx'

// ── constants ──────────────────────────────────────────────────────────────
const BHOLAT_C = {Davolanmoqda:'#0ea5e9',Nazoratda:'#f59e0b',Kritik:'#ef4444',Sogaydi:'#10b981',Reabilitatsiya:'#8b5cf6'}
const UHOLAT_C = {Kutilmoqda:'#f59e0b',Tugallandi:'#10b981',Jarayonda:'#0ea5e9',Rejalashtirilgan:'#8b5cf6',Bekor:'#ef4444'}
const SHOLAT_C = {'Ish joyida':'#10b981',Operatsiyada:'#f59e0b',Tatilda:'#94a3b8'}
const DHOLAT_C = {Normal:'#10b981',Etiborli:'#f59e0b',Kam:'#ef4444'}
const SH_COLS  = ['#0ea5e9','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#ec4899','#14b8a6']
const MUTAXASSISLAR = ['Kardiolog','Endokrinolog','Pulmonolog','Ortoped','Ginekolog','Nevropatolog','Jarroh','Terapevt','Pediatr','Okulist']
const DORI_KATS = ['Kardiologiya','Endokrinologiya','Umumiy','Pulmonologiya','Ortopediya','Nevrologiya','Gastroenterologiya','Onkologiya']
const OYLIK = [{o:'Okt',n:142},{o:'Noy',n:168},{o:'Dek',n:195},{o:'Yan',n:178},{o:'Fev',n:210},{o:'Mar',n:234}]
// Dynamic date helpers
const _now = new Date()
const TODAY = _now.toISOString().slice(0,10)
const TOMORROW = new Date(_now.getTime()+86400000).toISOString().slice(0,10)

const KUNLAR = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba']
const OYLAR  = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr']

function formatDate(d){
  // d = Date object or today by default
  const dt = d||_now
  return `${KUNLAR[dt.getDay()]}, ${dt.getDate()}-${OYLAR[dt.getMonth()]} ${dt.getFullYear()}`
}
const TODAY_LABEL = formatDate(_now)
const NAV = [
  {id:'dashboard',icon:'⊞',label:'Bosh sahifa',sec:null},
  {id:'bemorlar',icon:'👥',label:'Bemorlar',sec:'Bemorlar'},
  {id:'shifokorlar',icon:'🩺',label:'Shifokorlar',sec:null},
  {id:'yonaltirish',icon:'🔀',label:'Yonaltirish',sec:null},
  {id:'uchrashuvlar',icon:'📅',label:'Uchrashuvlar',sec:'Klinika'},
  {id:'laboratoriya',icon:'🔬',label:'Laboratoriya',sec:null},
  {id:'moliya',icon:'💰',label:'Moliya',sec:null},
  {id:'xonalar',icon:'🛏',label:'Xonalar',sec:'Boshqaruv'},
  {id:'dorilar',icon:'💊',label:'Dorilar',sec:null},
  {id:'vazifalar',icon:'✅',label:'Vazifalar',sec:null},
  {id:'tibbiy_karta',icon:'📋',label:'Tibbiy kartalar',sec:null},
  {id:'statistika',icon:'📊',label:'Statistika',sec:null},
  {id:'xabarlar',icon:'💬',label:'Xabarlar',sec:null},
  {id:'sozlamalar',icon:'⚙',label:'Sozlamalar',sec:'Tizim'},
]

// ── helpers ───────────────────────────────────────────────────────────────
const ini = s => (s||'??').split(' ').map(n=>n[0]).slice(0,2).join('')
const useLoad = (fn, deps=[]) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const reload = useCallback(async () => {
    setLoading(true)
    try { setData(await fn()) } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }, deps)
  useEffect(() => { reload() }, [reload])
  return [data, loading, reload]
}

// ── ui atoms ──────────────────────────────────────────────────────────────
const card = (extra={}) => ({background:'#fff',border:'1px solid #e2e8f0',borderRadius:10,padding:16,...extra})

function Avt({name='?',color='#0ea5e9',size=30}){
  return <div style={{width:size,height:size,borderRadius:'50%',background:color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:Math.floor(size*.36),fontWeight:700,color,flexShrink:0}}>{ini(name)}</div>
}
function Bdg({label='',color='#94a3b8',size=10}){
  return <span style={{fontSize:size,fontWeight:600,padding:'2px 8px',borderRadius:99,background:color+'18',color,border:`1px solid ${color}44`,whiteSpace:'nowrap'}}>{label}</span>
}
function Btn({children,onClick,color='#0ea5e9',danger=false,ghost=false,sm=false,full=false,disabled=false,style={}}){
  const bg  = danger?'#ef4444':ghost?'transparent':color
  const col = danger?'#fff':ghost?color:'#fff'
  const bdr = danger?'#ef4444':color
  return <button disabled={disabled} onClick={onClick} style={{padding:sm?'4px 10px':'8px 16px',background:bg,color:col,border:`1px solid ${bdr}`,borderRadius:7,fontSize:sm?11:12,fontWeight:600,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.6:1,width:full?'100%':undefined,display:'inline-flex',alignItems:'center',gap:5,justifyContent:'center',...style}}>{children}</button>
}
function Inp({label,value,onChange,type='text',placeholder='',options=null,rows=null,required=false}){
  const s={background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:7,padding:'7px 11px',color:'#0f172a',outline:'none',width:'100%',fontSize:13,transition:'border .15s'}
  const onFocus=e=>e.target.style.borderColor='#0ea5e9'
  const onBlur=e=>e.target.style.borderColor='#e2e8f0'
  return (
    <div style={{display:'flex',flexDirection:'column',gap:3}}>
      {label&&<label style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:.5}}>{label}{required&&<span style={{color:'#ef4444'}}> *</span>}</label>}
      {options
        ? <select value={value} onChange={e=>onChange(e.target.value)} style={s} onFocus={onFocus} onBlur={onBlur}>
            {options.map(o=>typeof o==='string'?<option key={o}>{o}</option>:<option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        : rows
          ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...s,resize:'vertical'}} onFocus={onFocus} onBlur={onBlur}/>
          : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} onFocus={onFocus} onBlur={onBlur}/>
      }
    </div>
  )
}
function FormGrid({children}){
  return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>{children}</div>
}
function Full({children}){ return <div style={{gridColumn:'1/-1'}}>{children}</div> }

function Modal({title,onClose,children,wide=false,xl=false}){
  const maxW = xl?780:wide?600:500
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16,backdropFilter:'blur(3px)'}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:'#fff',borderRadius:14,width:'100%',maxWidth:maxW,border:'1px solid #e2e8f0',boxShadow:'0 20px 60px rgba(0,0,0,.2)',maxHeight:'92vh',overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'15px 20px',borderBottom:'1px solid #e2e8f0',flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:800}}>{title}</div>
          <button onClick={onClose} style={{background:'#f1f5f9',border:'none',borderRadius:6,width:28,height:28,fontSize:18,cursor:'pointer',color:'#475569',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>
        <div style={{padding:'18px 20px',overflowY:'auto',flex:1}}>{children}</div>
      </div>
    </div>
  )
}
function MFoot({onClose,onSave,label='Saqlash',color='#0ea5e9',loading=false}){
  return (
    <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8,paddingTop:12,borderTop:'1px solid #f1f5f9'}}>
      <Btn ghost color='#475569' onClick={onClose}>Bekor</Btn>
      <Btn color={color} onClick={onSave} disabled={loading}>{loading?'Saqlanmoqda...':label}</Btn>
    </div>
  )
}
function StatCard({icon,label,value,sub,color}){
  return (
    <div style={{...card(),position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:color}}/>
      <div style={{width:40,height:40,borderRadius:10,background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:10}}>{icon}</div>
      <div style={{fontSize:24,fontWeight:800,letterSpacing:-1,lineHeight:1}}>{value}</div>
      <div style={{fontSize:12,fontWeight:600,color:'#475569',marginTop:3}}>{label}</div>
      {sub&&<div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>{sub}</div>}
    </div>
  )
}
function THead({cols}){
  return <thead><tr>{cols.map(c=><th key={c} style={{padding:'10px 12px',textAlign:'left',fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:.5,borderBottom:'1px solid #e2e8f0',background:'#f8fafc',whiteSpace:'nowrap'}}>{c}</th>)}</tr></thead>
}
function TRow({onClick,selected,children}){
  return <tr onClick={onClick} style={{borderBottom:'1px solid #f1f5f9',cursor:onClick?'pointer':'default',background:selected?'#f0f9ff':'#fff',transition:'background .1s'}}>{children}</tr>
}
function TD({children,style={}}){ return <td style={{padding:'10px 12px',verticalAlign:'middle',...style}}>{children}</td> }
function Prog({pct,color}){
  return <div style={{height:4,background:'#f1f5f9',borderRadius:99,overflow:'hidden',marginTop:4}}><div style={{height:'100%',width:Math.min(pct,100)+'%',background:color,borderRadius:99}}/></div>
}
function Loading(){
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:50,color:'#94a3b8'}}>Yuklanmoqda...</div>
}
function Empty({icon='📭',text='Topilmadi'}){
  return <div style={{textAlign:'center',padding:40,color:'#94a3b8'}}><div style={{fontSize:28,marginBottom:8}}>{icon}</div>{text}</div>
}

// ── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({page,setPage,badges,user,onLogout}){
  return (
    <div style={{width:220,minWidth:220,background:'#0c1520',display:'flex',flexDirection:'column',overflowY:'auto',flexShrink:0}}>
      <div style={{padding:'16px 16px 12px',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        <div style={{fontSize:18,fontWeight:800,color:'#fff'}}>🏥 MedClinic</div>
        <div style={{fontSize:10,color:'#475569',marginTop:2}}>Pro — Backed by SQLite</div>
      </div>
      <div style={{flex:1,paddingTop:4}}>
        {NAV.map(item=>{
          const active=page===item.id
          const b=badges[item.id]||0
          return (
            <React.Fragment key={item.id}>
              {item.sec&&<div style={{padding:'10px 14px 3px',fontSize:9,fontWeight:700,color:'#334155',letterSpacing:1,textTransform:'uppercase'}}>{item.sec}</div>}
              <button onClick={()=>setPage(item.id)} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',margin:'1px 6px',borderRadius:7,border:'none',background:active?'linear-gradient(90deg,#0ea5e9,#06b6d4)':'transparent',color:active?'#fff':'#94a3b8',fontSize:12,fontWeight:active?600:500,width:'calc(100% - 12px)',textAlign:'left',cursor:'pointer',boxShadow:active?'0 3px 10px rgba(14,165,233,.3)':'none'}}>
                <span style={{fontSize:15,width:18,textAlign:'center'}}>{item.icon}</span>
                <span style={{flex:1}}>{item.label}</span>
                {b>0&&<span style={{background:'#ef4444',color:'#fff',fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:99,minWidth:16,textAlign:'center'}}>{b}</span>}
              </button>
            </React.Fragment>
          )
        })}
      </div>
      <div style={{padding:12,borderTop:'1px solid rgba(255,255,255,.06)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:7,background:'rgba(255,255,255,.04)'}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#0ea5e9,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',flexShrink:0}}>{user?.avatar||'??'}</div>
          <div style={{flex:1,overflow:'hidden'}}>
            <div style={{fontSize:12,fontWeight:600,color:'#e2e8f0',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.ism||'Foydalanuvchi'}</div>
            <div style={{fontSize:10,color:'#64748b'}}>{user?.rol||'Admin'}</div>
          </div>
          <button onClick={onLogout} title="Chiqish" style={{background:'rgba(239,68,68,.15)',border:'1px solid rgba(239,68,68,.3)',borderRadius:6,width:26,height:26,cursor:'pointer',color:'#f87171',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>⏻</button>
          <div style={{marginLeft:'auto',width:7,height:7,borderRadius:'50%',background:'#10b981'}}/>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────
function Dashboard({setPage, user}){
  const [stats,sLoading,rStats] = useLoad(api.getStatistika)
  const [bemorlar] = useLoad(api.getBemorlar)
  const [shifokorlar] = useLoad(api.getShifokorlar)
  const [uchrashuvlar] = useLoad(()=>api.getUchr('bugun'))

  const maxN = Math.max(...OYLIK.map(d=>d.n))

  if(sLoading) return <Loading/>
  const jami = stats?.jami_daromad||0
  const tolangan = stats?.tolangan||0
  const bugunList = uchrashuvlar||[]

  return (
    <div>
      <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:12,padding:'22px 28px',marginBottom:18,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-30,right:-30,width:160,height:160,borderRadius:'50%',background:'rgba(14,165,233,.1)'}}/>
        <div style={{position:'absolute',bottom:-20,right:80,width:80,height:80,borderRadius:'50%',background:'rgba(16,185,129,.08)'}}/>
        <div style={{fontSize:20,fontWeight:800,color:'#fff',marginBottom:4}}>Xush kelibsiz, {user?.ism||'Foydalanuvchi'}! 👋</div>
        <div style={{fontSize:13,color:'#94a3b8'}}>{TODAY_LABEL} · Bugun {stats?.bugun||0} ta qabulingiz bor</div>
        <div style={{display:'flex',gap:8,marginTop:14}}>
          <Btn onClick={()=>setPage('uchrashuvlar')}>📅 Uchrashuvlar</Btn>
          <Btn ghost color='#fff' style={{borderColor:'rgba(255,255,255,.3)'}} onClick={()=>setPage('bemorlar')}>+ Yangi bemor</Btn>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <StatCard icon='👥' label='Jami bemorlar' value={stats?.bemorlar||0} sub='Bu oy +12' color='#0ea5e9'/>
        <StatCard icon='🩺' label='Shifokorlar' value={stats?.shifokorlar||0} sub={(shifokorlar||[]).filter(s=>s.holat==='Ish joyida').length+' ta ish joyida'} color='#10b981'/>
        <StatCard icon='📅' label='Bugungi qabul' value={stats?.bugun||0} sub={bugunList.filter(u=>u.holat==='Tugallandi').length+' tugallandi'} color='#f59e0b'/>
        <StatCard icon='💰' label='Daromad (som)' value={tolangan.toLocaleString()} sub='Tolangan' color='#8b5cf6'/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14,marginBottom:16}}>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:3}}>Oylik bemorlar</div>
          <div style={{fontSize:11,color:'#94a3b8',marginBottom:12}}>Songi 6 oy statistikasi</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:6,height:90}}>
            {OYLIK.map((d,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                <div style={{fontSize:9,color:'#94a3b8'}}>{d.n}</div>
                <div style={{width:'100%',borderRadius:'3px 3px 0 0',background:i===OYLIK.length-1?'#0ea5e9':'#bae6fd',height:Math.round(d.n/maxN*72)+4+'px',transition:'height .3s'}}/>
                <div style={{fontSize:9,color:'#94a3b8'}}>{d.o}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:12}}>Bugungi qabullar</div>
          {bugunList.length===0&&<Empty icon='📅' text='Bugun qabul yoq'/>}
          {bugunList.slice(0,6).map(u=>{
            const b=(bemorlar||[]).find(x=>x.id===u.bId)
            const sh=(shifokorlar||[]).find(x=>x.id===u.shId)
            return (
              <div key={u.id} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 9px',background:'#f8fafc',borderRadius:7,marginBottom:5}}>
                <div style={{fontSize:12,fontWeight:700,color:'#0ea5e9',minWidth:36}}>{u.vaqt}</div>
                <div style={{flex:1,overflow:'hidden'}}>
                  <div style={{fontSize:12,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b?.ism||'?'}</div>
                  <div style={{fontSize:10,color:'#94a3b8'}}>{sh?.mutaxassis||''}</div>
                </div>
                <Bdg label={u.holat} color={UHOLAT_C[u.holat]||'#94a3b8'}/>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={card({padding:18,borderColor:'#fecaca'})}>
          <div style={{fontWeight:700,color:'#ef4444',marginBottom:10}}>🚨 Kritik bemorlar ({stats?.kritik||0})</div>
          {(bemorlar||[]).filter(b=>b.holat==='Kritik').map(b=>(
            <div key={b.id} style={{display:'flex',alignItems:'center',gap:8,padding:9,background:'#fef2f2',borderRadius:7,marginBottom:5}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'#fee2e2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>🆘</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{b.ism}</div><div style={{fontSize:10,color:'#94a3b8'}}>{b.kasallik}</div></div>
              <span style={{fontSize:10,fontWeight:700,color:'#ef4444'}}>KRITIK</span>
            </div>
          ))}
          {(stats?.kritik||0)===0&&<div style={{color:'#94a3b8',fontSize:12,padding:10}}>Kritik bemor yoq ✅</div>}
        </div>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:10}}>Shifokorlar holati</div>
          {(shifokorlar||[]).map(sh=>(
            <div key={sh.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
              <Avt name={sh.ism} color={SH_COLS[sh.id%SH_COLS.length]} size={28}/>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{sh.ism}</div><div style={{fontSize:10,color:'#94a3b8'}}>{sh.mutaxassis}</div></div>
              <Bdg label={sh.holat} color={SHOLAT_C[sh.holat]||'#94a3b8'}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Bemorlar ──────────────────────────────────────────────────────────────
function Bemorlar(){
  const [bemorlar, loading, reload] = useLoad(api.getBemorlar)
  const [shifokorlar] = useLoad(api.getShifokorlar)
  const [search, setSearch] = useState('')
  const [hFilter, setHFilter] = useState('Barchasi')
  const [sel, setSel] = useState(null)
  const [modal, setModal] = useState(null)
  const [yonModal, setYonModal] = useState(null) // yo'naltirish modal
  const [saving, setSaving] = useState(false)

  const HOLATLAR = ['Barchasi','Davolanmoqda','Nazoratda','Kritik','Sogaydi','Reabilitatsiya']

  const filtered = (bemorlar||[]).filter(b=>{
    const q = !search || b.ism.toLowerCase().includes(search.toLowerCase()) || b.raqam.includes(search)
    const h = hFilter==='Barchasi' || b.holat===hFilter
    return q && h
  })

  const save = async (data) => {
    setSaving(true)
    try {
      if(modal==='add') await api.addBemor(data)
      else await api.updBemor(modal.id, data)
      await reload()
      setModal(null)
    } catch(e){ alert('Xatolik: '+e.message) }
    setSaving(false)
  }

  const del = async (id) => {
    if(!window.confirm("O'chirilsinmi?")) return
    await api.delBemor(id)
    if(sel?.id===id) setSel(null)
    await reload()
  }

  // Yo'naltirish — shifokorni almashtirish + tarix
  const yonaltir = async (bemor, yangiShId, sabab) => {
    const eski = (shifokorlar||[]).find(x=>x.id===bemor.shId)
    const yangi = (shifokorlar||[]).find(x=>x.id===+yangiShId)
    const tarix = bemor.yonaltirish_tarix ? JSON.parse(bemor.yonaltirish_tarix) : []
    tarix.push({
      sana: TODAY,
      eskiSh: eski?.ism||'-',
      yangiSh: yangi?.ism||'-',
      sabab,
      vaqt: new Date().toLocaleTimeString('uz',{hour:'2-digit',minute:'2-digit'})
    })
    try {
      await api.updBemor(bemor.id, {
        ...bemor,
        shId: +yangiShId,
        yonaltirish_tarix: JSON.stringify(tarix),
        izoh: (bemor.izoh||'') + `\n[${TODAY}] Yo'naltirildi: ${eski?.ism||'-'} → ${yangi?.ism||'-'}. Sabab: ${sabab}`
      })
      await reload()
      setSel(s => s ? {...s, shId:+yangiShId} : s)
      setYonModal(null)
      alert(`✅ Bemor ${yangi?.ism} ga yo'naltirildi!`)
    } catch(e){ alert('Xatolik: '+e.message) }
  }

  const sh = sel ? (shifokorlar||[]).find(x=>x.id===sel.shId) : null
  const yonTarix = sel?.yonaltirish_tarix ? JSON.parse(sel.yonaltirish_tarix) : []

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div><h2 style={{fontSize:18,fontWeight:800}}>Bemorlar</h2><div style={{fontSize:11,color:'#94a3b8'}}>Jami {(bemorlar||[]).length} ta</div></div>
        <Btn onClick={()=>setModal('add')}>+ Yangi bemor</Btn>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,background:'#fff',border:'1px solid #e2e8f0',borderRadius:7,padding:'6px 11px',flex:1,minWidth:180}}>
          <span style={{color:'#94a3b8'}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Ism yoki raqam...' style={{border:'none',outline:'none',fontSize:13,width:'100%'}}/>
          {search&&<button onClick={()=>setSearch('')} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:16}}>×</button>}
        </div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {HOLATLAR.map(h=>{const c=BHOLAT_C[h]||'#0ea5e9';const a=hFilter===h;return(
            <button key={h} onClick={()=>setHFilter(h)} style={{padding:'5px 10px',borderRadius:6,border:`1px solid ${a?c:'#e2e8f0'}`,background:a?c+'15':'#fff',color:a?c:'#475569',fontSize:11,fontWeight:600,cursor:'pointer'}}>{h}</button>
          )})}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:sel?'1fr 310px':'1fr',gap:14}}>
        <div style={card({padding:0,overflow:'hidden'})}>
          {loading ? <Loading/> : (
            <table>
              <THead cols={['Raqam','Bemor','Yosh/Jins','Kasallik','Shifokor','Holat','']}/>
              <tbody>
                {filtered.map(b=>{
                  const sh2=(shifokorlar||[]).find(x=>x.id===b.shId)
                  const yonB = b.yonaltirish_tarix ? JSON.parse(b.yonaltirish_tarix).length : 0
                  return (
                    <TRow key={b.id} onClick={()=>setSel(sel?.id===b.id?null:b)} selected={sel?.id===b.id}>
                      <TD><span style={{fontSize:10,fontFamily:'monospace',background:'#f1f5f9',padding:'2px 6px',borderRadius:3,color:'#475569'}}>{b.raqam}</span></TD>
                      <TD>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <Avt name={b.ism} size={28}/>
                          <div>
                            <div style={{fontSize:12,fontWeight:600}}>{b.ism}</div>
                            <div style={{fontSize:10,color:'#94a3b8'}}>{b.tel}</div>
                          </div>
                          {yonB>0&&<span style={{fontSize:9,background:'#ede9fe',color:'#7c3aed',padding:'1px 5px',borderRadius:99,fontWeight:700}}>↪{yonB}</span>}
                        </div>
                      </TD>
                      <TD style={{color:'#475569'}}>{b.yosh}/{(b.jinsi||'')[0]}</TD>
                      <TD style={{fontSize:12,color:'#475569',maxWidth:130,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.kasallik}</TD>
                      <TD style={{fontSize:11,color:'#475569'}}>{sh2?.ism?.split(' ').slice(1).join(' ')||'-'}</TD>
                      <TD><Bdg label={b.holat} color={BHOLAT_C[b.holat]||'#94a3b8'}/></TD>
                      <TD>
                        <div style={{display:'flex',gap:4}}>
                          <Btn sm ghost color='#8b5cf6' onClick={e=>{e.stopPropagation();setYonModal(b)}} title="Yo'naltirish">↪</Btn>
                          <Btn sm ghost color='#475569' onClick={e=>{e.stopPropagation();setModal({...b})}}>✏</Btn>
                          <Btn sm danger onClick={e=>{e.stopPropagation();del(b.id)}}>✕</Btn>
                        </div>
                      </TD>
                    </TRow>
                  )
                })}
                {filtered.length===0&&<tr><td colSpan={7}><Empty icon='👥' text='Bemor topilmadi'/></td></tr>}
              </tbody>
            </table>
          )}
        </div>

        {sel&&(
          <div style={card({padding:18,height:'fit-content',position:'sticky',top:0,maxHeight:'88vh',overflowY:'auto'})}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
              <div style={{fontWeight:700}}>Bemor kartasi</div>
              <button onClick={()=>setSel(null)} style={{background:'#f1f5f9',border:'none',borderRadius:6,width:26,height:26,cursor:'pointer',color:'#475569',fontSize:18}}>×</button>
            </div>
            <div style={{textAlign:'center',marginBottom:14}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#0ea5e9,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#fff',margin:'0 auto 8px'}}>{ini(sel.ism)}</div>
              <div style={{fontSize:14,fontWeight:700}}>{sel.ism}</div>
              <div style={{fontSize:11,color:'#94a3b8'}}>{sel.raqam}</div>
            </div>
            {[['Telefon',sel.tel],['Yosh',sel.yosh+' yosh'],['Jinsi',sel.jinsi],['Manzil',sel.manzil],['Qon guruhi',sel.qon],['Tugilgan',sel.tug_sana||'-'],['Allergiya',sel.allergiya||'-'],['Kasallik',sel.kasallik],['Shifokor',sh?.ism||'-'],['Oxirgi tashrif',sel.oxirgi]].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 8px',background:'#f8fafc',borderRadius:6,marginBottom:3}}>
                <span style={{fontSize:11,color:'#94a3b8'}}>{k}</span>
                <span style={{fontSize:11,fontWeight:600,textAlign:'right',maxWidth:'58%',wordBreak:'break-word'}}>{v}</span>
              </div>
            ))}
            {sel.izoh&&<div style={{marginTop:8,padding:'7px 9px',background:'#fef9c3',borderRadius:6,fontSize:11,color:'#92400e',lineHeight:1.5}}><b>Izoh:</b> {sel.izoh}</div>}
            <div style={{marginTop:10,marginBottom:10}}><Bdg label={sel.holat} color={BHOLAT_C[sel.holat]||'#94a3b8'}/></div>

            {/* Yo'naltirish tarixi */}
            {yonTarix.length>0&&(
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:.5,marginBottom:6}}>YO'NALTIRISH TARIXI ({yonTarix.length})</div>
                {yonTarix.map((y,i)=>(
                  <div key={i} style={{background:'#f5f3ff',border:'1px solid #ddd6fe',borderRadius:7,padding:'7px 9px',marginBottom:4}}>
                    <div style={{fontSize:10,color:'#7c3aed',fontWeight:700,marginBottom:2}}>{y.sana} {y.vaqt}</div>
                    <div style={{fontSize:11,color:'#475569'}}>{y.eskiSh} → <b>{y.yangiSh}</b></div>
                    {y.sabab&&<div style={{fontSize:10,color:'#94a3b8',marginTop:2}}>Sabab: {y.sabab}</div>}
                  </div>
                ))}
              </div>
            )}

            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
              <Btn sm color='#8b5cf6' style={{flex:1}} onClick={()=>setYonModal({...sel})}>↪ Yo'naltirish</Btn>
              <Btn sm style={{flex:1}} onClick={()=>setModal({...sel})}>✏ Tahrirlash</Btn>
              <Btn sm danger onClick={()=>del(sel.id)}>🗑</Btn>
            </div>
          </div>
        )}
      </div>

      {modal&&(
        <BemorModal
          bemor={modal==='add'?null:modal}
          shifokorlar={shifokorlar||[]}
          onSave={save}
          onClose={()=>setModal(null)}
          saving={saving}
        />
      )}

      {/* Yo'naltirish modali */}
      {yonModal&&(
        <YonaltirModal
          bemor={yonModal}
          shifokorlar={(shifokorlar||[]).filter(s=>s.id!==yonModal.shId)}
          currentSh={(shifokorlar||[]).find(x=>x.id===yonModal.shId)}
          onYonaltir={yonaltir}
          onClose={()=>setYonModal(null)}
        />
      )}
    </div>
  )
}

function BemorModal({bemor, shifokorlar, onSave, onClose, saving}){
  const DEF = {ism:'',yosh:'',jinsi:'Erkak',tel:'',manzil:'',qon:'A+',kasallik:'',holat:'Davolanmoqda',shId:'',tug_sana:'',allergiya:'',izoh:'',oxirgi:TODAY}
  const [f, setF] = useState(bemor ? {...DEF,...bemor} : DEF)
  const s = k => v => setF(p=>({...p,[k]:v}))

  return (
    <Modal title={bemor?'Bemor tahrirlash':'Yangi bemor qoshish'} onClose={onClose} wide>
      <FormGrid>
        <Full><Inp label='Ism Familiya' required value={f.ism} onChange={s('ism')} placeholder='Alisher Karimov'/></Full>
        <Inp label='Yosh' value={f.yosh} onChange={s('yosh')} type='number' placeholder='30'/>
        <Inp label="Tugilgan sana" value={f.tug_sana} onChange={s('tug_sana')} type='date'/>
        <Inp label='Jinsi' value={f.jinsi} onChange={s('jinsi')} options={['Erkak','Ayol']}/>
        <Inp label='Qon guruhi' value={f.qon} onChange={s('qon')} options={['A+','A-','B+','B-','AB+','AB-','O+','O-']}/>
        <Inp label='Telefon' value={f.tel} onChange={s('tel')} placeholder='+998 90 000 00 00'/>
        <Inp label='Manzil' value={f.manzil} onChange={s('manzil')} placeholder='Toshkent, Chilonzor'/>
        <Full><Inp label='Kasallik / Tashxis' value={f.kasallik} onChange={s('kasallik')} placeholder='Gipertoniya'/></Full>
        <Inp label='Holat' value={f.holat} onChange={s('holat')} options={['Davolanmoqda','Nazoratda','Kritik','Sogaydi','Reabilitatsiya']}/>
        <Inp label='Shifokor' value={f.shId} onChange={v=>s('shId')(+v)} options={[{v:'',l:'Tanlang'},...shifokorlar.map(sh=>({v:sh.id,l:sh.ism}))]}/>
        <Full><Inp label='Allergiya' value={f.allergiya} onChange={s('allergiya')} placeholder='Penitsillin, moyli dorilar...'/></Full>
        <Full><Inp label='Izoh' value={f.izoh} onChange={s('izoh')} placeholder='Qoshimcha malumot...' rows={2}/></Full>
      </FormGrid>
      <MFoot onClose={onClose} onSave={()=>{if(!f.ism.trim()){alert('Ism kiriting!');return};onSave({...f,yosh:+f.yosh,shId:f.shId?+f.shId:null})}} loading={saving}/>
    </Modal>
  )
}

// ── Shifokorlar ────────────────────────────────────────────────────────────
function YonaltirModal({bemor, shifokorlar, currentSh, onYonaltir, onClose}){
  const [yangiShId, setYangiShId] = useState('')
  const [sabab, setSabab] = useState('')
  const SABABLAR = ['Mutaxassis kerak','Shifokor band','Bemor talabi','Ikkinchi fikr','Boshqa']
  const [sababTuri, setSababTuri] = useState('Mutaxassis kerak')

  const submit = () => {
    if(!yangiShId){ alert('Shifokor tanlang!'); return }
    onYonaltir(bemor, yangiShId, sababTuri + (sabab ? ': ' + sabab : ''))
  }

  return (
    <Modal title="↪ Bemorni yo'naltirish" onClose={onClose} wide>
      {/* Bemor info */}
      <div style={{background:'#f8fafc',borderRadius:10,padding:'12px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
        <Avt name={bemor.ism} size={36}/>
        <div>
          <div style={{fontSize:13,fontWeight:700}}>{bemor.ism}</div>
          <div style={{fontSize:11,color:'#94a3b8'}}>{bemor.kasallik} · {bemor.raqam}</div>
        </div>
      </div>

      {/* Hozirgi shifokor */}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:.5,display:'block',marginBottom:8}}>Hozirgi shifokor</label>
        {currentSh ? (
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8}}>
            <Avt name={currentSh.ism} color='#ef4444' size={32}/>
            <div>
              <div style={{fontSize:12,fontWeight:600}}>{currentSh.ism}</div>
              <div style={{fontSize:10,color:'#94a3b8'}}>{currentSh.mutaxassis}</div>
            </div>
            <span style={{marginLeft:'auto',fontSize:20}}>→</span>
          </div>
        ) : (
          <div style={{padding:'10px',background:'#f8fafc',borderRadius:8,fontSize:12,color:'#94a3b8'}}>Shifokor tayinlanmagan</div>
        )}
      </div>

      {/* Yangi shifokor */}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:.5,display:'block',marginBottom:8}}>Yangi shifokor tanlang</label>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {shifokorlar.map(sh=>{
            const sel = yangiShId===String(sh.id)
            const col = SH_COLS[sh.id%SH_COLS.length]
            return (
              <div key={sh.id} onClick={()=>setYangiShId(String(sh.id))} style={{padding:'10px 12px',borderRadius:8,border:`2px solid ${sel?col:'#e2e8f0'}`,background:sel?col+'10':'#fff',cursor:'pointer',transition:'all .15s'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Avt name={sh.ism} color={col} size={30}/>
                  <div>
                    <div style={{fontSize:12,fontWeight:600}}>{sh.ism}</div>
                    <div style={{fontSize:10,color:col,fontWeight:600}}>{sh.mutaxassis}</div>
                    <div style={{fontSize:9,color:'#94a3b8'}}>{sh.holat}</div>
                  </div>
                  {sel&&<span style={{marginLeft:'auto',fontSize:18}}>✅</span>}
                </div>
              </div>
            )
          })}
        </div>
        {shifokorlar.length===0&&<div style={{padding:20,textAlign:'center',color:'#94a3b8',fontSize:12}}>Boshqa shifokor yo'q</div>}
      </div>

      {/* Sabab */}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:.5,display:'block',marginBottom:6}}>Yo'naltirish sababi</label>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
          {SABABLAR.map(s=>(
            <button key={s} onClick={()=>setSababTuri(s)} style={{padding:'4px 10px',borderRadius:99,border:'1px solid',borderColor:sababTuri===s?'#8b5cf6':'#e2e8f0',background:sababTuri===s?'#ede9fe':'#fff',color:sababTuri===s?'#7c3aed':'#475569',fontSize:11,fontWeight:600,cursor:'pointer'}}>{s}</button>
          ))}
        </div>
        <textarea value={sabab} onChange={e=>setSabab(e.target.value)} placeholder="Qo'shimcha izoh (ixtiyoriy)..." rows={2} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:7,padding:'8px 11px',fontSize:13,outline:'none',width:'100%',resize:'none',fontFamily:'inherit'}}/>
      </div>

      <div style={{display:'flex',gap:8,justifyContent:'flex-end',paddingTop:12,borderTop:'1px solid #f1f5f9'}}>
        <Btn ghost color='#475569' onClick={onClose}>Bekor</Btn>
        <Btn color='#8b5cf6' onClick={submit} disabled={!yangiShId}>↪ Yo'naltirish</Btn>
      </div>
    </Modal>
  )
}

function Shifokorlar(){
  const [shifokorlar, loading, reload] = useLoad(api.getShifokorlar)
  const [bemorlar] = useLoad(api.getBemorlar)
  const [uchrashuvlar] = useLoad(()=>api.getUchr('barchasi'))
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [detay, setDetay] = useState(null)
  const [saving, setSaving] = useState(false)

  const fil = (shifokorlar||[]).filter(sh=>!search||sh.ism.toLowerCase().includes(search.toLowerCase())||sh.mutaxassis.toLowerCase().includes(search.toLowerCase()))

  const save = async data => {
    setSaving(true)
    try {
      if(modal==='add') await api.addSh(data)
      else await api.updSh(modal.id, data)
      await reload(); setModal(null)
    } catch(e){ alert(e.message) }
    setSaving(false)
  }
  const del = async id => {
    if(!window.confirm("O'chirilsinmi?")) return
    await api.delSh(id); await reload(); setDetay(null)
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div><h2 style={{fontSize:18,fontWeight:800}}>Shifokorlar</h2><div style={{fontSize:11,color:'#94a3b8'}}>Jami {(shifokorlar||[]).length} ta</div></div>
        <Btn onClick={()=>setModal('add')}>+ Yangi shifokor</Btn>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:7,background:'#fff',border:'1px solid #e2e8f0',borderRadius:7,padding:'6px 11px',marginBottom:14,maxWidth:280}}>
        <span>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Qidirish...' style={{border:'none',outline:'none',fontSize:13,width:'100%'}}/>
      </div>
      {loading ? <Loading/> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:12}}>
          {fil.map(sh=>{
            const col = SH_COLS[sh.id%SH_COLS.length]
            const hcol = SHOLAT_C[sh.holat]||'#94a3b8'
            const bSoni = (bemorlar||[]).filter(b=>b.shId===sh.id).length
            const bugunQ = (uchrashuvlar||[]).filter(u=>u.shId===sh.id&&u.sana===TODAY).length
            const inits = (sh.ism||'').split(' ').slice(1).map(n=>n[0]).join('')
            return (
              <div key={sh.id} style={card()}>
                <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:12}}>
                  <div style={{width:50,height:50,borderRadius:'50%',background:col+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:col,flexShrink:0}}>{inits||'Dr'}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700}}>{sh.ism}</div>
                    <div style={{fontSize:11,color:col,fontWeight:600,marginTop:1}}>{sh.mutaxassis}</div>
                    <div style={{fontSize:10,color:'#94a3b8',marginTop:1}}>⭐ {sh.reyting} · {sh.tajriba} yil</div>
                  </div>
                  <Bdg label={sh.holat} color={hcol}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:10}}>
                  {[['📞 Tel',sh.tel||'-'],['🚪 Xona',sh.xona||'-'],['👥 Bemorlar',bSoni+' ta'],['📅 Bugun',bugunQ+' qabul']].map(([k,v])=>(
                    <div key={k} style={{background:'#f8fafc',borderRadius:6,padding:'7px 9px'}}>
                      <div style={{fontSize:10,color:'#94a3b8'}}>{k}</div>
                      <div style={{fontSize:11,fontWeight:600,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</div>
                    </div>
                  ))}
                </div>
                {sh.bio&&<div style={{fontSize:11,color:'#475569',background:'#f8fafc',padding:'7px 9px',borderRadius:6,marginBottom:10,lineHeight:1.5}}>{sh.bio}</div>}
                <div style={{fontSize:11,color:'#94a3b8',marginBottom:10}}>🕐 {sh.ish||'-'}</div>
                <div style={{display:'flex',gap:6,borderTop:'1px solid #e2e8f0',paddingTop:10}}>
                  <Btn sm ghost color='#0ea5e9' style={{flex:1}} onClick={()=>setDetay(sh)}>👁 Ko'rish</Btn>
                  <Btn sm style={{flex:1}} onClick={()=>setModal({...sh})}>✏ Tahrirlash</Btn>
                  <Btn sm danger onClick={()=>del(sh.id)}>✕</Btn>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal&&(
        <ShModal sh={modal==='add'?null:modal} onSave={save} onClose={()=>setModal(null)} saving={saving}/>
      )}
      {detay&&(
        <ShDetayModal sh={detay} bemorlar={bemorlar||[]} uchrashuvlar={uchrashuvlar||[]} onEdit={sh=>{setDetay(null);setTimeout(()=>setModal({...sh}),50)}} onDel={del} onClose={()=>setDetay(null)}/>
      )}
    </div>
  )
}

function ShModal({sh, onSave, onClose, saving}){
  const DEF = {ism:'',mutaxassis:'Kardiolog',tajriba:'',tel:'',xona:'',holat:'Ish joyida',reyting:'4.8',ish:'Du-Ju 09:00-17:00',bio:'',email:''}
  const [f, setF] = useState(sh ? {...DEF,...sh} : DEF)
  const s = k => v => setF(p=>({...p,[k]:v}))
  return (
    <Modal title={sh?'Shifokor tahrirlash':'Yangi shifokor qoshish'} onClose={onClose} wide>
      <FormGrid>
        <Full><Inp label='Ism Familiya' required value={f.ism} onChange={s('ism')} placeholder='Dr. Ism Familiya'/></Full>
        <Inp label='Mutaxassis' value={f.mutaxassis} onChange={s('mutaxassis')} options={MUTAXASSISLAR}/>
        <Inp label='Tajriba (yil)' value={f.tajriba} onChange={s('tajriba')} type='number' placeholder='10'/>
        <Inp label='Telefon' value={f.tel} onChange={s('tel')} placeholder='+998 90 000 00 00'/>
        <Inp label='Email' value={f.email} onChange={s('email')} placeholder='dr@medclinic.uz'/>
        <Inp label='Xona' value={f.xona} onChange={s('xona')} placeholder='201'/>
        <Inp label='Holat' value={f.holat} onChange={s('holat')} options={['Ish joyida','Operatsiyada','Tatilda']}/>
        <Inp label='Reyting' value={f.reyting} onChange={s('reyting')} type='number' placeholder='4.8'/>
        <Full><Inp label='Ish vaqti' value={f.ish} onChange={s('ish')} placeholder='Du-Ju 09:00-17:00'/></Full>
        <Full><Inp label='Bio' value={f.bio} onChange={s('bio')} placeholder='Qisqacha tavsif...' rows={2}/></Full>
      </FormGrid>
      <MFoot onClose={onClose} onSave={()=>{if(!f.ism.trim()){alert('Ism kiriting!');return};onSave({...f,tajriba:+f.tajriba,reyting:+f.reyting})}} loading={saving}/>
    </Modal>
  )
}

function ShDetayModal({sh, bemorlar, uchrashuvlar, onEdit, onDel, onClose}){
  const col = SH_COLS[sh.id%SH_COLS.length]
  const inits = (sh.ism||'').split(' ').slice(1).map(n=>n[0]).join('')
  const bList = bemorlar.filter(b=>b.shId===sh.id)
  const uList = uchrashuvlar.filter(u=>u.shId===sh.id)
  return (
    <Modal title='Shifokor profili' onClose={onClose} wide>
      <div style={{display:'flex',gap:16,marginBottom:18}}>
        <div style={{width:70,height:70,borderRadius:'50%',background:col+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800,color:col,flexShrink:0}}>{inits||'Dr'}</div>
        <div>
          <div style={{fontSize:18,fontWeight:800}}>{sh.ism}</div>
          <div style={{fontSize:13,color:col,fontWeight:600,marginTop:3}}>{sh.mutaxassis}</div>
          <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}><Bdg label={sh.holat} color={SHOLAT_C[sh.holat]||'#94a3b8'}/><span style={{fontSize:11,color:'#475569'}}>⭐ {sh.reyting} · {sh.tajriba} yil tajriba</span></div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
        {[['Telefon',sh.tel||'-'],['Email',sh.email||'-'],['Xona',sh.xona||'-'],['Ish vaqti',sh.ish||'-'],['Bugungi qabul',uList.filter(u=>u.sana===TODAY).length+' ta'],['Jami bemorlar',bList.length+' ta']].map(([k,v])=>(
          <div key={k} style={{background:'#f8fafc',padding:'9px 12px',borderRadius:7}}><div style={{fontSize:10,color:'#94a3b8',marginBottom:2}}>{k}</div><div style={{fontSize:12,fontWeight:600,wordBreak:'break-all'}}>{v}</div></div>
        ))}
      </div>
      {sh.bio&&<div style={{background:'#f8fafc',padding:'10px 13px',borderRadius:7,fontSize:12,color:'#475569',lineHeight:1.6,marginBottom:14}}>{sh.bio}</div>}
      {bList.length>0&&(
        <>
          <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:6}}>BEMORLAR ({bList.length})</div>
          <div style={{maxHeight:120,overflowY:'auto',marginBottom:14}}>
            {bList.map(b=>(
              <div key={b.id} style={{display:'flex',alignItems:'center',gap:7,padding:'5px 8px',background:'#f8fafc',borderRadius:6,marginBottom:3}}>
                <Avt name={b.ism} size={24}/>
                <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{b.ism}</div><div style={{fontSize:10,color:'#94a3b8'}}>{b.kasallik}</div></div>
                <Bdg label={b.holat} color={BHOLAT_C[b.holat]||'#94a3b8'}/>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <Btn ghost color='#475569' onClick={onClose}>Yopish</Btn>
        <Btn onClick={()=>onEdit(sh)}>✏ Tahrirlash</Btn>
        <Btn danger onClick={()=>{if(window.confirm("O'chirilsinmi?")){onDel(sh.id);onClose()}}}>O'chirish</Btn>
      </div>
    </Modal>
  )
}

// ── Uchrashuvlar ───────────────────────────────────────────────────────────
function Uchrashuvlar(){
  const [tab, setTab] = useState('bugun')
  const [uchr, loading, reload] = useLoad(()=>api.getUchr(tab), [tab])
  const [bemorlar] = useLoad(api.getBemorlar)
  const [shifokorlar] = useLoad(api.getShifokorlar)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const UHOLATS = ['Kutilmoqda','Jarayonda','Tugallandi','Rejalashtirilgan','Bekor']

  const save = async data => {
    setSaving(true)
    try {
      if(modal==='add') await api.addUchr(data)
      else await api.updUchr(modal.id, data)
      await reload(); setModal(null)
    } catch(e){ alert(e.message) }
    setSaving(false)
  }

  const changeHolat = async (u, holat) => {
    await api.updUchr(u.id, {...u, holat})
    await reload()
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div><h2 style={{fontSize:18,fontWeight:800}}>Uchrashuvlar</h2><div style={{fontSize:11,color:'#94a3b8'}}>Jami {(uchr||[]).length} ta</div></div>
        <Btn onClick={()=>setModal('add')}>+ Uchrashuv qoshish</Btn>
      </div>
      <div style={{display:'flex',gap:5,marginBottom:14}}>
        {[['bugun','Bugun'],['kelasi','Kelasi'],['barchasi','Barchasi']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:'6px 14px',borderRadius:7,border:'1px solid',borderColor:tab===k?'#0ea5e9':'#e2e8f0',background:tab===k?'#0ea5e9':'#fff',color:tab===k?'#fff':'#475569',fontSize:12,fontWeight:600,cursor:'pointer'}}>{l}</button>
        ))}
      </div>
      {loading ? <Loading/> : (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {(uchr||[]).map(u=>{
            const b=(bemorlar||[]).find(x=>x.id===u.bId)
            const sh=(shifokorlar||[]).find(x=>x.id===u.shId)
            const c=UHOLAT_C[u.holat]||'#94a3b8'
            return (
              <div key={u.id} style={card({padding:'12px 16px'})}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div style={{textAlign:'center',minWidth:50}}>
                    <div style={{fontSize:15,fontWeight:800,color:'#0ea5e9'}}>{u.vaqt}</div>
                    <div style={{fontSize:9,color:'#94a3b8'}}>{(u.sana||'').slice(5).replace('-','/')}</div>
                  </div>
                  <div style={{width:1,height:36,background:'#e2e8f0'}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700}}>{b?.ism||'?'}</div>
                    <div style={{fontSize:11,color:'#94a3b8',marginTop:1}}>{sh?.ism||''} · {u.tur}{u.xona?' · Xona '+u.xona:''}</div>
                    {u.izoh&&<div style={{fontSize:11,color:'#475569',marginTop:3,fontStyle:'italic'}}>{u.izoh}</div>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',justifyContent:'flex-end'}}>
                    <select value={u.holat} onChange={e=>changeHolat(u,e.target.value)} style={{fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:99,border:`1px solid ${c}44`,background:c+'15',color:c,cursor:'pointer',outline:'none'}}>
                      {UHOLATS.map(h=><option key={h} value={h}>{h}</option>)}
                    </select>
                    <Btn sm ghost color='#475569' onClick={()=>setModal({...u})}>✏</Btn>
                    <Btn sm danger onClick={async()=>{if(window.confirm("O'chirilsinmi?")){await api.delUchr(u.id);await reload()}}}>✕</Btn>
                  </div>
                </div>
              </div>
            )
          })}
          {(uchr||[]).length===0&&<div style={card()}><Empty icon='📅' text='Uchrashuv topilmadi'/></div>}
        </div>
      )}
      {modal&&<UchrModal u={modal==='add'?null:modal} bemorlar={bemorlar||[]} shifokorlar={shifokorlar||[]} onSave={save} onClose={()=>setModal(null)} saving={saving}/>}
    </div>
  )
}

function UchrModal({u, bemorlar, shifokorlar, onSave, onClose, saving}){
  const DEF = {bId:'',shId:'',sana:TODAY,vaqt:'09:00',tur:'Nazorat',holat:'Kutilmoqda',xona:'',izoh:''}
  const [f, setF] = useState(u ? {...DEF,...u} : DEF)
  const s = k => v => setF(p=>({...p,[k]:v}))
  return (
    <Modal title={u?'Uchrashuvni tahrirlash':'Yangi uchrashuv'} onClose={onClose} wide>
      <FormGrid>
        <Inp label='Bemor' value={f.bId} onChange={v=>s('bId')(+v)} options={[{v:'',l:'Tanlang'},...bemorlar.map(b=>({v:b.id,l:b.ism}))]}/>
        <Inp label='Shifokor' value={f.shId} onChange={v=>s('shId')(+v)} options={[{v:'',l:'Tanlang'},...shifokorlar.map(sh=>({v:sh.id,l:sh.ism}))]}/>
        <Inp label='Sana' value={f.sana} onChange={s('sana')} type='date'/>
        <Inp label='Vaqt' value={f.vaqt} onChange={s('vaqt')} type='time'/>
        <Inp label='Tur' value={f.tur} onChange={s('tur')} options={['Nazorat','Davolash','Favqulodda','Birinchi qabul','Reabilitatsiya']}/>
        <Inp label='Xona' value={f.xona} onChange={s('xona')} placeholder='201'/>
        <Inp label='Holat' value={f.holat} onChange={s('holat')} options={['Kutilmoqda','Jarayonda','Tugallandi','Rejalashtirilgan','Bekor']}/>
        <div/>
        <Full><Inp label='Izoh' value={f.izoh} onChange={s('izoh')} placeholder='Ixtiyoriy...' rows={2}/></Full>
      </FormGrid>
      <MFoot onClose={onClose} onSave={()=>{if(!f.bId||!f.shId){alert('Bemor va shifokorni tanlang!');return};onSave({...f,bId:+f.bId,shId:+f.shId})}} loading={saving}/>
    </Modal>
  )
}

// ── Laboratoriya ───────────────────────────────────────────────────────────
function Laboratoriya(){
  const [lab, loading, reload] = useLoad(api.getLab)
  const [bemorlar] = useLoad(api.getBemorlar)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)

  const save = async data => {
    setSaving(true)
    try {
      if(modal==='add') await api.addLab(data)
      else await api.updLab(modal.id, data)
      await reload(); setModal(null)
    } catch(e){ alert(e.message) }
    setSaving(false)
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div><h2 style={{fontSize:18,fontWeight:800}}>Laboratoriya</h2><div style={{fontSize:11,color:'#94a3b8'}}>Jami {(lab||[]).length} ta</div></div>
        <Btn onClick={()=>setModal('add')}>+ Tahlil qoshish</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}}>
        {[['Tayyor','#10b981'],['Jarayonda','#0ea5e9'],['Kutilmoqda','#f59e0b']].map(([h,c])=>(
          <div key={h} style={card({display:'flex',alignItems:'center',gap:12,padding:'12px 16px'})}>
            <div style={{fontSize:24,fontWeight:800,color:c}}>{(lab||[]).filter(l=>l.holat===h).length}</div>
            <div style={{fontSize:12,fontWeight:600,color:'#475569'}}>{h}</div>
          </div>
        ))}
      </div>
      <div style={card({padding:0,overflow:'hidden'})}>
        {loading ? <Loading/> : (
          <table>
            <THead cols={['Bemor','Tahlil turi','Sana','Holat','Natija','Izoh','']}/>
            <tbody>
              {(lab||[]).map(l=>{
                const b=(bemorlar||[]).find(x=>x.id===l.bId)
                const hc=l.holat==='Tayyor'?'#10b981':l.holat==='Jarayonda'?'#0ea5e9':'#f59e0b'
                const nc=l.natija==='Normal'?'#10b981':l.natija==='-'?'#94a3b8':l.natija==='Yuqori'||l.natija==='Patologiya'?'#ef4444':'#f59e0b'
                return (
                  <TRow key={l.id}>
                    <TD><div style={{display:'flex',alignItems:'center',gap:7}}><Avt name={b?.ism||'??'} size={26}/><span style={{fontSize:12,fontWeight:600}}>{b?.ism||'?'}</span></div></TD>
                    <TD style={{fontSize:12,color:'#475569'}}>🔬 {l.tur}</TD>
                    <TD style={{fontFamily:'monospace',fontSize:12,color:'#475569'}}>{l.sana}</TD>
                    <TD><Bdg label={l.holat} color={hc}/></TD>
                    <TD>{l.natija==='-'?<span style={{color:'#94a3b8'}}>—</span>:<Bdg label={l.natija} color={nc}/>}</TD>
                    <TD style={{fontSize:11,color:'#475569',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.izoh||'—'}</TD>
                    <TD><div style={{display:'flex',gap:4}}>
                      <Btn sm ghost color='#475569' onClick={()=>setModal({...l})}>✏</Btn>
                      <Btn sm danger onClick={async()=>{if(window.confirm("O'chirilsinmi?")){await api.delLab(l.id);await reload()}}}>✕</Btn>
                    </div></TD>
                  </TRow>
                )
              })}
              {(lab||[]).length===0&&<tr><td colSpan={7}><Empty icon='🔬' text='Tahlil topilmadi'/></td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modal&&<LabModal l={modal==='add'?null:modal} bemorlar={bemorlar||[]} onSave={save} onClose={()=>setModal(null)} saving={saving}/>}
    </div>
  )
}

function LabModal({l, bemorlar, onSave, onClose, saving}){
  const DEF = {bId:'',tur:'Qon tahlili',sana:TODAY,holat:'Kutilmoqda',natija:'-',izoh:''}
  const [f, setF] = useState(l ? {...DEF,...l} : DEF)
  const s = k => v => setF(p=>({...p,[k]:v}))
  return (
    <Modal title={l?'Tahlil tahrirlash':'Yangi tahlil'} onClose={onClose}>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:12}}>
        <Inp label='Bemor' value={f.bId} onChange={v=>s('bId')(+v)} options={[{v:'',l:'Tanlang'},...bemorlar.map(b=>({v:b.id,l:b.ism}))]}/>
        <Inp label='Tahlil turi' value={f.tur} onChange={s('tur')} options={['Qon tahlili','Shakar tahlili','EKG','Rentgen','MRT','Ultratovush','Siydik tahlili','Biopsia']}/>
        <Inp label='Sana' value={f.sana} onChange={s('sana')} type='date'/>
        <Inp label='Holat' value={f.holat} onChange={s('holat')} options={['Kutilmoqda','Jarayonda','Tayyor']}/>
        {(l||f.holat==='Tayyor')&&<Inp label='Natija' value={f.natija} onChange={s('natija')} options={['Normal','Yuqori','Past','Patologiya','-']}/>}
        <Inp label='Izoh' value={f.izoh} onChange={s('izoh')} placeholder='Tahlil haqida izoh...' rows={2}/>
      </div>
      <MFoot onClose={onClose} onSave={()=>{if(!f.bId){alert('Bemor tanlang!');return};onSave({...f,bId:+f.bId})}} loading={saving}/>
    </Modal>
  )
}

// ── Moliya ─────────────────────────────────────────────────────────────────
function Moliya(){
  const [holFil, setHolFil] = useState('Barchasi')
  const [moliya, loading, reload] = useLoad(()=>api.getMoliya(holFil), [holFil])
  const [bemorlar] = useLoad(api.getBemorlar)
  const [allMoliya] = useLoad(()=>api.getMoliya('Barchasi'))
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)

  const jami = (allMoliya||[]).reduce((a,m)=>a+m.summa,0)
  const tol = (allMoliya||[]).reduce((a,m)=>m.holat==='Tolangan'?a+m.summa:a,0)
  const qarz = (allMoliya||[]).reduce((a,m)=>m.holat==='Kutilmoqda'?a+m.summa:a,0)

  const save = async data => {
    setSaving(true)
    try {
      if(modal==='add') await api.addMoliya(data)
      else await api.updMoliya(modal.id, data)
      await reload(); setModal(null)
    } catch(e){ alert(e.message) }
    setSaving(false)
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div><h2 style={{fontSize:18,fontWeight:800}}>Moliya</h2><div style={{fontSize:11,color:'#94a3b8'}}>Barcha tolovlar</div></div>
        <Btn color='#10b981' onClick={()=>setModal('add')}>+ Tolov qoshish</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:14}}>
        {[['Jami daromad',jami,'#8b5cf6','💰'],['Tolangan',tol,'#10b981','✅'],['Qarzdorlik',qarz,'#ef4444','⏳']].map(([l,v,c,ic])=>(
          <div key={l} style={card({position:'relative',overflow:'hidden'})}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:c}}/>
            <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:.5,marginBottom:6}}>{l}</div>
            <div style={{fontSize:22,fontWeight:800}}>{v.toLocaleString()}</div>
            <div style={{fontSize:10,color:'#94a3b8',marginTop:1}}>som</div>
            <div style={{position:'absolute',right:14,top:14,width:38,height:38,borderRadius:9,background:c+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{ic}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:5,marginBottom:12}}>
        {['Barchasi','Tolangan','Kutilmoqda','Qisman'].map(h=>(
          <button key={h} onClick={()=>setHolFil(h)} style={{padding:'5px 12px',borderRadius:7,border:'1px solid',borderColor:holFil===h?'#0ea5e9':'#e2e8f0',background:holFil===h?'#0ea5e9':'#fff',color:holFil===h?'#fff':'#475569',fontSize:12,fontWeight:600,cursor:'pointer'}}>{h}</button>
        ))}
      </div>
      <div style={card({padding:0,overflow:'hidden'})}>
        {loading ? <Loading/> : (
          <table>
            <THead cols={['Bemor','Xizmat','Sana','Usul','Summa','Holat','']}/>
            <tbody>
              {(moliya||[]).map(m=>{
                const b=(bemorlar||[]).find(x=>x.id===m.bId)
                const c={Tolangan:'#10b981',Kutilmoqda:'#f59e0b',Qisman:'#0ea5e9'}[m.holat]||'#94a3b8'
                return (
                  <TRow key={m.id}>
                    <TD><div style={{display:'flex',alignItems:'center',gap:7}}><Avt name={b?.ism||'??'} color='#10b981' size={26}/><span style={{fontSize:12,fontWeight:600}}>{b?.ism||'?'}</span></div></TD>
                    <TD style={{fontSize:12,color:'#475569'}}>{m.tur}</TD>
                    <TD style={{fontFamily:'monospace',fontSize:12,color:'#475569'}}>{m.sana}</TD>
                    <TD>{m.usul!=='-'?<span style={{padding:'2px 7px',background:'#f1f5f9',borderRadius:4,fontSize:11}}>{m.usul}</span>:<span style={{color:'#94a3b8'}}>—</span>}</TD>
                    <TD style={{fontSize:13,fontWeight:700}}>{m.summa.toLocaleString()} <span style={{fontSize:10,fontWeight:400,color:'#94a3b8'}}>s</span></TD>
                    <TD><Bdg label={m.holat} color={c}/></TD>
                    <TD><div style={{display:'flex',gap:4}}>
                      <Btn sm ghost color='#475569' onClick={()=>setModal({...m})}>✏</Btn>
                      <Btn sm danger onClick={async()=>{if(window.confirm("O'chirilsinmi?")){await api.delMoliya(m.id);await reload()}}}>✕</Btn>
                    </div></TD>
                  </TRow>
                )
              })}
              {(moliya||[]).length===0&&<tr><td colSpan={7}><Empty icon='💰' text='Topilmadi'/></td></tr>}
            </tbody>
          </table>
        )}
        <div style={{padding:'10px 14px',borderTop:'1px solid #e2e8f0',background:'#f8fafc',display:'flex',justifyContent:'flex-end',gap:6,alignItems:'center'}}>
          <span style={{fontSize:12,color:'#94a3b8'}}>Ko'rsatilgan jami:</span>
          <span style={{fontSize:14,fontWeight:800}}>{(moliya||[]).reduce((a,m)=>a+m.summa,0).toLocaleString()} som</span>
        </div>
      </div>
      {modal&&<MoliyaModal m={modal==='add'?null:modal} bemorlar={bemorlar||[]} onSave={save} onClose={()=>setModal(null)} saving={saving}/>}
    </div>
  )
}

function MoliyaModal({m, bemorlar, onSave, onClose, saving}){
  const DEF = {bId:'',tur:'Qabul',summa:'',holat:'Kutilmoqda',sana:TODAY,usul:'Naqd',izoh:''}
  const [f, setF] = useState(m ? {...DEF,...m} : DEF)
  const s = k => v => setF(p=>({...p,[k]:v}))
  return (
    <Modal title={m?'Tolovni tahrirlash':'Yangi tolov'} onClose={onClose} wide>
      <FormGrid>
        <Full><Inp label='Bemor' value={f.bId} onChange={v=>s('bId')(+v)} options={[{v:'',l:'Tanlang'},...bemorlar.map(b=>({v:b.id,l:b.ism}))]}/></Full>
        <Inp label='Xizmat turi' value={f.tur} onChange={s('tur')} options={['Qabul','Tahlil','Operatsiya','Dori','Reabilitatsiya','Protsedura','Konsultatsiya']}/>
        <Inp label='Summa (som)' value={f.summa} onChange={s('summa')} type='number' placeholder='150000'/>
        <Inp label='Holat' value={f.holat} onChange={s('holat')} options={['Kutilmoqda','Tolangan','Qisman']}/>
        <Inp label='Tolov usuli' value={f.usul} onChange={s('usul')} options={['Naqd','Karta','Bank transferi','MUNIS','-']}/>
        <Inp label='Sana' value={f.sana} onChange={s('sana')} type='date'/>
        <Full><Inp label='Izoh' value={f.izoh} onChange={s('izoh')} placeholder='Izoh...' rows={2}/></Full>
      </FormGrid>
      <MFoot onClose={onClose} onSave={()=>{if(!f.bId||!f.summa){alert("Bemor va summani kiriting!");return};onSave({...f,bId:+f.bId,summa:+f.summa})}} color='#10b981' loading={saving}/>
    </Modal>
  )
}

// ── Xonalar ────────────────────────────────────────────────────────────────
function Xonalar(){
  const [xonalar, loading] = useLoad(api.getXonalar)
  const TC = {Umumiy:'#0ea5e9',Yakka:'#10b981',Reanimatsiya:'#ef4444',Operatsiya:'#f59e0b',VIP:'#8b5cf6'}
  const jamiSig = (xonalar||[]).reduce((a,x)=>a+x.sig,0)
  const band = (xonalar||[]).reduce((a,x)=>a+x.band,0)
  return (
    <div>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:800}}>Xonalar va Palatalar</h2>
        <div style={{fontSize:11,color:'#94a3b8'}}>{(xonalar||[]).length} xona · {band}/{jamiSig} toshak band</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
        {[['Jami xona',(xonalar||[]).length,'#0ea5e9'],['Mavjud',(xonalar||[]).filter(x=>x.band<x.sig).length,'#10b981'],['Tolik',(xonalar||[]).filter(x=>x.band===x.sig).length,'#ef4444'],[`${band}/${jamiSig} toshak`,null,'#f59e0b']].map(([l,v,c])=>(
          <div key={l} style={card()}><div style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:.5,marginBottom:5}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div></div>
        ))}
      </div>
      {loading ? <Loading/> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:12}}>
          {(xonalar||[]).map(x=>{
            const pct = Math.round(x.band/x.sig*100)
            const col = TC[x.tur]||'#94a3b8'
            return (
              <div key={x.id} style={card({position:'relative',overflow:'hidden'})}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:col}}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div><div style={{fontSize:20,fontWeight:800}}>#{x.raqam}</div><div style={{fontSize:11,color:col,fontWeight:600}}>{x.tur}</div></div>
                  <Bdg label={x.band===x.sig?'Tolik':'Mavjud'} color={x.band===x.sig?'#ef4444':'#10b981'}/>
                </div>
                <div style={{fontSize:11,color:'#94a3b8',marginBottom:6}}>Qavat {x.qavat} · {x.band}/{x.sig} toshak</div>
                <Prog pct={pct} color={pct===100?'#ef4444':col}/>
                <div style={{textAlign:'right',fontSize:9,color:'#94a3b8',marginBottom:8}}>{pct}% band</div>
                <div style={{display:'flex',gap:3}}>
                  {Array.from({length:x.sig}).map((_,i)=>(
                    <div key={i} style={{flex:1,height:24,borderRadius:3,background:i<x.band?col+'25':'#f1f5f9',border:'1px solid',borderColor:i<x.band?col+'50':'#e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>
                      {i<x.band?'🛏':''}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Dorilar ────────────────────────────────────────────────────────────────
function Dorilar(){
  const [dorilar, loading, reload] = useLoad(api.getDorilar)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)

  const kam = (dorilar||[]).filter(x=>x.holat==='Kam').length
  const fil = (dorilar||[]).filter(x=>!search||x.nom.toLowerCase().includes(search.toLowerCase())||x.kat.toLowerCase().includes(search.toLowerCase()))

  const save = async data => {
    setSaving(true)
    try {
      if(modal==='add') await api.addDori(data)
      else await api.updDori(modal.id, data)
      await reload(); setModal(null)
    } catch(e){ alert(e.message) }
    setSaving(false)
  }

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div><h2 style={{fontSize:18,fontWeight:800}}>Dorilar omborxonasi</h2><div style={{fontSize:11,color:'#94a3b8'}}>Jami {(dorilar||[]).length} ta</div></div>
        <Btn onClick={()=>setModal('add')}>+ Dori qoshish</Btn>
      </div>
      {kam>0&&(
        <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:9,padding:'10px 14px',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div><div style={{fontSize:12,fontWeight:700,color:'#ef4444'}}>Diqqat! {kam} ta dori kam qoldi</div><div style={{fontSize:11,color:'#94a3b8'}}>Zudlik bilan toldiring</div></div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}}>
        {[['Normal','#10b981'],['Etiborli','#f59e0b'],['Kam','#ef4444']].map(([h,c])=>(
          <div key={h} style={card({display:'flex',alignItems:'center',gap:10,padding:'12px 14px'})}>
            <div style={{fontSize:22,fontWeight:800,color:c}}>{(dorilar||[]).filter(x=>x.holat===h).length}</div>
            <div style={{fontSize:12,fontWeight:600,color:'#475569'}}>{h}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:7,background:'#fff',border:'1px solid #e2e8f0',borderRadius:7,padding:'6px 11px',marginBottom:12,maxWidth:280}}>
        <span>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Dori qidirish...' style={{border:'none',outline:'none',fontSize:13,width:'100%'}}/>
      </div>
      <div style={card({padding:0,overflow:'hidden'})}>
        {loading ? <Loading/> : (
          <table>
            <THead cols={['Dori nomi','Kategoriya','Miqdor','Min.','Narx (som)','Muddat','Holat','']}/>
            <tbody>
              {fil.map(x=>{
                const col = DHOLAT_C[x.holat]||'#94a3b8'
                const pct = Math.min(Math.round(x.miqdor/(x.min*3)*100),100)
                return (
                  <TRow key={x.id}>
                    <TD><div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:30,height:30,borderRadius:7,background:col+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>💊</div>
                      <div><div style={{fontSize:12,fontWeight:600}}>{x.nom}</div><div style={{fontSize:10,color:'#94a3b8'}}>{x.ishlab_chiqaruvchi}</div></div>
                    </div></TD>
                    <TD><span style={{fontSize:10,padding:'2px 8px',background:'#f1f5f9',borderRadius:99,fontWeight:600}}>{x.kat}</span></TD>
                    <TD><div style={{fontSize:12,fontWeight:700,color:x.miqdor<x.min?'#ef4444':'#0f172a'}}>{x.miqdor} dona</div><Prog pct={pct} color={col}/></TD>
                    <TD style={{fontSize:12,color:'#94a3b8'}}>{x.min}</TD>
                    <TD style={{fontSize:12,fontWeight:600}}>{(x.narx||0).toLocaleString()}</TD>
                    <TD style={{fontSize:11,color:'#475569'}}>{x.muddati||'-'}</TD>
                    <TD><Bdg label={x.holat} color={col}/></TD>
                    <TD><div style={{display:'flex',gap:4}}>
                      <Btn sm ghost color='#475569' onClick={()=>setModal({...x})}>✏</Btn>
                      <Btn sm danger onClick={async()=>{if(window.confirm("O'chirilsinmi?")){await api.delDori(x.id);await reload()}}}>✕</Btn>
                    </div></TD>
                  </TRow>
                )
              })}
              {fil.length===0&&<tr><td colSpan={8}><Empty icon='💊' text='Topilmadi'/></td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modal&&<DoriModal dori={modal==='add'?null:modal} onSave={save} onClose={()=>setModal(null)} saving={saving}/>}
    </div>
  )
}

function DoriModal({dori, onSave, onClose, saving}){
  const DEF = {nom:'',kat:'Umumiy',miqdor:'',min:'',narx:'',ishlab_chiqaruvchi:'',muddati:''}
  const [f, setF] = useState(dori ? {...DEF,...dori} : DEF)
  const s = k => v => setF(p=>({...p,[k]:v}))
  return (
    <Modal title={dori?'Dorini tahrirlash':'Yangi dori qoshish'} onClose={onClose} wide>
      <FormGrid>
        <Full><Inp label='Dori nomi' required value={f.nom} onChange={s('nom')} placeholder='Amlodipin 5mg'/></Full>
        <Inp label='Kategoriya' value={f.kat} onChange={s('kat')} options={DORI_KATS}/>
        <Inp label='Ishlab chiqaruvchi' value={f.ishlab_chiqaruvchi} onChange={s('ishlab_chiqaruvchi')} placeholder='Pfizer'/>
        <Inp label='Miqdor (dona)' value={f.miqdor} onChange={s('miqdor')} type='number' placeholder='100'/>
        <Inp label='Min. zaxira' value={f.min} onChange={s('min')} type='number' placeholder='30'/>
        <Inp label='Narx (som)' value={f.narx} onChange={s('narx')} type='number' placeholder='12000'/>
        <Inp label='Muddat (yil-oy)' value={f.muddati} onChange={s('muddati')} placeholder='2027-06'/>
      </FormGrid>
      <MFoot onClose={onClose} onSave={()=>{if(!f.nom.trim()){alert('Nom kiriting!');return};onSave({...f,miqdor:+f.miqdor,min:+f.min,narx:+f.narx})}} loading={saving}/>
    </Modal>
  )
}

// ── Vazifalar ──────────────────────────────────────────────────────────────
function Vazifalar(){
  const [vazifalar, loading, reload] = useLoad(api.getVazifalar)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const MUHIMLIK_C = {Yuqori:'#ef4444',Oddiy:'#0ea5e9',"O'rta":'#f59e0b'}
  const HOLAT_C = {Kutilmoqda:'#f59e0b',Jarayonda:'#0ea5e9',Bajarildi:'#10b981',Bekor:'#94a3b8'}

  const save = async data => {
    setSaving(true)
    try {
      if(modal==='add') await api.addVazifa(data)
      else await api.updVazifa(modal.id, data)
      await reload(); setModal(null)
    } catch(e){ alert(e.message) }
    setSaving(false)
  }

  const cols = ['Kutilmoqda','Jarayonda','Bajarildi']

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div><h2 style={{fontSize:18,fontWeight:800}}>Vazifalar</h2><div style={{fontSize:11,color:'#94a3b8'}}>Jami {(vazifalar||[]).length} ta</div></div>
        <Btn onClick={()=>setModal('add')}>+ Yangi vazifa</Btn>
      </div>
      {loading ? <Loading/> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          {cols.map(col=>(
            <div key={col} style={{background:'#f8fafc',borderRadius:10,padding:12}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:HOLAT_C[col]||'#94a3b8'}}/>
                <span style={{fontSize:12,fontWeight:700}}>{col}</span>
                <span style={{marginLeft:'auto',fontSize:11,color:'#94a3b8'}}>{(vazifalar||[]).filter(v=>v.holat===col).length}</span>
              </div>
              {(vazifalar||[]).filter(v=>v.holat===col).map(v=>(
                <div key={v.id} style={card({padding:'10px 12px',marginBottom:8,cursor:'pointer'})} onClick={()=>setModal({...v})}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:6,gap:6}}>
                    <div style={{fontSize:12,fontWeight:700,flex:1}}>{v.sarlavha}</div>
                    <Bdg label={v.muhimlik} color={MUHIMLIK_C[v.muhimlik]||'#94a3b8'} size={9}/>
                  </div>
                  {v.tavsif&&<div style={{fontSize:11,color:'#475569',marginBottom:6,lineHeight:1.4}}>{v.tavsif}</div>}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    {v.muddati&&<span style={{fontSize:10,color:'#94a3b8'}}>📅 {v.muddati}</span>}
                    {v.tayinlangan&&<span style={{fontSize:10,color:'#0ea5e9'}}>👤 {v.tayinlangan}</span>}
                  </div>
                </div>
              ))}
              {(vazifalar||[]).filter(v=>v.holat===col).length===0&&(
                <div style={{textAlign:'center',padding:'20px 0',color:'#94a3b8',fontSize:11}}>Vazifa yoq</div>
              )}
            </div>
          ))}
        </div>
      )}
      {modal&&<VazifaModal v={modal==='add'?null:modal} onSave={save} onClose={()=>setModal(null)} saving={saving} onDel={async(id)=>{if(window.confirm("O'chirilsinmi?")){await api.delVazifa(id);await reload();setModal(null)}}}/>}
    </div>
  )
}

function VazifaModal({v, onSave, onClose, saving, onDel}){
  const DEF = {sarlavha:'',tavsif:'',muhimlik:'Oddiy',holat:'Kutilmoqda',muddati:'',tayinlangan:''}
  const [f, setF] = useState(v ? {...DEF,...v} : DEF)
  const s = k => val => setF(p=>({...p,[k]:val}))
  return (
    <Modal title={v?'Vazifani tahrirlash':'Yangi vazifa'} onClose={onClose}>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:12}}>
        <Inp label='Sarlavha' required value={f.sarlavha} onChange={s('sarlavha')} placeholder='Vazifa nomi...'/>
        <Inp label='Tavsif' value={f.tavsif} onChange={s('tavsif')} placeholder='Batafsil...' rows={2}/>
        <Inp label='Muhimlik' value={f.muhimlik} onChange={s('muhimlik')} options={['Oddiy',"O'rta",'Yuqori']}/>
        <Inp label='Holat' value={f.holat} onChange={s('holat')} options={['Kutilmoqda','Jarayonda','Bajarildi','Bekor']}/>
        <Inp label='Muddat' value={f.muddati} onChange={s('muddati')} type='date'/>
        <Inp label='Tayinlangan' value={f.tayinlangan} onChange={s('tayinlangan')} placeholder="Masul xodim..."/>
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'space-between',marginTop:8,paddingTop:12,borderTop:'1px solid #f1f5f9'}}>
        {v?<Btn danger sm onClick={()=>onDel(v.id)}>🗑 O'chirish</Btn>:<div/>}
        <div style={{display:'flex',gap:8}}>
          <Btn ghost color='#475569' onClick={onClose}>Bekor</Btn>
          <Btn onClick={()=>{if(!f.sarlavha.trim()){alert('Sarlavha kiriting!');return};onSave(f)}} disabled={saving}>{saving?'...':'Saqlash'}</Btn>
        </div>
      </div>
    </Modal>
  )
}

// ── Statistika ─────────────────────────────────────────────────────────────
function Statistika(){
  const [stats, loading] = useLoad(api.getStatistika)
  const [bemorlar] = useLoad(api.getBemorlar)
  const maxN = Math.max(...OYLIK.map(d=>d.n))

  if(loading) return <Loading/>
  const jami = stats?.jami_daromad||0
  const tol = stats?.tolangan||0
  const mutStat = [['Kardiologiya',45,'#0ea5e9'],['Endokrinologiya',32,'#10b981'],['Ortopediya',28,'#8b5cf6'],['Pulmonologiya',19,'#f59e0b'],['Ginekologiya',38,'#ef4444']]

  return (
    <div>
      <div style={{marginBottom:16}}><h2 style={{fontSize:18,fontWeight:800}}>Statistika va hisobotlar</h2><div style={{fontSize:11,color:'#94a3b8'}}>Real vaqt ma'lumotlari (SQLite bazasidan)</div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        <StatCard icon='👥' label='Jami bemorlar' value={stats?.bemorlar||0} color='#0ea5e9'/>
        <StatCard icon='🩺' label='Shifokorlar' value={stats?.shifokorlar||0} color='#10b981'/>
        <StatCard icon='🚨' label='Kritik bemorlar' value={stats?.kritik||0} color='#ef4444'/>
        <StatCard icon='💊' label='Kam dorilar' value={stats?.kam_dori||0} color='#f59e0b'/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:14,marginBottom:14}}>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:12}}>Bemorlar soni (oylik trend)</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:6,height:100}}>
            {OYLIK.map((d,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                <div style={{fontSize:9,color:'#94a3b8'}}>{d.n}</div>
                <div style={{width:'100%',borderRadius:'3px 3px 0 0',background:i===OYLIK.length-1?'#0ea5e9':'#bae6fd',height:Math.round(d.n/maxN*85)+5+'px'}}/>
                <div style={{fontSize:9,color:'#94a3b8'}}>{d.o}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:12}}>Moliya xulosasi</div>
          {[['Jami daromad',jami,'#8b5cf6'],['Tolangan',tol,'#10b981'],['Kutilmoqda',jami-tol,'#f59e0b']].map(([l,v,c])=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 11px',background:'#f8fafc',borderRadius:7,marginBottom:6}}>
              <span style={{fontSize:12,color:'#475569'}}>{l}</span>
              <span style={{fontSize:13,fontWeight:700,color:c}}>{v.toLocaleString()}</span>
            </div>
          ))}
          <div style={{fontSize:11,color:'#94a3b8',marginTop:8}}>Tolov foizi: <span style={{fontWeight:700,color:'#10b981'}}>{jami?Math.round(tol/jami*100):0}%</span></div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:12}}>Mutaxassislar boyicha</div>
          {mutStat.map(([m,n,c])=>(
            <div key={m} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <div style={{fontSize:12,minWidth:120,color:'#475569'}}>{m}</div>
              <div style={{flex:1}}><Prog pct={Math.round(n/162*100)} color={c}/></div>
              <div style={{fontSize:12,fontWeight:700,minWidth:24,textAlign:'right'}}>{n}</div>
            </div>
          ))}
        </div>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:12}}>Bemorlar holati</div>
          {Object.entries(BHOLAT_C).map(([h,c])=>{
            const n = (bemorlar||[]).filter(b=>b.holat===h).length
            const total = (bemorlar||[]).length||1
            return (
              <div key={h} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <div style={{fontSize:12,minWidth:110,color:'#475569'}}>{h}</div>
                <div style={{flex:1}}><Prog pct={Math.round(n/total*100)} color={c}/></div>
                <div style={{fontSize:12,fontWeight:700,minWidth:20,textAlign:'right'}}>{n}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Xabarlar ───────────────────────────────────────────────────────────────
function Xabarlar(){
  const [xabarlar, loading, reload] = useLoad(api.getXabarlar)
  const turCol = {info:'#0ea5e9',success:'#10b981',warning:'#f59e0b',danger:'#ef4444'}
  const turIcon = {info:'ℹ',success:'✓',warning:'⚠',danger:'‼'}
  const unread = (xabarlar||[]).filter(x=>!x.oqilgan).length

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div><h2 style={{fontSize:18,fontWeight:800}}>Xabarlar</h2><div style={{fontSize:11,color:'#94a3b8'}}>{unread} ta oqilmagan</div></div>
        {unread>0&&<Btn sm ghost color='#475569' onClick={async()=>{await api.oqiBarchasi();await reload()}}>Barchasini oqilgan qil</Btn>}
      </div>
      {loading ? <Loading/> : (xabarlar||[]).map(x=>{
        const c = turCol[x.tur]||'#0ea5e9'
        return (
          <div key={x.id} onClick={async()=>{if(!x.oqilgan){await api.oqiXabar(x.id);await reload()}}} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 12px',borderRadius:8,marginBottom:6,border:`1px solid ${x.oqilgan?'#e2e8f0':c+'33'}`,background:x.oqilgan?'#fff':'#f0f9ff',cursor:'pointer',transition:'background .15s'}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:c+'18',color:c,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{turIcon[x.tur]||'💬'}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:2}}>{x.kimdan}</div>
              <div style={{fontSize:13,fontWeight:x.oqilgan?400:600}}>{x.matn}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
              <div style={{fontSize:10,color:'#94a3b8'}}>{x.vaqt}</div>
              {!x.oqilgan&&<div style={{width:7,height:7,borderRadius:'50%',background:'#0ea5e9'}}/>}
            </div>
          </div>
        )
      })}
      <div style={card({marginTop:16})}>
        <div style={{fontWeight:700,marginBottom:12}}>📨 Xabar yuborish</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Inp label='Kanal' value='SMS' onChange={()=>{}} options={['SMS','Telegram','Email']}/>
          <Inp label='Matn' value='' onChange={()=>{}} placeholder='Xabar matni...' rows={3}/>
          <Btn onClick={()=>alert('Xabar yuborildi!')} style={{width:'fit-content'}}>💬 Yuborish</Btn>
        </div>
      </div>
    </div>
  )
}

// ── Sozlamalar ─────────────────────────────────────────────────────────────
function Sozlamalar(){
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <div style={{marginBottom:16}}><h2 style={{fontSize:18,fontWeight:800}}>Tizim sozlamalari</h2></div>
      {saved&&<div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,padding:'10px 14px',marginBottom:14,fontSize:12,fontWeight:600,color:'#10b981'}}>✅ Saqlandi!</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:14}}>🏥 Klinika ma'lumotlari</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <Inp label='Klinika nomi' value='MedClinic Tibbiyot Markazi' onChange={()=>{}}/>
            <Inp label='Manzil' value="Toshkent, Amir Temur kochasi 15" onChange={()=>{}}/>
            <Inp label='Telefon' value='+998 71 123 45 67' onChange={()=>{}}/>
            <Inp label='Email' value='info@medclinic.uz' onChange={()=>{}}/>
            <Inp label='Ish vaqti' value='Du-Ju 08:00-20:00, Sha 09:00-17:00' onChange={()=>{}}/>
            <Btn color='#10b981' onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}}>💾 Saqlash</Btn>
          </div>
        </div>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:14}}>🔒 Xavfsizlik</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <Inp label='Joriy parol' value='' onChange={()=>{}} type='password' placeholder='••••••••'/>
            <Inp label='Yangi parol' value='' onChange={()=>{}} type='password' placeholder='••••••••'/>
            <Inp label='Tasdiqlash' value='' onChange={()=>{}} type='password' placeholder='••••••••'/>
            <Btn onClick={()=>alert('Parol ozgartirildi!')}>Parolni ozgartirish</Btn>
          </div>
        </div>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:14}}>💬 Xabarnomalar</div>
          {[['SMS xabarnomalar','Navbat eslatmalari','#10b981'],['Telegram bot','Interaktiv xabarlar','#0ea5e9'],['Email hisobotlar','Kunlik statistika','#10b981'],['Push bildirishnomalar','Mobil ilova','#94a3b8']].map(([l,s,c])=>(
            <div key={l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f1f5f9'}}>
              <div><div style={{fontSize:13,fontWeight:600}}>{l}</div><div style={{fontSize:11,color:'#94a3b8'}}>{s}</div></div>
              <div style={{width:36,height:20,borderRadius:99,background:c,position:'relative',cursor:'pointer'}}><div style={{width:16,height:16,borderRadius:'50%',background:'#fff',position:'absolute',right:2,top:2}}/></div>
            </div>
          ))}
        </div>
        <div style={card({padding:18})}>
          <div style={{fontWeight:700,marginBottom:14}}>📊 Tizim ma'lumotlari</div>
          {[['Versiya','2.0.0 — Pro'],['Backend','Node.js + SQLite'],['Frontend','React 18 + Vite'],['Oxirgi backup','Bugun 03:00'],['Foydalanuvchilar','12 ta aktiv'],['Uptime','99.9%'],['Malumotlar bazasi','clinic.db (SQLite)']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f1f5f9'}}>
              <span style={{fontSize:12,color:'#475569'}}>{k}</span>
              <span style={{fontSize:12,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── App Root ───────────────────────────────────────────────────────────────
const PAGE_LABELS = {dashboard:'Bosh sahifa',bemorlar:'Bemorlar',shifokorlar:'Shifokorlar',yonaltirish:'Yonaltirish',uchrashuvlar:'Uchrashuvlar',laboratoriya:'Laboratoriya',moliya:'Moliya',xonalar:'Xonalar',dorilar:'Dorilar',vazifalar:'Vazifalar',tibbiy_karta:'Tibbiy kartalar',statistika:'Statistika',xabarlar:'Xabarlar',sozlamalar:'Sozlamalar'}

export default function App(){
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mc_user')) } catch { return null }
  })

  const logout = () => {
    localStorage.removeItem('mc_user')
    setUser(null)
  }

  if (!user) return <Auth onLogin={setUser}/>

  return <AppMain user={user} onLogout={logout}/>
}

// ── Yonaltirish ────────────────────────────────────────────────────────────
function Yonaltirish(){
  const [bemorlar,,reloadB] = useLoad(api.getBemorlar)
  const [shifokorlar] = useLoad(api.getShifokorlar)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [yonaltirishlar, setY] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('mc_yonaltirish')||'[]') }catch{ return [] }
  })

  const saveY = (list) => {
    setY(list)
    localStorage.setItem('mc_yonaltirish', JSON.stringify(list))
  }

  const addY = (data) => {
    setSaving(true)
    const b = (bemorlar||[]).find(x=>x.id===+data.bId)
    const shFrom = (shifokorlar||[]).find(x=>x.id===+data.shFromId)
    const shTo = (shifokorlar||[]).find(x=>x.id===+data.shToId)
    const item = {
      id: Date.now(), bId:+data.bId, shFromId:+data.shFromId, shToId:+data.shToId,
      sabab: data.sabab, muhimlik: data.muhimlik, sana: TODAY,
      holat: 'Kutilmoqda', izoh: data.izoh||'',
      bNom: b?.ism||'?', shFromNom: shFrom?.ism||'?', shToNom: shTo?.ism||'?',
      shToMut: shTo?.mutaxassis||'?'
    }
    // Update bemor's shifokor
    api.updBemor(+data.bId, {...b, shId:+data.shToId}).catch(()=>{})
    saveY([item, ...yonaltirishlar])
    setSaving(false)
    setModal(null)
  }

  const changeHolat = (id, holat) => {
    saveY(yonaltirishlar.map(y=>y.id===id?{...y,holat}:y))
  }
  const del = (id) => { if(window.confirm("O'chirilsinmi?")) saveY(yonaltirishlar.filter(y=>y.id!==id)) }

  const MUH_C = {Shoshilinch:'#ef4444', Yuqori:'#f59e0b', Oddiy:'#0ea5e9'}
  const HOL_C = {Kutilmoqda:'#f59e0b', Qabul_qilindi:'#10b981', Bajarildi:'#8b5cf6', Bekor:'#94a3b8'}

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:800}}>Shifokorlar yonaltirishi</h2>
          <div style={{fontSize:11,color:'#94a3b8'}}>Bemorni boshqa mutaxassisga yuborish</div>
        </div>
        <Btn onClick={()=>setModal('add')}>+ Yangi yonaltirish</Btn>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
        {[
          ['Jami',yonaltirishlar.length,'#0ea5e9'],
          ['Kutilmoqda',yonaltirishlar.filter(y=>y.holat==='Kutilmoqda').length,'#f59e0b'],
          ['Bajarildi',yonaltirishlar.filter(y=>y.holat==='Bajarildi').length,'#10b981'],
          ['Shoshilinch',yonaltirishlar.filter(y=>y.muhimlik==='Shoshilinch').length,'#ef4444'],
        ].map(([l,v,c])=>(
          <div key={l} style={card({position:'relative',overflow:'hidden'})}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:c}}/>
            <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:12,color:'#475569',marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      {yonaltirishlar.length===0
        ? <div style={card({textAlign:'center',padding:50,color:'#94a3b8'})}>
            <div style={{fontSize:40,marginBottom:10}}>🔀</div>
            <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Yonaltirish yoq</div>
            <div style={{fontSize:12}}>Birinchi yonaltirishni qo'shing</div>
          </div>
        : <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {yonaltirishlar.map(y=>{
              const hc = HOL_C[y.holat]||'#94a3b8'
              const mc = MUH_C[y.muhimlik]||'#0ea5e9'
              return (
                <div key={y.id} style={card({padding:'14px 18px'})}>
                  <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
                    {/* Bemor */}
                    <div style={{display:'flex',alignItems:'center',gap:8,minWidth:150}}>
                      <Avt name={y.bNom} size={36}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:700}}>{y.bNom}</div>
                        <div style={{fontSize:10,color:'#94a3b8'}}>Bemor</div>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,minWidth:120}}>
                      <div style={{fontSize:10,color:'#94a3b8',fontWeight:600}}>{y.shFromNom.split(' ').slice(-1)[0]}</div>
                      <div style={{display:'flex',alignItems:'center',gap:4}}>
                        <div style={{width:40,height:2,background:'#e2e8f0',borderRadius:99}}/>
                        <span style={{fontSize:18}}>➡️</span>
                        <div style={{width:40,height:2,background:'#0ea5e9',borderRadius:99}}/>
                      </div>
                      <div style={{fontSize:10,color:'#0ea5e9',fontWeight:700}}>{y.shToNom.split(' ').slice(-1)[0]}</div>
                    </div>
                    {/* To shifokor */}
                    <div style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
                      <Avt name={y.shToNom} color={SH_COLS[y.shToId%SH_COLS.length]} size={36}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:700}}>{y.shToNom}</div>
                        <div style={{fontSize:10,color:'#94a3b8'}}>{y.shToMut}</div>
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{flex:1,minWidth:120}}>
                      <div style={{fontSize:12,color:'#475569',marginBottom:3}}>{y.sabab}</div>
                      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                        <Bdg label={y.muhimlik} color={mc}/>
                        <span style={{fontSize:10,color:'#94a3b8'}}>{y.sana}</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <select value={y.holat} onChange={e=>changeHolat(y.id,e.target.value)} style={{fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:99,border:`1px solid ${hc}44`,background:hc+'15',color:hc,cursor:'pointer',outline:'none'}}>
                        {['Kutilmoqda','Qabul_qilindi','Bajarildi','Bekor'].map(h=><option key={h} value={h}>{h.replace('_',' ')}</option>)}
                      </select>
                      <Btn sm danger onClick={()=>del(y.id)}>✕</Btn>
                    </div>
                  </div>
                  {y.izoh&&<div style={{marginTop:8,padding:'6px 10px',background:'#f8fafc',borderRadius:6,fontSize:11,color:'#475569',fontStyle:'italic'}}>💬 {y.izoh}</div>}
                </div>
              )
            })}
          </div>
      }

      {modal&&(
        <Modal title="Yangi yonaltirish" onClose={()=>setModal(null)} wide>
          {(()=>{
            const [f,setF]=useState({bId:'',shFromId:'',shToId:'',sabab:'',muhimlik:'Oddiy',izoh:''})
            const s=k=>v=>setF(p=>({...p,[k]:v}))
            return <>
              <FormGrid>
                <Full><Inp label='Bemor *' value={f.bId} onChange={v=>s('bId')(v)} options={[{v:'',l:'Tanlang'},...(bemorlar||[]).map(b=>({v:b.id,l:b.ism}))]}/></Full>
                <Inp label='Qaysi shifokordan *' value={f.shFromId} onChange={v=>s('shFromId')(v)} options={[{v:'',l:'Tanlang'},...(shifokorlar||[]).map(sh=>({v:sh.id,l:sh.ism+' ('+sh.mutaxassis+')'}))]}/>
                <Inp label='Qaysi shifokorga *' value={f.shToId} onChange={v=>s('shToId')(v)} options={[{v:'',l:'Tanlang'},...(shifokorlar||[]).filter(sh=>sh.id!==+f.shFromId).map(sh=>({v:sh.id,l:sh.ism+' ('+sh.mutaxassis+')'}))]}/>
                <Full><Inp label='Yonaltirish sababi *' value={f.sabab} onChange={s('sabab')} placeholder='Masalan: Yurak muammosi uchun kardiologga...'/></Full>
                <Inp label='Muhimlik' value={f.muhimlik} onChange={s('muhimlik')} options={['Oddiy','Yuqori','Shoshilinch']}/>
                <div/>
                <Full><Inp label='Qoshimcha izoh' value={f.izoh} onChange={s('izoh')} placeholder='Ixtiyoriy...' rows={2}/></Full>
              </FormGrid>
              {f.bId&&f.shFromId&&f.shToId&&(
                <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:8,padding:'10px 13px',marginBottom:12,fontSize:12,color:'#0369a1'}}>
                  <b>{(bemorlar||[]).find(x=>x.id===+f.bId)?.ism}</b> — {(shifokorlar||[]).find(x=>x.id===+f.shFromId)?.ism} dan <b>{(shifokorlar||[]).find(x=>x.id===+f.shToId)?.ism}</b> ga yonaltiriladi
                </div>
              )}
              <MFoot onClose={()=>setModal(null)} onSave={()=>{
                if(!f.bId||!f.shFromId||!f.shToId||!f.sabab.trim()){alert('Barcha majburiy maydonlarni toldiring!');return}
                if(f.shFromId===f.shToId){alert('Bir xil shifokorni tanlab bolmaydi!');return}
                addY(f)
              }} loading={saving}/>
            </>
          })()}
        </Modal>
      )}
    </div>
  )
}

// ── Tibbiy Kartalar ─────────────────────────────────────────────────────────
function TibbiyKarta(){
  const [bemorlar,,reload] = useLoad(api.getBemorlar)
  const [shifokorlar] = useLoad(api.getShifokorlar)
  const [lab] = useLoad(api.getLab)
  const [uchr] = useLoad(()=>api.getUchr('barchasi'))
  const [moliya] = useLoad(()=>api.getMoliya('Barchasi'))
  const [sel, setSel] = useState(null)
  const [search, setSearch] = useState('')

  const fil = (bemorlar||[]).filter(b=>!search||b.ism.toLowerCase().includes(search.toLowerCase())||b.raqam.includes(search))

  const bemor = sel ? (bemorlar||[]).find(x=>x.id===sel) : null
  const sh = bemor ? (shifokorlar||[]).find(x=>x.id===bemor.shId) : null
  const bLab = bemor ? (lab||[]).filter(l=>l.bId===bemor.id) : []
  const bUchr = bemor ? (uchr||[]).filter(u=>u.bId===bemor.id) : []
  const bMol = bemor ? (moliya||[]).filter(m=>m.bId===bemor.id) : []
  const jami = bMol.reduce((a,m)=>a+m.summa,0)
  const tol = bMol.reduce((a,m)=>m.holat==='Tolangan'?a+m.summa:a,0)

  return (
    <div style={{display:'grid',gridTemplateColumns:sel?'280px 1fr':'1fr',gap:14,height:'calc(100vh - 88px)',overflow:'hidden'}}>
      {/* List */}
      <div style={{display:'flex',flexDirection:'column',gap:8,overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,background:'#fff',border:'1px solid #e2e8f0',borderRadius:7,padding:'6px 11px',flexShrink:0}}>
          <span>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Bemor qidirish...' style={{border:'none',outline:'none',fontSize:13,width:'100%'}}/>
        </div>
        {fil.map(b=>{
          const c=BHOLAT_C[b.holat]||'#94a3b8'
          return (
            <div key={b.id} onClick={()=>setSel(b.id)} style={{...card({padding:'10px 12px',cursor:'pointer'}),background:sel===b.id?'#f0f9ff':'#fff',borderColor:sel===b.id?'#0ea5e9':'#e2e8f0'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <Avt name={b.ism} size={32}/>
                <div style={{flex:1,overflow:'hidden'}}>
                  <div style={{fontSize:12,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.ism}</div>
                  <div style={{fontSize:10,color:'#94a3b8'}}>{b.raqam} · {b.yosh} yosh</div>
                </div>
                <Bdg label={b.holat} color={c} size={9}/>
              </div>
            </div>
          )
        })}
        {fil.length===0&&<Empty icon='👥' text='Topilmadi'/>}
      </div>

      {/* Detail */}
      {bemor ? (
        <div style={{overflowY:'auto',display:'flex',flexDirection:'column',gap:12}}>
          {/* Header card */}
          <div style={{background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:12,padding:'20px 24px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'rgba(14,165,233,.1)'}}/>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#0ea5e9,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:'#fff',flexShrink:0}}>{ini(bemor.ism)}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:800,color:'#fff'}}>{bemor.ism}</div>
                <div style={{fontSize:12,color:'#94a3b8',marginTop:2}}>{bemor.raqam} · {bemor.yosh} yosh · {bemor.jinsi}</div>
                <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
                  <Bdg label={bemor.holat} color={BHOLAT_C[bemor.holat]||'#94a3b8'}/>
                  <span style={{fontSize:11,color:'#7dd3fc'}}>🩸 {bemor.qon} · {sh?.ism||'Shifokor yoq'}</span>
                </div>
              </div>
              <button onClick={()=>setSel(null)} style={{background:'rgba(255,255,255,.1)',border:'none',borderRadius:7,width:30,height:30,color:'#fff',cursor:'pointer',fontSize:16}}>×</button>
            </div>
          </div>

          {/* Info grid */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {[
              ['📞 Telefon',bemor.tel||'-'],
              ['🏠 Manzil',bemor.manzil||'-'],
              ['🎂 Tugilgan sana',bemor.tug_sana||'-'],
              ['⚕️ Kasallik',bemor.kasallik||'-'],
              ['🧬 Allergiya',bemor.allergiya||'-'],
              ['📅 Oxirgi tashrif',bemor.oxirgi||'-'],
            ].map(([k,v])=>(
              <div key={k} style={card({padding:'10px 13px'})}>
                <div style={{fontSize:10,color:'#94a3b8',marginBottom:3}}>{k}</div>
                <div style={{fontSize:12,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>

          {/* Moliya summary */}
          <div style={card({padding:'14px 16px'})}>
            <div style={{fontWeight:700,marginBottom:10}}>💰 Moliyaviy holat</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
              {[['Jami hisob',jami,'#8b5cf6'],['Tolangan',tol,'#10b981'],['Qarz',jami-tol,'#ef4444']].map(([l,v,c])=>(
                <div key={l} style={{background:'#f8fafc',borderRadius:8,padding:'10px 12px'}}>
                  <div style={{fontSize:10,color:'#94a3b8',marginBottom:3}}>{l}</div>
                  <div style={{fontSize:15,fontWeight:800,color:c}}>{v.toLocaleString()}</div>
                  <div style={{fontSize:9,color:'#94a3b8'}}>som</div>
                </div>
              ))}
            </div>
          </div>

          {/* Uchrashuvlar tarixi */}
          <div style={card({padding:'14px 16px'})}>
            <div style={{fontWeight:700,marginBottom:10}}>📅 Uchrashuvlar tarixi ({bUchr.length})</div>
            {bUchr.length===0?<div style={{color:'#94a3b8',fontSize:12}}>Uchrashuv yoq</div>:
              <div style={{maxHeight:160,overflowY:'auto'}}>
                {bUchr.map(u=>{
                  const sh2=(shifokorlar||[]).find(x=>x.id===u.shId)
                  return (
                    <div key={u.id} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:'1px solid #f1f5f9'}}>
                      <div style={{fontSize:12,fontWeight:700,color:'#0ea5e9',minWidth:36}}>{u.vaqt}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:600}}>{u.sana} · {u.tur}</div>
                        <div style={{fontSize:10,color:'#94a3b8'}}>{sh2?.ism||''}</div>
                      </div>
                      <Bdg label={u.holat} color={UHOLAT_C[u.holat]||'#94a3b8'} size={9}/>
                    </div>
                  )
                })}
              </div>
            }
          </div>

          {/* Lab tarixi */}
          <div style={card({padding:'14px 16px'})}>
            <div style={{fontWeight:700,marginBottom:10}}>🔬 Tahlillar tarixi ({bLab.length})</div>
            {bLab.length===0?<div style={{color:'#94a3b8',fontSize:12}}>Tahlil yoq</div>:
              <div style={{maxHeight:140,overflowY:'auto'}}>
                {bLab.map(l=>{
                  const nc=l.natija==='Normal'?'#10b981':l.natija==='-'?'#94a3b8':'#ef4444'
                  return (
                    <div key={l.id} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:'1px solid #f1f5f9'}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:600}}>{l.tur}</div>
                        <div style={{fontSize:10,color:'#94a3b8'}}>{l.sana}</div>
                      </div>
                      <Bdg label={l.holat} color={l.holat==='Tayyor'?'#10b981':l.holat==='Jarayonda'?'#0ea5e9':'#f59e0b'} size={9}/>
                      {l.natija!=='-'&&<Bdg label={l.natija} color={nc} size={9}/>}
                    </div>
                  )
                })}
              </div>
            }
          </div>

          {bemor.izoh&&(
            <div style={card({padding:'12px 15px',borderColor:'#fef9c3',background:'#fffbeb'})}>
              <div style={{fontSize:10,fontWeight:700,color:'#92400e',marginBottom:4}}>📝 IZOH</div>
              <div style={{fontSize:12,color:'#78350f'}}>{bemor.izoh}</div>
            </div>
          )}
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'#94a3b8'}}>
          <div style={{fontSize:50,marginBottom:14}}>📋</div>
          <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>Bemor tanlang</div>
          <div style={{fontSize:12}}>Chap tarafdan bemorni tanlang</div>
        </div>
      )}
    </div>
  )
}


function AppMain({user, onLogout}){
  const [page, setPage] = useState('dashboard')
  const [xabarlar] = useLoad(api.getXabarlar)
  const [dorilar] = useLoad(api.getDorilar)
  const [uchr] = useLoad(()=>api.getUchr('bugun'))

  const badges = {
    uchrashuvlar: (uchr||[]).filter(u=>u.holat==='Kutilmoqda').length,
    dorilar: (dorilar||[]).filter(d=>d.holat==='Kam').length,
    xabarlar: (xabarlar||[]).filter(x=>!x.oqilgan).length,
    vazifalar: 0,
  }

  const PAGES = {
    dashboard:<Dashboard setPage={setPage} user={user}/>,
    bemorlar:<Bemorlar/>,
    shifokorlar:<Shifokorlar/>,
    uchrashuvlar:<Uchrashuvlar/>,
    laboratoriya:<Laboratoriya/>,
    moliya:<Moliya/>,
    xonalar:<Xonalar/>,
    dorilar:<Dorilar/>,
    yonaltirish:<Yonaltirish/>,
    tibbiy_karta:<TibbiyKarta/>,
    statistika:<Statistika/>,
    xabarlar:<Xabarlar/>,
    sozlamalar:<Sozlamalar/>,
  }

  return (
    <div style={{display:"flex",position:"fixed",top:0,left:0,width:"100vw",height:"100vh",overflow:"hidden"}}>
      <Sidebar page={page} setPage={setPage} badges={badges} user={user} onLogout={onLogout}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{height:52,background:'#fff',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:15,fontWeight:800}}>{PAGE_LABELS[page]}</span>
            <span style={{fontSize:11,color:'#94a3b8'}}>{TODAY_LABEL}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:7}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'#10b981'}}/>
              <span style={{fontSize:11,fontWeight:600,color:'#10b981'}}>Backend ulangan</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:7}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,#0ea5e9,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff'}}>{user?.avatar||'??'}</div>
              <div>
                <div style={{fontSize:11,fontWeight:700,lineHeight:1.2}}>{user?.ism}</div>
                <div style={{fontSize:9,color:'#94a3b8'}}>{user?.rol}</div>
              </div>
              <button onClick={onLogout} title="Chiqish" style={{background:'#fee2e2',border:'none',borderRadius:5,width:22,height:22,cursor:'pointer',color:'#ef4444',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',marginLeft:4}}>⏻</button>
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:18,background:'#f0f9ff'}}>
          {PAGES[page]}
        </div>
      </div>
    </div>
  )
}

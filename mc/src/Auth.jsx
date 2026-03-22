import React, { useState } from 'react'

const TIPS = [
  'Barcha bemorlar malumotlari bir joyda',
  'Uchrashuvlarni oson rejalashtiring',
  'Dori zaxirasini nazorat qiling',
  'Real vaqt statistikasi',
  'Laboratoriya natijalari tezda',
  'Moliya hisoboti avtomatik',
]

function getUsers() {
  try { return JSON.parse(localStorage.getItem('mc_users') || '[]') } catch { return [] }
}
function saveUsers(u) { localStorage.setItem('mc_users', JSON.stringify(u)) }

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ ism: '', login: '', parol: '', parol2: '', rol: 'Shifokor' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const set = k => v => setF(p => ({ ...p, [k]: v }))
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)]

  // Ensure default admin exists
  React.useEffect(() => {
    const users = getUsers()
    if (!users.find(u => u.login === 'admin')) {
      saveUsers([...users, { id: 1, ism: 'Aziz Botirov', login: 'admin', parol: 'admin123', rol: 'Super Admin', avatar: 'AB' }])
    }
  }, [])

  const submit = () => {
    setErr('')
    if (!f.login.trim() || !f.parol) return setErr('Login va parolni kiriting!')
    setLoading(true)
    setTimeout(() => {
      const users = getUsers()
      if (mode === 'login') {
        const user = users.find(u => u.login === f.login.trim() && u.parol === f.parol)
        if (!user) { setErr("Login yoki parol noto'g'ri!"); setLoading(false); return }
        const { parol, ...safe } = user
        localStorage.setItem('mc_user', JSON.stringify(safe))
        onLogin(safe)
      } else {
        if (!f.ism.trim()) { setErr('Ismingizni kiriting!'); setLoading(false); return }
        if (f.parol !== f.parol2) { setErr('Parollar mos emas!'); setLoading(false); return }
        if (f.parol.length < 4) { setErr("Parol kamida 4 ta belgi bo'lsin!"); setLoading(false); return }
        if (users.find(u => u.login === f.login.trim())) { setErr('Bu login band!'); setLoading(false); return }
        const avatar = f.ism.trim().split(' ').map(n => n[0]).slice(0, 2).join('')
        const nw = { id: Date.now(), ism: f.ism.trim(), login: f.login.trim(), parol: f.parol, rol: f.rol, avatar }
        saveUsers([...users, nw])
        const { parol, ...safe } = nw
        localStorage.setItem('mc_user', JSON.stringify(safe))
        onLogin(safe)
      }
      setLoading(false)
    }, 400)
  }

  const ROL = ['Super Admin', 'Bosh Shifokor', 'Shifokor', 'Hamshira', 'Kassir', 'Laborant']
  const inp = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 13px', fontSize: 14, outline: 'none', width: '100%', color: '#0f172a', boxSizing: 'border-box', fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', background: 'linear-gradient(135deg,#0c1a2e 0%,#1a3a5c 50%,#0c1a2e 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '30px 16px 50px', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ position: 'fixed', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(14,165,233,.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(16,185,129,.05)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(14,165,233,.4)' }}>🏥</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>MedClinic Pro</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Klinika Boshqaruv Tizimi</div>
        </div>

        {/* Tip */}
        <div style={{ background: 'rgba(14,165,233,.1)', border: '1px solid rgba(14,165,233,.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span style={{ fontSize: 12, color: '#7dd3fc' }}>{tip}</span>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 18, padding: 26, boxShadow: '0 25px 60px rgba(0,0,0,.35)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 11, padding: 4, marginBottom: 20 }}>
            {[['login', '🔐 Kirish'], ['register', "✏️ Ro'yxat"]].map(([k, l]) => (
              <button key={k} onClick={() => { setMode(k); setErr('') }} style={{ flex: 1, padding: '9px 0', border: 'none', borderRadius: 8, background: mode === k ? '#fff' : 'transparent', color: mode === k ? '#0f172a' : '#64748b', fontWeight: mode === k ? 700 : 500, fontSize: 13, cursor: 'pointer', boxShadow: mode === k ? '0 1px 4px rgba(0,0,0,.12)' : 'none', transition: 'all .2s', fontFamily: 'inherit' }}>{l}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 5 }}>Ism Familiya</label>
                <input value={f.ism} onChange={e => set('ism')(e.target.value)} placeholder="Aziz Botirov" style={inp} />
              </div>
            )}

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 5 }}>Login</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>👤</span>
                <input value={f.login} onChange={e => set('login')(e.target.value)} placeholder="admin" style={{ ...inp, paddingLeft: 40 }} onKeyDown={e => e.key === 'Enter' && submit()} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 5 }}>Parol</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>🔒</span>
                <input type={showPass ? 'text' : 'password'} value={f.parol} onChange={e => set('parol')(e.target.value)} placeholder="••••••••" style={{ ...inp, paddingLeft: 40, paddingRight: 40 }} onKeyDown={e => e.key === 'Enter' && submit()} />
                <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#94a3b8', padding: 0 }}>{showPass ? '🙈' : '👁'}</button>
              </div>
            </div>

            {mode === 'register' && (<>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 5 }}>Parolni tasdiqlang</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>🔐</span>
                  <input type={showPass ? 'text' : 'password'} value={f.parol2} onChange={e => set('parol2')(e.target.value)} placeholder="••••••••" style={{ ...inp, paddingLeft: 40 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 5 }}>Lavozim</label>
                <select value={f.rol} onChange={e => set('rol')(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  {ROL.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </>)}

            {err && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 13px', fontSize: 13, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠️</span><span>{err}</span>
              </div>
            )}

            <button onClick={submit} disabled={loading} style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 15px rgba(14,165,233,.4)' }}>
              {loading ? '⏳ Kuting...' : (mode === 'login' ? '🚀 Tizimga kirish' : "✅ Ro'yxatdan o'tish")}
            </button>
          </div>

          {mode === 'login' && (
            <div style={{ marginTop: 14, padding: '11px 14px', background: '#f8fafc', borderRadius: 9, fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 1.7 }}>
              <b style={{ color: '#0f172a' }}>Demo akkaunt:</b><br />
              Login: <code style={{ background: '#e2e8f0', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>admin</code>
              &nbsp;&nbsp;Parol: <code style={{ background: '#e2e8f0', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>admin123</code>
            </div>
          )}

          {/* Features */}
          <div style={{ marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>Tizim imkoniyatlari</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
              {[['👥', 'Bemorlar'], ['🩺', 'Shifokorlar'], ['📅', 'Uchrashuvlar'], ['💊', 'Dorilar'], ['💰', 'Moliya'], ['📊', 'Statistika'], ['🔬', 'Laboratoriya'], ['✅', 'Vazifalar']].map(([ic, tx]) => (
                <div key={tx} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', background: '#f8fafc', borderRadius: 6 }}>
                  <span style={{ fontSize: 13 }}>{ic}</span>
                  <span style={{ fontSize: 11, color: '#475569' }}>{tx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#334155' }}>
          MedClinic Pro © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}

// ── Local Storage Database (backend shart emas) ────────────────────────────
const d = (offset=0) => {
  const dt = new Date(); dt.setDate(dt.getDate()+offset)
  return dt.toISOString().slice(0,10)
}
const D0=d(0),D1=d(1),D2=d(2),Dm1=d(-1),Dm2=d(-2),Dm3=d(-3),Dm5=d(-5),Dm10=d(-10)

const SEED = {
  bemorlar:[
    {id:1,raqam:'B-0001',ism:'Alisher Karimov',yosh:34,jinsi:'Erkak',tel:'+998 90 123 45 67',manzil:'Toshkent, Chilonzor',qon:'B+',kasallik:'Gipertoniya',holat:'Davolanmoqda',shId:1,oxirgi:Dm5,tug_sana:'1992-05-12',allergiya:'Penitsillin',izoh:'Yuqori qon bosimi'},
    {id:2,raqam:'B-0002',ism:'Malika Yusupova',yosh:28,jinsi:'Ayol',tel:'+998 91 234 56 78',manzil:'Toshkent, Yunusobod',qon:'A+',kasallik:'Diabet II tur',holat:'Nazoratda',shId:2,oxirgi:Dm2,tug_sana:'1998-03-22',allergiya:'',izoh:'Insulin davolash'},
    {id:3,raqam:'B-0003',ism:'Bobur Toshmatov',yosh:52,jinsi:'Erkak',tel:'+998 93 345 67 89',manzil:'Samarqand',qon:'O-',kasallik:'Yurak kasalligi',holat:'Kritik',shId:3,oxirgi:D0,tug_sana:'1974-11-08',allergiya:'Aspirin',izoh:'Yurak urishi buzilishi'},
    {id:4,raqam:'B-0004',ism:'Nilufar Hasanova',yosh:41,jinsi:'Ayol',tel:'+998 94 456 78 90',manzil:'Toshkent',qon:'AB+',kasallik:'Allergiya',holat:'Sogaydi',shId:1,oxirgi:Dm10,tug_sana:'1985-07-30',allergiya:'',izoh:'Davolash yakunlandi'},
    {id:5,raqam:'B-0005',ism:'Jasur Ergashev',yosh:19,jinsi:'Erkak',tel:'+998 97 567 89 01',manzil:'Toshkent, Sergeli',qon:'A-',kasallik:'Bronxit',holat:'Davolanmoqda',shId:4,oxirgi:Dm1,tug_sana:'2007-02-14',allergiya:'',izoh:'Antibiotik kursi'},
    {id:6,raqam:'B-0006',ism:'Zulfiya Nazarova',yosh:63,jinsi:'Ayol',tel:'+998 99 678 90 12',manzil:'Fargona',qon:'B-',kasallik:'Osteoporoz',holat:'Nazoratda',shId:2,oxirgi:Dm3,tug_sana:'1963-09-05',allergiya:'',izoh:'Kaltsiy qabul'},
    {id:7,raqam:'B-0007',ism:'Sardor Mirzayev',yosh:45,jinsi:'Erkak',tel:'+998 90 789 01 23',manzil:'Andijon',qon:'O+',kasallik:'Suyak sinishi',holat:'Reabilitatsiya',shId:5,oxirgi:D0,tug_sana:'1981-12-20',allergiya:'',izoh:'Fizioterapiya kursi'},
    {id:8,raqam:'B-0008',ism:'Feruza Abdullayeva',yosh:31,jinsi:'Ayol',tel:'+998 91 890 12 34',manzil:'Toshkent',qon:'A+',kasallik:'Homiladorlik nazorati',holat:'Nazoratda',shId:6,oxirgi:Dm1,tug_sana:'1995-06-18',allergiya:'',izoh:'24 haftalik homiladorlik'},
  ],
  shifokorlar:[
    {id:1,ism:'Dr. Ravshan Umarov',mutaxassis:'Kardiolog',tajriba:15,tel:'+998 90 111 22 33',xona:'201',holat:'Ish joyida',reyting:4.9,bio:'15 yillik tajribaga ega kardiolog',ish:'Du-Ju 09:00-17:00',email:'umarov@medclinic.uz'},
    {id:2,ism:'Dr. Dilnoza Saidova',mutaxassis:'Endokrinolog',tajriba:12,tel:'+998 91 222 33 44',xona:'105',holat:'Ish joyida',reyting:4.8,bio:'Endokrinologiya sohasida mutaxassis',ish:'Du-Sha 08:00-16:00',email:'saidova@medclinic.uz'},
    {id:3,ism:'Dr. Timur Xolmatov',mutaxassis:'Kardiolog',tajriba:20,tel:'+998 93 333 44 55',xona:'203',holat:'Operatsiyada',reyting:4.9,bio:'Murakkab yurak operatsiyalari eksperti',ish:'Du-Ju 10:00-18:00',email:'xolmatov@medclinic.uz'},
    {id:4,ism:'Dr. Sarvinoz Qodirov',mutaxassis:'Pulmonolog',tajriba:8,tel:'+998 94 444 55 66',xona:'302',holat:'Ish joyida',reyting:4.7,bio:'Nafas yollari kasalliklari mutaxassisi',ish:'Se-Sha 09:00-17:00',email:'qodirov@medclinic.uz'},
    {id:5,ism:'Dr. Behruz Nazarov',mutaxassis:'Ortoped',tajriba:18,tel:'+998 97 555 66 77',xona:'108',holat:'Tatilda',reyting:4.8,bio:'Suyak va bogim kasalliklari mutaxassisi',ish:'Du-Ju 08:00-16:00',email:'nazarov@medclinic.uz'},
    {id:6,ism:'Dr. Kamola Yusupova',mutaxassis:'Ginekolog',tajriba:10,tel:'+998 99 666 77 88',xona:'210',holat:'Ish joyida',reyting:4.9,bio:'Xotin-qizlar salomatligi mutaxassisi',ish:'Du-Sha 09:00-17:00',email:'yusupova@medclinic.uz'},
  ],
  uchrashuvlar:[
    {id:1,bId:1,shId:1,sana:D0,vaqt:'09:00',tur:'Nazorat',holat:'Kutilmoqda',xona:'201',izoh:'Qon bosimini tekshirish'},
    {id:2,bId:2,shId:2,sana:D0,vaqt:'10:30',tur:'Davolash',holat:'Kutilmoqda',xona:'105',izoh:'Insulin sozlash'},
    {id:3,bId:3,shId:3,sana:D0,vaqt:'08:00',tur:'Favqulodda',holat:'Tugallandi',xona:'203',izoh:'Yurak urishi buzilishi'},
    {id:4,bId:5,shId:4,sana:D0,vaqt:'14:00',tur:'Birinchi qabul',holat:'Kutilmoqda',xona:'302',izoh:''},
    {id:5,bId:7,shId:5,sana:D0,vaqt:'11:00',tur:'Reabilitatsiya',holat:'Jarayonda',xona:'108',izoh:'Fizioterapiya'},
    {id:6,bId:8,shId:6,sana:D1,vaqt:'09:30',tur:'Nazorat',holat:'Rejalashtirilgan',xona:'210',izoh:'Oylik tekshiruv'},
    {id:7,bId:4,shId:1,sana:D1,vaqt:'13:00',tur:'Nazorat',holat:'Rejalashtirilgan',xona:'201',izoh:''},
    {id:8,bId:6,shId:2,sana:D2,vaqt:'10:00',tur:'Davolash',holat:'Rejalashtirilgan',xona:'105',izoh:'Kaltsiy davolash'},
  ],
  lab:[
    {id:1,bId:1,tur:'Qon tahlili',sana:Dm1,holat:'Tayyor',natija:'Normal',izoh:'Umumiy qon tahlili'},
    {id:2,bId:2,tur:'Shakar tahlili',sana:Dm1,holat:'Tayyor',natija:'Yuqori',izoh:'8.2 mmol/L'},
    {id:3,bId:3,tur:'EKG',sana:D0,holat:'Jarayonda',natija:'-',izoh:''},
    {id:4,bId:5,tur:'Rentgen',sana:D0,holat:'Kutilmoqda',natija:'-',izoh:'Kokrak qafasi rentgeni'},
    {id:5,bId:7,tur:'MRT',sana:Dm2,holat:'Tayyor',natija:'Normal',izoh:'Bel umurtqasi MRT'},
    {id:6,bId:8,tur:'Ultratovush',sana:D0,holat:'Jarayonda',natija:'-',izoh:'Homila ultratovushi'},
  ],
  moliya:[
    {id:1,bId:1,tur:'Qabul',summa:150000,holat:'Tolangan',sana:Dm5,usul:'Naqd',izoh:''},
    {id:2,bId:2,tur:'Tahlil',summa:80000,holat:'Tolangan',sana:Dm2,usul:'Karta',izoh:''},
    {id:3,bId:3,tur:'Operatsiya',summa:2500000,holat:'Kutilmoqda',sana:Dm1,usul:'-',izoh:'Yurak operatsiyasi'},
    {id:4,bId:5,tur:'Qabul',summa:150000,holat:'Tolangan',sana:Dm1,usul:'Karta',izoh:''},
    {id:5,bId:7,tur:'Reabilitatsiya',summa:350000,holat:'Qisman',sana:D0,usul:'Naqd',izoh:'Birinchi tolov'},
    {id:6,bId:4,tur:'Dori',summa:220000,holat:'Tolangan',sana:Dm10,usul:'Karta',izoh:''},
    {id:7,bId:6,tur:'Tahlil',summa:120000,holat:'Tolangan',sana:Dm3,usul:'Naqd',izoh:''},
    {id:8,bId:8,tur:'Qabul',summa:150000,holat:'Tolangan',sana:Dm1,usul:'Karta',izoh:''},
  ],
  xonalar:[
    {id:1,raqam:'101',tur:'Umumiy',sig:4,band:2,qavat:1},
    {id:2,raqam:'102',tur:'Umumiy',sig:4,band:4,qavat:1},
    {id:3,raqam:'201',tur:'Yakka',sig:1,band:1,qavat:2},
    {id:4,raqam:'202',tur:'Yakka',sig:1,band:0,qavat:2},
    {id:5,raqam:'301',tur:'Reanimatsiya',sig:3,band:1,qavat:3},
    {id:6,raqam:'302',tur:'Operatsiya',sig:2,band:1,qavat:3},
  ],
  dorilar:[
    {id:1,nom:'Amlodipin 5mg',kat:'Kardiologiya',miqdor:240,min:50,narx:12000,holat:'Etiborli',ishlab_chiqaruvchi:'Pfizer',muddati:'2027-06'},
    {id:2,nom:'Metformin 500mg',kat:'Endokrinologiya',miqdor:180,min:60,narx:8500,holat:'Normal',ishlab_chiqaruvchi:'Gedeon Richter',muddati:'2027-12'},
    {id:3,nom:'Aspirin 100mg',kat:'Umumiy',miqdor:45,min:100,narx:5000,holat:'Kam',ishlab_chiqaruvchi:'Bayer',muddati:'2026-09'},
    {id:4,nom:'Lisinopril 10mg',kat:'Kardiologiya',miqdor:320,min:50,narx:15000,holat:'Normal',ishlab_chiqaruvchi:'Novartis',muddati:'2028-03'},
    {id:5,nom:'Salbutamol inhaler',kat:'Pulmonologiya',miqdor:28,min:30,narx:45000,holat:'Kam',ishlab_chiqaruvchi:'GSK',muddati:'2026-11'},
    {id:6,nom:'Kaltsiy D3',kat:'Ortopediya',miqdor:150,min:40,narx:32000,holat:'Normal',ishlab_chiqaruvchi:'Nycomed',muddati:'2027-08'},
    {id:7,nom:'Paratsetamol 500mg',kat:'Umumiy',miqdor:500,min:200,narx:3500,holat:'Normal',ishlab_chiqaruvchi:'Various',muddati:'2028-01'},
    {id:8,nom:'Omeprazol 20mg',kat:'Gastroenterologiya',miqdor:85,min:40,narx:9000,holat:'Normal',ishlab_chiqaruvchi:'AstraZeneca',muddati:'2027-05'},
  ],
  vazifalar:[
    {id:1,sarlavha:'Dori zaxirasini tekshirish',tavsif:'Aspirin va Salbutamol kam',muhimlik:'Yuqori',holat:'Kutilmoqda',muddati:D1,tayinlangan:'Hamshira Dilnoza'},
    {id:2,sarlavha:'Lab jihozlarini tekshirish',tavsif:'Oylik texnik korik',muhimlik:'Oddiy',holat:'Bajarildi',muddati:Dm1,tayinlangan:'Lab xodimi'},
    {id:3,sarlavha:'Yangi shifokor suhbati',tavsif:'Nevrolog lavozimiga',muhimlik:'Yuqori',holat:'Jarayonda',muddati:D2,tayinlangan:'HR bolimi'},
    {id:4,sarlavha:'Moliya hisobotini tayyorlash',tavsif:'Oylik moliya xulosasi',muhimlik:"O'rta",holat:'Kutilmoqda',muddati:d(8),tayinlangan:'Moliya bolimi'},
    {id:5,sarlavha:'Xona tozaligini nazorat',tavsif:'Haftalik sanitariya',muhimlik:'Oddiy',holat:'Kutilmoqda',muddati:D1,tayinlangan:'Tozalik xizmati'},
  ],
  xabarlar:[
    {id:1,kimdan:'Tizim',matn:'Dr. Umarov bugun 3 ta navbat kutmoqda',vaqt:'09:00',tur:'info',oqilgan:false},
    {id:2,kimdan:'Laboratoriya',matn:'Jasur Ergashev rentgen natijasi tayyor',vaqt:'10:15',tur:'success',oqilgan:false},
    {id:3,kimdan:'Moliya',matn:'Bobur Toshmatov tolovi kutilmoqda',vaqt:'11:30',tur:'warning',oqilgan:false},
    {id:4,kimdan:'Tizim',matn:'Aspirin 100mg kam qoldi (45 dona)',vaqt:'08:00',tur:'danger',oqilgan:true},
    {id:5,kimdan:'Hamshira',matn:'201-xona bemori holati yaxshilanmoqda',vaqt:'12:00',tur:'success',oqilgan:true},
  ],
}

// ── LocalStorage helpers ────────────────────────────────────────────────────
function load() {
  try {
    const saved = localStorage.getItem('mc_db')
    if (!saved) { localStorage.setItem('mc_db', JSON.stringify(SEED)); return JSON.parse(JSON.stringify(SEED)) }
    return JSON.parse(saved)
  } catch { return JSON.parse(JSON.stringify(SEED)) }
}
function save(data) {
  try { localStorage.setItem('mc_db', JSON.stringify(data)) } catch(e) { console.error('Save error', e) }
}
function nxtId(arr) { return arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1 }
const today = () => new Date().toISOString().slice(0,10)

// ── API ─────────────────────────────────────────────────────────────────────
const delay = (ms=30) => new Promise(r=>setTimeout(r,ms))

export const api = {
  // BEMORLAR
  getBemorlar: async (q='', holat='Barchasi') => {
    await delay()
    let list = load().bemorlar
    if (q) list = list.filter(b=>b.ism.toLowerCase().includes(q.toLowerCase())||b.raqam.includes(q))
    if (holat!=='Barchasi') list = list.filter(b=>b.holat===holat)
    return [...list].reverse()
  },
  addBemor: async (item) => {
    await delay()
    const data = load()
    const raqam = 'B-'+String(data.bemorlar.length+1).padStart(4,'0')
    const nb = {...item, id:nxtId(data.bemorlar), raqam, oxirgi:today()}
    data.bemorlar.push(nb); save(data); return nb
  },
  updBemor: async (id, item) => {
    await delay()
    const data = load()
    const i = data.bemorlar.findIndex(x=>x.id===+id)
    if(i<0) throw new Error('Topilmadi')
    data.bemorlar[i] = {...data.bemorlar[i],...item,id:+id}
    save(data); return data.bemorlar[i]
  },
  delBemor: async (id) => {
    await delay()
    const data = load()
    data.bemorlar = data.bemorlar.filter(x=>x.id!==+id)
    save(data); return {ok:true}
  },

  // SHIFOKORLAR
  getShifokorlar: async () => { await delay(); return load().shifokorlar },
  addSh: async (item) => {
    await delay()
    const data = load()
    const ns = {...item, id:nxtId(data.shifokorlar)}
    data.shifokorlar.push(ns); save(data); return ns
  },
  updSh: async (id, item) => {
    await delay()
    const data = load()
    const i = data.shifokorlar.findIndex(x=>x.id===+id)
    if(i<0) throw new Error('Topilmadi')
    data.shifokorlar[i] = {...data.shifokorlar[i],...item,id:+id}
    save(data); return data.shifokorlar[i]
  },
  delSh: async (id) => {
    await delay()
    const data = load()
    data.shifokorlar = data.shifokorlar.filter(x=>x.id!==+id)
    save(data); return {ok:true}
  },

  // UCHRASHUVLAR
  getUchr: async (tab='barchasi') => {
    await delay()
    const t = today()
    let list = load().uchrashuvlar
    if(tab==='bugun') list = list.filter(u=>u.sana===t)
    else if(tab==='kelasi') list = list.filter(u=>u.sana>t)
    return [...list].sort((a,b)=>a.vaqt.localeCompare(b.vaqt))
  },
  addUchr: async (item) => {
    await delay()
    const data = load()
    const nu = {...item, id:nxtId(data.uchrashuvlar), holat:item.holat||'Kutilmoqda'}
    data.uchrashuvlar.push(nu); save(data); return nu
  },
  updUchr: async (id, item) => {
    await delay()
    const data = load()
    const i = data.uchrashuvlar.findIndex(x=>x.id===+id)
    if(i<0) throw new Error('Topilmadi')
    data.uchrashuvlar[i] = {...data.uchrashuvlar[i],...item,id:+id}
    save(data); return data.uchrashuvlar[i]
  },
  delUchr: async (id) => {
    await delay()
    const data = load()
    data.uchrashuvlar = data.uchrashuvlar.filter(x=>x.id!==+id)
    save(data); return {ok:true}
  },

  // LAB
  getLab: async () => { await delay(); return [...load().lab].reverse() },
  addLab: async (item) => {
    await delay()
    const data = load()
    const nl = {...item, id:nxtId(data.lab), holat:'Kutilmoqda', natija:'-'}
    data.lab.push(nl); save(data); return nl
  },
  updLab: async (id, item) => {
    await delay()
    const data = load()
    const i = data.lab.findIndex(x=>x.id===+id)
    if(i<0) throw new Error('Topilmadi')
    data.lab[i] = {...data.lab[i],...item,id:+id}
    save(data); return data.lab[i]
  },
  delLab: async (id) => {
    await delay()
    const data = load()
    data.lab = data.lab.filter(x=>x.id!==+id)
    save(data); return {ok:true}
  },

  // MOLIYA
  getMoliya: async (holat='Barchasi') => {
    await delay()
    let list = load().moliya
    if(holat!=='Barchasi') list = list.filter(m=>m.holat===holat)
    return [...list].reverse()
  },
  addMoliya: async (item) => {
    await delay()
    const data = load()
    const nm = {...item, id:nxtId(data.moliya)}
    data.moliya.push(nm); save(data); return nm
  },
  updMoliya: async (id, item) => {
    await delay()
    const data = load()
    const i = data.moliya.findIndex(x=>x.id===+id)
    if(i<0) throw new Error('Topilmadi')
    data.moliya[i] = {...data.moliya[i],...item,id:+id}
    save(data); return data.moliya[i]
  },
  delMoliya: async (id) => {
    await delay()
    const data = load()
    data.moliya = data.moliya.filter(x=>x.id!==+id)
    save(data); return {ok:true}
  },

  // XONALAR
  getXonalar: async () => { await delay(); return load().xonalar },
  updXona: async (id, item) => {
    await delay()
    const data = load()
    const i = data.xonalar.findIndex(x=>x.id===+id)
    if(i<0) throw new Error('Topilmadi')
    data.xonalar[i] = {...data.xonalar[i],...item,id:+id}
    save(data); return data.xonalar[i]
  },

  // DORILAR
  getDorilar: async () => { await delay(); return load().dorilar },
  addDori: async (item) => {
    await delay()
    const data = load()
    const holat = item.miqdor<=item.min?'Kam':item.miqdor<=item.min*2?'Etiborli':'Normal'
    const nd = {...item, id:nxtId(data.dorilar), holat}
    data.dorilar.push(nd); save(data); return nd
  },
  updDori: async (id, item) => {
    await delay()
    const data = load()
    const i = data.dorilar.findIndex(x=>x.id===+id)
    if(i<0) throw new Error('Topilmadi')
    const holat = item.miqdor<=item.min?'Kam':item.miqdor<=item.min*2?'Etiborli':'Normal'
    data.dorilar[i] = {...data.dorilar[i],...item,id:+id,holat}
    save(data); return data.dorilar[i]
  },
  delDori: async (id) => {
    await delay()
    const data = load()
    data.dorilar = data.dorilar.filter(x=>x.id!==+id)
    save(data); return {ok:true}
  },

  // VAZIFALAR
  getVazifalar: async () => { await delay(); return [...load().vazifalar].reverse() },
  addVazifa: async (item) => {
    await delay()
    const data = load()
    const nv = {...item, id:nxtId(data.vazifalar)}
    data.vazifalar.push(nv); save(data); return nv
  },
  updVazifa: async (id, item) => {
    await delay()
    const data = load()
    const i = data.vazifalar.findIndex(x=>x.id===+id)
    if(i<0) throw new Error('Topilmadi')
    data.vazifalar[i] = {...data.vazifalar[i],...item,id:+id}
    save(data); return data.vazifalar[i]
  },
  delVazifa: async (id) => {
    await delay()
    const data = load()
    data.vazifalar = data.vazifalar.filter(x=>x.id!==+id)
    save(data); return {ok:true}
  },

  // XABARLAR
  getXabarlar: async () => { await delay(); return [...load().xabarlar].reverse() },
  oqiXabar: async (id) => {
    await delay()
    const data = load()
    const i = data.xabarlar.findIndex(x=>x.id===+id)
    if(i>=0) data.xabarlar[i].oqilgan=true
    save(data); return {ok:true}
  },
  oqiBarchasi: async () => {
    await delay()
    const data = load()
    data.xabarlar.forEach(x=>x.oqilgan=true)
    save(data); return {ok:true}
  },

  // STATISTIKA
  getStatistika: async () => {
    await delay()
    const data = load()
    const t = today()
    return {
      bemorlar: data.bemorlar.length,
      shifokorlar: data.shifokorlar.length,
      bugun: data.uchrashuvlar.filter(u=>u.sana===t).length,
      jami_daromad: data.moliya.reduce((a,m)=>a+(m.summa||0),0),
      tolangan: data.moliya.reduce((a,m)=>m.holat==='Tolangan'?a+(m.summa||0):a,0),
      kritik: data.bemorlar.filter(b=>b.holat==='Kritik').length,
      kam_dori: data.dorilar.filter(d=>d.holat==='Kam').length,
      holat_stats: data.bemorlar.reduce((a,b)=>{a[b.holat]=(a[b.holat]||0)+1;return a},{}),
    }
  },
}

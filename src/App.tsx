// OM Global Trade – Fixed storefront with Admin tools
// - Always-visible embedded catalog (25 items)
// - Admin login (om-2025) -> CSV Import / Save / Export / JSON URL Load & Clear
// - Product modal with image slider & options
// - Multi-item cart & simple checkout
// - Price parsing & CSV parsing robust; Vercel-friendly strings

import * as React from "react"

type Category = "KOR_LIVING" | "CULTURE" | "CA_FOODS" | "TOOLS" | "RAW"
interface Product {
  id: string
  name: { ko: string; en: string }
  category: Category
  price_cad: number
  image: string
  desc: { ko: string; en: string }
  stock: number
  rating?: number
  options?: { label: string; values: string[] }[]
  gallery?: string[]
}

const DEFAULT_JSON_URL = "https://www.omglobaltrade.shop/omglobal_catalog.json"
const museo = { fontFamily: "MuseoModerno, ui-sans-serif, system-ui" }
const LOGO = "https://i.postimg.cc/vBDBgY03/IMG-3298.jpg"
const STORAGE_JSON_KEY = "om_catalog_json"
const STORAGE_URL_KEY = "om_catalog_url"
const STORAGE_ADMIN_KEY = "om_is_admin"
const price = (p: Product) => Number(p?.price_cad ?? 0)


// ===== Embedded catalog (25) =====
const CATALOG_EMBED: Product[] = [
  {"id":"p-0001","name":{"ko":"규조토 발매트","en":"Diatomite Bath Mat"},"category":"KOR_LIVING","price_cad":22,"image":"https://i.postimg.cc/kBjDWL3d/2025-09-04-10-24-45.png","desc":{"ko":"빠른 건조, 흡수력 우수","en":"Quick-dry absorbent bath mat"},"stock":120,"rating":4.8,"gallery":["https://i.postimg.cc/kBjDWL3d/2025-09-04-10-24-45.png","https://i.postimg.cc/9rfQX14g/2025-09-04-10-25-49.png"]},
  {"id":"p-0002","name":{"ko":"스테인리스 집게(20p)","en":"Stainless Pegs (20p)"},"category":"KOR_LIVING","price_cad":13,"image":"https://i.postimg.cc/Yvh0R8ML/2025-09-04-10-25-03.png","desc":{"ko":"녹 방지 강력 집게","en":"Rust-proof strong pegs"},"stock":200,"rating":4.8,"gallery":["https://i.postimg.cc/Yvh0R8ML/2025-09-04-10-25-03.png"]},
  {"id":"p-0003","name":{"ko":"김치 보관용기 5L","en":"Kimchi Keeper 5L"},"category":"KOR_LIVING","price_cad":24.5,"image":"https://i.postimg.cc/1nRL071L/2025-09-05-6-49-53.png","desc":{"ko":"밀폐력 좋은 김치 전용기","en":"Odor-sealed airtight kimchi container"},"stock":80,"rating":4.8,"gallery":["https://i.postimg.cc/1nRL071L/2025-09-05-6-49-53.png"]},
  {"id":"p-0004","name":{"ko":"대나무 칫솔(4개)","en":"Bamboo Toothbrush 4-pack"},"category":"KOR_LIVING","price_cad":9.9,"image":"https://i.postimg.cc/75V91HPZ/2025-09-05-7-01-08.png","desc":{"ko":"친환경 생분해 칫솔","en":"Eco-friendly biodegradable toothbrushes"},"stock":300,"rating":4.8,"gallery":["https://i.postimg.cc/75V91HPZ/2025-09-05-7-01-08.png"]},
  {"id":"p-0005","name":{"ko":"천연 해면수세미(3개)","en":"Natural Loofah (3pc)"},"category":"KOR_LIVING","price_cad":6.5,"image":"https://i.postimg.cc/GB6yGVDp/2025-09-05-7-26-01.png","desc":{"ko":"부드럽고 천연 소재","en":"Kitchen & bath natural scrubber"},"stock":180,"rating":4.7,"gallery":["https://i.postimg.cc/GB6yGVDp/2025-09-05-7-26-01.png"]},

  {"id":"p-0006","name":{"ko":"호랑이 민화 소품(3EA)","en":"Tiger Minhwa Set (3)"},"category":"CULTURE","price_cad":28,"image":"https://i.postimg.cc/YjzvChd0/2025-09-04-5-12-58.png","desc":{"ko":"전통 민화 감성","en":"Korean folk painting style"},"stock":50,"rating":4.7,"gallery":["https://i.postimg.cc/YjzvChd0/2025-09-04-5-12-58.png"]},
  {"id":"p-0007","name":{"ko":"호랑이 엽서 세트","en":"Tiger Postcards"},"category":"CULTURE","price_cad":7.9,"image":"https://i.postimg.cc/tYdwfHRL/Screen-Shot-2023-01-25-at-4-18-26-PM.png","desc":{"ko":"감성 엽서 5매","en":"Set of 5 artistic postcards"},"stock":240,"rating":4.6,"gallery":["https://i.postimg.cc/tYdwfHRL/Screen-Shot-2023-01-25-at-4-18-26-PM.png"]},
  {"id":"p-0008","name":{"ko":"호랑이 아트 프린트","en":"Tiger Art Print"},"category":"CULTURE","price_cad":12,"image":"https://i.postimg.cc/Y40PhGNH/Screen-Shot-2023-03-15-at-7-30-03-PM.png","desc":{"ko":"A4 사이즈 아트 프린트","en":"A4 sized decorative print"},"stock":120,"rating":4.7,"gallery":["https://i.postimg.cc/Y40PhGNH/Screen-Shot-2023-03-15-at-7-30-03-PM.png"]},
  {"id":"p-0009","name":{"ko":"호랑이 벽장식","en":"Tiger Wall Decor"},"category":"CULTURE","price_cad":19.5,"image":"https://i.postimg.cc/zLQcWzpR/Screen-Shot-2023-09-03-at-3-38-30-PM.png","desc":{"ko":"벽걸이 전통 장식","en":"Traditional wall decoration"},"stock":60,"rating":4.7,"gallery":["https://i.postimg.cc/zLQcWzpR/Screen-Shot-2023-09-03-at-3-38-30-PM.png"]},

  {"id":"p-0010","name":{"ko":"메이플 쿠키(캐나다)","en":"Maple Cookies (CA)"},"category":"CA_FOODS","price_cad":5.5,"image":"https://i.postimg.cc/2LZTnnys/2025-09-05-7-00-23.png","desc":{"ko":"달콤한 메이플풍미","en":"Crispy maple flavored cookies"},"stock":300,"rating":4.8,"gallery":["https://i.postimg.cc/2LZTnnys/2025-09-05-7-00-23.png"]},
  {"id":"p-0011","name":{"ko":"메이플 시럽 250ml","en":"Maple Syrup 250ml"},"category":"CA_FOODS","price_cad":9.5,"image":"https://i.postimg.cc/grCgmtBm/2025-09-05-7-00-43.png","desc":{"ko":"캐나다산 순수 시럽","en":"Pure Canadian maple syrup"},"stock":140,"rating":4.9,"gallery":["https://i.postimg.cc/grCgmtBm/2025-09-05-7-00-43.png"]},
  {"id":"p-0012","name":{"ko":"메이플 버터","en":"Maple Butter"},"category":"CA_FOODS","price_cad":8.5,"image":"https://i.postimg.cc/bGwT37dH/2025-09-05-7-00-50.png","desc":{"ko":"발라먹는 달콤버터","en":"Spreadable maple butter"},"stock":90,"rating":4.7,"gallery":["https://i.postimg.cc/bGwT37dH/2025-09-05-7-00-50.png"]},
  {"id":"p-0013","name":{"ko":"메이플 사탕","en":"Maple Candies"},"category":"CA_FOODS","price_cad":4.9,"image":"https://i.postimg.cc/75V91HPZ/2025-09-05-7-01-08.png","desc":{"ko":"한입 사이즈 캔디","en":"Bite-size maple candies"},"stock":220,"rating":4.6,"gallery":["https://i.postimg.cc/75V91HPZ/2025-09-05-7-01-08.png"]},

  {"id":"p-0014","name":{"ko":"스테인리스 공구세트","en":"Stainless Tool Set"},"category":"TOOLS","price_cad":49.9,"image":"https://i.postimg.cc/rKbMVT2z/2025-09-05-6-30-09.png","desc":{"ko":"다용도 내구성 우수","en":"Durable multipurpose tool set"},"stock":40,"rating":4.9,"gallery":["https://i.postimg.cc/rKbMVT2z/2025-09-05-6-30-09.png"]},
  {"id":"p-0015","name":{"ko":"정밀 드라이버 세트","en":"Precision Driver Kit"},"category":"TOOLS","price_cad":16.9,"image":"https://i.postimg.cc/Tyvxbcw6/2025-09-05-6-34-20.png","desc":{"ko":"전자제품 수리용","en":"For electronics & small repairs"},"stock":120,"rating":4.7,"gallery":["https://i.postimg.cc/Tyvxbcw6/2025-09-05-6-34-20.png"]},
  {"id":"p-0016","name":{"ko":"작업 장갑(컷방지)","en":"Cut-proof Gloves"},"category":"TOOLS","price_cad":7.5,"image":"https://i.postimg.cc/S2ypTNC1/2025-09-05-6-34-37.png","desc":{"ko":"미끄럼 방지, 내구성","en":"Anti-slip, durable gloves"},"stock":260,"rating":4.6,"gallery":["https://i.postimg.cc/S2ypTNC1/2025-09-05-6-34-37.png"]},
  {"id":"p-0017","name":{"ko":"실리콘 코킹툴","en":"Silicone Caulk Tool"},"category":"TOOLS","price_cad":6.9,"image":"https://i.postimg.cc/4HyRGL8z/2025-09-05-6-34-56.png","desc":{"ko":"코킹 마감용 툴","en":"Caulking finishing tool"},"stock":190,"rating":4.6,"gallery":["https://i.postimg.cc/4HyRGL8z/2025-09-05-6-34-56.png"]},

  {"id":"p-0018","name":{"ko":"캐나다산 참나무 원목","en":"Canadian Oak Lumber"},"category":"RAW","price_cad":35,"image":"https://i.postimg.cc/ZWCPNrQV/2025-09-06-10-49-26.png","desc":{"ko":"가구용 고급 원목","en":"Premium lumber for furniture"},"stock":25,"rating":4.8,"gallery":["https://i.postimg.cc/ZWCPNrQV/2025-09-06-10-49-26.png"]},
  {"id":"p-0019","name":{"ko":"메이플 원자재(슬랩)","en":"Maple Slab"},"category":"RAW","price_cad":42,"image":"https://i.postimg.cc/zy6CFyZ5/2025-09-06-10-49-38.png","desc":{"ko":"자연무늬 원목 슬랩","en":"Natural grain wood slab"},"stock":18,"rating":4.8,"gallery":["https://i.postimg.cc/zy6CFyZ5/2025-09-06-10-49-38.png"]},
  {"id":"p-0020","name":{"ko":"레드파인 집성목","en":"Red Pine Board"},"category":"RAW","price_cad":29,"image":"https://i.postimg.cc/47TpjjxS/2025-09-06-10-49-50.png","desc":{"ko":"경량, 인테리어용","en":"Lightweight, interior use"},"stock":40,"rating":4.7,"gallery":["https://i.postimg.cc/47TpjjxS/2025-09-06-10-49-50.png"]},
  {"id":"p-0021","name":{"ko":"월넛 원목 보드","en":"Walnut Board"},"category":"RAW","price_cad":58,"image":"https://i.postimg.cc/ftjYs53T/2025-09-06-10-49-58.png","desc":{"ko":"고급 원목, 진한색","en":"Dark premium hardwood"},"stock":12,"rating":4.9,"gallery":["https://i.postimg.cc/ftjYs53T/2025-09-06-10-49-58.png"]},

  {"id":"p-0022","name":{"ko":"초극세사 다용도 매트","en":"Ultrafine Utility Mat"},"category":"KOR_LIVING","price_cad":11.9,"image":"https://i.postimg.cc/FYLdmG85/2025-09-06-11-01-59.png","desc":{"ko":"세탁/건조 쉬움","en":"Easy clean & dry"},"stock":210,"rating":4.6,"gallery":["https://i.postimg.cc/FYLdmG85/2025-09-06-11-01-59.png"]},
  {"id":"p-0023","name":{"ko":"방수 테이블 매트","en":"Waterproof Table Mat"},"category":"KOR_LIVING","price_cad":9.9,"image":"https://i.postimg.cc/GBnBpGnB/2025-09-06-11-10-49.png","desc":{"ko":"생활방수 표면","en":"Water-repellent surface"},"stock":160,"rating":4.6,"gallery":["https://i.postimg.cc/GBnBpGnB/2025-09-06-11-10-49.png"]},
  {"id":"p-0024","name":{"ko":"논슬립 데스크 패드","en":"Non-slip Desk Pad"},"category":"KOR_LIVING","price_cad":12.5,"image":"https://i.postimg.cc/wt51RM9w/2025-09-06-11-10-57.png","desc":{"ko":"미끄럼방지, 부드러움","en":"Grippy and soft surface"},"stock":150,"rating":4.7,"gallery":["https://i.postimg.cc/wt51RM9w/2025-09-06-11-10-57.png"]},
  {"id":"p-0025","name":{"ko":"방수 셀프 접착시트","en":"Waterproof Self-adhesive Sheet"},"category":"KOR_LIVING","price_cad":10.9,"image":"https://i.postimg.cc/mz8hVnzM/2025-09-06-11-11-13.png","desc":{"ko":"간편 시공 인테리어","en":"Easy DIY interior sheet"},"stock":170,"rating":4.6,"gallery":["https://i.postimg.cc/mz8hVnzM/2025-09-06-11-11-13.png"]}
]

// ===== Utils =====
const allowedCats: Category[] = ["KOR_LIVING","CULTURE","CA_FOODS","TOOLS","RAW"]
const asStr = (v:any) => typeof v === "string" ? v : v == null ? "" : String(v)
const splitPipes = (v:any): string[] => asStr(v).split("|").map(s=>s.trim()).filter(Boolean)
const nameOf = (p:Product, lang:"ko"|"en") => (p?.name && ((p.name as any)[lang] || (p.name as any).en)) || ""
const descOf = (p:Product, lang:"ko"|"en") => (p?.desc && ((p.desc as any)[lang] || (p.desc as any).en)) || ""

// Robust CSV parser (quoted cells OK)
function parseCSV(csv: string): any[] {
  const raw = csv ? (csv.charCodeAt(0) === 0xFEFF ? csv.slice(1) : csv) : ""
  const split = (line: string): string[] => {
    const out: string[] = []
    let cur = ""
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === "\"") {
        if (inQ && line[i+1] === "\"") { cur += "\""; i++; continue }
        inQ = !inQ; continue
      }
      if (ch === "," && !inQ) { out.push(cur); cur = ""; continue }
      cur += ch
    }
    out.push(cur)
    return out.map(s => s.trim())
  }
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0)
  if (!lines.length) return []
  const headers = split(lines.shift() as string).map(h => h.trim().toLowerCase())
  const idx = (name:string) => headers.findIndex(h => h === name.toLowerCase())
  const rows: any[] = []
  for (const line of lines) {
    const cells = split(line)
    const get = (name:string) => { const i = idx(name); return i >= 0 ? (cells[i] || "") : "" }
    rows.push({
      id: get("id"),
      name_ko: get("name_ko") || get("name"),
      name_en: get("name_en") || get("name"),
      category: get("category"),
      price_cad: get("price_cad") || get("price") || get("priceCad"),
      image_url: get("image_url"),
      desc_ko: get("desc_ko"),
      desc_en: get("desc_en") || get("desc"),
      stock: get("stock"),
      option_1_label: get("option_1_label"),
      option_1_values: get("option_1_values"),
      option_2_label: get("option_2_label"),
      option_2_values: get("option_2_values"),
      gallery_urls: get("gallery_urls"),
    })
  }
  return rows
}

function parsePrice(v:any): number {
  let t = asStr(v).trim()
  if (!t) return 0
  if (/^[0-9,]+$/.test(t)) { // only digits/commas
    t = t.replace(/,/g,"")
    const n = parseInt(t,10)
    return Number.isFinite(n)?n:0
  }
  t = t.replace(/[^0-9.\-]/g, "")
  const dots = (t.match(/\./g)||[]).length
  if (dots>1) { const parts=t.split("."); const last=parts.pop() as string; t=parts.join("")+"."+last }
  const n = parseFloat(t)
  return Number.isFinite(n)?n:0
}

function normalizeProduct(raw:any, i:number): Product {
  const nameKo = raw?.name?.ko ?? raw?.name_ko ?? raw?.name ?? ""
  const nameEn = raw?.name?.en ?? raw?.name_en ?? raw?.name ?? ""
  const descKo = raw?.desc?.ko ?? raw?.desc_ko ?? ""
  const descEn = raw?.desc?.en ?? raw?.desc_en ?? raw?.desc ?? ""
  const gallery: string[] = Array.isArray(raw?.gallery)
    ? (raw.gallery as any[]).map(asStr).filter(Boolean)
    : splitPipes(raw?.gallery_urls)
  const image = asStr(raw?.image_url || raw?.image || gallery[0] || "")
  const catRaw = asStr(raw?.category).toUpperCase() as Category
  const category: Category = allowedCats.includes(catRaw) ? catRaw : "KOR_LIVING"
  const opt1L = asStr(raw?.option_1_label), opt1V = splitPipes(raw?.option_1_values)
  const opt2L = asStr(raw?.option_2_label), opt2V = splitPipes(raw?.option_2_values)
  const options: {label:string;values:string[]}[] = []
  if (opt1L && opt1V.length) options.push({label:opt1L, values:opt1V})
  if (opt2L && opt2V.length) options.push({label:opt2L, values:opt2V})
  const priceNum = parsePrice(
    raw?.price_cad ?? raw?.price ?? raw?.priceCad
  )
  const stockNum = parseInt(asStr(raw?.stock))
  return {
    id: asStr(raw?.id) || `csv-${i+1}`,
    name: { ko: asStr(nameKo), en: asStr(nameEn) },
    category,
    price_cad: Number.isFinite(priceNum) ? priceNum : 0,
    image,
    desc: { ko: asStr(descKo), en: asStr(descEn) },
    stock: Number.isFinite(stockNum) ? stockNum : 0,
    rating: typeof raw?.rating === "number" ? raw.rating : 4.8,
    ...(options.length ? { options } : {}),
    ...(gallery.length ? { gallery } : {}),
  }
}
function normalizeCatalog(list:any[]): Product[] {
  if (!Array.isArray(list)) return []
  return list.map((r,i)=>normalizeProduct(r,i)).filter(p=>!!p && !!p.id)
}

export default function App(){
  const [lang,setLang]=React.useState<"ko"|"en">("en")
  const [cat,setCat]=React.useState<"ALL"|Category>("ALL")
  const [selected,setSelected]=React.useState<Product|null>(null)
  const [qty,setQty]=React.useState(1)
  const [slide,setSlide]=React.useState(0)
  const [cart,setCart]=React.useState<{p:Product;qty:number}[]>([])
  const [showCart,setShowCart]=React.useState(false)
  const [showCheckout,setShowCheckout]=React.useState(false)

  const [isAdmin,setIsAdmin]=React.useState<boolean>(() => localStorage.getItem(STORAGE_ADMIN_KEY)==="1")
  const [showLogin,setShowLogin]=React.useState(false)
  const [pwd,setPwd]=React.useState("")
  const [jsonURL,setJsonURL]=React.useState<string>(() => localStorage.getItem(STORAGE_URL_KEY) || "")
  const [catalog,setCatalog]=React.useState<Product[]>(CATALOG_EMBED)

  // 선택된 옵션 값 저장
  const [selectedOpts, setSelectedOpts] = React.useState<Record<string, string>>({});

  // Initial load: local JSON -> URL -> embedded
  React.useEffect(()=>{
  const loadDefault = async () => {
    try {
      // 1️⃣ 공용 JSON URL 우선
      const res = await fetch(DEFAULT_JSON_URL)
      const data = await res.json()
      const norm = normalizeCatalog(data)
      if (norm.length) {
        setCatalog(norm)
        return
      }
    } catch(e) {
      console.warn("Default URL load failed, fallback to local/embedded")
    }

    try {
      // 2️⃣ 로컬스토리지 → URL → 임베드 순서로 fallback
      const saved = localStorage.getItem(STORAGE_JSON_KEY)
      if (saved){
        const parsed = JSON.parse(saved)
        const norm = normalizeCatalog(parsed)
        if (norm.length){ setCatalog(norm); return }
      }
      const url = localStorage.getItem(STORAGE_URL_KEY)
      if (url){
        fetch(url).then(r=>r.json()).then((data)=>{
          const norm = normalizeCatalog(data)
          if (norm.length){ setCatalog(norm) }
        })
      }
    }catch{ /* fallback to embedded */ }
  }
  loadDefault()
},[])

// 상품이 선택될 때마다 옵션 기본값 자동 세팅
React.useEffect(() => {
  if (selected && selected.options) {
    const defaults: Record<string,string> = {}
    selected.options.forEach(opt => {
      if (opt.values && opt.values.length > 0) {
        defaults[opt.label] = opt.values[0]   // 각 옵션의 첫 번째 값을 기본 선택
      }
    })
    setSelectedOpts(defaults)
  }
}, [selected])
  
  const displayed = cat==="ALL" ? catalog : catalog.filter(p=>p.category===cat)
  const subtotal = cart.reduce((s,ci)=>s+ci.p.price_cad*ci.qty,0)

  const addToCart=(p:Product,q:number)=>{
    if(p.stock<=0) return
    setCart(prev=>{
      const ex=prev.find(ci=>ci.p.id===p.id)
      return ex? prev.map(ci=>ci.p.id===p.id?{...ci,qty:ci.qty+q}:ci) : [...prev,{p,qty:q}]
    })
    setShowCart(true)
  }

  // ===== Admin actions =====
  const onFile = (f:File) => {
    const r = new FileReader()
    r.onload = () => {
      try {
        const text = (r.result || "").toString()
        const rows = parseCSV(text)
        const norm = normalizeCatalog(rows)
        if (!norm.length){ alert("No valid rows in CSV"); return }
        setCatalog(norm)
        try {
          localStorage.setItem(STORAGE_JSON_KEY, JSON.stringify(norm))
          alert("Imported & saved locally.")
        } catch {}
      } catch (e) {
        console.error(e)
        alert("CSV import failed.")
      }
    }
    r.readAsText(f)
  }

  const saveLocal = () => {
    try{
      localStorage.setItem(STORAGE_JSON_KEY, JSON.stringify(catalog))
      alert("Saved to this browser.")
    }catch(e){ console.error(e); alert("Save failed.") }
  }

  const exportJson = () => {
    try{
      const payload = catalog
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "omglobal_catalog.json"
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1500)
      alert("Export complete. Check your browser Downloads.")
    }catch(e){
      console.error(e)
      alert("Export failed.")
    }
  }

  const loadFromURL = async () => {
    if (!jsonURL) { alert("Enter a JSON URL first."); return }
    try{
      const res = await fetch(jsonURL)
      const data = await res.json()
      const norm = normalizeCatalog(data)
      if (!norm.length){ alert("Loaded but no valid products."); return }
      setCatalog(norm)
      localStorage.setItem(STORAGE_URL_KEY, jsonURL)
      localStorage.setItem(STORAGE_JSON_KEY, JSON.stringify(norm))
      alert("Loaded from URL & saved as default.")
    }catch(e){
      console.error(e)
      alert("Load failed. Check CORS/URL/content.")
    }
  }

  const clearURL = () => {
    localStorage.removeItem(STORAGE_URL_KEY)
    alert("Cleared saved JSON URL.")
  }

  const doLogin = () => {
    if (pwd.trim() === "om-2025"){
      setIsAdmin(true)
      localStorage.setItem(STORAGE_ADMIN_KEY, "1")
      setShowLogin(false)
      setPwd("")
    } else {
      alert("Invalid code.")
    }
  }
  const doLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem(STORAGE_ADMIN_KEY)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <img src={LOGO} alt="logo" className="h-10 w-auto"/>
          <nav className="hidden md:flex gap-4 text-sm ml-6">
            {(["ALL","KOR_LIVING","CULTURE","CA_FOODS","TOOLS","RAW"] as const).map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={"px-2 py-1 rounded hover:bg-slate-100 "+(cat===c?"font-bold underline":"")}>{c}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 text-sm">
            {isAdmin ? (
              <>
                <span className="px-2 py-1 rounded bg-amber-100 border text-amber-900">Admin</span>
                <button onClick={doLogout} className="px-2 py-1 rounded hover:bg-slate-100">Logout</button>
              </>
            ) : (
              <button onClick={()=>setShowLogin(true)} className="px-2 py-1 rounded hover:bg-slate-100">👤 Login</button>
            )}
            <button onClick={()=>setLang(l=>l==="en"?"ko":"en")} className="px-2 py-1 rounded hover:bg-slate-100">{lang==="en"?"🇰🇷 한글":"🇺🇸 EN"}</button>
            <button onClick={()=>setShowCart(true)} className="px-2 py-1 rounded hover:bg-slate-100">🛒 Cart ({cart.length})</button>
          </div>
        </div>

        {/* Admin toolbar */}
        {isAdmin && (
          <div className="bg-slate-50 border-t">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
              <label className="px-2 py-1 rounded bg-white border cursor-pointer">
                Import CSV
                <input type="file" accept=".csv" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onFile(f) }} />
              </label>
              <button onClick={saveLocal} className="px-2 py-1 rounded bg-white border">Save (local)</button>
              <button onClick={exportJson} className="px-2 py-1 rounded bg-white border">Export JSON</button>
              <input value={jsonURL} onChange={e=>setJsonURL(e.target.value)} placeholder="Public JSON URL" className="px-2 py-1 rounded border min-w-[260px] flex-1"/>
              <button onClick={loadFromURL} className="px-2 py-1 rounded bg-white border">Load URL</button>
              <button onClick={clearURL} className="px-2 py-1 rounded bg-white border">Clear URL</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-black/90 text-white py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center px-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold" style={museo}>OM Global Trade</h1>
            <p className="mt-4 text-lg">Global sourcing, trusted trading.</p>
            <p className="text-lg">Cross-border fulfillment, Wholesale & Retail.</p>
          </div>
          <div className="flex justify-center">
            <img src="https://i.postimg.cc/8PpD2KhN/2025-09-05-6-50-02.png" alt="Hero" className="rounded-lg shadow-lg max-h-72 object-cover"/>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4" style={museo}>Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayed.slice(0,12).map(p=>(
            <article key={p.id} onClick={()=>setSelected(p)} className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden cursor-pointer">
              <div className="aspect-[4/3] bg-slate-100"><img src={p.image} alt={nameOf(p,"en")} className="w-full h-full object-cover"/></div>
              <div className="p-3">
                <div className="text-sm font-medium line-clamp-1" style={museo}>{nameOf(p,lang)}</div>
                <div className="text-xs text-slate-500 line-clamp-2">{descOf(p,lang)}</div>
                <div className="mt-2 font-semibold text-slate-900">CAD ${p.price_cad.toFixed(2)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
            <button onClick={()=>setSelected(null)} className="absolute top-2 right-2">✖</button>
            <div className="relative">
              <img src={(selected.gallery && selected.gallery[slide]) || selected.image} alt={nameOf(selected,"en")} className="w-full h-60 object-cover rounded"/>
              {selected.gallery && selected.gallery.length>1 && (
                <>
                  <button onClick={()=>setSlide((slide-1+selected.gallery!.length)%selected.gallery!.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded">‹</button>
                  <button onClick={()=>setSlide((slide+1)%selected.gallery!.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded">›</button>
                </>
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold" style={museo}>{nameOf(selected,lang)}</h3>
            <p className="text-slate-600">{descOf(selected,lang)}</p>
            <div className="mt-2 font-semibold">CAD ${selected.price_cad.toFixed(2)}</div>

            {selected.options && selected.options.length>0 && (
              <div className="mt-3 space-y-2">
                {selected.options.map((opt,i)=>(
                  <div key={i} className="flex items-center gap-2">
                    <label className="text-sm w-24">{opt.label}</label>
                    <select className="border rounded px-2 py-1 flex-1">
                      {opt.values.map(v=>(<option key={v}>{v}</option>))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm">Qty</label>
              <input type="number" min={1} max={selected.stock||99} value={qty} onChange={e=>setQty(Math.max(1,Math.min(Number(e.target.value||1),selected.stock||99)))} className="w-20 border rounded px-2 py-1"/>
            </div>
            <div className="mt-4 flex gap-3">
              <button disabled={selected.stock<=0} className="px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50" onClick={()=>addToCart(selected,qty)}>{selected.stock>0 ? "Add to Cart" : "Sold Out"}</button>
              <button disabled={selected.stock<=0} className="px-4 py-2 rounded border disabled:opacity-50" onClick={()=>{ if(selected.stock>0){ addToCart(selected,qty); setShowCheckout(true); }}}>Buy Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button onClick={()=>setShowCart(false)} className="absolute top-2 right-2">✖</button>
            <h3 className="text-lg font-semibold mb-4">Your Cart</h3>
            {cart.length? (
              <div className="space-y-3">
                {cart.map(ci=>(
                  <div key={ci.p.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden"><img src={ci.p.image} alt={nameOf(ci.p,"en")} className="w-full h-full object-cover"/></div>
                    <div>
                      <div className="font-medium">{nameOf(ci.p,lang)}</div>
                      <div className="text-slate-600">Qty: {ci.qty}</div>
                      <div className="font-semibold">Subtotal: CAD {(ci.p.price_cad*ci.qty).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 font-semibold">Total: CAD {subtotal.toFixed(2)}</div>
                <button className="mt-4 w-full bg-slate-900 text-white rounded px-3 py-2" onClick={()=>{setShowCart(false);setShowCheckout(true)}}>Proceed to Checkout</button>
              </div>
            ) : <p>Your cart is empty.</p>}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button onClick={()=>setShowCheckout(false)} className="absolute top-2 right-2">✖</button>
            <h3 className="text-lg font-semibold mb-4">Checkout</h3>
            <div className="space-y-3 mb-4">
              <input className="w-full border rounded px-3 py-2" placeholder="Full Name"/>
              <input className="w-full border rounded px-3 py-2" placeholder="Email"/>
              <input className="w-full border rounded px-3 py-2" placeholder="Address"/>
            </div>
            <div className="p-3 rounded border bg-slate-50 text-sm mb-4">
              <div className="font-medium mb-1">Amazon Buy with Prime (placeholder)</div>
              <p>Enable Buy with Prime here. Orders will be fulfilled via Amazon when available.</p>
            </div>
            <button className="w-full bg-slate-900 text-white rounded px-3 py-2" onClick={()=>alert("Checkout submitted")}>Place Order</button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 relative">
            <button onClick={()=>setShowLogin(false)} className="absolute top-2 right-2">✖</button>
            <h3 className="text-lg font-semibold mb-3">Admin Login</h3>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" placeholder=""/>
            <button onClick={doLogin} className="w-full bg-slate-900 text-white rounded px-3 py-2">Login</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-gray-100 border-t py-6 text-center text-sm text-gray-600">
        <p>Return & Refund Policy · Shipping Policy · Privacy Policy</p>
        <p className="mt-2">© 2025 OM Global Trade. All rights reserved.</p>
      </footer>
    </div>
  )
}

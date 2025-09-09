// OM Global Trade – storefront ready for Vercel
import * as React from 'react'

type Category = 'KOR_LIVING'|'CULTURE'|'CA_FOODS'|'TOOLS'|'RAW'
interface Product {
  id: string
  name: { ko: string; en: string }
  category: Category
  priceCad: number
  image: string
  desc: { ko: string; en: string }
  stock: number
  rating?: number
  options?: { label: string; values: string[] }[]
  gallery?: string[]
}

const museo = { fontFamily: 'MuseoModerno, ui-sans-serif, system-ui' }
const LOGO = 'https://i.postimg.cc/vBDBgY03/IMG-3298.jpg'

const DEFAULT_CATALOG: Product[] = [
  { id:'p-001', category:'KOR_LIVING', name:{ko:'흡수성 발매트',en:'Quick-Dry Bath Mat'}, desc:{ko:'초흡수 대리석 패턴 발매트',en:'Super-absorbent stone-pattern bath mat'}, priceCad:19.99, stock:120, image:'https://i.postimg.cc/Yvh0R8ML/2025-09-04-10-25-03.png', gallery:['https://i.postimg.cc/kBjDWL3d/2025-09-04-10-24-45.png','https://i.postimg.cc/9rfQX14g/2025-09-04-10-25-49.png'], rating:4.7, options:[{label:'Size',values:['S','M','L']}] },
  { id:'p-002', category:'KOR_LIVING', name:{ko:'김치 보관용기 5L',en:'Kimchi Keeper 5L'}, desc:{ko:'김치 숙성·보관 최적화',en:'Optimized for fermenting and storing kimchi'}, priceCad:24.5, stock:80, image:'https://i.postimg.cc/SxmXtfKM/2025-09-05-6-24-46.png', gallery:['https://i.postimg.cc/qh0pPGVL/2025-09-05-6-24-56.png'] },
  { id:'p-003', category:'TOOLS', name:{ko:'스테인리스 공구세트',en:'Stainless Tool Set'}, desc:{ko:'내구성 강한 다용도 툴',en:'Durable multipurpose tool kit'}, priceCad:49.9, stock:40, image:'https://i.postimg.cc/G2vdC67h/2025-09-05-6-49-53.png' },
  { id:'p-004', category:'CULTURE', name:{ko:'전통 부채 굿즈',en:'Traditional Fan Merchandise'}, desc:{ko:'문화 콘텐츠 굿즈',en:'Culture content merchandise'}, priceCad:14.0, stock:70, image:'https://i.postimg.cc/zLQcWzpR/Screen-Shot-2023-09-03-at-3-38-30-PM.png' },
  { id:'p-005', category:'CA_FOODS', name:{ko:'캐나다 메이플 시럽',en:'Canadian Maple Syrup 500ml'}, desc:{ko:'프리미엄 그레이드 A',en:'Premium Grade A'}, priceCad:17.5, stock:150, image:'https://i.postimg.cc/4nSrt1LS/2025-09-05-6-50-02.png' },
  { id:'p-006', category:'RAW', name:{ko:'캐나다 원목 원자재',en:'Canadian Lumber (Raw)'}, desc:{ko:'가구·건축용 원자재',en:'Raw material for furniture & construction'}, priceCad:129.0, stock:20, image:'https://i.postimg.cc/75V91HPZ/2025-09-05-7-01-08.png' },
  { id:'p-007', category:'TOOLS', name:{ko:'안전화',en:'Safety Boots'}, desc:{ko:'현장 필수 안전부츠',en:'Essential worksite safety boots'}, priceCad:69.0, stock:45, image:'https://i.postimg.cc/PCwhN7dy/2025-09-05-6-29-50.png' },
  { id:'p-008', category:'CULTURE', name:{ko:'K-드라마 포스터',en:'K-Drama Poster'}, desc:{ko:'공식 라이선스',en:'Officially licensed'}, priceCad:12.0, stock:90, image:'https://i.postimg.cc/Y40PhGNH/Screen-Shot-2023-03-15-at-7-30-03-PM.png' },
  { id:'p-009', category:'KOR_LIVING', name:{ko:'다용도 수납함',en:'Multi-purpose Organizer'}, desc:{ko:'깔끔한 정리',en:'Keep things tidy'}, priceCad:9.99, stock:160, image:'https://i.postimg.cc/VS98Wbrb/2025-09-05-6-35-37.png' },
  { id:'p-010', category:'CA_FOODS', name:{ko:'와일드 블루베리 잼',en:'Wild Blueberry Jam'}, desc:{ko:'설탕 함량 30%↓',en:'30% less sugar'}, priceCad:8.49, stock:110, image:'https://i.postimg.cc/GB6yGVDp/2025-09-05-7-26-01.png' },
]

const allowedCats: Category[] = ['KOR_LIVING','CULTURE','CA_FOODS','TOOLS','RAW']
const asStr = (v:any) => (typeof v === 'string' ? v : v == null ? '' : String(v))
const nameOf = (p:Product, lang:'ko'|'en') => (p?.name && ((p.name as any)[lang] || (p.name as any).en)) || ''
const descOf = (p:Product, lang:'ko'|'en') => (p?.desc && ((p.desc as any)[lang] || (p.desc as any).en)) || ''

export default function App(){
  const [catalog, setCatalog] = React.useState<Product[]>([])
  const [lang, setLang] = React.useState<'ko'|'en'>('en')
  const [cat, setCat] = React.useState<'ALL'|Category>('ALL')
  const [selectedProduct, setSelectedProduct] = React.useState<Product|null>(null)
  const [qty, setQty] = React.useState(1)
  const [slideIndex, setSlideIndex] = React.useState(0)
  type CartItem = { id:string; name:string; price:number; image:string; qty:number }
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [showCart, setShowCart] = React.useState(false)
  const [showCheckout, setShowCheckout] = React.useState(false)
  const [showLogin, setShowLogin] = React.useState(false)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement|null>(null)
  const [exportScope, setExportScope] = React.useState<'all'|'current'>('all')

  const saveLocal = (data:Product[] = catalog) => { try { localStorage.setItem('om_catalog_json', JSON.stringify(data)) } catch {} }
  const loadLocal = () => {
    try {
      const raw = localStorage.getItem('om_catalog_json')
      if (raw) { setCatalog(JSON.parse(raw)); return true }
    } catch {}
    return false
  }

  React.useEffect(() => {
    try { const v = localStorage.getItem('om_is_admin'); if (v === '1') setIsAdmin(true) } catch {}
    const had = loadLocal()
    if (!had) { setCatalog(DEFAULT_CATALOG); saveLocal(DEFAULT_CATALOG) }
  }, [])

  const displayed = (cat === 'ALL' ? catalog : catalog.filter(p => p && p.category === cat))
    .filter(p => p && p.id && p.name && typeof (p.name as any).en === 'string')
    .map(p => ({ ...p, name: { ko: asStr((p.name as any).ko), en: asStr((p.name as any).en) } }))

  const subtotal = cart.reduce((s,c) => s + c.price * c.qty, 0)

  const addToCart = (p?:Product) => {
    if (!p || p.stock <= 0) return
    const safeName = nameOf(p, lang) || 'Item'
    setCart(prev => {
      const ex = prev.find(ci => ci.id === p.id)
      if (ex) return prev.map(ci => ci.id === p.id ? { ...ci, qty: ci.qty + qty } : ci)
      return [...prev, { id:p.id, name:safeName, price:p.priceCad, image:p.image, qty }]
    })
    setShowCart(true)
  }

  React.useEffect(() => { if (selectedProduct) { setQty(1); setSlideIndex(0) } }, [selectedProduct])

  const onFile = (f:File) => {
    const r = new FileReader()
    r.onload = () => {
      const text = (r.result || '').toString()
      // very small CSV: name_en,name_ko,price_cad,image_url,desc_en,desc_ko,stock,category,gallery_urls
      const rows = text.split(/\\r?\\n/).filter(Boolean)
      const headers = rows.shift()!.split(',').map(s=>s.trim().toLowerCase())
      const idx = (k:string) => headers.findIndex(h => h===k)
      const list: Product[] = rows.map((line, i) => {
        // naive CSV split (assumes no quoted commas)
        const c = line.split(',').map(s=>s.trim())
        const get = (k:string) => { const j = idx(k); return j>=0 ? (c[j]||'') : '' }
        const gallery = (get('gallery_urls')||'').split('|').map(s=>s.trim()).filter(Boolean)
        const price = parseFloat((get('price_cad')||'0').replace(/[^\\d.]/g,'')) || 0
        const stock = parseInt(get('stock')||'0') || 0
        const category = (get('category') as Category) || 'KOR_LIVING'
        return {
          id: `csv-${i+1}`,
          name: { ko: get('name_ko')||get('name')||'', en: get('name_en')||get('name')||'' },
          category, priceCad: price, image: get('image_url') || gallery[0] || '',
          desc: { ko: get('desc_ko')||'', en: get('desc_en')||get('desc')||'' },
          stock, gallery
        }
      })
      setCatalog(list); saveLocal(list); alert(`[CSV Import] rows: ${list.length} (auto-saved)`)
    }
    r.readAsText(f)
  }

  const exportJson = () => {
    const payload = exportScope === 'all' ? catalog : displayed
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = exportScope === 'all' ? 'omglobal_catalog.json' : 'omglobal_catalog_filtered.json'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1500)
    alert('Export complete. Check your browser\\'s Downloads folder.')
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <img src={LOGO} alt="logo" className="h-10 w-auto"/>
          <nav className="hidden md:flex gap-4 text-sm ml-6">
            {(['ALL','KOR_LIVING','CULTURE','CA_FOODS','TOOLS','RAW'] as const).map(c => (
              <button key={c} onClick={() => setCat(c)} className={"px-2 py-1 rounded hover:bg-slate-100 "+(cat===c?"font-bold underline":"")}>{c}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 text-sm">
            {!isAdmin ? (
              <button onClick={() => setShowLogin(true)} className="px-2 py-1 rounded hover:bg-slate-100">👤 Login</button>
            ) : (
              <>
                <span className="px-2 py-1 text-green-700">Admin</span>
                <button onClick={() => { setIsAdmin(false); try { localStorage.removeItem('om_is_admin') } catch {} }} className="px-2 py-1 rounded hover:bg-slate-100">Logout</button>
              </>
            )}
            <button onClick={() => setShowCart(true)} className="px-2 py-1 rounded hover:bg-slate-100">🛒 Cart ({cart.length})</button>
          </div>
        </div>
      </header>

      {isAdmin && (
        <div className="bg-amber-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-2 text-sm flex flex-wrap gap-2 items-center">
            <span className="font-medium mr-2">Admin Tools</span>
            <button className="px-2 py-1 border rounded bg-white" onClick={() => fileRef.current?.click()}>Import CSV</button>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }}/>
            <button className="px-2 py-1 border rounded bg-white" onClick={() => saveLocal()}>Save</button>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border rounded bg-white" onClick={exportJson}>Export JSON</button>
              <label className="text-xs ml-1">Scope:</label>
              <select value={exportScope} onChange={e=>setExportScope(e.target.value as 'all'|'current')} className="border rounded text-xs px-1 py-0.5">
                <option value="all">All</option>
                <option value="current">Filtered</option>
              </select>
            </div>
          </div>
        </div>
      )}

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

      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
            <button className="absolute top-2 right-2" onClick={()=>setShowLogin(false)}>✖</button>
            <h3 className="text-lg font-semibold mb-2">Admin Login</h3>
            <p className="text-sm text-slate-600 mb-4">Enter access code to enable admin tools.</p>
            <input
              autoFocus
              type="password"
              placeholder="Access code (om-2025)"
              className="w-full border rounded px-3 py-2 mb-3"
              onKeyDown={e=>{ if(e.key==='Enter'){ 
                const code = (e.target as HTMLInputElement).value
                if ((code||'').trim()==='om-2025'){ setIsAdmin(true); try{localStorage.setItem('om_is_admin','1')}catch{}; setShowLogin(false) } else alert('Invalid code')
              } }}
            />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-2 border rounded" onClick={()=>setShowLogin(false)}>Cancel</button>
              <button className="px-3 py-2 bg-slate-900 text-white rounded" onClick={()=>{
                const el = document.querySelector<HTMLInputElement>('input[type="password"]')
                const code = el?.value || ''
                if ((code||'').trim()==='om-2025'){ setIsAdmin(true); try{localStorage.setItem('om_is_admin','1')}catch{}; setShowLogin(false) } else alert('Invalid code')
              }}>Login</button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={museo}>Featured Products</h2>
          <div className="flex gap-2 text-sm">
            <button onClick={() => setLang('en')} className={`px-2 py-1 border rounded ${lang==='en'?'font-bold':''}`}>EN</button>
            <button onClick={() => setLang('ko')} className={`px-2 py-1 border rounded ${lang==='ko'?'font-bold':''}`}>KO</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayed.slice(0,12).map(p => (
            <article key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden cursor-pointer">
              <div className="aspect-[4/3] bg-slate-100"><img src={p.image} alt={nameOf(p, lang)} className="w-full h-full object-cover"/></div>
              <div className="p-3">
                <div className="text-sm font-medium line-clamp-1" style={museo}>{nameOf(p, lang)}</div>
                <div className="text-xs text-slate-500 line-clamp-2">{descOf(p, lang)}</div>
                <div className="mt-2 font-semibold text-slate-900">CAD ${p.priceCad.toFixed(2)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-2 right-2">✖</button>
            <div className="relative">
              <img
                src={(selectedProduct.gallery && selectedProduct.gallery[slideIndex]) || selectedProduct.image}
                alt={nameOf(selectedProduct, lang)}
                className="w-full h-60 object-cover rounded"
              />
              {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setSlideIndex((slideIndex - 1 + selectedProduct.gallery!.length) % selectedProduct.gallery!.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                  >‹</button>
                  <button
                    onClick={() => setSlideIndex((slideIndex + 1) % selectedProduct.gallery!.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
                  >›</button>
                </>
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold" style={museo}>{nameOf(selectedProduct, lang)}</h3>
            <p className="text-slate-600">{descOf(selectedProduct, lang)}</p>
            <div className="mt-2 font-semibold">CAD ${selectedProduct.priceCad.toFixed(2)}</div>
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm">Qty</label>
              <input
                type="number"
                min={1}
                max={selectedProduct.stock || 99}
                value={qty}
                onChange={e => setQty(Math.max(1, Math.min(Number(e.target.value || 1), selectedProduct.stock || 99)))}
                className="w-20 border rounded px-2 py-1"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                disabled={selectedProduct.stock <= 0}
                className="px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50"
                onClick={() => addToCart(selectedProduct)}
              >{selectedProduct.stock > 0 ? 'Add to Cart' : 'Sold Out'}</button>
              <button
                disabled={selectedProduct.stock <= 0}
                className="px-4 py-2 rounded border disabled:opacity-50"
                onClick={() => { if (selectedProduct.stock > 0) { addToCart(selectedProduct); setShowCheckout(true) } }}
              >Buy Now</button>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button onClick={() => setShowCart(false)} className="absolute top-2 right-2">✖</button>
            <h3 className="text-lg font-semibold mb-4">Your Cart</h3>
            {cart.length ? (
              <div className="space-y-3">
                {cart.map(ci => (
                  <div key={ci.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden">
                      <img src={ci.image} alt={ci.name} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="font-medium">{ci.name}</div>
                      <div className="text-slate-600">Qty: {ci.qty}</div>
                      <div className="font-semibold">Subtotal: CAD {(ci.price * ci.qty).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 font-semibold">Total: CAD {subtotal.toFixed(2)}</div>
                <button className="mt-4 w-full bg-slate-900 text-white rounded px-3 py-2" onClick={() => { setShowCart(false); setShowCheckout(true) }}>Proceed to Checkout</button>
              </div>
            ) : <p>Your cart is empty.</p>}
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button onClick={() => setShowCheckout(false)} className="absolute top-2 right-2">✖</button>
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
            <button className="w-full bg-slate-900 text-white rounded px-3 py-2" onClick={() => alert('Checkout submitted')}>Place Order</button>
          </div>
        </div>
      )}

      <footer className="mt-auto bg-gray-100 border-t py-6 text-center text-sm text-gray-600">
        <p>Return & Refund Policy · Shipping Policy · Privacy Policy</p>
        <p className="mt-2">© 2025 OM Global Trade. All rights reserved.</p>
      </footer>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Instagram, Nfc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductPhoto, ContactButton } from '@/components/tap-experience';
import { money, tapReview } from '@/lib/tap-review';
import counter from '@/assets/demo-counter.jpg';
import './premium-catalog.css';

type Product = 'Google' | 'Instagram';
const products = {
 Google: { title: 'GOOGLE REVIEWS', copy: 'Facilitá que tus clientes dejen una reseña en Google con un solo toque.', benefits: ['Acceso directo a Google Reviews', 'Sin buscar el negocio', 'Experiencia rápida para el cliente'] },
 Instagram: { title: 'INSTAGRAM', copy: 'Conectá a tus clientes con el Instagram de tu negocio en un solo toque.', benefits: ['Acceso directo al perfil', 'Más fácil para tus clientes', 'Experiencia rápida y moderna'] },
};
export function openDemo(product: Product) {
 window.dispatchEvent(new CustomEvent('tap-review:demo', { detail: product }));
 document.getElementById('demo')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
function DemoButton({ product, children = 'VER CÓMO FUNCIONA' }: { product: Product; children?: string }) { return <Button variant="outline" className="tap-button catalog-demo-button" onClick={() => openDemo(product)}>{children}<ArrowRight size={16} /></Button>; }
function ProductCopy({ product }: { product: Product }) { const data = products[product]; return <div className="catalog-copy"><span className="eyebrow">TAP REVIEW / {data.title}</span><h3>{data.title}</h3><p>{data.copy}</p><ul>{data.benefits.map(text => <li key={text}><Check size={16} />{text}</li>)}</ul><div className="catalog-price"><div><span>Precio lanzamiento</span><strong>{money(tapReview.individualPrice)}</strong></div><small>1 tarjeta personalizada</small></div><div className="catalog-actions"><ContactButton product={`la tarjeta Tap Review ${product}`}>QUIERO ESTA TARJETA</ContactButton><DemoButton product={product} /></div></div>; }
export function PremiumCatalog() {
 const [selected, setSelected] = useState<Product>('Google');
 const root = useRef<HTMLElement>(null);
 useEffect(() => {
  const nodes = root.current?.querySelectorAll('.catalog-reveal');
  if (!nodes) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('catalog-visible'); observer.unobserve(entry.target); } }), {threshold:.15});
  nodes.forEach(node => observer.observe(node));return () => observer.disconnect();
 }, []);
 return <section id="productos" className="premium-catalog section" ref={root}><div className="container"><header className="catalog-heading"><span className="eyebrow">NUESTROS PRODUCTOS</span><h2>Tu negocio. Tu marca.<br />Un toque más cerca.</h2><p>Tarjetas NFC personalizadas para conectar a tus clientes con tu negocio de forma rápida, simple y profesional.</p></header>
 {(['Google','Instagram'] as const).map((product,index) => <article className={`catalog-showcase catalog-reveal ${index===1?'catalog-reverse':''}`} key={product}><div className="catalog-product-stage"><span className="catalog-number">0{index+1} / TAP REVIEW</span><ProductPhoto product={product}/><span className="catalog-stage-label"><Nfc size={14}/>TU MARCA. TU CONEXIÓN.</span></div><ProductCopy product={product}/></article>)}
 <div className="catalog-explorer catalog-reveal"><header><span className="eyebrow">ELEGÍ TU CONEXIÓN</span><h2>Una tarjeta.<br />El destino que vos elegís.</h2></header><div className="catalog-selector" role="group" aria-label="Elegir tarjeta del catálogo">{(['Google','Instagram'] as const).map(product => <Button variant="ghost" key={product} aria-pressed={selected===product} onClick={() => setSelected(product)}>{product==='Google'?<span className="google-mark">G</span>:<Instagram size={17}/>} {products[product].title}</Button>)}</div><div className="catalog-selected" key={selected}><div className="catalog-product-stage"><ProductPhoto product={selected}/></div><ProductCopy product={selected}/></div></div>
 <div className="catalog-paired catalog-reveal"><span className="eyebrow">DOS FORMAS DE CONECTAR. UNA MISMA EXPERIENCIA.</span><h2>Google Reviews + Instagram</h2><div className="catalog-pair-art"><ProductPhoto product="Google"/><ProductPhoto product="Instagram"/></div></div>
 </div></section>;
}
export function PremiumPack() {return <section className="pack-section premium-pack"><div className="container pack-layout"><div className="pack-art"><ProductPhoto product="Google"/><ProductPhoto product="Instagram"/><div className="pack-caption"><span className="google-mark">G</span><span>+</span><Instagram/><span>GOOGLE REVIEWS + INSTAGRAM</span></div></div><div className="pack-copy"><span className="eyebrow">DOS TARJETAS · PRECIO LANZAMIENTO</span><h2>TAP REVIEW PACK</h2><span className="pack-name">Google Reviews + Instagram</span><p>Todo lo que necesitás para conectar tu negocio con tus clientes.</p><div className="pack-price"><strong>{money(tapReview.packPrice)}</strong><del>{money(tapReview.individualPrice*2)}</del><span>Ahorrás {money(tapReview.individualPrice*2-tapReview.packPrice)}</span></div><ContactButton product="el Pack Google + Instagram">QUIERO EL PACK</ContactButton><small>Google + Instagram · 2 tarjetas personalizadas</small></div></div></section>;}
export function PremiumPersonalization() {return <><section id="personalizacion" className="section catalog-personalization"><div className="container"><div><span className="eyebrow">PERSONALIZACIÓN</span><h2>TU TARJETA.<br />TU MARCA.</h2><p>Personalizamos tu TAP REVIEW para que represente la identidad de tu negocio.</p><ContactButton secondary>CONOCER MÁS</ContactButton></div><div className="catalog-personalization-art"><ProductPhoto product="Instagram"/></div></div></section><section className="section catalog-setting"><div className="container"><header><span className="eyebrow">HECHA PARA TU NEGOCIO</span><h2>Así se vería en tu negocio.</h2></header><div className="catalog-business-scene"><img src={counter} alt="Ambientación ilustrativa de una cafetería" loading="lazy" width={1536} height={1024}/><ProductPhoto product="Google"/><span>Cafetería · Ambientación ilustrativa</span></div><div className="catalog-demo-invitation"><h3>¿QUERÉS VER CÓMO FUNCIONA?</h3><div><DemoButton product="Google">VER GOOGLE REVIEWS</DemoButton><DemoButton product="Instagram">VER INSTAGRAM</DemoButton></div></div></div></section></>;}

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Nfc, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductPhoto } from './tap-experience';
import wallpaper from '@/assets/iphone-mountain-wallpaper.jpeg.asset.json';
import './product-story.css';

const beats = [
 { title: 'Un toque.', label: 'ACERCÁ TU TELÉFONO', copy: 'La tarjeta está en tu local. Tu cliente acerca el celular.' },
 { title: 'Una conexión.', label: 'NFC DETECTADO', copy: 'El teléfono reconoce la tarjeta y muestra una notificación.' },
 { title: 'Una acción.', label: 'TOCÁ PARA ABRIR GOOGLE', copy: 'Tu cliente toca la notificación para abrir el destino configurado.' },
 { title: 'Una reseña.', label: 'COMPARTÍ TU EXPERIENCIA', copy: 'Ya está en el lugar donde puede empezar a escribir su reseña.' },
];
export function ProductStory() {
 const root = useRef<HTMLElement>(null);
 const [active, setActive] = useState(0);
 useEffect(() => {
  const node = root.current;
  if (!node) return;
  const observer = new IntersectionObserver(entries => {
   const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
   if (visible) setActive(Number((visible.target as HTMLElement).dataset['beat']));
  }, { rootMargin: '-22% 0px -30% 0px', threshold: [0,.2,.5,.8] });
  node.querySelectorAll('[data-beat]').forEach(el => observer.observe(el));
  return () => observer.disconnect();
 }, []);
 return <section className="product-story" id="como-funciona" ref={root} aria-labelledby="story-heading"><div className="container"><header className="story-heading"><span className="eyebrow">CÓMO FUNCIONA</span><h2 id="story-heading">Menos pasos.<br/>Más cerca.</h2></header><div className="story-layout"><div className="story-visual" data-step={active}><div className="story-phone" aria-hidden="true"><img src={wallpaper.url} alt=""/><i className="story-island"/><div className="story-clock">9:41</div>{active===1 && <div className="story-notification"><Nfc size={18}/><span>Etiqueta NFC detectada<small>TAP REVIEW</small></span></div>}{active>=2 && <div className="story-destination"><span className="google-mark">G</span><strong>Tu negocio</strong><small>Ejemplo ilustrativo</small><div>Información <b>Reseñas</b></div>{active===3 ? <><Star size={24}/><p>Compartí tu experiencia</p><span className="story-review-line"/></> : <p>Abriendo Google…</p>}</div>}<span className="story-home"/></div><ProductPhoto product="Google"/><span className="story-visual-label">TARJETA FÍSICA. CONEXIÓN DIRECTA.</span></div><ol className="story-beats">{beats.map((beat,index) => <li data-beat={index} key={beat.title} className={active===index?'story-active':''}><span className="eyebrow">0{index+1} / {beat.label}</span><h3>{beat.title}</h3><p>{beat.copy}</p></li>)}</ol></div><div className="story-footer"><p>Tu cliente decide si deja una reseña. El celular debe ser compatible con NFC y tener la función activada.</p><Button variant="outline" className="tap-button" asChild><a href="#demo">PROBÁ LA EXPERIENCIA<ArrowRight size={16}/></a></Button></div></div></section>;
}
export function TapComparison() {
 return <section className="section tap-comparison"><div className="container"><header><span className="eyebrow">LA DIFERENCIA ESTÁ EN EL CAMINO</span><h2>Sin buscar.<br/>Directo a tu negocio.</h2></header><div className="comparison-paths"><div><span className="comparison-label">ANTES</span><ol>{['Abrir Google','Buscar el negocio','Entrar al perfil','Encontrar reseñas','Escribir'].map((text,i) => <li key={text}><span>0{i+1}</span>{text}<ArrowRight size={14}/></li>)}</ol></div><div className="comparison-tap"><span className="comparison-label"><Nfc size={16}/>CON TAP REVIEW</span><ol>{['TAP','GOOGLE','RESEÑA'].map(text => <li key={text}>{text}<ArrowRight size={18}/></li>)}</ol><p><Check size={16}/>Menos búsquedas para llegar al mismo lugar.</p></div></div></div></section>;
}

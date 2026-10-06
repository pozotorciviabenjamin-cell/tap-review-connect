import { useState, useEffect, useRef, type PointerEvent, type ReactNode, type FormEvent } from 'react';
import { ArrowUpRight, Instagram, Nfc, Star, Check, MessageCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import photo from '@/assets/tap-review-instagram.png.asset.json';
import { submitInquiry } from '@/lib/inquiries.functions';
import { tapReview, whatsapp } from '@/lib/tap-review';

export function ContactButton({ children = 'Quiero mi Tap Review', product, secondary = false }: { children?: ReactNode; product?: string; secondary?: boolean }) {
  return <Button asChild variant={secondary ? 'outline' : 'default'} className={`tap-button ${secondary ? 'tap-outline' : ''}`}><a href={whatsapp(product)} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={17} /></a></Button>;
}

export function ProductPhoto({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-x', `${(event.clientY - rect.top - rect.height / 2) / rect.height * -7}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 7}deg`);
  }
  return <div ref={ref} className={`product-photo ${className}`} onPointerMove={move} onPointerLeave={() => { ref.current?.style.setProperty('--tilt-x', '0deg'); ref.current?.style.setProperty('--tilt-y', '0deg'); }}><img src={photo.url} alt="Fotografía oficial de tarjetas NFC Tap Review Instagram" width="550" height="955" loading={className.includes('hero') ? 'eager' : 'lazy'} /></div>;
}

export function Demo() {
  const [destination, setDestination] = useState<'Google' | 'Instagram' | null>(null);
  const [phase, setPhase] = useState<'idle' | 'tap' | 'connected'>('idle');
  useEffect(() => {
    if (phase !== 'tap') return;
    const timer = window.setTimeout(() => setPhase('connected'), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 1100);
    return () => window.clearTimeout(timer);
  }, [phase]);
  function play(value: 'Google' | 'Instagram') { setDestination(value); setPhase('tap'); }
  return <section className="demo-section section" id="demo"><div className="container demo-layout"><div className="demo-copy reveal"><span className="eyebrow">UN TOQUE. ASÍ DE SIMPLE.</span><h2>Mirá cómo<br />funciona.</h2><p>De tu tarjeta al celular de tu cliente.<br />Sin buscar. Sin escribir. Sin vueltas.</p><div className="demo-buttons"><Button className="tap-button" disabled={phase === 'tap'} onClick={() => play('Google')}><span className="google-mark">G</span>Probar demo Google<ArrowUpRight /></Button><Button className="tap-button tap-outline" variant="outline" disabled={phase === 'tap'} onClick={() => play('Instagram')}><Instagram />Probar demo Instagram<ArrowUpRight /></Button></div><small>Demostración visual. No publica reseñas ni accede a cuentas reales.</small></div><div className={`demo-stage ${phase}`}><div className="demo-card"><ProductPhoto /><span>Tap Review · Instagram</span></div><div className="nfc-wave"><Nfc /></div><div className="phone"><div className="phone-camera" /><div className="phone-screen" aria-live="polite">{phase === 'connected' ? <><div className="connected-label"><Check size={13} />Conectado</div>{destination === 'Google' ? <><span className="google-mark phone-logo">G</span><span className="screen-overline">Google Reviews</span><h3>Tu negocio</h3><p>Compartí tu experiencia</p><div className="stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} />)}</div><div className="simulated-input">Escribí una reseña…</div><span className="screen-action">Pantalla de ejemplo</span></> : <><Instagram className="phone-logo" /><span className="screen-overline">Instagram</span><div className="profile-avatar">TU<br />MARCA</div><h3>@tu.negocio</h3><p>El Instagram de tu negocio,<br />a un toque de distancia.</p><span className="screen-action">Perfil de ejemplo</span></>}<Button variant="ghost" className="replay" onClick={() => setPhase('idle')}><RotateCcw />Volver a probar</Button></> : <><Nfc className="phone-logo" /><h3>{phase === 'tap' ? '¡Tap!' : 'Acercá. Tocá. Conectá.'}</h3><p>{phase === 'tap' ? `Abriendo ${destination}…` : 'Tu negocio, al alcance de un toque.'}</p><span className="phone-time">9:41</span></>}</div></div></div></div></section>;
}

export function InquiryForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [followup, setFollowup] = useState(whatsapp());
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const data = { name: String(fields.get('name')), business: String(fields.get('business')), product: String(fields.get('product')) as 'Google' | 'Instagram' | 'Pack Google + Instagram' | 'Quiero consultar', phone: String(fields.get('phone')), message: String(fields.get('message')), website: String(fields.get('website') || '') };
    setStatus('sending');
    setFollowup(`https://wa.me/${tapReview.phones[0].number}?text=${encodeURIComponent(`Hola! Soy ${data.name}, de ${data.business}. Vi Tap Review y quiero consultar por ${data.product}. Mi WhatsApp es ${data.phone}. ${data.message}`)}`);
    try { await submitInquiry({ data }); setStatus('success'); } catch (err) { setStatus('error'); setError(err instanceof Error ? err.message : 'No pudimos guardar tu consulta.'); }
  }
  return <form className="inquiry-form" onSubmit={submit}>{status === 'success' ? <div className="form-success" role="status"><Check /><h3>Recibimos tu consulta.</h3><p>También podés continuar la conversación por WhatsApp.</p><Button asChild className="tap-button"><a href={followup} target="_blank" rel="noopener noreferrer"><MessageCircle />Continuar por WhatsApp</a></Button><Button variant="ghost" onClick={() => setStatus('idle')}>Enviar otra consulta</Button></div> : <><h3>Contanos sobre tu negocio.</h3><div className="form-grid"><label>Nombre<input name="name" autoComplete="given-name" placeholder="Tu nombre" required minLength={2} maxLength={100} /></label><label>Nombre del negocio<input name="business" autoComplete="organization" placeholder="Tu negocio" required minLength={2} maxLength={150} /></label><label>¿Qué tarjeta te interesa?<select name="product"><option>Google</option><option>Instagram</option><option>Pack Google + Instagram</option><option>Quiero consultar</option></select></label><label>Teléfono / WhatsApp<input name="phone" type="tel" autoComplete="tel" placeholder="Tu número de WhatsApp" required minLength={8} maxLength={30} pattern="[+0-9 ()-]+" /></label></div><label>Mensaje<textarea name="message" rows={3} placeholder="¿Qué te gustaría saber?" maxLength={2000} /></label><div className="honeypot" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>{status === 'error' && <p className="form-error" role="alert">{error} <a href={followup} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></p>}<Button type="submit" className="tap-button" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : 'Quiero información'}<ArrowUpRight /></Button><small>Usamos tus datos únicamente para responder esta consulta.</small></>}</form>;
}
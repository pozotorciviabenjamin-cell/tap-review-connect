import { useState, useEffect, useRef, type PointerEvent, type ReactNode, type FormEvent } from 'react';
import { ArrowUpRight, Check, MessageCircle, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import photo from '@/assets/official-instagram-2026.jpg.asset.json';
import googlePhoto from '@/assets/official-google-2026.jpg.asset.json';
import fullInstagram from '@/assets/official-instagram-full-2026.jpeg.asset.json';
import fullGoogle from '@/assets/official-google-full-2026.jpeg.asset.json';
import { submitInquiry } from '@/lib/inquiries.functions';
import { tapReview, whatsapp } from '@/lib/tap-review';
export { Demo } from './realistic-demo';

export function ContactButton({ children = 'Quiero mi Tap Review', product, secondary = false }: { children?: ReactNode; product?: string; secondary?: boolean }) {
  return <Button asChild variant={secondary ? 'outline' : 'default'} className={`tap-button ${secondary ? 'tap-outline' : ''}`}><a href={whatsapp(product)} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={17} /></a></Button>;
}

export function ProductPhoto({ className = '', product = 'Instagram' }: { className?: string; product?: 'Google' | 'Instagram' }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-x', `${(event.clientY - rect.top - rect.height / 2) / rect.height * -10}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 10}deg`);
    event.currentTarget.style.setProperty('--light-x', `${(event.clientX - rect.left) / rect.width * 100}%`);
    event.currentTarget.style.setProperty('--light-y', `${(event.clientY - rect.top) / rect.height * 100}%`);
  }
  return <div ref={ref} className={`product-photo ${product === 'Google' ? 'google-photo' : ''} ${className}`} onPointerMove={move} onPointerLeave={() => { ref.current?.style.setProperty('--tilt-x', '0deg'); ref.current?.style.setProperty('--tilt-y', '0deg'); }}><img src={product === 'Google' ? googlePhoto.url : photo.url} alt={`Fotografía oficial de tarjetas NFC Tap Review ${product}`} width={product === 'Google' ? 624 : 617} height={product === 'Google' ? 449 : 1044} loading={className.includes('hero') ? 'eager' : 'lazy'} /><span className="photo-light" aria-hidden="true" /><Dialog><DialogTrigger asChild><Button variant="secondary" size="icon" className="photo-zoom" aria-label={`Ampliar fotografía de Tap Review ${product}`} title={`Ampliar fotografía de Tap Review ${product}`}><Maximize2 /></Button></DialogTrigger><DialogContent className="official-photo-dialog"><DialogTitle>Tap Review — {product}</DialogTitle><DialogDescription>Fotografía oficial del producto.</DialogDescription><img src={product === 'Google' ? fullGoogle.url : fullInstagram.url} alt={`Fotografía original de Tap Review ${product}`} className="official-photo-expanded" /></DialogContent></Dialog></div>;
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
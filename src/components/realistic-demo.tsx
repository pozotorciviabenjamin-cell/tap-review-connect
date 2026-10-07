import { useEffect, useState } from 'react';
import { BatteryFull, Camera, ChevronLeft, Flashlight, Instagram, LockKeyhole, Nfc, ArrowRight, RotateCcw, Signal, Wifi, Star, Grid3X3, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import google from '@/assets/tap-google-detail.jpg.asset.json';
import instagram from '@/assets/tap-instagram-detail.jpg.asset.json';
import wallpaper from '@/assets/iphone-mountain-wallpaper.jpeg.asset.json';
import profile from '@/assets/demo-profile.jpg.asset.json';
import posts from '@/assets/demo-posts.jpg.asset.json';
import counter from '@/assets/demo-counter.jpg';
import hand from '@/assets/demo-touch-hand.png';
import { demoDestinations as config } from '@/lib/demo-destinations';
import './realistic-demo.css';

type Destination = 'Google' | 'Instagram';
type Phase = 'normal' | 'approach' | 'detected' | 'touch' | 'opening' | 'destination' | 'finished';
const captions: Record<Phase, string> = { normal: 'Descubrí cómo funciona', approach: 'Acercá el celular.', detected: 'TOCÁ LA NOTIFICACIÓN', touch: 'Un toque en la pantalla.', opening: 'Abriendo tu destino…', destination: 'Ya estás donde querés.', finished: 'Así de fácil.' };
const stages = ['ACERCÁ', 'DETECTÁ', 'TOCÁ', 'LISTO'];
export function Demo() {
  const [destination, setDestination] = useState<Destination>('Instagram');
  const [phase, setPhase] = useState<Phase>('normal');
  const [review, setReview] = useState(false);
  const [rating, setRating] = useState(0);
  useEffect(() => {
    // Detection intentionally waits for the visitor. Timers cannot open the link.
    const next: Partial<Record<Phase, { phase: Phase; delay: number }>> = {
      approach: { phase: 'detected', delay: 3300 }, touch: { phase: 'opening', delay: 1100 },
      opening: { phase: 'destination', delay: 900 }, destination: { phase: 'finished', delay: 2600 },
    };
    const beat = next[phase];
    if (!beat) return;
    const timer = window.setTimeout(() => setPhase(beat.phase), beat.delay);
    return () => window.clearTimeout(timer);
  }, [phase]);
  function reset(value = destination) { setDestination(value); setPhase('normal'); setReview(false); setRating(0); }
  const arrived = phase === 'destination' || phase === 'finished';
  const stage = phase === 'normal' || phase === 'approach' ? 0 : phase === 'detected' ? 1 : phase === 'touch' || phase === 'opening' ? 2 : 3;
  return <section id="demo" className="section realistic-demo">
    <div className="container">
      <header className="real-demo-heading"><span className="eyebrow">LA EXPERIENCIA TAP REVIEW</span><h2>Un toque.<br /><span>Y tu cliente ya está donde querés.</span></h2><p>Un simple toque conecta a tu cliente directamente con tu negocio.</p></header>
      <div className="real-demo-selector" role="group" aria-label="Destino de la demostración">
        {(['Instagram', 'Google'] as const).map(value => <Button key={value} variant="ghost" aria-label={value === 'Google' ? 'Google Reviews' : value} aria-pressed={destination === value} onClick={() => reset(value)}>{value === 'Google' ? <span className="google-mark" aria-hidden="true">G</span> : <Instagram size={18} />}{value === 'Google' ? 'GOOGLE REVIEWS' : 'INSTAGRAM'}</Button>)}
      </div>
      <div className="real-demo-surface" data-phase={phase} data-destination={destination}>
        <img className="demo-counter" src={counter} alt="" loading="lazy" width={1536} height={1024} />
        <span className="real-demo-surface-label">TAP REVIEW / {destination === 'Google' ? 'GOOGLE REVIEWS' : 'INSTAGRAM'}</span>
        <span className="demo-example-label">EXPERIENCIA ILUSTRATIVA</span>
        <div className="real-demo-scene">
          <div className="real-card"><img src={destination === 'Google' ? google.url : instagram.url} alt={`Fotografía oficial de Tap Review ${destination}`} loading="lazy" /><span className="real-card-edge" /></div>
          <div className="real-nfc-ripple" aria-hidden="true"><i /><i /><span>TAP</span></div>
          <div className="real-iphone-position"><div className="real-iphone">
            <span className="iphone-side-key iphone-silent" /><span className="iphone-side-key iphone-volume" /><span className="iphone-side-key iphone-power" />
            <div className="real-iphone-screen">
              <img src={wallpaper.url} className="iphone-wallpaper" alt="" loading="lazy" />
              <div className={`iphone-status ${arrived || phase === 'opening' ? 'on-page' : ''}`}><span>9:41</span><span><Signal size={12} /><Wifi size={12} /><BatteryFull size={17} /></span></div>
              <div className="iphone-island"><i /></div>
              {!arrived && phase !== 'opening' && <div className="iphone-lockscreen"><LockKeyhole size={18} /><span className="iphone-date">Miércoles, 7 de octubre</span><strong>9:41</strong><div className="iphone-lock-tools"><Flashlight size={17} /><Camera size={17} /></div></div>}
              {(phase === 'detected' || phase === 'touch') && <Button variant="ghost" className="iphone-notification" aria-label="Abrir notificación NFC" disabled={phase === 'touch'} onClick={() => setPhase('touch')}><span className="notification-icon"><Nfc size={20} /></span><span className="notification-copy"><strong>Etiqueta NFC detectada</strong><span>TAP REVIEW</span><small>Abrir enlace</small></span><span className="notification-now">ahora</span></Button>}
              {phase === 'touch' && <span className="iphone-touch" aria-hidden="true" />}
              {phase === 'opening' && <div className="iphone-opening"><span className="iphone-loader" /><span>Abriendo {destination}</span></div>}
              {arrived && <div className="iphone-destination">
                <div className="iphone-browser"><LockKeyhole size={10} />{destination === 'Google' ? 'google.com' : 'instagram.com'}</div>
                {destination === 'Instagram' ? <div className="demo-instagram-real"><div className="demo-app-top"><strong>{config.INSTAGRAM_USERNAME}</strong><Plus size={15} /><Menu size={15} /></div><div className="demo-profile"><img src={config.INSTAGRAM_PROFILE_IMAGE || profile.url} alt="Logo del perfil de ejemplo proporcionado" /><div><strong>{config.INSTAGRAM_NAME}</strong><small>{config.INSTAGRAM_IS_EXAMPLE ? 'Perfil de ejemplo' : 'Perfil del negocio'}</small></div></div><p>{config.INSTAGRAM_BIO}</p><div className="demo-social-actions"><span>Seguir</span><span>Mensaje</span></div><div className="demo-grid-tab"><Grid3X3 size={15} /></div>{config.INSTAGRAM_IS_EXAMPLE && <img className="demo-supplied-posts" src={posts.url} alt="Contenido visual del ejemplo proporcionado" loading="lazy" />}<small className="demo-screen-note">{config.INSTAGRAM_IS_EXAMPLE ? 'Ejemplo ilustrativo · Sin cuenta conectada' : 'Representación visual del perfil'}</small></div> : <div className="demo-google-real">
                  <div className="demo-google-title"><ChevronLeft size={16} /><span>{config.GOOGLE_NAME}</span></div><small className="demo-screen-note">{config.GOOGLE_IS_EXAMPLE ? 'Ejemplo ilustrativo · No publica reseñas' : 'Representación visual'}</small>
                  {review ? <><div className="demo-review-user"><span>C</span><div>Cliente demo<small>Cuenta de ejemplo</small></div></div><div className="demo-stars" role="group" aria-label="Calificación de ejemplo">{[1,2,3,4,5].map(value => <Button key={value} variant="ghost" size="icon" aria-label={`${value} ${value === 1 ? 'estrella' : 'estrellas'}`} aria-pressed={rating === value} onClick={() => setRating(value)}><Star className={value <= rating ? 'selected' : ''} /></Button>)}</div><label className="demo-review-field"><span>Tu experiencia</span><textarea aria-label="Reseña de ejemplo" placeholder="Compartí detalles sobre tu experiencia en este lugar" maxLength={300} /></label><span className="demo-add-photo"><Camera size={15} />Agregar fotos</span><Button disabled className="demo-publish">Publicar</Button></> : <><div className="demo-google-brand"><span className="google-mark">G</span><h3>{config.GOOGLE_NAME}</h3></div><div className="google-page-tabs"><span>Información</span><strong>Reseñas</strong></div><p>Compartí tu experiencia en este lugar.</p><Button className="demo-review-action" onClick={() => setReview(true)}><Star size={15} />Escribir una reseña</Button><small className="demo-screen-note">Sin puntuaciones ni reseñas inventadas.</small></>}
                </div>}
              </div>}
              <div className={`iphone-home-indicator ${arrived || phase === 'opening' ? 'on-page' : ''}`} />
            </div><div className="iphone-reflection" aria-hidden="true" />
          </div></div>
          <img className="demo-human-hand" src={hand} alt="" aria-hidden="true" loading="lazy" width={1024} height={1024} />
        </div>
        <div className="demo-scene-footer"><div className="real-demo-caption" aria-live="polite">{captions[phase]}</div>{phase === 'normal' && <Button variant="ghost" className="demo-start" onClick={() => setPhase('approach')}>TOCÁ PARA EMPEZAR<ArrowRight size={17} /></Button>}{phase === 'detected' && <Button variant="ghost" className="demo-notification-prompt" onClick={() => setPhase('touch')} aria-label="Tocar la notificación">Abrir enlace<ArrowRight size={15} /></Button>}</div>
      </div>
      <ol className="demo-stage-list" aria-label="Progreso de la experiencia">{stages.map((label, index) => <li key={label} className={phase !== 'normal' && index <= stage ? 'is-active' : ''} aria-current={phase !== 'normal' && index === stage ? 'step' : undefined}><span>0{index + 1}</span>{label}<i /></li>)}</ol>
      <div className="real-demo-result"><h3>{arrived ? destination === 'Instagram' ? 'Un toque. Y listo.' : 'Más fácil para tus clientes.' : 'Sin buscar. Sin escribir. Un toque y listo.'}</h3>{arrived && <Button variant="ghost" className="demo-replay" onClick={() => reset()}><RotateCcw size={14} />VER DE NUEVO</Button>}<small>Demostración visual con ejemplos. No publica reseñas ni accede a cuentas. Interfaz ilustrativa, no oficial de Apple, Google ni Instagram.</small></div>
    </div>
  </section>;
}

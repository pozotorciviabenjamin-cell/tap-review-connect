import { useEffect, useRef, useState } from 'react';
import { BatteryFull, Camera, ChevronLeft, Flashlight, Instagram, LockKeyhole, MapPin, Nfc, Play, RotateCcw, Signal, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import google from '@/assets/tap-google-detail.jpg.asset.json';
import instagram from '@/assets/tap-instagram-detail.jpg.asset.json';
import wallpaper from '@/assets/iphone-mountain-wallpaper.jpeg.asset.json';
import './realistic-demo.css';

type Destination = 'Google' | 'Instagram';
type Phase = 'normal' | 'approach' | 'detected' | 'touch' | 'opening' | 'destination' | 'finished';
const beats: { at: number; phase: Phase }[] = [{ at: 1500, phase: 'approach' }, { at: 3400, phase: 'detected' }, { at: 5200, phase: 'touch' }, { at: 6100, phase: 'opening' }, { at: 7200, phase: 'destination' }, { at: 9000, phase: 'finished' }];
const captions: Record<Phase, string> = { normal: 'Todo empieza con un celular.', approach: 'Tu cliente acerca el iPhone.', detected: 'La tarjeta se detecta.', touch: 'Un toque en la notificación.', opening: 'Abriendo el destino…', destination: 'Tu negocio, a un toque.', finished: 'Tu negocio, a un toque.' };

export function Demo() {
  const section = useRef<HTMLElement>(null);
  const [destination, setDestination] = useState<Destination>('Google');
  const [phase, setPhase] = useState<Phase>('normal');
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setSeen(true); observer.disconnect(); }
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    setPlaying(true);
    const timers = beats.map(beat => window.setTimeout(() => {
      setPhase(beat.phase);
      if (beat.phase === 'finished') setPlaying(false);
    }, beat.at));
    return () => timers.forEach(window.clearTimeout);
  }, [seen, run]);
  function play(value: Destination) { setDestination(value); setPhase('normal'); setPlaying(true); setSeen(true); setRun(value => value + 1); }
  const arrived = phase === 'destination' || phase === 'finished';
  const notification = phase === 'detected' || phase === 'touch';
  return <section ref={section} id="demo" className="section realistic-demo">
    <div className="container">
      <header className="real-demo-heading"><span className="eyebrow">LA EXPERIENCIA TAP REVIEW</span><h2>Mirá cómo funciona</h2><p>Un simple toque conecta a tu cliente directamente con tu negocio.</p></header>
      <div className="real-demo-selector" role="group" aria-label="Destino de la demostración">
        {(['Google', 'Instagram'] as const).map(value => <Button key={value} variant="ghost" aria-label={value} aria-pressed={destination === value} onClick={() => play(value)}>{value === 'Google' ? <span className="google-mark" aria-hidden="true">G</span> : <Instagram size={18} />}{value}</Button>)}
      </div>
      <div className="real-demo-surface" data-phase={phase} data-destination={destination}>
        <span className="real-demo-surface-label">TAP REVIEW · {destination.toUpperCase()}</span>
        <div className="real-demo-scene" key={run}>
          <div className="real-card"><img src={destination === 'Google' ? google.url : instagram.url} alt={`Fotografía oficial de Tap Review ${destination}`} /><span className="real-card-edge" /></div>
          <div className="real-nfc-ripple" aria-hidden="true"><i /><i /><span>TAP</span></div>
          <div className="real-iphone-position"><div className="real-iphone">
            <span className="iphone-side-key iphone-silent" /><span className="iphone-side-key iphone-volume" /><span className="iphone-side-key iphone-power" />
            <div className="real-iphone-screen">
              <img src={wallpaper.url} className="iphone-wallpaper" alt="" />
              <div className={`iphone-status ${arrived || phase === 'opening' ? 'on-page' : ''}`}><span>9:41</span><span><Signal size={12} /><Wifi size={12} /><BatteryFull size={17} /></span></div>
              <div className="iphone-island"><i /></div>
              {!arrived && phase !== 'opening' && <div className="iphone-lockscreen"><LockKeyhole size={18} /><span className="iphone-date">Martes, 6 de octubre</span><strong>9:41</strong><div className="iphone-lock-tools"><Flashlight size={17} /><Camera size={17} /></div></div>}
              {notification && <div className="iphone-notification"><span className="notification-icon"><Nfc size={20} /></span><div><strong>Etiqueta NFC detectada</strong><span>Tap Review</span><small>Abrir enlace</small></div><span className="notification-now">ahora</span></div>}
              {phase === 'touch' && <span className="iphone-touch" aria-hidden="true" />}
              {phase === 'opening' && <div className="iphone-opening"><span className="iphone-loader" /><span>Abriendo {destination}</span></div>}
              {arrived && <div className="iphone-destination">
                <div className="iphone-browser"><LockKeyhole size={10} />{destination === 'Google' ? 'google.com' : 'instagram.com'}</div>
                {destination === 'Google' ? <div className="iphone-google-page"><span className="google-mark">G</span><div className="google-search">Tu negocio <MapPin size={12} /></div><div className="business-cover"><Storefront /></div><h3>Tu negocio</h3><span className="fictitious-label">Negocio ficticio · Demostración</span><p>Un lugar para compartir tu experiencia.</p><div className="google-page-tabs"><span>Información</span><strong>Reseñas</strong></div><span className="demo-review-action">Dejar una reseña</span><small>Tu opinión empieza acá.</small></div> : <div className="iphone-instagram-page"><div className="instagram-page-top"><ChevronLeft size={17} /><strong>tu.negocio</strong><Instagram size={17} /></div><div className="instagram-avatar"><Storefront /></div><h3>Tu negocio</h3><span className="fictitious-label">Perfil ficticio · Demostración</span><p>Un espacio para conocer nuestra marca y lo que hacemos.</p><div className="instagram-profile-actions"><span>Seguir</span><span>Mensaje</span></div><div className="instagram-grid" aria-hidden="true"><div><Storefront /></div><div><span>Tu<br />marca.</span></div><div><Camera /></div></div></div>}
              </div>}
              <div className={`iphone-home-indicator ${arrived || phase === 'opening' ? 'on-page' : ''}`} />
            </div><div className="iphone-reflection" aria-hidden="true" />
          </div></div>
        </div>
        <div className="real-demo-caption" aria-live="polite">{captions[phase]}</div>
        <div className={`real-demo-progress ${playing ? 'is-playing' : ''}`} key={`progress-${run}`} aria-hidden="true"><span /></div>
      </div>
      <div className="real-demo-result"><h3>{arrived ? destination === 'Google' ? 'Un toque. Y listo.' : 'Un toque. Y tu cliente ya está en Instagram.' : 'Sin buscar. Sin escribir. Un toque y listo.'}</h3><p>{arrived ? 'Tu cliente accede directamente al destino configurado.' : 'Del celular de tu cliente al destino de tu negocio.'}</p><Button variant="outline" className="tap-button tap-outline" onClick={() => play(destination)}>{playing || arrived ? <RotateCcw size={16} /> : <Play size={16} />}{playing || arrived ? 'PROBAR DE NUEVO' : 'PROBAR DEMO'}</Button><small>Demostración visual. Interfaz ilustrativa, no oficial de Apple, Google ni Instagram. No publica reseñas ni accede a cuentas reales.</small></div>
    </div>
  </section>;
}

function Storefront() { return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 29h40v27H12zM8 29l7-17h34l7 17M8 29c0 7 12 7 12 0 0 7 12 7 12 0 0 7 12 7 12 0 0 7 12 7 12 0M26 56V40h12v16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>; }
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductPhoto } from './tap-experience';
import { whatsapp } from '@/lib/tap-review';
import './personalization-configurator.css';
const tones = [{name:'Navy',className:'identity-navy'},{name:'Charcoal',className:'identity-charcoal'},{name:'Ámbar',className:'identity-amber'}];
export function PersonalizationConfigurator() {
 const [name,setName]=useState('Tu negocio');
 const [destination,setDestination]=useState<'Google'|'Instagram'>('Google');
 const [tone,setTone]=useState(0);
 const [logo,setLogo]=useState('');
 const [error,setError]=useState('');
 const file=useRef<HTMLInputElement>(null);
 useEffect(() => () => { if(logo) URL.revokeObjectURL(logo); },[logo]);
 function upload(selected?:File){
  if(!selected)return;
  if(!['image/jpeg','image/png','image/webp'].includes(selected.type)||selected.size>5*1024*1024){setError('Elegí una imagen JPG, PNG o WebP de hasta 5 MB.');return;}
  setError('');setLogo(URL.createObjectURL(selected));
 }
 return <div className="identity-configurator"><div className="identity-preview"><ProductPhoto product={destination}/><div className={`identity-detail ${tones[tone]?.className ?? 'identity-navy'}`}>{logo ? <img src={logo} alt="Logo elegido para la consulta"/> : <span className="identity-initial">{name.trim().slice(0,1).toUpperCase()||'T'}</span>}<div><strong>{name.trim()||'Tu negocio'}</strong><span>{destination==='Google'?'Google Reviews':'Instagram'}</span></div></div><p>Referencia de identidad · La fotografía oficial no se modifica.</p></div><div className="identity-controls"><label>Nombre de tu negocio<input value={name} onChange={e=>setName(e.target.value)} maxLength={50} placeholder="Tu negocio"/></label><fieldset><legend>Destino</legend><div className="identity-destinations">{(['Google','Instagram'] as const).map(value=><Button key={value} variant="outline" aria-pressed={destination===value} onClick={()=>setDestination(value)}>{value==='Google'?'Google Reviews':value}</Button>)}</div></fieldset><fieldset><legend>Color de referencia</legend><div className="identity-swatches">{tones.map((item,index)=><Button key={item.name} variant="ghost" size="icon" className={`identity-swatch ${item.className}`} aria-label={item.name} aria-pressed={tone===index} title={item.name} onClick={()=>setTone(index)}/>)}</div></fieldset><div className="identity-upload"><input ref={file} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Elegir logo" onChange={e=>upload(e.target.files?.[0])}/><Button variant="outline" onClick={()=>file.current?.click()}><ImagePlus size={16}/>{logo?'Cambiar logo':'Elegir logo'}</Button>{logo && <Button size="icon" variant="ghost" aria-label="Quitar logo" onClick={()=>{setLogo('');if(file.current)file.current.value='';}}><X size={17}/></Button>}</div>{error&&<p role="alert">{error}</p>}<Button asChild className="tap-button"><a href={whatsapp(`una tarjeta ${destination} para ${name.trim()||'mi negocio'}, con ${tones[tone]?.name.toLowerCase()} como color de referencia`)} target="_blank" rel="noopener noreferrer">CONSULTAR ESTE DISEÑO<ArrowUpRight size={16}/></a></Button><small>El diseño final se coordina con vos. El logo elegido no se envía por WhatsApp; podés adjuntarlo en la conversación.</small></div></div>;
}

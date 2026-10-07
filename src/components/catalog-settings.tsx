import { useState } from 'react';
import { Coffee, Utensils, Scissors, ShoppingBag, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductPhoto } from '@/components/tap-experience';
import cafe from '@/assets/demo-counter.jpg';
import restaurant from '@/assets/catalog-restaurant.webp.asset.json';
import barber from '@/assets/catalog-barber.webp.asset.json';
import shop from '@/assets/catalog-shop.webp.asset.json';
import reception from '@/assets/catalog-reception.webp.asset.json';
const settings = [
 { name: 'Cafetería', image: cafe, icon: Coffee, product: 'Google' },
 { name: 'Restaurante', image: restaurant.url, icon: Utensils, product: 'Google' },
 { name: 'Barbería', image: barber.url, icon: Scissors, product: 'Instagram' },
 { name: 'Tienda', image: shop.url, icon: ShoppingBag, product: 'Instagram' },
 { name: 'Recepción', image: reception.url, icon: Building2, product: 'Google' },
] as const;
export function CatalogSettings() {
 const [selected, setSelected] = useState(0);
 const setting = settings[selected] ?? settings[0];
 return <><div className="catalog-settings-selector" role="group" aria-label="Elegir ambientación del negocio">{settings.map((item, index) => <Button key={item.name} variant="ghost" aria-pressed={selected === index} onClick={() => setSelected(index)}><item.icon size={16}/>{item.name}</Button>)}</div><div className={`catalog-business-scene ${selected === 0 ? 'catalog-cafe-scene' : 'catalog-counter-scene'}`} key={setting.name}><img src={setting.image} alt={`Ambientación ilustrativa de ${setting.name.toLowerCase()}, no representa a un cliente de Tap Review`} loading="lazy" width={1100} height={733}/>{selected !== 0 && <div className="catalog-countertop" aria-hidden="true"/>}<ProductPhoto product={setting.product}/><span>{setting.name} · Ambientación ilustrativa</span></div></>;
}

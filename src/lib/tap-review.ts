export const tapReview = {
  individualPrice: 24900,
  packPrice: 44900,
  instagram: 'https://www.instagram.com/tap.review_sj/',
  phones: [
    { number: '5492645895128', label: '+54 9 2645 89-5128' },
    { number: '5492646700991', label: '+54 9 2646 70-0991' },
  ],
} as const;
export const money = (value: number) => `$${new Intl.NumberFormat('es-AR').format(value)}`;
export function whatsapp(product = 'una tarjeta NFC para mi negocio', phone = tapReview.phones[0].number) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(`Hola! Vi Tap Review y quiero consultar por ${product}.`)}`;
}
export const navigation = [
  ['Inicio', 'inicio'], ['Productos', 'productos'], ['Cómo funciona', 'como-funciona'],
  ['Personalización', 'personalizacion'], ['Nosotros', 'nosotros'], ['Contacto', 'contacto'],
];
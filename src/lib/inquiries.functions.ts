import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const inquiry = z.object({
  name: z.string().trim().min(2).max(100),
  business: z.string().trim().min(2).max(150),
  product: z.enum(['Google', 'Instagram', 'Pack Google + Instagram', 'Quiero consultar']),
  phone: z.string().trim().min(8).max(30).regex(/^[+\d\s()-]+$/),
  message: z.string().trim().max(2000),
  website: z.string().max(0),
});

export const submitInquiry = createServerFn({ method: 'POST' })
  .inputValidator((data) => inquiry.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: id, error } = await supabaseAdmin.rpc('submit_tap_inquiry', {
      p_name: data.name, p_business: data.business, p_product: data.product,
      p_phone: data.phone.replace(/\D/g, ''), p_message: data.message,
    });
    if (error) {
      console.error('Inquiry storage failed', error.code);
      throw new Error(error.message.includes('Demasiadas') ? 'Demasiadas consultas. Intentá más tarde o escribinos por WhatsApp.' : 'No pudimos guardar tu consulta. Intentá nuevamente o escribinos por WhatsApp.');
    }
    return { id };
  });
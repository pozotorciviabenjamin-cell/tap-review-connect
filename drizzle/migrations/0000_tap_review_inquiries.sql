CREATE TABLE public.contact_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL,
 business text NOT NULL,
 product text NOT NULL,
 phone text NOT NULL,
 message text NOT NULL DEFAULT ''
);
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE INDEX contact_submissions_phone_created ON public.contact_submissions(phone, created_at DESC);
CREATE OR REPLACE FUNCTION public.submit_tap_inquiry(p_name text,p_business text,p_product text,p_phone text,p_message text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext(p_phone));
 IF (SELECT count(*) FROM public.contact_submissions WHERE phone = p_phone AND created_at > now() - interval '1 hour') >= 5 THEN
 RAISE EXCEPTION 'Demasiadas consultas. Intentá más tarde o escribinos por WhatsApp.';
 END IF;
 INSERT INTO public.contact_submissions(name,business,product,phone,message) VALUES(p_name,p_business,p_product,p_phone,p_message) RETURNING id INTO new_id;
 RETURN new_id;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_tap_inquiry(text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_tap_inquiry(text,text,text,text,text) TO service_role;
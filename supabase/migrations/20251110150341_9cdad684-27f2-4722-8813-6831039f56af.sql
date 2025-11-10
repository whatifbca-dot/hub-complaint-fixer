-- Fix search_path for security on existing functions
CREATE OR REPLACE FUNCTION public.generate_complaint_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  year_part TEXT;
  count_part INTEGER;
  new_id TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO count_part
  FROM public.complaints
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  new_id := 'HUB-' || year_part || '-' || LPAD(count_part::TEXT, 3, '0');
  RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_complaint_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.complaint_id IS NULL OR NEW.complaint_id = '' THEN
    NEW.complaint_id := public.generate_complaint_id();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.status = 'Resolved' AND OLD.status != 'Resolved' THEN
    NEW.resolved_at = NOW();
  END IF;
  RETURN NEW;
END;
$function$;
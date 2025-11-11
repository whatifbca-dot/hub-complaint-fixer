-- Allow admins to delete resolved complaints
CREATE POLICY "Admins can delete resolved complaints"
ON public.complaints
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  AND status = 'Resolved'::complaint_status
);
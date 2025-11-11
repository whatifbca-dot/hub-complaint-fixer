-- Allow students to delete their own pending complaints
CREATE POLICY "Students can delete their own pending complaints"
ON public.complaints
FOR DELETE
USING (auth.uid() = user_id AND status = 'Pending'::complaint_status);
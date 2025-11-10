-- Drop the existing foreign key if it points to auth.users
ALTER TABLE public.complaints
DROP CONSTRAINT IF EXISTS complaints_user_id_fkey;

-- Add the correct foreign key pointing to profiles table
ALTER TABLE public.complaints
ADD CONSTRAINT complaints_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
-- Create RLS policies for hf-images bucket storage
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hf-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their uploads"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'hf-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'hf-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view hf-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hf-images');
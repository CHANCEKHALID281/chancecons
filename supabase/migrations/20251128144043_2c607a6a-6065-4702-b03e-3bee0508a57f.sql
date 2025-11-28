-- Create equipment/machines table
CREATE TABLE public.equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('truck', 'excavator', 'other')),
  description text,
  available boolean DEFAULT true,
  rental_price_per_day numeric(10,2),
  image_url text,
  specifications jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create construction materials table
CREATE TABLE public.construction_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('gravel', 'sand', 'stones', 'other')),
  description text,
  in_stock boolean DEFAULT true,
  price_per_unit numeric(10,2),
  unit text NOT NULL DEFAULT 'ton',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create structural materials table
CREATE TABLE public.structural_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('steel', 'cement', 'rebar', 'other')),
  description text,
  in_stock boolean DEFAULT true,
  price_per_unit numeric(10,2),
  unit text NOT NULL DEFAULT 'ton',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create promotions table
CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  discount_percentage numeric(5,2),
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gallery table
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Create contact requests table
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Create site content table for editable content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL UNIQUE,
  title text,
  content text,
  metadata jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.structural_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public read access for all content (customers can view)
CREATE POLICY "Public can view equipment"
  ON public.equipment FOR SELECT
  USING (true);

CREATE POLICY "Public can view construction materials"
  ON public.construction_materials FOR SELECT
  USING (true);

CREATE POLICY "Public can view structural materials"
  ON public.structural_materials FOR SELECT
  USING (true);

CREATE POLICY "Public can view active promotions"
  ON public.promotions FOR SELECT
  USING (active = true);

CREATE POLICY "Public can view gallery"
  ON public.gallery FOR SELECT
  USING (true);

CREATE POLICY "Public can view site content"
  ON public.site_content FOR SELECT
  USING (true);

-- Anyone can submit contact requests
CREATE POLICY "Anyone can submit contact requests"
  ON public.contact_requests FOR INSERT
  WITH CHECK (true);

-- Authenticated users (admins) can manage all content
CREATE POLICY "Authenticated can manage equipment"
  ON public.equipment FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage construction materials"
  ON public.construction_materials FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage structural materials"
  ON public.structural_materials FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage promotions"
  ON public.promotions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage gallery"
  ON public.gallery FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage contact requests"
  ON public.contact_requests FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage site content"
  ON public.site_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_construction_materials_updated_at
  BEFORE UPDATE ON public.construction_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_structural_materials_updated_at
  BEFORE UPDATE ON public.structural_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site content
INSERT INTO public.site_content (section, title, content) VALUES
  ('hero', 'H&F Ltd - Your Construction Partner', 'Professional truck and excavator rentals, land levelling services, and quality construction materials'),
  ('about', 'About H&F Ltd', 'H&F Ltd is your trusted partner for all construction needs. With years of experience in the industry, we provide top-quality equipment rentals, professional land levelling services, and a comprehensive selection of construction and structural materials. Our mission is to support your projects with reliable equipment, competitive pricing, and exceptional customer service.'),
  ('mission', 'Our Mission', 'To deliver exceptional construction services and materials that exceed our customers expectations while maintaining the highest standards of safety and quality.'),
  ('contact_info', 'Get In Touch', '{"phone": "+1-555-0123", "email": "info@hfltd.com", "address": "123 Construction Ave, Building City, BC 12345"}');

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hf-images', 'hf-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public read
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hf-images');

-- Authenticated users can upload images
CREATE POLICY "Authenticated can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hf-images' AND auth.role() = 'authenticated');

-- Authenticated users can update images
CREATE POLICY "Authenticated can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'hf-images' AND auth.role() = 'authenticated');

-- Authenticated users can delete images
CREATE POLICY "Authenticated can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hf-images' AND auth.role() = 'authenticated');
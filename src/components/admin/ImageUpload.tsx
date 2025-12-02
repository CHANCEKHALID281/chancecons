import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export const ImageUpload = ({ value, onChange, folder = "general", label = "Image" }: ImageUploadProps) => {
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to storage
    const url = await uploadImage(file, folder);
    if (url) {
      onChange(url);
      setPreview(url);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setPreview(url);
  };

  const clearImage = () => {
    onChange("");
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Preview */}
      {preview && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border bg-muted">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={() => setPreview("")}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Options */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-shrink-0"
        >
          {isUploading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
        <Input
          type="url"
          placeholder="Or paste image URL..."
          value={value}
          onChange={handleUrlChange}
          className="flex-1"
        />
      </div>

      {!preview && (
        <div 
          className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 mb-2" />
          <span className="text-sm">Click to upload or drag & drop</span>
        </div>
      )}
    </div>
  );
};

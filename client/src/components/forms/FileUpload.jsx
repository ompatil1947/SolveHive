import { useRef, useState } from 'react';
import { UploadCloud, X, Film, Image } from 'lucide-react';

export default function FileUpload({ label, accept, name, onChange, preview: externalPreview }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const isVideo = accept?.includes('video');

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview({ url, type: file.type });
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
        }`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {preview ? (
          <div className="relative">
            {preview.type?.startsWith('video') ? (
              <video src={preview.url} className="max-h-40 mx-auto rounded-lg" controls />
            ) : (
              <img src={preview.url} alt="preview" className="max-h-40 mx-auto rounded-lg object-cover" />
            )}
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs text-slate-500 mt-2 truncate">{fileName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              {isVideo ? (
                <Film className="w-5 h-5 text-indigo-400" />
              ) : (
                <Image className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Drop file here, or <span className="text-indigo-600">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isVideo ? 'MP4, MOV, WebM up to 50MB' : 'PNG, JPG, GIF, WebP up to 50MB'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

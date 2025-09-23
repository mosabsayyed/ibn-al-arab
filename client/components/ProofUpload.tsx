import React, { useState } from 'react';
import { useI18n } from "@/context/i18n";

type ProofUploadProps = {
  planId?: string;
};

export function ProofUpload({ planId }: ProofUploadProps) {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>('');

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  }

  async function uploadFile() {
    if (!file) return;
    
    setUploading(true);
    const form = new FormData();
    if (planId) form.append('planId', planId);
    form.append('proof', file);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());
  setMessage(t('uploadSuccess'));
    } catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : String(err);
  setMessage(errorMessage || t('uploadFailed'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      
      {file && (
        <div className="text-sm text-gray-600">
          {t('selectedFile', file.name, Math.round(file.size / 1024))}
        </div>
      )}
      
      {file && (
        <button
          onClick={uploadFile}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm"
        >
          {uploading ? t('uploading') : t('uploadProof')}
        </button>
      )}
      
      {message && (
        <div className="text-sm p-2 rounded bg-gray-50">
          {message}
        </div>
      )}
    </div>
  );
}

export default ProofUpload;

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import type { MediaAsset } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

export const AdminMedia: React.FC = () => {
  const { hasPermission, showToast } = useAdmin();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.getMedia({ type: filterType });
      setAssets(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch media assets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filterType]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const asset = await api.uploadMedia(formData);
        setAssets((prev) => [asset, ...prev]);
      }
      showToast(`${files.length} asset(s) uploaded successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) return;

    try {
      await api.deleteMedia(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      showToast('Asset deleted successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete asset', 'error');
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    showToast('Asset URL copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Digital Asset Management
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            Media Library
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Upload, organize, and manage campaign photography, videos, and branding assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission('media.upload') && (
            <label className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Media Files'}</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}

          <button
            onClick={fetchMedia}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D50000]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['', 'image', 'video'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filterType === type
                ? 'bg-[#D50000] text-white'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            {type === '' ? 'All Media Assets' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 font-mono text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D50000]" />
          <span>Loading asset library...</span>
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#0F0F0F] border border-white/10 text-center text-neutral-400">
          <ImageIcon className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
          <h3 className="font-headline text-lg text-white mb-1">No Media Assets Found</h3>
          <p className="text-xs max-w-sm mx-auto mb-4">
            Upload images, logos, or campaign videos to use them across CMS landing pages.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => {
            const isVideo = asset.mime_type.startsWith('video/');

            return (
              <div
                key={asset.id}
                className="group relative rounded-2xl bg-[#0F0F0F] border border-white/10 hover:border-white/30 overflow-hidden transition-all flex flex-col justify-between shadow-lg"
              >
                {/* Media Preview Box */}
                <div className="aspect-square w-full bg-black relative overflow-hidden flex items-center justify-center">
                  {isVideo ? (
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <VideoIcon className="w-8 h-8 text-[#D50000]" />
                      <span className="text-[9px] font-mono mt-1 uppercase">Video</span>
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.alt_en || asset.title || 'asset'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleCopyUrl(asset)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white text-black transition-colors"
                      title="Copy Public URL"
                    >
                      {copiedId === asset.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {hasPermission('media.delete') && (
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-2.5 text-[11px] space-y-0.5">
                  <div className="text-white font-medium truncate" title={asset.original_name}>
                    {asset.title || asset.original_name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>{formatFileSize(asset.file_size)}</span>
                    {asset.width && <span>{asset.width}x{asset.height}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

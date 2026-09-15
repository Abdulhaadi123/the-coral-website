'use client';

import React, { useState } from 'react';
import { Plus, Trash2, PlayCircle, AlertCircle } from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';

export interface VideoEntry {
  url: string;
  title: string;
}

interface VideoListEditorProps {
  videos: VideoEntry[];
  onChange: (videos: VideoEntry[]) => void;
}

let nextKey = 0;

export const VideoListEditor: React.FC<VideoListEditorProps> = ({ videos, onChange }) => {
  // Stable per-row React keys, independent of array position, so an input
  // doesn't lose focus/get reused when a row above it is removed.
  const [keys, setKeys] = useState<number[]>(() => videos.map(() => nextKey++));

  const syncKeys = (count: number) => {
    setKeys((prev) => {
      const next = [...prev];
      while (next.length < count) next.push(nextKey++);
      return next.slice(0, count);
    });
  };

  const addVideo = () => {
    const updated = [...videos, { url: '', title: '' }];
    syncKeys(updated.length);
    onChange(updated);
  };

  const removeVideo = (index: number) => {
    const updated = videos.filter((_, i) => i !== index);
    setKeys((prev) => prev.filter((_, i) => i !== index));
    onChange(updated);
  };

  const updateVideo = (index: number, field: keyof VideoEntry, value: string) => {
    const updated = videos.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-bold text-[#111827]">3. Project Videos (optional)</h2>
        <p className="text-xs text-gray-500">
          Add one or more YouTube links with a title each. Visitors see a play button on the
          portfolio card and detail page that opens a gallery of these videos on the site —
          they never leave to YouTube.
        </p>
      </div>

      {videos.length > 0 && (
        <div className="flex flex-col gap-4">
          {videos.map((video, index) => {
            const videoId = video.url ? getYouTubeId(video.url) : null;
            return (
              <div key={keys[index] ?? index} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Video {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={video.title}
                  onChange={(e) => updateVideo(index, 'title', e.target.value)}
                  placeholder="Video title, e.g. Behind the Scenes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
                />

                <input
                  type="url"
                  value={video.url}
                  onChange={(e) => updateVideo(index, 'url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#78B249]"
                />

                {video.url && (
                  videoId ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getYouTubeThumbnail(video.url) || ''}
                        alt="Video thumbnail preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-red-500 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Doesn&apos;t look like a valid YouTube link yet.
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={addVideo}
        className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#78B249] text-sm font-semibold text-gray-500 hover:text-[#467923] hover:bg-green-50/30 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add Video</span>
      </button>
    </div>
  );
};

export default VideoListEditor;

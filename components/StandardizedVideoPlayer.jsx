"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Radio,
  Clock,
  Film,
  Sparkles,
  Wifi,
  ExternalLink,
  RotateCcw,
  FastForward
} from 'lucide-react';

/**
 * Helper to detect video source type and normalize embed URLs
 * Supports: YouTube, Vimeo, Google Shared Drive, Direct MP4/WebM/HLS
 */
export function parseVideoSource(rawUrl = '') {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: 'none', url: '', embedUrl: '' };
  }

  const trimmed = rawUrl.trim();

  // 1. YouTube (watch?v=, youtu.be/, embed/)
  const ytMatch =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) ||
    trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      url: trimmed,
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
    };
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId: vimeoId,
      url: trimmed,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?byline=0&portrait=0`
    };
  }

  // 3. Google Drive / Google Shared Drive (drive.google.com/file/d/FILE_ID/...)
  const driveMatch =
    trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      type: 'gdrive',
      fileId,
      url: trimmed,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`
    };
  }

  // 4. Direct HTML5 Video (.mp4, .webm, .ogg, .m3u8, or cloud storage URL)
  return {
    type: 'direct',
    url: trimmed,
    embedUrl: trimmed
  };
}

function parseTimeToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

function formatSeconds(sec) {
  if (!sec || isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function StandardizedVideoPlayer({
  videoUrl = '',
  posterUrl = '',
  title = 'Clinical Procedure Demonstration',
  subtitle = '',
  isPersistentModuleVideo = false,
  startTime = '',
  endTime = '',
  hostingMode = 'external' // 'external' | 'managed_drive'
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dataSaverAudioOnly, setDataSaverAudioOnly] = useState(false);

  const parsed = parseVideoSource(videoUrl);

  // Seek to chapter startTime when topic changes on direct HTML5 video
  useEffect(() => {
    setIsPlaying(false);
    if (parsed.type === 'direct' && videoRef.current && startTime) {
      const startSec = parseTimeToSeconds(startTime);
      if (startSec > 0) {
        try {
          videoRef.current.currentTime = startSec;
          setCurrentTime(startSec);
        } catch (e) {}
      }
    }
  }, [videoUrl, startTime, parsed.type]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleJumpToChapter = () => {
    if (!videoRef.current || !startTime) return;
    const sec = parseTimeToSeconds(startTime);
    videoRef.current.currentTime = sec;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const handleSeekBar = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  // Source badge label
  const sourceBadge =
    parsed.type === 'youtube'
      ? 'YouTube Stream'
      : parsed.type === 'vimeo'
      ? 'Vimeo Clinical HD'
      : parsed.type === 'gdrive'
      ? 'Pamoja Shared Drive'
      : parsed.type === 'direct'
      ? hostingMode === 'managed_drive'
        ? 'Managed Cloud Stream'
        : 'Direct Clinical MP4/HLS'
      : 'Interactive Visual Stage';

  // Build iframe URL with start time if YouTube
  let iframeSrc = parsed.embedUrl;
  if (parsed.type === 'youtube' && startTime) {
    const startSec = parseTimeToSeconds(startTime);
    if (startSec > 0) {
      iframeSrc += `&start=${startSec}`;
    }
  }

  return (
    <div
      ref={containerRef}
      className="bg-slate-950 overflow-hidden relative select-none group"
    >
      {/* Top Standardized Clinical Status Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Film size={11} /> {sourceBadge}
          </span>
          {isPersistentModuleVideo && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold shrink-0">
              Persistent Module Video
            </span>
          )}
          {(startTime || endTime) && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
              <Clock size={10} /> Chapter: {startTime || '00:00'} &ndash; {endTime || 'End'}
            </span>
          )}
        </div>

        {/* Standardized Bandwidth & Mode Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDataSaverAudioOnly(!dataSaverAudioOnly)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all ${
              dataSaverAudioOnly
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Rural Clinic Low-Bandwidth Audio Mode (64kbps)"
          >
            <Wifi size={11} />
            {dataSaverAudioOnly ? 'Rural Audio-Only (64kbps)' : 'HD Video Mode'}
          </button>

          {parsed.url && (
            <a
              href={parsed.url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
              title="Open Source Stream in New Tab"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative aspect-video bg-black w-full flex items-center justify-center overflow-hidden">
        {dataSaverAudioOnly ? (
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-700 text-amber-400 flex items-center justify-center animate-pulse">
              <Radio size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                Rural Data-Saver Active (&lt; 0.5 MB / min)
              </span>
              <h3 className="text-lg font-bold font-['Outfit'] text-white mt-3">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            </div>
            {parsed.type === 'direct' && (
              <audio src={parsed.url} controls className="w-full max-w-md mt-2" />
            )}
          </div>
        ) : parsed.type === 'youtube' || parsed.type === 'vimeo' || parsed.type === 'gdrive' ? (
          <iframe
            src={iframeSrc}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : parsed.type === 'direct' ? (
          <>
            <video
              ref={videoRef}
              src={parsed.url}
              poster={posterUrl}
              playsInline
              onClick={togglePlay}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* Standardized Custom HTML5 Control Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-4 pt-8 flex flex-col gap-2.5">
              {/* Progress Scrubber */}
              <div
                onClick={handleSeekBar}
                className="w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group/bar"
              >
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold transition-all"
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>

                  <span className="font-mono text-[11px] text-slate-300">
                    {formatSeconds(currentTime)} / {formatSeconds(duration)}
                  </span>

                  {startTime && (
                    <button
                      type="button"
                      onClick={handleJumpToChapter}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-[10px] font-bold flex items-center gap-1"
                    >
                      <RotateCcw size={11} /> Jump to Topic ({startTime})
                    </button>
                  )}
                </div>

                {/* Playback Speed & Fullscreen */}
                <div className="flex items-center gap-1.5">
                  {[0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        playbackRate === rate
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white ml-1"
                    title="Fullscreen"
                  >
                    <Maximize size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Fallback when no video URL is set yet */
          <div className="relative w-full h-full">
            {posterUrl && (
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover opacity-35"
              />
            )}
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center mb-3 shadow-lg">
                <Sparkles size={26} />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-['Outfit'] text-white max-w-lg">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-300 max-w-md mt-1">{subtitle}</p>
              )}
              <span className="mt-3 text-[11px] font-semibold text-cyan-400 bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-800">
                Interactive Clinical Lesson &amp; Protocol Stage
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


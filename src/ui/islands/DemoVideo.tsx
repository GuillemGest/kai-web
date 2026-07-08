import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'

interface DemoVideoProps {
  videoSrc: string
  videoAlt: string
  videoPause: string
  videoPlay: string
}

export function DemoVideo({ videoSrc, videoAlt, videoPause, videoPlay }: DemoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (motionOk) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [])

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play().catch(() => {})
    else video.pause()
  }

  return (
    <figure className="hero__media">
      <video
        ref={videoRef}
        className="hero__video"
        src={videoSrc}
        width={1280}
        height={720}
        muted
        loop
        playsInline
        preload="metadata"
        hidden={videoFailed}
        onError={() => setVideoFailed(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-label={videoAlt}
      />
      {!videoFailed && (
        <button
          type="button"
          className="hero__video-toggle"
          onClick={toggleVideo}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? videoPause : videoPlay}
        >
          {isPlaying ? (
            <Pause size={16} strokeWidth={2} aria-hidden />
          ) : (
            <Play size={16} strokeWidth={2} aria-hidden />
          )}
        </button>
      )}
    </figure>
  )
}

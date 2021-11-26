import React, { useCallback, useEffect, useRef } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import styled from 'styled-components';
import "video.js/dist/video-js.css";


export interface VideoSource {
  src: string;
  type: string;
}

export interface VideoOptions {
  autoplay: boolean;
  controls: boolean;
  responsive: boolean;
  fluid: boolean;
  defaultVolume?: number;
  sources: VideoSource[];
  tracks?: videojs.TextTrackOptions[];
  bigPlayButton?: boolean;
}

export interface VideoProps {
  options: VideoOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReady?: (player: any) => void;
  onPlaying?: React.ReactEventHandler<HTMLVideoElement>;
  onPause?: React.ReactEventHandler<HTMLVideoElement>;
  onFullscreen?: React.ReactEventHandler<HTMLVideoElement>;
  onFullscreenEnd?: React.ReactEventHandler<HTMLVideoElement>;
  className?: string;
  showVolume?: boolean;
}


const StyledVideo = styled.video`
  &.video-js .vjs-big-play-button {
    font-size: 3em;
    line-height: 2.4em;
    height: 2.5em;
    width: 2.5em;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 0;
    cursor: pointer;
    opacity: 1;
    border-radius: 2.5em;
    transition: all 0.4s;
    transform: translate(-50%, -50%);
    border: none;
  }

  &.video-js .vjs-has-started.vjs-big-play-button {
    display: none;
  }

  &.video-js .vjs-control-bar {
    height: 4em;
  }
  

  &.video-js .vjs-volume-bar {
    margin: 1.85em 0.45em;
  }

  &.video-js .vjs-button > .vjs-icon-placeholder::before {
    font-size: 2.4em;
    line-height: 1.8;
  }

  &.video-js .vjs-time-control {
    line-height: 4;
  }

  &.vjs-paused .vjs-big-play-button,
  .vjs-paused.vjs-has-started .vjs-big-play-button {
   display: block;
  }
  

  /* stylelint-disable value-list-comma-newline-after */
  &.video-js .vjs-text-track-cue > div {
    background-color: transparent !important;
    text-shadow: rgb(34 34 34) 0px 0px 4px, rgb(34 34 34) 0px 0px 4px,
      rgb(34 34 34) 0px 0px 4px, rgb(34 34 34) 0px 0px 4px !important;
  }
  /* stylelint-enable value-list-comma-newline-after */

  &.video-js.vjs-layout-x-small:not(.vjs-liveui) .vjs-subs-caps-button,
  .video-js.vjs-layout-x-small:not(.vjs-live) .vjs-subs-caps-button,
  .video-js.vjs-layout-tiny .vjs-subs-caps-button {
    display: inline-block;
  }
`;


export const Video: React.FC<VideoProps> = ({
  options,
  onReady,
  className,
  onPause,
  onPlaying,
  onFullscreen,
  onFullscreenEnd,
}) => {

  const videoRef = useRef(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = videojs(
        videoElement,
        {
          ...options,
          bigPlayButton:
            options.bigPlayButton === undefined
              ? true
              : options.bigPlayButton,
          controlBar: {
            children: [
              {
                name: 'PlayToggle',
              },
              {
                name: 'VolumePanel',
              },
              {
                name: 'CurrentTimeDisplay',
              },
              {
                name: 'TimeDivider',
              },
              {
                name: 'DurationDisplay',
              },
              {
                name: 'ProgressControl',
              },
              {
                name: 'RemainingTimeDisplay',
              },
              {
                name: 'CustomControlSpacer',
              },
              {
                name: 'FullscreenToggle',
              },
            ],
          },
        },
        () => {
          onReady && onReady(player);
          options.defaultVolume && player.volume(options.defaultVolume);
        },
      );
    } else {
      // you can update player here [update player through props]
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, onReady, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const onFull = useCallback(
    (event) => {
      console.log('onFull');
      if (!playerRef.current) {
        return;
      }

      if (onFullscreen && playerRef.current.isFullscreen()) {
        onFullscreen(event);
      }

      if (onFullscreenEnd && !playerRef.current.isFullscreen()) {
        onFullscreenEnd(event);
      }
    },
    [playerRef, onFullscreen, onFullscreenEnd],
  );

  useEffect(() => {
    if (playerRef.current && (onFullscreen || onFullscreenEnd)) {
      playerRef.current.on('fullscreenchange', (e: any) => {
        onFull(e);
      });
    }
  }, [playerRef, onFull, onFullscreen, onFullscreenEnd]);



  return (
    <StyledVideo
      onPlaying={onPlaying}
      onPause={onPause}
      ref={videoRef}
      className={`video-js ${className}`}
    />
  );
}
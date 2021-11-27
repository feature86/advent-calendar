import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { HatchData } from '../../container/App';
import { Video } from '../Video'
import { VideoJsPlayer } from 'video.js'

interface HatchProps {
  hatch: HatchData
  toggleOpen: (id: string) => void;

}


const HatchWrap = styled.div`
  width: 150px;
  height: 150px; 
  border-radius: 5px;
  margin: 20px;  
  cursor: pointer;
  user-select:none;
  font-size: 2.5em;
  position:relative;
  
`;

const HatchCommon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width:150px;
  height:150px;
  transition: all 1s;
  transform-style: preserve-3d;
  border: 4px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const Day = styled.span`
  position: absolute;
  bottom: 5px;
  right: 15px;
`;
const HatchFront = styled(HatchCommon)`
  background-color: rgba(0,0,0,0.4);
  color: white;
  opacity: 1;
  z-index: 2;
  position:absolute;
  &.open {
    transform: rotateY(180deg);
    opacity: 0;
  }
`

const HatchBack = styled(HatchCommon)`
background-color: burlywood;
z-index: 1;
transform: rotateY(180deg);
opacity:0;

&.open {
  z-index: 2;
  transform: rotateY(0deg);
  opacity: 1;
}
`

const StyledVideo = styled(Video)`
  z-index:5;
  width: 150px;
  height: 150px;
`


export const Hatch: React.FC<HatchProps> = ({ hatch, toggleOpen }) => {
  const { open, day, id, url } = hatch;
  const [playerRef, setPlayerRef] = useState<VideoJsPlayer | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (open || !url || !url.length) {
      return
    }
    e.stopPropagation();
    toggleOpen(id);
  }

  useEffect(() => {
    if (!open) {
      //if player is running stop it
      if (playerRef) {
        if (!playerRef.paused()) {
          playerRef.pause();
        }
        playerRef.currentTime(0);
        playerRef.bigPlayButton.show();
      }
    }
  }, [open, playerRef])


  const onReady = (player: VideoJsPlayer) => {
    setPlayerRef(player);
    if (player) {
      player.on('fullscreenchange', onFull);
    }
  }

  const onPlaying = () => {
    if (playerRef) {
      if (!playerRef.isFullscreen()) {
        playerRef.requestFullscreen();
      }
    }
  }

  const onFull = () => {
    if (playerRef) {
      if (!playerRef.isFullscreen()) {
        if (!playerRef.paused()) {
          playerRef.pause();
        }
      }
    }
  }

  const onPause = () => {
    if (playerRef) {
      if (playerRef.remainingTime() === 0 && playerRef.isFullscreen()) {
        playerRef.exitFullscreen();
      }
    }
  }



  return (
    <HatchWrap onClick={handleClick}>
      <HatchFront className={open ? 'open' : ''}><Day>{day}</Day> </HatchFront>
      <HatchBack className={open ? 'open' : ''}>

        <StyledVideo
          key={id}
          onReady={onReady}
          onPlaying={onPlaying}
          onPause={onPause}
          options={
            {
              autoplay: false,
              controls: true,
              fluid: false,
              responsive: true,
              defaultVolume: 0.8,
              sources: [
                {
                  src: url,
                  type: 'application/x-mpegURL'
                }
              ]
            }

          }

        />

      </HatchBack>
    </HatchWrap>

  )
}

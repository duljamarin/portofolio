import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

interface VideoModalProps {
  src: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ src, title, isOpen, onClose }) => {
  const [closing, setClosing] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClose = useCallback(() => {
    setClosing(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`gallery-modal-overlay${closing ? ' closing' : ''}`}
      onClick={handleClose}
    >
      <div className="gallery-modal-content video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Close video">
          &#x2715;
        </button>

        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          className="video-modal-player"
          aria-label={title}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>,
    document.body
  );
};

export default VideoModal;

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface GalleryModalProps {
  images: string[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

// Height-to-width ratio above which an image is treated as a full-page screenshot.
const TALL_IMAGE_RATIO = 2;

const GalleryModal: React.FC<GalleryModalProps> = ({ images, title, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [closing, setClosing] = useState(false);
  const [tallImages, setTallImages] = useState<Record<number, boolean>>({});

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      // Reset on close (not in an effect on open) so the next open starts at image 1.
      setCurrentIndex(0);
      onClose();
    }, 200);
  }, [onClose]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose, goNext, goPrev]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`gallery-modal-overlay${closing ? ' closing' : ''}`}
      onClick={handleClose}
    >
      <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Close gallery">
          &#x2715;
        </button>

        {images.length > 1 && (
          <button className="modal-nav modal-nav-prev" onClick={goPrev} aria-label="Previous image">
            &#8249;
          </button>
        )}

        {/* Keyed by index so each image starts scrolled to the top. Full-page
            screenshots would shrink to a thin strip under object-fit: contain,
            so tall images keep their width and scroll vertically instead. */}
        <div
          key={currentIndex}
          className={`gallery-modal-frame${tallImages[currentIndex] ? ' is-tall' : ''}`}
        >
          <img
            src={images[currentIndex]}
            alt={`${title}, image ${currentIndex + 1}`}
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              const isTall = naturalHeight / naturalWidth > TALL_IMAGE_RATIO;
              setTallImages((previous) =>
                previous[currentIndex] === isTall ? previous : { ...previous, [currentIndex]: isTall }
              );
            }}
          />
        </div>

        {images.length > 1 && (
          <button className="modal-nav modal-nav-next" onClick={goNext} aria-label="Next image">
            &#8250;
          </button>
        )}

        {images.length > 1 && (
          <div className="modal-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`modal-dot${i === currentIndex ? ' active' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <span className="modal-counter">
            {currentIndex + 1} / {images.length}
          </span>
        )}
      </div>
    </div>,
    document.body
  );
};

export default GalleryModal;

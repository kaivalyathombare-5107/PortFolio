import useCarousel from '../hooks/useCarousel.js';

// Generic horizontal-scroll gallery. Pass `renderCard(item)` to control
// what each card looks like — used by both Projects and Certifications
// so the scroll/arrow/progress behavior stays in one place.
export default function Gallery({ items, renderCard }) {
  const { trackRef, progress, atStart, atEnd, prev, next } = useCarousel();

  return (
    <div className="carousel">
      <div className="carousel-track" ref={trackRef}>
        {items.map((item) => (
          <div className="card" data-card key={item.id}>
            {renderCard(item)}
          </div>
        ))}
      </div>

      <div className="carousel-nav">
        <button
          type="button"
          className="carousel-arrow"
          onClick={prev}
          disabled={atStart}
          aria-label="Scroll left"
        >
          <ArrowIcon direction="left" />
        </button>
        <div className="carousel-progress-track">
          <div
            className="carousel-progress-fill"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
        <button
          type="button"
          className="carousel-arrow"
          onClick={next}
          disabled={atEnd}
          aria-label="Scroll right"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
}

function ArrowIcon({ direction }) {
  const flip = direction === 'left';
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

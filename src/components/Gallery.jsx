import useCarousel from '../hooks/useCarousel.js';
import useDragReorder from '../hooks/useDragReorder.js';
import useSpotlight from '../hooks/useSpotlight.js';

// Wraps each card in a spotlight-aware container
function SpotlightCard({ item, index, canReorder, getDragProps, getDropProps, overIndex, renderCard }) {
  const { ref, onMouseMove, onMouseLeave } = useSpotlight();

  return (
    <div
      ref={ref}
      className={`card spotlight-card${canReorder ? ' draggable-card' : ''}${
        canReorder && overIndex === index ? ' drag-over' : ''
      }`}
      data-card
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...(canReorder ? getDragProps(index) : {})}
      {...(canReorder ? getDropProps(index) : {})}
    >
      {/* Radial spotlight overlay — positioned via --spotlight-x / --spotlight-y */}
      <div className="spotlight-overlay" aria-hidden="true" />
      {canReorder && (
        <div className="drag-handle" aria-hidden="true">
          <DragHandleIcon />
        </div>
      )}
      {renderCard(item)}
    </div>
  );
}

// Generic horizontal-scroll gallery. Pass `renderCard(item)` to control
// what each card looks like — used by Projects, Achievements, and Gallery.
// When `isOwner` + `onReorder` are provided, cards become draggable so the
// owner can reorder them by dragging left/right.
export default function Gallery({ items, renderCard, isOwner, onReorder }) {
  const { trackRef, progress, atStart, atEnd, prev, next } = useCarousel();
  const { getDragProps, getDropProps, overIndex } = useDragReorder(
    onReorder || (() => {})
  );

  const canReorder = isOwner && typeof onReorder === 'function';

  return (
    <div className="carousel">
      {canReorder && (
        <p className="reorder-hint">
          <DragIcon /> Drag cards to reorder
        </p>
      )}
      <div className="carousel-track" ref={trackRef}>
        {items.map((item, i) => (
          <SpotlightCard
            key={item.id}
            item={item}
            index={i}
            canReorder={canReorder}
            getDragProps={getDragProps}
            getDropProps={getDropProps}
            overIndex={overIndex}
            renderCard={renderCard}
          />
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

function DragHandleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function DragIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }}
      aria-hidden="true"
    >
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

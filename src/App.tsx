import React, { useRef, useEffect } from "react";
import "./App.css";

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  // For touch swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTo = (targetScrollLeft: number, duration: number) => {
      const startScrollLeft = container.scrollLeft;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeInOut =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        container.scrollLeft =
          startScrollLeft + (targetScrollLeft - startScrollLeft) * easeInOut;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isScrolling.current = false;
        }
      };

      requestAnimationFrame(animate);
    };

    const clampScroll = (value: number) => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (value < 0) return 0;
      if (value > maxScrollLeft) return maxScrollLeft;
      return value;
    };

    const scrollPage = (direction: number) => {
      if (isScrolling.current) return;
      const scrollAmount = container.clientWidth;
      let targetScrollLeft = container.scrollLeft + direction * scrollAmount;
      targetScrollLeft = clampScroll(targetScrollLeft);
      isScrolling.current = true;
      scrollTo(targetScrollLeft, 1000);
    };

    // Wheel scroll handler (horizontal scroll via vertical wheel)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY === 0) return;
      scrollPage(e.deltaY > 0 ? 1 : -1);
    };

    // Touch handlers for swipe
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const deltaX = touchStartX.current - touchEndX.current;
      const threshold = 50; // Minimum swipe distance in px to trigger scroll

      if (Math.abs(deltaX) > threshold) {
        scrollPage(deltaX > 0 ? 1 : -1);
      }
    };

    // Keyboard navigation handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollPage(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPage(-1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="horizontal-scroll-container" ref={containerRef}>
      <section className="page">test 1</section>
      <section className="page">test 2</section>
      <section className="page">test 3</section>
      <section className="page">test 4</section>
    </div>
  );
};

export default App;

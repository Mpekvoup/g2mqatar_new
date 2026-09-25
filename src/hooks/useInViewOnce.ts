import { useEffect, useRef, useState } from 'react';

interface UseInViewOnceOptions {
  threshold?: number;
  rootMargin?: string;
}

interface UseInViewOnceResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  isVisible: boolean;
  /** True after client mount and animation is enabled */
  isEnhanced: boolean;
}

/**
 * Hook that detects when an element enters the viewport (once).
 *
 * Progressive enhancement:
 * - SSR: isVisible=true, isEnhanced=false → content visible in HTML
 * - Client mount: isEnhanced=true, isVisible=false → animation starts
 * - On intersection: isVisible=true → animation completes
 * - No IntersectionObserver or reduced motion: both true immediately
 *
 * This prevents hydration mismatch and ensures content is always visible
 * without JavaScript.
 */
export function useInViewOnce<T extends HTMLElement = HTMLElement>(
  options: UseInViewOnceOptions = {}
): UseInViewOnceResult<T> {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = options;
  const ref = useRef<T | null>(null);

  // Start with visible=true for SSR, enhanced=false
  const [isVisible, setIsVisible] = useState(true);
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    // Now on client - check if we should animate
    if (typeof window === 'undefined') {
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Keep visible, mark enhanced
      setIsEnhanced(true);
      return;
    }

    // No IntersectionObserver - keep visible
    if (!('IntersectionObserver' in window)) {
      setIsEnhanced(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      setIsEnhanced(true);
      return;
    }

    // Enable animation mode: hide content, wait for intersection
    setIsVisible(false);
    setIsEnhanced(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible, isEnhanced };
}

/**
 * Convenience wrapper that returns simple [ref, shouldAnimate] tuple.
 * - shouldAnimate is false during SSR (content visible)
 * - shouldAnimate is true on client when animation can run
 * - Returns visibility state combined with enhancement state
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  options: UseInViewOnceOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { ref, isVisible, isEnhanced } = useInViewOnce<T>(options);

  // If not enhanced (SSR), show content (return true)
  // If enhanced, return actual visibility
  const shouldShow = !isEnhanced || isVisible;

  return [ref, shouldShow];
}

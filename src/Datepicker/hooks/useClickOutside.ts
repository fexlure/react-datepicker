import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void,
  alwaysOpened?: boolean,
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!alwaysOpened) {
        const el = ref?.current;
        if (!el || el.contains((event?.target as Node) || null)) {
          return;
        }
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
};

import { useEffect, useRef } from 'react';

const KEY_MAP = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right'
};

export function useKeyboard() {
  const keys = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    const setKey = (pressed) => (event) => {
      const action = KEY_MAP[event.code];
      if (action) keys.current[action] = pressed;
    };
    const onKeyDown = setKey(true);
    const onKeyUp = setKey(false);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return keys;
}

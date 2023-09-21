import { useCallback, useState } from 'react';

export default function useOpenController(initialState: boolean) {
  const [isOpen, setOpenState] = useState(initialState);

  const toggle = useCallback(() => {
    setOpenState((state) => !state);
  }, []);

  return { isOpen, toggle };
}

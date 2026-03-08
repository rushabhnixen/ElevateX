import { useRef } from 'react';

export function useSocket() {
  const socketRef = useRef(null);

  const emit = (event, data) => {
    if (socketRef.current) socketRef.current.emit(event, data);
  };

  const on = (event, cb) => {
    if (socketRef.current) socketRef.current.on(event, cb);
  };

  return { socket: socketRef.current, emit, on };
}

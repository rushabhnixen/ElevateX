import { useEffect, useRef } from 'react';

export default function useSocket(url) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect when URL is provided and backend is available
    // import('socket.io-client').then(({ io }) => {
    //   socketRef.current = io(url);
    //   return () => socketRef.current?.disconnect();
    // });
  }, [url]);

  return socketRef.current;
}
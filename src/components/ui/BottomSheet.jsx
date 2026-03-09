import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function BottomSheet({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl max-h-[85dvh] overflow-y-auto"
            style={{ maxWidth: 430, margin: '0 auto' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => { if (info.offset.y > 100) onClose(); }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-600 rounded-full" />
            </div>
            {title && (
              <div className="px-4 pb-3 border-b border-white/10">
                <h2 className="text-white font-semibold text-lg">{title}</h2>
              </div>
            )}
            <div className="pb-safe">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
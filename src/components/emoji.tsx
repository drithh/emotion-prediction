import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
}

export default function ImageWithAnimation({ src, alt }: Props) {
  const [shouldAnimateEnter, setShouldAnimateEnter] = useState(false);

  const exitVariants = {
    opacity: 0,
    scale: 0.2,
  };

  const onAnimationComplete = () => {
    setShouldAnimateEnter(true);
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className="flex-[0.4] w-full h-full m-auto"
        key={src}
        initial={{ opacity: 0.5, scale: 0.8, y: 50 }}
        animate={{
          opacity: 1,
          scale: shouldAnimateEnter ? [0, 1.2, 1] : 1,
          y: shouldAnimateEnter ? [50, -20, 10, 0] : 0,
          rotate: 0,
        }}
        exit={exitVariants}
        transition={{ duration: 0.3 }}
        onAnimationComplete={onAnimationComplete}
      >
        <img src={src} alt={alt} className="m-auto" />
      </motion.div>
    </AnimatePresence>
  );
}

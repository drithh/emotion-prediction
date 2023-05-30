import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
}

export default function ImageWithAnimation({ src, alt }: Props) {
  const randomImageLoading = Math.floor(Math.random() * 2) + 1;
  const pathImageLoading =
    randomImageLoading === 1
      ? '/emoji/face-with-monocle.png'
      : '/emoji/thinking-face.png';
  console.log(src);
  const imageSrc = src === '' ? pathImageLoading : src;

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
        className="flex-[0.4] w-full h-full my-auto"
        key={src}
        initial={{ opacity: 0, scale: 0.8, y: 50, rotate: 45 }}
        animate={{
          opacity: 1,
          scale: shouldAnimateEnter ? [0, 1.2, 1] : 1,
          y: 0,
          rotate: 0,
        }}
        exit={exitVariants}
        transition={{ duration: 0.3, bounce: 0.3 }}
        onAnimationComplete={onAnimationComplete}
      >
        <img src={imageSrc} alt={alt} />
      </motion.div>
    </AnimatePresence>
  );
}

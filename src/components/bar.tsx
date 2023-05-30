import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  color: string;
  isAnimated: boolean;
  width: number;
}

export default function Bar({ color, isAnimated, width }: Props) {
  const [speed, setSpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const [percentage, setPercentage] = useState(width);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const propsInterval = Math.random() * 1000 + 500; // Mengacak interval antara 0,5 hingga 1,5 detik
    const interval = setInterval(() => {
      setIsExpanded((prevExpanded) => !prevExpanded);
      setSpeed(Math.random() * 2 + 1); // Mengacak kecepatan antara 1 hingga 3
    }, propsInterval);

    return () => clearInterval(interval);
  }, [isAnimated]);

  useEffect(() => {
    setPercentage(width);
  }, [width]);

  const getWidth = () => {
    if (!ref.current) return 0;
    const parentWidth = ref.current.parentElement?.offsetWidth ?? 1;
    return Math.round((ref.current.offsetWidth / parentWidth) * 100);
  };

  const updatePercentage = useCallback(() => {
    if (!isAnimated) setTimeout(() => setPercentage(width), 1000);
    setPercentage(getWidth());
  }, [isAnimated, width]);

  return (
    <div>
      <motion.div
        ref={ref}
        className={`rounded-2xl py-0.5 px-2 bg-${color} flex place-items-center place-content-end`}
        animate={{
          width: !isAnimated ? `${width}%` : isExpanded ? '100%' : '50px',
          transition: { duration: speed },
        }}
        onUpdate={updatePercentage}
      >
        <div className="text-white font-medium">{percentage}%</div>
      </motion.div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  textClass: string;
  barClass: string;
  isAnimated: boolean;
  width: number;
  label: string;
}

export default function Bar({
  textClass,
  barClass,
  isAnimated,
  width,
  label,
}: Props) {
  const [speed, setSpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const [percentage, setPercentage] = useState(width);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isAnimated) return;
    const propsInterval = Math.random() * 1000 + 200; // Mengacak interval antara 0,5 hingga 1,5 detik
    const interval = setInterval(() => {
      setIsExpanded((prevExpanded) => !prevExpanded);
      setSpeed(Math.random() * 2 + 1); // Mengacak kecepatan antara 1 hingga 3
    }, propsInterval);

    return () => clearInterval(interval);
  }, [isAnimated]);

  const getWidth = () => {
    if (!ref.current) return 0;
    const parentWidth = ref.current.parentElement?.offsetWidth ?? 1;
    return Math.round((ref.current.offsetWidth / parentWidth) * 100);
  };

  const updatePercentage = useCallback(() => {
    setPercentage(getWidth());
  }, []);

  const [prevWidth, setPrevWidth] = useState("");

  useEffect(() => {
    const parrentWidth = ref.current?.parentElement?.offsetWidth ?? 1;
    const currentWidth = !isAnimated
      ? `${parrentWidth * (width / 100)}px`
      : isExpanded
      ? `${parrentWidth}px`
      : "50px";
    setPrevWidth(currentWidth);
  }, [width, isAnimated, isExpanded]);

  return (
    <div className="flex flex-col ">
      <div
        className={`flex text-lg justify-between ${textClass} font-semibold`}
      >
        {label}
      </div>
      <motion.div
        ref={ref}
        className={`rounded-2xl py-0.5 px-2 ${barClass} flex place-items-center place-content-end`}
        initial={{ width: "0%" }}
        animate={{
          width: prevWidth,
          transition: { duration: speed },
        }}
        onUpdate={updatePercentage}
      >
        <div className="text-white font-medium">{percentage}%</div>
      </motion.div>
    </div>
  );
}

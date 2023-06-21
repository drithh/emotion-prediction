import { useState, useEffect } from 'react';

const DotDotDotAnimation = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots === '....' ? '' : `${prevDots}.`));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
};

export default DotDotDotAnimation;

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea(props: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const getRows = () => {
    return Math.min(props.value.split('\n').length + 1, 30); // Membatasi jumlah baris antara 1 dan 20
  };

  const getHeight = () => {
    const minHeight = 100;
    const maxHeight = 600;
    const lineHeight = 20;
    const textRows = getRows();

    return Math.min(Math.max(minHeight, textRows * lineHeight), maxHeight); // Membatasi ketinggian antara minHeight dan maxHeight
  };

  const containerVariants = {
    expanded: {
      height: 'auto',
      transition: {
        duration: 0.2,
      },
    },
    collapsed: {
      height: 200,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div
      className={`w-full min-h-[16rem] border-primary border-2 rounded-2xl p-4 border-opacity-20 opacity-100 ${
        isFocused ? 'border-opacity-40' : 'border-opacity-20'
      }`}
    >
      <motion.textarea
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        variants={containerVariants}
        initial="collapsed"
        animate={props.value ? 'expanded' : 'collapsed'}
        style={{ height: getHeight() }}
        rows={getRows()}
        className="w-full  min-h-[16rem] bg-transparent focus-visible:border-gray-500 focus-visible:outline-0 scrollbar-thin scrollbar-thumb-secondary-button scrollbar-thumb-rounded-full"
        {...props}
      ></motion.textarea>
    </div>
  );
}

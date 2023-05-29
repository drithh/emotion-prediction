import { motion } from 'framer-motion';

interface Props {
  type: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function Button(props: Props) {
  const { children, type } = props;
  return (
    <motion.button
      whileHover={{ y: -5, boxShadow: '0px 5px 10px rgba(0,0,0,0.2)' }}
      className={`w-52  text-primary font-medium text-xl rounded-lg p-3 inline-block ${
        type === 'primary' ? 'bg-primary-button' : 'bg-secondary-button'
      }`}
    >
      {children}
    </motion.button>
  );
}

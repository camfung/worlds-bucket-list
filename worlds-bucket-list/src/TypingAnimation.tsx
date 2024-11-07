import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import './TypingAnimation.css'; // Import the CSS file

const { Text } = Typography;

interface TypingAnimationProps {
  text: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);
  return (
    <Text className="retro-font">
      {currentText}
    </Text>
  );
};

export default TypingAnimation;

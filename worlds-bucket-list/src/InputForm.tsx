import React, { useState, useEffect } from 'react';
import { Input, Button, Space } from 'antd';

interface InputFormProps {
  onSubmit: (value: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check local storage on component mount
  useEffect(() => {
    const submitted = localStorage.getItem('submitted');
    if (submitted === '1') {
      setIsSubmitted(true);
    }
  }, []);

  const handleSubmit = () => {
    if (!isSubmitted && inputValue.trim()) {
      onSubmit(inputValue);
      localStorage.setItem('submitted', '1');
      setIsSubmitted(true);
    }
  };

  useEffect(() => {
    const admin = localStorage.getItem("admin")
    if (admin == "1") {
      setIsSubmitted(false)
    }
  }, []);

  return (
    <>
      {!isSubmitted && (
        <Space direction="vertical" style={{}}>

          <Space direction="horizontal" >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your text"
              disabled={isSubmitted}
            />
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              Submit
            </Button>
          </Space>
        </Space>
      )}
    </>
  );
};

export default InputForm;

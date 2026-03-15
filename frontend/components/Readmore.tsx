'use client'
import React, { useState } from 'react';

interface Props {
  text: string;
  maxLength?: number;
}

const Readmore: React.FC<Props> = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayText = isExpanded ? text : text.slice(0, maxLength) + '';

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  const toggleReadMore = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <div className="secondary_text text-sm">
      <pre className="break-words whitespace-pre-wrap">
        <code>{displayText}</code>
      </pre>
      {text.length > maxLength && (
        <button
          onClick={toggleReadMore}
          className="secondary_text hover:underline"
        >
          {isExpanded ? 'read less' : '...'}
        </button>
      )}
    </div>
  );
};

export default Readmore;

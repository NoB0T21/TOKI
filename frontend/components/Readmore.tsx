import React, { useState } from 'react';

interface Props {
  text: string;
  maxLength?: number;
}

const Readmore: React.FC<Props> = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayText = isExpanded ? text : text.slice(0, maxLength) + '...';

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  const toggleReadMore = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <div className="text-gray-200 text-sm">
      <pre className="break-words whitespace-pre-wrap">
        <code>{displayText}</code>
      </pre>
      {text.length > maxLength && (
        <button
          onClick={toggleReadMore}
          className="mt-2 text-blue-500 hover:underline"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default Readmore;

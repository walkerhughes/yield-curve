import React, { useEffect, useState } from 'react';

const StreamingText = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('/stream');
    eventSource.onmessage = function(event) {
      setText(prevText => prevText + event.data);
    };
    eventSource.onerror = function() {
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      {text}
    </div>
  );
};

export default StreamingText;


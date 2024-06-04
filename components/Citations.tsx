import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import jsonData from '../data/daily_citations.json';


const Citations: React.FC = () => {

    const [citations, setData] = useState<string | null>(null);

    useEffect(() => {
        const data = jsonData;
        const citations = jsonData.Citations.replace('.  ', '  \n  \n');
        setData(citations); 
    }, []);

    return (
        <div>
            <ReactMarkdown>{citations}</ReactMarkdown>
        </div>
    );
};

export default Citations;  
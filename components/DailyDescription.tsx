import React, { useEffect, useState } from 'react';
import jsonData from '../data/daily_description.json';


const DailyDescription: React.FC = () => {

    const [tldr, setData] = useState<string | null>(null);

    useEffect(() => {
        const data = jsonData;
        const tldr = jsonData.Description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        setData(tldr); 
    }, []);

    return (
        <div dangerouslySetInnerHTML={{ __html: tldr ? tldr.replace(/\n/g, '<br>') : 'Loading...' }} />
    );
};

export default DailyDescription;   
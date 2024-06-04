import React, { useEffect, useState } from 'react';

interface BigQueryDataProps {
    endpoint: string;
}

const BigQueryDataTLDR: React.FC<BigQueryDataProps> = ({ endpoint }) => {
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const result = await response.json();
                // Assuming result is an array of objects
                let description = result[0]?.TLDR || 'No description available';
                
                // Replace ** with <strong> tags
                description = description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                setData(description);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [endpoint]);

    if (error) {
        return <pre>Error: {error}</pre>;
    }

    return (
        <div dangerouslySetInnerHTML={{ __html: data ? data.replace(/\n/g, '<br>') : 'Loading...' }} />
    );
};

export default BigQueryDataTLDR;
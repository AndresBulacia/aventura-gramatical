import React, { useEffect, useState } from "react";

const TypeWriter = ({text, onComplete}) =>{
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            } else {
                clearInterval(interval);
                onComplete();
            }
        }, 5);

        return () => clearInterval(interval);
    }, [text, onComplete, currentIndex]);

    return <p>{displayedText}</p>;
};

export default TypeWriter;
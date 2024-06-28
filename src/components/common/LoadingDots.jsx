import React, {useEffect, useState} from "react";
import '../../styles/LevelCompletedModal.css';

const LoadingDots = () => {
    const [dotCount, setDotCounts] = useState (0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCounts((prevCount) => (prevCount + 1) % 4);
        }, 500);

        return () => clearInterval(interval);
    },[]);

    return <span className="loading-dots">{'.'.repeat(dotCount)}</span>;
};

export default LoadingDots;
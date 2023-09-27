import React, { useState, useEffect, useRef, forwardRef } from 'react';
import './timerStyle.css';

const Timer = forwardRef(({ timeAmount, onTimerClose }, ref) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Add isPaused state
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused && currentTime < timeAmount) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, currentTime, timeAmount]);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref({
          start: start,
          stop: stop,
          pause: pause, // Add pause method
          resume: resume, // Add resume method
        });
      } else {
        ref.current = {
          start: start,
          stop: stop,
          pause: pause,
          resume: resume,
        };
      }
    }
  }, [ref]);

  const formattedTime = (_currentTime) => {
    const minutes = Math.floor((_currentTime ? currentTime : timeAmount) / 60).toString().padStart(2, '0');
    const seconds = ((_currentTime ? currentTime : timeAmount) % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const start = (delay = 0) => {
    setTimeout(() => {
      setIsActive(true);
    }, delay * 1000); // Convert the delay to milliseconds
  };

  const stop = () => {
    setIsActive(false);
    setCurrentTime(0);
    clearInterval(timerRef.current);
  };

  const pause = () => {
    setIsPaused(true);
    clearInterval(timerRef.current);
  };

  const resume = () => {
    setIsPaused(false);
    // Resume the timer if it's active and not paused
    if (isActive && !isPaused && currentTime < timeAmount) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const getPercentage = () => {
    return (currentTime / timeAmount) * 100;
  };

  return (
    <div className="timer">
      <button onClick={onTimerClose}>Close</button>
      <div className="preset-time">{formattedTime(null)}</div>
      <div className="timer-display">
        <div className={`circle ${isActive ? 'active' : ''}`}>
          <svg width="100" height="100">
            <circle className="timer-circle-bg" cx="50" cy="50" r="45" />
            <circle
              className="timer-circle"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: 283,
                strokeDashoffset: (283 * (timeAmount - currentTime)) / timeAmount,
              }}
            />
          </svg>
          <div className="timer-text">{formattedTime(true)}</div>
        </div>
      </div>
    </div>
  );
});

export default Timer;

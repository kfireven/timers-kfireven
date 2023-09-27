import React, { useState, useRef } from 'react';
import './App.css';
import Timer from './components/Timer/Timer';

function App() {
  const [timers, setTimers] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Create refs for the timers
  const timerRefs = useRef({});
  const timeOptions = [10, 15, 20];

  const handleAddNewTimer = () => {
    const newTimer = {
      key: generateUniqueId(),
      timeAmount: timeOptions[Math.floor(Math.random() * 3)],
    };

    setTimers([...timers, newTimer]);
  };

  const handleTimerClose = (key) => {
    const updatedTimers = timers.filter((timer) => timer.key !== key);
    setTimers(updatedTimers);
  };

  const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = `${timestamp}${random}`;
    return uniqueId;
  };

  const handleTimerFinish = (key) => {
    handleTimerClose(key);
  };

  const handleResetAll = () => {
    // Iterate through timerRefs and stop each timer
    Object.keys(timerRefs.current).forEach((key) => {
      timerRefs.current[key].stop(); // Call the stop method on the timer's ref
    });

    handleStart();
  };

  const handleDeleteAll = () => {
    setTimers([]);
  };

  const handleStart = () => {
    setIsRunning(true);
  
    // Find the maximum timeAmount
    const maxTimeAmount = Math.max(...timers.map((timer) => timer.timeAmount));
  
    timers.forEach((timer) => {
      if (timerRefs.current[timer.key]) {
        // Calculate the delay based on the difference with the maximum timeAmount
        const delay = maxTimeAmount - timer.timeAmount;
        timerRefs.current[timer.key].start(delay);
      }
    });
  };

  const handleStop = () => {
    setIsRunning(false);

    // Iterate through timerRefs and stop each timer
    Object.keys(timerRefs.current).forEach((key) => {
      timerRefs.current[key].stop(); // Call the stop method on the timer's ref
    });
  };

  const handlePauseAll = () => {
    // Iterate through timerRefs and pause each timer
    Object.keys(timerRefs.current).forEach((key) => {
      timerRefs.current[key].pause(); // Call the pause method on the timer's ref
    });
  };

  const handleResumeAll = () => {
    // Iterate through timerRefs and resume each timer
    Object.keys(timerRefs.current).forEach((key) => {
      timerRefs.current[key].resume(); // Call the resume method on the timer's ref
    });
  };

  return (
    <div className="App">
      <div className="navbar">
        <button onClick={handleAddNewTimer}>Add New</button>
        <button onClick={handleResetAll}>Reset</button>
        <button onClick={handleDeleteAll}>Delete All</button>
        {!isRunning ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handlePauseAll}>Pause</button>
            <button onClick={handleResumeAll}>Resume</button>
          </>
        )}
      </div>
      <div className="timers-container">
        {timers.map((timer) => (
            <Timer
              timeAmount={timer.timeAmount}
              onTimerClose={() => handleTimerClose(timer.key)}
              onTimerFinish={() => handleTimerFinish(timer.key)}
              ref={(ref) => (timerRefs.current[timer.key] = ref)} // Pass the ref as a prop
            />
        ))}
      </div>
    </div>
  );
}

export default App;

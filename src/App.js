import React, { useState, useRef } from 'react';
import './App.css';
import Timer from './components/Timer/Timer';

function App() {
  const [timers, setTimers] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

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
    Object.keys(timerRefs.current).forEach((key) => {
      timerRefs.current[key].stop();
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

    Object.keys(timerRefs.current).forEach((key) => {
      timerRefs.current[key].stop();
    });
  };

  const handlePauseAll = () => {
    Object.keys(timerRefs.current).forEach((key) => {
      timerRefs.current[key].pause();
    });
  };

  const handleResumeAll = () => {
    Object.keys(timerRefs.current).forEach((key) => {
      timerRefs.current[key].resume();
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
              ref={(ref) => (timerRefs.current[timer.key] = ref)}
            />
        ))}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './clock.css'
function Clock() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [pm, setPm] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      if (h >= 12) {
        setPm(true);
        h = h - 12;
      } else {
        setPm(false);
      }

      h = h ? h : 12; // Set hour to display as 12 if 0.

      setHour(h);
      setMinute(m);
      setSecond(s);
    }, 1000);

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);

  return (
    <div className="clock">
    <div>
      <span className="time-part">
        {hour < 10 ? `0${hour}` : hour}
      </span>
      <span className='double'>:</span>
      <span className="time-part">
        {minute < 10 ? `0${minute}` : minute}
      </span>
      <span className='double'>:</span>
      <span className="time-part">
        {second < 10 ? `0${second}` : second}
      </span>
      <span className="tpart">
        {pm ? 'PM' : 'AM'}
      </span>
      <p className='quote'>“The greatest amount of wasted time is the time not getting started.”<br/> – Dawson Trotman</p>
      </div>
    </div>
  );
}

export default Clock;

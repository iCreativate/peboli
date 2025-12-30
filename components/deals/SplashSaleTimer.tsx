'use client';

import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface SplashSaleTimerProps {
  endTime: Date;
}

export function SplashSaleTimer({ endTime }: SplashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 10;

  return (
    <div className={`flex items-center gap-2 ${isUrgent ? 'text-[#FF6B4A]' : 'text-[#0B1220]'}`}>
      <Timer className="h-4 w-4" />
      <span className="text-sm font-medium">Splash Sale ends in:</span>
      <div className="flex items-center gap-1 font-mono font-bold text-lg">
        <span className="bg-[#1A1D29] text-white px-2 py-1 rounded">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span>:</span>
        <span className="bg-[#1A1D29] text-white px-2 py-1 rounded">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span>:</span>
        <span className="bg-[#1A1D29] text-white px-2 py-1 rounded">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}


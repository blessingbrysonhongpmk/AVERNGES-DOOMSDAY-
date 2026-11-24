/**
 * DOOMSDAY — useCountdown Hook
 * Calculates exact remaining time until the target release date.
 * Updates every 1000ms using native JavaScript Date.
 * Never hardcodes countdown numbers or uses fake counters.
 */

import { useState, useEffect, useMemo } from 'react';
import { CONFIG } from '../data/config.js';

export function useCountdown(targetIsoDate = CONFIG.release.targetIsoString) {
  // Parse target date timestamp
  const targetTimestamp = useMemo(() => {
    const parsed = new Date(targetIsoDate).getTime();
    if (isNaN(parsed)) {
      // Fallback safe timestamp: Dec 18, 2026 00:00:00 +05:30
      return new Date('2026-12-18T00:00:00+05:30').getTime();
    }
    return parsed;
  }, [targetIsoDate]);

  const calculateTimeRemaining = () => {
    const now = Date.now();
    const difference = targetTimestamp - now;

    if (difference <= 0) {
      return {
        total: 0,
        months: 0,
        days: 0,
        daysInMonth: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isArrived: true,
      };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    // 5-unit time division (MONTHS, DAYS, HOURS, MINUTES, SECONDS)
    const months = Math.floor(days / 30);
    const daysInMonth = days % 30;

    return {
      total: difference,
      months,
      days,
      daysInMonth,
      hours,
      minutes,
      seconds,
      isArrived: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining);

  useEffect(() => {
    // Initial sync
    setTimeLeft(calculateTimeRemaining());

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeLeft(remaining);

      if (remaining.isArrived) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp]);

  // Formatted double-digit representations
  const formatted = {
    months: String(timeLeft.months ?? 0).padStart(2, '0'),
    days: String(timeLeft.days).padStart(2, '0'),
    daysInMonth: String(timeLeft.daysInMonth ?? timeLeft.days).padStart(2, '0'),
    hours: String(timeLeft.hours).padStart(2, '0'),
    minutes: String(timeLeft.minutes).padStart(2, '0'),
    seconds: String(timeLeft.seconds).padStart(2, '0'),
  };

  return {
    ...timeLeft,
    formatted,
  };
}


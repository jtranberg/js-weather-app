// src/components/background.js

import morningImage from './images/morning.png';
import afternoonImage from './images/afternoon.png';
import eveningImage from './images/evening.png';
import nightImage from './images/night.png';

export function getBackgroundForTime() {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 8) {
    return morningImage;
  } else if (hour >= 8 && hour < 12) {
    return afternoonImage;
  } else if (hour >= 12 && hour < 18) {
    return eveningImage;
  } else {
    return nightImage;
  }
}

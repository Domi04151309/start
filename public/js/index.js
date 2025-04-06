import './service-worker-registration.js';
import { INVALID_LAYOUT } from './common.js';

const timeText = document.getElementById('time');
const messageText = document.getElementById('message');
const weatherText = document.getElementById('weather');

const mainStyle = document.documentElement.style;
const background = localStorage.getItem('background');
const textColor = localStorage.getItem('text-color');
const blur = localStorage.getItem('blur');
const font = localStorage.getItem('font');
const weather = localStorage.getItem('weather') === 'true';

let date, hour, message, minute;

/**
 * @throws {Error}
 * @returns {void}
 */
function startTime() {
  if (
    timeText === null || messageText === null
  ) throw new Error(INVALID_LAYOUT);

  date = new Date();
  hour = date.getHours();
  minute = date.getMinutes();

  if (minute < 10) minute = `0${minute.toString()}`;
  timeText.innerHTML = `${hour.toString()}:${minute.toString()}`;

  message = 'Hello';
  if (hour < 12) message = 'Good Morning';
  else if (hour < 18) message = 'Good Afternoon';
  else if (hour < 22) message = 'Good Evening';
  else if (hour < 25) message = 'Good Night';

  messageText.innerHTML = `${
    [
      message,
      localStorage.getItem('name') ?? ''
    ].filter(name => name.length > 0).join(', ')
  }.`;

  setTimeout(startTime, 60_000);
}

if (background !== null) mainStyle.setProperty(
  '--background', `url(${background})`
);

if (textColor !== null) mainStyle.setProperty('--text-color', textColor);

if (blur !== null) mainStyle.setProperty(
  '--blur', `${(Number.parseInt(blur, 10) / 100).toString()}vh`
);

if (font !== null && font.length > 0) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = `https://fonts.googleapis.com/css?family=${
    encodeURIComponent(font)
  }`;
  document.getElementsByTagName('head')[0].append(link);
  mainStyle.setProperty('--font', `"${font}"`);
}

if (weather) try {
  const request = await fetch('https://wttr.in/?T&format=%c+%t');
  const text = await request.text();
  if (weatherText !== null) weatherText.innerHTML = text;
} catch (error) {
  console.warn(error);
}

startTime();

import './service-worker-registration.js';
import { INVALID_LAYOUT } from './common.js';

const nameText = document.getElementById('nameText');
const nameInput = document.getElementById('nameInput');
const backgroundImage = document.getElementById('backgroundImage');
const backgroundFile = document.getElementById('backgroundFile');
const colorInput = document.getElementById('colorInput');
const blurInput = document.getElementById('blurInput');
const fontInput = document.getElementById('fontInput');
const weatherInput = document.getElementById('weatherInput');

/**
 * @param {string} action
 * @returns {void}
 */
function logText(action) {
  const element = document.createElement('p');
  element.innerHTML = action;
  element.classList.add('log');
  document.body.append(element);
  setTimeout(() => {
    element.remove();
  }, 3000);
}

/**
 * @throws {Error}
 * @returns {void}
 */
function setName() {
  if (
    !(nameText instanceof Node) ||
    !(nameInput instanceof HTMLInputElement)
  ) throw new Error(INVALID_LAYOUT);
  localStorage.setItem('name', nameInput.value);
  nameText.innerHTML = nameInput.value.length > 0 ? nameInput.value : 'not set';
}

/**
 * @throws {Error}
 * @returns {void}
 */
function setBackground() {
  if (
    !(backgroundFile instanceof HTMLInputElement)
  ) throw new Error(INVALID_LAYOUT);
  if (backgroundFile.files !== null && backgroundFile.files.length > 0) {
    const reader = new FileReader();
    reader.readAsDataURL(backgroundFile.files[0]);
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') throw new Error('Invalid result.');
      localStorage.setItem('background', reader.result);
      if (
        !(backgroundImage instanceof HTMLImageElement)
      ) throw new Error(INVALID_LAYOUT);
      backgroundImage.src = reader.result;
    });
    reader.addEventListener('error', error => {
      logText(`Error: ${error.toString()}`);
    });
  }
}

/**
 * @returns {Promise<void>}
 */
async function randomBackground() {
  try {
    const request = await fetch(
      'https://source.unsplash.com/featured/1920x1080/?nature'
    );
    const blob = await request.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') throw new Error('Invalid result.');
      localStorage.setItem('background', reader.result);
      if (
        !(backgroundImage instanceof HTMLImageElement)
      ) throw new Error(INVALID_LAYOUT);
      backgroundImage.src = reader.result;
    });
    reader.addEventListener('error', error => {
      logText(`Error: ${error.toString()}`);
    });
  } catch (error) {
    if (error instanceof Error) logText(`Error: ${error.toString()}`);
  }
}

/**
 * @throws {Error}
 * @returns {void}
 */
function resetBackground() {
  if (
    !(backgroundImage instanceof HTMLImageElement)
  ) throw new Error(INVALID_LAYOUT);
  localStorage.removeItem('background');
  backgroundImage.src = './images/bg.jpg';
  logText('Reset background');
}

/**
 * @throws {Error}
 * @returns {void}
 */
function setTextColor() {
  if (
    !(colorInput instanceof HTMLInputElement)
  ) throw new Error(INVALID_LAYOUT);
  localStorage.setItem('text-color', colorInput.value);
}

/**
 * @throws {Error}
 * @returns {void}
 */
function setBlur() {
  if (
    !(blurInput instanceof HTMLInputElement) ||
    !(backgroundImage instanceof Node)
  ) throw new Error(INVALID_LAYOUT);
  localStorage.setItem('blur', blurInput.value);
  backgroundImage.style.filter = `blur(${
    (Number.parseInt(blurInput.value, 10) / 100).toString()
  }vh)`;
}

/**
 * @param {string} font
 * @returns {void}
 */
function loadFont(font) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = `https://fonts.googleapis.com/css?family=${
    encodeURIComponent(font)
  }`;
  document.getElementsByTagName('head')[0].append(link);
}

/**
 * @throws {Error}
 * @returns {void}
 */
function setFont() {
  if (
    !(fontInput instanceof HTMLInputElement)
  ) throw new Error(INVALID_LAYOUT);
  localStorage.setItem('font', fontInput.value);
  loadFont(fontInput.value);
  fontInput.style.fontFamily = `"${fontInput.value}"`;
}

/**
 * @throws {Error}
 * @returns {void}
 */
function setWeather() {
  if (
    !(weatherInput instanceof HTMLInputElement)
  ) throw new Error(INVALID_LAYOUT);
  localStorage.setItem('weather', weatherInput.checked.toString());
}


const name = localStorage.getItem('name');
const background = localStorage.getItem('background');
const textColor = localStorage.getItem('text-color');
const blur = localStorage.getItem('blur');
const font = localStorage.getItem('font');
const weather = localStorage.getItem('weather') === 'true';

if (
  nameText instanceof Node &&
  nameInput instanceof HTMLInputElement &&
  name !== null &&
  name.length > 0
) {
  nameText.innerHTML = name;
  nameInput.value = name;
}
if (
  backgroundImage instanceof HTMLImageElement &&
  background !== null
) backgroundImage.src = background;
if (
  colorInput instanceof HTMLInputElement &&
  textColor !== null
) colorInput.value = textColor;
if (
  blurInput instanceof HTMLInputElement &&
  backgroundImage instanceof Node &&
  blur !== null
) {
  blurInput.value = blur;
  backgroundImage.style.filter = `blur(${
    (Number.parseInt(blur, 10) / 100).toString()
  }vh)`;
}
if (
  fontInput instanceof HTMLInputElement &&
  font !== null &&
  font.length > 0
) {
  fontInput.value = font;
  loadFont(font);
  fontInput.style.fontFamily = `"${fontInput.value}"`;
}
if (
  weatherInput instanceof HTMLInputElement
) weatherInput.checked = weather;

nameInput?.addEventListener('change', () => {
  setName();
});
backgroundFile?.addEventListener('change', () => {
  setBackground();
});
document.getElementById('randomBg')?.addEventListener('click', async () => {
  await randomBackground();
});
document.getElementById('delBg')?.addEventListener('click', () => {
  resetBackground();
});
blurInput?.addEventListener('change', () => {
  setBlur();
});
colorInput?.addEventListener('change', () => {
  setTextColor();
});
fontInput?.addEventListener('change', () => {
  setFont();
});
weatherInput?.addEventListener('change', () => {
  setWeather();
});

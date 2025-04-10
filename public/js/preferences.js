/* eslint-disable max-lines */
import './service-worker-registration.js';
import { DEFAULT_PICKS, INVALID_LAYOUT } from './common.js';

const nameText = document.getElementById('nameText');
const nameInput = document.getElementById('nameInput');
const backgroundImage = document.getElementById('backgroundImage');
const backgroundFile = document.getElementById('backgroundFile');
const colorInput = document.getElementById('colorInput');
const blurInput = document.getElementById('blurInput');
const fontInput = document.getElementById('fontInput');
const weatherInput = document.getElementById('weatherInput');
const picksInput = document.getElementById('picksInput');
const picksDataInput = document.getElementById('picksData');

/**
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
      console.warn(error);
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
      console.warn(error);
    });
  } catch (error) {
    console.warn(error);
  }
}

/**
 * @returns {void}
 */
function resetBackground() {
  if (
    !(backgroundImage instanceof HTMLImageElement)
  ) throw new Error(INVALID_LAYOUT);

  localStorage.removeItem('background');
  backgroundImage.src = './images/bg.jpg';
}

/**
 * @returns {void}
 */
function setTextColor() {
  if (
    !(colorInput instanceof HTMLInputElement)
  ) throw new Error(INVALID_LAYOUT);

  localStorage.setItem('text-color', colorInput.value);
}

/**
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
 * @returns {void}
 */
function setWeather() {
  if (
    !(weatherInput instanceof HTMLInputElement)
  ) throw new Error(INVALID_LAYOUT);

  localStorage.setItem('weather', weatherInput.checked.toString());
}

/**
 * @returns {void}
 */
function setPicks() {
  if (
    !(picksInput instanceof HTMLInputElement)
  ) throw new Error(INVALID_LAYOUT);

  localStorage.setItem('picks', picksInput.checked.toString());
}

/**
 * @returns {void}
 */
function setPicksData() {
  if (
    !(picksDataInput instanceof HTMLTextAreaElement)
  ) throw new Error(INVALID_LAYOUT);

  localStorage.setItem(
    'picksData',
    picksDataInput.value.length > 0
      ? picksDataInput.value
      : DEFAULT_PICKS
  );
}

/**
 * @param {string} string
 * @returns {string}
 */
function formatJson(string) {
  try {
    return JSON.stringify(JSON.parse(string), null, 2);
  } catch {
    return string;
  }
}

/**
 * @returns {void}
 */
function initialize() {
  const name = localStorage.getItem('name');
  const background = localStorage.getItem('background');
  const textColor = localStorage.getItem('text-color');
  const blur = localStorage.getItem('blur');
  const font = localStorage.getItem('font');
  const weather = localStorage.getItem('weather') === 'true';
  const picks = localStorage.getItem('picks') === 'true';
  const picksData = localStorage.getItem('picksData');

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

  if (
    picksInput instanceof HTMLInputElement
  ) picksInput.checked = picks;

  if (
    picksDataInput instanceof HTMLTextAreaElement
  ) picksDataInput.value = formatJson(picksData ?? DEFAULT_PICKS);
}

/**
 * @returns {void}
 */
function registerListeners() {
  nameInput?.addEventListener('change', () => {
    setName();
  });

  backgroundFile?.addEventListener('change', () => {
    setBackground();
  });

  document.getElementById('randomBackground')?.addEventListener(
    'click',
    async () => {
      await randomBackground();
    }
  );

  document.getElementById('resetBackground')?.addEventListener('click', () => {
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

  picksInput?.addEventListener('change', () => {
    setPicks();
  });

  picksDataInput?.addEventListener('change', () => {
    setPicksData();
  });
}

initialize();
registerListeners();
/* eslint-enable max-lines */

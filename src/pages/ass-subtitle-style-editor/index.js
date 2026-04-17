'use strict';

// 元素ID
const ELEMENT_ID = {
  ParseInput: 'parse-input',
  SettingContainer: 'setting-container',
  Screen: 'screen',
  Subtitle: 'subtitle',
};

// 初始化页面
function init() {
  const parseInputElement = document.getElementById(ELEMENT_ID.ParseInput);
  parseInputElement.addEventListener('blur', onParseInputTriggered);
  parseInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onParseInputTriggered(event);
    }
  });

  setTimeout(() => {
    const value = `[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,微软雅黑,24,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,1,2,5,5,5,134
Style: Eng,微软雅黑,16,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,1,2,5,5,5,134`;
parseInputElement.value = value;
    onParseInputTriggered({ target: parseInputElement });
  }, 100);
}
document.addEventListener('DOMContentLoaded', init);


function onParseInputTriggered(event) {
  const value = event.target.value;
  const { formats, styles } = parser(value);
  const settingContainerElement = document.getElementById(ELEMENT_ID.SettingContainer);
  settingContainerElement.style.display = 'block';
  settingContainerElement.innerHTML = '';
  for (const styleName in styles) {
    const lineStyles = styles[styleName];
    const settingRowElement = document.createElement('form');
    settingRowElement.id = `form-${styleName}`;
    settingRowElement.classList.add('setting-row');
    lineStyles.forEach((styleValue, index) => {
      if (index === 0) {
        return;
      }
      const formatName = formats[index];
      const formatId = formatName.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).substring(1);
      const settingItemElement = document.createElement('div');
      settingItemElement.classList.add('setting-item');
      const templateFormatElement = document.getElementById(`template-${formatId}`);
      const itemElement = templateFormatElement.content.cloneNode(true);
      const itemId = `${formatId}-${styleName}`;
      const labelElement = itemElement.querySelector('label');
      labelElement.htmlFor = itemId;
      const inputElement = itemElement.querySelector(`#${formatId}`);
      inputElement.id = itemId;
      inputElement.value = styleValue.startsWith('&H') ? '#' + styleValue.substring(4) : styleValue;
      settingItemElement.appendChild(itemElement);
      settingRowElement.appendChild(settingItemElement);
    });
    settingContainerElement.appendChild(settingRowElement);
  }
  const screenElement = document.getElementById(ELEMENT_ID.Screen);
  screenElement.style.display = 'block';
  event.target.style.display = 'none';
}


function parser(value) {
  const lines = value.trim().split('\n');
  const formats = [];
  const styles = {};
  lines.forEach((line) => {
    const lineValue = line.replace(/.+:/, '').trim();
    const lineStyles = [];
    lineValue.split(',').forEach((item) => {
      if (line.startsWith('Format:')) {
        formats.push(item.trim());
      } else if (line.startsWith('Style:')) {
        lineStyles.push(item.trim());
      }
    });
    if (lineStyles.length > 0) {
      styles[lineStyles[0]] = lineStyles;
    }
  });
  console.log(formats);
  console.log(styles);
  return { formats, styles };
}


function getStyleData() {
  const settingContainerElement = document.getElementById(ELEMENT_ID.SettingContainer);
  const forms = settingContainerElement.querySelectorAll('form');
  const styles = {};
  forms.forEach((form) => {
    const styleName = form.id.substring(5);
    const formData = new FormData(form);
    styles[styleName] = {};
    formData.forEach((value, key) => {
      styles[styleName][key] = value;
    });
  });
  return styles;
}


function renderSubtitleStyle(styles) {
  const subtitleElement = document.getElementById(ELEMENT_ID.Subtitle);
  subtitleElement.style.visibility = 'visible';
  subtitleElement.style.fontFamily = styles.Default['fontname'];
  subtitleElement.style.fontSize = styles.Default['font-size'] + 'px';
  subtitleElement.style.color = styles.Default['primary-colour'];
  subtitleElement.style.position = 'absolute';
  const marginL = styles.Default['margin-l'];
  const marginR = styles.Default['margin-r'];
  const marginV = styles.Default['margin-v'];
  switch (styles.Default['alignment']) {
    case '1':
      subtitleElement.style.left = marginL + 'px';
      subtitleElement.style.bottom = marginV + 'px';
      break;

    case '2':
      subtitleElement.style.left = '50%';
      subtitleElement.style.transform = 'translateX(-50%)';
      subtitleElement.style.bottom = marginV + 'px';
      break;

    case '3':
      subtitleElement.style.right = marginR + 'px';
      subtitleElement.style.bottom = marginV + 'px';
      break;

    case '4':
      subtitleElement.style.left = '0';
      subtitleElement.style.top = '50%';
      subtitleElement.style.transform = 'translateY(-50%)';
      break;

    case '5':
      subtitleElement.style.left = '50%';
      subtitleElement.style.top = '50%';
      subtitleElement.style.transform = 'translate(-50%, -50%)';
      break;

    case '6':
      subtitleElement.style.right = '0';
      subtitleElement.style.top = '50%';
      subtitleElement.style.transform = 'translateY(-50%)';
      break;

    case '7':
      subtitleElement.style.right = marginL + 'px';
      subtitleElement.style.top = marginV + 'px';
      break;

    case '8':
      subtitleElement.style.left = '50%';
      subtitleElement.style.transform = 'translateX(-50%)';
      subtitleElement.style.top = marginV + 'px';
      break;

    case '9':
      subtitleElement.style.right = marginR + 'px';
      subtitleElement.style.top = marginV + 'px';
      break;

    default:
      subtitleElement.style.textAlign = 'left';
      break;
  }
}


function onGetDataClick() {
  const styles = getStyleData();
  console.log(styles);
  renderSubtitleStyle(styles);
}
window.onGetDataClick = onGetDataClick;

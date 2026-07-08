'use strict';

// 元素ID
const ELEMENT_ID = {
  ParseInput: 'parse-input',
  SettingContainer: 'setting-container',
  Screen: 'screen'
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
Style: Default,微软雅黑,24,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,1,2,5,5,20,134
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


function renderSubtitleStyle(styleName, style) {
  const screenElement = document.getElementById(ELEMENT_ID.Screen);
  const subtitleElement = document.createElement('span');
  subtitleElement.textContent = styleName + ' ' + style['fontname'];
  subtitleElement.id = `subtitle-${styleName}`;
  subtitleElement.style.visibility = 'visible';
  subtitleElement.style.fontFamily = style['fontname'];
  subtitleElement.style.fontSize = style['fontsize'] + 'px';
  subtitleElement.style.color = style['primary-colour'];
  subtitleElement.style.position = 'absolute';
  const marginL = style['margin-l'];
  const marginR = style['margin-r'];
  const marginV = style['margin-v'];
  switch (style['alignment']) {
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
  screenElement.appendChild(subtitleElement);
}

// // 辅助函数：将 ASS 颜色（&HAABBGGRR 或 &HBBGGRR）转换为 CSS 颜色值（#RRGGBB）
// function assColorToCss(colorStr) {
//   if (!colorStr || typeof colorStr !== 'string') return '#FFFFFF';
//   // 去掉 &H 前缀，转为大写
//   let hex = colorStr.replace(/^&H/i, '').toUpperCase();
//   // 若长度为 8，去掉前两位（透明度），保留后 6 位
//   if (hex.length === 8) hex = hex.slice(2);
//   // 若长度为 6，则按 BBGGRR 顺序反转每两位
//   if (hex.length === 6) {
//     const bb = hex.slice(0, 2);
//     const gg = hex.slice(2, 4);
//     const rr = hex.slice(4, 6);
//     return `#${rr}${gg}${bb}`;
//   }
//   // 否则返回白色
//   return '#FFFFFF';
// }

// // 完善后的字幕样式渲染函数
// function renderSubtitleStyle(styleName, style) {
//   const screenElement = document.getElementById(ELEMENT_ID.Screen);
//   const subtitleElement = document.createElement('span');
//   subtitleElement.textContent = styleName + ' ' + style['fontname'];
//   subtitleElement.id = `subtitle-${styleName}`;
//   subtitleElement.style.visibility = 'visible';
//   subtitleElement.style.fontFamily = style['fontname'];
//   subtitleElement.style.fontSize = style['fontsize'] + 'px';
//   subtitleElement.style.position = 'absolute';
  
//   // --- 文字颜色 ---
//   subtitleElement.style.color = assColorToCss(style['primary-colour']);

//   // --- 粗体、斜体、下划线、删除线 ---
//   if (parseInt(style['bold'], 10) === 1) {
//     subtitleElement.style.fontWeight = 'bold';
//   }
//   if (parseInt(style['italic'], 10) === 1) {
//     subtitleElement.style.fontStyle = 'italic';
//   }
//   let textDecoration = '';
//   if (parseInt(style['underline'], 10) === 1) textDecoration += ' underline';
//   if (parseInt(style['strikeout'], 10) === 1) textDecoration += ' line-through';
//   if (textDecoration) {
//     subtitleElement.style.textDecoration = textDecoration.trim();
//   }

//   // --- 字符间距 ---
//   const spacing = parseInt(style['spacing'], 10);
//   if (!isNaN(spacing)) {
//     subtitleElement.style.letterSpacing = spacing + 'px';
//   }

//   // --- 位置（基于对齐方式）---
//   // 先清空可能已有的 transform，后续统一构建
//   let transformParts = [];
//   const marginL = parseInt(style['margin-l'], 10) || 0;
//   const marginR = parseInt(style['margin-r'], 10) || 0;
//   const marginV = parseInt(style['margin-v'], 10) || 0;

//   // 根据 Alignment 设置 left/right/top/bottom 和基础位移
//   switch (style['alignment']) {
//     case '1': // 左下
//       subtitleElement.style.left = marginL + 'px';
//       subtitleElement.style.bottom = marginV + 'px';
//       break;
//     case '2': // 下中
//       subtitleElement.style.left = '50%';
//       transformParts.push('translateX(-50%)');
//       subtitleElement.style.bottom = marginV + 'px';
//       break;
//     case '3': // 右下
//       subtitleElement.style.right = marginR + 'px';
//       subtitleElement.style.bottom = marginV + 'px';
//       break;
//     case '4': // 中左
//       subtitleElement.style.left = marginL + 'px';
//       subtitleElement.style.top = '50%';
//       transformParts.push('translateY(-50%)');
//       break;
//     case '5': // 正中
//       subtitleElement.style.left = '50%';
//       subtitleElement.style.top = '50%';
//       transformParts.push('translate(-50%, -50%)');
//       break;
//     case '6': // 中右
//       subtitleElement.style.right = marginR + 'px';
//       subtitleElement.style.top = '50%';
//       transformParts.push('translateY(-50%)');
//       break;
//     case '7': // 左上（修正：left 使用 marginL，top 使用 marginV）
//       subtitleElement.style.left = marginL + 'px';
//       subtitleElement.style.top = marginV + 'px';
//       break;
//     case '8': // 上中
//       subtitleElement.style.left = '50%';
//       transformParts.push('translateX(-50%)');
//       subtitleElement.style.top = marginV + 'px';
//       break;
//     case '9': // 右上
//       subtitleElement.style.right = marginR + 'px';
//       subtitleElement.style.top = marginV + 'px';
//       break;
//     default:
//       subtitleElement.style.left = '0';
//       subtitleElement.style.top = '0';
//       break;
//   }

//   // --- 缩放（ScaleX, ScaleY）和旋转（Angle）---
//   const scaleX = parseFloat(style['scale-x']) / 100 || 1;
//   const scaleY = parseFloat(style['scale-y']) / 100 || 1;
//   const angle = parseFloat(style['angle']) || 0; // 单位：度

//   if (scaleX !== 1 || scaleY !== 1) {
//     transformParts.push(`scale(${scaleX}, ${scaleY})`);
//   }
//   if (angle !== 0) {
//     transformParts.push(`rotate(${angle}deg)`);
//   }

//   if (transformParts.length > 0) {
//     subtitleElement.style.transform = transformParts.join(' ');
//   }

//   // --- 边框样式（BorderStyle）、轮廓（Outline）和阴影（Shadow）---
//   const borderStyle = parseInt(style['border-style'], 10) || 1;
//   const outline = parseInt(style['outline'], 10) || 0;
//   const shadow = parseInt(style['shadow'], 10) || 0;
//   const outlineColor = assColorToCss(style['outline-colour']);
//   const backColor = assColorToCss(style['back-colour']);

//   let textShadows = [];

//   if (borderStyle === 1) {
//     // 带边框和阴影
//     // 轮廓：使用多个方向偏移模拟描边
//     if (outline > 0) {
//       const offsets = [];
//       // 八个方向（包括对角线），偏移量为 outline 像素
//       for (let dx = -1; dx <= 1; dx++) {
//         for (let dy = -1; dy <= 1; dy++) {
//           if (dx === 0 && dy === 0) continue;
//           offsets.push(`${dx * outline}px ${dy * outline}px 0 ${outlineColor}`);
//         }
//       }
//       textShadows = textShadows.concat(offsets);
//     }
//     // 阴影：单个偏移（右下），使用 BackColour
//     if (shadow > 0) {
//       textShadows.push(`${shadow}px ${shadow}px 0 ${backColor}`);
//     }
//   } else if (borderStyle === 3) {
//     // 背景框（不透明背景），使用 BackColour 作为背景，并加内边距
//     // 此处简单处理：直接设置背景色，并添加适当内边距
//     subtitleElement.style.backgroundColor = backColor;
//     subtitleElement.style.padding = '2px 4px'; // 可调节
//     // 若需要边框，也可添加 border
//   }

//   if (textShadows.length > 0) {
//     subtitleElement.style.textShadow = textShadows.join(', ');
//   }

//   // 将字幕元素添加到屏幕
//   screenElement.appendChild(subtitleElement);
// }


function onGetDataClick() {
  const screenElement = document.getElementById(ELEMENT_ID.Screen);
  screenElement.innerHTML = '';
  const styles = getStyleData();
  for (const styleName in styles) {
    const style = styles[styleName];
    renderSubtitleStyle(styleName, style);
  }
}
window.onGetDataClick = onGetDataClick;

'use strict';

// 状态管理
let state = {
  gridSize: 16,
  currentColor: '#000000',
  isEraser: false,
  isDrawing: false,
  cells: []
};

// DOM元素引用
let gridContainer = null;
let colorPicker = null;
let btnClear = null;
let btnEraser = null;
let gridSizeSelect = null;

// 初始化页面
function init() {
  // 获取DOM元素
  gridContainer = document.getElementById('grid-container');
  colorPicker = document.getElementById('color-picker');
  btnClear = document.getElementById('btn-clear');
  btnEraser = document.getElementById('btn-eraser');
  gridSizeSelect = document.getElementById('grid-size');

  // 初始化画布
  initCanvas();

  // 绑定事件
  bindEvents();
}

// 初始化画布
function initCanvas() {
  const totalCells = state.gridSize * state.gridSize;
  state.cells = Array.from({ length: totalCells }, () => ({
    color: '#ffffff'
  }));
  
  // 渲染网格
  renderGrid();
}

// 渲染网格
function renderGrid() {
  gridContainer.style.gridTemplateColumns = `repeat(${state.gridSize}, 1fr)`;
  gridContainer.innerHTML = '';
  
  state.cells.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.className = 'pixel-canvas__cell';
    cellElement.style.backgroundColor = cell.color;
    cellElement.dataset.index = index;
    
    gridContainer.appendChild(cellElement);
  });
}

// 绑定事件
function bindEvents() {
  // 颜色选择器
  colorPicker.addEventListener('input', (event) => {
    state.currentColor = event.target.value;
  });

  // 清空按钮
  btnClear.addEventListener('click', clearCanvas);

  // 橡皮擦按钮
  btnEraser.addEventListener('click', toggleEraser);

  // 网格大小选择
  gridSizeSelect.addEventListener('change', (event) => {
    state.gridSize = parseInt(event.target.value, 10);
    initCanvas();
  });

  // 网格鼠标事件委托
  gridContainer.addEventListener('mousedown', handleMouseDown);
  gridContainer.addEventListener('mouseenter', handleMouseEnter);
  gridContainer.addEventListener('mouseleave', stopDrawing);

  // 全局鼠标松开事件
  document.addEventListener('mouseup', stopDrawing);
}

// 鼠标按下处理
function handleMouseDown(event) {
  const cell = event.target.closest('.pixel-canvas__cell');
  if (!cell) return;
  
  state.isDrawing = true;
  const index = parseInt(cell.dataset.index, 10);
  drawCell(index);
}

// 鼠标进入处理
function handleMouseEnter(event) {
  const cell = event.target.closest('.pixel-canvas__cell');
  if (!cell || !state.isDrawing) return;
  
  const index = parseInt(cell.dataset.index, 10);
  drawCell(index);
}

// 绘制单元格
function drawCell(index) {
  const fillColor = state.isEraser ? '#ffffff' : state.currentColor;
  state.cells[index].color = fillColor;
  
  // 更新DOM
  const cellElement = gridContainer.children[index];
  if (cellElement) {
    cellElement.style.backgroundColor = fillColor;
  }
}

// 停止绘制
function stopDrawing() {
  state.isDrawing = false;
}

// 清空画布
function clearCanvas() {
  initCanvas();
}

// 切换橡皮擦
function toggleEraser() {
  state.isEraser = !state.isEraser;
  btnEraser.classList.toggle('active', state.isEraser);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

// 单元测试导出模块
/* istanbul ignore next */
if (__JEST__ && typeof module !== 'undefined') {
  module.exports = {
    init,
    initCanvas,
    renderGrid,
    drawCell,
    stopDrawing,
    clearCanvas,
    toggleEraser,
    state
  };
}
'use strict';

// 状态管理
const state = {
  gridSize: 16,
  currentColor: '#000000',
  isEraser: false,
  isDrawing: false,
  cells: []
};

let canvas = null;
let ctx = null;

let colorPicker = null;
let btnClear = null;
let btnEraser = null;
let gridSizeSelect = null;

const CANVAS_SIZE = 640;

function init() {
  canvas = document.getElementById('pixel-canvas');
  ctx = canvas.getContext('2d');

  colorPicker = document.getElementById('color-picker');
  btnClear = document.getElementById('btn-clear');
  btnEraser = document.getElementById('btn-eraser');
  gridSizeSelect = document.getElementById('grid-size');

  // 不让canvas做抗锯齿
  ctx.imageSmoothingEnabled = false;

  initCanvas();

  bindEvents();
}

function initCanvas() {
  state.cells = Array.from(
    { length: state.gridSize * state.gridSize },
    () => '#ffffff'
  );

  renderCanvas();
}

function renderCanvas() {
  const cellSize = CANVAS_SIZE / state.gridSize;

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  for (let y = 0; y < state.gridSize; y++) {
    for (let x = 0; x < state.gridSize; x++) {
      const index = y * state.gridSize + x;

      // 填充颜色
      ctx.fillStyle = state.cells[index];
      ctx.fillRect(
        x * cellSize,
        y * cellSize,
        cellSize,
        cellSize
      );

      // 网格线
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        x * cellSize,
        y * cellSize,
        cellSize,
        cellSize
      );
    }
  }
}

function bindEvents() {
  colorPicker.addEventListener('input', (e) => {
    state.currentColor = e.target.value;
  });

  btnClear.addEventListener('click', clearCanvas);

  btnEraser.addEventListener('click', toggleEraser);

  gridSizeSelect.addEventListener('change', (e) => {
    state.gridSize = Number(e.target.value);
    initCanvas();
  });

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);

  document.addEventListener('mouseup', stopDrawing);
}

function onMouseDown(e) {
  state.isDrawing = true;
  drawByEvent(e);
}

function onMouseMove(e) {
  if (!state.isDrawing) return;

  drawByEvent(e);
}

function stopDrawing() {
  state.isDrawing = false;
}

function drawByEvent(e) {
  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const cellSize = CANVAS_SIZE / state.gridSize;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (
    row < 0 ||
    row >= state.gridSize ||
    col < 0 ||
    col >= state.gridSize
  ) {
    return;
  }

  const index = row * state.gridSize + col;

  drawCell(index);
}

function drawCell(index) {
  const color = state.isEraser
    ? '#ffffff'
    : state.currentColor;

  if (state.cells[index] === color) {
    return;
  }

  state.cells[index] = color;

  const cellSize = CANVAS_SIZE / state.gridSize;

  const x = index % state.gridSize;
  const y = Math.floor(index / state.gridSize);

  ctx.fillStyle = color;

  ctx.fillRect(
    x * cellSize,
    y * cellSize,
    cellSize,
    cellSize
  );

  ctx.strokeStyle = '#ddd';
  ctx.strokeRect(
    x * cellSize,
    y * cellSize,
    cellSize,
    cellSize
  );
}

function clearCanvas() {
  initCanvas();
}

function toggleEraser() {
  state.isEraser = !state.isEraser;
  btnEraser.classList.toggle('active', state.isEraser);
}

window.addEventListener('DOMContentLoaded', init);
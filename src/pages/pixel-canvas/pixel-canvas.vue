<template>
  <div class="pixel-canvas">
    <div class="pixel-canvas__header">
      <h2>像素画板</h2>
      <div class="pixel-canvas__controls">
        <input type="color" v-model="currentColor" class="pixel-canvas__color">
        <button @click="clearCanvas" class="pixel-canvas__btn">清空</button>
        <button @click="toggleEraser" class="pixel-canvas__btn" :class="{ active: isEraser }">橡皮擦</button>
        <select v-model="gridSize" class="pixel-canvas__select">
          <option :value="8">8x8</option>
          <option :value="16">16x16</option>
          <option :value="24">24x24</option>
          <option :value="32">32x32</option>
        </select>
      </div>
    </div>
    <div 
      class="pixel-canvas__grid" 
      :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }"
      @mouseleave="stopDrawing"
    >
      <div 
        v-for="(cell, index) in cells" 
        :key="index"
        class="pixel-canvas__cell"
        :style="{ backgroundColor: cell.color }"
        @mousedown="startDrawing(index)"
        @mouseenter="drawCell(index)"
        @dragstart.prevent
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PixelCanvas',
  data() {
    return {
      gridSize: 16,
      currentColor: '#000000',
      isEraser: false,
      isDrawing: false,
      cells: [],
    };
  },
  mounted() {
    this.initCanvas();
    document.addEventListener('mouseup', this.stopDrawing);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.stopDrawing);
  },
  watch: {
    gridSize() {
      this.initCanvas();
    },
  },
  methods: {
    initCanvas() {
      const totalCells = this.gridSize * this.gridSize;
      this.cells = Array.from({ length: totalCells }, () => ({
        color: '#ffffff',
      }));
    },
    startDrawing(index) {
      this.isDrawing = true;
      this.drawCell(index);
    },
    drawCell(index) {
      if (!this.isDrawing) return;
      const fillColor = this.isEraser ? '#ffffff' : this.currentColor;
      // Vue 3 中直接修改属性即可触发响应式更新
      this.cells[index].color = fillColor;
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    clearCanvas() {
      this.initCanvas();
    },
    toggleEraser() {
      this.isEraser = !this.isEraser;
    },
  },
};
</script>

<style scoped>
.pixel-canvas {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.pixel-canvas__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pixel-canvas__header h2 {
  font-size: 24px;
  color: #333;
}

.pixel-canvas__controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pixel-canvas__color {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.pixel-canvas__btn {
  padding: 8px 16px;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: white;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s;
}
.pixel-canvas__btn:hover {
  background: #667eea;
  color: white;
}
.pixel-canvas__btn.active {
  background: #f56c6c;
  border-color: #f56c6c;
  color: white;
}

.pixel-canvas__select {
  padding: 8px 12px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.pixel-canvas__grid {
  display: grid;
  gap: 1px;
  background: #e4e7ed;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pixel-canvas__cell {
  aspect-ratio: 1;
  cursor: crosshair;
  transition: transform 0.1s;
}
.pixel-canvas__cell:hover {
  transform: scale(1.1);
}
</style>
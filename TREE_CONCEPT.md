# 🌳 历史之树 - 真正的树形可视化

## 💡 核心概念

### 历史之树的含义

```
不是普通图表，而是一棵真正的大树：
- 主干 = 历史的主脉络
- 分支 = 历史的不同流向/领域
- 树枝 = 具体的历史阶段
- 树叶 = 历史事件/人物
- 根系 = 历史的起源/基础

视觉特点：
- 漂浮在空中
- 3D立体感
- 自然生长的形态
- 有机的分支结构
```

---

## 🎨 可视化设计

### 1. 树的结构

```
层次结构：
Level 0: 树根 (历史起源)
  └─ 人类文明起源

Level 1: 主干 (主要历史阶段)
  ├─ 远古时代
  ├─ 古代文明
  ├─ 中世纪
  ├─ 近代
  └─ 现代

Level 2: 大分支 (历史领域)
  ├─ 政治
  ├─ 经济
  ├─ 文化
  ├─ 科技
  └─ 军事

Level 3: 小分支 (具体历史)
  └─ 各个历史事件/人物

Level 4: 树叶 (细节)
  └─ 事件的具体内容
```

### 2. 视觉元素

```
主干：
- 粗壮的圆柱体
- 渐变颜色（从深到浅）
- 纹理（年轮效果）

分支：
- 自然弯曲的形态
- 粗细变化
- 分叉角度自然

树叶：
- 各种形状（根据类型）
- 颜色编码（根据分类）
- 大小（根据重要性）
- 悬挂动画（漂浮感）

整体效果：
- 漂浮在空中
- 光影效果
- 粒子效果（历史尘埃）
- 动态生长动画
```

---

## 🛠️ 技术实现

### 方案1: Three.js 3D树

```javascript
class HistoryTree3D {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.tree = null;
    
    this.init();
  }
  
  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    // 创建树
    this.createTree();
    
    // 添加灯光
    this.addLights();
    
    // 添加控制
    this.addControls();
    
    // 动画循环
    this.animate();
  }
  
  createTree() {
    // 主干
    const trunkGeometry = new THREE.CylinderGeometry(
      2,  // 顶部半径
      3,  // 底部半径
      20, // 高度
      32  // 分段数
    );
    
    const trunkMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B4513,
      shininess: 10
    });
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 10;
    this.scene.add(trunk);
    
    // 递归创建分支
    this.createBranches(trunk, 3, 0);
  }
  
  createBranches(parent, level, angle) {
    if (level > 4) return;
    
    const numBranches = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numBranches; i++) {
      const branchAngle = (i / numBranches) * Math.PI * 2;
      const tiltAngle = Math.PI / 4 + Math.random() * Math.PI / 6;
      
      const length = 5 / level;
      const radius = 0.5 / level;
      
      const geometry = new THREE.CylinderGeometry(
        radius * 0.5,
        radius,
        length,
        16
      );
      
      const material = new THREE.MeshPhongMaterial({
        color: this.getBranchColor(level),
        shininess: 20
      });
      
      const branch = new THREE.Mesh(geometry, material);
      
      // 设置位置和旋转
      branch.position.y = parent.geometry.parameters.height / 2;
      branch.rotation.z = tiltAngle;
      branch.rotation.y = branchAngle;
      
      parent.add(branch);
      
      // 递归创建子分支
      this.createBranches(branch, level + 1, branchAngle);
      
      // 添加树叶
      if (level >= 3) {
        this.addLeaves(branch);
      }
    }
  }
  
  addLeaves(branch) {
    // 创建树叶（历史事件）
    const leafGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const leafMaterial = new THREE.MeshPhongMaterial({
      color: 0x228B22,
      transparent: true,
      opacity: 0.8
    });
    
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.y = branch.geometry.parameters.height / 2 + 0.3;
    branch.add(leaf);
    
    // 添加悬浮动画
    leaf.userData.floatOffset = Math.random() * Math.PI * 2;
    leaf.userData.floatSpeed = 0.5 + Math.random() * 0.5;
  }
  
  getBranchColor(level) {
    const colors = [
      0x8B4513, // 深棕
      0xA0522D, // 棕色
      0xCD853F, // 秘鲁色
      0xDEB887, // 实木色
      0xF5DEB3  // 小麦色
    ];
    return colors[level] || colors[colors.length - 1];
  }
  
  addLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    // 主光源
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 20, 10);
    this.scene.add(mainLight);
    
    // 补光
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.5);
    fillLight.position.set(-10, 10, -10);
    this.scene.add(fillLight);
  }
  
  addControls() {
    // 轨道控制
    const controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 100;
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // 树叶漂浮动画
    this.scene.traverse((object) => {
      if (object.userData.floatOffset !== undefined) {
        const time = Date.now() * 0.001;
        object.position.y += Math.sin(
          time * object.userData.floatSpeed + object.userData.floatOffset
        ) * 0.01;
      }
    });
    
    this.renderer.render(this.scene, this.camera);
  }
}
```

---

### 方案2: Canvas 2D + WebGL 树

```javascript
class HistoryTreeCanvas {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.tree = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 100,
      trunkHeight: 300,
      branches: []
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.generateTree();
    this.render();
    this.animate();
  }
  
  generateTree() {
    // 使用L-System生成树形结构
    const rules = {
      'F': 'FF',
      'X': 'F[+X]F[-X]+X'
    };
    
    let axiom = 'X';
    for (let i = 0; i < 5; i++) {
      axiom = this.applyRules(axiom, rules);
    }
    
    this.interpret(axiom);
  }
  
  applyRules(str, rules) {
    return str.split('').map(c => rules[c] || c).join('');
  }
  
  interpret(str) {
    const stack = [];
    let current = {
      x: this.tree.x,
      y: this.tree.y,
      angle: -Math.PI / 2,
      length: 100,
      width: 20,
      depth: 0
    };
    
    for (let char of str) {
      switch (char) {
        case 'F':
          // 画线
          const end = this.forward(current);
          this.tree.branches.push({
            start: { x: current.x, y: current.y },
            end: end,
            width: current.width,
            depth: current.depth
          });
          current.x = end.x;
          current.y = end.y;
          break;
          
        case '+':
          current.angle += Math.PI / 6;
          break;
          
        case '-':
          current.angle -= Math.PI / 6;
          break;
          
        case '[':
          stack.push({ ...current });
          current.length *= 0.7;
          current.width *= 0.7;
          current.depth++;
          break;
          
        case ']':
          current = stack.pop();
          break;
      }
    }
  }
  
  forward(state) {
    return {
      x: state.x + Math.cos(state.angle) * state.length,
      y: state.y + Math.sin(state.angle) * state.length
    };
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制背景
    this.drawBackground();
    
    // 绘制树
    this.drawTree();
    
    // 绘制树叶
    this.drawLeaves();
  }
  
  drawBackground() {
    const gradient = this.ctx.createLinearGradient(
      0, 0, 0, this.canvas.height
    );
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  drawTree() {
    this.tree.branches.forEach(branch => {
      this.ctx.beginPath();
      this.ctx.moveTo(branch.start.x, branch.start.y);
      this.ctx.lineTo(branch.end.x, branch.end.y);
      
      // 根据深度设置颜色
      const alpha = 1 - branch.depth * 0.1;
      this.ctx.strokeStyle = `rgba(139, 69, 19, ${alpha})`;
      this.ctx.lineWidth = branch.width;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();
    });
  }
  
  drawLeaves() {
    // 在分支末端绘制树叶
    this.tree.branches
      .filter(b => b.depth >= 4)
      .forEach(branch => {
        this.drawLeaf(branch.end.x, branch.end.y);
      });
  }
  
  drawLeaf(x, y) {
    const time = Date.now() * 0.001;
    const floatY = y + Math.sin(time + x) * 3;
    
    this.ctx.beginPath();
    this.ctx.arc(x, floatY, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(34, 139, 34, 0.8)';
    this.ctx.fill();
  }
  
  animate() {
    requestAnimationFrame(() => {
      this.render();
      this.animate();
    });
  }
}
```

---

## 🌳 数据映射

### 将历史数据映射到树结构

```javascript
{
  // 树根
  root: {
    id: 'civilization_origin',
    name: '人类文明起源',
    type: 'root',
    children: [
      // 主干（历史阶段）
      {
        id: 'ancient_period',
        name: '古代',
        type: 'trunk',
        level: 0,
        children: [
          // 大分支（领域）
          {
            id: 'politics_branch',
            name: '政治',
            type: 'branch',
            level: 1,
            children: [
              // 小分支（具体历史）
              {
                id: 'qin_dynasty',
                name: '秦朝',
                type: 'sub_branch',
                level: 2,
                children: [
                  // 树叶（事件/人物）
                  {
                    id: 'qin_unification',
                    name: '秦统一六国',
                    type: 'leaf',
                    level: 3,
                    year: -221,
                    description: '...',
                    // AI发现的关联
                    connections: [...]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## 🎯 交互设计

### 1. 导航

```
鼠标操作：
- 左键拖拽：旋转树
- 右键拖拽：平移
- 滚轮：缩放
- 点击树叶：查看详情
- 双击分支：展开/收起

触摸操作：
- 单指拖动：旋转
- 双指捏合：缩放
- 双指拖动：平移
- 点击：查看详情
```

### 2. 视觉效果

```
动态效果：
- 树叶轻微摆动
- 光影变化
- 粒子飘落（历史尘埃）
- 生长动画（展开分支）

高亮效果：
- 鼠标悬停：发光
- 选中：高亮路径
- 关联：连接线
```

---

## 🚀 开发优先级

### Phase 1: 基础树形 (本周)
```
✅ 3D树形结构
✅ 基础交互
✅ 数据映射
```

### Phase 2: 视觉增强 (下周)
```
⏳ 光影效果
⏳ 粒子系统
⏳ 动画效果
```

### Phase 3: 功能完善 (下下周)
```
⏳ AI关联可视化
⏳ 搜索功能
⏳ 筛选功能
```

---

**核心理念**:
历史之树是一棵真正的大树，展示历史的流动和分支。

**视觉目标**:
像一棵漂浮在空中的生命之树，充满生机和历史感。

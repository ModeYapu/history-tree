/**
 * 历史之树 - 3D树形可视化核心
 * 真正的漂浮大树
 */

class HistoryTree3D {
    constructor(app) {
        this.app = app;
        this.container = null;
        
        // Three.js核心
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // 树结构
        this.treeGroup = null;
        this.leaves = [];
        this.connections = [];
        
        // 配置
        this.config = {
            tree: {
                trunkHeight: 30,
                trunkRadius: { top: 2, bottom: 3 },
                branchLevels: 5,
                leafSize: 0.5
            },
            camera: {
                fov: 60,
                near: 0.1,
                far: 1000,
                position: { x: 0, y: 20, z: 50 }
            },
            animation: {
                leafFloat: true,
                growAnimation: true,
                particleEffect: true
            }
        };
        
        // 交互
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedLeaf = null;
    }
    
    /**
     * 显示视图
     */
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'history-tree-3d';
        this.container.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        `;
        
        document.querySelector(this.app.options.container).appendChild(this.container);
        
        this.init();
        this.loadTreeData();
        this.createTree();
        this.addEventListeners();
        this.animate();
        
        this.app.eventBus.emit('view:ready', { view: 'tree3d' });
    }
    
    /**
     * 初始化Three.js
     */
    init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // 场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);
        
        // 相机
        this.camera = new THREE.PerspectiveCamera(
            this.config.camera.fov,
            width / height,
            this.config.camera.near,
            this.config.camera.far
        );
        this.camera.position.set(
            this.config.camera.position.x,
            this.config.camera.position.y,
            this.config.camera.position.z
        );
        
        // 渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // 控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 150;
        this.controls.maxPolarAngle = Math.PI * 0.9;
        
        // 灯光
        this.setupLights();
        
        // 树组
        this.treeGroup = new THREE.Group();
        this.scene.add(this.treeGroup);
    }
    
    /**
     * 设置灯光
     */
    setupLights() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // 主光源（模拟阳光）
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(20, 40, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 100;
        sunLight.shadow.camera.left = -30;
        sunLight.shadow.camera.right = 30;
        sunLight.shadow.camera.top = 30;
        sunLight.shadow.camera.bottom = -30;
        this.scene.add(sunLight);
        
        // 补光
        const fillLight = new THREE.DirectionalLight(0x6699ff, 0.4);
        fillLight.position.set(-20, 20, -20);
        this.scene.add(fillLight);
        
        // 底光（增加立体感）
        const bottomLight = new THREE.DirectionalLight(0x9966ff, 0.2);
        bottomLight.position.set(0, -20, 0);
        this.scene.add(bottomLight);
    }
    
    /**
     * 加载树数据
     */
    loadTreeData() {
        // 从数据服务加载历史数据
        const rootData = this.app.dataService.getNode('root');
        if (rootData) {
            this.treeData = rootData;
        } else {
            // 使用示例数据
            this.treeData = this.createSampleTree();
        }
    }
    
    /**
     * 创建示例树
     */
    createSampleTree() {
        return {
            name: '人类文明',
            level: 0,
            children: [
                {
                    name: '古代',
                    level: 1,
                    children: [
                        {
                            name: '政治',
                            level: 2,
                            children: [
                                { name: '秦统一六国', level: 3, year: -221 },
                                { name: '罗马帝国建立', level: 3, year: -27 }
                            ]
                        },
                        {
                            name: '文化',
                            level: 2,
                            children: [
                                { name: '百家争鸣', level: 3, year: -500 },
                                { name: '希腊哲学', level: 3, year: -400 }
                            ]
                        }
                    ]
                },
                {
                    name: '中世纪',
                    level: 1,
                    children: [
                        {
                            name: '宗教',
                            level: 2,
                            children: [
                                { name: '佛教传播', level: 3, year: 500 },
                                { name: '基督教扩张', level: 3, year: 600 }
                            ]
                        }
                    ]
                },
                {
                    name: '近代',
                    level: 1,
                    children: [
                        {
                            name: '科技',
                            level: 2,
                            children: [
                                { name: '工业革命', level: 3, year: 1760 },
                                { name: '启蒙运动', level: 3, year: 1700 }
                            ]
                        }
                    ]
                },
                {
                    name: '现代',
                    level: 1,
                    children: [
                        {
                            name: '信息',
                            level: 2,
                            children: [
                                { name: '互联网诞生', level: 3, year: 1969 },
                                { name: 'AI革命', level: 3, year: 2020 }
                            ]
                        }
                    ]
                }
            ]
        };
    }
    
    /**
     * 创建树
     */
    createTree() {
        // 创建主干
        this.createTrunk();
        
        // 递归创建分支
        this.createBranches(this.treeData, this.treeGroup, 0);
        
        // 添加地面
        this.addGround();
        
        // 添加粒子效果
        if (this.config.animation.particleEffect) {
            this.addParticles();
        }
    }
    
    /**
     * 创建主干
     */
    createTrunk() {
        const { trunkHeight, trunkRadius } = this.config.tree;
        
        // 主干几何体
        const geometry = new THREE.CylinderGeometry(
            trunkRadius.top,
            trunkRadius.bottom,
            trunkHeight,
            32
        );
        
        // 树皮材质
        const material = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            shininess: 10,
            bumpScale: 0.5
        });
        
        const trunk = new THREE.Mesh(geometry, material);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        
        this.treeGroup.add(trunk);
    }
    
    /**
     * 递归创建分支
     */
    createBranches(node, parent, depth) {
        if (!node.children || depth > this.config.tree.branchLevels) {
            return;
        }
        
        const numChildren = node.children.length;
        const angleStep = (Math.PI * 2) / numChildren;
        
        node.children.forEach((child, index) => {
            // 创建分支
            const branch = this.createBranch(child, depth, index, numChildren);
            parent.add(branch);
            
            // 递归创建子分支
            this.createBranches(child, branch, depth + 1);
        });
    }
    
    /**
     * 创建单个分支
     */
    createBranch(node, depth, index, total) {
        const branchLength = 8 / (depth + 1);
        const branchRadius = 1 / (depth + 1);
        
        // 分支几何体
        const geometry = new THREE.CylinderGeometry(
            branchRadius * 0.5,
            branchRadius,
            branchLength,
            16
        );
        
        // 根据深度选择颜色
        const colors = [0x8B4513, 0xA0522D, 0xCD853F, 0xDEB887, 0xF5DEB3];
        const material = new THREE.MeshPhongMaterial({
            color: colors[depth] || colors[colors.length - 1],
            shininess: 20
        });
        
        const branch = new THREE.Mesh(geometry, material);
        
        // 设置分支位置和角度
        const angle = (index / total) * Math.PI * 2;
        const tilt = Math.PI / 4 + (depth * 0.1);
        
        branch.rotation.z = tilt;
        branch.rotation.y = angle;
        branch.position.y = this.config.tree.trunkHeight - depth * 3;
        branch.castShadow = true;
        
        // 如果是叶子节点，添加树叶
        if (!node.children || node.children.length === 0) {
            this.addLeaf(branch, node);
        }
        
        // 添加标签
        this.addLabel(branch, node.name);
        
        return branch;
    }
    
    /**
     * 添加树叶
     */
    addLeaf(branch, node) {
        const { leafSize } = this.config.tree;
        
        // 根据类型创建不同形状的树叶
        let geometry;
        const nodeType = node.type || 'event';
        
        switch (nodeType) {
            case 'person':
                geometry = new THREE.SphereGeometry(leafSize, 16, 16);
                break;
            case 'event':
                geometry = new THREE.BoxGeometry(leafSize * 1.5, leafSize, leafSize);
                break;
            default:
                geometry = new THREE.OctahedronGeometry(leafSize);
        }
        
        // 根据分类选择颜色
        const categoryColors = {
            politics: 0xff6b6b,
            technology: 0x4ecdc4,
            culture: 0xa855f7,
            economy: 0x22c55e,
            military: 0xf97316
        };
        
        const color = categoryColors[node.category] || 0x228B22;
        
        const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
            shininess: 30
        });
        
        const leaf = new THREE.Mesh(geometry, material);
        leaf.position.y = branch.geometry.parameters.height / 2 + leafSize;
        leaf.castShadow = true;
        
        // 添加悬浮动画数据
        leaf.userData = {
            node: node,
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: 0.5 + Math.random() * 0.5,
            originalY: leaf.position.y
        };
        
        branch.add(leaf);
        this.leaves.push(leaf);
    }
    
    /**
     * 添加标签
     */
    addLabel(branch, text) {
        // 使用Sprite显示文字标签
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 8);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.y = branch.geometry.parameters.height / 2 + 2;
        sprite.scale.set(4, 1, 1);
        
        branch.add(sprite);
    }
    
    /**
     * 添加地面
     */
    addGround() {
        const geometry = new THREE.PlaneGeometry(200, 200);
        const material = new THREE.MeshPhongMaterial({
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.5
        });
        
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        
        this.scene.add(ground);
    }
    
    /**
     * 添加粒子效果
     */
    addParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    /**
     * 添加事件监听
     */
    addEventListeners() {
        // 鼠标移动
        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.checkIntersection();
        });
        
        // 点击
        this.container.addEventListener('click', (event) => {
            if (this.selectedLeaf) {
                this.onLeafClick(this.selectedLeaf);
            }
        });
        
        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }
    
    /**
     * 检查鼠标交叉
     */
    checkIntersection() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.leaves);
        
        if (intersects.length > 0) {
            if (this.selectedLeaf !== intersects[0].object) {
                if (this.selectedLeaf) {
                    this.selectedLeaf.material.emissive.setHex(0x000000);
                }
                
                this.selectedLeaf = intersects[0].object;
                this.selectedLeaf.material.emissive.setHex(0x444444);
                
                this.container.style.cursor = 'pointer';
            }
        } else {
            if (this.selectedLeaf) {
                this.selectedLeaf.material.emissive.setHex(0x000000);
                this.selectedLeaf = null;
            }
            
            this.container.style.cursor = 'default';
        }
    }
    
    /**
     * 树叶点击
     */
    onLeafClick(leaf) {
        const node = leaf.userData.node;
        this.app.eventBus.emit('node:select', node);
        
        // 触发AI关联发现
        if (this.app.aiEngine) {
            this.app.aiEngine.discoverConnections(node.id).then(connections => {
                this.visualizeConnections(connections);
            });
        }
    }
    
    /**
     * 可视化关联
     */
    visualizeConnections(connections) {
        // 清除旧的连接线
        this.connections.forEach(conn => this.scene.remove(conn));
        this.connections = [];
        
        // 创建新的连接线
        connections.forEach(conn => {
            const line = this.createConnectionLine(conn);
            this.scene.add(line);
            this.connections.push(line);
        });
    }
    
    /**
     * 创建连接线
     */
    createConnectionLine(connection) {
        // 创建曲线连接两个节点
        const points = [];
        // ... 实现曲线连接
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: this.getConnectionColor(connection.type),
            linewidth: 2,
            transparent: true,
            opacity: 0.6
        });
        
        return new THREE.Line(geometry, material);
    }
    
    /**
     * 获取连接颜色
     */
    getConnectionColor(type) {
        const colors = {
            cause: 0x22c55e,
            effect: 0x3b82f6,
            cross_time: 0xf59e0b
        };
        return colors[type] || 0xffffff;
    }
    
    /**
     * 动画循环
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 更新控制器
        this.controls.update();
        
        // 树叶漂浮动画
        if (this.config.animation.leafFloat) {
            const time = Date.now() * 0.001;
            
            this.leaves.forEach(leaf => {
                const { floatOffset, floatSpeed, originalY } = leaf.userData;
                leaf.position.y = originalY + Math.sin(time * floatSpeed + floatOffset) * 0.2;
            });
        }
        
        // 粒子动画
        if (this.particles) {
            this.particles.rotation.y += 0.0002;
        }
        
        // 渲染
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * 窗口大小改变
     */
    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    /**
     * 隐藏视图
     */
    hide() {
        if (this.container) {
            this.container.remove();
        }
    }
    
    /**
     * 销毁
     */
    destroy() {
        this.hide();
        
        // 清理Three.js资源
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        this.app.eventBus.emit('view:destroy', { view: 'tree3d' });
    }
}

// 导出到全局
window.HistoryTree3D = HistoryTree3D;

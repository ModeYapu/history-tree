/**
 * 3D 知识星球 - Three.js 实现
 * 知识点分布在球面上，形成知识星座
 * 支持拖拽旋转、点击查看详情、自动自转
 */
class KnowledgePlanet {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.sphere = null;
        this.knowledgePoints = [];
        this.connections = [];
        this.starField = null;
        this.animationId = null;
        this.detailPanel = null;
        this.hoveredPoint = null;
        this.autoRotateSpeed = 0.001;

        this.categoryColors = {
            politics: 0xff6b6b,
            technology: 0x4ecdc4,
            culture: 0xa855f7,
            economy: 0x22c55e,
            military: 0xf97316,
            default: 0xD4A853
        };

        this.config = {
            sphereRadius: 5,
            pointSize: 0.12,
            connectionOpacity: 0.3,
            bgColor: 0x0a0810
        };
    }

    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'knowledge-planet-view';
        this.container.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            background: #0a0810;
            overflow: hidden;
        `;

        document.querySelector(this.app.options.container).appendChild(this.container);

        this.initThree();
        this.createStarField();
        this.createSphere();
        this.loadKnowledgeData();
        this.createUI();
        this.animate();

        window.addEventListener('resize', () => this.onResize());
        this.app.eventBus.emit('view:ready', { view: 'knowledgePlanet' });
    }

    hide() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer) this.renderer.dispose();
        if (this.container) this.container.remove();
        if (this.detailPanel && this.detailPanel.parentNode) {
            this.detailPanel.remove();
        }
        window.removeEventListener('resize', this.onResize);
    }

    initThree() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;

        // 场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.config.bgColor);
        this.scene.fog = new THREE.FogExp2(this.config.bgColor, 0.02);

        // 相机
        this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
        this.camera.position.set(0, 2, 12);

        // 渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // 控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 7;
        this.controls.maxDistance = 25;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.3;

        // 环境光 + 点光源
        this.scene.add(new THREE.AmbientLight(0x333344, 0.5));
        const pointLight = new THREE.PointLight(0xD4A853, 1.5, 50);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);

        // 鼠标交互
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
    }

    /** 创建星空背景粒子 */
    createStarField() {
        const count = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const r = 40 + Math.random() * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const brightness = 0.3 + Math.random() * 0.7;
            // 金色/白色随机
            if (Math.random() > 0.7) {
                colors[i * 3] = 0.83 * brightness;
                colors[i * 3 + 1] = 0.66 * brightness;
                colors[i * 3 + 2] = 0.33 * brightness;
            } else {
                colors[i * 3] = brightness;
                colors[i * 3 + 1] = brightness;
                colors[i * 3 + 2] = brightness;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.starField = new THREE.Points(geometry, material);
        this.scene.add(this.starField);
    }

    /** 创建透明球体 */
    createSphere() {
        const geometry = new THREE.SphereGeometry(this.config.sphereRadius, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0xD4A853,
            transparent: true,
            opacity: 0.04,
            wireframe: false,
            side: THREE.DoubleSide
        });
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);

        // 球面网格线
        const wireGeometry = new THREE.SphereGeometry(this.config.sphereRadius + 0.01, 24, 24);
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0xD4A853,
            wireframe: true,
            transparent: true,
            opacity: 0.06
        });
        const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
        this.scene.add(wireframe);
    }

    /** 加载知识数据到球面上 */
    loadKnowledgeData() {
        const nodes = Array.from(this.app.dataService.nodes.values());
        const R = this.config.sphereRadius + 0.1;
        const categoryGroups = {};

        nodes.forEach((node, i) => {
            // 斐波那契球面分布
            const phi = Math.acos(1 - 2 * (i + 0.5) / nodes.length);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

            const x = R * Math.sin(phi) * Math.cos(theta);
            const y = R * Math.sin(phi) * Math.sin(theta);
            const z = R * Math.cos(phi);

            const cat = node.category?.primary || 'default';
            const color = this.categoryColors[cat] || this.categoryColors.default;
            const importance = node.metadata?.importance || 2;
            const size = this.config.pointSize * (0.6 + importance * 0.2);

            // 创建知识点球体
            const geometry = new THREE.SphereGeometry(size, 12, 12);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.9
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.userData = { node, category: cat };

            this.scene.add(mesh);
            this.knowledgePoints.push(mesh);

            // 光晕效果（重要节点）
            if (importance >= 4) {
                const glowGeometry = new THREE.SphereGeometry(size * 2.5, 12, 12);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.15
                });
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                glow.position.copy(mesh.position);
                this.scene.add(glow);
                mesh.userData.glow = glow;
            }

            // 按类别分组用于连线
            if (!categoryGroups[cat]) categoryGroups[cat] = [];
            categoryGroups[cat].push(mesh);
        });

        // 同类别连线（知识星座）
        Object.entries(categoryGroups).forEach(([cat, meshes]) => {
            const color = new THREE.Color(this.categoryColors[cat] || this.categoryColors.default);
            // 连接相近的点
            for (let i = 0; i < meshes.length; i++) {
                const nearest = this.findNearest(meshes[i], meshes, Math.min(3, meshes.length));
                nearest.forEach(n => {
                    if (n !== meshes[i]) {
                        this.createConnection(meshes[i].position, n.position, color);
                    }
                });
            }
        });
    }

    /** 找最近的几个点 */
    findNearest(point, all, count) {
        return all
            .filter(p => p !== point)
            .sort((a, b) => point.position.distanceTo(a.position) - point.position.distanceTo(b.position))
            .slice(0, count);
    }

    /** 创建连线 */
    createConnection(start, end, color) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: this.config.connectionOpacity
        });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.connections.push(line);
    }

    /** 创建 UI 叠加层 */
    createUI() {
        // 标题
        const title = document.createElement('div');
        title.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Noto Serif SC', serif;
            font-size: 24px;
            font-weight: 700;
            color: #D4A853;
            text-shadow: 0 0 20px rgba(212, 168, 83, 0.5);
            z-index: 10;
            pointer-events: none;
        `;
        title.textContent = '✦ 知识星球 ✦';
        this.container.appendChild(title);

        // 图例
        const legend = document.createElement('div');
        legend.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(10, 8, 16, 0.85);
            border: 1px solid rgba(212, 168, 83, 0.3);
            border-radius: 8px;
            padding: 12px 16px;
            z-index: 10;
            backdrop-filter: blur(10px);
        `;

        const legendTitle = document.createElement('div');
        legendTitle.style.cssText = 'color: #D4A853; font-weight: 600; margin-bottom: 8px; font-size: 13px;';
        legendTitle.textContent = '知识领域';
        legend.appendChild(legendTitle);

        const catNames = { politics: '政治', technology: '科技', culture: '文化', economy: '经济', military: '军事' };
        Object.entries(catNames).forEach(([key, name]) => {
            const hex = '#' + this.categoryColors[key].toString(16).padStart(6, '0');
            const item = document.createElement('div');
            item.style.cssText = 'display: flex; align-items: center; gap: 6px; margin: 4px 0; font-size: 12px; color: #c9a96e;';
            item.innerHTML = `<span style="width:10px;height:10px;border-radius:50%;background:${hex};display:inline-block;"></span>${name}`;
            legend.appendChild(item);
        });

        this.container.appendChild(legend);

        // 提示
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: absolute;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: rgba(201, 169, 110, 0.5);
            z-index: 10;
            pointer-events: none;
        `;
        hint.textContent = '拖拽旋转 · 滚轮缩放 · 点击知识点查看详情';
        this.container.appendChild(hint);

        // 详情面板
        this.detailPanel = document.createElement('div');
        this.detailPanel.style.cssText = `
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 320px;
            background: rgba(10, 8, 16, 0.92);
            border: 1px solid rgba(212, 168, 83, 0.4);
            border-radius: 12px;
            padding: 20px;
            z-index: 20;
            backdrop-filter: blur(15px);
            display: none;
            color: #fff5e0;
            font-family: 'Noto Serif SC', serif;
            box-shadow: 0 0 30px rgba(212, 168, 83, 0.15);
        `;
        this.container.appendChild(this.detailPanel);
    }

    showDetail(node) {
        const hex = '#' + (this.categoryColors[node.category?.primary] || this.categoryColors.default).toString(16).padStart(6, '0');
        const catName = { politics: '政治', technology: '科技', culture: '文化', economy: '经济', military: '军事' }[node.category?.primary] || '其他';
        const year = node.time?.year || node.year;
        const yearStr = year ? (year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`) : '';

        this.detailPanel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="margin:0;font-size:18px;color:#D4A853;">${node.name}</h3>
                <button onclick="this.closest('div').style.display='none'" style="background:none;border:none;color:#c9a96e;font-size:18px;cursor:pointer;">✕</button>
            </div>
            ${yearStr ? `<div style="font-size:13px;color:#c9a96e;margin-bottom:8px;">📅 ${yearStr}</div>` : ''}
            ${node.location?.name ? `<div style="font-size:13px;color:#c9a96e;margin-bottom:8px;">📍 ${node.location.name}</div>` : ''}
            <p style="margin:8px 0 12px;font-size:14px;line-height:1.6;color:#f0d68a;">${node.summary || node.description || '暂无描述'}</p>
            <div style="display:flex;gap:8px;">
                <span style="padding:3px 10px;background:${hex}25;border:1px solid ${hex}50;border-radius:12px;font-size:11px;color:${hex};">${catName}</span>
            </div>
        `;
        this.detailPanel.style.display = 'block';
    }

    onMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.knowledgePoints);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            this.renderer.domElement.style.cursor = 'pointer';
            if (this.hoveredPoint !== obj) {
                // 恢复之前hover的点
                if (this.hoveredPoint) {
                    this.hoveredPoint.material.emissiveIntensity = 0.3;
                    this.hoveredPoint.scale.set(1, 1, 1);
                }
                this.hoveredPoint = obj;
                obj.material.emissiveIntensity = 0.8;
                obj.scale.set(1.5, 1.5, 1.5);
            }
        } else {
            this.renderer.domElement.style.cursor = 'grab';
            if (this.hoveredPoint) {
                this.hoveredPoint.material.emissiveIntensity = 0.3;
                this.hoveredPoint.scale.set(1, 1, 1);
                this.hoveredPoint = null;
            }
        }
    }

    onClick(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.knowledgePoints);

        if (intersects.length > 0) {
            const node = intersects[0].object.userData.node;
            if (node) {
                this.showDetail(node);
                this.app.eventBus.emit('node:select', node);
                // 音效
                if (window.audioManager) window.audioManager.playClick();
            }
        }
    }

    onResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // 星空缓慢旋转
        if (this.starField) {
            this.starField.rotation.y += 0.00005;
        }

        // 知识点呼吸效果
        const time = Date.now() * 0.001;
        this.knowledgePoints.forEach((p, i) => {
            if (p !== this.hoveredPoint) {
                const breath = 1 + Math.sin(time * 0.8 + i * 0.5) * 0.05;
                p.scale.set(breath, breath, breath);
            }
        });

        // 连线脉冲
        this.connections.forEach((line, i) => {
            line.material.opacity = this.config.connectionOpacity * (0.5 + Math.sin(time + i * 0.3) * 0.5);
        });

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        this.hide();
        this.app.eventBus.emit('view:destroy', { view: 'knowledgePlanet' });
    }
}

window.KnowledgePlanet = KnowledgePlanet;

/**
 * 历史之树 - 3D树形可视化 v6.0
 * 灵动自然的有机大树
 */

class HistoryTree3D {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.treeGroup = null;
        this.trunkMesh = null;
        this.branchMeshes = [];
        this.leaves = [];
        this.connections = [];
        this.floatingSprites = [];
        this.fireflies = [];
        this.particles = null;
        
        this.wind = {
            strength: 0.3, gustStrength: 0, gustTimer: 0,
            direction: new THREE.Vector3(1, 0, 0.3).normalize(), time: 0
        };
        
        this.config = {
            tree: {
                height: 32,
                trunkRadiusBottom: 3.2,
                trunkRadiusTop: 1.2,
                branchLevels: 4,
                leafSize: 0.55
            },
            camera: { fov: 55, near: 0.1, far: 1000, position: { x: 0, y: 22, z: 55 } }
        };
    }
    
    show(options = {}) {
        this.container = document.createElement('div');
        this.container.className = 'history-tree-3d';
        this.container.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden;';
        document.querySelector(this.app.options.container).appendChild(this.container);
        this.initThree();
        this.loadTreeData();
        this.buildTree();
        this.addEventListeners();
        this.animate();
        this.app.eventBus.emit('view:ready', { view: 'tree3d' });
    }
    
    initThree() {
        const w = this.container.clientWidth, h = this.container.clientHeight;
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1410);
        this.scene.fog = new THREE.FogExp2(0x1a1410, 0.005);
        
        this.camera = new THREE.PerspectiveCamera(this.config.camera.fov, w / h, 0.1, 1000);
        this.camera.position.set(0, 22, 55);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        this.container.appendChild(this.renderer.domElement);
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 15;
        this.controls.maxDistance = 120;
        this.controls.maxPolarAngle = Math.PI * 0.9;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.15;
        
        // 灯光
        this.scene.add(new THREE.AmbientLight(0x4A3A2A, 0.8));
        const sun = new THREE.DirectionalLight(0xFFF5E1, 1.2);
        sun.position.set(20, 40, 20);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 100;
        sun.shadow.camera.left = -35; sun.shadow.camera.right = 35;
        sun.shadow.camera.top = 35; sun.shadow.camera.bottom = -35;
        this.scene.add(sun);
        this.scene.add(new THREE.DirectionalLight(0xD4A853, 0.4).translateX(-20).translateY(20).translateZ(-20));
        this.scene.add(new THREE.PointLight(0xD4A853, 0.6, 50).translateY(35));
        
        this.treeGroup = new THREE.Group();
        this.scene.add(this.treeGroup);
    }
    
    loadTreeData() {
        const root = this.app.dataService.getNode('root');
        if (root && root.children && root.children.length > 0) {
            this.treeData = {
                name: root.name || '历史之树', level: 0,
                children: root.children.map(p => ({
                    name: p.name, level: 1,
                    children: (p.children || []).map(c => ({
                        name: c.name, level: 2,
                        children: (c.children || []).map(n => ({
                            name: n.name, level: 3,
                            type: n.type || 'event', category: n.category?.primary || 'culture',
                            year: n.time?.year, period: n.time?.period,
                            description: n.description, importance: n.metadata?.importance || 3, id: n.id
                        }))
                    }))
                }))
            };
        } else {
            this.treeData = {
                name: '人类文明', level: 0,
                children: [
                    { name: '古代', level: 1, children: [
                        { name: '政治', level: 2, children: [
                            { name: '秦统一六国', level: 3, type: 'event', category: 'politics', year: -221 },
                            { name: '罗马帝国', level: 3, type: 'event', category: 'politics', year: -27 }
                        ]},
                        { name: '文化', level: 2, children: [
                            { name: '百家争鸣', level: 3, type: 'event', category: 'culture', year: -500 }
                        ]}
                    ]},
                    { name: '中世纪', level: 1, children: [
                        { name: '宗教', level: 2, children: [
                            { name: '佛教传播', level: 3, type: 'event', category: 'culture', year: 500 }
                        ]}
                    ]},
                    { name: '近代', level: 1, children: [
                        { name: '科技', level: 2, children: [
                            { name: '工业革命', level: 3, type: 'event', category: 'technology', year: 1760 }
                        ]}
                    ]},
                    { name: '现代', level: 1, children: [
                        { name: '信息', level: 2, children: [
                            { name: '互联网诞生', level: 3, type: 'event', category: 'technology', year: 1969 }
                        ]}
                    ]}
                ]
            };
        }
    }
    
    // ===================== 树的构建 =====================
    
    buildTree() {
        const H = this.config.tree.height;
        const Rb = this.config.tree.trunkRadiusBottom;
        const Rt = this.config.tree.trunkRadiusTop;
        
        // 1) 主干 - 粗细渐变的有机管道
        const trunkCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.4, H * 0.15, 0.2),
            new THREE.Vector3(-0.3, H * 0.35, -0.2),
            new THREE.Vector3(0.2, H * 0.55, 0.15),
            new THREE.Vector3(-0.15, H * 0.78, -0.08),
            new THREE.Vector3(0.08, H, 0)
        ]);
        
        this.trunkMesh = this.createTaperedTube(trunkCurve, Rb, Rt, 0x5C3A1E, 0.9);
        this.treeGroup.add(this.trunkMesh);
        
        // 树皮纹理
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2 + Math.random() * 0.4;
            const pts = [0.08, 0.3, 0.55].map(t => {
                const p = trunkCurve.getPointAt(t);
                const r = THREE.MathUtils.lerp(Rb, Rt, t) * 0.85;
                return new THREE.Vector3(p.x + Math.cos(a) * r, p.y, p.z + Math.sin(a) * r);
            });
            this.treeGroup.add(this.createTube(pts, 0.12, 0x4A2E15));
        }
        
        // 主干顶端装饰 - 自然收尾
        const topP = trunkCurve.getPointAt(1);
        const topJoint = new THREE.Mesh(
            new THREE.SphereGeometry(Rt * 1.5, 10, 10),
            new THREE.MeshStandardMaterial({ color: 0x5C3A1E, roughness: 0.9 })
        );
        topJoint.position.copy(topP);
        topJoint.castShadow = true;
        this.treeGroup.add(topJoint);
        
        // 2) 根系
        this.addRoots(Rb);
        
        // 3) 分支（逐层构建，确保连接无缝）
        if (this.treeData.children) {
            const level1Count = this.treeData.children.length;
            this.treeData.children.forEach((periodNode, i) => {
                const t = 0.25 + (i / level1Count) * 0.55;
                const cp = trunkCurve.getPointAt(t);
                const cr = THREE.MathUtils.lerp(Rb, Rt, t);
                
                const baseAngle = (i / level1Count) * Math.PI * 2 + Math.random() * 0.3;
                const tilt = Math.PI / 4 + Math.random() * 0.15;
                
                const start = new THREE.Vector3(
                    cp.x + Math.cos(baseAngle) * cr,
                    cp.y,
                    cp.z + Math.sin(baseAngle) * cr
                );
                
                // 主干连接处的球关节
                this.addJoint(start, cr * 0.5, 0x5C3A1E);
                
                const L1 = 10 + Math.random() * 4;
                const end1 = new THREE.Vector3(
                    start.x + Math.cos(baseAngle) * Math.sin(tilt) * L1,
                    start.y + Math.cos(tilt) * L1 + 2,
                    start.z + Math.sin(baseAngle) * Math.sin(tilt) * L1
                );
                
                this.treeGroup.add(this.createBranchTube(start, end1, 0.9, 0.5, 0x6B4226));
                // 末端球关节
                this.addJoint(end1, 0.55, 0x6B4226);
                
                this.addLabel(periodNode.name, end1.x, end1.y, end1.z, 5);
                
                // 二级分支
                if (periodNode.children) {
                    periodNode.children.forEach((catNode, j) => {
                        const subAngle = baseAngle + (j - periodNode.children.length / 2) * 0.6 + Math.random() * 0.3;
                        const subTilt = Math.PI / 3.5 + Math.random() * 0.2;
                        const L2 = 6 + Math.random() * 3;
                        
                        const start2 = end1.clone(); // 精确复用末端坐标
                        const end2 = new THREE.Vector3(
                            start2.x + Math.cos(subAngle) * Math.sin(subTilt) * L2,
                            start2.y + Math.cos(subTilt) * L2 + 1,
                            start2.z + Math.sin(subAngle) * Math.sin(subTilt) * L2
                        );
                        
                        this.treeGroup.add(this.createBranchTube(start2, end2, 0.55, 0.25, 0x8B5E3C));
                        this.addJoint(end2, 0.3, 0x8B5E3C);
                        
                        this.addLabel(catNode.name, end2.x, end2.y, end2.z, 4);
                        
                        // 三级：叶子节点
                        if (catNode.children) {
                            catNode.children.forEach((leafNode, k) => {
                                const leafAngle = subAngle + (k - catNode.children.length / 2) * 0.5 + Math.random() * 0.4;
                                const leafTilt = Math.PI / 3 + Math.random() * 0.3;
                                const L3 = 3 + Math.random() * 2;
                                
                                const start3 = end2.clone(); // 精确复用
                                const end3 = new THREE.Vector3(
                                    start3.x + Math.cos(leafAngle) * Math.sin(leafTilt) * L3,
                                    start3.y + Math.cos(leafTilt) * L3 + 0.5,
                                    start3.z + Math.sin(leafAngle) * Math.sin(leafTilt) * L3
                                );
                                
                                this.treeGroup.add(this.createBranchTube(start3, end3, 0.28, 0.08, 0xA07050));
                                
                                // 叶簇
                                this.addLeafCluster(leafNode, end3);
                                this.addLabel(leafNode.name, end3.x, end3.y + 1.2, end3.z, 3.5);
                            });
                        }
                    });
                }
            });
        }
        
        // 4) 地面
        this.addGround();
        
        // 5) 粒子和萤火虫
        this.addParticles();
        this.addFireflies();
    }
    
    // ===================== 几何工具 =====================
    
    /** 创建粗细渐变的管道（主干用） */
    createTaperedTube(curve, radiusBottom, radiusTop, color, roughness) {
        const segs = 32, radSegs = 12;
        const pts = curve.getPoints(segs);
        const verts = [], norms = [], idxs = [], uvArr = [];
        
        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const p = curve.getPointAt(t);
            const tang = curve.getTangentAt(t).normalize();
            const r = THREE.MathUtils.lerp(radiusBottom, radiusTop, t) * (1 + Math.sin(t * 14) * 0.03);
            
            const up = new THREE.Vector3(0, 1, 0);
            if (Math.abs(tang.dot(up)) > 0.99) up.set(1, 0, 0);
            const n = new THREE.Vector3().crossVectors(tang, up).normalize();
            const b = new THREE.Vector3().crossVectors(tang, n).normalize();
            
            for (let j = 0; j <= radSegs; j++) {
                const a = (j / radSegs) * Math.PI * 2;
                const bump = 1 + Math.sin(a * 3 + t * 10) * 0.04;
                const rr = r * bump;
                verts.push(p.x + (n.x * Math.cos(a) + b.x * Math.sin(a)) * rr);
                verts.push(p.y + (n.y * Math.cos(a) + b.y * Math.sin(a)) * rr);
                verts.push(p.z + (n.z * Math.cos(a) + b.z * Math.sin(a)) * rr);
                norms.push(Math.cos(a), 0, Math.sin(a));
                uvArr.push(j / radSegs, t);
            }
        }
        
        for (let i = 0; i < segs; i++) for (let j = 0; j < radSegs; j++) {
            const a = i * (radSegs + 1) + j, b2 = a + radSegs + 1;
            idxs.push(a, b2, a + 1, a + 1, b2, b2 + 1);
        }
        
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvArr, 2));
        geo.setIndex(idxs);
        geo.computeVertexNormals();
        
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 }));
        mesh.castShadow = true; mesh.receiveShadow = true;
        mesh.userData = { swayPhase: Math.random() * Math.PI * 2 };
        return mesh;
    }
    
    /** 在连接处添加球形关节，覆盖断口 */
    addJoint(pos, radius, color) {
        const geo = new THREE.SphereGeometry(radius * 1.3, 10, 10);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0 });
        const sphere = new THREE.Mesh(geo, mat);
        sphere.position.copy(pos);
        sphere.castShadow = true;
        this.treeGroup.add(sphere);
    }
    
    /** 创建从 start 到 end 的弯曲管道（分支用） */
    createBranchTube(start, end, radiusStart, radiusEnd, color) {
        const dir = end.clone().sub(start);
        const len = dir.length();
        if (len < 0.1) return new THREE.Object3D(); // 太短就跳过
        
        const mid = start.clone().add(dir.clone().multiplyScalar(0.5));
        mid.x += (Math.random() - 0.5) * 1.2;
        mid.y += Math.random() * 0.6;
        mid.z += (Math.random() - 0.5) * 1.2;
        
        const curve = new THREE.CatmullRomCurve3([
            start.clone(),
            new THREE.Vector3(start.x + (mid.x - start.x) * 0.35, start.y + (mid.y - start.y) * 0.35, start.z + (mid.z - start.z) * 0.35),
            mid,
            end.clone()
        ]);
        
        // 用分段构建粗细渐变管道
        const segs = 10, radSegs = 8;
        const verts = [], norms = [], idxs = [];
        
        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const p = curve.getPointAt(t);
            const tang = curve.getTangentAt(t).normalize();
            const r = THREE.MathUtils.lerp(radiusStart, radiusEnd, t);
            
            const up = new THREE.Vector3(0, 1, 0);
            if (Math.abs(tang.dot(up)) > 0.99) up.set(1, 0, 0);
            const n = new THREE.Vector3().crossVectors(tang, up).normalize();
            const b = new THREE.Vector3().crossVectors(tang, n).normalize();
            
            for (let j = 0; j <= radSegs; j++) {
                const a = (j / radSegs) * Math.PI * 2;
                verts.push(p.x + (n.x * Math.cos(a) + b.x * Math.sin(a)) * r);
                verts.push(p.y + (n.y * Math.cos(a) + b.y * Math.sin(a)) * r);
                verts.push(p.z + (n.z * Math.cos(a) + b.z * Math.sin(a)) * r);
                norms.push(Math.cos(a), 0, Math.sin(a));
            }
        }
        
        for (let i = 0; i < segs; i++) for (let j = 0; j < radSegs; j++) {
            const a = i * (radSegs + 1) + j, b2 = a + radSegs + 1;
            idxs.push(a, b2, a + 1, a + 1, b2, b2 + 1);
        }
        
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3));
        geo.setIndex(idxs);
        geo.computeVertexNormals();
        
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0 }));
        mesh.castShadow = true;
        
        mesh.userData = {
            depth: 0, index: 0,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.3 + Math.random() * 0.4,
            swayAmplitude: 0.01 + Math.random() * 0.015,
            endPos: end.clone()
        };
        
        return mesh;
    }
    
    /** 简单管道（根系/树皮用） */
    createTube(points, radius, color) {
        const curve = points instanceof Array ? new THREE.CatmullRomCurve3(points) : points;
        const geo = new THREE.TubeGeometry(curve, 10, radius, 6, false);
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.95 }));
        mesh.castShadow = true;
        return mesh;
    }
    
    // ===================== 叶子 =====================
    
    /** 创建叶片形状的几何体 */
    createLeafGeometry(size) {
        const shape = new THREE.Shape();
        const s = size;
        // 叶片形状：尖椭圆
        shape.moveTo(0, 0);
        shape.bezierCurveTo(s * 0.5, s * 0.3, s * 0.5, s * 0.7, 0, s * 1.2);
        shape.bezierCurveTo(-s * 0.5, s * 0.7, -s * 0.5, s * 0.3, 0, 0);
        
        const geo = new THREE.ShapeGeometry(shape, 4);
        return geo;
    }
    
    addLeafCluster(node, pos) {
        const catColors = {
            politics: 0xE85D5D, technology: 0x4ABFB0, culture: 0xB87FD8,
            economy: 0x5CB870, military: 0xE8943D
        };
        const baseColor = catColors[node.category] || 0x5B8C3E;
        const count = 4 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < count; i++) {
            const size = 0.4 + Math.random() * 0.4;
            const geo = this.createLeafGeometry(size);
            
            const cv = new THREE.Color(baseColor);
            cv.offsetHSL((Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.08);
            
            const mat = new THREE.MeshStandardMaterial({
                color: cv, transparent: true, opacity: 0.88,
                roughness: 0.5, metalness: 0.05,
                emissive: baseColor, emissiveIntensity: 0.06,
                side: THREE.DoubleSide
            });
            
            const leaf = new THREE.Mesh(geo, mat);
            
            // 散布在枝头周围
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            const spread = 0.8 + Math.random() * 0.6;
            leaf.position.set(
                pos.x + Math.cos(angle) * spread,
                pos.y + Math.random() * 1.2,
                pos.z + Math.sin(angle) * spread
            );
            
            // 随机朝向
            leaf.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI * 2,
                Math.random() * 0.8 - 0.4
            );
            
            leaf.castShadow = true;
            leaf.userData = {
                node: node,
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.3 + Math.random() * 0.5,
                originalY: leaf.position.y,
                originalX: leaf.position.x,
                originalZ: leaf.position.z,
                rotSpeed: (Math.random() - 0.5) * 0.2
            };
            
            this.treeGroup.add(leaf);
            this.leaves.push(leaf);
        }
    }
    
    // ===================== 标签 =====================
    
    addLabel(text, x, y, z, scale) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256; canvas.height = 64;
        ctx.clearRect(0, 0, 256, 64);
        
        const fs = scale >= 5 ? 26 : (scale >= 4 ? 22 : 18);
        ctx.font = `bold ${fs}px "Noto Serif SC", serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(212,168,83,0.6)'; ctx.shadowBlur = 8;
        ctx.fillStyle = '#F0D68A'; ctx.fillText(text, 128, 32);
        ctx.shadowBlur = 0; ctx.fillStyle = '#F5E6C8'; ctx.fillText(text, 128, 32);
        
        const tex = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.9, depthWrite: false }));
        sprite.position.set(x, y + 1.5, z);
        sprite.scale.set(scale, scale * 0.25, 1);
        sprite.userData = { floatOffset: Math.random() * Math.PI * 2, floatSpeed: 0.2 + Math.random() * 0.2, originalY: y + 1.5 };
        
        this.treeGroup.add(sprite);
        this.floatingSprites.push(sprite);
    }
    
    // ===================== 根系 =====================
    
    addRoots(Rb) {
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
            const L = 4 + Math.random() * 5;
            const r = 0.3 + Math.random() * 0.3;
            this.treeGroup.add(this.createTube([
                new THREE.Vector3(Math.cos(a) * Rb * 0.8, 0, Math.sin(a) * Rb * 0.8),
                new THREE.Vector3(Math.cos(a) * (Rb + L * 0.4), -1 - Math.random(), Math.sin(a) * (Rb + L * 0.4)),
                new THREE.Vector3(Math.cos(a + 0.1) * (Rb + L), -0.3 - Math.random() * 0.5, Math.sin(a + 0.1) * (Rb + L))
            ], r, 0x4A2E15));
        }
    }
    
    // ===================== 地面 =====================
    
    addGround() {
        const g = new THREE.Mesh(
            new THREE.CircleGeometry(80, 64),
            new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 1, transparent: true, opacity: 0.6 })
        );
        g.rotation.x = -Math.PI / 2; g.position.y = -0.1; g.receiveShadow = true;
        this.scene.add(g);
        
        // 泥土小丘
        const mound = new THREE.Mesh(
            new THREE.SphereGeometry(5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshStandardMaterial({ color: 0x3A2A1A, roughness: 0.95 })
        );
        mound.position.y = -0.5; mound.scale.y = 0.3; mound.receiveShadow = true;
        this.treeGroup.add(mound);
    }
    
    // ===================== 粒子 =====================
    
    addParticles() {
        const N = 400;
        const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 1] = Math.random() * 45;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
            const g = 0.6 + Math.random() * 0.4;
            col[i * 3] = g; col[i * 3 + 1] = g * 0.75; col[i * 3 + 2] = g * 0.3;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        this.particles = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 0.15, vertexColors: true, transparent: true, opacity: 0.4,
            blending: THREE.AdditiveBlending, depthWrite: false
        }));
        this.scene.add(this.particles);
    }
    
    addFireflies() {
        for (let i = 0; i < 25; i++) {
            const m = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 6, 6),
                new THREE.MeshBasicMaterial({ color: 0xFFE4A0, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
            );
            m.position.set((Math.random() - 0.5) * 30, 5 + Math.random() * 25, (Math.random() - 0.5) * 30);
            m.userData = {
                basePos: m.position.clone(),
                phase: Math.random() * Math.PI * 2,
                speed: 0.3 + Math.random() * 0.5,
                radius: 2 + Math.random() * 4,
                brightPhase: Math.random() * Math.PI * 2
            };
            this.scene.add(m);
            this.fireflies.push(m);
        }
    }
    
    // ===================== 交互 =====================
    
    addEventListeners() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedLeaf = null;
        
        this.container.addEventListener('mousemove', (e) => {
            const r = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
            this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
            this.checkIntersection();
        });
        
        this.container.addEventListener('click', () => {
            if (this.selectedLeaf) this.onLeafClick(this.selectedLeaf);
        });
        
        window.addEventListener('resize', () => this.onResize());
    }
    
    checkIntersection() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const hits = this.raycaster.intersectObjects(this.leaves);
        if (hits.length > 0) {
            if (this.selectedLeaf && this.selectedLeaf !== hits[0].object) {
                this.selectedLeaf.material.emissiveIntensity = 0.06;
            }
            this.selectedLeaf = hits[0].object;
            this.selectedLeaf.material.emissiveIntensity = 0.35;
            this.container.style.cursor = 'pointer';
        } else {
            if (this.selectedLeaf) {
                this.selectedLeaf.material.emissiveIntensity = 0.06;
                this.selectedLeaf = null;
            }
            this.container.style.cursor = 'default';
        }
    }
    
    onLeafClick(leaf) {
        const nd = leaf.userData.node;
        if (!nd) return;
        
        const full = nd.id ? this.app.dataService.getNode(nd.id) : null;
        const node = full || nd;
        
        this.app.eventBus.emit('node:select', node);
        
        const card = this.app.getComponent('nodeCard');
        if (card) {
            const dn = node instanceof HistoryNode ? node : new HistoryNode({
                id: node.id || node.name, name: node.name, type: node.type || 'event',
                year: node.year, period: node.period || '', location: node.location || {},
                category: typeof node.category === 'string' ? { primary: node.category, tags: [] } : (node.category || { primary: '', tags: [] }),
                description: node.description || '', importance: node.importance || 3
            });
            // 确保 card 已渲染
            if (!card.container) card.render();
            card.show(dn);
        }
    }
    
    // ===================== 动画 =====================
    
    animate() {
        requestAnimationFrame(() => this.animate());
        const t = performance.now() * 0.001;
        this.controls.update();
        
        // 主干微摇
        if (this.trunkMesh) {
            this.trunkMesh.rotation.x = Math.sin(t * 0.3) * 0.003;
            this.trunkMesh.rotation.z = Math.cos(t * 0.25) * 0.003;
        }
        
        // 分支摇曳
        this.branchMeshes.forEach(b => {
            const { swayPhase, swaySpeed, swayAmplitude } = b.userData;
            const sway = Math.sin(t * swaySpeed + swayPhase) * swayAmplitude;
            b.rotation.x = sway * 0.8;
            b.rotation.z = sway;
        });
        
        // 叶子漂浮
        this.leaves.forEach(leaf => {
            const d = leaf.userData;
            leaf.position.y = d.originalY + Math.sin(t * d.floatSpeed + d.floatOffset) * 0.2;
            leaf.position.x = d.originalX + Math.sin(t * d.floatSpeed * 0.7 + d.floatOffset + 1) * 0.06;
            leaf.position.z = d.originalZ + Math.cos(t * d.floatSpeed * 0.6 + d.floatOffset + 2) * 0.05;
            leaf.rotation.y += d.rotSpeed * 0.008;
        });
        
        // 标签浮动
        this.floatingSprites.forEach(sp => {
            const d = sp.userData;
            sp.position.y = d.originalY + Math.sin(t * d.floatSpeed + d.floatOffset) * 0.12;
        });
        
        // 粒子
        if (this.particles) {
            this.particles.rotation.y += 0.0001;
            const pa = this.particles.geometry.attributes.position;
            for (let i = 0; i < pa.count; i++) {
                let y = pa.getY(i) - 0.008;
                if (y < 0) y = 45;
                pa.setY(i, y);
            }
            pa.needsUpdate = true;
        }
        
        // 萤火虫
        this.fireflies.forEach(f => {
            const d = f.userData;
            f.position.x = d.basePos.x + Math.sin(t * d.speed + d.phase) * d.radius;
            f.position.y = d.basePos.y + Math.sin(t * d.speed * 0.7 + d.phase * 2) * 1.5;
            f.position.z = d.basePos.z + Math.cos(t * d.speed + d.phase) * d.radius;
            f.material.opacity = Math.max(0.1, 0.3 + Math.sin(t * 2 + d.brightPhase) * 0.3);
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onResize() {
        const w = this.container.clientWidth, h = this.container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
    
    hide() { if (this.container) this.container.remove(); }

    destroy() {
        // 停止动画循环
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // 清理Three.js场景对象
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
                if (object.texture) {
                    object.texture.dispose();
                }
            });
            this.scene.clear();
        }

        // 清理渲染器
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }

        // 清理相机
        if (this.camera) {
            this.camera = null;
        }

        // 清理控制器
        if (this.controls) {
            if (typeof this.controls.dispose === 'function') {
                this.controls.dispose();
            }
            this.controls = null;
        }

        // 清理容器
        this.hide();
        this.container = null;

        this.app.eventBus.emit('view:destroy', { view: 'tree3d' });
        this.app = null;
    }
}

window.HistoryTree3D = HistoryTree3D;

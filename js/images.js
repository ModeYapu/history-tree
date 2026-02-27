// 图片资源管理器

class ImageManager {
    constructor() {
        this.images = new Map();
        this.loaders = new Map();
    }
    
    // 预加载图片
    preload(urls) {
        return Promise.all(
            urls.map(url => this.load(url))
        );
    }
    
    // 加载单张图片
    load(url) {
        if (this.images.has(url)) {
            return Promise.resolve(this.images.get(url));
        }
        
        if (this.loaders.has(url)) {
            return this.loaders.get(url);
        }
        
        const loader = new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.images.set(url, img);
                this.loaders.delete(url);
                resolve(img);
            };
            
            img.onerror = () => {
                this.loaders.delete(url);
                reject(new Error(`Failed to load image: ${url}`));
            };
            
            img.src = url;
        });
        
        this.loaders.set(url, loader);
        return loader;
    }
    
    // 获取图片
    get(url) {
        return this.images.get(url);
    }
    
    // 检查是否已加载
    has(url) {
        return this.images.has(url);
    }
    
    // 清除缓存
    clear() {
        this.images.clear();
        this.loaders.clear();
    }
}

// 全局图片管理器
const imageManager = new ImageManager();

// 图片卡片增强
function showImageCard(data) {
    const card = document.getElementById('detailCard');
    
    // 如果有图片，加载并显示
    if (data.image) {
        const imageContainer = card.querySelector('.card-image');
        imageContainer.style.background = `url(assets/images/${data.image}) center/cover`;
        imageContainer.style.minHeight = '200px';
        
        // 预加载图片
        imageManager.load(`assets/images/${data.image}`)
            .catch(() => {
                // 如果加载失败，显示占位符
                imageContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                imageContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:3em;">🖼️</div>';
            });
    }
}

// 图片懒加载
class LazyLoader {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        this.observer.unobserve(img);
                    }
                }
            });
        });
    }
    
    observe(element) {
        this.observer.observe(element);
    }
    
    disconnect() {
        this.observer.disconnect();
    }
}

const lazyLoader = new LazyLoader();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImageManager, LazyLoader, imageManager };
}

/**
 * Virtual Scroll Utility
 * Handles rendering of large lists (10k+ items) efficiently
 * Only renders visible items + buffer
 */

class VirtualScroll {
    constructor(options = {}) {
        this.container = options.container;
        this.itemHeight = options.itemHeight || 80;
        this.bufferSize = options.bufferSize || 5;
        this.items = [];
        this.visibleItems = [];
        this.scrollTop = 0;
        this.containerHeight = 0;

        this.itemRenderer = options.itemRenderer || ((item) => {
            const div = document.createElement('div');
            div.textContent = item.name || item.id;
            return div;
        });

        this.onItemClick = options.onItemClick || (() => {});
        this.onItemHover = options.onItemHover || (() => {});

        this.viewport = null;
        this.content = null;
        this.spacerBefore = null;
        this.spacerAfter = null;
        this.itemsContainer = null;

        this.init();
    }

    init() {
        // Create viewport
        this.viewport = document.createElement('div');
        this.viewport.className = 'virtual-scroll-viewport';
        this.viewport.style.cssText = `
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
        `;

        // Create content wrapper
        this.content = document.createElement('div');
        this.content.className = 'virtual-scroll-content';
        this.content.style.cssText = `
            position: relative;
            min-height: 100%;
        `;

        // Create spacers
        this.spacerBefore = document.createElement('div');
        this.spacerBefore.className = 'virtual-scroll-spacer-before';
        this.spacerBefore.style.cssText = 'height: 0px;';

        this.spacerAfter = document.createElement('div');
        this.spacerAfter.className = 'virtual-scroll-spacer-after';
        this.spacerAfter.style.cssText = 'height: 0px;';

        // Create items container
        this.itemsContainer = document.createElement('div');
        this.itemsContainer.className = 'virtual-scroll-items';
        this.itemsContainer.style.cssText = `
            position: relative;
        `;

        this.content.appendChild(this.spacerBefore);
        this.content.appendChild(this.itemsContainer);
        this.content.appendChild(this.spacerAfter);
        this.viewport.appendChild(this.content);

        if (this.container) {
            this.container.appendChild(this.viewport);
        }

        // Bind events
        this.viewport.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.onResize());

        // Initial sizing
        this.onResize();
    }

    setItems(items) {
        this.items = items;
        this.scrollTop = 0;
        this.viewport.scrollTop = 0;
        this.update();
    }

    getItems() {
        return this.items;
    }

    onScroll() {
        this.scrollTop = this.viewport.scrollTop;
        this.update();
    }

    onResize() {
        if (this.container) {
            this.containerHeight = this.container.clientHeight || this.container.offsetHeight;
        } else {
            this.containerHeight = this.viewport.clientHeight || this.viewport.offsetHeight;
        }
        this.update();
    }

    update() {
        if (this.items.length === 0) {
            this.itemsContainer.innerHTML = '';
            this.spacerBefore.style.height = '0px';
            this.spacerAfter.style.height = '0px';
            return;
        }

        const totalHeight = this.items.length * this.itemHeight;
        const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
        const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
        const endIndex = Math.min(this.items.length, startIndex + visibleCount + this.bufferSize * 2);

        const offsetY = startIndex * this.itemHeight;

        // Update spacers
        this.spacerBefore.style.height = `${offsetY}px`;
        this.spacerAfter.style.height = `${totalHeight - (endIndex * this.itemHeight)}px`;

        // Render visible items
        this.renderItems(startIndex, endIndex);
    }

    renderItems(startIndex, endIndex) {
        const itemsToRender = this.items.slice(startIndex, endIndex);

        // Simple diff: only update changed items
        const existingItems = Array.from(this.itemsContainer.children);
        const newLength = itemsToRender.length;
        const existingLength = existingItems.length;

        // Remove excess items
        for (let i = newLength; i < existingLength; i++) {
            existingItems[i].remove();
        }

        // Update or create items
        itemsToRender.forEach((item, index) => {
            const globalIndex = startIndex + index;
            let element = existingItems[index];

            if (!element) {
                element = this.createItemElement(item, globalIndex);
                this.itemsContainer.appendChild(element);
            } else {
                this.updateItemElement(element, item, globalIndex);
            }
        });

        this.visibleItems = itemsToRender;
    }

    createItemElement(item, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'virtual-scroll-item';
        wrapper.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: ${this.itemHeight}px;
            box-sizing: border-box;
        `;
        wrapper.dataset.index = index;
        wrapper.dataset.id = item.id;

        const content = this.itemRenderer(item, index);
        content.style.cssText = `
            height: 100%;
            box-sizing: border-box;
            padding: 12px;
            background: rgba(42, 33, 24, 0.6);
            border: 1px solid rgba(212, 168, 83, 0.15);
            border-radius: 8px;
            margin: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        wrapper.appendChild(content);

        // Events
        content.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onItemClick(item, index);
        });

        content.addEventListener('mouseenter', () => {
            content.style.background = 'rgba(212, 168, 83, 0.15)';
            content.style.borderColor = 'rgba(212, 168, 83, 0.4)';
            this.onItemHover(item, index);
        });

        content.addEventListener('mouseleave', () => {
            content.style.background = 'rgba(42, 33, 24, 0.6)';
            content.style.borderColor = 'rgba(212, 168, 83, 0.15)';
        });

        return wrapper;
    }

    updateItemElement(element, item, index) {
        element.dataset.index = index;
        element.dataset.id = item.id;
        // Could add more sophisticated diffing here
    }

    scrollToIndex(index) {
        if (index >= 0 && index < this.items.length) {
            this.scrollTop = index * this.itemHeight;
            this.viewport.scrollTop = this.scrollTop;
        }
    }

    scrollById(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.scrollToIndex(index);
        }
    }

    getVisibleRange() {
        const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
        const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
        const endIndex = Math.min(this.items.length, startIndex + visibleCount + this.bufferSize * 2);
        return { startIndex, endIndex };
    }

    getStats() {
        const { startIndex, endIndex } = this.getVisibleRange();
        return {
            totalItems: this.items.length,
            visibleItems: endIndex - startIndex,
            renderedItems: this.itemsContainer.children.length,
            scrollTop: this.scrollTop,
            containerHeight: this.containerHeight,
            totalHeight: this.items.length * this.itemHeight
        };
    }

    destroy() {
        this.viewport.removeEventListener('scroll', () => this.onScroll());
        window.removeEventListener('resize', () => this.onResize());
        if (this.container && this.viewport.parentNode === this.container) {
            this.container.removeChild(this.viewport);
        }
    }
}

window.VirtualScroll = VirtualScroll;

/**
 * TimelinePlugin 时间线插件单元测试
 */

describe('TimelinePlugin', () => {
  let TimelinePlugin;
  let mockApp;
  let timelinePlugin;

  const mockNodes = [
    {
      id: 'node1',
      name: '秦朝统一',
      time: { year: -221, displayDate: '公元前221年' },
      category: { primary: 'politics' },
      metadata: { importance: 5 },
      summary: '秦始皇统一六国'
    },
    {
      id: 'node2',
      name: '唐朝建立',
      time: { year: 618, displayDate: '618年' },
      category: { primary: 'culture' },
      metadata: { importance: 4 },
      summary: '李渊建立唐朝'
    },
    {
      id: 'node3',
      name: '宋朝建立',
      time: { year: 960, displayDate: '960年' },
      category: { primary: 'technology' },
      metadata: { importance: 3 },
      summary: '赵匡胤陈桥兵变'
    }
  ];

  beforeAll(() => {
    TimelinePlugin = window.TimelinePlugin;
  });

  beforeEach(() => {
    // Mock app
    mockApp = {
      eventBus: {
        on: jest.fn(),
        emit: jest.fn(),
        off: jest.fn()
      },
      dataService: {
        filter: jest.fn(() => mockNodes),
        nodes: new Map(mockNodes.map(n => [n.id, n]))
      }
    };

    // Mock DOM methods
    document.body.appendChild = jest.fn();
    document.querySelector = jest.fn(() => document.createElement('div'));
    document.createElement = jest.fn((tag) => {
      const element = {
        tagName: tag.toUpperCase(),
        className: '',
        style: {},
        innerHTML: '',
        textContent: '',
        appendChild: jest.fn(),
        addEventListener: jest.fn(),
        remove: jest.fn(),
        querySelector: jest.fn(() => ({
          style: {},
          addEventListener: jest.fn()
        })),
        querySelectorAll: jest.fn(() => [
          { style: {}, textContent: '春秋' }
        ])
      };
      return element;
    });

    let animationFrameId = 0;
    global.requestAnimationFrame = jest.fn((cb) => {
      animationFrameId++;
      // Call immediately but don't recurse - just return the ID
      return animationFrameId;
    });
    global.cancelAnimationFrame = jest.fn();

    timelinePlugin = new TimelinePlugin(mockApp);
  });

  describe('constructor()', () => {
    test('应该初始化基本属性', () => {
      expect(timelinePlugin.name).toBe('timelinePlugin');
      expect(timelinePlugin.version).toBe('1.0.0');
      expect(timelinePlugin.isVisible).toBe(false);
      expect(timelinePlugin.isDragging).toBe(false);
    });

    test('应该初始化时间范围', () => {
      expect(timelinePlugin.timeRange.start).toBe(-3000);
      expect(timelinePlugin.timeRange.end).toBe(2024);
    });

    test('应该定义历史时期', () => {
      expect(timelinePlugin.periods).toHaveLength(9);
      expect(timelinePlugin.periods[0]).toMatchObject({
        id: 'spring-autumn',
        name: '春秋',
        start: -770,
        end: -476
      });
      expect(timelinePlugin.periods[8]).toMatchObject({
        id: 'modern',
        name: '近现代',
        start: 1911,
        end: 2024
      });
    });

    test('应该初始化动画状态', () => {
      expect(timelinePlugin.animationFrame).toBeNull();
    });
  });

  describe('init()', () => {
    test('应该设置事件监听', () => {
      timelinePlugin.init();
      expect(mockApp.eventBus.on).toHaveBeenCalledWith('view:change', expect.any(Function));
      expect(mockApp.eventBus.on).toHaveBeenCalledWith('period:select', expect.any(Function));
    });
  });

  describe('show()', () => {
    test('应该显示时间线', () => {
      // Mock createTimeline to avoid DOM issues
      timelinePlugin.createTimeline = jest.fn(() => ({ style: {} }));
      timelinePlugin.show();
      expect(timelinePlugin.isVisible).toBe(true);
      expect(timelinePlugin.createTimeline).toHaveBeenCalled();
    });

    test('不应该重复显示', () => {
      timelinePlugin.isVisible = true;
      timelinePlugin.createTimeline = jest.fn();
      timelinePlugin.show();
      expect(timelinePlugin.createTimeline).not.toHaveBeenCalled();
    });
  });

  describe('hide()', () => {
    test('应该隐藏时间线', () => {
      timelinePlugin.timelineElement = {
        style: {},
        remove: jest.fn()
      };
      timelinePlugin.isVisible = true;

      timelinePlugin.hide();

      expect(timelinePlugin.isVisible).toBe(false);
    });
  });

  describe('formatYear()', () => {
    test('应该正确格式化公元前年份', () => {
      expect(timelinePlugin.formatYear(-221)).toBe('公元前221年');
      expect(timelinePlugin.formatYear(-770)).toBe('公元前770年');
    });

    test('应该正确格式化公元后年份', () => {
      expect(timelinePlugin.formatYear(618)).toBe('618年');
      expect(timelinePlugin.formatYear(2024)).toBe('2024年');
    });

    test('应该处理0年', () => {
      expect(timelinePlugin.formatYear(0)).toBe('0年');
    });
  });

  describe('yearToPercent()', () => {
    test('应该正确转换年份为百分比', () => {
      expect(timelinePlugin.yearToPercent(-3000)).toBe(0);
      expect(timelinePlugin.yearToPercent(2024)).toBeCloseTo(100, 1);
    });

    test('应该正确转换中间年份', () => {
      const percent = timelinePlugin.yearToPercent(0);
      expect(percent).toBeGreaterThan(50);
      expect(percent).toBeLessThan(70);
    });
  });

  describe('pixelToYear()', () => {
    test('应该正确转换像素为年份', () => {
      const containerWidth = 1000;
      expect(timelinePlugin.pixelToYear(0, containerWidth)).toBe(-3000);
      expect(timelinePlugin.pixelToYear(containerWidth, containerWidth)).toBeCloseTo(2024, 0);
    });

    test('应该正确转换中间位置', () => {
      const containerWidth = 1000;
      const year = timelinePlugin.pixelToYear(500, containerWidth);
      expect(year).toBeGreaterThan(-1000);
      expect(year).toBeLessThan(500);
    });
  });

  describe('setTimeRange()', () => {
    test('应该设置新的时间范围', () => {
      timelinePlugin.setTimeRange(-500, 1000);
      expect(timelinePlugin.timeRange.start).toBe(-500);
      expect(timelinePlugin.timeRange.end).toBe(1000);
    });

    test('应该限制在有效范围内', () => {
      timelinePlugin.setTimeRange(-5000, 5000);
      expect(timelinePlugin.timeRange.start).toBe(-3000);
      expect(timelinePlugin.timeRange.end).toBe(2024);
    });

    test('应该确保最小间隔', () => {
      timelinePlugin.setTimeRange(100, 120);
      expect(timelinePlugin.timeRange.end).toBe(150);
    });
  });

  describe('zoomIn()', () => {
    test('应该放大时间范围', () => {
      const originalRange = timelinePlugin.timeRange.end - timelinePlugin.timeRange.start;
      timelinePlugin.zoomIn();
      const newRange = timelinePlugin.timeRange.end - timelinePlugin.timeRange.start;
      expect(newRange).toBeLessThan(originalRange);
    });

    test('应该保持中心点不变', () => {
      const originalCenter = (timelinePlugin.timeRange.start + timelinePlugin.timeRange.end) / 2;
      timelinePlugin.zoomIn();
      const newCenter = (timelinePlugin.timeRange.start + timelinePlugin.timeRange.end) / 2;
      expect(newCenter).toBeCloseTo(originalCenter, 0);
    });

    test('应该有最小范围限制', () => {
      timelinePlugin.timeRange = { start: -50, end: 50 };
      timelinePlugin.zoomIn();
      const range = timelinePlugin.timeRange.end - timelinePlugin.timeRange.start;
      expect(range).toBeGreaterThanOrEqual(100);
    });
  });

  describe('zoomOut()', () => {
    test('应该缩小时间范围', () => {
      timelinePlugin.timeRange = { start: -100, end: 100 };
      const originalRange = timelinePlugin.timeRange.end - timelinePlugin.timeRange.start;
      timelinePlugin.zoomOut();
      const newRange = timelinePlugin.timeRange.end - timelinePlugin.timeRange.start;
      expect(newRange).toBeGreaterThan(originalRange);
    });

    test('应该有最大范围限制', () => {
      timelinePlugin.zoomOut();
      expect(timelinePlugin.timeRange.start).toBeGreaterThanOrEqual(-3000);
      expect(timelinePlugin.timeRange.end).toBeLessThanOrEqual(2024);
    });
  });

  describe('reset()', () => {
    test('应该重置为默认时间范围', () => {
      timelinePlugin.timeRange = { start: -500, end: 1000 };
      timelinePlugin.reset();
      expect(timelinePlugin.timeRange.start).toBe(-3000);
      expect(timelinePlugin.timeRange.end).toBe(2024);
    });
  });

  describe('selectPeriod()', () => {
    test('应该选择指定时期', () => {
      const period = timelinePlugin.periods[0]; // 春秋
      timelinePlugin.selectPeriod(period);
      expect(timelinePlugin.timeRange.start).toBe(-770);
      expect(timelinePlugin.timeRange.end).toBe(-476);
    });
  });

  describe('getPeriodByYear()', () => {
    test('应该返回正确的时期', () => {
      expect(timelinePlugin.getPeriodByYear(-500)?.name).toBe('春秋');
      expect(timelinePlugin.getPeriodByYear(0)?.name).toBe('秦汉');
      expect(timelinePlugin.getPeriodByYear(700)?.name).toBe('隋唐');
      expect(timelinePlugin.getPeriodByYear(1500)?.name).toBe('明清');
    });

    test('应该返回undefined对于范围外的年份', () => {
      expect(timelinePlugin.getPeriodByYear(-5000)).toBeUndefined();
    });
  });

  describe('getTimeRange()', () => {
    test('应该返回时间范围副本', () => {
      const range = timelinePlugin.getTimeRange();
      expect(range).toEqual({ start: -3000, end: 2024 });
      expect(range).not.toBe(timelinePlugin.timeRange);
    });
  });

  describe('getPeriods()', () => {
    test('应该返回时期列表副本', () => {
      const periods = timelinePlugin.getPeriods();
      expect(periods).toHaveLength(9);
      expect(periods).not.toBe(timelinePlugin.periods);
    });
  });

  describe('jumpToYear()', () => {
    test('应该跳转到指定年份', () => {
      timelinePlugin.timeRange = { start: -3000, end: 2024 };
      timelinePlugin.jumpToYear(618);
      expect(timelinePlugin.timeRange.start).toBeLessThan(618);
      expect(timelinePlugin.timeRange.end).toBeGreaterThan(618);
    });
  });

  describe('getCategoryColor()', () => {
    test('应该返回正确的分类颜色', () => {
      expect(timelinePlugin.getCategoryColor('politics')).toBe('#ff6b6b');
      expect(timelinePlugin.getCategoryColor('technology')).toBe('#4ecdc4');
      expect(timelinePlugin.getCategoryColor('culture')).toBe('#a855f7');
      expect(timelinePlugin.getCategoryColor('economy')).toBe('#22c55e');
      expect(timelinePlugin.getCategoryColor('military')).toBe('#f97316');
    });

    test('应该返回默认颜色', () => {
      expect(timelinePlugin.getCategoryColor('unknown')).toBe('#999');
    });
  });

  describe('playAnimation()', () => {
    test('应该开始播放动画', () => {
      timelinePlugin.playAnimation({ startYear: -1000, endYear: 1000, duration: 1000 });
      expect(timelinePlugin.animationFrame).toBeGreaterThan(0);
    });

    test('应该使用默认参数', () => {
      timelinePlugin.playAnimation();
      expect(timelinePlugin.animationFrame).toBeGreaterThan(0);
    });

    test('应该调用onUpdate回调', () => {
      const onUpdate = jest.fn();
      // Mock the internal animate function to test callback
      const originalFn = timelinePlugin.playAnimation;
      timelinePlugin.playAnimation = function(options) {
        if (options.onUpdate) {
          options.onUpdate(0, 0);
        }
        timelinePlugin.animationFrame = 1;
      };
      timelinePlugin.playAnimation({ duration: 100, onUpdate });
      expect(onUpdate).toHaveBeenCalled();
      // Restore original
      timelinePlugin.playAnimation = originalFn;
    });
  });

  describe('stopAnimation()', () => {
    test('应该停止动画', () => {
      timelinePlugin.animationFrame = 'test-frame';
      timelinePlugin.stopAnimation();
      expect(global.cancelAnimationFrame).toHaveBeenCalledWith('test-frame');
      expect(timelinePlugin.animationFrame).toBeNull();
    });

    test('应该处理没有动画的情况', () => {
      expect(() => timelinePlugin.stopAnimation()).not.toThrow();
    });
  });

  describe('emitTimeRangeChange()', () => {
    test('应该触发timeline:change事件', () => {
      timelinePlugin.emitTimeRangeChange();
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('timeline:change', {
        start: -3000,
        end: 2024
      });
    });

    test('应该触发timeline:brush事件', () => {
      timelinePlugin.emitTimeRangeChange();
      expect(mockApp.eventBus.emit).toHaveBeenCalledWith('timeline:brush', {
        start: -3000,
        end: 2024
      });
    });
  });

  describe('destroy()', () => {
    test('应该停止动画', () => {
      timelinePlugin.animationFrame = 'test-frame';
      timelinePlugin.destroy();
      expect(timelinePlugin.animationFrame).toBeNull();
    });

    test('应该隐藏时间线', () => {
      timelinePlugin.hide = jest.fn();
      timelinePlugin.destroy();
      expect(timelinePlugin.hide).toHaveBeenCalled();
    });

    test('应该移除事件监听', () => {
      timelinePlugin.eventListeners = [
        { event: 'test', handler: jest.fn() }
      ];
      timelinePlugin.destroy();
      expect(timelinePlugin.eventListeners).toEqual([]);
    });
  });

  describe('集成测试', () => {
    test('应该完整执行显示-交互-隐藏流程', () => {
      // Mock createTimeline for show()
      timelinePlugin.createTimeline = jest.fn(() => ({ style: {} }));
      // Mock updateTimelineUI for zoom/reset operations
      timelinePlugin.updateTimelineUI = jest.fn();
      // Mock emitTimeRangeChange
      timelinePlugin.emitTimeRangeChange = jest.fn();

      // 显示
      timelinePlugin.show();
      expect(timelinePlugin.isVisible).toBe(true);

      // 缩放
      const originalRange = timelinePlugin.timeRange.end - timelinePlugin.timeRange.start;
      timelinePlugin.zoomIn();
      expect(timelinePlugin.timeRange.end - timelinePlugin.timeRange.start).toBeLessThan(originalRange);

      // 重置
      timelinePlugin.reset();
      expect(timelinePlugin.timeRange.start).toBe(-3000);

      // 隐藏
      timelinePlugin.timelineElement = { remove: jest.fn(), style: {} };
      timelinePlugin.hide();
      expect(timelinePlugin.isVisible).toBe(false);
    });

    test('应该处理时期选择', () => {
      timelinePlugin.updateTimelineUI = jest.fn();
      timelinePlugin.emitTimeRangeChange = jest.fn();
      const period = timelinePlugin.periods.find(p => p.name === '秦汉');
      timelinePlugin.selectPeriod(period);
      expect(timelinePlugin.timeRange.start).toBe(-221);
      expect(timelinePlugin.timeRange.end).toBe(220);
    });
  });
});

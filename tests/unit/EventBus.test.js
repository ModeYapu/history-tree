/**
 * EventBus 事件总线单元测试
 */

describe('EventBus', () => {
  let EventBus, EventTypes, eventBus;

  beforeAll(() => {
    EventBus = window.EventBus;
    EventTypes = window.EventTypes;
  });

  beforeEach(() => {
    eventBus = new EventBus();
  });

  describe('on()', () => {
    test('应该订阅事件', () => {
      const callback = jest.fn();
      
      eventBus.on('test', callback);
      eventBus.emit('test', { data: 'test' });
      
      expect(callback).toHaveBeenCalledWith({ data: 'test' });
    });

    test('应该支持多个监听器', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      eventBus.on('test', callback1);
      eventBus.on('test', callback2);
      eventBus.emit('test');
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    test('应该支持上下文绑定', () => {
      const context = { name: 'context' };
      const callback = jest.fn(function() {
        return this.name;
      });
      
      eventBus.on('test', callback, context);
      eventBus.emit('test');
      
      expect(callback).toHaveBeenCalled();
    });

    test('应该返回取消订阅函数', () => {
      const callback = jest.fn();
      const unsubscribe = eventBus.on('test', callback);
      
      unsubscribe();
      eventBus.emit('test');
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('once()', () => {
    test('应该只触发一次', () => {
      const callback = jest.fn();
      
      eventBus.once('test', callback);
      eventBus.emit('test', 'first');
      eventBus.emit('test', 'second');
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('first');
    });

    test('应该支持上下文', () => {
      const context = { value: 42 };
      const callback = jest.fn(function() {
        return this.value;
      });
      
      eventBus.once('test', callback, context);
      eventBus.emit('test');
      
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('off()', () => {
    test('应该取消订阅', () => {
      const callback = jest.fn();
      
      eventBus.on('test', callback);
      eventBus.off('test', callback);
      eventBus.emit('test');
      
      expect(callback).not.toHaveBeenCalled();
    });

    test('应该只取消指定的监听器', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      eventBus.on('test', callback1);
      eventBus.on('test', callback2);
      eventBus.off('test', callback1);
      eventBus.emit('test');
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('emit()', () => {
    test('应该触发事件', () => {
      const callback = jest.fn();
      
      eventBus.on('test', callback);
      eventBus.emit('test', 'data');
      
      expect(callback).toHaveBeenCalledWith('data');
    });

    test('应该支持空数据', () => {
      const callback = jest.fn();
      
      eventBus.on('test', callback);
      eventBus.emit('test');
      
      expect(callback).toHaveBeenCalledWith(null);
    });

    test('应该同时触发普通和一次性事件', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      eventBus.on('test', callback1);
      eventBus.once('test', callback2);
      eventBus.emit('test');
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
      
      // 第二次触发
      eventBus.emit('test');
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear()', () => {
    test('应该清空所有事件', () => {
      const callback = jest.fn();
      
      eventBus.on('test1', callback);
      eventBus.on('test2', callback);
      eventBus.once('test3', callback);
      
      eventBus.clear();
      
      eventBus.emit('test1');
      eventBus.emit('test2');
      eventBus.emit('test3');
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('getEvents()', () => {
    test('应该返回所有事件名称', () => {
      eventBus.on('event1', () => {});
      eventBus.on('event2', () => {});
      
      const events = eventBus.getEvents();
      
      expect(events).toContain('event1');
      expect(events).toContain('event2');
      expect(events).toHaveLength(2);
    });

    test('应该返回空数组如果没有事件', () => {
      const events = eventBus.getEvents();
      
      expect(events).toEqual([]);
    });
  });

  describe('EventTypes', () => {
    test('应该定义所有必要的事件类型', () => {
      expect(EventTypes.APP_READY).toBe('app:ready');
      expect(EventTypes.APP_ERROR).toBe('app:error');
      expect(EventTypes.VIEW_CHANGE).toBe('view:change');
      expect(EventTypes.DATA_LOAD).toBe('data:load');
      expect(EventTypes.SEARCH_START).toBe('search:start');
      expect(EventTypes.FILTER_CHANGE).toBe('filter:change');
      expect(EventTypes.NODE_CLICK).toBe('node:click');
      expect(EventTypes.USER_LOGIN).toBe('user:login');
      expect(EventTypes.UI_LOADING_START).toBe('ui:loading:start');
    });
  });

  describe('集成测试', () => {
    test('应该支持复杂的事件流程', () => {
      const flow = [];
      
      eventBus.on('start', () => flow.push('start'));
      eventBus.on('process', () => flow.push('process'));
      eventBus.on('end', () => flow.push('end'));
      
      eventBus.emit('start');
      eventBus.emit('process');
      eventBus.emit('end');
      
      expect(flow).toEqual(['start', 'process', 'end']);
    });

    test('应该支持数据传递链', () => {
      let result = 0;
      
      eventBus.on('add', (data) => {
        result += data;
      });
      
      eventBus.emit('add', 5);
      eventBus.emit('add', 10);
      eventBus.emit('add', 3);
      
      expect(result).toBe(18);
    });
  });
});

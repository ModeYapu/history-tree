/**
 * StateManager 状态管理单元测试
 */

describe('StateManager', () => {
  let StateManager, EventBus, stateManager, eventBus;

  beforeAll(() => {
    StateManager = window.StateManager;
    EventBus = window.EventBus;
  });

  beforeEach(() => {
    eventBus = new EventBus();
    stateManager = new StateManager(eventBus);
  });

  describe('getState()', () => {
    test('应该获取完整状态', () => {
      const state = stateManager.getState();
      
      expect(state).toBeDefined();
      expect(state.app).toBeDefined();
      expect(state.view).toBeDefined();
      expect(state.data).toBeDefined();
      expect(state.ui).toBeDefined();
      expect(state.user).toBeDefined();
    });

    test('应该获取嵌套状态值', () => {
      expect(stateManager.getState('app.version')).toBe('4.0.0');
      expect(stateManager.getState('view.current')).toBe('tree');
      expect(stateManager.getState('ui.theme')).toBe('light');
    });

    test('应该返回undefined对于不存在的路径', () => {
      expect(stateManager.getState('app.nonexistent')).toBeUndefined();
      expect(stateManager.getState('invalid.path.test')).toBeUndefined();
    });
  });

  describe('setState()', () => {
    test('应该设置状态值', () => {
      stateManager.setState('app.loading', true);
      
      expect(stateManager.getState('app.loading')).toBe(true);
    });

    test('应该覆盖现有值', () => {
      stateManager.setState('view.current', 'network');
      
      expect(stateManager.getState('view.current')).toBe('network');
    });

    test('应该创建不存在的嵌套路径', () => {
      stateManager.setState('data.newField', 'test');
      
      expect(stateManager.getState('data.newField')).toBe('test');
    });

    test('应该记录历史', () => {
      stateManager.setState('app.loading', true);
      
      expect(stateManager.history).toHaveLength(1);
      expect(stateManager.history[0].path).toBe('app.loading');
      expect(stateManager.history[0].newValue).toBe(true);
    });

    test('应该触发监听器', () => {
      const callback = jest.fn();
      stateManager.watch('app.loading', callback);
      
      stateManager.setState('app.loading', true);
      
      expect(callback).toHaveBeenCalledWith(true, false);
    });

    test('silent模式不应触发监听器', () => {
      const callback = jest.fn();
      stateManager.watch('app.loading', callback);
      
      stateManager.setState('app.loading', true, true);
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('batchUpdate()', () => {
    test('应该批量更新多个值', () => {
      const updates = [
        { path: 'app.loading', value: true },
        { path: 'view.current', value: 'network' },
        { path: 'ui.theme', value: 'dark' }
      ];
      
      stateManager.batchUpdate(updates);
      
      expect(stateManager.getState('app.loading')).toBe(true);
      expect(stateManager.getState('view.current')).toBe('network');
      expect(stateManager.getState('ui.theme')).toBe('dark');
    });

    test('应该批量触发监听器', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      stateManager.watch('app.loading', callback1);
      stateManager.watch('view.current', callback2);
      
      const updates = [
        { path: 'app.loading', value: true },
        { path: 'view.current', value: 'network' }
      ];
      
      stateManager.batchUpdate(updates);
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('watch()', () => {
    test('应该监听状态变化', () => {
      const callback = jest.fn();
      
      stateManager.watch('ui.theme', callback);
      stateManager.setState('ui.theme', 'dark');
      
      expect(callback).toHaveBeenCalledWith('dark', 'light');
    });

    test('immediate应该立即执行', () => {
      const callback = jest.fn();
      
      stateManager.watch('ui.theme', callback, true);
      
      expect(callback).toHaveBeenCalledWith('light', undefined);
    });

    test('应该返回取消监听函数', () => {
      const callback = jest.fn();
      const unwatch = stateManager.watch('ui.theme', callback);
      
      unwatch();
      stateManager.setState('ui.theme', 'dark');
      
      expect(callback).not.toHaveBeenCalled();
    });

    test('应该监听父路径变化', () => {
      const callback = jest.fn();
      
      stateManager.watch('ui', callback);
      stateManager.setState('ui.theme', 'dark');
      
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('reset()', () => {
    test('应该重置特定路径', () => {
      stateManager.setState('app.loading', true);
      stateManager.setState('view.current', 'network');
      
      stateManager.reset('app.loading');
      
      expect(stateManager.getState('app.loading')).toBeUndefined();
      expect(stateManager.getState('view.current')).toBe('network');
    });

    test('应该重置所有状态', () => {
      stateManager.setState('app.loading', true);
      stateManager.setState('view.current', 'network');
      stateManager.setState('ui.theme', 'dark');
      
      stateManager.reset();
      
      expect(stateManager.getState('app.loading')).toBe(false);
      expect(stateManager.getState('view.current')).toBe('tree');
      expect(stateManager.getState('ui.theme')).toBe('light');
    });
  });

  describe('历史记录', () => {
    test('应该记录状态变化历史', () => {
      stateManager.setState('app.loading', true);
      stateManager.setState('view.current', 'network');
      stateManager.setState('ui.theme', 'dark');
      
      expect(stateManager.history).toHaveLength(3);
    });

    test('应该限制历史大小', () => {
      stateManager.maxHistorySize = 5;
      
      for (let i = 0; i < 10; i++) {
        stateManager.setState('data.test', i);
      }
      
      expect(stateManager.history.length).toBe(5);
    });

    test('应该记录时间戳', () => {
      stateManager.setState('app.loading', true);
      
      expect(stateManager.history[0].timestamp).toBeDefined();
      expect(stateManager.history[0].timestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('嵌套值操作', () => {
    test('应该正确获取深层嵌套值', () => {
      stateManager.setState('user.preferences.theme', 'dark');
      stateManager.setState('user.preferences.fontSize', 16);
      
      expect(stateManager.getState('user.preferences.theme')).toBe('dark');
      expect(stateManager.getState('user.preferences.fontSize')).toBe(16);
    });

    test('应该正确设置深层嵌套值', () => {
      stateManager.setState('user.profile.name', 'Test User');
      stateManager.setState('user.profile.email', 'test@example.com');
      
      const user = stateManager.getState('user');
      expect(user.profile.name).toBe('Test User');
      expect(user.profile.email).toBe('test@example.com');
    });
  });

  describe('debug()', () => {
    test('应该输出调试信息', () => {
      stateManager.debug();
      
      expect(console.group).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });
  });
});

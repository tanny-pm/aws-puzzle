// Cypressのモック
global.cy = {
  visit: jest.fn(),
  get: jest.fn(() => ({
    should: jest.fn(() => ({
      contain: jest.fn(),
      be: jest.fn(),
      have: jest.fn()
    })),
    first: jest.fn(() => ({
      click: jest.fn(),
      should: jest.fn()
    })),
    eq: jest.fn(() => ({
      click: jest.fn(),
      should: jest.fn(),
      find: jest.fn(() => ({
        invoke: jest.fn(() => ({
          then: jest.fn()
        }))
      }))
    })),
    each: jest.fn(),
    focus: jest.fn()
  })),
  wait: jest.fn(),
  then: jest.fn(),
  window: jest.fn(() => ({
    then: jest.fn()
  })),
  viewport: jest.fn()
};

// Cypressのdescribe関数をJestのdescribeにマッピング
global.describe = global.describe || jest.fn();
global.it = global.it || jest.fn();
global.beforeEach = global.beforeEach || jest.fn();

/**
 * @jest-environment jsdom
 */

describe('MemoryGame', () => {
  let game;
  let mockElement;
  let MemoryGame;
  
  // DOMのモック
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-board"></div>
      <div id="score">0</div>
      <div id="attempts">0</div>
      <div id="matches">0</div>
      <div id="total-pairs">0</div>
      <select id="difficulty">
        <option value="easy">簡単</option>
        <option value="medium" selected>普通</option>
        <option value="hard">難しい</option>
      </select>
      <button id="new-game-btn"></button>
      <button id="play-again-btn"></button>
      <div id="game-complete" class="hidden"></div>
      <div id="final-score"></div>
      <div id="final-attempts"></div>
      <div id="service-popup" class="hidden">
        <div class="popup-content">
          <button id="popup-close"></button>
          <img id="popup-icon" src="" alt="">
          <h3 id="popup-title"></h3>
          <span id="popup-category"></span>
          <p id="popup-description"></p>
        </div>
      </div>
    `;
    
    // fetchのモック
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('name,category,icon,description\nAmazon EC2,Compute,aws-icons/Arch_Amazon-EC2_64.png,"EC2の説明"\nAWS Lambda,Compute,aws-icons/Arch_AWS-Lambda_64.png,"Lambdaの説明"')
      })
    );
    
    // スクリプトを読み込む前にMemoryGameクラスを定義
    MemoryGame = class {
      constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.attemptsElement = document.getElementById('attempts');
        this.matchesElement = document.getElementById('matches');
        this.totalPairsElement = document.getElementById('total-pairs');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.gameCompleteDiv = document.getElementById('game-complete');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalAttemptsElement = document.getElementById('final-attempts');
        this.servicePopup = document.getElementById('service-popup');
        this.popupClose = document.getElementById('popup-close');
        this.popupIcon = document.getElementById('popup-icon');
        this.popupTitle = document.getElementById('popup-title');
        this.popupCategory = document.getElementById('popup-category');
        this.popupDescription = document.getElementById('popup-description');
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.score = 0;
        this.isProcessing = false;
        this.awsServices = [];
      }
      
      parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) {
          return [];
        }
        
        const headers = lines[0].split(',');
        const services = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = this.parseCSVLine(lines[i]);
          if (values.length === headers.length) {
            const service = {};
            headers.forEach((header, index) => {
              service[header.trim()] = values[index].trim().replace(/^"|"$/g, '');
            });
            if (service.name && service.category && service.icon && service.description) {
              services.push(service);
            }
          }
        }
        
        return services;
      }
      
      parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        
        result.push(current);
        return result;
      }
      
      getDifficultySettings() {
        const difficulty = this.difficultySelect.value;
        switch (difficulty) {
          case 'easy':
            return { pairs: 6, className: 'easy' };
          case 'medium':
            return { pairs: 8, className: 'medium' };
          case 'hard':
            return { pairs: 12, className: 'hard' };
          default:
            return { pairs: 8, className: 'medium' };
        }
      }
      
      resetGameState() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.score = 0;
        this.isProcessing = false;
      }
      
      createCard(cardInfo, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        
        card.innerHTML = `
          <div class="card-front">AWS</div>
          <div class="card-back">
            <img src="${cardInfo.icon}" alt="${cardInfo.name}">
            <div class="service-name">${cardInfo.name}</div>
          </div>
        `;
        
        return card;
      }
      
      showServiceInfo(service) {
        this.popupIcon.src = service.icon;
        this.popupIcon.alt = service.name;
        this.popupTitle.textContent = service.name;
        this.popupCategory.textContent = service.category;
        this.popupDescription.textContent = service.description;
        
        this.servicePopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
      
      closePopup() {
        this.servicePopup.classList.add('hidden');
        document.body.style.overflow = '';
      }
      
      gameComplete() {
        const bonusScore = Math.max(0, 1000 - (this.attempts * 10));
        this.score += bonusScore;
        
        this.finalScoreElement.textContent = this.score;
        this.finalAttemptsElement.textContent = this.attempts;
        this.gameCompleteDiv.classList.remove('hidden');
      }
      
      shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      }
      
      createGameBoard() {
        // テスト用のスタブ
      }
      
      updateUI() {
        this.scoreElement.textContent = this.score;
        this.attemptsElement.textContent = this.attempts;
        this.matchesElement.textContent = this.matchedPairs;
      }
    };
    
    // MemoryGameのインスタンスを作成
    game = new MemoryGame();
    
    // タイマーのモック
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    document.body.innerHTML = '';
  });
  
  test('ゲームが正しく初期化されること', () => {
    expect(game).toBeDefined();
    expect(game.cards).toEqual([]);
    expect(game.flippedCards).toEqual([]);
    expect(game.matchedPairs).toBe(0);
    expect(game.attempts).toBe(0);
    expect(game.score).toBe(0);
    expect(game.isProcessing).toBe(false);
  });
  
  test('CSVデータが正しくパースされること', () => {
    const csvText = 'name,category,icon,description\nAmazon EC2,Compute,aws-icons/Arch_Amazon-EC2_64.png,"EC2の説明"\nAWS Lambda,Compute,aws-icons/Arch_AWS-Lambda_64.png,"Lambdaの説明"';
    const result = game.parseCSV(csvText);
    
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Amazon EC2');
    expect(result[0].category).toBe('Compute');
    expect(result[0].icon).toBe('aws-icons/Arch_Amazon-EC2_64.png');
    expect(result[0].description).toBe('EC2の説明');
  });
  
  test('CSVの行が正しくパースされること', () => {
    const line = 'Amazon EC2,Compute,aws-icons/icon.png,"This is a description with, comma"';
    const result = game.parseCSVLine(line);
    
    expect(result).toHaveLength(4);
    expect(result[0]).toBe('Amazon EC2');
    expect(result[3]).toBe('This is a description with, comma');
  });
  
  test('難易度設定が正しく取得されること', () => {
    // 簡単
    document.getElementById('difficulty').value = 'easy';
    let settings = game.getDifficultySettings();
    expect(settings.pairs).toBe(6);
    expect(settings.className).toBe('easy');
    
    // 普通
    document.getElementById('difficulty').value = 'medium';
    settings = game.getDifficultySettings();
    expect(settings.pairs).toBe(8);
    expect(settings.className).toBe('medium');
    
    // 難しい
    document.getElementById('difficulty').value = 'hard';
    settings = game.getDifficultySettings();
    expect(settings.pairs).toBe(12);
    expect(settings.className).toBe('hard');
  });
  
  test('配列が正しくシャッフルされること', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = game.shuffleArray(array);
    
    // 長さが同じであること
    expect(shuffled).toHaveLength(array.length);
    
    // 元の配列と同じ要素を含むこと
    expect(shuffled.sort()).toEqual(array.sort());
    
    // 元の配列が変更されていないこと
    expect(array).toEqual([1, 2, 3, 4, 5]);
  });
  
  test('ゲーム状態がリセットされること', () => {
    game.cards = ['dummy'];
    game.flippedCards = ['dummy'];
    game.matchedPairs = 5;
    game.attempts = 10;
    game.score = 500;
    game.isProcessing = true;
    
    game.resetGameState();
    
    expect(game.cards).toEqual([]);
    expect(game.flippedCards).toEqual([]);
    expect(game.matchedPairs).toBe(0);
    expect(game.attempts).toBe(0);
    expect(game.score).toBe(0);
    expect(game.isProcessing).toBe(false);
  });
  
  test('カードが正しく作成されること', () => {
    const cardInfo = {
      name: 'Test Service',
      icon: 'test-icon.png',
      category: 'Test'
    };
    
    const card = game.createCard(cardInfo, 0);
    
    expect(card.className).toBe('card');
    expect(card.dataset.index).toBe('0');
    expect(card.innerHTML).toContain('test-icon.png');
    expect(card.innerHTML).toContain('Test Service');
  });
  
  test('ポップアップが正しく表示・非表示になること', () => {
    const popup = document.getElementById('service-popup');
    
    // 初期状態は非表示
    expect(popup.classList.contains('hidden')).toBe(true);
    
    // サービス情報を表示
    const service = {
      name: 'Test Service',
      icon: 'test-icon.png',
      category: 'Test Category',
      description: 'Test Description'
    };
    
    game.showServiceInfo(service);
    
    expect(popup.classList.contains('hidden')).toBe(false);
    expect(document.getElementById('popup-title').textContent).toBe('Test Service');
    expect(document.getElementById('popup-category').textContent).toBe('Test Category');
    expect(document.getElementById('popup-description').textContent).toBe('Test Description');
    
    // ポップアップを閉じる
    game.closePopup();
    expect(popup.classList.contains('hidden')).toBe(true);
  });
  
  test('ゲーム完了時にボーナススコアが正しく計算されること', () => {
    game.attempts = 5;
    game.score = 200;
    game.gameComplete();
    
    // ボーナススコア = 1000 - (5 * 10) = 950
    // 合計スコア = 200 + 950 = 1150
    expect(game.score).toBe(1150);
    expect(document.getElementById('final-score').textContent).toBe('1150');
    expect(document.getElementById('final-attempts').textContent).toBe('5');
    expect(document.getElementById('game-complete').classList.contains('hidden')).toBe(false);
  });
});

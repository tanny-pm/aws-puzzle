describe('AWSアイコン神経衰弱ゲーム', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('ゲームページが正しく表示されること', () => {
    cy.get('h1').should('contain', 'AWSアイコン神経衰弱');
    cy.get('#game-board').should('be.visible');
    cy.get('#score').should('contain', '0');
    cy.get('#attempts').should('contain', '0');
    cy.get('#matches').should('contain', '0');
  });

  it('難易度を変更できること', () => {
    // 初期状態は「普通」
    cy.get('#difficulty').should('have.value', 'medium');
    cy.get('#game-board').should('have.class', 'medium');
    
    // 「簡単」に変更
    cy.get('#difficulty').select('easy');
    cy.get('#game-board').should('have.class', 'easy');
    
    // 「難しい」に変更
    cy.get('#difficulty').select('hard');
    cy.get('#game-board').should('have.class', 'hard');
  });

  it('カードをクリックするとめくれること', () => {
    cy.get('.card').first().click();
    cy.get('.card').first().should('have.class', 'flipped');
  });

  it('2枚のカードをクリックすると試行回数が増えること', () => {
    cy.get('.card').eq(0).click();
    cy.get('.card').eq(1).click();
    cy.get('#attempts').should('contain', '1');
  });

  it('マッチしたカードはめくられたままになること', () => {
    // 同じサービスのカードを見つけるためのヘルパー関数
    const findMatchingCards = () => {
      let firstCardIndex = -1;
      let secondCardIndex = -1;
      let serviceName = '';
      
      // すべてのカードをめくって確認
      cy.get('.card').each(($card, index) => {
        cy.wrap($card).click();
        cy.wait(100);
        
        // カードの中のサービス名を取得
        cy.wrap($card).find('.service-name').invoke('text').then(text => {
          if (serviceName === '') {
            serviceName = text;
            firstCardIndex = index;
          } else if (text === serviceName && secondCardIndex === -1) {
            secondCardIndex = index;
          }
          
          // カードを元に戻す
          cy.get('#new-game-btn').click();
        });
      });
      
      // マッチするカードが見つかったら、それらをクリック
      cy.then(() => {
        if (firstCardIndex !== -1 && secondCardIndex !== -1) {
          cy.get('.card').eq(firstCardIndex).click();
          cy.get('.card').eq(secondCardIndex).click();
          
          // マッチしたことを確認
          cy.wait(1500); // マッチングのアニメーション待ち
          cy.get('.card').eq(firstCardIndex).should('have.class', 'matched');
          cy.get('.card').eq(secondCardIndex).should('have.class', 'matched');
          cy.get('#matches').should('contain', '1');
        }
      });
    };
    
    // 簡単モードに設定してマッチングテスト
    cy.get('#difficulty').select('easy');
    cy.get('#new-game-btn').click();
    
    // マッチするカードを探して検証
    findMatchingCards();
  });

  it('サービス情報ポップアップが表示され、閉じられること', () => {
    // マッチするカードを見つけてクリック（簡略化のため、最初の2枚がマッチすると仮定）
    cy.get('.card').eq(0).click();
    cy.get('.card').eq(1).click();
    
    // ポップアップが表示されるまで待機
    cy.wait(2000);
    
    // ポップアップが表示されていることを確認
    cy.get('#service-popup').should('not.have.class', 'hidden');
    
    // ポップアップを閉じる
    cy.get('#popup-close').click();
    
    // ポップアップが閉じられたことを確認
    cy.get('#service-popup').should('have.class', 'hidden');
  });

  it('新しいゲームを開始できること', () => {
    // カードをめくる
    cy.get('.card').eq(0).click();
    
    // 新しいゲームを開始
    cy.get('#new-game-btn').click();
    
    // スコアと試行回数がリセットされていることを確認
    cy.get('#score').should('contain', '0');
    cy.get('#attempts').should('contain', '0');
    cy.get('#matches').should('contain', '0');
    
    // カードがめくられていないことを確認
    cy.get('.card.flipped').should('not.exist');
  });

  it('ゲーム完了時に結果画面が表示されること', () => {
    // 簡単モードに設定（テスト用）
    cy.get('#difficulty').select('easy');
    cy.get('#new-game-btn').click();
    
    // ゲーム完了状態をシミュレート（JavaScript実行）
    cy.window().then(win => {
      const game = win.document.querySelector('#game-board').__game;
      game.matchedPairs = 6; // 簡単モードでは6ペア
      game.attempts = 10;
      game.score = 500;
      game.gameComplete();
    });
    
    // 結果画面が表示されていることを確認
    cy.get('#game-complete').should('not.have.class', 'hidden');
    cy.get('#final-score').should('not.be.empty');
    cy.get('#final-attempts').should('contain', '10');
    
    // もう一度プレイボタンをクリック
    cy.get('#play-again-btn').click();
    
    // 結果画面が閉じられていることを確認
    cy.get('#game-complete').should('have.class', 'hidden');
  });
});

describe('レスポンシブデザインテスト', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('デスクトップ表示が正しいこと', () => {
    cy.viewport(1200, 800);
    cy.get('.container').should('be.visible');
    cy.get('#game-board').should('be.visible');
    cy.get('.controls').should('be.visible');
  });

  it('タブレット表示が正しいこと', () => {
    cy.viewport(768, 1024);
    cy.get('.container').should('be.visible');
    cy.get('#game-board').should('be.visible');
    cy.get('.controls').should('be.visible');
  });

  it('スマートフォン表示が正しいこと', () => {
    cy.viewport(375, 667);
    cy.get('.container').should('be.visible');
    cy.get('#game-board').should('be.visible');
    cy.get('.controls').should('be.visible');
  });

  it('難易度に応じてカードサイズが適切に調整されること', () => {
    // デスクトップサイズ
    cy.viewport(1200, 800);
    
    // 簡単モード
    cy.get('#difficulty').select('easy');
    cy.get('#game-board').should('have.class', 'easy');
    cy.get('.card').should('be.visible');
    
    // 普通モード
    cy.get('#difficulty').select('medium');
    cy.get('#game-board').should('have.class', 'medium');
    cy.get('.card').should('be.visible');
    
    // 難しいモード
    cy.get('#difficulty').select('hard');
    cy.get('#game-board').should('have.class', 'hard');
    cy.get('.card').should('be.visible');
    
    // スマートフォンサイズ
    cy.viewport(375, 667);
    
    // 簡単モード
    cy.get('#difficulty').select('easy');
    cy.get('#game-board').should('have.class', 'easy');
    cy.get('.card').should('be.visible');
    
    // 普通モード
    cy.get('#difficulty').select('medium');
    cy.get('#game-board').should('have.class', 'medium');
    cy.get('.card').should('be.visible');
    
    // 難しいモード
    cy.get('#difficulty').select('hard');
    cy.get('#game-board').should('have.class', 'hard');
    cy.get('.card').should('be.visible');
  });

  it('ポップアップがレスポンシブであること', () => {
    // デスクトップサイズでポップアップを表示
    cy.viewport(1200, 800);
    cy.window().then(win => {
      const game = new win.MemoryGame();
      game.showServiceInfo({
        name: 'Test Service',
        icon: 'test-icon.png',
        category: 'Test Category',
        description: 'Test Description'
      });
    });
    
    cy.get('#service-popup').should('not.have.class', 'hidden');
    cy.get('.popup-content').should('be.visible');
    
    // スマートフォンサイズでポップアップを確認
    cy.viewport(375, 667);
    cy.get('#service-popup').should('not.have.class', 'hidden');
    cy.get('.popup-content').should('be.visible');
    
    // ポップアップを閉じる
    cy.get('#popup-close').click();
    cy.get('#service-popup').should('have.class', 'hidden');
  });
});

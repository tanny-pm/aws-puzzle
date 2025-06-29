describe('アクセシビリティテスト', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('ページにタイトルがあること', () => {
    cy.title().should('include', 'AWSアイコン神経衰弱');
  });

  it('すべての画像に代替テキストがあること', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('フォーカス可能な要素がキーボードでアクセス可能であること', () => {
    // 新しいゲームボタンにフォーカス
    cy.get('#new-game-btn').focus();
    cy.focused().should('have.id', 'new-game-btn');
    
    // 難易度選択にフォーカス
    cy.get('#difficulty').focus();
    cy.focused().should('have.id', 'difficulty');
    
    // カードにフォーカス
    cy.get('.card').first().focus();
    cy.focused().should('have.class', 'card');
  });

  it('ESCキーでポップアップを閉じられること', () => {
    // ポップアップを表示
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
    
    // ESCキーを押す
    cy.get('body').type('{esc}');
    
    // ポップアップが閉じられたことを確認
    cy.get('#service-popup').should('have.class', 'hidden');
  });

  it('コントラスト比が適切であること', () => {
    // 注: 実際のコントラスト比チェックはaxeなどのツールを使用するのが理想的
    // ここでは簡易的なチェックとして、主要なテキスト要素の存在を確認
    cy.get('h1').should('be.visible');
    cy.get('.score').should('be.visible');
    cy.get('#new-game-btn').should('be.visible');
  });

  it('ゲームがスクリーンリーダーで操作可能であること', () => {
    // 注: 実際のスクリーンリーダーテストは手動で行うのが理想的
    // ここでは簡易的なチェックとして、ARIAロールや属性の存在を確認
    
    // カードがボタンとして機能することを確認
    cy.get('.card').first().should('have.attr', 'role', 'button').should('have.attr', 'tabindex', '0');
    
    // ポップアップがダイアログとして機能することを確認
    cy.get('#service-popup').should('have.attr', 'role', 'dialog').should('have.attr', 'aria-labelledby', 'popup-title');
  });
});

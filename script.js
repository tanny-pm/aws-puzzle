class MemoryGame {
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
        
        // ポップアップ要素
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
        
        this.initEventListeners();
        this.closePopup(); // 初期化時にポップアップを確実に閉じる
        this.loadAWSServices().then(() => {
            this.startNewGame();
        });
    }
    
    async loadAWSServices() {
        try {
            const response = await fetch('aws-services.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            this.awsServices = this.parseCSV(csvText);
            console.log(`CSVから${this.awsServices.length}個のサービスを読み込みました`);
        } catch (error) {
            console.warn('CSVファイルの読み込みに失敗しました:', error);
            console.log('デフォルトのサービスリストを使用します');
            // フォールバック: デフォルトのサービスリストを使用
            this.awsServices = this.getDefaultAWSServices();
        }
    }
    
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) {
            console.warn('CSVファイルが空または不正です');
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
                // 必要なフィールドがすべて存在するかチェック
                if (service.name && service.category && service.icon && service.description) {
                    services.push(service);
                }
            }
        }
        
        console.log(`パースされたサービス数: ${services.length}`);
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
    
    getDefaultAWSServices() {
        // CSVが読み込めない場合のフォールバック（24個のサービス）
        return [
            {
                name: 'Amazon EC2',
                category: 'Compute',
                icon: 'Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_Amazon-EC2_64.png',
                description: '仮想サーバーを提供するクラウドコンピューティングサービス。スケーラブルで柔軟なコンピューティング容量を提供し、様々なアプリケーションを実行できます。'
            },
            {
                name: 'AWS Lambda',
                category: 'Compute',
                icon: 'Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_AWS-Lambda_64.png',
                description: 'サーバーレスコンピューティングサービス。コードを実行するためのサーバーの管理が不要で、イベント駆動型のアプリケーションを構築できます。'
            },
            {
                name: 'Amazon S3',
                category: 'Storage',
                icon: 'Architecture-Service-Icons_02072025/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.png',
                description: 'オブジェクトストレージサービス。Webサイト、アプリケーション、バックアップ、アーカイブなど、あらゆる用途でデータを保存・取得できます。'
            },
            {
                name: 'Amazon RDS',
                category: 'Database',
                icon: 'Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-RDS_64.png',
                description: 'マネージドリレーショナルデータベースサービス。MySQL、PostgreSQL、Oracle、SQL Serverなどの主要なデータベースエンジンをサポートします。'
            },
            {
                name: 'Amazon DynamoDB',
                category: 'Database',
                icon: 'Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-DynamoDB_64.png',
                description: 'フルマネージドNoSQLデータベースサービス。高速で予測可能なパフォーマンスとシームレスなスケーラビリティを提供します。'
            },
            {
                name: 'Amazon VPC',
                category: 'Networking',
                icon: 'Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Amazon-Virtual-Private-Cloud_64.png',
                description: '仮想プライベートクラウド。AWS内に論理的に分離されたネットワーク環境を作成し、リソースを安全に配置できます。'
            },
            {
                name: 'Amazon CloudFront',
                category: 'Networking',
                icon: 'Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Amazon-CloudFront_64.png',
                description: 'コンテンツ配信ネットワーク（CDN）サービス。世界中のエッジロケーションを通じて、低レイテンシでコンテンツを配信します。'
            },
            {
                name: 'AWS Elastic Beanstalk',
                category: 'Compute',
                icon: 'Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_AWS-Elastic-Beanstalk_64.png',
                description: 'アプリケーションデプロイメントサービス。コードをアップロードするだけで、容量プロビジョニング、負荷分散、自動スケーリングを自動的に処理します。'
            },
            {
                name: 'Amazon API Gateway',
                category: 'Networking',
                icon: 'Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Amazon-API-Gateway_64.png',
                description: 'APIの作成、公開、維持、監視、保護を行うフルマネージドサービス。RESTful APIとWebSocket APIをサポートします。'
            },
            {
                name: 'Amazon ElastiCache',
                category: 'Database',
                icon: 'Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-ElastiCache_64.png',
                description: 'インメモリキャッシングサービス。RedisとMemcachedをサポートし、アプリケーションのパフォーマンスを向上させます。'
            },
            {
                name: 'Amazon Route 53',
                category: 'Networking',
                icon: 'Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Amazon-Route-53_64.png',
                description: 'スケーラブルなDNSウェブサービス。ドメイン名をIPアドレスに変換し、トラフィックルーティングを管理します。'
            },
            {
                name: 'EC2 Auto Scaling',
                category: 'Compute',
                icon: 'Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_Amazon-EC2-Auto-Scaling_64.png',
                description: 'EC2インスタンスの自動スケーリングサービス。需要に応じてインスタンス数を自動的に調整し、可用性とコスト効率を最適化します。'
            },
            {
                name: 'Amazon EBS',
                category: 'Storage',
                icon: 'Architecture-Service-Icons_02072025/Arch_Storage/64/Arch_Amazon-Elastic-Block-Store_64.png',
                description: 'EC2インスタンス用の永続的ブロックストレージ。高性能で耐久性があり、様々なワークロードに対応できます。'
            },
            {
                name: 'Amazon EFS',
                category: 'Storage',
                icon: 'Architecture-Service-Icons_02072025/Arch_Storage/64/Arch_Amazon-EFS_64.png',
                description: 'フルマネージドNFSファイルシステム。複数のEC2インスタンスから同時にアクセス可能な共有ストレージを提供します。'
            },
            {
                name: 'AWS Backup',
                category: 'Storage',
                icon: 'Architecture-Service-Icons_02072025/Arch_Storage/64/Arch_AWS-Backup_64.png',
                description: 'AWSサービス全体でバックアップを一元化・自動化するサービス。データ保護とコンプライアンス要件を満たします。'
            },
            {
                name: 'Elastic Load Balancing',
                category: 'Networking',
                icon: 'Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Elastic-Load-Balancing_64.png',
                description: 'アプリケーショントラフィックを複数のターゲットに自動的に分散するサービス。高可用性とフォルトトレラント性を提供します。'
            },
            {
                name: 'AWS Direct Connect',
                category: 'Networking',
                icon: 'Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_AWS-Direct-Connect_64.png',
                description: 'オンプレミスからAWSへの専用ネットワーク接続サービス。一貫したネットワークパフォーマンスと帯域幅を提供します。'
            },
            {
                name: 'AWS Transit Gateway',
                category: 'Networking',
                icon: 'Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_AWS-Transit-Gateway_64.png',
                description: 'VPCとオンプレミスネットワークを相互接続するネットワークハブ。複雑なネットワーク構成を簡素化します。'
            },
            {
                name: 'Amazon Aurora',
                category: 'Database',
                icon: 'Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-Aurora_64.png',
                description: 'MySQL・PostgreSQL互換の高性能リレーショナルデータベース。従来のデータベースより最大5倍高速で、クラウドネイティブな設計です。'
            },
            {
                name: 'Amazon Neptune',
                category: 'Database',
                icon: 'Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-Neptune_64.png',
                description: 'フルマネージドグラフデータベースサービス。高度に接続されたデータセットを扱うアプリケーションの構築に最適です。'
            },
            {
                name: 'Amazon DocumentDB',
                category: 'Database',
                icon: 'Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-DocumentDB_64.png',
                description: 'MongoDB互換のドキュメントデータベースサービス。JSONデータの保存、クエリ、インデックス作成を簡単に行えます。'
            },
            {
                name: 'Amazon Timestream',
                category: 'Database',
                icon: 'Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-Timestream_64.png',
                description: '時系列データ専用のフルマネージドデータベース。IoTアプリケーションや運用メトリクスの保存・分析に最適です。'
            },
            {
                name: 'AWS Batch',
                category: 'Compute',
                icon: 'Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_AWS-Batch_64.png',
                description: 'バッチコンピューティングジョブを効率的に実行するサービス。数百、数千のコンピューティングジョブを動的にスケールします。'
            },
            {
                name: 'AWS App Runner',
                category: 'Compute',
                icon: 'Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_AWS-App-Runner_64.png',
                description: 'コンテナ化されたWebアプリケーションとAPIを簡単にデプロイ・実行できるサービス。インフラ管理が不要です。'
            }
        ];
    }
    
    initEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.playAgainBtn.addEventListener('click', () => this.startNewGame());
        this.difficultySelect.addEventListener('change', () => this.startNewGame());
        
        // ポップアップ関連のイベントリスナー
        this.popupClose.addEventListener('click', () => this.closePopup());
        this.servicePopup.addEventListener('click', (e) => {
            if (e.target === this.servicePopup) {
                this.closePopup();
            }
        });
        
        // ESCキーでポップアップを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePopup();
            }
        });
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
    
    startNewGame() {
        this.gameCompleteDiv.classList.add('hidden');
        this.closePopup();
        this.resetGameState();
        this.createGameBoard();
        this.updateUI();
    }
    
    resetGameState() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.score = 0;
        this.isProcessing = false;
    }
    
    createGameBoard() {
        const { pairs, className } = this.getDifficultySettings();
        
        console.log(`利用可能なサービス数: ${this.awsServices.length}, 必要なペア数: ${pairs}`);
        
        if (this.awsServices.length < pairs) {
            alert(`サービス数が不足しています。現在${this.awsServices.length}個のサービスがありますが、${pairs}個必要です。CSVファイルを確認してください。`);
            return;
        }
        
        // ランダムにサービスを選択
        const selectedServices = this.shuffleArray([...this.awsServices]).slice(0, pairs);
        console.log('選択されたサービス:', selectedServices.map(s => s.name));
        
        // カードペアを作成
        const cardData = [];
        selectedServices.forEach((service, index) => {
            cardData.push({ ...service, id: index * 2 });
            cardData.push({ ...service, id: index * 2 + 1 });
        });
        
        // カードをシャッフル
        const shuffledCards = this.shuffleArray(cardData);
        
        // ゲームボードをクリア
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = `game-board ${className}`;
        
        // カードを作成
        shuffledCards.forEach((cardInfo, index) => {
            const card = this.createCard(cardInfo, index);
            this.gameBoard.appendChild(card);
            this.cards.push({
                element: card,
                service: cardInfo,
                isFlipped: false,
                isMatched: false
            });
        });
        
        this.totalPairsElement.textContent = pairs;
    }
    
    createCard(cardInfo, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-front">
                AWS
            </div>
            <div class="card-back">
                <img src="${cardInfo.icon}" alt="${cardInfo.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="service-name" style="display:none;">${cardInfo.name}</div>
                <div class="service-name">${cardInfo.name}</div>
            </div>
        `;
        
        card.addEventListener('click', () => this.handleCardClick(index));
        
        return card;
    }
    
    handleCardClick(index) {
        if (this.isProcessing) return;
        
        const card = this.cards[index];
        if (card.isFlipped || card.isMatched) return;
        
        this.flipCard(card);
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.isProcessing = true;
            this.attempts++;
            this.updateUI();
            
            setTimeout(() => {
                this.checkForMatch();
            }, 1000);
        }
    }
    
    flipCard(card) {
        card.isFlipped = true;
        card.element.classList.add('flipped');
    }
    
    unflipCard(card) {
        card.isFlipped = false;
        card.element.classList.remove('flipped');
    }
    
    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.service.name === card2.service.name) {
            // マッチした場合
            this.handleMatch(card1, card2);
        } else {
            // マッチしなかった場合
            this.unflipCard(card1);
            this.unflipCard(card2);
        }
        
        this.flippedCards = [];
        this.isProcessing = false;
        
        // ゲーム完了チェック
        if (this.matchedPairs === this.getDifficultySettings().pairs) {
            setTimeout(() => {
                this.gameComplete();
            }, 500);
        }
    }
    
    handleMatch(card1, card2) {
        card1.isMatched = true;
        card2.isMatched = true;
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        
        // マッチしたカードは表のままにする（flippedクラスを維持）
        card1.element.classList.add('flipped');
        card2.element.classList.add('flipped');
        
        this.matchedPairs++;
        this.score += 100;
        this.updateUI();
        
        // マッチ成功時にポップアップを表示
        setTimeout(() => {
            this.showServiceInfo(card1.service);
        }, 800);
    }
    
    showServiceInfo(service) {
        this.popupIcon.src = service.icon;
        this.popupIcon.alt = service.name;
        this.popupTitle.textContent = service.name;
        this.popupCategory.textContent = service.category;
        this.popupDescription.textContent = service.description;
        
        this.servicePopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // スクロールを無効化
    }
    
    closePopup() {
        this.servicePopup.classList.add('hidden');
        document.body.style.overflow = ''; // スクロールを有効化
    }
    
    gameComplete() {
        const bonusScore = Math.max(0, 1000 - (this.attempts * 10));
        this.score += bonusScore;
        
        this.finalScoreElement.textContent = this.score;
        this.finalAttemptsElement.textContent = this.attempts;
        this.gameCompleteDiv.classList.remove('hidden');
        
        this.updateUI();
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.attemptsElement.textContent = this.attempts;
        this.matchesElement.textContent = this.matchedPairs;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});

# AWS アイコン神経衰弱ゲーム

AWSサービスのアイコンを覚えるための神経衰弱ゲームです。

## 🎮 ゲームの特徴

- **3つの難易度レベル**
  - 簡単: 4×3 (6ペア)
  - 普通: 4×4 (8ペア)
  - 難しい: 6×4 (12ペア)

- **学習機能**
  - マッチ成功時にサービス情報ポップアップ表示
  - サービス名、アイコン、カテゴリ、概要を表示
  - 効果的な学習をサポート

- **スコアシステム**
  - マッチ成功: +100ポイント
  - ゲーム完了ボーナス: 最大1000ポイント（試行回数に応じて減少）

- **レスポンシブデザイン**
  - デスクトップ、タブレット、スマートフォンに対応

## 🚀 プレイ方法

1. 難易度を選択
2. カードをクリックしてめくる
3. 2枚のカードが同じAWSサービスの場合、マッチ成功
4. マッチ成功時にサービス情報ポップアップが表示される
5. すべてのペアを見つけてゲームクリア！

## 📱 対応デバイス

- デスクトップブラウザ
- タブレット
- スマートフォン

## 🛠 技術仕様

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- CSV形式でのデータ管理
- レスポンシブWebデザイン

## 📦 含まれるAWSサービス

### Compute
- Amazon EC2
- AWS Lambda
- AWS Elastic Beanstalk
- EC2 Auto Scaling
- AWS Batch
- AWS App Runner

### Storage
- Amazon S3
- Amazon EBS
- Amazon EFS
- AWS Backup

### Database
- Amazon RDS
- Amazon DynamoDB
- Amazon ElastiCache
- Amazon Aurora
- Amazon Neptune
- Amazon DocumentDB
- Amazon Timestream

### Networking
- Amazon VPC
- Amazon CloudFront
- Amazon API Gateway
- Amazon Route 53
- Elastic Load Balancing
- AWS Direct Connect
- AWS Transit Gateway

## 🎯 学習効果

このゲームを通じて以下のスキルが向上します：

- AWSアイコンの視覚的記憶
- サービス名とアイコンの関連付け
- AWSサービスカテゴリの理解
- 各サービスの基本的な概要の習得

## 🔧 セットアップ

1. リポジトリをクローン
2. ブラウザで `index.html` を開く
3. ゲーム開始！

## 📝 サービス情報の編集

サービス情報は `aws-services.csv` ファイルで管理されています。

### CSVファイルの構造
```csv
name,category,icon,description
Amazon EC2,Compute,Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_Amazon-EC2_64.png,"サービスの概要..."
```

### 編集方法
1. `csv-editor.html` をブラウザで開く
2. GUIエディタでサービス情報を追加・編集
3. CSVを生成してコピー
4. `aws-services.csv` ファイルに保存

または、直接 `aws-services.csv` ファイルをテキストエディタで編集することも可能です。

## 📄 ファイル構成

- `index.html` - メインゲーム
- `style.css` - スタイルシート
- `script.js` - ゲームロジック
- `aws-services.csv` - サービス情報データ
- `csv-editor.html` - サービス情報編集ツール
- `aws-icons/` - 必要なAWSアイコン（64px）

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

AWSアイコンはAmazon Web Services, Inc.の商標です。

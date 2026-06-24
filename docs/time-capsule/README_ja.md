# TimeCapsule

TimeCapsuleは、KotlinとJetpack Composeで構築されたAndroidのメモ管理アプリです。引用・アイデア・参考メモを著者・出典・タグ・カテゴリなどのメタデータとともに保存し、スコアベースおよびタイムライン形式で振り返ることができます。

## 機能概要

- メモの作成・編集・閲覧・削除
- タイトル・著者・出典・URL・ページ・タグ・カテゴリなどのメタデータを記録
- フィルターと並び替えによるメモの整理
- 閲覧回数の記録と時間経過に基づくシンプルな関連度スコアの算出
- 起動時の動作とアプリテーマのカスタマイズ
- RoomおよびDataStoreによるローカルデータ永続化

## 使用技術

- Kotlin
- Android SDK
- Jetpack Compose
- Material 3
- Room Database
- DataStore Preferences
- Gradle with Kotlin DSL

## プロジェクト構成

- app/src/main/java/com/example/timecapsule/data: Roomエンティティ、DAOインターフェース、リポジトリ、設定管理
- app/src/main/java/com/example/timecapsule/ui: Composeベースの画面およびUIコンポーネント
- app/src/main/res: Androidリソース、drawable、文字列リソース
- app/src/test: ユニットテスト
- app/src/androidTest: インストルメンテーションテスト

## セットアップ

1. Android StudioまたはAndroid SDKをインストール
2. Android Studioでプロジェクトを開く
3. Gradleファイルを同期してビルドを完了させる
4. エミュレーターまたは実機でアプリを起動

## 補足

このアプリは、Roomを通じてローカルSQLiteデータベースを利用し、起動時の動作やテーマなどのユーザー設定をDataStoreに保存します。現在のUIはメインのメモ一覧画面を中心に構成されており、メモの閲覧・編集・削除はダイアログ経由で行います。

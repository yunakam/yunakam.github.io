# 多言語一括翻訳アプリ

入力／ペーストしたテキストを複数の言語に同時翻訳するAndroidアプリです。  
DeepL APIを使用し、直感的なUIで素早く多言語翻訳を実現します。

## 機能概要

- **多言語同時翻訳** — 翻訳パネルを複数追加し、1タップで全言語に一括翻訳
- **ソース言語の選択** — 自動検出または手動で入力言語を指定
- **スワイプ削除 & Undo** — パネルを右スワイプで削除、Snackbarから復元可能
- **クイック追加（お気に入り）** — よく使う言語をピン留めしてワンタップで追加
- **ベータ言語の有効化** — 設定からDeepLのベータ対応言語を追加で使用可能
- **フォントサイズ調整** — 設定ドロワーからフォントサイズを変更
- **設定の永続化** — 選択中の言語パネル・クイック追加・フォントサイズをDataStoreで保存
- **APIキー管理** — 初回起動時にDeepL APIキーを入力、設定画面からいつでも変更可能

## 使用技術

| カテゴリ   | ライブラリ / API            | 選定理由                                             |
| ---------- | --------------------------- | ---------------------------------------------------- |
| UI         | Jetpack Compose + Material3 | 状態駆動UIで複数パネルの動的追加・削除が容易         |
| 翻訳       | DeepL API                   | 高精度な翻訳品質、ベータ言語を含む広い言語対応       |
| 状態管理   | StateFlow / SharedFlow      | Composeとの相性が良く、コルーチンとシームレスに統合  |
| 永続化     | Jetpack DataStore           | 非同期・Flowベースでスレッドセーフな設定保存         |
| 非同期処理 | Kotlin Coroutines           | ViewModelScopeで安全なライフサイクル管理             |
| DI（手動） | ViewModelFactory            | シンプルな規模のため外部DIライブラリを使わず手動注入 |

## 実装ポイント

### 1. 差分翻訳による無駄なAPIコール削減

翻訳実行時、ソーステキストが前回から変わっていない場合は未翻訳パネルのみAPIを呼び出す設計にしています。これにより、言語パネルを追加した際などにAPIコールを最小限に抑えています。

```kotlin
val isSourceChanged = currentState.sourceText != lastTranslatedSourceText
val shouldTranslate = isSourceChanged || panel.translatedText.isEmpty()
```

### 2. 削除 & Undo パターン

パネル削除時に`lastDeletedPanel`と挿入位置インデックスを保持し、Snackbarのアクションから完全に元の位置へ復元します。`MutableSharedFlow`でViewModelからUI（Snackbar表示）への一方向イベント通知を実装しています。

### 3. UIイベントの分離設計

画面遷移やSnackbar表示などの「一度きりのイベント」はStateFlowでなくSharedFlowで管理しています。これにより画面回転時などにイベントが再発火する問題を防いでいます。

```kotlin
sealed interface UiEvent {
    data class ShowUndoSnackbar(val panelName: String) : UiEvent
}
private val _eventFlow = MutableSharedFlow<UiEvent>()
```

## ユーザーセットアップ

1. [DeepL API](https://www.deepl.com/pro-api) でAPIキーを取得（無料プランあり）
2. アプリをインストールして起動
3. 初回起動時にAPIキーを入力
4. 翻訳したいテキストを入力し、言語パネルを追加して「翻訳」ボタンをタップ

## 動作環境

- Android 8.0 (API 26) 以上

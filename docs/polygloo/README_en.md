# Multi-Language Bulk Translator

An Android app that simultaneously translates entered or pasted text into multiple languages.  
Powered by the DeepL API, it delivers fast multi-language translation through an intuitive UI.

## Features

- **Simultaneous multi-language translation** — Add multiple translation panels and translate to all languages in one tap
- **Source language selection** — Auto-detect or manually specify the input language
- **Swipe to delete & Undo** — Swipe a panel right to remove it; restore it via Snackbar
- **Quick Add (favorites)** — Pin frequently used languages for one-tap access
- **Beta language support** — Enable DeepL beta languages from settings
- **Font size adjustment** — Change font size from the settings drawer
- **Persistent settings** — Active language panels, quick-add languages, and font size saved via DataStore
- **API key management** — Enter your DeepL API key on first launch; update it anytime in settings

## Tech Stack

| Category         | Library / API               | Reason for choice                                                             |
| ---------------- | --------------------------- | ----------------------------------------------------------------------------- |
| UI               | Jetpack Compose + Material3 | State-driven UI makes dynamic panel addition and removal straightforward      |
| Translation      | DeepL API                   | High translation quality with broad language support including beta languages |
| State management | StateFlow / SharedFlow      | Seamless integration with Compose and Kotlin Coroutines                       |
| Persistence      | Jetpack DataStore           | Asynchronous, Flow-based, thread-safe settings storage                        |
| Async            | Kotlin Coroutines           | Safe lifecycle management via ViewModelScope                                  |
| DI (manual)      | ViewModelFactory            | Manual constructor injection suits the project's simple scale                 |

## Implementation Highlights

### 1. Differential Translation to Reduce API Calls

When translating, only panels that have not yet been translated (or whose source text has changed) make an API call. This minimizes unnecessary requests when adding a new language panel.

```kotlin
val isSourceChanged = currentState.sourceText != lastTranslatedSourceText
val shouldTranslate = isSourceChanged || panel.translatedText.isEmpty()
```

### 2. Delete & Undo Pattern

On panel deletion, `lastDeletedPanel` and its original index are stored in memory. The Snackbar action restores the panel to its exact original position. A `MutableSharedFlow` handles one-way event notification from the ViewModel to the UI (Snackbar display).

### 3. UI Event Isolation via SharedFlow

One-shot events such as Snackbar triggers and screen transitions are managed via `SharedFlow` rather than `StateFlow`. This prevents events from re-firing on configuration changes such as screen rotation.

```kotlin
sealed interface UiEvent {
    data class ShowUndoSnackbar(val panelName: String) : UiEvent
}
private val _eventFlow = MutableSharedFlow<UiEvent>()
```

## User Setup

1. Obtain an API key from [DeepL API](https://www.deepl.com/pro-api) (free plan available)
2. Install and launch the app
3. Enter your API key on first launch
4. Type or paste text, add language panels, and tap the Translate button

## Requirements

- Android 8.0 (API 26) or higher

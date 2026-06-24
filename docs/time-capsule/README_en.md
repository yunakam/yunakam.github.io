# TimeCapsule

TimeCapsule is an Android note-taking app built with Kotlin and Jetpack Compose. It helps you save quotations, ideas, and reference notes with metadata such as author, source, tags, and category, then revisit them through a score-based and timeline-oriented experience.

## Features

- Create, edit, view, and delete notes
- Store note metadata including title, author, source, URL, page, tags, and category
- Organize notes by filters and sort order
- Track visits and calculate a simple relevance score over time
- Customize startup behavior and app theme
- Persist data locally with Room and DataStore

## Tech Stack

- Kotlin
- Android SDK
- Jetpack Compose
- Material 3
- Room Database
- DataStore Preferences
- Gradle with Kotlin DSL

## Project Structure

- app/src/main/java/com/example/timecapsule/data: Room entities, DAO interfaces, repository, and preferences handling
- app/src/main/java/com/example/timecapsule/ui: Compose-based screens and UI components
- app/src/main/res: Android resources, drawables, and string values
- app/src/test: unit tests
- app/src/androidTest: instrumentation tests

## Getting Started

1. Install Android Studio or the Android SDK.
2. Open the project in Android Studio.
3. Sync Gradle files and let the project build.
4. Run the app on an emulator or physical device.

## Notes

The app uses a local SQLite database through Room and stores user preferences such as startup behavior and theme in DataStore. The current UI is centered around a main note list with dialogs for viewing, editing, and deleting notes.

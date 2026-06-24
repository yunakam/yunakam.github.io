# Stamp Calculator

An Android app that instantly suggests the fewest-stamp combination by simply entering available stamps and a target postage amount.  
Designed to support quick decisions in seconds — right before mailing or at the post office counter.

## Features

- **Optimal combination calculation** — Enter a target amount and available stamp denominations/quantities to find the fewest-stamp solution
- **Multi-criteria optimization** — Prioritizes fewest stamps; breaks ties by minimizing overpayment, then total amount
- **Maximum stamp count constraint** — Optionally limit the number of stamps used
- **Fully offline** — All calculations run on-device (no internet connection required)
- **Fast calculation** — Under 100ms for targets ≤ ¥3,000 with ≤ 20 stamp types
- **Share results** — Copy results to clipboard for sharing

## Tech Stack

| Category    | Library / Module                                | Reason for choice                                                               |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| UI          | Jetpack Compose + Material3                     | State-driven UI makes toggling between input and results straightforward        |
| Logic       | `core` module (standalone)                      | Solver implemented independently from the UI, enabling fast isolated unit tests |
| Algorithm   | Dynamic programming (bounded coin optimization) | Solves the bounded knapsack problem efficiently given finite stamp quantities   |
| Persistence | Jetpack DataStore                               | Asynchronous, Flow-based, thread-safe settings storage                          |

## Implementation Highlights

### 1. Bounded Coin Optimization via Dynamic Programming

Because stamps have finite quantities (e.g., one, two per denomination), the problem is modeled as a bounded knapsack problem and solved with DP rather than a simple greedy approach. This keeps computation under 100ms for targets ≤ ¥3,000 with ≤ 20 types, preventing any UI blocking.

### 2. Multi-Criteria Optimization

Beyond minimizing stamp count, the solver applies a three-tier priority: fewest stamps → least overpayment → smallest total amount. This ensures results feel intuitive and practical to users, not just mathematically optimal.

### 3. Logic Isolation via the `core` Module

The solver is extracted into a `core` module with no dependency on the Android framework. This allows unit tests to run on the JVM alone, keeping the test cycle fast and independent of device or emulator setup.

## User Setup

1. Install and launch the app
2. Enter the target postage amount
3. Add your available stamp denominations and quantities
4. Tap the Calculate button to view the optimal combination

## Requirements

- Android 8.0 (API 26) or higher

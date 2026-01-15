# Cocos React Native Challenge

Mobile application developed with **React Native + Expo** as part of the Cocos technical challenge.

The goal of the project is to build a small trading-like mobile app that consumes multiple API endpoints provided for the challenge, displays market and portfolio information, and allows users to place buy/sell orders.

---

## 🚀 Tech Stack

- **React Native**
- **Expo (Managed Workflow)**
- **TypeScript**
- **React Navigation**
- **TanStack Query (React Query)**
- **Axios**
- **Jest / React Native Testing Library**

---

## 📱 Features

- Instruments list with market data and calculated returns
- Portfolio overview with market value, gains and performance
- Asset search by ticker
- Order creation (BUY / SELL, MARKET / LIMIT)
- Proper handling of loading, error and empty states

---

## 🧠 Technical Decisions

### Expo
Expo was chosen to speed up development, reduce configuration overhead and focus on product and user experience rather than native setup. The managed workflow provides everything needed for this challenge while remaining production-ready.

### State & Data Management
Server state is handled using **TanStack Query**, allowing:
- Caching and automatic refetching
- Clear loading and error states
- Separation between server state and UI state

Local component state is used only when necessary (e.g. form state).

### Project Structure
The project is structured by responsibility (screens, components, api, utils) to keep concerns separated and make the codebase easy to scale and maintain.

### Calculations
Financial calculations and UI formatting are separated to keep business logic isolated from presentation concerns
Also the portfolio endpoint returns multiple entries per instrument (representing different acquisition lots). For UI purposes, positions are consolidated by instrument to display total quantity, weighted average cost, and aggregated performance.
Since the provided API is a dummy endpoint, responses may change between requests
---

## 🛠️ Setup & Run Locally

### Prerequisites
- Node.js (>= 18)
- npm or yarn (I'd rather yarn)
- Expo CLI

### Install dependencies
```bash
npm install
# or
yarn install
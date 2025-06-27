# 🏏 Player Auction Automation using Google Apps Script

This project automates a **real-time player auction system** using **Google Sheets** and **Google Apps Script**. 
It randomly selects players, manages team bidding, updates sheet data,
and handles both "Sold" and "Unsold" cases — ideal for fantasy leagues, cricket tournaments, or classroom simulations.

---

## 📌 Features

- 🎲 Randomly selects an **unsold player** from a list
- 💰 Supports **real-time bidding** by 4 teams
- ✅ Marks a player as **sold** to a team or **unsold** if skipped
- 🔁 Automatically moves to the **next player**
- 📊 Updates data in two sheets: `Players_List` and `Auction_`

---

## 🧠 How It Works

### 1. `nextRandomPlayer()`
- Picks a random unsold player from `Players_List!A2:A55`
- Displays player name and base price on `Auction_!C24` and `C26`
- Clears previous bid (`C27`) and bidder (`C28`)

### 2. `bidOnPlayerFromTeamA/B/C/D()`
- Uses the corresponding team's name and budget cell (e.g., `A1`, `C1` for Team A)
- Increments current bid by ₹1,00,000
- Sets new bid amount in `C27`, and team name in `C28`
- Checks if team has enough balance

### 3. `markPlayerAsSold()`
- Confirms valid bid exists
- Updates:
  - Player's status to `"Sold"` in `Players_List!E`
  - Sold team and final price in `Players_List!F` and `C`
  - Team's purchase list in `Auction_`
- Clears bid info and moves to next player

### 4. `markPlayerAsUnsold()`
- Marks player as `"Not Interested"` in `Players_List`
- Clears current bid
- Skips to next random player

---

## 📋 Google Sheet Layout

### ▶️ Sheet: `Players_List`

| Column | Content             |
|--------|----------------------|
| A      | Player Name          |
| B      | Base Price (₹)       |
| C      | Final Sale Price (₹) |
| E      | Status (`Sold`, `Unsold`, `Not Interested`) |
| F      | Sold To (Team Name)  |

---

### ▶️ Sheet: `Auction_`

| Cell    | Description                   |
|---------|-------------------------------|
| C24     | Current Player Name           |
| C26     | Base Price                    |
| C27     | Current Bid                   |
| C28     | Current Highest Bidder (Team) |
| M24–M26 | Recently Sold Player Summary  |
| A1/C1   | Team A Name & Balance         |
| E1/G1   | Team B Name & Balance         |
| I1/K1   | Team C Name & Balance         |
| M1/O1   | Team D Name & Balance         |

---

## 🛠 Technologies Used

- **Google Sheets**
- **Google Apps Script**

---

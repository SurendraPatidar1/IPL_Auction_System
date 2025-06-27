function nextRandomPlayer() {
  var playerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Players_List");
  var auctionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Auction_");

  var players = playerSheet.getRange('A2:A55').getValues();
  var statuses = playerSheet.getRange('E2:E55').getValues();
  var basePrices = playerSheet.getRange('B2:B55').getValues();

  var unsoldIndices = [];

  for (var i = 0; i < statuses.length; i++) {
    if (statuses[i][0] === "Unsold") {
      unsoldIndices.push(i);
    }
  }

//  it checks whether there are any unsold players left.
  if (unsoldIndices.length === 0) {  // it means all players are sold.
    SpreadsheetApp.getActiveSpreadsheet().toast("No unsold players left!");
    return;
  }

  var randomIndex = unsoldIndices[Math.floor(Math.random() * unsoldIndices.length)];
  var nextPlayerName = players[randomIndex][0];
  var nextPlayerPrice = basePrices[randomIndex][0];

  // Update the "Auction_" sheet
  auctionSheet.getRange("C24").setValue(nextPlayerName);
  auctionSheet.getRange("C26").setValue(nextPlayerPrice);

  // Clear previous bid and bidder
  auctionSheet.getRange("C27").clearContent();
  auctionSheet.getRange("C28").clearContent();

  SpreadsheetApp.getActiveSpreadsheet().toast(nextPlayerName + " is now in focus with base price ₹" + nextPlayerPrice);
}


function bidOnPlayer(teamNameCell , teamBalanceCell) {
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
   var incrementAmount = 100000;
   var currentPrice = sheet.getRange("C27").getValue();

   if(currentPrice == 0){
     currentPrice = sheet.getRange("C26").getValue() - incrementAmount;
   }
   else{
     currentPrice = sheet.getRange("C27").getValue();
   }

   var budget = sheet.getRange(teamBalanceCell).getValue();
   var teamName = sheet.getRange(teamNameCell).getValue();

   if(budget < currentPrice + incrementAmount){
     SpreadsheetApp.getActiveSpreadsheet().toast(teamName + " does not have enough budget");
     return;
   }

   Logger.log("Current Price: " + currentPrice + ", Budget: " + budget);

  //  Increase the bid amount and increase the sheet ..
  sheet.getRange("C27").setValue(currentPrice + incrementAmount);
  sheet.getRange("C28").setValue(teamName);

}

function bidOnPlayerFromTeamA() {
   teamNameCell = "A1";
   teamBalanceCell = "C1";

   if (!teamNameCell || !teamBalanceCell) {
     SpreadsheetApp.getActiveSpreadsheet().toast("Invalid team cell references");
     return;
   }

   bidOnPlayer(teamNameCell, teamBalanceCell);
}

function bidOnPlayerFromTeamB() {
   teamNameCell = "E1";
   teamBalanceCell = "G1";
   bidOnPlayer(teamNameCell, teamBalanceCell);
}

function bidOnPlayerFromTeamC() {
   teamNameCell = "I1";
   teamBalanceCell = "K1";
   bidOnPlayer(teamNameCell, teamBalanceCell);
}

function bidOnPlayerFromTeamD() {
   teamNameCell = "M1";
   teamBalanceCell = "O1";
   bidOnPlayer(teamNameCell, teamBalanceCell);
}


function markPlayerAsSold() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var auctionSheet = sheet.getSheetByName("Auction_");
  var playerSheet = sheet.getSheetByName("Players_List");

  var playerName = auctionSheet.getRange("C24").getValue(); //player in Focus
  var soldTo = auctionSheet.getRange("C28").getValue();// Team that won bid...
  var salePrice = parseFloat(auctionSheet.getRange("C27").getValue()); // Final Price

  if (!playerName || !soldTo || !salePrice) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Please ensure a valid bid and team has been placed before selling.");
    return;
  }

   // CHECK: If player is already marked as "Unsold" in Players_List, then block sale
  var data = playerSheet.getRange("A2:A55").getValues();
  var status = playerSheet.getRange("E2:E55").getValues();
  var isUnsold = false;

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == playerName && status[i][0] == "Not Intersted") {
      isUnsold = true;
      break;
    }
  }

  if (isUnsold) {
    SpreadsheetApp.getActiveSpreadsheet().toast(playerName + " was already marked as Not Intersted. You cannot sell this player again.");
    return;
  }

  auctionSheet.getRange("M24").setValue(playerName);
  auctionSheet.getRange("M25").setValue(soldTo);
  auctionSheet.getRange("M26").setValue(salePrice);

  auctionSheet.getRange("C27").clearContent();
  auctionSheet.getRange("C28").clearContent();

// Update Player's Status and Sale Info in Players_List
  for (var i = 0; i<data.length; i++){
    if(data[i][0] == playerName){
      playerSheet.getRange(i + 2, 5).setValue("Sold");
      playerSheet.getRange(i + 2, 6).setValue(soldTo);
      playerSheet.getRange(i + 2, 3).setValue(salePrice);
      break;
    }
  }

  // Entry column for Sold Player
  var budgetCell = "C1"
  var entryColumn = 1;
  if(soldTo == 'Google'){
    budgetCell = "G1"
    entryColumn = 5;
  }
  else if(soldTo == 'Netflix'){
    budgetCell = "K1"
    entryColumn = 9;
  }
  else if(soldTo == "Amazon"){
    budgetCell = "O1"
    entryColumn = 13;
  }

//  Find Next Empty Slot to Add Sold Player
  var currentBalance = auctionSheet.getRange(budgetCell).getValue();
  var insertRow = 3;

  // Find Next Empty Slot to Add Sold Player
  var values = auctionSheet.getRange(insertRow, entryColumn , 30).getValues();
  
  // Loop through values to find the next empty cell for the team.
  for (var i = 0; i<values.length; i++){
    if(values[i][0] == "" || values[i][0] == null){
       insertRow = i + 3;
       break;
    }
  }

  

  // Insert Data 
  auctionSheet.getRange(insertRow,entryColumn, 1 ,2).setValues([[playerName, salePrice]]);

  SpreadsheetApp.getActiveSpreadsheet().toast(playerName + " was sold to " + soldTo + " for a whopping Rs. " + salePrice);

  // Move to Next Player
  nextRandomPlayer();
  
}

// ✅ Function to mark player as unsold (skipped)
function markPlayerAsUnsold() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var auctionSheet = sheet.getSheetByName("Auction_");
  var playerSheet = sheet.getSheetByName("Players_List");

  var playerName = auctionSheet.getRange("C24").getValue();

  // ⚠️ If no player in focus
  if (!playerName) {
    SpreadsheetApp.getActiveSpreadsheet().toast("No player in focus to mark as Unsold");
    return;
  }

  // 🔄 Update Players_List to mark as Not Interested
  var data = playerSheet.getRange("A2:A55").getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === playerName) {
      playerSheet.getRange(i + 2, 5).setValue("Not Interested"); // Column E: Status
      playerSheet.getRange(i + 2, 6).setValue("");               // Column F: Team
      playerSheet.getRange(i + 2, 3).setValue("");               // Column C: Final Price
      break;
    }
  }

  // 🧹 Clear current bid and bidder
  auctionSheet.getRange("C27").clearContent();
  auctionSheet.getRange("C28").clearContent();

  // 🔁 Call the nextRandomPlayer function to continue auction
  nextRandomPlayer();
}

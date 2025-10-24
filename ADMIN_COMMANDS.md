# Admin Commands

## How to Use
Open your browser's developer console (F12 or Right Click → Inspect → Console tab) and paste these commands:

## Add Gold/Coins
```javascript
// Add 1000 gold
window.useGame.getState().addGold(1000)

// Add 500 gold
window.useGame.getState().addGold(500)

// Check current gold balance
window.useGame.getState().gold
```

## View All Cosmetics
```javascript
// See all available cosmetics and their costs
window.BRAIN_COSMETICS
```

## Other Useful Commands

### Check Owned Cosmetics
```javascript
window.useGame.getState().ownedCosmetics
```

### Check Equipped Cosmetics
```javascript
window.useGame.getState().equippedCosmetics
```

### Buy All Cosmetics (for testing)
```javascript
// First, add enough gold
window.useGame.getState().addGold(10000)

// Then refresh the cosmetics page and you can buy them all!
```

### Reset Gold to 0
```javascript
window.useGame.getState().addGold(-window.useGame.getState().gold)
```

## Example Testing Workflow
1. Open Developer Console (F12)
2. Run: `window.useGame.getState().addGold(5000)`
3. Go to Cosmetics page
4. Buy and test different accessories and brain colors!

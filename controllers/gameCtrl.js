// Helper Functions
/**
 * Function that creates deck for the game
 * @returns Shuffled deck of 3x card ranks 1-6
 */
const makeDeck = () => {
  const deck = [];
  // make a deck of ranks 1-6 x3
  for (let i = 0; i < 3; i++)  {
    for (let j = 1; j <= 6; j++) {
      const card = {
        rank: j,
      };

      deck.push(card);
    }
  }

  // Shuffle deck
  for (let index = 0; index < deck.length; index++) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const currentCard = deck[index];
    const randomCard = deck[randomIndex];
    deck[index] = randomCard;
    deck[randomIndex] = currentCard;
  }
  
  // Function output is fresh shuffled deck
  return deck;
}


// Controller
class GameCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  game = async (req, res) => {
    console.log(`GET Request: /game/:userId`);
    console.log(`running game() from ${this.name} controller`);
    const id = req.params.userId;
    const player = {
      health: 50,
      attack: 7,
      defence: 2,
    };
    const playerDeck = makeDeck();
    const playerHand = [];
    const enemy = { // enemies can be seeded for increasing levels
      health: 50,
      attack: 5,
      defence: 1,
    };
    const enemyDeck = makeDeck();
    const enemyHand = [];
    const newGame = {
      status: 'active',
      player,
      playerHand,
      playerDeck,
      enemy,
      enemyHand,
      enemyDeck,
    };
    
    try {
      // write into db
      const [currentGame, created] = await this.model.findOrCreate({
        where: {
          gameState: { status: 'active' },
          userId: id,
        },
        defaults: {
          gameState: newGame,
          userId: id,
        },
      });
      if (created) {console.log(`new game created!`)}

      // for old game... get value of hand
      const playerHand = currentGame.gameState.playerHand;
      let playerHandValue = 0;
      for (let i = 0; i < playerHand.length; i++) {
        playerHandValue += playerHand[i].rank;
      }

      if (playerHandValue > 12) {
      playerHandValue = 6;
    }

      const gameData = {
        // send player id for future queries
        gameId: currentGame.id,
        player: currentGame.gameState.player,
        enemy: currentGame.gameState.enemy,
        playerHand: currentGame.gameState.playerHand,
        playerValue: playerHandValue,
        enemyHand: currentGame.gameState.enemyHand,
      };
      
    // console.log('game data: ', gameData);
      return res.send(gameData);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
    
  }

  hit = async (req, res) => {
    console.log(`PUT Request: /game/:gameId/hit`);
    const id = req.params.gameId;
    // console.log(id);
    // find game
    const currentGame = await this.model.findByPk(id);
    // console.log('current: ', currentGame.gameState);
    // console.log(currentGame.id);
    
    // Draw One Card
    const updateDeck = currentGame.gameState.playerDeck;
    const updateHand = currentGame.gameState.playerHand;
    updateHand.push(updateDeck.pop());
    // check if deck becomes empty... make new deck
    if (updateDeck.length === 0) {
      updateDeck = makeDeck();
    }

    // Count hand value 
    let playerHandValue = 0;
    for (let i = 0; i < updateHand.length; i++) {
      playerHandValue += updateHand[i].rank;
    }

    if (playerHandValue > 12) {
      playerHandValue = 6;
    }

    // console.log(updateDeck.length);
    // console.log(currentGame.gameState.playerHand);
    const game = {
      status: 'active',
      player: currentGame.gameState.player,
      playerHand: updateHand,
      playerDeck: updateDeck,
      enemy: currentGame.gameState.enemy,
      enemyHand: currentGame.gameState.enemyHand,
      enemyDeck: currentGame.gameState.enemyDeck,
    };

    // Update DB
    await this.model.update({
      gameState: game,
      },
      {
        where: {
        id: currentGame.id,
        }
      },
    );

    const gameData = {
      // send player id for future queries
      gameId: currentGame.id,
      player: currentGame.gameState.player,
      enemy: currentGame.gameState.enemy,
      playerHand: updateHand,
      playerValue: playerHandValue,
      enemyHand: currentGame.gameState.enemyHand,
    };
    // console.log('game data: ', gameData);
    return res.send(gameData);
  }

  stand = async (req, res) => {
    console.log(`PUT Request: /game/:id/stand`);
    const id = req.params.gameId;
    const currentGame = await this.model.findByPk(id);
    console.log('stand game:', currentGame)

    // Get everything out of currentGame...
    const player = currentGame.gameState.player;
    const playerHand = currentGame.gameState.playerHand;
    const enemy = currentGame.gameState.enemy;
    // Get player hand value
    let playerHandValue = 0;
    for (let i = 0; i < playerHand.length; i++) {
      playerHandValue += playerHand[i].rank;
    }
    if (playerHandValue > 12) {
      playerHandValue = 6;
    }

    // Update enemy deck and hand
    const updatedEnemyHand = currentGame.gameState.enemyHand;
    const updatedEnemyDeck = currentGame.gameState.enemyDeck;

    let enemyHandValue = 0;
    while (enemyHandValue < 6) {
      updatedEnemyHand.push(updatedEnemyDeck.pop());
      // reshuffle deck if no cards left
      if (updatedEnemyDeck.length === 0) {
        updatedEnemyDeck = makeDeck();
      }
      enemyHandValue = 0;
      for(let i = 0; i < updatedEnemyHand.length; i++){
        // cycle through hand to evaluate hand value
        enemyHandValue += updatedEnemyHand[i].rank;
      }
    }

    if (enemyHandValue > 12) {
      enemyHandValue = 6;
    }

    // Compare hand values for hits
    console.log(`going for hits!`);
    if (playerHandValue > enemyHandValue) {
      // player wins, player damages enemy
      const hits = playerHandValue - enemyHandValue;
      const damage = player.attack - enemy.defence;
      enemy.health -= (damage * hits);
    } else if (playerHandValue < enemyHandValue) {
      // playerloses, enemy damages player
      const hits = enemyHandValue - playerHandValue;
      const damage = enemy.attack - player.defence;
      player.health -= (damage * hits);
    } else {
      // draw
      console.log (`it's a tie!`)
    }

    const game = {
      status: 'active',
      player: player,
      playerHand: [],
      playerDeck: currentGame.gameState.playerDeck,
      enemy: enemy,
      enemyHand: [],
      enemyDeck: updatedEnemyDeck,
    };

    // Update DB
    await this.model.update({
      gameState: game,
      },
      {
        where: {
        id: currentGame.id,
        }
      },
    );

     const gameData = {
      // send player id for future queries
      gameId: currentGame.id,
      player: player,
      enemy: enemy,
      playerHand: currentGame.gameState.playerHand,
      playerValue: playerHandValue,
      enemyHand: updatedEnemyHand,
      enemyValue: enemyHandValue,
    };
    // console.log('game data: ', gameData);
    return res.send(gameData);
  }
}

module.exports = GameCtrl;
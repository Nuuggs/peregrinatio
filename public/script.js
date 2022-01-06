// script.js - governs client-side functionality; loaded on main.ejs, the main display page

// utilities
// Initialize variable for future linebreaks;
let br;

const initGame = async (loginObj) => {
  
  console.log('initGame() running')
  const interface = document.getElementById('interface');
  
  const menuDiv = document.createElement('div');
  menuDiv.id = `game-menu`;
  interface.appendChild(menuDiv);
  const newGameBtn = document.createElement('button');
  newGameBtn.innerText = `New Game`;
  newGameBtn.id = 'new-game-btn';
  const continueBtn = document.createElement('button');
  continueBtn.innerText = `Continue`
  continueBtn.id = 'continue-btn';
  menuDiv.append(newGameBtn, continueBtn);
  
  // check if user has a saved game... if yes, have continue button DO QUERY FOR USER GAME HERE!!
  // user is already logged in, find their id, search for game with { status: 'active' }
  const userId = loginObj.data.id;
  console.log(`user id: `, userId);
  // Game state variable to receive current game state from backend
  let gameState = await axios.get(`/game/${userId}`); 
  console.log(gameState);

  
  // Template for game
  const gameInterface = document.createElement('div');
  gameInterface.id = `gui`;
  const enemyDiv = document.createElement('div');
  enemyDiv.id = `enemy-div`;
  const enemyDisplay = document.createElement('div');
  enemyDisplay.id = `enemy-container`;
  const enemyImg = document.createElement('img');
  enemyImg.setAttribute('src', `assets/slime-pixel.jpg`);
  enemyImg.id = `enemy-img`;
  enemyDisplay.appendChild(enemyImg);
  const enemyStats = document.createElement('div');
  enemyStats.classList.add(`stats`);
  const enemyBoard = document.createElement('div');
  enemyBoard.classList.add(`board`);
  enemyDiv.append(enemyDisplay, enemyStats, enemyBoard);

  const meterDiv = document.createElement('div');
  meterDiv.id = `meter-div`;
  const enemyMeter = document.createElement('meter');
  enemyMeter.max = 12;
  enemyMeter.min = 0;
  enemyMeter.high = 6;
  enemyMeter.low = 5;
  enemyMeter.optimum = 10;
  const enemyMeterValue = document.createElement('p');
  enemyMeterValue.innerText = 0;
  const playerMeter = document.createElement('meter');
  playerMeter.max = 12;
  playerMeter.min = 0;
  playerMeter.high = 6;
  playerMeter.low = 5;
  playerMeter.optimum = 19;
  const playerMeterValue = document.createElement('p');
  playerMeterValue.innerText = 0;

  br = document.createElement('br');
  meterDiv.append(enemyMeter, enemyMeterValue, br, playerMeter, playerMeterValue);

  const playerDiv = document.createElement('div');
  playerDiv.id = `player-div`;
  const playerBoard = document.createElement('div');
  playerBoard.classList.add(`board`);
  const playerStats = document.createElement('div');
  playerStats.classList.add(`stats`);
  playerDiv.append(playerBoard, playerStats);

  const gameBtnDiv = document.createElement('div');
  gameBtnDiv.id = "game-btns";
  const drawBtn = document.createElement('button');
  drawBtn.innerText = `Draw`;
  drawBtn.id = `draw`;
  const attackBtn = document.createElement('button');
  attackBtn.innerText = `Attack`;
  attackBtn.id = `attack`;
  gameBtnDiv.append(drawBtn, attackBtn);

  gameInterface.append(enemyDiv, meterDiv, playerDiv, gameBtnDiv);
  
  // New Game...
  newGameBtn.addEventListener('click', async() => {
    menuDiv.remove();
    console.log(gameState.data);
    // put gameState into variables
    const { enemy, enemyHand, player, playerHand } = gameState.data;
    // append game interface
    interface.appendChild(gameInterface);
    // populate game interface
    enemyStats.innerHTML = `<span>Health: ${enemy.health} | </span><span>Attack: ${enemy.attack} | </span><span>Defence: ${enemy.defence}</span>`;
    enemyBoard.innerHTML = `<div class="card"><img src="assets/card-back.png" class="deck"></img></div>`;
    playerBoard.innerHTML = `<div class="card"><img src="assets/card-back.png" class="deck"></img></div>`;
    playerStats.innerHTML = `<span>Health: ${player.health} | </span><span>Attack: ${player.attack} | </span><span>Defence: ${player.defence}</span>`;

    // cycle through hand and print cards
    for (let i = 0; i < gameState.data.playerHand.length; i++) {
      const card = gameState.data.playerHand[i];
      const cardDiv = document.createElement('div');
      const cardImg = document.createElement('img');
      cardImg.setAttribute('src', `assets/card-spades-${card.rank}.png`);
      cardImg.classList.add('card');
      cardDiv.appendChild(cardImg);
      playerBoard.appendChild(cardDiv);
    }

    const handValue = gameState.data.playerValue;
    console.log(handValue);
    playerMeter.value = handValue;
    playerMeterValue.innerText = handValue;
  });
  
  // Continue saved game... additional functionality
  continueBtn.addEventListener('click', async() => {
    menuDiv.remove();
    // gameState = await axios.get('/game/:id'); // needs user id, query needs to be done in the beginning
  });

  // Draw Button
  drawBtn.addEventListener('click', async () => {
    // altering game state... draw one card
    gameState = await axios.put(`/game/${gameState.data.gameId}/hit`);

    // reset player board
    playerBoard.innerHTML = `<div class="card"><img src="assets/card-back.png" class="deck"></img></div>`;
    
    // cycle through hand and print cards
    for (let i = 0; i < gameState.data.playerHand.length; i++) {
      const card = gameState.data.playerHand[i];
      const cardDiv = document.createElement('div');
      const cardImg = document.createElement('img');
      cardImg.setAttribute('src', `assets/card-spades-${card.rank}.png`);
      cardImg.classList.add('card');
      cardDiv.appendChild(cardImg);
      playerBoard.appendChild(cardDiv);
    }

    // Display player hand value
    handValue = gameState.data.playerValue;
    console.log(handValue);
    playerMeter.value = handValue;
    playerMeterValue.innerText = handValue;
  });

  attackBtn.addEventListener('click', async () => {
    gameState = await axios.put(`/game/${gameState.data.gameId}/stand`);
    const { enemy, enemyHand, player, playerHand } = gameState.data;
    // reset game interface with updated health
    enemyStats.innerHTML = `<span>Health: ${enemy.health} | </span><span>Attack: ${enemy.attack} | </span><span>Defence: ${enemy.defence}</span>`;
    enemyBoard.innerHTML = `<div class="card"><img src="assets/card-back.png" class="deck"></img></div>`;
    playerBoard.innerHTML = `<div class="card"><img src="assets/card-back.png" class="deck"></img></div>`;
    playerStats.innerHTML = `<span>Health: ${player.health} | </span><span>Attack: ${player.attack} | </span><span>Defence: ${player.defence}</span>`;

    // cycle through hand and print cards
    for (let i = 0; i < gameState.data.playerHand.length; i++) {
      const card = gameState.data.playerHand[i];
      const cardDiv = document.createElement('div');
      const cardImg = document.createElement('img');
      cardImg.setAttribute('src', `assets/card-spades-${card.rank}.png`);
      cardImg.classList.add('card');
      cardDiv.appendChild(cardImg);
      playerBoard.appendChild(cardDiv);
    }

    // cycle through hand and print cards
    for (let i = 0; i < gameState.data.enemyHand.length; i++) {
      const card = gameState.data.enemyHand[i];
      const cardDiv = document.createElement('div');
      const cardImg = document.createElement('img');
      cardImg.setAttribute('src', `assets/card-spades-${card.rank}.png`);
      cardImg.classList.add('card');
      cardDiv.appendChild(cardImg);
      playerBoard.appendChild(cardDiv);
    }

    // Alter the meters to show enemy
    const playerValue = gameState.data.playerValue;
    // console.log(handValue);
    playerMeter.value = playerValue;
    playerMeterValue.innerText = playerValue;
    const enemyValue = gameState.data.enemyValue;
    enemyMeter.value = enemyValue;
    enemyMeterValue.innerText = enemyValue;

    setTimeout(() => {
      // Reset all values for the next round of combat
      // Board
      enemyStats.innerHTML = `<span>Health: ${enemy.health} | </span><span>Attack: ${enemy.attack} | </span><span>Defence: ${enemy.defence}</span>`;
      enemyBoard.innerHTML = `<div class="card"><img src="assets/card-back.png" class="deck"></img></div>`;
      playerBoard.innerHTML = `<div class="card"><img src="assets/card-back.png" class="deck"></img></div>`;
      playerStats.innerHTML = `<span>Health: ${player.health} | </span><span>Attack: ${player.attack} | </span><span>Defence: ${player.defence}</span>`;
      // Meter
      playerMeter.value = 0;
      playerMeterValue.innerText = 0;
      enemyMeter.value = 0;
      enemyMeterValue.innerText = 0;
    }, 3000);

  });
}

// Funtion for register button
const register = async () => {
  // data for register button
  const userInput = document.getElementById('user');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // puts data into object to create in db
  const regObj = {
    username: userInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };
  console.log(regObj);

  // clear the input boxes after making registration
  userInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  
  // make a "registered" note appear in #login div then remove
  const registerNotice = document.createElement('div');
  registerNotice.id = `reg-note`;
  registerNotice.innerHTML = `<h3>Registration Successful!</h3>`
  const loginDiv = document.getElementById('login');
  loginDiv.appendChild(registerNotice);
  // set delay timer to remove notice after 3s
  setTimeout(() => {registerNotice.remove()}, 3000);

  try {
    // make axios post request '/register'
    const postRegisterRes = await axios.post('/main/register', regObj);
    console.log(postRegisterRes);

  } catch (error) {
    console.log(error);
  }

}

// Function for login button
const login = async () => {
  // data for register button
  const userInput = document.getElementById('user');
  const passwordInput = document.getElementById('password');

  // puts data into object to create in db
  const loginObj = {
    username: userInput.value,
    password: passwordInput.value,
  };
  // console.log(loginObj);

  // clear the input boxes after making registration
  userInput.value = "";
  passwordInput.value = "";

  try {
    // make axios post request '/register'
    const postLoginRes = await axios.post('/main/login', loginObj);
    console.log(postLoginRes);
    console.log(postLoginRes.data.success);
    if (postLoginRes.data.success === true){
      return { status: true, data: postLoginRes.data };
    }
    // get login response, verify, allow game to run
    // if not... error message

  } catch (error) {
    console.log(error);
    return { status: false, };
  }
}

/**
 * Function the initializes when main page loads
 * Prints login/register box
 */
const initMain = () => {
  // Reference #login
  
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');

  registerBtn.addEventListener('click', () => register());
  loginBtn.addEventListener('click', async () => 
  {
    const loginObj = await login();
    console.log(loginObj);
    // to add: if login is done correctly... if(isLoggedIn === true)...
    if (loginObj.status === true){
      const loginInterface = document.getElementById('login');
      loginInterface.remove();
      initGame(loginObj);
    } else {
      // make an "error" note appear in #login div then remove
      console.log(`WRONG LOGIN`);
      const errorNotice = document.createElement('div');
      errorNotice.id = `reg-note`;
      errorNotice.innerHTML = `<h3>Log-in Error, try again!</h3>`
      const loginDiv = document.getElementById('login');
      loginDiv.appendChild(errorNotice);
      // set delay timer to remove notice after 3s
      setTimeout(() => {errorNotice.remove()}, 3000);
    }
  });
  
}

initMain();
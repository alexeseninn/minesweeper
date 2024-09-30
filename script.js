
let boardSize = 16; //размер поля
let tileSize = 40; //размер плитки
let firstTile = [];
let firstTiles = [];

let minesStillHave = 40;
document.documentElement.style.setProperty('--minesTwo', `${-108}px`);
document.documentElement.style.setProperty('--minesOne', `${-319}px`);

document.documentElement.style.setProperty('--timerOne', `${-319}px`);
document.documentElement.style.setProperty('--timerTwo', `${-319}px`);
document.documentElement.style.setProperty('--timerThree', `${-319}px`);

document.documentElement.style.setProperty('--face', `${0}px`);
const board = document.querySelectorAll('.board')[0];
let tiles;

const restartBtn = document.querySelectorAll('.minesweeper-btn')[0];
const endscreen = document.querySelectorAll('.endscreen')[0]

let bombs = [];
let numbers = [];
let numberColors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c', '#34495e', '#7f8c8d',];

let gameOver = false;

// очистка доски
const clear = () => {
	time = -1;
	minesStillHave = 40;
	minesCounter(minesStillHave);
	gameOver = false;
	bombs = [];
	numbers = [];
	tiles.forEach(tile => {
		tile.remove();
	});
	
	start();
}

//старт и настройки игры
const start = () => {
    //создаем див, даем класснейм и добавляем в конец для ич плитки
	for (let i = 0; i < Math.pow(boardSize, 2); i++) {
		const tile = document.createElement('div');
		tile.classList.add('tile');
		board.appendChild(tile);
	}
	tiles = document.querySelectorAll('.tile');
	board.style.width = boardSize * tileSize + 'px';
	
	document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
	document.documentElement.style.setProperty('--mainSize', `${boardSize * tileSize + 52}px`);
	document.documentElement.style.setProperty('--boardSize', `${boardSize * tileSize}px`);
	document.documentElement.style.setProperty('--xAxis', `${-40}px`);
	document.documentElement.style.setProperty('--yAxis', `${-123}px`);
	
	let x = 0;
	let y = 0;

	//тут мы ищем самый первый клик
	tiles.forEach((tile, i) => {

        //коорды плитки
		tile.setAttribute('data-tile', `${x},${y}`);
		
		x++;
		if (x >= boardSize) {
			x = 0;
			y++;
		}
		
		//прав клик
		tile.oncontextmenu = function(e) {
			e.preventDefault();
		}

        //лев клик
		tile.onclick = function(e) {
			firstTile = tile.getAttribute('data-tile');
			firstTiles = firstTile.split(',');
			firstTiles[0] = Number(firstTiles[0]);
			firstTiles[1] = Number(firstTiles[1]);
			fillTheBoard(firstTiles[0], firstTiles[1]);
		}

		tile.onmousedown = function(eventData) {
			if (gameOver) return;
			if (eventData.button === 0) {
				document.documentElement.style.setProperty('--face', `${-137}px`);
			}
		} 
		tile.onmouseup = function(eventData) {
			if (gameOver) return;
			if (eventData.button === 0) {
				document.documentElement.style.setProperty('--face', `${-0}px`);
			}
		} 
	});
}

const fillTheBoard = (firstX, firstY) => {
	let x = 0, y = 0;
	tiles.forEach((tile, i) => {
        //коорды плитки
		tile.setAttribute('data-tile', `${x},${y}`);
		
        //коорды бомбы
		let random_boolean = Math.random() < 0.05;
		if ((random_boolean) && !((x == firstX) && (y == firstY))) {
			bombs.push(`${x},${y}`);
			if (x > 0) numbers.push(`${x-1},${y}`);
			if (x < boardSize - 1) numbers.push(`${x+1},${y}`);
			if (y > 0) numbers.push(`${x},${y-1}`);
			if (y < boardSize - 1) numbers.push(`${x},${y+1}`);
			
			if (x > 0 && y > 0) numbers.push(`${x-1},${y-1}`);
			if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x+1},${y+1}`);
			
			if (y > 0 && x < boardSize - 1) numbers.push(`${x+1},${y-1}`);
			if (x > 0 && y < boardSize - 1) numbers.push(`${x-1},${y+1}`);
		}
		
		x++;
		if (x >= boardSize) {
			x = 0;
			y++;
		}
		
        // прав клик
		tile.oncontextmenu = function(e) {
			e.preventDefault();
			flag(tile);
		}
		
        //лев клик
		tile.onclick = function(e) {
			clickTile(tile);
		}
	});

	while (bombs.length < 40){ //докидываем бомбы, чтобы их было 40
		x = Math.floor(Math.random() * 16);
		y = Math.floor(Math.random() * 16);
		if (!(bombs.includes(`${x},${y}`)) && (x != firstX) && (y != firstY)) {
			bombs.push(`${x},${y}`);
			if (x > 0) numbers.push(`${x-1},${y}`);
			if (x < boardSize - 1) numbers.push(`${x+1},${y}`);
			if (y > 0) numbers.push(`${x},${y-1}`);
			if (y < boardSize - 1) numbers.push(`${x},${y+1}`);
			
			if (x > 0 && y > 0) numbers.push(`${x-1},${y-1}`);
			if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x+1},${y+1}`);
			
			if (y > 0 && x < boardSize - 1) numbers.push(`${x+1},${y-1}`);
			if (x > 0 && y < boardSize - 1) numbers.push(`${x-1},${y+1}`);
		}
	}
	
	numbers.forEach(num => {
		let coords = num.split(',');
		let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];
		let dataNum = parseInt(tile.getAttribute('data-num'));
		if (!dataNum) dataNum = 0;
		tile.setAttribute('data-num', dataNum + 1);
	});

	let targetW = document.querySelectorAll(`[data-tile="${firstX},${firstY}"`)[0]; //имитация клика на самую первую кнопку
	clickTile(targetW);
}

//помечаем плитку
const flag = (tile) => {
	if (gameOver) return;
	if (!tile.classList.contains('tile--checked')) {

		if (tile.classList.contains('tile--flagged')){
			tile.classList.remove('tile--flagged');
			tile.classList.add('tile--marked');
			minesStillHave++;
			minesCounter(minesStillHave);
		} 
		else if (tile.classList.contains('tile--marked')){
			tile.classList.remove('tile--marked');
		} 
		else {
			tile.classList.add('tile--flagged');
			minesStillHave--;
			minesCounter(minesStillHave);
		}
	}
}

const minesCounter = (num) => {
	console.log(Math.floor(num / 10))

	if (Number(Math.floor(num / 10)) == 4)	document.documentElement.style.setProperty('--minesTwo', `${-108}px`);
	if (Number(Math.floor(num / 10)) == 3)	document.documentElement.style.setProperty('--minesTwo', `${-72}px`);
	if (Number(Math.floor(num / 10)) == 2)	document.documentElement.style.setProperty('--minesTwo', `${-36}px`);
	if (Number(Math.floor(num / 10)) == 1)	document.documentElement.style.setProperty('--minesTwo', `${-0}px`);
	if (Number(Math.floor(num / 10)) == 0)	document.documentElement.style.setProperty('--minesTwo', `${-320}px`);

	if ((num % 10) == 9)	document.documentElement.style.setProperty('--minesOne', `${-284}px`);
	if ((num % 10) == 8)	document.documentElement.style.setProperty('--minesOne', `${-248}px`);
	if ((num % 10) == 7)	document.documentElement.style.setProperty('--minesOne', `${-213}px`);
	if ((num % 10) == 6)	document.documentElement.style.setProperty('--minesOne', `${-177}px`);
	if ((num % 10) == 5)	document.documentElement.style.setProperty('--minesOne', `${-142}px`);
	if ((num % 10) == 4)	document.documentElement.style.setProperty('--minesOne', `${-106}px`);
	if ((num % 10) == 3)	document.documentElement.style.setProperty('--minesOne', `${-71}px`);
	if ((num % 10) == 2)	document.documentElement.style.setProperty('--minesOne', `${-35}px`);
	if ((num % 10) == 1)	document.documentElement.style.setProperty('--minesOne', `${-0}px`);
	if ((num % 10) == 0)	document.documentElement.style.setProperty('--minesOne', `${-320}px`);
}

//чек бомба или нет (левый клик)
const clickTile = (tile) => {
	let coordinate = tile.getAttribute('data-tile');
	if (gameOver) return;
	if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged') || tile.classList.contains('tile--marked')) return;
	if (bombs.includes(coordinate)) { //если это бомба
		endGame(tile);
		} else {
		//чек есть ли рядом бомба
		let num = tile.getAttribute('data-num');
		if (num != null) {
			tile.classList.add('tile--checked');
			if (num == 1){
				tile.style.setProperty('--xAxis', `${0}px`);
				tile.style.setProperty('--yAxis', `${-162}px`);
			}
			if (num == 2){
				tile.style.setProperty('--xAxis', `${-41}px`);
				tile.style.setProperty('--yAxis', `${-162}px`);
			}
			if (num == 3){
				tile.style.setProperty('--xAxis', `${-82}px`);
				tile.style.setProperty('--yAxis', `${-162}px`);
			}
			if (num == 4){
				tile.style.setProperty('--xAxis', `${-124}px`);
				tile.style.setProperty('--yAxis', `${-162}px`);
			}
			if (num == 5){
				tile.style.setProperty('--xAxis', `${-166}px`);
				tile.style.setProperty('--yAxis', `${-162}px`);
			}
			if (num == 6){
				tile.style.setProperty('--xAxis', `${-207}px`);
				tile.style.setProperty('--yAxis', `${-162}px`);
			}
			if (num == 7){
				tile.style.setProperty('--xAxis', `${-248}px`);
				tile.style.setProperty('--yAxis', `${-162}px`);
			}
			if (num == 8){
				tile.style.setProperty('--xAxis', `${-289}px`);
				tile.style.setProperty('--yAxis', `${-162}px`);
			}
			tile.style.color = numberColors[num-1];
			setTimeout(() => {
				checkVictory();
			}, 100);
			return;
		}
		checkTile(tile, coordinate);
	}
	tile.classList.add('tile--checked');
}


//клик на правую
const checkTile = (tile, coordinate) => {
	let coords = coordinate.split(',');
	let x = parseInt(coords[0]);
	let y = parseInt(coords[1]);
	//чекаем плитки рядом
	setTimeout(() => {
		if (x > 0) {
			let targetW = document.querySelectorAll(`[data-tile="${x-1},${y}"`)[0];
			clickTile(targetW, `${x-1},${y}`);
		}
		if (x < boardSize - 1) {
			let targetE = document.querySelectorAll(`[data-tile="${x+1},${y}"`)[0];
			clickTile(targetE, `${x+1},${y}`);
		}
		if (y > 0) {
			let targetN = document.querySelectorAll(`[data-tile="${x},${y-1}"]`)[0];
			clickTile(targetN, `${x},${y-1}`);
		}
		if (y < boardSize - 1) {
			let targetS = document.querySelectorAll(`[data-tile="${x},${y+1}"]`)[0];
			clickTile(targetS, `${x},${y+1}`);
		}
		
		if (x > 0 && y > 0) {
			let targetNW = document.querySelectorAll(`[data-tile="${x-1},${y-1}"`)[0];
			clickTile(targetNW, `${x-1},${y-1}`);
		}
		if (x < boardSize - 1 && y < boardSize - 1) {
			let targetSE = document.querySelectorAll(`[data-tile="${x+1},${y+1}"`)[0];
			clickTile(targetSE, `${x+1},${y+1}`);
		}
		
		if (y > 0 && x < boardSize - 1) {
			let targetNE = document.querySelectorAll(`[data-tile="${x+1},${y-1}"]`)[0];
			clickTile(targetNE, `${x+1},${y-1}`);
		}
		if (x > 0 && y < boardSize - 1) {
			let targetSW = document.querySelectorAll(`[data-tile="${x-1},${y+1}"`)[0];
			clickTile(targetSW, `${x-1},${y+1}`);
		}
	}, 10);
}


/* если бомба, то гейм овер */
const endGame = (tile) => {
	document.documentElement.style.setProperty('--face', `${-275}px`);
	tile.classList.add('tile--kaboom');
	console.log('Бомба сделала бубум! Game over.');
	gameOver = true;
	tiles.forEach(tile => {
		let coordinate = tile.getAttribute('data-tile');
		if (bombs.includes(coordinate)) {
			if (tile.classList.contains('tile--flagged')){
				tile.classList.remove('tile--flagged');
				tile.classList.add('tile--defused');
			} else if (tile.classList.contains('tile--marked')){
				tile.classList.remove('tile--marked');
				tile.classList.add('tile--defused');
			} 
			else tile.classList.add('tile--bomb');
		}
	});
}

const checkVictory = () => {
	let win = true;
	tiles.forEach(tile => {
		let coordinate = tile.getAttribute('data-tile');
		if (!tile.classList.contains('tile--checked') && !bombs.includes(coordinate)) win = false;
	});
	if (win) {
		document.documentElement.style.setProperty('--face', `${-205.5}px`);
		gameOver = true;
	}
}

/* старт гейм */
start();

/* клик для нов игры */
restartBtn.addEventListener('click', function(e) {
	clear();
});
restartBtn.addEventListener('mouseup', function(e) {
	document.documentElement.style.setProperty('--face', `${0}px`);
});
restartBtn.addEventListener('mousedown', function(e) {
	document.documentElement.style.setProperty('--face', `${-68}px`);
});

//таймер
let time = 0
let started = false;
function Timer(){
	if (started) {return};

	let countdown = setInterval(function() {
		time++;
		if (time == 999) time = 0;
		if (gameOver) return;

		if (Number(Math.floor(time / 100)) == 9)	document.documentElement.style.setProperty('--timerOne', `${-284}px`);
		if (Number(Math.floor(time / 100)) == 8)	document.documentElement.style.setProperty('--timerOne', `${-248}px`);
		if (Number(Math.floor(time / 100)) == 7)	document.documentElement.style.setProperty('--timerOne', `${-213}px`);
		if (Number(Math.floor(time / 100)) == 6)	document.documentElement.style.setProperty('--timerOne', `${-177}px`);
		if (Number(Math.floor(time / 100)) == 5)	document.documentElement.style.setProperty('--timerOne', `${-142}px`);
		if (Number(Math.floor(time / 100)) == 4)	document.documentElement.style.setProperty('--timerOne', `${-108}px`);
		if (Number(Math.floor(time / 100)) == 3)	document.documentElement.style.setProperty('--timerOne', `${-72}px`);
		if (Number(Math.floor(time / 100)) == 2)	document.documentElement.style.setProperty('--timerOne', `${-36}px`);
		if (Number(Math.floor(time / 100)) == 1)	document.documentElement.style.setProperty('--timerOne', `${-0}px`);
		if (Number(Math.floor(time / 100)) == 0)	document.documentElement.style.setProperty('--timerOne', `${-320}px`);

		if ((Number(Math.floor(time / 10)) % 10) == 9)	document.documentElement.style.setProperty('--timerTwo', `${-284}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 8)	document.documentElement.style.setProperty('--timerTwo', `${-248}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 7)	document.documentElement.style.setProperty('--timerTwo', `${-213}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 6)	document.documentElement.style.setProperty('--timerTwo', `${-177}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 5)	document.documentElement.style.setProperty('--timerTwo', `${-142}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 4) document.documentElement.style.setProperty('--timerTwo', `${-108}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 3) document.documentElement.style.setProperty('--timerTwo', `${-72}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 2) document.documentElement.style.setProperty('--timerTwo', `${-36}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 1) document.documentElement.style.setProperty('--timerTwo', `${-0}px`);
		if ((Number(Math.floor(time / 10)) % 10) == 0) document.documentElement.style.setProperty('--timerTwo', `${-320}px`);

		if ((time % 10) == 9) document.documentElement.style.setProperty('--timerThree', `${-284}px`);
		if ((time % 10) == 8) document.documentElement.style.setProperty('--timerThree', `${-248}px`);
		if ((time % 10) == 7) document.documentElement.style.setProperty('--timerThree', `${-213}px`);
		if ((time % 10) == 6) document.documentElement.style.setProperty('--timerThree', `${-177}px`);
		if ((time % 10) == 5) document.documentElement.style.setProperty('--timerThree', `${-141}px`);
		if ((time % 10) == 4) document.documentElement.style.setProperty('--timerThree', `${-106}px`);
		if ((time % 10) == 3) document.documentElement.style.setProperty('--timerThree', `${-70}px`);
		if ((time % 10) == 2) document.documentElement.style.setProperty('--timerThree', `${-35}px`);
		if ((time % 10) == 1) document.documentElement.style.setProperty('--timerThree', `${0}px`);
		if ((time % 10) == 0) document.documentElement.style.setProperty('--timerThree', `${-320}px`);
	}, 1000);

	started = true;
}

Timer();

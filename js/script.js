let directx = direct = 0;
let timer;
let raise = 500;

// 1. Создаем класс GameField

class GameField {

    constructor(sizeX, sizeY) {
      this._sizeX = sizeX
      this._sizeY = sizeY
    }

// 1.1 Объявляем метод отрисовки игрового поля

    draw() {

        for (let x = 0; x < this._sizeX; x++) {

            let coordinateX = document.createElement('div');
            document.querySelector('.game-field').appendChild(coordinateX);
            coordinateX.className = 'row';
            
            for (let y = 0; y < this._sizeY; y++) {

                let coordinateY = document.createElement('div');
                coordinateX.appendChild(coordinateY);
                coordinateY.className = 'cell';
                coordinateY.id = y+','+x;

            }
        }
    }

}

// 1.2 Создаем экземпляр класса GameField, задаем размер игрового поля 10 на 10

let field = new GameField(10, 10);


// 2. Создаем класс Food

class Food {


// 2.1 Объявляем метод, который будет генерировать еду в случайном месте игрового поля

    appear() {

        let i = Math.round(Math.random() * (field._sizeX - 1));

        let n = Math.round(Math.random() * (field._sizeY - 1));

        let food = document.getElementById(i+','+n);

        if (food.className == 'cell') {

            food.className = `cell pumpkin`;

        } else {

            this.appear();

        }
        
    }
}

// 2.2 Создаем экземпляр класса Food

let randomFood = new Food();


// 3. Создаем класс Snake

class Snake {

    constructor(length, body) {
        this.length = length;
        this.body = body;
    }

// 3.1 Объявляем метод отрисовки змеи

    draw() {
        
        for (let i = 0; i < this.length; i++) {
            let currentBody = this.body[i];
            document.getElementById(currentBody.join()).className = 'cell snake-body';
        }
    }

// 3.2 Объявляем метод управления змеей с клавиатуры, а также кнопками на экране для игры с мобильных устройств

    control() {

        document.addEventListener('keydown', (e) => {
            
            if (e.key === "ArrowLeft") {
                if (direct != 0) {
                    directx = 2;
                }
            }

            if (e.key === "ArrowRight") {
                if (direct != 2) {
                    directx = 0;
                }
            }

            if (e.key === "ArrowUp") {
                if (direct != 1) {
                    directx = 3;
                }
            }

            if (e.key === "ArrowDown") {
                if (direct != 3) {
                    directx = 1;
                }
            }
        })

        document.querySelector('.btn-left').addEventListener('click', () => {
            if (direct != 0) {
                directx = 2;
            }
        });

        document.querySelector('.btn-right').addEventListener('click', () => {
            if (direct != 2) {
                directx = 0;
            }
        });

        document.querySelector('.btn-up').addEventListener('click', () => {
            if (direct != 1) {
                directx = 3;
            }
        });

        document.querySelector('.btn-down').addEventListener('click', () => {
            if (direct != 3) {
                directx = 1;
            }
        });
       
    }

// 3.3 Объявляем метод, определяющий направления движения змеи

    move() {

        let direction = [
            [0,1], // Вправо
            [1,0], // Вниз
            [0,-1],  // Влево
            [-1,0]]; // Вверх

        direct = directx;
        let head = this.body[this.length - 1];

        let snakeHead = head.map(function(value, index) { 
        
        return value + direction[direct][index] });

        this.update(snakeHead, this.body);

        return snakeHead;

    }

// 3.4 Объявляем метод для обновления тела змеи, хранения данных набранных при этом очков, а также определяем возможные варианты окончания игры и случаи для ее перезапуска

    update(snakeHead, body) {

        let tmp = document.getElementById(snakeHead.join());

        if (document.getElementById(snakeHead.join()) == null ) {

          document.querySelector('.game-field').innerHTML = `<div class="gameover-field">You <span class="animated">Loooser..!</span><span class="animated--color"> Try again</span><br><span class="text-sm">Press <span class='animated'>Enter</span> or <span class='animated'>touch</span> the screen to <span class="animated">restart</span></div>`;
          clearInterval(timer);
          document.addEventListener('keypress', game.restart, { once: true })
          document.addEventListener('touchstart', game.restart, { once: true })

          if (this._score > Number(localStorage.getItem('bestScore'))) {

            localStorage.setItem('bestScore', this._score);

            } else {

            localStorage.getItem('bestScore');

            }

          return

        }

        if (tmp != null && tmp.className == 'cell') {

            let removeTail = body.shift();
            body.push(snakeHead);
            document.getElementById(removeTail.join()).className = 'cell';
            document.getElementById(snakeHead.join()).className = 'cell snake-body';

        } else {

            if ( tmp != null && tmp.className == `cell pumpkin`) {
                this.length++;
                raise = raise - 10;
                game.raiseSpeed(raise);
                console.log(raise)
                body.push(snakeHead);
                document.getElementById(snakeHead.join()).className = 'cell snake-body';
                randomFood.appear();
                this._score = this.length - 2;
                document.querySelector('.current-result').innerHTML = +this._score;

            } else {

                if (this._score > Number(localStorage.getItem('bestScore'))) {

                    localStorage.setItem('bestScore', this._score);

                } else {

                    localStorage.getItem('bestScore');

                }

                if (tmp.className == 'cell snake-body') {

                    document.querySelector('.game-field').innerHTML = `<div class="gameover-field">You <span class="animated">Loooser..!</span><span class="animated--color"> Try again</span><br><span class="text-sm">Press <span class='animated'>Enter</span> or <span class='animated'>touch</span> the screen to <span class="animated">restart</span></div>`;
                    clearInterval(timer);
                    document.addEventListener('keypress', game.restart, { once: true });
                    document.addEventListener('touchstart', game.restart, { once: true });

                }
            }
        }
    }
}

// 3.5 Создаем экземпляр класса Snake, задаем ее длинну и координаты расположения на игровом поле

let snake = new Snake(2, [[4,4],[4,5]]);


// 4. Создаем класс Score

class Score {

    constructor(score) {
        this._score = score = 0;
    }

// 4.1 Объявляем метод отрисовки счета очков

    draw() {

        document.querySelector('.current-result').innerHTML = this._score;

        let bestScore = localStorage.getItem('bestScore');

        if (bestScore) {

            document.querySelector('.best-result').innerHTML = bestScore;

        }

    }

}

// 4.1 Создаем экземпляр класса Score

let initialScore = new Score();



// 5. Создаем класс Main, управляющий игрой

class Main {

// 5.1 Объявляем метод отрисовки: игрового поля, змеи, счета очков, появляения еды

    draw() {

        field.draw();
        snake.draw()
        initialScore.draw();
        randomFood.appear();

    }

// 5.2 Объявляем метод старта игрового процесса

    start() {

        document.querySelector('.game-field').removeChild(document.querySelector('.prestart-field'));
        game.draw();
        snake.control();

        timer = setInterval(function() {
            snake.move();
        }, 500);

    }

// 5.3 Объявляем метод увеличения скорости игры

    raiseSpeed(raise) {

        clearInterval(timer)

        timer = setInterval(function() {
            snake.move();
        }, raise);

    }

// 5.4 Объявляем метод рестарта игры в случае проигрыша

    restart() {

        window.location.reload();

    }
}

// 5.5 Создаем экземпляр класса Main

let game = new Main();


// 6. Добавляем обработчки событий для старта игры на компьютере и мобильных устройствах

document.addEventListener('keypress', game.start, { once: true })

document.addEventListener('touchstart', game.start, { once: true })

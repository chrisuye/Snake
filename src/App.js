import React, { Component } from 'react';
import { useSwipeable } from "react-swipeable";
import Snake from './Snake';
import Food from './Food';
import './App.css';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initalState = {
  food: getRandomCoordinates(),
  speed: 100,
  direction: 'RIGHT',
  snakeDots: [
    [0, 0],
    [2, 0],
  ],
  score: 0,
  xDown: null,
  yDown: null,
}

const Game = ({ updateState, direction, score, snakeDots, food}) => {
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => direction !== 'Down' ? updateState(3) : null,
    onSwipedDown: () => direction !== 'UP' ? updateState(4) : null,
    onSwipedLeft: () => direction !== 'RIGHT' ? updateState(2) : null,
    onSwipedRight: () => direction !== 'LEFT' ? updateState(1) : null,
  });
  return (
    <div className="snake" {...swipeHandlers}>
      <div className="score">
        <h1>Snake Game</h1>
        <h2>Score: {score}</h2>
        <h2>High Score: {localStorage.getItem('snakeScore')}</h2>
      </div>
      <div className='game-area'>
        <Snake snakeDots={snakeDots}/>
        <Food food={food} />
      </div>
    </div>
  );
}

class App extends Component {
  state = initalState

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
    document.addEventListener('touchstart', this.onTouchStart);
    document.addEventListener('touchmove', this.onTouchMove);
  };

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
  };

  onKeyDown = e => {
    e = e || window.event;
    switch (e.keyCode) {
      case 37:
        if(this.state.direction !== 'RIGHT') {
          this.setState({ direction: 'LEFT' });
        }
        break;
      case 38:
        if(this.state.direction !== 'DOWN') {
          this.setState({ direction: 'UP' });
        }
        break;
      case 39:
        if(this.state.direction !== 'LEFT') {
          this.setState({ direction: 'RIGHT' });
        }
        break;
      case 40:
        if(this.state.direction !== 'UP') {
          this.setState({ direction: 'DOWN' });
        }
        break;
      default:
        break;
    }
  };

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      default:
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    });
  };

  getTouches = e => {
    return e.touches || e.originalEvent.touches;
  }

  handleTouchStart = e => {
    const firstTouch = this.getTouches(e)[0];
    this.setState({
      xDown: firstTouch.clientX,
      yDown: firstTouch.clientY
    })
  };

  handleTouchMove = e => {
    if (!this.state.xDown || !this.state.yDown) {
      return;
    }
    let xUp = e.touches[0].clientX;
    let yUp = e.touches[0].clientY;
    let xDiff = this.state.xDown - xUp;
    let yDiff = this.state.yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        if(this.state.direction !== 'LEFT') {
          this.setState({ direction: 'RIGHT' });  
        }
      } else {
        if(this.state.direction !== 'RIGHT') {
          this.setState({ direction: 'LEFT' });
        }
      }
    } else {
      if (yDiff > 0) {
        if(this.state.direction !== 'UP') {
          this.setState({ direction: 'DOWN' });
        }
      } else {
        if(this.state.direction !== 'DOWN') {
          this.setState({ direction: 'UP' });
        }
      }
    }
    this.setState({
      xDown: null,
      yDown: null,
    });
  };

  checkIfOutOfBorders() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.gameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.gameOver();
      }
    });
  }

  checkIfEat() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      this.setState({
        food: getRandomCoordinates()
      });
      this.enlargeSnake();
      this.increaseSpeed();
      this.increaseScore();
    }
  }

  increaseScore() {
    this.setState({
      score: this.state.score + 1
    });
  }

  enlargeSnake() {
    let snake = [...this.state.snakeDots];
    snake.unshift([]);
    this.setState({
      snakeDots: snake
    });
  }

  increaseSpeed = () => {
    let speed = this.state.speed;
    if (speed > 10) {
      speed -= 10;
      this.setState({
        speed: speed
      });
    }
  }

  gameOver() {
    localStorage.setItem('snakeScore', this.state.score > localStorage.getItem('snakeScore') ? this.state.score : localStorage.getItem('snakeScore'));
    this.setState(initalState);
  }

  updateState = (value) => {
    if (value === 1) {
      this.setState({
        direction: 'RIGHT'
      });
    } else if (value === 2) {
      this.setState({
        direction: 'LEFT'
      });
    } else if (value === 3) {
      this.setState({
        direction: 'UP'
      });
    } else if (value === 4) {
      this.setState({
        direction: 'DOWN'
      });
    }
  }

  render() {
    return (
      <Game
        updateState={this.updateState}
        direction={this.state.direction}
        snakeDots={this.state.snakeDots}
        food={this.state.food}
        score={this.state.score}
      />
    );
  }
}

export default App;

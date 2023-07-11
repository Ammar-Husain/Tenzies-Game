import React from 'react'
import Mode from './Mode.js'
import Score from './Score.js'
import {squaresData, additionalSquares} from './squares.js'
import Timer from './Timer.js'
import ReactConfetti from 'react-confetti'
let looseTimer,
durationInterval,
winMessageInterval;
export default function Main() {
	const [squares, setSquares] = React.useState(() => squaresData.map(square => (
		{...square, number:1+Math.floor(Math.random()*6)}
	)));
	const [highestScore, setHighestScore] = React.useState(() => (
		JSON.parse(localStorage.getItem('highestScore')) 
		|| {'easy': '', 'medium': '', 'hard': ''} 
	))
	const [duration, setDuration] = React.useState(0);
	const [mode, setMode] = React.useState('easy')
	const [timer, setTimer] = React.useState(false)
	const [result, setResult] = React.useState(false);
	React.useEffect(() => {
		if (squares.every(square => square.isFreezed)) {
			setResult({ result: 'win' });
			winMessageInterval = setInterval(() => {
				let winMessageElement = document.querySelector('.win-message');
				winMessageElement.classList.contains('light') ? winMessageElement.classList.remove('light') :
					winMessageElement.classList.add('light')
			}, 500)
		}
	}, [squares])
	
	React.useEffect( ()=> {
		if (timer === 0) {
			setResult({result: 'loose', message: "Time Up!"})
		}
	},[timer])
	React.useEffect(() => {
		clearInterval(looseTimer);
		if (result.result === 'win') {
			if (duration < highestScore[mode]||!highestScore[mode]) {
				setHighestScore(prevScore => ({...prevScore, [mode]: duration}))
				result.message = "New Highest Score"
			}
		}
		clearInterval(durationInterval)
	}, [result])
	React.useEffect(() => {
		localStorage.setItem('highestScore', JSON.stringify(highestScore))
	}, [highestScore])
	function chooseTheMode(theMode) {
		if(theMode !== mode && (result || !squares.find(square => square.isFreezed))) {
			setMode(theMode)
			restart(theMode)	
		}
	}
	function handleClick() {
		if (result) {
			restart(mode)
		} else {
			const freezedSquare = squares.find(square => square.isFreezed)
			if (freezedSquare) {
					const freezedNumber = freezedSquare.number
				const missedSquare = squares.find(square => (
					!square.isFreezed && square.number === freezedNumber
				))
				if (missedSquare) {
					document.getElementById(missedSquare.id).classList.add('selected-false')
					setResult({result: 'loose', message:"You miss a square!"});
					return
				} else startTimer();
			}
		}
		roll()
	}
	function play(square) {
		if (!result &&!square.isFreezed) {
			const aFreezedSquare = squares.find(square => square.isFreezed)
			if (aFreezedSquare) {
				if (square.number === aFreezedSquare.number) {
					freeze(square.id);
				} else {
					setResult({result: "loose", message: "Wrong Square!"})
					document.getElementById(square.id).classList.add('selected-false')
				}
			} else {
				startDuration()
				startTimer();
				freeze(square.id)
			}
		}
	}
	function freeze(id) {
		setSquares(oldSquares => (
			oldSquares.map(square => (
				square.id === id ? {...square, isFreezed: true}:square
			))	
		))
	}
	function startTimer() {
		mode === "easy" ? setTimer(10)
		:mode === "medium" ? setTimer(5)
		:setTimer(3)
		clearInterval(looseTimer)
		looseTimer = setInterval (() => {
			setTimer(prevTimer => prevTimer -1)
		}, 1000)
	}
	function startDuration() {
		durationInterval = setInterval(() => {
			setDuration(prevDuration => prevDuration + 1)
		}, 1000)
	}
	function roll() {
		setSquares(squares => (
			squares.map(square => (
				square.isFreezed ? square :
				{ ...square, number: 1+Math.floor(Math.random() * 6) }
			))
		))
	}
	function restart(mode) {
		document.querySelectorAll('.square').forEach(square => square.classList.remove('selected-false'))
		setResult(false);
		console.log(mode)
		setSquares(mode === "hard" ? [...squaresData, ...additionalSquares] : squaresData)
		setTimer(false);
		setDuration(0);
		clearInterval(winMessageInterval)
		roll()
	}
	const squaresElements = squares.map((square) => {
		return <span key={square.id} id = {square.id} className={`square ${square.isFreezed&&"freezed"}`} onClick={()=>play(square)}>{square.number}</span>
	})
	function convertToTime(number) {
		return `0${Math.floor(number/60)}:${number%60<10?0:""}${number%60}`
	}
	return (
		<div className="game">
			{result.result === 'win' && <ReactConfetti height="860px"/>}
			<div className="mode-and-duration">
				<Mode chooseTheMode={chooseTheMode} mode={mode}/>
				<span className="duration">{convertToTime(duration)}</span>
			</div>
				{timer >= 0 && <Timer timer={timer}/>}
			<div className="squares-container">
				{squaresElements}
			</div>
			{ result &&(
				result.result==='win'?
				<div className="win-message-container">
					<span className="win-message">Congratulation You Win !</span>
					{result.message && <span className="highest-score-message">{result.message}</span>}
					<span className="game-score">Your Score: {convertToTime(duration)}</span>
				</div>
				:<span className="loose-message">{result.message} Try Again</span>) }
			<button className="roll-button" onClick={handleClick}>{result? "Play Again":"Roll"}</button>
			<span>Highest Scores</span>
			<Score scores={highestScore} convertToTime={convertToTime}/>
		</div>	
	)
}
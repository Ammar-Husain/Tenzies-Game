import React from 'react'
export default function Mode({chooseTheMode, mode}) {
	return (
		<div className="chooseTheMode">
			<button
				className={`mode-button ${mode==="easy"?"selected-mode":""}`}
				onClick={() => chooseTheMode('easy')}>
				Easy
			</button>
			<button
				className={`mode-button ${mode==="medium"?"selected-mode":""}`}
				onClick={() => chooseTheMode('medium')}>
				Medium
			</button>
			<button
				className={`mode-button ${mode==="hard"?"selected-mode":""}`}
				onClick={() => chooseTheMode('hard')}>
				Hard
			</button>
		</div>	
	)
}
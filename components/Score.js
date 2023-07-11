import React from 'react'
export default function Score({scores, convertToTime}) {
	return (
		<div className="scores-container">
			<span>Easy: <span className="score">{convertToTime(scores.easy)}</span></span>
			<span>Medium: <span className="score">{convertToTime(scores.medium)}</span></span>
			<span>Hard: <span className="score">{convertToTime(scores.hard)}</span></span>
		</div>
	)
}
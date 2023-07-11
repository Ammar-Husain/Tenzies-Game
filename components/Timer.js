import React from 'react'
export default function Timer({timer}) {
	let style;
	timer > 5? style = {color: "green"}
	: timer <= 5 && timer > 3? style={color: "yellow"}
	: style = {color: "red"}
	return (
		<div className="timer" style={style}>{timer}</div>	
	)
}
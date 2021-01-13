import React from 'react'
import Button from './Dashboard/Button'
import './NavigBar.css' 	

const NavigBar=(props)=>(
			<div className='navigbar'>
				{props.children}
			</div>
		)
	

export default NavigBar
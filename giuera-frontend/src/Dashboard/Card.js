import React from 'react'
import DashboardStyles from './DashboardStyles'


class Card extends React.Component{

	constructor(props){
		super(props)
	}

	render(){
		return(
		<div style={DashboardStyles.card}>
			<h1> {this.props.header} </h1>
			{this.props.children}
		</div>
		)
	}
}
export default Card
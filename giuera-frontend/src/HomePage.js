
import React from 'react'
import './HomePage.css' 
import {Link} from 'react-router-dom'

class HomePage extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return(
			<>
		<div className='bg'>
			<div className="shade">
				<div class="cont"> 
						<h1 className="mainPageTitle">
							WELCOME TO GIUERA
						</h1>
				</div>

				<div class="cont"> 
					<div>
						<Link to="/signin">
							<button id="signInButton">SIGN IN</button>
						</Link>
						<Link to="/register">
							<button id="registerButton">REGISTER</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
		</>
		)
	}
}
export default HomePage

import React from 'react'
import FormPage from './Form/FormPage'
import InputBox from './Form/InputBox'


class SignInPage extends React.Component{

	constructor(props){
		super(props)

		this.state = {
			username:'',
			password:''
		}

	}

	onUsernameChange = (event) =>{
			this.setState({username:event.target.value});
	}

	onPasswordChange = (event) =>{
			this.setState({password:event.target.value})
	}
	

	onSubmit = (e) => {
		e.preventDefault()
		console.log(this.state)
	}

	render(){
		return (
			<FormPage header="sign in">
				<InputBox label="username" type="text" onChange={this.onUsernameChange}/>
				<InputBox label="password" type="password" onChange={this.onPasswordChange}/>
				<button onClick={this.onSubmit}>sign in</button>
			</FormPage>
		)
	}
}
export default SignInPage
import { Link } from "react-router-dom";
import React from "react";
import Dashboard from "./Dashboard/Dashboard";
import FormPage from "./Form/FormPage";
import InputBox from "./Form/InputBox";
import NavigBar from "./NavigBar";

class SignInPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userid: "",
			password: "",
			signedIn: 0,
			signInAs: "",
			msg: "",
		};
	}

	signOut = (e) => {
		this.setState({
			userid: "",
			password: "",
			signedIn: 0,
			signInAs: "",
			msg: "",
		});
	};

	onUserIDChange = (event) => {
		this.setState({ userid: event.target.value });
	};

	onPasswordChange = (event) => {
		this.setState({ password: event.target.value });
	};

	signInResultMsg = () => {
		if (this.state.signedIn === "err") {
			return <h1 style={{ color: "tomato" }}>ERROR : {this.state.msg}</h1>;
		}
	};

	sendSubmission = async (sub) => {
		//send sign in submission to backend

		const request = {
			//creating request
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub), //storing submission into the body of the request
		};

		let response = await fetch("http://localhost:3001/userlogin", request); //sends to the backend, then waits for response
		let data = await response.json(); //convert JSON to javascript object after receiving the response
		console.log(data);
		this.setState({
			signedIn: data.signedIn, //update state using received object from backend
			signInAs: data.signInAs,
			msg: data.msg,
		});
	};

	onSubmit = (e) => {
		let submission = {
			userid: this.state.userid,
			password: this.state.password,
			signedIn: this.state.signedIn,
		};

		e.preventDefault();
		this.sendSubmission(submission);
		console.log(this.state);
	};

	render() {
		if (this.state.signedIn === 1) {
			return (
				<>
					<NavigBar>
						<button
							onClick={this.signOut}
							style={{ backgroundColor: "black", color: "white" }}
						>
							sign out
						</button>
					</NavigBar>
					<Dashboard
						user={{
							id: this.state.userid,
							type: this.state.signInAs,
						}}
					></Dashboard>
				</>
			);
		}
		return (
			<FormPage header="sign in">
				{this.signInResultMsg()}
				<InputBox label="id" type="text" onChange={this.onUserIDChange} />
				<InputBox
					label="password"
					type="password"
					onChange={this.onPasswordChange}
				/>
				<button onClick={this.onSubmit}>sign in</button>
				<Link to="/">
					<button>back</button>
				</Link>
			</FormPage>
		);
	}
}
export default SignInPage;

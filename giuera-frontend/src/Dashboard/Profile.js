
import React from 'react'
import Card from "./Card";
import Button from "./Button";
import InfoBox from "./InfoBox";
import Scrollable from "./Scrollable";
import InputBox from "./../Form/InputBox";
import RadioContainer from "./../Form/RadioContainer";
import RadioButton from "./../Form/RadioButton";

class Profile extends React.Component{

	constructor(props){
			
		super(props);
		this.state ={ 
			user:null,
			profileEditFlag: 0,
			newProfile: {
				firstName: "",
				lastName: "",
				email: "",
				password: "",
				address: "",
				gender: "",
			},
		};

		
		this.profileEditFuncs = {
			onFirstNameChange: (event) => {
				console.log(this.state);
				this.setState({
					newProfile: {
						...this.state.newProfile,
						firstName: event.target.value,
					},
				});
			},

			onLastNameChange: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						lastName: event.target.value,
					},
				});
			},

			onEmailChange: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						email: event.target.value,
					},
				});
			},

			onPasswordChange: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						password: event.target.value,
					},
				});
			},

			onAddressChange: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						address: event.target.value,
					},
				});
			},

			onSelectMale: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						gender: 0,
					},
				});
			},

			onSelectFemale: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						gender: 1,
					},
				});
			},
			changeProfile: async () => {
				this.profileEditFuncs.toggleProfileEdit();
				const sub = {
					userid: this.state.user.id,
					...this.state.newProfile,
				};

				console.log(sub);

				const request = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(sub),
				};

				let response = await fetch(
					"http://localhost:3001/editprofile",
					request
				);
				//let data = await response.json();
				this.props.loadProfile();
			},

			toggleProfileEdit: () => {
				console.log(this.state.profileEditFlag);

				this.setState({
					profileEditFlag: !this.state.profileEditFlag,
				});
			},
		};

	}	
	componentDidMount = () =>{
		this.setState({user:this.props.user})
	}

	profileView = () => {
		if (this.state.user==null){
			return <h1>loading</h1>
		}

		return (
			<Scrollable>
				{console.log('s:',this.state.user)}
				<Button onClick={this.profileEditFuncs.toggleProfileEdit}>edit</Button>
				<h2>{this.state.user.firstName + " " + this.state.user.lastName}</h2>
				<h2>{this.state.user.type === 2 ? "student" : "instructor"}</h2>
				<h2> ID : {this.state.user.id} </h2>
				<h2>
					{" "}
					{this.state.user.type === 2
						? "GPA : " + this.state.user.gpa
						: "rating : " + this.state.user.rating}
				</h2>
				<h2>Email: {this.state.user.email}</h2>
				<h2>Gender: {!this.state.user.gender ? "Male" : "Female"}</h2>
				<h2>Address: {this.state.user.address}</h2>
			</Scrollable>
		);
	};

	profileEdit = () => {
		return (
			<Scrollable>
				<InputBox
					label="first name"
					type="text"
					value={this.state.newProfile.firstName}
					onChange={this.profileEditFuncs.onFirstNameChange}
				/>
				<InputBox
					label="last name"
					type="text"
					value={this.state.newProfile.lastName}
					onChange={this.profileEditFuncs.onLastNameChange}
				/>
				<InputBox
					label="email"
					type="text"
					value={this.state.newProfile.email}
					onChange={this.profileEditFuncs.onEmailChange}
				/>

				<Button>tel. numbers</Button>

				<RadioContainer label="gender">
					<RadioButton
						label="male"
						name="gender"
						onChange={this.profileEditFuncs.onSelectMale}
					></RadioButton>
					<RadioButton
						label="female"
						name="gender"
						onChange={this.profileEditFuncs.onSelectFemale}
					></RadioButton>
				</RadioContainer>

				<InputBox
					label="Address"
					type="text"
					value={this.state.newProfile.address}
					onChange={this.profileEditFuncs.onAddressChange}
				/>
				<InputBox
					label="password"
					type="password"
					onChange={this.profileEditFuncs.onPasswordChange}
				/>

				<Button onClick={this.profileEditFuncs.changeProfile}>save</Button>
				<Button onClick={this.profileEditFuncs.toggleProfileEdit}>
					cancel
				</Button>
			</Scrollable>
		);
	};

		
	
	render = () => (
			this.state.profileEditFlag ? this.profileEdit() : this.profileView()
	)

}

export default Profile;
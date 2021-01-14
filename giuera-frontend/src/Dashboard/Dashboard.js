
import React from 'react'
import CardsContainer from './CardsContainer'
import DashboardStyles from './DashboardStyles'
import Card from './Card'
import Button from './Button'
import InfoBox from './InfoBox'
import Scrollable from './Scrollable'
import InputBox from './../Form/InputBox'
import RadioContainer from './../Form/RadioContainer'
import RadioButton from './../Form/RadioButton'

class Dashboard extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			profileEditFlag:0,

			newProfile:{
				firstName:'',
				lastName:'',
				email:'',
				password:'',
				address:'',
				gender:'',

			},

			user:{},
			courses:[],
		};

		this.profileEditFuncs = {

			onFirstNameChange:(event)=>{
				console.log(this.state);
				this.setState(()=>{this.state.newProfile.firstName = event.target.value})
			},

			onLastNameChange:(event)=>{
				this.setState(()=>{this.state.newProfile.lastName = event.target.value})
			},

			onEmailChange:(event)=>{
				this.setState(()=>{this.state.newProfile.email = event.target.value})
			},

			onPasswordChange:(event)=>{
				this.setState(()=>{this.state.newProfile.password = event.target.value})
			},

			onAddressChange:(event)=>{
				this.setState(()=>{this.state.newProfile.address = event.target.value})
			},

			onSelectMale:(event)=>{
				this.setState(()=>{this.state.newProfile.gender = 0})
			},

			onSelectFemale:(event)=>{
				this.setState(()=>{this.state.newProfile.gender = 1})
			},
			changeProfile : async () =>{


				const sub = {
					userid : this.props.user.id,
					...this.state.newProfile
				}

				console.log(sub)

				const request = {          
				method : 'POST',  
				headers : {'Content-Type' : 'application/json'},
				body : JSON.stringify(sub),
				}

				let response = await fetch('http://localhost:3001/editprofile',request) 
				//let data = await response.json();
				this.loadProfile()

				

			},

			toggleProfileEdit:()=>{
					console.log(this.state.profileEditFlag)

					if (this.state.profileEditFlag==1){
						this.profileEditFuncs.changeProfile()
					}		
					this.setState({
						profileEditFlag:!this.state.profileEditFlag	
					})
			}

		}
	}
	// fetchCoursesToBuy = () => {

	// }
	
	fetchStudentCourses = async () => {

			const sub = {
				studentid : this.props.user.id
			}

			const request = {          
			method : 'POST',  
			headers : {'Content-Type' : 'application/json'},
			body : JSON.stringify(sub),
			}

			let response = await fetch('http://localhost:3001/viewenrolled',request) 
			let data = await response.json();

				this.setState({
					courses:data.courses
				})
						
		} 

	
	
	loadProfile = async () => {

		if (this.props.user.type==1){
			const sub = {
				instructorid : this.props.user.id
			}

			const request = {          
			method : 'POST',  
			headers : {'Content-Type' : 'application/json'},
			body : JSON.stringify(sub),
			}

			let response = await fetch('http://localhost:3001/instructorprofile',request) 
			let data = await response.json();
			console.log()
				this.setState({
					flag:'',
					courses:[],
					user : {
						id:this.props.user.id,
						firstName : data.firstName ,
						lastName : data.lastName ,
						gender : data.gender ,
						email : data.email ,
						address : data.address ,
						rating : data.rating ,
					}
				})
			
		} 

		else if (this.props.user.type==2){

			this.fetchStudentCourses()	

			const sub = {
				studentid : this.props.user.id
			}

			const request = {          
			method : 'POST',  
			headers : {'Content-Type' : 'application/json'},
			body : JSON.stringify(sub),
			}

			let response = await fetch('http://localhost:3001/studentprofile',request) 
			let data = await response.json();

				this.setState({
					user : {
						id:this.props.user.id,
						gpa : data.gpa ,
						firstName : data.firstName ,
						lastName : data.lastName ,
						gender : data.gender ,
						email : data.email ,
						address : data.address ,
					}
				})
						
		} 

	}

	componentDidMount = async()=>{
		await this.loadProfile()	
	}


	viewCourses = () => {
		console.log('test tegrege : ',this.state.courses)
			return this.state.courses.map(course=>(
				<InfoBox key={course.cid} header={course.name} sub={"credit hours:" + course.creditHours}>
				<Button>view</Button>	
				</InfoBox>
			))
	}

	profileView = () =>{
				return (
					<>
					<h2>{this.state.user.firstName + ' ' + this.state.user.lastName}</h2>
					<h2>{(this.props.user.id==2)? 'student':'instructor'}</h2>
					<h2> ID : {this.state.user.id} </h2>
					<h2> rating </h2>
					<Button onClick={this.profileEditFuncs.toggleProfileEdit}>edit</Button>
					</>
				)
	}


	profileEdit = () =>{
				return (
					<Scrollable>
						
						<InputBox label="first name" type="text" onChange={this.profileEditFuncs.onFirstNameChange}/>
						<InputBox label="last name" type="text" onChange={this.profileEditFuncs.onLastNameChange}/>
						<InputBox label="email" type="text" onChange={this.profileEditFuncs.onEmailChange}/>

						<RadioContainer label="gender" >
							<RadioButton label="male" name="gender" onChange={this.profileEditFuncs.onSelectMale}></RadioButton>
							<RadioButton label="female" name="gender" onChange={this.profileEditFuncs.onSelectFemale}></RadioButton>
						</RadioContainer>	

						<InputBox label="Address" type="text" onChange={this.profileEditFuncs.onAddressChange}/>
						<InputBox label="password" type="password" onChange={this.profileEditFuncs.onPasswordChange}/>

						<Button onClick={this.profileEditFuncs.toggleProfileEdit}>save</Button>
					</Scrollable>
				)
	}
	
	instructorDashboard = ()=>{
		return (

					<div style={DashboardStyles.bg}>
						<h1 style={{color:'white'}}>
							Welcome, {this.state.user.firstName}
						</h1>
						<CardsContainer>
							<Card header="my courses">
								<Scrollable>
								</Scrollable>
							</Card>

							<Card header="profile">
							</Card>

							<Card header="payment settings">
							</Card>




						</CardsContainer>
						
						</div>
		)
	}

	studentDashboard = () =>{
					return(

					<div style={DashboardStyles.bg}>
						<h1 style={{color:'white'}}>
							Welcome, {this.state.user.firstName}
						</h1>
						<CardsContainer>
							<Card header="my courses">
								<Scrollable>
									{this.viewCourses()}
								</Scrollable>
							</Card>

							<Card header="profile">
								{(this.state.profileEditFlag)? this.profileEdit():this.profileView() }
							</Card>

							<Card header="assignments">
								<h1>
									hello world
								</h1>
								ay 7aga
							</Card>

							<Card header="available courses">

							</Card>




						</CardsContainer>
						
						</div>
				)

	}

	render(){
			if (this.state.user.type==1){
				return this.instructorDashboard()
			}

		return	this.studentDashboard()
		
		

		
	}

}

export default Dashboard
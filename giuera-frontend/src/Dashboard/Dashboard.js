
import React from 'react'
import CardsContainer from './CardsContainer'
import DashboardStyles from './DashboardStyles'
import Card from './Card'
import Button from './Button'
import InfoBox from './InfoBox'
import Scrollable from './Scrollable'




class Dashboard extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			user:{},
			courses:[],
		};
	}

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

	

	componentDidMount = async()=>{
		console.log(this.props.user)

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


	viewCourses = () => {
		console.log('test tegrege : ',this.state.courses)
			return this.state.courses.map(course=>(
				<InfoBox key={course.cid} header={course.name} sub={"credit hours:" + course.creditHours}>
				<Button>view</Button>	
				</InfoBox>
			))
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
								<h2>{this.state.user.firstName + ' ' + this.state.user.lastName}</h2>
								<h2>instructor</h2>
								<h2> ID : {this.state.user.id} </h2>
								<h2> rating </h2>
								<Button>edit</Button>
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
								<h2>{this.state.user.firstName + ' ' + this.state.user.lastName}</h2>
								<h2>student</h2>
								<h2> ID : {this.state.user.id} </h2>
								<Button>edit</Button>
							</Card>

							<Card header="assignments">
								<h1>
									hello world
								</h1>
								ay 7aga
							</Card>




						</CardsContainer>
						
						</div>
				)

	}

	render(){
			if (this.state.user.id==1){
				return this.instructorDashboard()
			}

		return	this.studentDashboard()
		
		

		
	}

}

export default Dashboard
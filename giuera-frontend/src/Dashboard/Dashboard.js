
import React from 'react'
import CardsContainer from './CardsContainer'
import DashboardStyles from './DashboardStyles'
import Card from './Card'
import Button from './Button'
import InfoBox from './InfoBox'
import Scrollable from './Scrollable'
let courses=[
	{
		name:"CSEN202",
		ch:"6"
	},
	{
		name:"AS",
		ch:"3"
	},
	{
		name:"MATH103",
		ch:"6"
	},
	{
		name:"PHYS101",
		ch:"5"
	},
	{
		name:"CHEM101",
		ch:"5"
	},
]

const getCourses = (courseList) => (
		courseList.map(course => (
			<InfoBox header={course.name} sub={"credit hours : " + course.ch}>
			<Button>view</Button>
			</InfoBox>
		)
	)
)


class Dashboard extends React.Component{

	constructor(props){
		super(props)
		this.state = {user:{}};
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

	studentDashboard = ()=>{
		return (

					<div style={DashboardStyles.bg}>
						<h1 style={{color:'white'}}>
							Welcome, {this.state.user.firstName}
						</h1>
						<CardsContainer>
							<Card header="my courses">
								<Scrollable>
									{getCourses(courses)}
								</Scrollable>
							</Card>

							<Card header="profile">
								<h2>{this.state.user.firstName + ' ' + this.state.user.lastName}</h2>
								<h2>instructor</h2>
								<h2> ID : {this.state.user.id} </h2>
								<h2> rating </h2>
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

	instructorDashboard = () =>{
					return(

					<div style={DashboardStyles.bg}>
						<h1 style={{color:'white'}}>
							Welcome, {this.state.user.firstName}
						</h1>
						<CardsContainer>
							<Card header="my courses">
								<Scrollable>
									{getCourses(courses)}
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

				return this.studentDashboard()
		}

		return	this.instructorDashboard()
		
		

		
		}
}
export default Dashboard
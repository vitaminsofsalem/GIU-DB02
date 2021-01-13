
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
	}

	render(){
		return(

		 <div style={DashboardStyles.bg}>
			<CardsContainer>
				<Card header="my courses">
					<Scrollable>
						{getCourses(courses)}
					</Scrollable>
				</Card>

				<Card header="profile">
					<h2>Ibrahim Ahmed</h2>
					<h2> ID : 100-1234 </h2>
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
}
export default Dashboard
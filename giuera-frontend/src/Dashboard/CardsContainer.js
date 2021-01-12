import DashboardStyles from './DashboardStyles'
const CardsContainer=(props)=>(

				<div style={DashboardStyles.cardsContainer}>
					{props.children}
				</div>

)
export default CardsContainer
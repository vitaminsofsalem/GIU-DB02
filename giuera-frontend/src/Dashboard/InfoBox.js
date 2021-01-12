
import DashboardStyles from './DashboardStyles'

const InfoBox=(props)=>(
	<div style={DashboardStyles.InfoBox}>

		<h4 style={{margin:"1px"}}>{props.header}</h4>
		<h5 style={{margin:"1px"}} >{props.sub}</h5>

		{props.children}
	</div>
)


export default InfoBox
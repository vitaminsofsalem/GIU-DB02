import DashboardStyles from './DashboardStyles'

	const Win = (props)=> {
		
		if (props.toggle==0){
			return (<></>)
		}	
		
		return (
		<div style={DashboardStyles.win}>
			{props.children}
		</div>
		)
	}


export default Win
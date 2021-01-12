import DashboardStyles from './DashboardStyles'

const Button=(props)=>(
<button style={DashboardStyles.button} onClick={props.onCLick}>
	{props.children}
</button>
)

export default Button
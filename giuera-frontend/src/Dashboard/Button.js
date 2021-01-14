import DashboardStyles from './DashboardStyles'

const Button=(props)=>(
<button style={DashboardStyles.button} onClick={props.onClick}>
	{props.children}
</button>
)

export default Button
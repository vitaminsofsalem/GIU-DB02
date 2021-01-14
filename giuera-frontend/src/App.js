import HomePage from './HomePage'
import SignInPage from './SignInPage'
import RegisterPage from './RegisterPage'
import Dashboard from './Dashboard/Dashboard'

import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'

function App() {
  return (
	  <>
	  <Router>
		<Switch>
			<Route path="/" exact component={HomePage}/>
			<Route path="/signin" exact component={SignInPage}/>
			<Route path="/register" exact component={RegisterPage}/>
		</Switch>
	  </Router>
	  </>
  );
}

export default App;

// imports
import React from 'react';
import './styles/style.scss'
// import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
// page imports
import Login from './pages/Login';
import Register from './pages/Register';
import BudgetTracker from './pages/BudgetTracker';
import AdminControls from './pages/AdminControls';
// component imports
import MainNav from './components/Navigation/MainNav';
import ApplicationProvider from './contexts/ApplicationContext';
// routes imports
import UserRoutes from './Routes/UserRoutes';
import GuestRoutes from './Routes/GuestRoutes'

function App() {

    return(
        <div className="App">
            <ApplicationProvider>
                <Router>
                    <MainNav />
                    <Switch>
                        <GuestRoutes exact path="/" component={Login} />
                        <GuestRoutes exact path="/register" component={Register}/>
        
                        <UserRoutes exact path="/app" component={BudgetTracker}/>
                        <UserRoutes path="/AdminControls" component={AdminControls}/>

                    </Switch>
                </Router>
            </ApplicationProvider>
        </div>
    );
}

export default App;
import { Route, Redirect } from 'react-router-dom';

const GuestRoutes = ({component: Component, ...rest}) => {

    let token = localStorage.getItem('token')

    return (
        <Route

            render={ props => (
                (token === null) ? 
                <Component {...rest} /> 
                :
                <Redirect to="/app" />

            )}
        />
    )
}

export default GuestRoutes;

import { Route, Redirect } from 'react-router-dom';

const UserRoutes = ({component: Component, ...rest}) => {

    let token = localStorage.getItem('token')

    return (
        <Route

            render={ props => (
                (token !== null) ? 
                <Component {...rest} /> 
                :
                <Redirect to="/" />

            )}
        />
    )
}

export default UserRoutes;

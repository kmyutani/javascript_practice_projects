import {Navbar, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useContext} from 'react';
import {ApplicationContext} from './../../contexts/ApplicationContext';
import { useHistory } from "react-router-dom";

export default function MainNav() {

    let history = useHistory()

    const {user, setUser} = useContext(ApplicationContext);

    const handleClick = () =>{
		setUser({
			userId : "",
			isAdmin: "",
			firstName: "",
			lastName: ""
		});

		localStorage.clear();

        alert(`Hope to see you again ${user.firstName} ${user.lastName}!`);

        history.push('/');

	};
    
    const regularLinks = !user.userId ?
        <>  
            <Nav.Link>Hello Guest!</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            {/* <Nav.Link as={Link} to="/howTo">How To Use</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contacts</Nav.Link> */}
        </>
        :
        <>  
            <Nav.Link>{`Welcome, ${user.firstName} ${user.lastName}!`}</Nav.Link>
            {user.isAdmin ? <Nav.Link as={Link} to="/adminControls">Admin Controls</Nav.Link> : <></>}
            <Nav.Link as={Link} to="/app">Financial</Nav.Link>
            {/* <Nav.Link as={Link} to="/howTo">How To Use</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contacts</Nav.Link> */}
            <Nav.Link onClick={handleClick}>Logout</Nav.Link>
            
        </>

    const brandLink = !user.userId ?
    <>
        <Navbar.Brand as={Link} to="/">Key Budgets</Navbar.Brand>
    </>
    :
    <>
        <Navbar.Brand as={Link} to="/App">Key Budgets</Navbar.Brand>
    </>

    return (
        <Navbar bg="light" expand="md">
            {brandLink}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                {regularLinks}
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
};
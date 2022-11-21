import { useState, useContext } from "react";
import { useHistory} from 'react-router-dom';
import { Form, Button, Card} from "react-bootstrap";
import { ApplicationContext} from './../../contexts/ApplicationContext';

export default function LoginForm() {

    const { setUser} = useContext(ApplicationContext);

    const [isLoading, setIsLoading] = useState(false);

    const [err, setErr] = useState("");

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const history = useHistory()
    

    const handleSubmit = async e =>{
        e.preventDefault();
        
        try {
            
            setIsLoading(true);

            const res = await fetch(
                "https://kmybudgets-backend.herokuapp.com/api/users/login", {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            
            if (res.status === 200) {

                alert("Login Successful!");

                const token = await res.json();
                localStorage.setItem('token', token.access);

                const userDataRaw = await fetch(
                    "https://kmybudgets-backend.herokuapp.com/api/users/details", {
                        headers: {
                            "Authorization": `Bearer ${token.access}`
                        }
                    }
                );
                
                const userData = await userDataRaw.json();
                
                const { firstName, lastName, isAdmin } = userData;

                setUser({
                    userId: userData._id,
                    firstName,
                    lastName,
                    isAdmin
                });

                history.push("/app");

            } else {
                
                const error = await res.json();
                setErr(error.error.message);

                setIsLoading(false);

            };
            

        } catch (err) {

            console.log(err);

        };
    };

    function handleChange(e) {
        setCredentials({
            ...credentials,
            [e.target.id] : e.target.value
        })
    } 

    return (
        <Card className="mt-5">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <h5>{err}</h5>
                    <Form.Group controlId={"email"}>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control 
                            type="email"
                            onChange={handleChange}
                            value={credentials.email}
                        />
                    </Form.Group>
                    <Form.Group controlId={"password"}>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control 
                            type="password"
                            onChange={handleChange}
                            value={credentials.password}
                        />
                    </Form.Group>
                    {
                            isLoading ? 
                            <Button type="Submit" disabled block>Login</Button>
                            : 
                            <Button type="Submit" block>Login</Button>
                    }
                    
                </Form>
            </Card.Body>
        </Card>
    )

}
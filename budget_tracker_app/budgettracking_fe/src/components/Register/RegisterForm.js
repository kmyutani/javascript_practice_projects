import { useState } from "react";
import { Form, Button, Card} from "react-bootstrap";
import { useHistory } from "react-router-dom";


export default function RegisterForm() {

    let history = useHistory()

    const [credentials, setCredentials] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNo: ""
    });

    const [err, setErr] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async e =>{
        e.preventDefault();
    
        try {
            
            setIsLoading(true);
            
            const res = await fetch(
                "https://kmybudgets-backend.herokuapp.com/api/users/register", {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            
            if (res.status === 201) {
                
                alert("Congratulations,Spend Money Well.");

                history.push('/');
                return;

            } else {

                const error = await res.json();
                setErr(error.error.message);

                setIsLoading(false);

            }

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
                    <h2>Register</h2>
                    <h5>{err}</h5>
                    <Form.Group controlId={"firstName"}>
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control 
                            type="text"
                            onChange={handleChange}
                            value={credentials.firstName}
                        />
                    </Form.Group>

                    <Form.Group controlId={"lastName"}>
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control 
                            type="text"
                            onChange={handleChange}
                            value={credentials.lastName}
                        />
                    </Form.Group>

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

                    <Form.Group controlId={"confirmPassword"}>
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control 
                            type="password"
                            onChange={handleChange}
                            value={credentials.confirmPassword}
                        />
                    </Form.Group>

                    <Form.Group controlId={"mobileNo"}>
                        <Form.Label>Mobile Number:</Form.Label>
                        <Form.Control 
                            type="text"
                            onChange={handleChange}
                            value={credentials.mobileNo}
                        />
                    </Form.Group>

                    {
                            isLoading ? 
                            <Button type="Submit" disabled block>Register</Button>
                            : 
                            <Button type="Submit" block>Register</Button>
                    }
                    
                </Form>
            </Card.Body>
        </Card>
    )

}
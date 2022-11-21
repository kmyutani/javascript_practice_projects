import { useState, useEffect} from "react";
import { Card, Button, Container, Row, Col} from "react-bootstrap";

export default function Tracker() {

    const [activeUsers, setActiveUser] = useState([]);
    const [incomeTransactions, setIncomeTransactions] = useState([])
    const [expensesTransaction, setExpensesTransaction] = useState([])



    useEffect(() =>{
        fetch('https://kmybudgets-backend.herokuapp.com/api/users/allActive',{
			headers: {
				'Authorization' : `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then( res => res.json())
		.then( allActiveUser => {
            setActiveUser(allActiveUser)
		})
		.catch( err =>console.log( err ))
    }, []);

    const [userId, setUserId] = useState("")

    const handleCopy = (e) =>{
        setUserId(e.target.id)
    }

    const userDetails = activeUsers.map((user, index) =>{
        return (
            <Card key={index}>
                <Card.Body>
                    <Card.Text>UserId: {user._id}</Card.Text>
                    <Card.Text>Name: {user.firstName} {user.lastName}</Card.Text>
                    <Card.Text>Email: {user.email}</Card.Text>
                    <Card.Text>Mobile: {user.mobileNo}</Card.Text>
                    <Button 
                        variant="info" 
                        id={user._id} 
                        onClick={handleCopy}
                    >Copy User ID</Button>
                </Card.Body>
            </Card>  
        );
    });

    const handleSearch = () =>{
        fetch(`https://kmybudgets-backend.herokuapp.com/api/transactions/all/${userId}`,{
			headers: {
				'Authorization' : `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then( res => res.json())
		.then( data => {
            setIncomeTransactions(data.incomeTransactions)
            setExpensesTransaction(data.expensesTransaction)
		})
		.catch( err =>console.log( err ))
    }

    const incomeArray = incomeTransactions.map((item, index) =>{
        return (
            <Card key={index}>
                <Card.Body>
                    <Card.Text>Income: {item.income}</Card.Text>
                    <Card.Text>CategoryId: {item.categoryId}</Card.Text>
                </Card.Body>
            </Card>  
        );
    });

    const expensesArray = expensesTransaction.map((item, index) =>{
        return (
            <Card key={index}>
                <Card.Body>
                    <Card.Text>Expenses: {item.expenses}</Card.Text>
                    <Card.Text>CategoryId: {item.categoryId}</Card.Text>
                </Card.Body>
            </Card>  
        );
    });

    return (
        <Container>
            <Row>
                <Col md={12} lg={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center font-weight-bold">Active Users</Card.Title>
                            {userDetails}
                        </Card.Body>
                    </Card>    
                </Col>
                <Col md={12} lg={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center font-weight-bold">User Transactions</Card.Title>
                            <Button 
                                variant="info" 
                                onClick={handleSearch}
                            >Search</Button>
                            <Card.Title>Income</Card.Title>
                            {incomeArray}
                            <Card.Title>Expenses</Card.Title>
                            {expensesArray}
                        </Card.Body>
                    </Card> 
                </Col>
            </Row>
        </Container>
    );
};


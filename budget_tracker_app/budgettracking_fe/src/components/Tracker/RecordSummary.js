import {useContext, useState} from "react";
import { 
    Card, 
    Button, 
    Modal, 
    Form, 
    Tabs, 
    Tab, 
    Col
} from "react-bootstrap";
import { ApplicationContext} from './../../contexts/ApplicationContext';

export default function Tracker() {

    const { transactionDetails, setIsUpdated} = useContext(ApplicationContext);

    const [key, setKey] = useState('home');
    const [showUpdate, setShowUpdate] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [request, setRequest] = useState({
        income: 0,
        expenses: 0
    })

    let incomeTransactions = [];
    let expensesTransaction = [];

    if (transactionDetails.incomeTransactions !== undefined) {
        incomeTransactions = transactionDetails.incomeTransactions
    };

    if (transactionDetails.expensesTransaction !== undefined){
        expensesTransaction = transactionDetails.expensesTransaction
    };

    const handleCloseUpdate = () => setShowUpdate(false);

    const handleEntryChange = (e) =>{
        setRequest({
            ...request,
            [transactionType]: e.target.value
        })
    };

    const handleUpdateTransaction = async (e) =>{
        setCategoryId(e.target.id);
        setTransactionType(e.target.name);
        setShowUpdate(true);
    };

    const handleDeleteTransaction = async (e) =>{
        
        try {
          
            const res = await fetch( 
                `https://kmybudgets-backend.herokuapp.com/api/transactions/${e.target.name}/delete/${e.target.id}`,{
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
            });
            
            if (res.status === 200) {
                
                const transactionDetails = await res.json();
                setIsUpdated(transactionDetails);

            } else {

                throw new Error("Something has gone wrong :(");

            }

        } catch (err) {
            
            console.log(err);

        };
    };

    const handleSendUpdateTransaction= async (e) =>{
       
        try {
          
            const res = await fetch( 
                `https://kmybudgets-backend.herokuapp.com/api/transactions/${transactionType}/update/${categoryId}`,{
                    method: 'PATCH',
                    body: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (res.status === 200) {
                
                const transactionDetails = await res.json();
                setIsUpdated(transactionDetails);
                setRequest({
                    income: 0,
                    expenses: 0
                });
                setTransactionType("");
                setCategoryId("");
                setShowUpdate(false);

            } else {

                throw new Error("Something has gone wrong :(");

            }

        } catch (err) {
            
            console.log(err);

        };
    };

    const updateTransactionModal = (
        <>
            <Modal show={showUpdate} onHide={handleCloseUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Col>
                                <Form.Label>Update {transactionType}</Form.Label>
                                <Form.Control id="entry" placeholder="New Entry" onChange={handleEntryChange} required/>
                            </Col>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdate}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSendUpdateTransaction}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

    const incomeItems = incomeTransactions.map((item, index) =>{
        return(
            <Card key={index} className="mt-1">
                <Card.Body>
                    <Card.Text>Income: {item.income}</Card.Text>
                    <Card.Text>Name: {item.categoryId.name}</Card.Text>
                    <Card.Text>Type: {item.categoryId.type}</Card.Text>
                    <Card.Text>Description: {item.categoryId.description}</Card.Text>
                    <Button 
                        variant="outline-warning" 
                        type="Submit" 
                        id={item.categoryId._id} 
                        name="income"
                        onClick={handleUpdateTransaction}
                    >Update</Button>
                    <Button 
                        className= "ml-2"
                        variant="outline-danger" 
                        type="Submit" 
                        id={item.categoryId._id}
                        name="income" 
                        onClick={handleDeleteTransaction}
                    >Delete</Button>
                </Card.Body>
            </Card>
        );
    });

    const expensesItem = expensesTransaction.map((item, index) =>{
        return(
            <Card key={index} className="mt-1">
                <Card.Body>
                    <Card.Text>expenses: {item.expenses}</Card.Text>
                    <Card.Text>Name: {item.categoryId.name}</Card.Text>
                    <Card.Text>Type: {item.categoryId.type}</Card.Text>
                    <Card.Text>Description: {item.categoryId.description}</Card.Text>
                    <Button 
                        variant="outline-warning" 
                        type="Submit" 
                        id={item.categoryId._id}
                        name="expenses" 
                        onClick={handleUpdateTransaction}
                    >Update</Button>
                    <Button 
                        className= "ml-2"
                        variant="outline-danger" 
                        type="Submit"
                        id={item.categoryId._id} 
                        name="expenses" 
                        onClick={handleDeleteTransaction}
                    >Delete</Button>
                </Card.Body>
            </Card>
        )
    })


    return (
        <Card className="mt-2">
			<Card.Body>
                <Card.Title className="text-center font-weight-bold">Transactions Summary</Card.Title>
                <Card>
                    <Card.Body>
                        <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3 content-center"
                        >
                            <Tab eventKey="home" title="Income">
                                {incomeItems}
                            </Tab>
                            <Tab eventKey="profile" title="Expenses">
                                {expensesItem}
                            </Tab>
                        </Tabs>
                        {updateTransactionModal}
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>    
    );
};


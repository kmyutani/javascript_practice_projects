import React, { useState, useContext, useEffect} from 'react';
import { 
    Card, 
    DropdownButton, 
    Dropdown, 
    Form,
    FormControl, 
    InputGroup, 
    Button,
    ButtonGroup,
    Row,
    Col,
    Modal
} from 'react-bootstrap';
import { ApplicationContext} from './../../contexts/ApplicationContext';

export default function MainDisplay() {

    const { transactionDetails, setTransactionDetails, categories, setIsUpdated, setFirstRender} = useContext(ApplicationContext);
    
    const [toggleLabel, setToggleLabel] = useState("income");
    const [entry, setEntry] = useState("");
    const [dropDownTitle, setDropDownTitle] = useState("Categories");
    const [request, setRequest] = useState({
        income: 0,
        expenses: 0,
        categoryId: ""
    });
    const [categoryId, setCategoryId] = useState("");
    const [categoryDetails, setCategoryDetails] = useState({
        name: "",
        type: "",
        description: ""
    })
    const [pastCategoryDetails, setPastCategoryDetails] = useState({
        name: "",
        type: "",
        description: ""
    })
    const [showUpdate, setShowUpdate] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        console.log("first RUNINGING");
        return (
            setFirstRender(1)
        )
    }, [])
    
    const handleToggle = (e) =>{
        (e.target.id === "income") ? setToggleLabel("expenses") :  setToggleLabel("income")
    };

    const handleChange = (e) =>{
        setEntry(e.target.value);
        setRequest({
            ...request,
            [toggleLabel]: e.target.value
        });
        
    };

    const handleCategory = (e) =>{
        setDropDownTitle(e.target.name);
        setRequest({
            ...request,
            categoryId : e.target.id
        });
    };

    const handleUpdateCategory = (e) =>{
        setCategoryId(e.target.id);
        setShowUpdate(true);
        let details = e.target.name;
        let detailsArray = details.split(",");
        setPastCategoryDetails({
            name: detailsArray[0],
            type: detailsArray[1],
            description: detailsArray[2]
        });
    };

    const handleAddCategory = () => {
        setShowAdd(true);
    };

    const handleCloseUpdate = () => setShowUpdate(false);
    const  handleCloseAdd = () => setShowAdd(false);

    const handleCategoryChange = (e) =>{
        setCategoryDetails({
            ...categoryDetails,
            [e.target.id]: e.target.value
        })
    }
   

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        try {
          
            const res = await fetch( 
                `https://kmybudgets-backend.herokuapp.com/api/transactions/${toggleLabel}`,{
                    method: 'POST',
                    body: JSON.stringify({
                        categoryId: request.categoryId,
                        income: parseInt(request.income),
                        expenses: parseInt(request.expenses)
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (res.status === 201) {

                const transactionData = await res.json();
                setTransactionDetails(transactionData);
                setRequest({
                    income: 0,
                    expenses: 0,
                    categoryId: ""
                });
                setEntry("");
                setDropDownTitle("Categories");
                setIsUpdated(transactionData);

            } else {

                throw new Error("Something has gone wrong :(");

            }

        } catch (err) {
            
            console.log(err);

        };
    };

    const handleSendAddCategory = async (e) =>{
        e.preventDefault();

        try {
          
            const res = await fetch( 
                `https://kmybudgets-backend.herokuapp.com/api/categories/add`,{
                    method: 'POST',
                    body: JSON.stringify(categoryDetails),
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (res.status === 201) {

                const categoryDetails = await res.json();
                setIsUpdated(categoryDetails);
                setCategoryDetails({
                    name: "",
                    type: "",
                    description: ""
                });
                setShowAdd(false);

            } else {

                throw new Error("Something has gone wrong :(");

            }

        } catch (err) {
            
            console.log(err);

        };
    };

    const handleSendUpdateCategory = async (e) =>{
        e.preventDefault();

        try {
          
            const res = await fetch( 
                `https://kmybudgets-backend.herokuapp.com/api/categories/update/${categoryId}`,{
                    method: 'PATCH',
                    body: JSON.stringify(categoryDetails),
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            
            if (res.status === 202) {
                
                const categoryDetails = await res.json();
                setIsUpdated(categoryDetails);
                setCategoryDetails({
                    name: "",
                    type: "",
                    description: ""
                });
                setPastCategoryDetails({
                    name: "",
                    type: "",
                    description: ""
                });
                setCategoryId("");
                setShowUpdate(false);

            } else {

                throw new Error("Something has gone wrong :(");

            }

        } catch (err) {
            
            console.log(err);

        };
    };

    const handleDeleteCategory = async (e) =>{

        try {
          
            const res = await fetch( 
                `https://kmybudgets-backend.herokuapp.com/api/categories/delete/${e.target.id}`,{
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (res.status === 200) {
                
                const categoryDetails = await res.json();
                setIsUpdated(categoryDetails);

            } else {

                throw new Error("Something has gone wrong :(");

            }

        } catch (err) {
            
            console.log(err);

        };
    };

    const updateCategoryModal = (
        <>
            <Modal show={showUpdate} onHide={handleCloseUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Col>
                                <Form.Label>Name</Form.Label>
                                <Form.Control id="name" placeholder={pastCategoryDetails.name} onChange={handleCategoryChange} required/>
                            </Col>
                            <Col>
                                <Form.Label>Type</Form.Label>
                                <Form.Control id="type" placeholder={pastCategoryDetails.type} onChange={handleCategoryChange} required/>
                            </Col>
                        </Form.Row>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} placeholder={pastCategoryDetails.description} onChange={handleCategoryChange}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdate}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSendUpdateCategory}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

    const AddCategoryModal = (
        <>
            <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Col>
                                <Form.Label>Name</Form.Label>
                                <Form.Control id="name" placeholder="What did you buy?" onChange={handleCategoryChange} required/>
                            </Col>
                            <Col>
                                <Form.Label>Type</Form.Label>
                                <Form.Control id="type" placeholder="What type is it?" onChange={handleCategoryChange} required/>
                            </Col>
                        </Form.Row>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} placeholder="Tell me something about it." onChange={handleCategoryChange}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSendAddCategory}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );


    return (
        <Card className="mt-5">
            <Card.Body>
                <Card.Title className="text-center font-weight-bold">₱ {transactionDetails.amount}</Card.Title>
                
                <Form.Check 
                    className="display-inline-block"
                    type="switch"
                    id={toggleLabel}
                    label={toggleLabel}
                    onClick={handleToggle}
                
                />
                <Row className="ml-1">
                    <div className="display-block">
                        <InputGroup>
                            <FormControl
                                placeholder="Entry"
                                type="number"
                                onChange={handleChange}
                                value={entry}
                            />
                        </InputGroup>
                    </div>
                    <div className="display-block">
                        <DropdownButton id="dropdown-basic-button" title={dropDownTitle} > 
                                {categories.map((category,index) =>{ 
                                    return(
                                        (category.isActive) ? 
                                        <Dropdown.Item 
                                            key={index} 
                                        > 
                                            <ButtonGroup size="sm" className="display-flex">
                                                <Button
                                                    variant="outline-info" 
                                                    type="Submit" 
                                                    id={category._id} 
                                                    name={category.name}
                                                    onClick={handleCategory}
                                                >{category.name}</Button>
                                                <Button
                                                    variant="outline-warning" 
                                                    type="Submit" 
                                                    id={category._id}
                                                    name={[category.name, category.type, category.description]}
                                                    onClick={handleUpdateCategory}
                                                >Edit</Button>
                                                <Button
                                                    variant="outline-danger" 
                                                    type="Submit" 
                                                    id={category._id} 
                                                    onClick={handleDeleteCategory}
                                                >Del</Button>
                                            </ButtonGroup>
                                        </Dropdown.Item>
                                        :
                                        <></>
                                    )
                                })}
                                <Dropdown.Divider />
                                    <Dropdown.Item eventKey="4">
                                        <Button variant="outline-success" type="Submit" onClick={handleAddCategory}>
                                            Add Category
                                        </Button>
                                    </Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <div>
                        <Button variant="primary" type="Submit" id="submit" onClick={handleSubmit}>Send</Button>
                    </div>
                    {updateCategoryModal}
                    {AddCategoryModal}
                </Row>
            </Card.Body>
        </Card>
    )
}



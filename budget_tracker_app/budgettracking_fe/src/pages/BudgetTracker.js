import {Container, Row, Col} from 'react-bootstrap';
import Tracker from './../components/Tracker/Tracker';
import RecordSummary from './../components/Tracker/RecordSummary';
import Chart from './../components/Tracker/Chart'

export default function BudgetTracker() {
    
    return (
        
        <Container>
            <Row>
                <Col className="mx-auto" xs={12} sm={10} md={6} >
                    <Tracker/>
                    <Chart/>
                </Col>
                <Col className="mx-auto" xs={12} sm={10} md={6} >
                    <RecordSummary/>
                </Col>
            </Row>
        </Container>
        
    );
};
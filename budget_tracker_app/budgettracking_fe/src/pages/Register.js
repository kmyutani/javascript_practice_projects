import RegisterForm from './../components/Register/RegisterForm';
import {Container, Row, Col} from 'react-bootstrap';

export default function Register() {
    return(
        <Container>
            <Row>
                <Col className="mx-auto" xs={12} sm={10} md={6} >
                    <RegisterForm/>
                </Col>
            </Row>
        </Container>
    )
}
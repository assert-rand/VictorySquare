import { Button, Container, Row, Col } from 'react-bootstrap';
import './Hero.scss'
import { useNavigate } from 'react-router';
const Hero = () => {

    const navigate = useNavigate()

    return (
        <div className='hero m-3'>
            <Container className="text-center">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>VictorySquare</h1>
                <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                    Master the board — challenge players worldwide or take on a powerful engine.
                </p>
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">
                        <Button variant="warning" size="lg" className="mx-3" onClick={()=>{
                            navigate("/sendinvite")
                        }}>
                            Play against Humans
                        </Button>
                        <Button variant="light" size="lg" className="mx-3" disabled={true}>
                            Play against Engine
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Hero;

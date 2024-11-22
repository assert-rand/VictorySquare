import { Button, Container, Row, Col } from 'react-bootstrap';
import './Hero.scss'
const Hero = () => {
    return (
        <div className='hero m-3'>
            <Container className="text-center">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>VictorySquare</h1>
                <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                    Master the board — challenge players worldwide or take on a powerful engine.
                </p>
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">
                        <Button variant="warning" size="lg" className="mx-3">
                            Play against Humans
                        </Button>
                        <Button variant="light" size="lg" className="mx-3">
                            Play against Engine
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Hero;

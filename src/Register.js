import {Button, Container, Form} from "react-bootstrap";
import LogoEdilclima from "./imgs/logo_edilclima.png";
import {Link} from "react-router-dom";
import LogoPoli from "./imgs/logo_polito.png";
import {useState} from "react";
import firebase from "firebase";


export function Register() {

    const [email, setEmail] = useState('')
    const [psw, setPsw] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    return (
        <div className="div-login">
            <Container>
                <div className="mb-5 pb-5 d-flex justify-content-center align-items-center">
                    <img
                        src={LogoEdilclima}
                        alt="Logo Edilclima"
                        height={100}
                        className="mx-5"
                    />
                    <img
                        src={LogoPoli}
                        alt="Logo Poli"
                        height={80}
                        className="mx-5"
                    />
                </div>
                <div className="box-login">
                    <h2 className="fw-bold text-center mb-2">Registrati</h2>
                    <Form.Group className="mb-2">
                        <Form.Label className="small m-1">Email *</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="nome@mail.com"
                            className="rounded10"
                            autoFocus
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyPress={e => pressButtonRegister(e)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="small m-1">Password *</Form.Label>
                        <Form.Control
                            type="password"
                            className="rounded10"
                            value={psw}
                            onChange={e => setPsw(e.target.value)}
                            onKeyPress={e => pressButtonRegister(e)}
                        />
                    </Form.Group>
                    <Button
                        variant="success"
                        className="rounded10 w-100"
                        disabled={email==='' || psw==='' || loading}
                        id="button-register"
                        onClick={() => {
                            register()
                        }}
                    >
                        Registrati
                    </Button>
                    <div className="text-center mt-2 small">
                        Sei già registrato? <Link to="/">Login</Link>
                    </div>
                    {
                        result ?
                            <p className="fw-bold text-danger mt-4 text-center">{result}</p>
                            :
                            null
                    }
                </div>
            </Container>
        </div>
    )

    function register() {
        setLoading(true)
        firebase.auth().signInWithEmailAndPassword(email, psw)
            .then(() => {
                window.location.href = '/dashboard'
                setLoading(false)
            })
            .catch(() => {
                setResult('Credenziali non valide. Riprova.')
                setLoading(false)
            })
    }

    function pressButtonRegister(event) {
        if(event.key==='Enter') {
            document.getElementById('button-register').click()
        }
    }
}

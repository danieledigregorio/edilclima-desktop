import {useState} from "react";
import {Button, Container, Form} from 'react-bootstrap'
import firebase from "firebase";
import LogoEdilclima from './imgs/logo_edilclima.png'
import LogoPoli from './imgs/logo_polito.png'
import {Link} from "react-router-dom";
import moment from "moment";
import {FcGoogle} from "react-icons/fc";


export function Login() {

    const [email, setEmail] = useState('')
    const [psw, setPsw] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    const providerFacebook = new firebase.auth.FacebookAuthProvider();

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
                    <h2 className="fw-bold text-center mb-2">Accedi</h2>
                    <div>
                        <Button
                            variant="outline-light"
                            className="button-login-provider my-3 py-2 d-flex justify-content-center align-items-center"
                            disabled={loading}
                            onClick={() => signinGoogle()}
                            style={{fontFamily:'Poppins', fontWeight:'400'}}
                        >
                            <FcGoogle
                                size="1.5em"
                            />&nbsp;&nbsp;&nbsp;Accedi con Google
                        </Button>
                        <Button
                            variant="outline-light"
                            className="button-login-provider my-3 py-2 d-flex justify-content-center align-items-center"
                            disabled={loading}
                            onClick={() => signinFacebook()}
                            style={{fontFamily:'Poppins', fontWeight:'400'}}
                        >
                            <img src="https://img.icons8.com/color/48/null/facebook-new.png" alt="Logo FB" style={{height:'1.6em'}}/>&nbsp;&nbsp;&nbsp;Accedi con Facebook
                        </Button>
                    </div>
                    <Form.Group className="mb-2">
                        <Form.Label className="small m-1">Email *</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="nome@mail.com"
                            className="rounded10"
                            autoFocus
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyPress={e => pressButtonLogin(e)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="small m-1">Password *</Form.Label>
                        <Form.Control
                            type="password"
                            className="rounded10"
                            value={psw}
                            onChange={e => setPsw(e.target.value)}
                            onKeyPress={e => pressButtonLogin(e)}
                        />
                    </Form.Group>
                    <Button
                        variant="success"
                        className="rounded10 w-100"
                        disabled={email==='' || psw==='' || loading}
                        id="button-login-accedi"
                        onClick={() => {
                            login()
                        }}
                    >
                        Accedi
                    </Button>
                    <div className="text-center mt-2 small">
                        Non sei ancora registrato? <Link to="/register">Registrati</Link>
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

    function login() {
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

    function pressButtonLogin(event) {
        if(event.key==='Enter') {
            document.getElementById('button-login-accedi').click()
        }
    }

    function signinGoogle() {
        setLoading(true)
        firebase.auth().signInWithPopup(providerGoogle)
            .then(() => {
                window.location.href = '/dashboard'
            }).catch((err) => {setResult(err.message)})
    }

    function signinFacebook() {
        setLoading(true)
        firebase.auth().signInWithPopup(providerFacebook)
            .then(() => {
                window.location.href = '/dashboard'
            }).catch((err) => {setResult(err.message)})
    }
}

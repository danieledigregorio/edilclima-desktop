import './sidebar.css'
import {Link} from "react-router-dom";
import firebase from "firebase";
import {Button, Modal} from "react-bootstrap";
import {FaArrowRight} from "react-icons/fa";
import {useContext, useState} from "react";
import LogoEdilclima from '../imgs/logo_edilclima.png'
import {AuthContext} from "../Auth";


export function Sidebar() {

    const [modallogout, setModallogout] = useState(false)
    const {currentUser} = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div className="w-100 h-100 d-flex flex-column justify-content-between align-items-center">
                <img
                    src={LogoEdilclima}
                    alt="Logo Edilclima"
                    height={80}
                />
                <div className="w-100">
                    {itemSidebar('Dashboard', '/dashboard')}
                    {itemSidebar('Partite', '/partite')}
                    <div onClick={() => setModallogout(true)}>
                        <Link to={""} className="w-100 d-flex justify-content-center">
                            <div className="item-sidebar">
                                <div>
                                    <h4>Logout</h4>
                                </div>
                                <div>
                                    <h5><FaArrowRight /></h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="text-center">
                    <p className="opacity-25 small fw-light">{currentUser.email}</p>
                </div>
            </div>
            <Modal show={modallogout} onHide={() => setModallogout(false)}
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
            >
                <Modal.Body>
                    <div className="text-center p-3 text-dark">
                        <h2 className="mb-4">Vuoi effettuare il <span className="fw-bold">logout</span>?</h2>
                        <div className="d-flex justify-content-evenly align-items-center">
                            <div>
                                <Button variant="secondary" className="rounded10" onClick={() => setModallogout(false)}>
                                    Annulla
                                </Button>
                            </div>
                            <div>
                                <Button onClick={() => logout()} variant="success" className="rounded10">
                                    Confermo
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )

    function logout() {
        firebase.auth().signOut().then(() => {
            window.location.href = '/'
        })
    }

    function itemSidebar(label, link) {
        return (
            <Link to={link} className="w-100 d-flex justify-content-center">
                <div className="item-sidebar">
                    <div>
                        <h4>{label}</h4>
                    </div>
                    <div>
                        <h5><FaArrowRight /></h5>
                    </div>
                </div>
            </Link>
        )
    }
}

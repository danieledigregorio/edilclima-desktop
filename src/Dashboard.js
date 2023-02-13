import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./Auth";
import firebase from "firebase";
import {Button, Col, Container, Row} from "react-bootstrap";
import {customAlphabet} from "nanoid";
import moment from 'moment'
import {FaChevronRight, FaTimes} from "react-icons/fa";
import {Link} from "react-router-dom";
import {Sidebar} from "./Sidebar/Sidebar";


export function Dashboard() {

    const {currentUser} = useContext(AuthContext)
    const [games, setGames] = useState()
    useEffect(() => {
        firebase.database().ref().on('value', (snapshot) => {
            setGames(snapshot.val())
        })
    }, [])

    const nanoid = customAlphabet('1234567890', 4)
    const gameId = nanoid()

    return (
        <div>
            <Sidebar />
            <Container className="div-dashboard margin-sidebar">
                <div className="w-100">
                    <div className="mb-5">
                        <h2 className="fw-bold">Edilclima</h2>
                        <h5>Il gioco per un mondo più ecologico!</h5>
                    </div>
                    <div className="mb-5">
                        {
                            games ?
                                Object.keys(games).map(a => {
                                    if(games[a].docente===currentUser.uid)
                                        return (
                                            <Link to={"/game/" + games[a].id} key={games[a].id}>
                                                <div className="card-game fw-bold w-100">
                                                    <Row>
                                                        <Col md={3} className="d-flex justify-content-center align-items-center">
                                                            <div>
                                                                <p>Data</p>
                                                                <h5>{moment(games[a].date, 'YYYY-MM-DD H:mm').format('DD/MM/YYYY H:mm')}</h5>
                                                            </div>
                                                        </Col>
                                                        <Col md={6} className="d-flex justify-content-center align-items-center">
                                                            <div>
                                                                <p>ID partita</p>
                                                                <h5 className="fw-bold">{games[a].id}</h5>
                                                            </div>
                                                        </Col>
                                                        <Col md={3} className="d-flex justify-content-end align-items-center">
                                                            <FaChevronRight size="2em"/>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Link>
                                        )
                                })
                                :
                                <p>Nessuna partita</p>
                        }
                    </div>
                    <div>
                        <Button
                            variant="danger"
                            className="rounded10"
                            onClick={async () => {
                                await firebase.database().ref(gameId).set({
                                    id: gameId,
                                    docente: currentUser.uid,
                                    status: 'created',
                                    date: moment().format('YYYY-MM-DD H:mm')
                                })
                            }}
                        >
                            Nuova partita
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    )
}

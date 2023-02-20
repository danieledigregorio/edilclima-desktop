import {Sidebar} from "../Sidebar/Sidebar";
import {Badge, Button, Col, Container, Row} from "react-bootstrap";
import {FaChevronRight} from "react-icons/fa";
import {Link} from "react-router-dom";
import firebase from "firebase";
import moment from "moment";
import {customAlphabet} from "nanoid";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../Auth";


export function Partite() {

    const {currentUser} = useContext(AuthContext)
    const nanoid = customAlphabet('1234567890', 4)
    const gameId = nanoid()

    const [games, setGames] = useState()
    useEffect(() => {
        firebase.database().ref().on('value', (snapshot) => {
            setGames(snapshot.val())
        })
    }, [])

    let gamesrunning = []
    let gamesfinished = []

    if(games) {
        Object.keys(games).map(a => {
            if (games[a].docente === currentUser.uid && games[a].status!=='finished') {
                gamesrunning.push(games[a])
            } else if(games[a].docente === currentUser.uid) {
                gamesfinished.push(games[a])
            }
        })
    }

    return (
        <div>
            <Sidebar />
            <div className="margin-sidebar">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h1 className="fw-bold mb-2">Elenco partite</h1>
                            <p>Lo storico di tutte le partite effettuate.</p>
                        </div>
                        <div>
                            <Button
                                variant="success"
                                className="rounded10"
                                onClick={() => createNewGame()}
                            >
                                Nuova partita
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="mb-5">
                            <p className="small opacity-50 mb-3">IN CORSO &nbsp;&nbsp;-&nbsp;&nbsp; {gamesrunning.length}</p>
                            {
                                gamesrunning.map(a => cardGame(a))
                            }
                        </div>
                        <div>
                            <p className="small opacity-50 mb-3">CONCLUSE &nbsp;&nbsp;-&nbsp;&nbsp; {gamesfinished.length}</p>
                            {
                                gamesfinished.map(a => cardGame(a))
                            }
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )

    function cardGame(data) {
        return (
            <Link to={"/game/" + data.id}>
                <Row className="card-game">
                    <Col md="1" className="text-center d-flex justify-content-center align-items-center">
                        <div>
                            <p className="small">ID</p>
                            <h4 className="fw-bold">
                                {data.id}
                            </h4>
                        </div>
                    </Col>
                    <Col md="auto" className="mx-5 text-center d-flex justify-content-center align-items-center">
                        <div>
                            <p className="small">Stato</p>
                            <Badge className="bg-success">
                                {data.status.toUpperCase()}
                            </Badge>
                        </div>
                    </Col>
                    <Col md="auto" className="text-center d-flex justify-content-center align-items-center">
                        <div>
                            <p className="m-0 small">Data creazione</p>
                            <p className="fw-bold">
                                {moment(data.date).format('DD/MM/YYYY')}
                            </p>
                        </div>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center">
                        <div>
                            <FaChevronRight
                                size="2em"
                            />
                        </div>
                    </Col>
                </Row>
            </Link>
        )
    }

    async function createNewGame() {
        await firebase.database().ref(gameId).set({
            id: gameId,
            docente: currentUser.uid,
            status: 'created',
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            activities: [],
            arduino: "",
        })
    }
}

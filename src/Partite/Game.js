import {Link, useLocation} from "react-router-dom";
import {Badge, Button, Col, Container, Form, Row, Offcanvas, CloseButton} from "react-bootstrap";
import {useEffect, useState} from "react";
import firebase from "firebase";
import moment from "moment";
import LogoEdilclima from "../imgs/logo_edilclima.png"
import imgPalazzo1 from "../imgs/palazzo_g1.png"
import imgPalazzo2 from "../imgs/palazzo_g2.png"
import imgPalazzo3 from "../imgs/palazzo_g3.png"
import imgPalazzo4 from "../imgs/palazzo_g4.png"
import imgClasseEnergeticaA from "../imgs/a.png"
import imgClasseEnergeticaB from "../imgs/b.png"
import imgClasseEnergeticaC from "../imgs/c.png"
import imgClasseEnergeticaD from "../imgs/d.png"
import imgClasseEnergeticaE from "../imgs/e.png"
import imgClasseEnergeticaF from "../imgs/f.png"
import imgEuro from "../imgs/icon_euro.png"
import imgMeter from "../imgs/img_meter.png"
import imgfirst from "../imgs/first.png"
import imgsecond from "../imgs/second.png"
import imgthird from "../imgs/third.png"
import {activities, getRandomImprevisto, imprevisti, isRealImprevisto} from "../utils";
import imgTutorial from "../imgs/tutorial.png"


export function Game() {

    const [scoresGroup, setScoresGroups] = useState([
        {
            idGroup: "1",
            co2: 0,
            soldi: 10000,
            classeenergetica: "f"
        },
        {
            idGroup: "2",
            co2: 0,
            soldi: 10000,
            classeenergetica: "f"
        },
        {
            idGroup: "3",
            co2: 0,
            soldi: 10000,
            classeenergetica: "f"
        },
        {
            idGroup: "4",
            co2: 0,
            soldi: 10000,
            classeenergetica: "f"
        }
    ])
    const location = useLocation().pathname.split('/')
    const gameId = location[2]
    const [loading, setLoading] = useState(false)

    const [mac, setMac] = useState('')

    const [game, setGame] = useState()
    useEffect(() => {
        firebase.database().ref('/' + gameId).on('value', (snapshot) => {
            setGame(snapshot.val())
        })
    }, [])
    let users = []
    if(game && game.users) users = Object.values(game.users)


    // CALCOLO TURNI
    const [updating, setUpdating] = useState(true)
    const [updated, setUpdated] = useState(true)
    const [check, setCheck] = useState(0)
    const [checkImprevisto, setCheckImprevisto] = useState(0)
    const [updatingImprevisto, setUpdatingImprevisto] = useState(true)
    const [updatedImprevisto, setUpdatedImprevisto] = useState(true)

    setInterval(() => {
        if(updated && updating && game?.status==='game') {
            setUpdating(false)
        }
        if(updatedImprevisto && updatingImprevisto && game?.status==='game') {
            setUpdatingImprevisto(false)
        }
        setCheck(check+1)
        setCheckImprevisto(checkImprevisto+1)
    }, 5000)


    useEffect(() => {
        if(game?.status==='game' && !updating) {
            ["1","2","3","4"].map(g => {
                let lastdate = "1950-01-01 12:00:00"
                game.turni.filter(a => a.idGroup===g).map(a => {
                    if(moment(a.date,'YYYY-MM-DD HH:mm:ss').isAfter(moment(lastdate,'YYYY-MM-DD HH:mm:ss'))) lastdate = a.date
                })
                if(moment().diff(moment(lastdate, 'YYYY-MM-DD HH:mm:ss'), 'seconds')>=180) {
                    setUpdating(true)
                    // CAMBIA TURNO
                    cambiaTurno(g, moment().format('YYYY-MM-DD HH:mm:ss')).then(() => setUpdated(true))
                }
            })
        }
    }, [check])

    useEffect(() => {
        if(game?.status==='game' && !updatingImprevisto) {
            let lastdate = "1950-01-01 12:00:00"
            if(game?.imprevisti) {
                game.imprevisti.map(a => {
                    if(moment(a.date,'YYYY-MM-DD HH:mm:ss').isAfter(moment(lastdate,'YYYY-MM-DD HH:mm:ss'))) lastdate = a.date
                })
            } else if(game?.gamestartedat) lastdate = game.gamestartedat
            if(moment().diff(moment(lastdate, 'YYYY-MM-DD HH:mm:ss'), 'seconds')>=5*60) {
                setUpdatingImprevisto(true)
                // AGGIUNGI IMPREVISTO
                addImprevisto(moment().format("YYYY-MM-DD HH:mm:ss")).then(() => setUpdatedImprevisto(true))
            }
        }
    }, [checkImprevisto])

    let classifica = []
    if(game?.status==="finished") {
        classifica = game.classifica.sort((a,b) => a.points>b.points ? -1 : 1)
    }

    useEffect(() => {
        if(game) {
            calcStats()
        }
    }, [game])

    const [tutorial, setTutorial] = useState(false)

    return (
        <Container className="div-dashboard">
            <div className="py-5">
                <div className="mb-5 d-flex justify-content-between align-items-center text-start">
                    <div>
                        <h1>Partita <span className="fw-bold">{gameId}</span>
                            {
                                game?.status==='game' ?
                                    <>
                                        <Button
                                            variant="danger"
                                            className="rounded10 mb-2"
                                            style={{marginLeft:'2em'}}
                                            size="sm"
                                            disabled={loading}
                                            onClick={() => {
                                                if(window.confirm("Vuoi terminare la partita " + gameId + "?\nL'azione ?? irreversibile.")) {
                                                    endGame()
                                                }
                                            }}
                                        >
                                            <b>Termina partita</b>
                                        </Button>
                                        <Button
                                            variant="success"
                                            className="rounded10 mb-2"
                                            style={{marginLeft:'2em'}}
                                            size="sm"
                                            onClick={() => {
                                                setTutorial(true)
                                            }}
                                        >
                                            <b>Apri Tutorial</b>
                                        </Button>
                                    </>
                                    :
                                    game?.status==='finished' ?
                                        <span>&nbsp;-&nbsp;<strong>CLASSIFICA</strong></span>
                                        :
                                        game?.status==='created' ?
                                            <Button
                                                variant="success"
                                                className="rounded10 mb-2"
                                                style={{marginLeft:'2em'}}
                                                size="md"
                                                onClick={() => {
                                                    setTutorial(true)
                                                }}
                                            >
                                                <b>Apri Tutorial</b>
                                            </Button>
                                            :
                                            null
                            }
                        </h1>
                    </div>
                    <img
                        src={LogoEdilclima}
                        alt="Logo Edilclima"
                        height={100}
                    />
                </div>
                {
                    game?.status === 'created' ?
                        <div>
                            <div className="mb-5">
                                <h1 className="fw-bold mb-4">Waiting Room</h1>
                                <p>Inserisci il codice nell'app.</p>
                            </div>
                            <div className="mb-5">
                                <p className="mb-3">Utenti connessi: <strong>{users.length}</strong></p>
                                <h5>
                                    {users.map(a => <Badge className="bg-secondary fw-normal mx-2 my-1 rounded10">@ <strong>{a.name}</strong></Badge>)}
                                </h5>
                            </div>
                            <div className="mb-5 d-flex justify-content-center align-items-center">
                                <Form.Group className="w-auto">
                                    <Form.Label className="small">Indirizzo MAC casetta <span className="fw-light opacity-50">(opzionale)</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={mac}
                                        onChange={e => {
                                            const i = e.target.value.trim().toUpperCase()
                                            setMac(i)
                                        }}
                                        placeholder="XX-XX-XX-XX-XX-XX"
                                        className="rounded10 w-auto text-center"
                                    />
                                </Form.Group>
                            </div>
                            <div>
                                <Button
                                    variant="success"
                                    className="rounded10"
                                    onClick={async () => startGame()}
                                    disabled={loading}
                                >
                                    Crea i gruppi e avvia il gioco
                                </Button>
                            </div>
                        </div>
                        :
                        game?.status === 'game' ?
                            <div className="pt-4">
                                <div className="mb-4">
                                    <PianoPalazzo img={imgPalazzo4} props={scoresGroup} idGroup="4" />
                                    <PianoPalazzo img={imgPalazzo3} border props={scoresGroup} idGroup="3" />
                                    <PianoPalazzo img={imgPalazzo2} border props={scoresGroup} idGroup="2" />
                                    <PianoPalazzo img={imgPalazzo1} border props={scoresGroup} idGroup="1" />
                                </div>
                                <div>
                                    <p className="fw-bold fst-italic text-decoration-underline">Non uscire da questa schermata.</p>
                                </div>
                            </div>
                            :
                            game?.status === 'finished' ?
                                <div className="pt-4">
                                    <div className="mb-4">
                                        <PianoPalazzo img={imgPalazzo4} props={scoresGroup} idGroup="4" position={classifica.findIndex(e => e.idGroup==="4")+1} />
                                        <PianoPalazzo img={imgPalazzo3} border props={scoresGroup} idGroup="3" position={classifica.findIndex(e => e.idGroup==="3")+1} />
                                        <PianoPalazzo img={imgPalazzo2} border props={scoresGroup} idGroup="2" position={classifica.findIndex(e => e.idGroup==="2")+1} />
                                        <PianoPalazzo img={imgPalazzo1} border props={scoresGroup} idGroup="1" position={classifica.findIndex(e => e.idGroup==="1")+1} />
                                    </div>
                                    <div className="text-center">
                                        <Link to="/partite">
                                            <Button
                                                variant="success"
                                                className="rounded10 mt-2"
                                                size="sm"
                                            >
                                                Torna alle partite
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                :
                                null
                }
            </div>

            <Offcanvas show={tutorial} onHide={() => setTutorial(false)} placement="end" style={{width:'100vw', padding:'3em', backgroundColor:'#1c1c1c', color:"#fff"}}>
                <Offcanvas.Header>
                    <Offcanvas.Title className="text-center w-100"><h2 className="fw-bold">Tutorial</h2></Offcanvas.Title>
                    <CloseButton variant="white" onClick={() => setTutorial(false)} />
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Row className="h-100">
                        <Col md={5} className="text-start d-flex justify-content-center align-items-center">
                            <div>
                                <h4 className="mb-4">La classe verr?? suddivisa in <b>4 squadre</b>.</h4>
                                <h5 className="mb-4">Sullo schermo scoprirete quale <b>appartamento</b> del palazzo diventer?? la vostra casa e chi saranno <b>i vostri coinquilini</b> tra i vostri compagni.</h5>
                                <h5 className="mb-4">Le squadre giocheranno in contemporanea e ogni coinquilino dovr?? scegliere quale <b>modifica</b> apportare all???appartamento per migliorarne la <b>classe energetica</b>.</h5>
                                <h4 className="mb-4 text-decoration-underline">Attenzione allo scorrere del tempo!</h4>
                                <h5 className="mb-4"><b>Vince</b> la squadra che raggiunge la <b>classe energetica pi?? alta</b>, ma che <b>spende meno soldi</b> e ha una <b>qualit?? di vita migliore</b>.</h5>
                                <h4 className="text-decoration-underline">Attenzione agli imprevisti!</h4>
                            </div>
                        </Col>
                        <Col md={7} className="d-flex justify-content-center align-items-center">
                            <img
                                src={imgTutorial}
                                alt="Img tutorial"
                                style={{width: "40vw"}}
                            />
                        </Col>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>

        </Container>
    )

    function PianoPalazzo({img, border, props, idGroup, position}) {

        const data = props.filter(a => a.idGroup===idGroup)[0]
        let imgClasse
        if(data.classeenergetica==="a") imgClasse = imgClasseEnergeticaA
        else if(data.classeenergetica==="b") imgClasse = imgClasseEnergeticaB
        else if(data.classeenergetica==="c") imgClasse = imgClasseEnergeticaC
        else if(data.classeenergetica==="d") imgClasse = imgClasseEnergeticaD
        else if(data.classeenergetica==="e") imgClasse = imgClasseEnergeticaE
        else imgClasse = imgClasseEnergeticaF

        return (
            <Row className={border ? "border-palazzo" : ""}>
                {
                    position ?
                        <Col md={1} className="d-flex justify-content-center align-items-center">
                            <div>
                                {
                                    position===1 ?
                                        <img
                                            src={imgfirst}
                                            alt="first"
                                            height={75}
                                        />
                                        :
                                        position===2 ?
                                            <img
                                                src={imgsecond}
                                                alt="second"
                                                height={75}
                                            />
                                            :
                                            position===3 ?
                                                <img
                                                    src={imgthird}
                                                    alt="third"
                                                    height={75}
                                                />
                                                :
                                                null
                                }
                            </div>
                        </Col>
                        :
                        null
                }
                <Col md={4} className="d-flex justify-content-center align-items-center">
                    <img
                        src={img}
                        alt="Img Palazzo"
                        style={{width:'100%'}}
                    />
                </Col>
                <Col className="d-flex justify-content-around align-items-center">
                    <Row className="w-100">
                        <Col md={2} className="d-flex justify-content-center align-items-center">
                            <img
                                src={imgClasse}
                                alt={"Img Classe " + data.classeenergetica.toUpperCase()}
                                height={50}
                            />
                        </Col>
                        <Col md={3} className="d-flex justify-content-center align-items-center">
                            <img
                                src={imgMeter}
                                alt="Img Meter"
                                height={50}
                                style={{filter:"invert(1)"}}
                            />
                            <h4>&nbsp;&nbsp;&nbsp;{data.co2} kg</h4>
                        </Col>
                        <Col md={3} className="d-flex justify-content-center align-items-center">
                            <img
                                src={imgEuro}
                                alt="Img Euro"
                                height={50}
                                style={{filter:"invert(1)"}}
                            />
                            <h4>&nbsp;&nbsp;&nbsp;{data.soldi},00</h4>
                        </Col>
                        <Col md={4} className="d-flex justify-content-center align-items-center">
                            <div>
                                {
                                    game.gruppi.filter(g =>
                                        g.idGroup===idGroup
                                    )[0].users.map(u =>
                                        <Badge key={u} className="bg-secondary fw-normal mx-2 my-1 rounded10">@ <strong>{users.filter(a => a.id === u)[0].name}</strong></Badge>
                                    )
                                }
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }

    async function startGame() {
        setLoading(true)

        let utenticopia = users
        let utentigruppi = [[],[],[],[]]
        let count = 0
        while(utenticopia.length>0) {
            const min = 0
            const max = utenticopia.length-1
            const rndindex = Math.floor(Math.random() * (max - min + 1) + min)
            const user = utenticopia[rndindex]
            utentigruppi[count].push(user.id)
            utenticopia = utenticopia.filter(a => a.id !== user.id)
            if(count!==3) count++
            else count=0
        }
        const starttime = moment().format('YYYY-MM-DD HH:mm:ss')
        await firebase.database().ref(gameId).update({
            status: 'game',
            gamestartedat: starttime,
            arduino: "",
            gruppi: [
                {
                    idGroup: "1",
                    users: utentigruppi[0].sort((a,b) => a<b ? -1 : 1),
                },
                {
                    idGroup: "2",
                    users: utentigruppi[1].sort((a,b) => a<b ? -1 : 1),
                },
                {
                    idGroup: "3",
                    users: utentigruppi[2].sort((a,b) => a<b ? -1 : 1),
                },
                {
                    idGroup: "4",
                    users: utentigruppi[3].sort((a,b) => a<b ? -1 : 1),
                },
            ],
            turni: [
                {
                    idGroup: "1",
                    date: starttime,
                },
                {
                    idGroup: "2",
                    date: starttime,
                },
                {
                    idGroup: "3",
                    date: starttime,
                },
                {
                    idGroup: "4",
                    date: starttime,
                },
            ],
        }).then(() => setLoading(false))

        await firebase.database().ref(gameId).child("arduino").set(mac)
            .then(() => {})
    }

    function calcStats() {

        let scores = [];

        ["1", "2", "3", "4"].map(idGroup => {

            let co2 = 0
            let soldi = 10000
            let classeenergetica

            if(game?.activities) {
                Object.values(game.activities).filter(z => z.idGroup === idGroup).map(a => {
                    activities.filter(z => z.id===a.idEdit).map(z => {
                        const dataattivita = z.options.filter(x => x.id===a.idChoice)[0]

                        co2 += dataattivita.co2
                        soldi -= dataattivita.price
                    })
                })
            }
            if(game?.imprevisti) {
                Object.values(game.imprevisti).map(a => {
                    if(isRealImprevisto(a.id)) {
                        const dataimp = imprevisti.filter(z => z.id===a.id)[0]
                        co2 += dataimp.co2
                        soldi -= dataimp.price
                    }
                })
            }

            if (co2 >= 3220) classeenergetica = "a"
            else if (2699 <= co2 && co2 < 3220) classeenergetica = "b"
            else if (2118 <= co2 && co2 < 2699) classeenergetica = "c"
            else if (1567 <= co2 && co2 < 2118) classeenergetica = "d"
            else if (1016 <= co2 && co2 < 1567) classeenergetica = "e"
            else classeenergetica = "f"

            scores.push({
                idGroup: idGroup,
                co2: co2,
                soldi: soldi,
                classeenergetica: classeenergetica
            })
        })

        setScoresGroups(scores)
    }

    async function endGame() {
        setLoading(true)
        await calcClassifica()
        await firebase.database().ref(gameId).update({
            status: 'finished',
        }).then(() => setLoading(false))
    }

    async function calcClassifica() {

        let scores = [];

        ["1", "2", "3", "4"].map(idGroup => {

            let co2 = 0
            let soldi = 10000
            let qualita = 0
            let classeenergetica
            let turni = Object.values(game.activities).filter(a => a.idGroup === idGroup).length

            activities.map(a => {
                const elencoattivitagruppo = Object.values(game.activities).filter(z => z.idEdit === a.id && z.idGroup === idGroup)
                if (elencoattivitagruppo.length !== 0) {
                    let lastedit = {
                        idEdit: null,
                        idChoice: null,
                        idGroup: idGroup,
                        date: "0"
                    }
                    elencoattivitagruppo.map(e => {
                        const attivita = a.options.filter(z => z.id === e.idChoice)[0]
                        co2 += attivita.co2
                        soldi -= attivita.price
                        if (Number(e.date) > Number(lastedit.date)) lastedit = e
                    })
                    if (lastedit.idChoice !== null) {
                        qualita += a.options.filter(z => z.id === lastedit.idChoice)[0].quality
                    }
                } else if (a.options.filter(z => z.default).length !== 0) {
                    const defaultactivity = a.options.filter(z => z.default)[0]
                    co2 += defaultactivity.co2
                    soldi -= defaultactivity.price
                    qualita += defaultactivity.quality
                }
            })
            if (co2 >= 3220) classeenergetica = "a"
            else if (2699 <= co2 && co2 < 3220) classeenergetica = "b"
            else if (2118 <= co2 && co2 < 2699) classeenergetica = "c"
            else if (1567 <= co2 && co2 < 2118) classeenergetica = "d"
            else if (1016 <= co2 && co2 < 1567) classeenergetica = "e"
            else classeenergetica = "f"


            scores.push({
                idGroup: idGroup,
                points: turni !== 0 ? (100*co2 + soldi/10 + 10*qualita) / turni : 0,
                co2: co2,
                soldi: soldi,
                qualita: qualita,
                classeenergetica: classeenergetica
            })
        })



        await firebase.database().ref(gameId).child("classifica").set(scores.sort((a,b) => a.points>b.points ? -1 : 1))
    }

    async function cambiaTurno(idGroup, newDate) {

        await firebase.database().ref(gameId).child("turni").child(game.turni.length.toString()).set({
            idGroup: idGroup,
            date: newDate,
        })
    }

    async function addImprevisto(newDate) {
        await  firebase.database().ref(gameId).child("imprevisti").child(game?.imprevisti ? game.imprevisti.length.toString() : "0").set({
            date: newDate,
            id: getRandomImprevisto(),
        })
    }
}

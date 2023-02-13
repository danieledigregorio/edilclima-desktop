import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Login} from "./Login";
import {Dashboard} from "./Dashboard";
import {Game} from "./Partite/Game";
import {Register} from "./Register";
import {useContext} from "react";
import {AuthContext} from "./Auth";
import {Partite} from "./Partite/Partite";


export function Router() {

    const {currentUser} = useContext(AuthContext)

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    {
                        currentUser ?
                            <>
                                <Route exact path="/dashboard" element={<Dashboard />} />
                                <Route exact path="/partite" element={<Partite />} />
                                <Route path="/game/:id" element={<Game />} />
                            </>
                            :
                            null
                    }
                </Routes>
            </BrowserRouter>
        </>
    )
}

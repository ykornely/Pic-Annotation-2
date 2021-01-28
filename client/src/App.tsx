import './App.css'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import Pictures from './pages/Pictures'
import Signup from './pages/Signup'
import Editor from './pages/Editor'

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/login" />
                </Route>
                <Route path="/login" exact>
                    <Login />
                </Route>
                <Route path="/signup" exact>
                    <Signup />
                </Route>
                <Route path="/pictures" exact>
                    <Pictures />
                </Route>
                <Route path="/pictures/:pictureId">
                    <Editor />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App

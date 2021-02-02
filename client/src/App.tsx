import './App.css'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import Pictures from './pages/Pictures'
import Signup from './pages/Signup'
import Editor from './pages/Editor'
import { FC } from 'react'

const PrivateRoute: FC<any> = ({ children, ...rest }) => (
    <Route {...rest} >
        {localStorage.getItem('token') !== null ? children : <Redirect to="/login" />}
    </Route>
)

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
                <PrivateRoute path="/pictures" exact>
                    <Pictures />
                </PrivateRoute>
                <PrivateRoute path="/pictures/:pictureId">
                    <Editor />
                </PrivateRoute>
            </Switch>
        </BrowserRouter>
    )
}

export default App

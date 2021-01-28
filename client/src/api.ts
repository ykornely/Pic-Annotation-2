import Login from './pages/Login'

interface ILoginCreditentals {
    email: string
    password: string
}

interface ISignUpCreditentals extends ILoginCreditentals {
    fullName: string
}

const login = async (creditentals: ILoginCreditentals) => {
    // creditentials contains the login information we want to log in with. If it checks out, the server returns a token.
    const response = await fetch('http://localhost:3000/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creditentals),
    })
    return await response.json()
}

const signup = async (creditentals: ISignUpCreditentals) => {
    // creditentials contains the login information we want to log in with. If it checks out, the server returns a token.
    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creditentals),
    })
    return await response.json()
}

const getPictures = async () => {
    const response = await fetch('http://localhost:3000/api/pictures', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return await response.json()
}

const getDrawings = async (pictureId: string) => {
    const response = await fetch(`http://localhost:3000/api/pictures/${pictureId}/drawings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return await response.json()
}

const patchDrawing = async (pictureId: string, drawingId: string, content: string) => {
    const response = await fetch(`http://localhost:3000/api/pictures/${pictureId}/drawings/${drawingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ content }), // content: content
    })
}

const uploadPicture = async (file: File) => {
    const formData = new FormData()
    formData.append("picture", file)
    const response = await fetch(`http://localhost:3000/api/pictures`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData, // content: content
    })
}

export { login, signup, getPictures, getDrawings, patchDrawing, uploadPicture }

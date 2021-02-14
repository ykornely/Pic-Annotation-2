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

    if (!response.ok) {
        const body = await response.json()
        throw new Error(body)
    }

    return await response.json()
}

const signup = async (creditentals: ISignUpCreditentals) => {
    // creditentials contains the login information we want to log in with. If it checks out, the server returns a token.

    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creditentals),
    })

    if (!response.ok) {
        const body = await response.json()
        throw new Error(body)
    }

    return await response.json()
}

const getPictures = async () => {
    const response = await fetch('http://localhost:3000/api/pictures', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return await response.json()
}

const uploadPicture = async (file: File) => {
    const formData = new FormData()
    formData.append('picture', file)
    return await fetch(`http://localhost:3000/api/pictures`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData, // content: content
    })
}

const patchPicture = async (pictureId: string, description: string) => {
    return await fetch(`http://localhost:3000/api/pictures/${pictureId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ description }), // description: description
    })
}

const deletePicture = async (pictureId: string) => {
    return await fetch(`http://localhost:3000/api/pictures/${pictureId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
}

const getDrawings = async (pictureId: string) => {
    const response = await fetch(`http://localhost:3000/api/pictures/${pictureId}/drawings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return await response.json()
}

const patchDrawing = async (pictureId: string, drawingId: string, content: string, description: string) => {
    return await fetch(`http://localhost:3000/api/pictures/${pictureId}/drawings/${drawingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ content, description }), // content: content, description: description
    })
}

const createDrawing = async (pictureId: string) => {
    const response = await fetch(`http://localhost:3000/api/pictures/${pictureId}/drawings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return await response.json()
}

const deleteDrawing = async (pictureId: string, drawingId: string) => {
    return await fetch(`http://localhost:3000/api/pictures/${pictureId}/drawings/${drawingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
}

export { login, signup, getPictures, patchPicture, getDrawings, patchDrawing, uploadPicture, createDrawing, deleteDrawing, deletePicture }

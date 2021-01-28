import { useState, useEffect } from 'react'
import { getPictures, uploadPicture } from '../api'
import { Link } from 'react-router-dom'

const Pictures = () => {
    const [pictures, setPictures] = useState([])
    const [selectedFile, setSelectedFile] = useState<any>(null)
    useEffect(() => {
        const asyncGetPictures = async () => {
            const pictures = await getPictures()
            setPictures(pictures)
        }
        asyncGetPictures()
    }, []) // like ngOnInit, it only runs the first time you render it.

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        await uploadPicture(selectedFile)
    }

    return (
        // all picture in pictures are changed with map to an img tag.
        <div>
            <div className="pictures">
                {pictures.map((picture: any) => {
                    return (
                        <Link onClick={() => localStorage.setItem("aspectRatio", picture.aspectRatio)} className="picture" key={picture._id} to={`/pictures/${picture._id}`}>
                            <img src={`http://localhost:3000/api/pictures/${picture._id}`} />
                            <p>{picture.description}</p>
                        </Link>
                    )
                })}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files![0])}/>
                <input type="submit" value="Upload"/>
            </form>
        </div>
    )
}

export default Pictures

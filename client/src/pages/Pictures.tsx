import { useState, useEffect, FC } from 'react' // useCallback is usually used when you have a fnuction that takes a lot of time to finish and the useCallback caches it. It only runs that function when the dependencies change. Empty array as last parameter (dependency) causes it to only runs once when mounted.
import { getPictures, uploadPicture, patchPicture } from '../api'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'
import useDebounce from '../hooks/useDebounced'

const Picture: FC<{ picture: any }> = (props) => {
    const { picture } = props
    const [pictureDesc, setPictureDesc] = useState(picture.description)
    const debouncedDesc = useDebounce(pictureDesc, 600) // pictureDesc changes for every key pressed. debouncedDesc's value changes only if you stop typing for 0.6 seconds.

    useEffect(() => {
        const asyncPatchPictures = async () => {
            await patchPicture(picture._id, pictureDesc)
        }
        asyncPatchPictures()
    }, [debouncedDesc]) // changes when debouncedDesc changes

    const handleOnChange = (e: any) => {
        setPictureDesc(e.target.value)
    }

    return (
        <>
            <Link onClick={() => localStorage.setItem('aspectRatio', picture.aspectRatio)} className="picture" to={`/pictures/${picture._id}`}>
                <img src={`http://localhost:3000/api/pictures/${picture._id}?token=${localStorage.getItem("token")}`} />
            </Link>
            <div className="description">
                <textarea value={pictureDesc} onChange={handleOnChange} />
            </div>
        </>
    )
}

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
                    return <Picture picture={picture} key={picture._id}></Picture>
                })}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files![0])} />
                <input type="submit" value="Upload" />
            </form>
            <Link to={`/login`}>
                <h2>Logout</h2>
            </Link>
        </div>
    )
}

export default Pictures

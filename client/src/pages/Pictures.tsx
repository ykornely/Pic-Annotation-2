import { useState, useEffect, FC, useMemo } from 'react' // useCallback is usually used when you have a fnuction that takes a lot of time to finish and the useCallback caches it. It only runs that function when the dependencies change. Empty array as last parameter (dependency) causes it to only runs once when mounted.
import { getPictures, uploadPicture, patchPicture, deletePicture } from '../api'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'
import useDebounce from '../hooks/useDebounced'

const Picture: FC<{ picture: any; onPictureChange: any }> = (props) => {
    const { picture, onPictureChange } = props
    const [pictureDesc, setPictureDesc] = useState(picture.description)
    const debouncedDesc = useDebounce(pictureDesc, 0) // pictureDesc changes for every key pressed. debouncedDesc's value changes only if you stop typing for 0.6 seconds.

    useEffect(() => {
        const asyncPatchPictures = async () => {
            await patchPicture(picture._id, pictureDesc)
        }
        asyncPatchPictures()
    }, [debouncedDesc]) // changes when debouncedDesc changes

    useEffect(() => {
        onPictureChange(picture)
    }, [pictureDesc])

    const handleOnChange = (e: any) => {
        setPictureDesc(e.target.value)
    }

    return (
        <>
            <Link onClick={() => localStorage.setItem('aspectRatio', picture.aspectRatio)} className="picture" to={`/pictures/${picture._id}`}>
                <img src={`http://localhost:3000/api/pictures/${picture._id}?token=${localStorage.getItem('token')}`} />
            </Link>
            <div className="description">
                <textarea value={pictureDesc} onChange={handleOnChange} />
            </div>
            <div>
                <button
                    onClick={async () => {
                        await deletePicture(picture._id)
                        window.location.reload()
                    }}
                >
                    Delete
                </button>
            </div>
        </>
    )
}

const Pictures = () => {
    const [pictures, setPictures] = useState([])
    const [selectedFile, setSelectedFile] = useState<any>(null)
    const [search, setSearch] = useState('')
    useEffect(() => {
        const asyncGetPictures = async () => {
            const pictures = await getPictures()
            setPictures(pictures)
        }
        asyncGetPictures()
    }, []) // like ngOnInit, it only runs the first time you render it.

    const filteredPictures = useMemo(() => {
        if (search.length === 0) {
            return pictures
        } else {
            return pictures.filter((picture: { description: string }) => picture.description.match(search))
        }
    }, [search, pictures])

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        await uploadPicture(selectedFile)
    }

    const handlePictureChange = (updatedPicture: any) => {
        const updatedPictures = pictures.map((picture: any) => (picture._id === updatedPicture._id ? updatedPicture : picture))
        setPictures(updatedPictures as any)
    }

    return (
        // all picture in pictures are changed with map to an img tag.
        <div>
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} /> {/* two way binding (value and onChange)*/}
            <div className="pictures">
                {filteredPictures.map((picture: any) => {
                    return <Picture picture={picture} onPictureChange={handlePictureChange} key={picture._id}></Picture>
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

import CanvasDraw from 'react-canvas-draw'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { getDrawings, patchDrawing, createDrawing, deleteDrawing } from '../api'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { render } from '@testing-library/react'

const Editor = () => {
    const params = useParams<any>()
    const canvas = useRef<any>()
    const [drawings, setDrawings] = useState<any[]>([])
    const [drawingId, setDrawingId] = useState('')
    const [drawingContent, setDrawingContent] = useState('')
    const [drawingDesc, setDrawingDesc] = useState('')
    const [canvasHeight, setCanvasHeight] = useState(100)

    useEffect(() => {
        const asyncGetDrawings = async () => {
            const drawings = await getDrawings(params.pictureId)
            setDrawings(drawings)
            if (drawings.length !== 0) {
                setDrawingId(drawings[0]._id)
                setDrawingContent(drawings[0].content)
                setDrawingDesc(drawings[0].description)
            }
        }
        asyncGetDrawings()
        // return () => {console.log("Editor unmounted")} // if you press "back", this arrow function will be called (umount)
    }, []) // runs when mounted

    // if (drawings.length === 0) return null

    const handleNewDrawing = async () => {
        const newDrawing = await createDrawing(params.pictureId)
        setDrawings([...drawings, newDrawing]) // spread operator
    }

    return (
        <div className="editor">
            <div className="drawings">
                {drawings.map((drawing: any, index) => {
                    return (
                        <button
                            onClick={() => {
                                setDrawingId(drawing._id)
                                setDrawingContent(drawing.content)
                                setDrawingDesc(drawing.description)
                                canvas.current.loadSaveData(drawing.content, true) // bug of the canvasdraw library: doesn't refresh automatically on change, we have to refresh it manually
                            }}
                            className="drawingListButton"
                            key={index}
                        >
                            {'Drawing #' + index}
                        </button>
                    )
                })}
            </div>
            <div>
                <Link className="logoutAndBack" to={`/Pictures`}>
                    <h2>Back</h2>
                </Link>
                <div id="newDrawing">
                    <button onClick={handleNewDrawing} id="newDrawingButton" className="drawingListButton" style={{ backgroundColor: 'ffffff' }}>New Drawing</button>
                </div>
            </div>
            <div className="toolbar">
                {drawingId !== '' && (
                    <>
                        <button className="tool" title="Brush">
                            <img src="/icons/brush.png" className="toolIcon" alt="Brush" />
                        </button>
                        {/*<button className="tool" style={{backgroundColor: "black"}}>circle</button>*/}
                        <button
                            className="tool" title="Undo"
                            onClick={() => {
                                canvas.current.undo()
                            }}
                        >
                            <img src="/icons/undo.png" className="toolIcon" alt="Undo" />
                        </button>
                        <button
                            className="tool" title="Clear"
                            onClick={() => {
                                canvas.current.clear()
                            }}
                        >
                            <img src="/icons/clear.png" className="toolIcon" alt="Clear" />
                        </button>
                        <button
                            className="tool" title="Save"
                            onClick={async () => {
                                const response = await patchDrawing(params.pictureId, drawingId, canvas.current.getSaveData(), drawingDesc)
                                const updatedDrawing = await response.json()
                                const updatedDrawings = drawings.map((drawing) => (drawing._id === updatedDrawing._id ? updatedDrawing : drawing))
                                setDrawings(updatedDrawings)
                            }}
                        >
                            <img src="/icons/save.png" className="toolIcon" alt="Save" />
                        </button>
                        <button
                            className="tool"  title="Delete"
                            onClick={async () => {
                                await deleteDrawing(params.pictureId, drawingId)
                                window.location.reload()
                                // setDrawings(drawings.filter((drawing) => drawing._id !== drawingId))
                            }}
                        >
                            <img src="/icons/delete.png" className="toolIcon" alt="Delete" />
                        </button>
                    </>
                )}
            </div>
            <div>
                <div className="canvas">
                    <CanvasDraw
                        ref={(ref) => {
                            const aspectRatio = parseFloat(localStorage.getItem('aspectRatio')!)
                            canvas.current = ref
                            if (!!canvas.current) {
                                setCanvasHeight(canvas.current.canvasContainer.offsetWidth * aspectRatio)
                            }
                        }}
                        saveData={drawingContent}
                        immediateLoading
                        canvasWidth="100%"
                        canvasHeight={canvasHeight}
                        brushRadius={1}
                        hideGrid
                        lazyRadius={4}
                        brushColor="red"
                        imgSrc={`http://localhost:3000/api/pictures/${params.pictureId}?token=${localStorage.getItem('token')}`}
                    />
                </div>
                <textarea className="drawingDescription" placeholder="description" value={drawingDesc} onChange={(e) => setDrawingDesc(e.target.value)} />
            </div>
        </div>
    )
}
export default Editor

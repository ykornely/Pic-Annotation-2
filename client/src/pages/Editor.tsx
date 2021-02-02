import CanvasDraw from 'react-canvas-draw'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { getDrawings, patchDrawing, createDrawing } from '../api'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

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
            console.log('set drawing')
            setDrawings(drawings)
            console.log('set drawingId')
            if (drawings.length !== 0) {
                setDrawingId(drawings[0]._id)
                setDrawingContent(drawings[0].content)
                setDrawingDesc(drawings[0].description)
            }
        }
        asyncGetDrawings()
        // return () => {console.log("Editor unmounted")} // if you press "back", this arrow function will be called (umount)
    }, []) // runs when mounted

    if (drawings.length === 0) return null

    const handleNewDrawing = async () => {
        await createDrawing(params.pictureId)
    }

    return (
        <div className="editor">
            <div className="drawings">
                {drawings.map((drawing: any) => {
                    return (
                        <button
                            onClick={() => {
                                setDrawingId(drawing._id)
                                setDrawingContent(drawing.content)
                                setDrawingDesc(drawing.description)
                                canvas.current.loadSaveData(drawing.content, true) // bug of the canvasdraw library: doesn't refresh automatically on change, we have to refresh it manually
                            }}
                            className="drawing"
                            key={drawing._id}
                        >
                            drawing
                        </button>
                    )
                })}
            </div>
            <div className="newDrawing"><button onClick={handleNewDrawing}>New Drawing</button></div>
            <div className="toolbar">
                {drawingId !== '' && (
                    <>
                        <button className="tool">brush</button>
                        <button className="tool">circle</button>
                        <button
                            className="tool"
                            onClick={() => {
                                canvas.current.undo()
                            }}
                        >
                            undo
                        </button>
                        <button
                            className="tool"
                            onClick={() => {
                                canvas.current.clear()
                            }}
                        >
                            clear
                        </button>
                        <button
                            className="tool"
                            onClick={async () => {
                                const response = await patchDrawing(params.pictureId, drawingId, canvas.current.getSaveData(), drawingDesc)
                                const updatedDrawing = await response.json();
                                const updatedDrawings = drawings.map((drawing) => (drawing._id === updatedDrawing._id ? updatedDrawing : drawing))
                                setDrawings(updatedDrawings)
                            }}
                        >
                            save
                        </button>
                    </>
                )}
            </div>

            <div className="canvas">
                <CanvasDraw
                    ref={(ref) => {
                        const aspectRatio = parseFloat(localStorage.getItem('aspectRatio')!)
                        canvas.current = ref
                        if (!!canvas.current) {
                            console.log('set canvas')
                            setCanvasHeight(canvas.current.canvasContainer.offsetWidth * aspectRatio)
                            console.log(canvas.current.canvasContainer.offsetWidth * aspectRatio)
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
                    imgSrc={`http://localhost:3000/api/pictures/${params.pictureId}`}
                />
            </div>
            <div className="description">
                <textarea value={drawingDesc} onChange={(e) => setDrawingDesc(e.target.value)} />
            </div>
            <Link to={`/Pictures`}>
                <h2>Back</h2>
            </Link>
        </div>
    )
}
export default Editor

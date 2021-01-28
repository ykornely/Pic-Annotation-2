import CanvasDraw from 'react-canvas-draw'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { getDrawings, patchDrawing } from '../api'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Editor = () => {
    const params = useParams<any>()
    const canvas = useRef<any>()
    const [drawings, setDrawings] = useState([])
    const [drawingId, setDrawingId] = useState('')
    const [drawingContent, setDrawingContent] = useState('')
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
            }
        }
        asyncGetDrawings()
    }, []) // runs when mounted

    if (drawings.length === 0) return null

    return (
        <div className="editor">
            <div className="drawings">
                {drawings.map((drawing: any) => {
                    return (
                        <div
                            onClick={() => {
                                setDrawingId(drawing._id)
                                setDrawingContent(drawing.content)
                            }}
                            className="drawing"
                            key={drawing._id}
                        >
                            drawing
                        </div>
                    )
                })}
            </div>
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
                            onClick={() => {
                                patchDrawing(params.pictureId, drawingId, canvas.current.getSaveData())
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
            <div className="description">descirption</div>
        </div>
    )
}
export default Editor

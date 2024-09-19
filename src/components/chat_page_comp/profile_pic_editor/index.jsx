import './style.scss'
import { useRef, useState, useEffect } from 'react'
// import useCustomDialog from '../../../custom/dialogs'
import { Jimp } from 'jimp'
// import LoadingIcons from 'react-loading-icons'

import { BouncingDots } from '../../../custom/loading_animations'

export default function ProfilePicEditor({ image_file, closeProfilePicEditor, imageDimensions, setEditedProfileFile }) {
    const draggable_circle_container_ref = useRef(null)
    const draggable_circle_ref = useRef(null)
    // number of pixels scrolled
    const scroll_position = useRef(0)
    // draggable circle position
    const [{ dx, dy }, setOffset] = useState({ dx: 0, dy: 0 })
    // value of the range used as percentage
    const [circleSize, setCircleSize] = useState(50)
    const [{ windowWidth, windowHeight }, setWindowDimensions] = useState({ windowWidth: null, windowHeight: null })

    const [loading, setLoading] = useState(false)
    // to disable upload btn if criteria is not met
    const [disabled, setDisabled] = useState(false)

    const [debugData, setDebugData] = useState({})

    // const useCustomDialogs = useCustomDialog()

    const getCords = async () => {
        setLoading(true)
        const circleDiameter = draggable_circle_ref.current?.offsetWidth

        const image = document.querySelector('.image-holder img');

        // console.table({ dx, dy, scroll_position: scroll_position.current })

        const x_pos = dx - (circleDiameter / 2)
        const y_pos = (dy - (circleDiameter / 2)) + scroll_position.current

        // console.table({ x_pos, y_pos, circleDiameter, 'image holder height': image.offsetHeight })

        const x_percent = (x_pos / image.offsetWidth) * 100
        const y_percent = (y_pos / image.offsetHeight) * 100
        const size_percent = (circleDiameter / image.offsetWidth) * 100

        // console.table({ x_percent, y_percent, size_percent })

        const x_cord = imageDimensions.width * (x_percent / 100)
        const y_cord = imageDimensions.height * (y_percent / 100)
        const size = Math.floor(imageDimensions.width * (size_percent / 100))

        // console.table({ x_cord, y_cord, size })

        editImage(x_cord, y_cord, size)
    }

    const editImage = async (x_cord, y_cord, size) => {
        const jimpImage = await Jimp.read(image_file)
        await jimpImage.crop({ x: x_cord, y: y_cord, w: size, h: size })
        await jimpImage.resize({ w: 150, h: 150 })
        const newFile = await jimpImage.getBase64('image/jpeg')
        setEditedProfileFile(newFile)

        closeProfilePicEditor()
    }

    const mainCircleWithinContainer = (containerWidth, containerHeight) => {
        const circleDiameterOffset = draggable_circle_ref.current?.offsetWidth / 2
        const circleTop = dy - circleDiameterOffset;
        const circleBottom = dy + circleDiameterOffset
        const circleLeft = dx - circleDiameterOffset
        const circleRight = dx + circleDiameterOffset

        const newOffset = { dx: dx, dy: dy }

        if (circleLeft < 0) { newOffset.dx = circleDiameterOffset }
        else if (circleRight > containerWidth) { newOffset.dx = containerWidth - circleDiameterOffset }

        if (circleTop < 0) { newOffset.dy = circleDiameterOffset }
        else if (circleBottom > containerHeight) { newOffset.dy = containerHeight - circleDiameterOffset }

        setOffset(newOffset)
    }

    // set the diameter of the draggable circle
    useEffect(() => {
        const containerWidth = draggable_circle_container_ref.current?.offsetWidth
        const containerHeight = draggable_circle_container_ref.current?.offsetHeight

        if (!containerWidth || !containerHeight) {
            setDisabled(true)
            return
        }
        if (disabled) setDisabled(false)
        
        const circleDiameter = (Math.min(containerWidth, containerHeight) / 100) * circleSize
        
        draggable_circle_ref.current.style.width = `${circleDiameter}px`
        draggable_circle_ref.current.style.height = `${circleDiameter}px`

        mainCircleWithinContainer(containerWidth, containerHeight)

    }, [windowWidth, windowHeight, circleSize])

    // set the size of the window on resize
    useEffect(() => {
        setWindowDimensions({ windowWidth: window.innerWidth, windowHeight: window.innerHeight })

        const handleResize = () => {
            setWindowDimensions({ windowWidth: window.innerWidth, windowHeight: window.innerHeight })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }

    }, [])


    const handleMouseDown = e => {
        const startPos = {
            x: e.clientX - dx,
            y: e.clientY - dy
        }
        const containerWidth = draggable_circle_container_ref.current.offsetWidth
        const containerHeight = draggable_circle_container_ref.current.offsetHeight

        const circleDiameterOffset = draggable_circle_ref.current.offsetWidth / 2

        const handleMouseMove = e => {

            // How far the mouse has been moved
            let dx = e.clientX - startPos.x
            let dy = e.clientY - startPos.y

            // Set the position of element
            if (dx < circleDiameterOffset) {
                // circle has reached the left side
                dx = circleDiameterOffset
            } else if (dx > containerWidth - circleDiameterOffset) {
                // circle has reached the right side
                dx = containerWidth - circleDiameterOffset
            }
            if (dy < circleDiameterOffset) {
                // circle has reached the top
                dy = circleDiameterOffset
            } else if (dy > containerHeight - circleDiameterOffset) {
                // circle has reached the bottom
                dy = containerHeight - circleDiameterOffset
            }

            // Reassign the position of mouse
            setOffset({ dx, dy })
        }

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleTouchStart = e => {
        const touch = e.touches[0]

        const startPos = {
            x: touch.clientX - dx,
            y: touch.clientY - dy
        }
        const containerWidth = draggable_circle_container_ref.current.offsetWidth
        const containerHeight = draggable_circle_container_ref.current.offsetHeight

        const circleDiameterOffset = draggable_circle_ref.current.offsetWidth / 2

        const handleTouchMove = e => {
            const touch = e.touches[0]
            let dx = touch.clientX - startPos.x
            let dy = touch.clientY - startPos.y


            if (dx < circleDiameterOffset) {
                dx = circleDiameterOffset
            } else if (dx > containerWidth - circleDiameterOffset) {
                dx = containerWidth - circleDiameterOffset
            }

            if (dy < circleDiameterOffset) {
                dy = circleDiameterOffset
            } else if (dy > containerHeight - circleDiameterOffset) {
                dy = containerHeight - circleDiameterOffset
            }

            setOffset({ dx, dy })
        }

        const handleTouchEnd = () => {
            document.removeEventListener("touchmove", handleTouchMove)
            document.removeEventListener("touchend", handleTouchEnd)
        }

        document.addEventListener("touchmove", handleTouchMove)
        document.addEventListener("touchend", handleTouchEnd)
    }


    return (
        <div className="profile-pic-editor no-select">
            <div className="profile-pic-editor__content">
                <div className="debug-box" style={{ fontSize: '20px' }}>
                    <p>
                        {
                            Object.keys(debugData).map(key => <span key={key}>{key}: {debugData[key]}<br /></span>)
                        }
                    </p>
                </div>
                <div className="image-container" ref={draggable_circle_container_ref}>
                    <div className="draggable-circle"
                        style={{ top: `${dy}px`, left: `${dx}px` }}
                        ref={draggable_circle_ref}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}>
                    </div>
                    <div className="image-holder" onScroll={(e) => scroll_position.current = e.target.scrollTop}>
                        <img src={image_file} alt="" />
                    </div>
                </div>
                <input type="range" min="20" max="100" defaultValue={50} onChange={(e) => setCircleSize(e.target.value)} />
                <div className="profile-pic-editor__content__btns">
                    {!loading ?
                        <>
                            <button onClick={closeProfilePicEditor}>Cancel</button>
                            <button disabled={disabled} onClick={getCords}>Upload</button>
                        </>
                            :
                        <BouncingDots />
                    }
                </div>
            </div>
        </div>
    )
}
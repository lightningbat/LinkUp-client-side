import { useRef, useEffect, useState } from "react";

/**
 * @param {object} style - styles of the component
 * @param {function} closePopup - function to close the popup
 * @param {ref} buttonRef - (optional) reference to the call button
 * @param {children} children - content inside the component
*/
export default function OutsideClickDetector(props) {
    const wrapperRef = useRef(null);

    // console.log('buttonRef' in props);

    useEffect(() => {
        function handleClickOutside(event) {
            if (('buttonRef' in props)) {
                // not to detect click on the call button as outside click
                if ((wrapperRef.current && !wrapperRef.current.contains(event.target)) && (props.buttonRef.current && !props.buttonRef.current.contains(event.target))) {
                    // close if the clicked outside the container or button
                    props.closePopup();
                }
            }
            else if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                // close if the clicked outside the container
                props.closePopup();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                props.closePopup();
            }
        })
    }, [wrapperRef]);

    return <div style={props.style} ref={wrapperRef}>{props.children}</div>;
}
import './style.scss'
import { OutsideClickDetector, ToggleSwitch, ProfilePicEditor } from '../../../../components/chat_page_comp'
import { useEffect, useRef, useState } from 'react'

import { EditProfile, EditPassword, BlockedList } from './fragments'

import useCustomDialog from '../../../../custom/dialogs'

export default function SettingsTab({ darkMode, setDarkMode }) {
    const profile_info = {
        profile_img: null, //"https://picsum.photos/150/150",
        bg_color: "rgb(1, 135, 197)",
        display_name: 'User Name',
        username: 'User Username #5464',
        email: 'User Email',
    }

    const element = useRef(null)

    const [selectedFragment, setSelectedFragment] = useState(null)
    const [showFragment, setShowFragment] = useState(false)
    const fragment_loader_ref = useRef(null)

    const [showEditPicDropdown, setShowEditPicDropdown] = useState(false)
    const edit_pic_btn_ref = useRef(null)

    const [profilePicEditor, setProfilePicEditor] = useState({
        display: false,
        image_file: null
    })

    const [editedProfileFile, setEditedProfileFile] = useState(null)

    const removeProfilePicEditor = () => {
        setProfilePicEditor({ display: false, image_file: null })
    }

    const toggleEditPicDropdown = () => {
        setShowEditPicDropdown(!showEditPicDropdown)
    }

    const closeEditPicDropdown = () => {
        setShowEditPicDropdown(false)
    }

    const openFragment = (fragment) => {
        fragment_loader_ref.current.classList.add('show')
        fragment_loader_ref.current.classList.remove('hide')

        setSelectedFragment(fragment)
        setShowFragment(true)
    }

    const closeFragment = () => {
        fragment_loader_ref.current.classList.add('hide')
        fragment_loader_ref.current.classList.remove('show')

        setShowFragment(false)
    }

    // removes fragment after closing animation is done
    // if not removed, fragment keeps loaded (just hidden)
    useEffect(() => {
        setTimeout(() => { if (!showFragment) setSelectedFragment(null) }, 200);
    }, [showFragment])

    // wider scrollbar when mouse is over it
    useEffect(() => {
        element.current.addEventListener("mousemove", function (e) {
            const distanceX = element.current.offsetLeft + element.current.offsetWidth - e.pageX;
            if ((element.current.offsetTop < e.pageY && e.pageY < element.current.offsetTop + element.current.offsetHeight) && (distanceX < 15 && distanceX > 0)) {
                element.current.classList.add('more-width')
            }
            else {
                element.current.classList.remove('more-width')
            }
        })
    }, [])


    // Initialize custom dialogs
    const customDialogs = useCustomDialog()

    async function handleConfirmDeleteDP() {
        closeEditPicDropdown()

        const confirm = await customDialogs({
            type: 'confirm',
            title: 'Confirm?',
            description: 'Delete profile picture.',
        })
    }


    const selected_img_ref = useRef(null)

    const confirmFileType = (file) => {
        const fileType = file.type
        const supportedFileTypes = ['image/png', 'image/jpeg', 'image/jpg']
        if (supportedFileTypes.includes(fileType)) return true
        return false
    }

    function selectDPimage() {
        closeEditPicDropdown()
        const input = document.createElement('input');
        input.type = 'file';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!confirmFileType(file)) {
                await customDialogs({
                    type: 'alert',
                    description: 'Only PNG and JPG files are allowed.',
                })
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                await customDialogs({
                    type: 'alert',
                    description: 'File size too large. Max size is 5MB.',
                })
                return;
            }

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = async () => {

                let imageDimensions;

                try {
                    imageDimensions = await getImageDimensions(fileReader.result)
                }
                catch (error) {
                    await customDialogs({
                        type: 'alert',
                        description: error,
                    })
                    return
                }
                
                selected_img_ref.current.src = fileReader.result;
                setProfilePicEditor({ display: true, image_file: fileReader.result, imageDimensions })
            }
            fileReader.onerror = async (error) => {
                await customDialogs({
                    type: 'alert',
                    description: error.message,
                })
            }

        }

        input.click();
    }

    function getImageDimensions(image_file) {
        return new Promise((resolve, reject) => {
            if (!image_file) return reject('Image Validation Error: Please select an image')
            const img = new Image();
            img.src = image_file;

            const maxAspectRatio = 2.5
            const minAspectRatio = 0.4

            img.onload = () => {

                const aspect_ratio = img.width / img.height
                if (aspect_ratio >= maxAspectRatio || aspect_ratio <= minAspectRatio) {
                    return reject(`Image aspect ratio should be between ${maxAspectRatio} and ${minAspectRatio} \n\nGot: ${Math.round((aspect_ratio + Number.EPSILON) * 10) / 10}`)
                }
                resolve({'width': img.width, 'height': img.height})
            }
            img.onerror = (error) => {
                console.log(error)
                reject('Unable to load file as an image')
            }
        })
    }

    return (
        <div className="settings-tab" ref={element}>
            {!showFragment && <>
                <div className='profile no-select'>
                    <div className="profile-icon" style={{ backgroundColor: profile_info.bg_color }}>
                        {profile_info.profile_img ?
                            <img src={editedProfileFile ? editedProfileFile : profile_info.profile_img} alt="" />
                            :
                            <h2>{profile_info.display_name[0]}</h2>
                        }
                        <div className="edit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleEditPicDropdown} ref={edit_pic_btn_ref} width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                            </svg>
                            <div className='dropdown-container'>
                                {showEditPicDropdown && <OutsideClickDetector closePopup={closeEditPicDropdown} buttonRef={edit_pic_btn_ref} style={{ position: 'absolute', top: '10px', right: 0 }} >
                                    <div className="edit-btn-dropdown">
                                        <ul>
                                            <li onClick={selectDPimage}>Upload photo</li>
                                            {profile_info.profile_img && <li onClick={handleConfirmDeleteDP}>Remove photo</li>}
                                        </ul>
                                    </div>
                                </OutsideClickDetector>}
                            </div>
                        </div>
                    </div>

                    <h2 className="profile-name">{profile_info.display_name}</h2>
                </div>

                <div className="setting-options no-select">
                    <div className="option-btn edit-profile-btn cursor-pointer" onClick={() => openFragment('edit-profile')}>
                        <p>Edit Profile</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </div>
                    <div className="option-btn change-pass-btn cursor-pointer" onClick={() => openFragment('edit-password')}>
                        <p>Change Password</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </div>
                    <div className="option-btn dark-mode">
                        <p>Dark Mode</p>
                        <ToggleSwitch defaultChecked={darkMode} onChange={setDarkMode} />
                    </div>
                    <div className="option-btn last-seen">
                        <p>Last seen and Status</p>
                        <div className='select'>
                            <select>
                                <option value="Everyone">Everyone</option>
                                <option value="Nobody">Nobody</option>
                            </select>
                        </div>
                    </div>
                    <div className="option-btn edit-blocked_list-btn cursor-pointer" onClick={() => openFragment('blocked-list')}>
                        <p>Blocked List</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </div>
                </div>
                <div className="page-footer">
                    <button className="logout-btn cursor-pointer" >Logout</button>
                </div>
            </>}

            <div className='fragment-loader' ref={fragment_loader_ref}>
                {selectedFragment == 'edit-password' && <EditPassword closeFragment={closeFragment} />}
                {selectedFragment == 'blocked-list' && <BlockedList closeFragment={closeFragment} />}
                {selectedFragment == 'edit-profile' && <EditProfile closeFragment={closeFragment} />}
            </div>

            {profilePicEditor.display && <ProfilePicEditor image_file={profilePicEditor.image_file} closeProfilePicEditor={removeProfilePicEditor} imageDimensions={profilePicEditor.imageDimensions} setEditedProfileFile={setEditedProfileFile} />}
        </div>
    )
}
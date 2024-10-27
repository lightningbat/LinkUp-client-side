import './style.scss'
import { UserSearchBox, ContactBox, AddContactBox } from "../../../../components/chat_page_comp"
import PropTypes from 'prop-types';

import { useEffect, useRef, useState, useContext } from 'react';
// import { useImmer } from 'use-immer';
import FetchService from '../../../../services/fetchService';
import useCustomDialog from '../../../../custom/dialogs';
import { getToken } from '../../../../services/authenticationService';

import { GlobalStateContext } from '../../../../context';
import { BouncingDots } from '../../../../custom/loading_animations';

import { socket } from '../../../../socket';

ContactsTab.propTypes = {
    show: PropTypes.bool
}
export default function ContactsTab({ show }) {

    // const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    // getting data from context
    const customDialogs = useCustomDialog()
    const { currentUser, setCurrentUser } = useContext(GlobalStateContext);
    const { chat_contacts } = currentUser

    /* ****** holds contacts list data from the backend ****** */
    const [contactsList, setContactsList] = useState(null);

    // for debugging
    useEffect(() => {
        console.log('contactsList', contactsList)
    }, [contactsList])


    // reference to the list container
    const element = useRef(null)
    const user_search_box_ref = useRef();
    const [showAddContactBox, setShowAddContactBox] = useState(false);
    const add_contact_box_ref = useRef();

    /* ****** Socket Event Handler ****** */
    // runs when a user's contact connects or disconnects
    function updateOnlineStatus(user_info, isOnline) {
        if (contactsList) {
            let updated_contacts = contactsList.map(contact => {
                if (contact.user_id == user_info.user_id) {
                    contact.online = isOnline
                    // updating last seen time if user went offline
                    if (!isOnline) {
                        contact.last_seen = user_info.last_seen
                    }
                    else {
                        contact.last_seen = null
                    }
                }
                return contact
            })
            setContactsList(updated_contacts)
        }
    }

    /* ****** Socket Event Sub-Handler ****** */
    // update the online status of the contact based on the
    // data fetched from the backend after reconnect to socket
    async function recoverContactsOnlineStatus() {
        if (contactsList) {
            const all_contacts_ids = contactsList.map(contact => contact.user_id)
            const response = await FetchService('getContactsOnlineStatus', 
                { token: getToken(), contacts: all_contacts_ids })
            
            if (response.ok) {
                // data : { "uuid of the contact": { "online": boolean, "last_seen": "timestamp"} }
                const data = response.responseData;
                let updated_contacts = contactsList.map(contact => {
                    if (data[contact.user_id]) {
                        contact.online = data[contact.user_id].online
                        contact.last_seen = data[contact.user_id].last_seen
                    }
                    return contact
                })
                setContactsList(updated_contacts)
            }
            else {
                customDialogs({
                    type: 'alert',
                    description: "Something went wrong while recovering data on reconnect\nTry refreshing the page"
                })
            }
        }
    }

    /* ****** Socket Event Handlers ****** */
    // runs when the socket reconnects
    function recoverDataOnReconnect() {
        // updating online status of all users in contactList
        recoverContactsOnlineStatus()
    }

    function syncNewContact(contact_details) {
        add_new_contact(contact_details, true)
        // joining the contact's socket room
        socket.emit("join_new_contact_room", contact_details.user_id)
    }

    function updateContactProfile(contact_details) { // contact_details : { user_id, display_name, username }
        if (!contactsList) return

        let updated_contacts = contactsList.map(contact => {
            if (contact.user_id == contact_details.user_id) {
                contact.display_name = contact_details.display_name
                contact.username = contact_details.username
            }
            return contact
        })
        setContactsList(updated_contacts)
    }

    function  updateProfileSync(data) {
        setCurrentUser({...currentUser, ...data})
    }
    useEffect(() => {
        socket.on("user_connected", (user_id) => updateOnlineStatus({ user_id }, true))
        socket.on("user_disconnected", (user_info) => updateOnlineStatus(user_info, false))
        socket.on("connect", recoverDataOnReconnect)
        socket.on("newContact", syncNewContact)
        socket.on("contact_profile_update", updateContactProfile)
        socket.on("profile_update_sync", updateProfileSync)

        return () => {
            socket.off("user_connected", updateOnlineStatus)
            socket.off("user_disconnected", updateOnlineStatus)
            socket.off("connect", recoverDataOnReconnect)
            socket.off("newContact", syncNewContact)
            socket.off("contact_profile_update", updateContactProfile)
            socket.off("profile_update_sync", updateProfileSync)
        }
    })

    // receiving contacts and chat data from the backend on Startup
    useEffect(() => {
        if (!chat_contacts || Object.keys(chat_contacts).length == 0) {
            setLoading(false);
            return
        };

        (async () => {
            // payload : { "uuid of the contact": { chat_id: "uuid of the chat" } }
            const payload = {}
            for (const [key, value] of Object.entries(chat_contacts)) {
                payload[key] = { chat_id: value.chat_id }
            }

            let contacts_fetch_resp = await fetchData('getContactsDetail',
                { token: getToken(), contactsList: payload })

            // adding time at which the contact was added in the list
            contacts_fetch_resp = contacts_fetch_resp.map(contact => {
                contact.contact_added_at = chat_contacts[contact.user_id].time
                return contact
            })

            if (contacts_fetch_resp && contacts_fetch_resp.length) {
                contacts_fetch_resp = sortContactsList(contacts_fetch_resp)
                setContactsList(contacts_fetch_resp)
            }
        })()
    }, [])

    async function fetchData(route, payload) {
        const response = await FetchService(route, payload);
        setLoading(false)
        if (response.ok) {
            return response.responseData
        }
        else {
            const message = response.responseType == 'json' ?
                response.responseData?.message
                :
                response.responseData;

            await customDialogs({
                type: 'alert',
                description: message
            })
        }
        return null
    }

    // sorts the contacts list based on the last message time
    function sortContactsList(contacts_list) {
        return contacts_list.sort((a, b) => {
            // sorting based on last message time( if available )
            // ( if not available ) sorting based on contact added time
            const dateA = new Date(a?.last_message_info?.time)?.getTime() || new Date(a?.contact_added_at)?.getTime()
            const dateB = new Date(b?.last_message_info?.time)?.getTime() || new Date(b?.contact_added_at)?.getTime()
            if (dateA > dateB) {
                return -1
            }
            if (dateA < dateB) {
                return 1
            }
            return 0
        })
    }

    const add_new_contact = (contact_details, called_by_socket = false) => {
        // called_by_socket : if the function is called by the socket (to sync with other tabs)
        // this means any other socket added this contact
        if (contactsList && contactsList.find(contact => contact.user_id == contact_details.user_id)) {
            // new contact is already in the list
            return
        }
        let new_sorted_contacts;
        if (contactsList) {
            new_sorted_contacts = sortContactsList([...contactsList, contact_details])
        }
        else {
            new_sorted_contacts = [contact_details]
        }
        setContactsList(new_sorted_contacts)

        // informing websocket that a new contact has been added
        // so it can add the current user to the contact's socket room
        if (!called_by_socket) socket.emit("join_new_contact_room", contact_details.user_id)
    }

    // add "more-width" class name to the list container when the mouse hovers over it
    // this makes the scrollbar more wider
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

    return (
        <div className="contacts-tab" style={{ display: show ? "flex" : "none" }}>
            <div className='left-right'>
                <div className='add-user-btn' onClick={() => setShowAddContactBox(!showAddContactBox)} ref={add_contact_box_ref}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                    </svg>
                </div>
                <UserSearchBox ref={user_search_box_ref} />
            </div>
            <div className="contacts-list-container" ref={element}>
                {!contactsList && <div className="empty-list">
                    {loading && <BouncingDots scale={2} speed={0.8} />}
                    {!loading && contactsList == null &&
                        <svg width="612" height="900" viewBox="0 0 612 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                d="M138.5 239.5H130.354L126.557 246.706L19.0568 450.706L17.5 453.661V457V610.205C17.5 625.567 26.2212 638.213 37.7861 646.493C49.3753 654.789 64.6968 659.5 81 659.5H531C547.303 659.5 562.625 654.789 574.214 646.493C585.779 638.213 594.5 625.567 594.5 610.205V457V453.337L592.649 450.176L473.149 246.176L469.238 239.5H461.5H138.5ZM53.3737 443.5L146.646 266.5H453.762L557.446 443.5H399.5V457.5V471.381V471.5V515.783C399.5 545.427 377.644 567.5 353 567.5H259C234.356 567.5 212.5 545.427 212.5 515.783V470.5V455.5V443.5H199H185.5H53.3737ZM426.5 470.5H567.5V610.205C567.5 614.611 565.028 619.863 558.497 624.539C551.99 629.197 542.311 632.5 531 632.5H81C69.6889 632.5 60.0104 629.197 53.5032 624.539C46.9717 619.863 44.5 614.611 44.5 610.205V470.5H185.5V515.783C185.5 558.175 217.369 594.5 259 594.5H353C394.631 594.5 426.5 558.175 426.5 515.783V470.5Z"
                                />
                            <path d="M306 189.07V10" strokeWidth="19" strokeLinecap="round" />
                            <path d="M395 197L441.195 45.9039"  strokeWidth="19" strokeLinecap="round" />
                            <path d="M217.355 197L171.16 45.9039" strokeWidth="19" strokeLinecap="round" />
                            <path
                                d="M62.72 796.064C62.72 793.589 63.2747 791.456 64.384 789.664C65.5787 787.787 67.328 786.848 69.632 786.848C71.5947 786.848 73.344 787.232 74.88 788C76.416 788.768 77.184 790.048 77.184 791.84C77.184 795.339 77.0133 800.245 76.672 806.56C76.3307 812.704 76.16 817.269 76.16 820.256C76.16 824.949 76.3307 831.221 76.672 839.072C77.0133 846.581 77.184 852.085 77.184 855.584C77.184 858.4 77.1413 860.491 77.056 861.856C77.056 863.221 76.288 864.587 74.752 865.952C73.3013 867.232 71.04 867.872 67.968 867.872C66.3467 867.872 64.9387 867.616 63.744 867.104C62.6347 866.507 61.8667 865.867 61.44 865.184C57.4293 860.32 51.584 852.043 43.904 840.352C35.2853 827.296 28.2453 817.312 22.784 810.4C23.4667 816.544 23.808 824.053 23.808 832.928C23.808 836.853 23.7227 841.973 23.552 848.288C23.4667 854.517 23.296 858.613 23.04 860.576C22.6987 863.051 21.9307 864.971 20.736 866.336C19.6267 867.616 17.8347 868.256 15.36 868.256C13.4827 868.256 12.0747 867.744 11.136 866.72C10.2827 865.611 9.77067 863.733 9.6 861.088C9.51467 857.589 9.728 852.341 10.24 845.344C10.3253 844.235 10.4533 842.315 10.624 839.584C10.7947 836.853 10.88 834.421 10.88 832.288C10.88 826.4 10.5813 819.659 9.984 812.064C9.472 803.701 9.216 797.515 9.216 793.504C9.216 791.456 9.94133 789.877 11.392 788.768C12.928 787.659 14.6773 787.104 16.64 787.104C18.3467 787.104 20.1387 787.531 22.016 788.384C29.3547 797.6 39.296 811.339 51.84 829.6L63.872 848.032C63.9573 846.667 64 844.747 64 842.272C64 837.92 63.9147 833.227 63.744 828.192C63.5733 823.157 63.4453 819.744 63.36 817.952C62.9333 809.675 62.72 802.379 62.72 796.064ZM130.791 786.592C136.508 786.592 141.714 787.317 146.407 788.768C151.1 790.133 154.94 792.181 157.927 794.912C163.303 799.776 167.058 805.109 169.191 810.912C171.41 816.629 172.519 823.968 172.519 832.928C172.519 834.805 172.263 836.512 171.751 838.048C171.324 839.584 170.599 841.547 169.575 843.936C168.295 846.581 167.527 848.672 167.271 850.208C165.564 853.195 162.748 856.053 158.823 858.784C154.983 861.515 150.802 863.733 146.279 865.44C141.756 867.147 137.788 868 134.375 868C117.906 868 106.172 862.368 99.175 851.104C97.2123 847.947 95.6763 844.661 94.567 841.248C93.543 837.835 93.031 834.507 93.031 831.264C93.031 822.56 94.567 815.008 97.639 808.608C100.796 802.123 105.148 797.088 110.695 793.504C114.023 791.541 117.479 789.92 121.063 788.64C124.732 787.275 127.975 786.592 130.791 786.592ZM106.343 831.648C106.343 836.256 107.367 840.053 109.415 843.04C111.548 846.027 114.791 849.269 119.143 852.768C122.727 854.133 125.159 855.029 126.439 855.456C127.719 855.797 129.17 855.968 130.791 855.968C139.41 855.968 146.279 853.621 151.399 848.928C156.519 844.235 159.079 837.792 159.079 829.6C159.079 823.115 158.354 817.995 156.903 814.24C155.452 810.485 152.85 807.115 149.095 804.128C147.132 802.507 144.615 801.312 141.543 800.544C138.556 799.776 135.314 799.392 131.815 799.392C126.524 799.392 121.959 800.971 118.119 804.128C114.279 807.2 111.335 811.211 109.287 816.16C107.324 821.109 106.343 826.272 106.343 831.648ZM180.533 793.376C180.533 789.707 183.221 787.872 188.597 787.872C190.901 787.872 195.296 787.957 201.781 788.128C208.949 788.469 214.368 788.64 218.037 788.64C221.024 788.64 224.65 788.469 228.917 788.128C231.818 787.957 233.653 787.872 234.421 787.872C239.114 788.043 243.082 788.896 246.325 790.432C247.264 790.859 248.032 791.371 248.629 791.968C249.226 792.565 249.525 793.547 249.525 794.912C249.525 796.789 248.928 798.411 247.733 799.776C246.538 801.056 245.088 801.696 243.381 801.696C241.504 801.696 238.773 801.44 235.189 800.928C232.032 800.331 229.258 800.032 226.869 800.032C224.565 800.032 222.816 800.075 221.621 800.16C221.365 802.976 221.237 809.717 221.237 820.384C221.237 833.099 221.621 845.984 222.389 859.04L222.645 862.752C222.645 866.251 220.64 868 216.629 868C213.472 868 211.338 867.275 210.229 865.824C209.12 864.288 208.565 861.984 208.565 858.912C208.565 852.853 208.394 845.301 208.053 836.256C207.712 828.747 207.541 823.413 207.541 820.256C207.541 818.123 207.797 811.595 208.309 800.672L193.333 800.8C188.554 800.8 185.226 800.373 183.349 799.52C181.472 798.581 180.533 796.533 180.533 793.376ZM316.539 822.176C316.454 820.811 316.411 818.763 316.411 816.032V811.168C316.411 807.925 316.326 805.493 316.155 803.872C315.984 802.507 315.899 798.965 315.899 793.248C315.899 791.2 316.496 789.621 317.691 788.512C318.971 787.317 320.678 786.72 322.811 786.72C325.542 786.72 327.376 787.317 328.315 788.512C329.254 789.707 329.723 791.669 329.723 794.4V799.264L329.595 813.344C329.51 816.075 329.467 820.171 329.467 825.632L329.595 836.128C329.68 837.749 329.723 840.011 329.723 842.912C329.723 845.216 329.808 848.501 329.979 852.768C330.15 856.693 330.235 859.637 330.235 861.6C330.235 863.221 329.766 864.715 328.827 866.08C327.974 867.445 326.779 868.128 325.243 868.128C319.27 868.128 316.283 866.123 316.283 862.112C316.283 859.893 316.368 857.419 316.539 854.688C316.71 852.725 316.795 849.739 316.795 845.728C316.795 842.912 316.71 838.859 316.539 833.568C312.528 833.909 305.616 834.08 295.803 834.08C289.659 834.08 284.88 834.08 281.467 834.08C278.054 833.995 275.579 833.781 274.043 833.44L273.915 848.16C273.915 849.099 274.128 851.616 274.555 855.712C274.982 858.443 275.195 860.832 275.195 862.88C275.195 864.16 274.427 865.397 272.891 866.592C271.44 867.701 270.075 868.256 268.795 868.256C265.723 868.256 263.632 867.531 262.523 866.08C261.414 864.544 260.859 862.24 260.859 859.168L260.731 849.056C260.646 847.861 260.603 846.197 260.603 844.064C260.603 840.907 260.518 836.597 260.347 831.136C260.176 826.187 260.091 822.603 260.091 820.384C260.091 817.056 260.176 812.405 260.347 806.432C260.518 800.8 260.603 796.619 260.603 793.888C260.603 791.157 261.286 789.323 262.651 788.384C264.016 787.445 265.552 786.976 267.259 786.976C272.038 786.976 274.427 788.555 274.427 791.712C274.427 797.344 274.299 802.72 274.043 807.84C273.872 814.325 273.787 819.061 273.787 822.048C276.262 822.645 278.864 823.029 281.595 823.2C284.326 823.371 288.166 823.456 293.115 823.456C303.184 823.456 310.992 823.029 316.539 822.176ZM356.14 868.384C353.58 868.384 351.788 867.616 350.764 866.08C349.825 864.544 349.356 862.368 349.356 859.552L349.484 842.912L349.356 840.352C348.929 832.245 348.716 825.547 348.716 820.256L349.228 805.024L349.356 797.344C349.356 794.784 349.441 792.821 349.612 791.456C349.783 790.091 350.337 788.981 351.276 788.128C352.215 787.275 353.708 786.848 355.756 786.848C358.316 786.848 360.151 787.488 361.26 788.768C362.369 789.963 362.924 792.053 362.924 795.04L362.796 797.728C362.455 804.555 362.284 809.717 362.284 813.216C362.284 817.056 362.369 821.579 362.54 826.784C362.711 831.904 362.839 835.531 362.924 837.664C363.351 846.795 363.564 854.645 363.564 861.216C363.564 863.776 363.009 865.611 361.9 866.72C360.876 867.829 358.956 868.384 356.14 868.384ZM435.47 796.064C435.47 793.589 436.025 791.456 437.134 789.664C438.329 787.787 440.078 786.848 442.382 786.848C444.345 786.848 446.094 787.232 447.63 788C449.166 788.768 449.934 790.048 449.934 791.84C449.934 795.339 449.763 800.245 449.422 806.56C449.081 812.704 448.91 817.269 448.91 820.256C448.91 824.949 449.081 831.221 449.422 839.072C449.763 846.581 449.934 852.085 449.934 855.584C449.934 858.4 449.891 860.491 449.806 861.856C449.806 863.221 449.038 864.587 447.502 865.952C446.051 867.232 443.79 867.872 440.718 867.872C439.097 867.872 437.689 867.616 436.494 867.104C435.385 866.507 434.617 865.867 434.19 865.184C430.179 860.32 424.334 852.043 416.654 840.352C408.035 827.296 400.995 817.312 395.534 810.4C396.217 816.544 396.558 824.053 396.558 832.928C396.558 836.853 396.473 841.973 396.302 848.288C396.217 854.517 396.046 858.613 395.79 860.576C395.449 863.051 394.681 864.971 393.486 866.336C392.377 867.616 390.585 868.256 388.11 868.256C386.233 868.256 384.825 867.744 383.886 866.72C383.033 865.611 382.521 863.733 382.35 861.088C382.265 857.589 382.478 852.341 382.99 845.344C383.075 844.235 383.203 842.315 383.374 839.584C383.545 836.853 383.63 834.421 383.63 832.288C383.63 826.4 383.331 819.659 382.734 812.064C382.222 803.701 381.966 797.515 381.966 793.504C381.966 791.456 382.691 789.877 384.142 788.768C385.678 787.659 387.427 787.104 389.39 787.104C391.097 787.104 392.889 787.531 394.766 788.384C402.105 797.6 412.046 811.339 424.59 829.6L436.622 848.032C436.707 846.667 436.75 844.747 436.75 842.272C436.75 837.92 436.665 833.227 436.494 828.192C436.323 823.157 436.195 819.744 436.11 817.952C435.683 809.675 435.47 802.379 435.47 796.064ZM527.093 808.736C525.813 807.883 524.576 806.901 523.381 805.792C520.309 803.403 517.706 801.653 515.573 800.544C513.44 799.349 511.05 798.752 508.405 798.752C504.65 798.752 500.896 799.221 497.141 800.16C493.472 801.099 490.442 802.421 488.053 804.128C484.469 806.773 482.037 810.272 480.757 814.624C479.477 818.891 478.837 824.139 478.837 830.368C478.837 836.939 480.885 842.784 484.981 847.904C487.456 850.72 490.442 852.896 493.941 854.432C497.525 855.968 501.109 856.736 504.693 856.736C512.97 856.736 519.114 854.432 523.125 849.824C526.026 846.155 527.477 841.675 527.477 836.384C527.477 835.445 526.794 834.805 525.429 834.464C524.064 834.123 522.101 833.952 519.541 833.952C518.261 833.952 516.256 833.781 513.525 833.44C512.757 833.355 511.904 833.269 510.965 833.184C510.112 833.099 509.216 833.056 508.277 833.056C505.802 833.056 503.84 832.587 502.389 831.648C500.938 830.709 500.213 829.515 500.213 828.064C500.213 826.016 500.896 824.523 502.261 823.584C503.626 822.56 505.461 822.048 507.765 822.048C510.41 822.048 514.464 822.219 519.925 822.56C525.045 822.901 528.672 823.072 530.805 823.072C533.792 823.072 536.181 824.011 537.973 825.888C539.85 827.765 540.789 830.496 540.789 834.08C540.789 837.408 540.064 841.291 538.613 845.728C537.162 850.165 535.114 854.133 532.469 857.632C529.909 861.131 526.112 863.819 521.077 865.696C516.128 867.573 510.666 868.512 504.693 868.512C499.829 868.512 495.008 867.659 490.229 865.952C485.45 864.16 481.44 861.771 478.197 858.784C474.272 855.115 471.157 850.763 468.853 845.728C466.634 840.608 465.525 835.531 465.525 830.496C465.525 822.731 466.89 815.477 469.621 808.736C472.437 801.909 476.704 796.619 482.421 792.864C484.981 791.157 488.906 789.749 494.197 788.64C499.488 787.531 504.138 786.976 508.149 786.976C513.781 786.976 518.901 788.213 523.509 790.688C528.117 793.163 531.701 796.235 534.261 799.904C535.285 801.44 535.797 802.805 535.797 804C535.797 805.365 535.2 806.645 534.005 807.84C532.81 809.035 531.616 809.632 530.421 809.632C529.909 809.632 529.312 809.547 528.629 809.376C527.946 809.205 527.434 808.992 527.093 808.736ZM570.284 793.76C570.284 798.368 570.028 805.109 569.516 813.984C569.004 822.517 568.748 829.045 568.748 833.568C568.748 834.763 568.833 837.237 569.004 840.992C568.919 842.443 568.407 843.552 567.468 844.32C566.529 845.003 565.42 845.344 564.14 845.344C562.775 845.344 561.537 845.003 560.428 844.32C559.319 843.637 558.636 842.741 558.38 841.632C557.356 834.635 556.844 826.272 556.844 816.544L556.972 796.576C556.972 793.419 557.356 790.859 558.124 788.896C558.977 786.848 560.769 785.824 563.5 785.824C565.804 785.824 567.511 786.592 568.62 788.128C569.729 789.579 570.284 791.456 570.284 793.76ZM563.5 852C569.303 852 572.204 854.176 572.204 858.528C572.204 860.747 571.479 862.795 570.028 864.672C568.663 866.464 566.913 867.36 564.78 867.36C562.22 867.36 560.129 866.592 558.508 865.056C556.887 863.435 556.076 861.557 556.076 859.424C556.076 857.547 556.759 855.84 558.124 854.304C559.575 852.768 561.367 852 563.5 852ZM602.534 793.76C602.534 798.368 602.278 805.109 601.766 813.984C601.254 822.517 600.998 829.045 600.998 833.568C600.998 834.763 601.083 837.237 601.254 840.992C601.169 842.443 600.657 843.552 599.718 844.32C598.779 845.003 597.67 845.344 596.39 845.344C595.025 845.344 593.787 845.003 592.678 844.32C591.569 843.637 590.886 842.741 590.63 841.632C589.606 834.635 589.094 826.272 589.094 816.544L589.222 796.576C589.222 793.419 589.606 790.859 590.374 788.896C591.227 786.848 593.019 785.824 595.75 785.824C598.054 785.824 599.761 786.592 600.87 788.128C601.979 789.579 602.534 791.456 602.534 793.76ZM595.75 852C601.553 852 604.454 854.176 604.454 858.528C604.454 860.747 603.729 862.795 602.278 864.672C600.913 866.464 599.163 867.36 597.03 867.36C594.47 867.36 592.379 866.592 590.758 865.056C589.137 863.435 588.326 861.557 588.326 859.424C588.326 857.547 589.009 855.84 590.374 854.304C591.825 852.768 593.617 852 595.75 852Z"
                                />
                        </svg>
                    }
                </div>}
                <div className="contacts-list">
                    {contactsList && sortContactsList(contactsList).map((contact) => <ContactBox key={contact.user_id} {...contact} />)}
                </div>
                <div className="search-result">

                </div>
            </div>
            {showAddContactBox && <AddContactBox closePopup={() => setShowAddContactBox(false)} btnRef={add_contact_box_ref} addNewContact={add_new_contact} />}
        </div>
    )
}
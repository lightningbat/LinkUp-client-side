import './style.scss';

// import { createContext, useContext, useRef, useState, useCallback } from 'react';

import React from 'react';

import { createContext, useContext, useRef, useState, useCallback } from 'react';

const customDialogs = createContext();

export function CustomDialogsProvider({ children }) {

    // there are three states: show, hide, null
    // 'show' and 'hide' are used to show and hide the dialog with animation
    // 'null' is used to hide the dialog without animation
    const [customConfirmState, setCustomConfirmState] = useState(null);
    const [customAlertState, setCustomAlertState] = useState(null);
    const [customDialogBgState, setCustomDialogBgState] = useState(null);

    const [customDialogData, setCustomDialogData] = useState({
        type: null, // 'confirm' or 'alert'
        title: '',
        description: '',
        confirmText: 'Yes',
        cancelText: 'No',
    });
    const fn = useRef();

    const updateState = (state, type) => {
        if (type === 'confirm') {
            setCustomConfirmState(state);
            setCustomDialogBgState(state);
        } else if (type === 'alert') {
            setCustomAlertState(state);
            setCustomDialogBgState(state);
        } else {
            throw new Error('Invalid Custom Dialog type');
        }
    }

    const contextValue = useCallback(
        (props) => {
            return new Promise((resolve) => {
                setCustomDialogData(props);
                const { type } = props;
                updateState('show', type);
                fn.current = (choice) => {
                    resolve(choice);
                    updateState('hide', type);
                };
            });
        }, [setCustomConfirmState, setCustomAlertState]
    );

    return (
        <customDialogs.Provider value={contextValue}>
            {children}
            <div className={`custom-dialog-bg ${customDialogBgState}`} onClick={() => fn.current(false)} />
            <div className={`custom-dialog custom-confirm-dialog ${customConfirmState}`}>
                <p className="title">{customDialogData.title}</p>
                <p className="description">{customDialogData.description}</p>
                <div className="actions">
                    <button
                        onClick={() => fn.current(false)}
                        className="cancel"
                    >
                        {customDialogData.cancelText || 'Cancel'}
                    </button>
                    <button
                        onClick={() => fn.current(true)}
                        className="confirm"
                    >
                        {customDialogData.confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
            <div className={`custom-dialog custom-alert-dialog ${customAlertState}`}>
                <p className="title">{customDialogData.title}</p>
                <p className="description">{customDialogData.description}</p>
                <div className="actions">
                    <button
                        onClick={() => fn.current(true)}
                        className="confirm"
                    >
                        {customDialogData.confirmText || 'Ok'}
                    </button>
                </div>
            </div>
        </customDialogs.Provider>
    )
}

export default function useCustomDialog() {
    return useContext(customDialogs);
}
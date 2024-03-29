import React, { useEffect, useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

function LoginModal({ isOpen, setIsOpen }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    return (
        <CModal
            visible={open}
            onClose={() => setOpen(false)}
            size='modal-xl'
            
        >
            <CModalHeader>
                <CModalTitle id="VerticallyCenteredExample">Modal title</CModalTitle>
            </CModalHeader>
            <CModalBody>
                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setOpen(false)}>
                    Close
                </CButton>
                <CButton color="primary">Save changes</CButton>
            </CModalFooter>
        </CModal>
    );
}

export default LoginModal;

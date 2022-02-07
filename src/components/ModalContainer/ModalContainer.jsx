import React, { useCallback, useEffect, useRef } from 'react';
import './ModalContainer.scss';

const ModalContainer = props => {
  const { className, isVisible, onClose } =props;
  const modalRef = useRef(null);

  const openModal = useCallback((target)=>{
    if(!target) return;
    target.style.opacity = 1;
    target.style.pointerEvents = "auto";
  }, []);

  const closeModal = useCallback((target)=>{
    if(!target) return;
    target.style.opacity = 0;
    target.style.pointerEvents = "none";
    if(onClose){
      setTimeout(()=>{
        onClose();
      }, 300)  
    }
  }, [onClose])

  useEffect(()=>{
    if(isVisible){
      openModal(modalRef.current);
    }
  }, [isVisible, openModal, modalRef])

  useEffect(()=>{
    window.onclick = (event) =>{
      if([...event.target.classList].find(a => a === "modal-container")){
        closeModal(event.target);
      };
    }
    return () =>{
      window.onclick = null;
    }
  }, [modalRef, closeModal])

  return(
    <div ref = {modalRef} className = {`modal-container ${className}`}>
      <div className = "modal-content">
      {props.children}
      </div>
    </div>
  )
}

export default ModalContainer;

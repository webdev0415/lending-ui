import React, { useEffect, useRef } from 'react';
import './ToggleSwitch.scss';

const ToggleSwitch = props => {
  const {isActive, setIsActive} = props;
  const checkboxRef = useRef(null);

  const onCheckChange = (event) => {
    if (event.currentTarget.checked) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }

  useEffect(() => {
    if(checkboxRef.current){
      checkboxRef.current.checked = isActive;
    }
  }, [isActive, checkboxRef])

  return (
    <label class="toggle-switch">
      <input onChange={onCheckChange} checked={isActive} type="checkbox" />
      <span class="slider round"></span>
    </label>
  )
}

export default ToggleSwitch;
import React from "react";
import { FaKey } from "react-icons/fa"; 
import { useHistory } from "react-router-dom"; 

const LoginElement = () => {
  const history = useHistory();
  const iconStyles = {
    fontSize: "1.5rem",
    color: "white",
    transition: "color 0.3s",
    cursor: "pointer",
  };

  const handleMouseEnter = () => {
      iconStyles.color = "#eb4034";
  };

  const handleMouseLeave = () => {
    iconStyles.color = "white";
  };

  return (
    <div
      style={iconStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={()=> history.push("/login")}
    >
      <FaKey />
    </div>
  );
};

export default LoginElement;

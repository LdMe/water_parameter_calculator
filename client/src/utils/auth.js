import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const checkAuth = (code) => {
    if (code === 401) {
      navigate('/login');
    }
  }

export {checkAuth};
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaLocationDot, 
  FaRulerCombined,
  FaCircleInfo,
  FaRightFromBracket,
  FaRightToBracket,
  FaUserPlus,
  FaBars,
  FaXmark,
  FaFlask
} from 'react-icons/fa6';

import './Navbar.scss';

const Navbar = ({ isLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const mainMenuItems = isLoggedIn ? [
    {
      to: "/location",
      icon: FaLocationDot,
      label: "Ubicaciones",
      description: "Ver y gestionar ubicaciones"
    },
    {
      to: "/parameter",
      icon: FaRulerCombined,
      label: "Parámetros",
      description: "Configurar parámetros de medición"
    },
    {
      to: "/onboard",
      icon: FaCircleInfo,
      label: "Guía",
      description: "Instrucciones de uso"
    }
  ] : [
    {
      to: "/onboard",
      icon: FaCircleInfo,
      label: "Guía",
      description: "Instrucciones de uso"
    },
    {
      to: "/login",
      icon: FaRightToBracket,
      label: "Iniciar Sesión",
      description: "Acceder a tu cuenta"
    },
    {
      to: "/register",
      icon: FaUserPlus,
      label: "Registrarse",
      description: "Crear una nueva cuenta"
    }
  ];

  // Separate logout item for special styling
  const logoutItem = {
    to: "/logout",
    icon: FaRightFromBracket,
    label: "Cerrar Sesión",
    description: "Salir de la aplicación"
  };

  const isCurrentRoute = (path) => location.pathname === path;

  return (
    <div className="navigation-container">
      {/* Desktop Navigation */}
      <nav className="navigation-bar desktop">
        <div className="nav-content">
          {mainMenuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${isCurrentRoute(item.to) ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              to={logoutItem.to}
              className="nav-item logout"
            >
              <logoutItem.icon className="nav-icon" />
              <span className="nav-label">{logoutItem.label}</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="navigation-bar mobile">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-menu-button"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileMenuOpen ? <FaXmark /> : <FaBars />}
        </button>

        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {mainMenuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mobile-nav-item ${isCurrentRoute(item.to) ? 'active' : ''}`}
              >
                <item.icon className="mobile-nav-icon" />
                <div className="mobile-nav-text">
                  <span className="mobile-nav-label">{item.label}</span>
                  <span className="mobile-nav-description">{item.description}</span>
                </div>
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                to={logoutItem.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-nav-item logout"
              >
                <logoutItem.icon className="mobile-nav-icon" />
                <div className="mobile-nav-text">
                  <span className="mobile-nav-label">{logoutItem.label}</span>
                  <span className="mobile-nav-description">{logoutItem.description}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
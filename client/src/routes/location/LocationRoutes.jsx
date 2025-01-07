import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaLocationDot, FaCircleInfo, FaPlus } from 'react-icons/fa6';
import './LocationRoutes.scss';

function LocationRoutes() {
  const { locations } = useOutletContext();

  return (
    <div className="location-routes">
      <div className="location-routes__welcome">
        <h1>Bienvenido a tu gestor de mediciones</h1>
        <p>Gestiona y monitoriza los parámetros de tus ubicaciones de forma sencilla</p>
      </div>

      <div className="location-routes__content">
        <section className="location-routes__locations">
          <div className="section-header">
            <h2><FaLocationDot /> Ubicaciones</h2>
            <Link to="/location/new" className="new-location-button">
              <FaPlus /> Nueva ubicación
            </Link>
          </div>

          {locations.length > 0 ? (
            <div className="locations-grid">
              {locations.map((location) => (
                <Link 
                  key={location._id} 
                  to={`/location/${location.name}`}
                  className="location-card"
                >
                  <div className="location-card__icon">
                    <FaLocationDot />
                  </div>
                  <div className="location-card__content">
                    <h3>{location.name}</h3>
                    <span className="location-card__link">Ver mediciones →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay ubicaciones creadas</p>
              <Link to="/location/new" className="empty-state__button">
                <FaPlus /> Crear primera ubicación
              </Link>
            </div>
          )}
        </section>

        <section className="location-routes__help">
          <div className="help-card">
            <div className="help-card__icon">
              <FaCircleInfo />
            </div>
            <h3>¿Cómo empezar?</h3>
            <ol>
              <li>Crea una nueva ubicación para tus mediciones</li>
              <li>Configura los parámetros que deseas medir</li>
              <li>Toma fotos de tus mediciones y déjanos calcular los valores</li>
            </ol>
            <Link to="/onboard" className="help-card__link">
              Ver guía completa
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LocationRoutes;
import './LocationSelector.scss'

/* function LocationSelector({ locations, selectedLocation, onSelect }) {

    return (
        
        <aside className="locations__list">
            {locations.map((location) => {
                return (
                    <article className={location._id === selectedLocation?._id ? "selected" : "" +" location__card"} key={location._id}>
                        <h3>{location.name}</h3>
                        <p>{location.description}</p>
                        <button className="location__button" onClick={() => onSelect(location)}>Ver mediciones</button>
                    </article>
                )
            })}
        </aside>
    )
}

export default LocationSelector */

import { useState } from 'react';
import { FaChevronLeft as ChevronLeft } from 'react-icons/fa6'; 
import { NavLink } from 'react-router-dom';

function LocationSelector({ locations, selectedLocation, onSelect }) {
  const [isOpen, setIsOpen] = useState(true);
  function handleSelect(location) {
    onSelect(location);
    setIsOpen(false);
  }
  return (
    <div className="location-selector">
      <aside className={`locations__list ${!isOpen ? 'closed' : ''}`}>
        <h2>Ubicaciones</h2>
        {locations.map((location) => (
          <article 
            className={`location__card ${location._id === selectedLocation?._id ? 'selected' : ''}`} 
            key={location._id}
          >
            <h3>{location.name}</h3>
            <p>{location.description}</p>
            <NavLink to={`/location/${location.name}`}>Ver mediciones</NavLink>
            <button 
              className="location__button" 
              onClick={() => handleSelect(location)}
            >
              Ver mediciones
            </button>
          </article>
        ))}
      </aside>
      <button 
        className={`toggle-button ${!isOpen ? 'closed' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Ocultar panel' : 'Mostrar panel'}
      >
        <ChevronLeft size={24} />
      </button>
    </div>
  );
}

export default LocationSelector;
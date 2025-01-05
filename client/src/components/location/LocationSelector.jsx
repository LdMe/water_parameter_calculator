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
import TextWithInfo from '../text/TextWithInfo';

function LocationSelector({ locations }) {
  const [isOpen, setIsOpen] = useState(true);
  function handleSelect() {
    setIsOpen(false);
  }
  return (
    <div className="location-selector">
      <aside className={`locations__list ${!isOpen ? 'closed' : ''}`}>
        <section className="locations__header">
          <h2>Ubicaciones</h2>
          <TextWithInfo>
            <p>
              Aquí puedes ver las ubicaciones donde se han realizado mediciones.
            </p>
            <p>
              Haz click en una ubicación para ver sus mediciones.
            </p>
          </TextWithInfo>
        </section>
        {locations.map((location) => (
          <NavLink
            key={location._id}
            to={`/location/${location.name}`}
            className={({ isActive }) => {
              return isActive ? 'selected' : '';
            }}
            onClick={() => handleSelect()}
          >
            <article
              className={`location__card `}
            >
              <h3>{location.name}</h3>
              <p>{location.description}</p>


            </article>
          </NavLink>
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
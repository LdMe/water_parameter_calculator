import { FaLocationDot, FaBell, FaSliders } from 'react-icons/fa6';
import ConfirmButton from "../generic/button/ConfirmButton";
import './LocationOptions.scss';

function LocationOptions({ location, onSubmit, onDelete, onCancel }) {
    function handleSubmit(e) {
        e.preventDefault();
        const name = e.target.name.value;
        onSubmit({ name, _id: location._id });
    }

    function handleDelete() {
        onDelete(location._id);
    }

    return (
        <div className="location-options">
            <h2>Opciones de ubicación</h2>

            <section className="location-options__section">
                <div className="location-options__section-title">
                    <FaLocationDot />
                    <span>Información básica</span>
                </div>
                <form className="location-options__form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Nombre de la ubicación</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={location.name}
                        placeholder="Introduce un nombre para la ubicación"
                    />
                    <button type="submit">Guardar cambios</button>
                </form>
            </section>

            <section className="location-options__section">
                <div className="location-options__section-title">
                    <FaBell />
                    <span>Alertas</span>
                </div>
                <div className="location-options__future-section">
                    Próximamente podrás configurar alertas personalizadas para esta ubicación
                </div>
            </section>

            <section className="location-options__section">
                <div className="location-options__section-title">
                    <FaSliders />
                    <span>Rangos de parámetros</span>
                </div>
                <div className="location-options__future-section">
                    Próximamente podrás establecer rangos personalizados para cada parámetro
                </div>
            </section>

            <section className="location-options__danger-zone">
                <ConfirmButton
                    text="Eliminar ubicación"
                    onConfirm={handleDelete}
                >
                    ¿Estás seguro de que quieres eliminar esta ubicación?
                    Esta acción no se puede deshacer y se perderán todas las mediciones asociadas.
                </ConfirmButton>
            </section>

            <section className="location-options__cancel">
                <button type="button" onClick={onCancel}>
                    Volver
                </button>
            </section>
        </div>
    );
}

export default LocationOptions;
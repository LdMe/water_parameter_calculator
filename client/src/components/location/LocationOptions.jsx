


function LocationOptions({location,onSubmit,onDelete}) {
    function handleSubmit(e) {
        e.preventDefault();
        const name = e.target.name.value;
        onSubmit({name,_id:location._id});
    }
    function handleDelete() {
        onDelete(location._id);
    }
    return (
        <div>
            <h2>Opciones de ubicación</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" name="name" defaultValue={location.name}  />
                <button type="submit">Guardar</button>
            </form>

            <button type="button" onClick={handleDelete}>Borrar</button>
        </div>
    )
}

export default LocationOptions
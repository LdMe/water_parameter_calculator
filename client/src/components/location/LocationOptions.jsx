


function LocationOptions({location,onSubmit}) {
    function handleSubmit(e) {
        e.preventDefault();
        const name = e.target.name.value;
        onSubmit({name,_id:location._id});
    }
    return (
        <div>
            <h2>Opciones de ubicación</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" name="name" defaultValue={location.name}  />
                <button type="submit">Guardar</button>
            </form>
        </div>
    )
}

export default LocationOptions
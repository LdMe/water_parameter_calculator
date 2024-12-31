

function parameterNameChooser ({value,onChange}) {

    return (
        <section className="parameter-name-chooser">
            <form action="" className="parameter-name-chooser__form" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="name">Nombre del parámetro</label>
                <input type="text" name="name" id="name"  value={value} onChange={(e)=>onChange(e.target.value)}/>
            </form>
        </section>
    )
}

export default parameterNameChooser
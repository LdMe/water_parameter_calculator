import '../styles/HorizontalSelector.scss'

const HorizontalSelector = ({ values,selectedValue,onClick, colorScale="" }) => {
    return(
        <section className="horizontalSelectorOuter">
            <section className="horizontalSelector">
              {values && values.map(value => {
                console.log(value,selectedValue)
                if (selectedValue === value) {
                  return <article key={value}><button className={"selected " + colorScale} onClick={() => onClick(value)}>{value}</button></article>
                }
                return <article key={value}><button className={colorScale} onClick={() => onClick(value)}>{value}</button></article>
              }
              )}
            </section>
          </section>
    );
}

export default HorizontalSelector;
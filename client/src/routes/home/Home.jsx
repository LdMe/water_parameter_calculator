import { useState, useEffect } from "react";
import { FaCamera, FaChartLine, FaDroplet } from "react-icons/fa6";

import './Home.scss';
import { Link } from "react-router-dom";

const sections = [
    {
        icon: FaCamera,
        title: "Medición por Color",
        description: "Analiza tus parámetros con una simple foto",
    },
    {
        icon: FaDroplet,
        title: "Parámetros personalizados",
        description: "Crea tus parámetros personalizados ",
    },
    {
        icon: FaChartLine,
        title: "Seguimiento",
        description: "Seguimiento de tus parámetros"
    }
]
function Home() {

    return (
        <section className="home__page">
            <header>
                <section className="title">
                    <img className="title-image" src="/hydromnis.png" alg="logo" /><h1> HydrOmnis</h1>
                </section>
                <section className="readme-title">
                    <p>Mediciones precisas para tu acuario</p>
                </section>
            </header>
            <main>

                <section className="sections__list">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <article className="section__card" key={section.title}>
                                <section className="section__title">
                                    <section className="section__icon">
                                        <Icon />
                                    </section>
                                    <h3>{section.title}</h3>
                                </section>
                                <p>{section.description}</p>

                            </article>
                        )
                    }
                    )}
                </section>
                <section className="register-section">
                    <Link to="/login"><button>Iniciar Sesión</button></Link>
                    <Link to="/register"><button>Registrarse</button></Link>
                    
                    
                </section>

            </main>

        </section>
    )
}

export default Home;
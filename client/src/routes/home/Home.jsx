import { FaCamera, FaChartLine, FaDroplet, FaFlask, FaLeaf, FaWater } from "react-icons/fa6";
import './Home.scss';
import { Link } from "react-router-dom";

// Secciones principales que describen las características clave
const features = [
    {
        icon: FaCamera,
        title: "Medición por Color",
        description: "Analiza tus parámetros con una simple foto. Obtén resultados precisos al instante capturando el color de tus tiras reactivas.",
    },
    {
        icon: FaDroplet,
        title: "Parámetros Personalizados",
        description: "Crea y personaliza tus propios parámetros. Define rangos y valores específicos para tus necesidades particulares.",
    },
    {
        icon: FaChartLine,
        title: "Seguimiento Detallado",
        description: "Mantén un registro histórico completo de tus mediciones y visualiza tendencias a lo largo del tiempo.",
    }
];

// Casos de uso principales de la aplicación
const useCases = [
    {
        icon: FaWater,
        title: "Acuarios",
        description: "Ideal para monitorear pH, nitritos, nitratos y otros parámetros esenciales."
    },
    {
        icon: FaFlask,
        title: "Piscifactorías",
        description: "Control profesional de la calidad del agua en instalaciones acuícolas."
    },
    {
        icon: FaLeaf,
        title: "Agricultura",
        description: "Seguimiento de nutrientes y parámetros del agua para cultivos."
    }
];

function Home() {
    return (
        <div className="home__page">
            {/* Encabezado con logo y título principal */}
            <header className="home__header">
                <img className="banner__image" src="/banner.png" alt="Banner Image" />
                <section className="title">
                    <img className="title-image" src="/hydromnis.png" alt="HydrOmnis Logo" />
                    <h1>HydrOmnis</h1>
                </section>
                
                <section className="hero__content">
                    <h2>Mediciones precisas al alcance de tu mano</h2>
                    <p className="hero__description">
                        Transforma el análisis del agua en un proceso simple y preciso. 
                        Ideal para acuarios, piscifactorías y agricultura.
                    </p>
                </section>
            </header>

            <main>
                {/* Sección de características principales */}
                <section className="features__section">
                    <h2>Características Principales</h2>
                    <div className="features__list">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <article className="feature__card" key={feature.title}>
                                    <section className="feature__header">
                                        <div className="feature__icon">
                                            <Icon />
                                        </div>
                                        <h3>{feature.title}</h3>
                                    </section>
                                    <p>{feature.description}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Sección de casos de uso */}
                <section className="use-cases__section">
                    <h2>Aplicaciones</h2>
                    <div className="use-cases__list">
                        {useCases.map((useCase) => {
                            const Icon = useCase.icon;
                            return (
                                <article className="use-case__card" key={useCase.title}>
                                    <div className="use-case__icon">
                                        <Icon />
                                    </div>
                                    <h3>{useCase.title}</h3>
                                    <p>{useCase.description}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Sección de registro/inicio de sesión */}
                <section className="register-section">
                    <h2>Comienza a medir con precisión</h2>
                    <div className="register-section__buttons">
                        <Link to="/register">
                            <button className="register-button">Crear cuenta gratuita</button>
                        </Link>
                        <Link to="/login">
                            <button className="login-button">Iniciar Sesión</button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
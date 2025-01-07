import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Onboarding.scss';

const OnboardingGuide = () => {
    //const [hasSeenGuide, setHasSeenGuide] = useLocalStorage('has-seen-guide', false);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Bienvenido a HydrOmnis",
            description: "Mide parámetros de agua con precisión usando fotografías",
            icon: "🌊"
        },
        {
            title: "Configura tus Parámetros",
            description: "Primero, configura los parámetros que quieres medir como pH o nitritos",
            icon: "⚙️"
        },
        {
            title: "Calibra los Colores",
            description: "Toma fotos de tus tiras de prueba para cada nivel del parámetro",
            icon: "🎨"
        },
        {
            title: "Realiza Mediciones",
            description: "¡Listo! Ahora puedes medir tus parámetros tomando fotos",
            icon: "📸"
        }
    ];

    //if (hasSeenGuide) return null;

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-modal">
                <div className="onboarding-content">
                    <span className="onboarding-icon">{steps[currentStep].icon}</span>
                    <h2 className="onboarding-title">{steps[currentStep].title}</h2>
                    <p className="onboarding-description">{steps[currentStep].description}</p>
                </div>

                <div className="onboarding-controls">
                    <button
                        onClick={() => currentStep > 0 && setCurrentStep(c => c - 1)}
                        className="onboarding-button secondary"
                        disabled={currentStep === 0}
                    >
                        Anterior
                    </button>

                    {currentStep < steps.length - 1 ? (
                        <button
                            onClick={() => setCurrentStep(c => c + 1)}
                            className="onboarding-button primary"
                        >
                            Siguiente
                        </button>
                    ) : (
                        <Link to="/">
                            <button
                                className="onboarding-button success"
                            >
                                ¡Empezar!
                            </button>

                        </Link>
                    )}
                </div>

                <div className="onboarding-progress">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`progress-dot ${idx === currentStep ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnboardingGuide;
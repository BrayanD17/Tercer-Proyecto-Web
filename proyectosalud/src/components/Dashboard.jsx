import React from "react";
import "../styles/Dashboard.css"
import Scorecard from "./Scorecard";
import GlassChart from "./GlassChart";
import StepsChart from "./StepChart";
import BarChart from "./BarChart";
import ExerciseTable from "./Exercise";
import BMIChart from "./IMCChart";
import HeightChart from "./HeightChart";

const Dashboard =()=>{
    const exercisesData = [
        { name: "Correr", duration: 30 },
        { name: "Flexiones", duration: 15 },
        { name: "Sentadillas", duration: 20 },
    ];
    
    return(
        <div className="principal-container">
            <div className="izquierda">
                <div className="weights-container"> 
                    <div className="content">
                        <Scorecard peso={45} unit="kg" fillColor="#1E90FF" title="Peso" />
                    </div>
                </div>
                <div className="body-pat-percentaje-container">
                    <div className="content">
                        <Scorecard peso={15} unit="%" fillColor="#333" title="Grasa Corporal" />
                    </div>
                </div>
                <div className="daily-step-container">
                    <div className="content">
                        <StepsChart currentSteps={4500} goalSteps={6000}/>
                    </div>
                </div> 
                <div className="body-composition-container">
                    <BarChart
                            title="Composición Corporal"
                            data={[20, 30, 50]} // Ejemplo de datos: grasa, músculo, agua
                            categories={['Grasa', 'Músculo', 'Agua']}
                    />
                </div>
                <div className="exercise-container">
                    <ExerciseTable exercises={exercisesData} />
                </div>
            </div>
            <div className="derecha">
                <div className="heights-container">
                    <HeightChart altura={157} />
                </div>  
                <div className="IMC-conteiner">
                    <BMIChart peso={45} altura={1.57} />
                </div>
                <div className="water-consumption-container"> 
                    <GlassChart value={5} max={10}/>
                </div> 
            </div>
        </div>
    );

}

export default Dashboard;

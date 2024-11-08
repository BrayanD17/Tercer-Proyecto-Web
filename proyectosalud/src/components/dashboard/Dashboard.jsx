import React, { useContext, useEffect, useState } from "react";
import '../../styles/Dashboard.css';
import Scorecard from "../graphics/Scorecard";
import GlassChart from "../graphics/GlassChart";
import StepsChart from "../graphics/StepChart";
import BarChart from "../graphics/BarChart";
import ExerciseTable from "./Exercise";
import IMCChart from "../graphics/IMCChart";
import HeightChart from "../graphics/HeightChart";
import DataHistory from "./DataHistorySection";
import { AuthContext } from "../../context/AuthContext";

const Dashboard =()=>{
    const { getUserData } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserData();
            if (data) {
                setUserData(data);
            }
        };
        fetchData();
    }, [getUserData]);

    if (!userData) {
        return <div>Cargando datos...</div>;
    }
    
    return(
        <div className="principal-container">
            <div className="vista-general">
                <div className="izquierda">
                    <div className="weights-container"> 
                        <div className="content">
                            <Scorecard peso={userData.weight} unit="kg" fillColor="#1E90FF" title="Peso" />
                        </div>
                    </div>
                    <div className="body-pat-percentaje-container">
                        <div className="content">
                            <Scorecard peso={userData?.body_fat_percentage || 0} unit="%" fillColor="#333" title="Grasa Corporal" />
                        </div>
                    </div>
                    <div className="daily-step-container">
                        <div className="content">
                            <StepsChart currentSteps={userData?.daily_steps||0} goalSteps={10000}/>
                        </div>
                    </div> 
                    <div className="body-composition-container">
                         <BarChart
                            title="Composición Corporal"
                            data={[
                                userData.body_composition.fat || 0, 
                                userData.body_composition.muscle || 0, 
                                userData.body_composition.water || 0
                            ]}
                            categories={[
                                userData.body_composition.fat !== null ? 'Grasa' : 'Sin datos', 
                                userData.body_composition.muscle !== null ? 'Músculo' : 'Sin datos', 
                                userData.body_composition.water !== null ? 'Agua' : 'Sin datos'
                            ]}
                        />
                    </div>
                    <div className="exercise-container">
                        <ExerciseTable exercises={userData.exercises} /> 
                    </div>
                </div>
                <div className="derecha">
                    <div className="heights-container">
                        <HeightChart altura={userData.height} />
                    </div>  
                    <div className="IMC-conteiner">
                        <IMCChart peso={userData.weight} altura={userData.height} />
                    </div>
                    <div className="water-consumption-container"> 
                        <GlassChart value={userData.water_consumption} max={12}/>
                    </div> 
                </div>
            </div>
            <div className="vista-historicos">
                <DataHistory></DataHistory>
            </div>
            
        </div>
    );

}

export default Dashboard;

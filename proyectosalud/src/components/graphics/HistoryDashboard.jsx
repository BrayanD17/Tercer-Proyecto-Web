import React from 'react';
import ExerciseHistory from './ExerciseHistory';
import WaterHistory from './WaterHistory';
import WeightHistory from './WeightHistory';
import MuscleHistory from './MuscleHistory';
import BodyFatHistory from './BodyFatHistory';

const HistoryDashboard = ({ tipoDato, periodo, data, totalVasos, totalLitros, totalExercises, totalDuration }) => {
  switch (tipoDato) {
    case 'ejercicio':
      return <ExerciseHistory data={data} totalExercises={totalExercises} totalDuration={totalDuration} />;
    case 'agua':
      return <WaterHistory data={data} totalVasos={totalVasos} totalLitros={totalLitros} />;
    case 'peso':
      return <WeightHistory data={data} />;
    case 'musculo':
      return <MuscleHistory data={data} />;
    case 'grasa':
      return <BodyFatHistory data={data} />;
    default:
      return <p>Tipo de dato no soportado</p>;
  }
};

export default HistoryDashboard;

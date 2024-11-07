import React from "react";
import "../../styles/ExerciseTable.css"
const ExerciseTable = ({ exercises }) => {
    return (
        <div className="exercise-table">
            <h5>Lista de Ejercicios y Duración</h5>
            <table>
                <thead>
                    <tr>
                        <th>Nombre del Ejercicio</th>
                        <th>Duración (min)</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise, index) => (
                        <tr key={index}>
                            <td>{exercise.name}</td>
                            <td>{exercise.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ExerciseTable;
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const BodyFatHistory = ({ data }) => (
  <div>
    <h2>Histórico de Porcentaje de Grasa Corporal</h2>

    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis dataKey="value" />
        <Tooltip />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default BodyFatHistory;

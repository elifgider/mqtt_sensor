import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

const SensorChart = ({ data }) => {
  return (
    <div>
      <h5 className="text-center">📈 Anlık Sensör Grafiği</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="_time"
            tickFormatter={(value) =>
              new Date(value).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) =>
              new Date(value).toLocaleTimeString('tr-TR')
            }
          />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Sıcaklık (°C)" dot={false} />
          <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Nem (%)" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
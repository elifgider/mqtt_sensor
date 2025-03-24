import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner } from 'react-bootstrap';
import { io } from 'socket.io-client';
import SensorChart from '../components/SensorChart';
import axios from 'axios';

const Dashboard = () => {
  const [sensorRows, setSensorRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // İlk veriyi al
    axios.get('http://localhost:3001/sensors/sensor123')
      .then((res) => {
        const raw = res.data.data;
        const grouped = groupSensorData(raw);
        setSensorRows(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Veri alınamadı', err);
        setLoading(false);
      });

    // WebSocket bağlantısı
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('🔌 WebSocket bağlandı!');
    });

    socket.on('sensorData', (data) => {
        console.log('📡 Yeni veri geldi:', data);
      
        setSensorRows((prev) => {
          const now = new Date().toISOString();
      
          const updatedRows = prev.map((item) => {
            if (item._time === now) {
              return {
                ...item,
                ...data,
                _time: now,
              };
            }
            return item;
          });
      
          const isExisting = updatedRows.some((item) => item._time === now);
      
          if (!isExisting) {
            updatedRows.unshift({
              _time: now,
              sensor_id: data.sensor_id,
              temperature: data.temperature,
              humidity: data.humidity,
            });
          }
      
          return updatedRows.slice(0, 30);
        });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const groupSensorData = (rawData) => {
    const grouped = rawData.reduce((acc, curr) => {
      const time = curr._time;
      let record = acc.find(item => item._time === time);

      if (record) {
        record[curr._field] = curr._value;
      } else {
        acc.push({
          _time: time,
          sensor_id: curr.sensor_id,
          [curr._field]: curr._value,
        });
      }

      return acc;
    }, []);

    grouped.sort((a, b) => new Date(b._time) - new Date(a._time));
    return grouped;
  };

  return (
    <Container className="mt-5">
    <h2 className="mb-4 text-center">📡 Sensör Verileri</h2>
  
    {loading ? (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Veriler yükleniyor...</p>
      </div>
    ) : (
        
      <>

        {/* Grafik buraya eklendi */}
        
        <SensorChart data={[...sensorRows].sort((a, b) => new Date(a._time) - new Date(b._time))} />
        <div style={{ marginBottom: '40px' }} />
        {/* Tablo kısmı */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Zaman</th>
              <th>Sensör ID</th>
              <th>Sıcaklık (°C)</th>
              <th>Nem (%)</th>
            </tr>
          </thead>
          <tbody>
            {sensorRows.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item._time).toLocaleString('tr-TR')}</td>
                <td>{item.sensor_id}</td>
                <td>{item.temperature ?? '-'}</td>
                <td>{item.humidity ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )}
  </Container>
  );
};

export default Dashboard;
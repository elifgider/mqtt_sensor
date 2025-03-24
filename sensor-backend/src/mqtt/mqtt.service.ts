import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { SensorGateway } from '../sensors/sensor.gateway'; 
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private influxWriteApi;

  constructor(private readonly sensorGateway: SensorGateway) {}

  onModuleInit() {
    const broker = process.env.BROKER || 'mqtt://mqtt-broker';
    const topic = process.env.TOPIC || 'office/sensor';

    this.client = mqtt.connect(broker);

    this.client.on('connect', () => {
      console.log(` MQTT Broker'a bağlanıldı: ${broker}`);
      this.client.subscribe(topic, (err) => {
        if (!err) {
          console.log(` "${topic}" konusuna abone olundu`);
        } else {
          console.error('Abonelik hatası:', err);
        }
      });
    });

    const influx = new InfluxDB({
      url: process.env.INFLUXDB_URL!,
      token: process.env.INFLUXDB_TOKEN!,
    });

    this.influxWriteApi = influx.getWriteApi(
      process.env.INFLUXDB_ORG!,
      process.env.INFLUXDB_BUCKET!,
      'ns',
    );

    this.client.on('message', async (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(' Gelen veri:', data);

        const point = new Point('sensor')
          .tag('sensor_id', data.sensor_id)
          .floatField('temperature', data.temperature)
          .floatField('humidity', data.humidity)
          .timestamp(new Date());

        this.influxWriteApi.writePoint(point);
        await this.influxWriteApi.flush();

        console.log('InfluxDB\'ye veri yazıldı');

        this.sensorGateway.sendSensorData(data);

      } catch (err) {
        console.error('Veri işleme hatası:', err);
      }
    });
  }
}
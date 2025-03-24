import { Controller, Get } from '@nestjs/common';
import { InfluxDB, FluxTableMetaData } from '@influxdata/influxdb-client';

@Controller('api/sensor-data')
export class AppController {
  private readonly influxDB: InfluxDB;
  private readonly queryApi;
  private readonly bucket: string;

  constructor() {
    const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
    const token = process.env.INFLUXDB_TOKEN || '';
    const org = process.env.INFLUXDB_ORG || '';
    this.bucket = process.env.INFLUXDB_BUCKET || '';

    if (!url || !token || !org || !this.bucket) {
      throw new Error('InfluxDB ortam değişkenleri eksik.');
    }

    this.influxDB = new InfluxDB({ url, token });
    this.queryApi = this.influxDB.getQueryApi(org);
  }

  @Get()
  async getSensorData() {
    const fluxQuery = `
      from(bucket: "${this.bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "sensor")
        |> yield(name: "sensor_data")
    `;

    const data: any[] = [];

    return new Promise((resolve, reject) => {
      this.queryApi.queryRows(fluxQuery, {
        next: (row, tableMeta: FluxTableMetaData) => {
          const sensor = tableMeta.toObject(row);
          data.push(sensor);
        },
        complete: () => {
          console.log("nfluxDB'den gelen veri sayısı:", data.length);
          resolve(data);
        },
        error: (error) => {
          console.error('InfluxDB sorgu hatası:', error);
          reject(error);
        },
      });
    });
  }
}
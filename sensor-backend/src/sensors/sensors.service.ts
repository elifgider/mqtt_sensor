import { Injectable } from '@nestjs/common';
import { InfluxDB } from '@influxdata/influxdb-client';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class SensorsService {
  private influxDB: InfluxDB;
  private queryApi;

  constructor() {
    this.influxDB = new InfluxDB({
        url: process.env.INFLUXDB_URL as string,
        token: process.env.INFLUXDB_TOKEN as string,
    });
console.error("INFLUXDB_URL:",process.env.INFLUXDB_URL)
console.error("INFLUXDB_TOKEN:",process.env.INFLUXDB_TOKEN)

    this.queryApi = this.influxDB.getQueryApi(process.env.INFLUXDB_ORG as string);
  }

  async getSensorData(sensorId: string, duration: string = '1h') {
    const fluxQuery = `
      from(bucket:"${process.env.INFLUXDB_BUCKET}")
        |> range(start: -${duration})
        |> filter(fn: (r) => r._measurement == "sensor" and r.sensor_id == "${sensorId}")
        |> yield(name: "sensor_data")
    `;

    const data: any[] = [];
    return new Promise((resolve, reject) => {
      this.queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          data.push(o);
        },
        error(error) {
          console.error('InfluxDB hata:', error);
          reject(error);
        },
        complete() {
            console.log("InfluxDB'den gelen veri:", data);
            resolve(data);
          },
      });
    });
  }
}
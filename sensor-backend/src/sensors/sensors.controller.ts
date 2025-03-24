import { Controller, Get, Param } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { Public } from '../auth/public.decorator';
// import { SensorGateway } from './sensor.gateway'; 

@Public()
@Controller('sensors')
export class SensorsController {
  constructor(
    private readonly sensorsService: SensorsService,
    // private readonly sensorGateway: SensorGateway
  ) {}

  @Get(':id')
  async getSensorData(@Param('id') id: string) {
    const data = await this.sensorsService.getSensorData(id);
    return { data };
  }

  //  WebSocket veri gönderimi testi
//   @Get('test/ws')
//   sendTestDataOverWebSocket() {
//     const testData = {
//       sensor_id: 'sensor123',
//       temperature: 24.7,
//       humidity: 51.3,
//       timestamp: new Date().toISOString(),
//     };

//     this.sensorGateway.sendSensorData(testData);
//     return { message: 'WebSocket üzerinden veri gönderildi', testData };
//   }
}
import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { SensorGateway } from './sensor.gateway';

@Module({
  controllers: [SensorsController],
  providers: [SensorsService, SensorGateway],
  exports: [SensorsService, SensorGateway],   
})
export class SensorsModule {}
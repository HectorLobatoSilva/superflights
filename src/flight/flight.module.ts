import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FLIGHTMODEL } from 'src/common/models/models';
import { PassengerModule } from 'src/passenger/passenger.module';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { FlightSchema } from './schema/flight.schema';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: FLIGHTMODEL.name,
                useFactory: () =>
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    FlightSchema.plugin(require('mongoose-autopopulate')),
            },
        ]),
        PassengerModule,
    ],
    controllers: [FlightController],
    providers: [FlightService],
})
export class FlightModule {}

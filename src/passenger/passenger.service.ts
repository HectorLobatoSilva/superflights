import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPassenger } from 'src/common/interfaces/passenger.interface';
import { PASSENGERMODEL } from 'src/common/models/models';
import { PassengerDTO } from './dto/passenger.dto';

@Injectable()
export class PassengerService {
    constructor(
        @InjectModel(PASSENGERMODEL.name)
        private readonly model: Model<IPassenger>,
    ) {}
    async create(passengerDTO: PassengerDTO): Promise<PassengerDTO> {
        const passenger = new this.model({ ...passengerDTO });
        return await passenger.save();
    }

    async findAll(): Promise<PassengerDTO[]> {
        return await this.model.find();
    }

    async findById(id: string): Promise<PassengerDTO> {
        return await this.model.findById(id);
    }

    async update(
        id: string,
        passengerDTO: PassengerDTO,
    ): Promise<PassengerDTO> {
        return await this.model.findByIdAndUpdate(id, passengerDTO, {
            new: true,
        });
    }

    async delete(id: string) {
        await this.model.findByIdAndRemove(id);
        return { status: HttpStatus.OK, msg: `passenger ${id} deleted` };
    }
}

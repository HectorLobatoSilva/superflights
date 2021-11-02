import { HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { USERMODEL } from 'src/common/models/models';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(USERMODEL.name) private readonly model: Model<IUser>,
    ) {}
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    async create(userDTO: UserDTO): Promise<IUser> {
        const password = await this.hashPassword(userDTO.password);
        const newUser = new this.model({ ...userDTO, password });
        return await newUser.save();
    }

    async findAll(): Promise<IUser[]> {
        return await this.model.find();
    }

    async findByID(id: string): Promise<IUser> {
        return await this.model.findById(id);
    }

    async update(id: string, userDTO: UserDTO): Promise<IUser> {
        const password = await this.hashPassword(userDTO.password);
        const user = { ...userDTO, password };
        return await this.model.findByIdAndUpdate(id, user, { new: true });
    }

    async delete(id: string) {
        await this.model.findByIdAndRemove(id);
        return { status: HttpStatus.OK, msg: `user ${id} deleted` };
    }

    async findByUsername(username: string) {
        return await this.model.findOne({ username });
    }

    async checkPassword(
        password: string,
        passwordDB: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, passwordDB);
    }
}

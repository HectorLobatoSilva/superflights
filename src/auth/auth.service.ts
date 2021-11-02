import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDTO } from 'src/user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const isValidPassword = await this.userService.checkPassword(
            password,
            user.password,
        );
        if (user && isValidPassword) return user;
        return null;
    }

    async signIn(user: any) {
        const payload = {
            username: user.username,
            sub: user._id,
        };
        return {
            acces_token: this.jwtService.sign(payload),
        };
    }

    async signUp(userDTO: UserDTO) {
        return this.userService.create(userDTO);
    }
}

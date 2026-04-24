import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByLogin(login);
      const isValid = await this.usersService.validatePassword(user, password);
      
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, login: user.login, role: user.role.name };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        login: user.login,
        lastName: user.lastName,
        firstName: user.firstName,
        role: user.role,
      },
    };
  }
}
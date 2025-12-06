import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validar que el usuario existe y que la contraseña coincide
  async validateUser(email: string, password: string) {
    const user: any = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Por ahora comparamos en texto plano (después metemos bcrypt)
    const passwordOk = user.password === password;

    if (!passwordOk) {
      return null;
    }

    // Convertir a objeto normal y quitar el password
    const cleanUser =
      typeof user.toObject === 'function' ? user.toObject() : { ...user };

    delete cleanUser.password;

    return cleanUser;
  }

  // Generar el JWT para el usuario autenticado
  async login(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user,
    };
  }
}

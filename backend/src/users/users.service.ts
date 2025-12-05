import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'; //  NUEVO
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //  Este método se usa cuando hacemos POST /users
  async create(email: string, password: string, name?: string) {
    // 1. Definimos cuántas vueltas de encriptación usar
    const saltRounds = 10;

    // 2. Encriptamos el password que llega del cliente
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Creamos el documento de Mongo usando el password encriptado
    const createdUser = new this.userModel({
      email,
      password: hashedPassword, // AQUÍ ya no guardamos el texto plano
      name,
    });

    // 4. Guardamos en la BD y regresamos el usuario
    return createdUser.save();
  }

  async findAll() {
    // Devuelve todos los usuarios
    return this.userModel.find().lean();
  }

  async findByEmail(email: string) {
    // Lo usaremos más adelante para el login
    return this.userModel.findOne({ email }).exec();
  }
}

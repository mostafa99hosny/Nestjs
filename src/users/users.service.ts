import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user/user';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { email, password, fullName, age, mobileNumber, role } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashedPassword,
      fullName,
      age,
      mobileNumber,
      role: role || UserRole.Normal,
    });
    await user.save();
    const payload = { email: user.email, sub: user._id, role: user.role };
    return { token: this.jwtService.sign(payload) };
  }

  async signIn(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user._id, role: user.role };
    return { token: this.jwtService.sign(payload) };
  }

  async getProfile(userId: string): Promise<User> {
    return this.userModel.findById(userId).select('-password');
  }

  async getAllUsers(userId: string, role: UserRole): Promise<User[]> {
    if (role !== UserRole.Admin) {
      throw new UnauthorizedException('Only admins can view all users');
    }
    return this.userModel.find({ _id: { $ne: userId } }).select('-password');
  }
}
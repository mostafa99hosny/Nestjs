import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsString, MinLength, Matches, Min, Max, Length } from 'class-validator';

export enum UserRole {
  Admin = 'admin',
  Normal = 'normal',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, { message: 'Password must be alphanumeric' })
  password: string;

  @Prop({ required: true })
  @IsString()
  fullName: string;

  @Prop({ required: true })
  @Min(16)
  @Max(60)
  age: number;

  @Prop({ required: true })
  @Length(11)
  @Matches(/^01/, { message: 'Mobile number must start with 01' })
  mobileNumber: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.Normal })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
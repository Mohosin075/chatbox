import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

type IAuthenticationProps ={
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
}

export type IUser = {
    name: string;
    role: USER_ROLES;
    phone?: string;
    email: string;
    password: string;
    countryCode?: string;
    image: string;
    verified: boolean;
    subscribe: boolean;
    isDeleted: boolean;
    fcmToken?: string;
    authentication?: IAuthenticationProps;
}

export type UserModal = {
    isExistUserById(id: string): any;
    isExistUserByEmail(email: string): any;
    isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
import { Model, Types } from 'mongoose';

export type ISubscription = {
    _id?:string;
    userId: string;
    price: number;
    provider: Types.ObjectId;
    plan: Types.ObjectId;
    trxId: string;
    subscriptionId: string;
    status: 'expired' | 'active' | 'cancel';
    currentPeriodStart: string;
    currentPeriodEnd: string;
};

export type SubscriptionModel = Model<ISubscription, Record<string, unknown>>;
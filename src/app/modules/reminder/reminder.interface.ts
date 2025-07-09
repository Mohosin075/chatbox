import { Model, Types } from 'mongoose';

export type IReminder = {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    image: string;
    date: string;
    time: string;
    status: "Pending" | "Completed";
};

export type ReminderModel = Model<IReminder>;
import { Model, Types } from 'mongoose';

export type IChecklist = {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    title: string;
    date: string;
    reminder: string;
    status: "Pending" | "Completed";
};

export type ChecklistModel = Model<IChecklist>;
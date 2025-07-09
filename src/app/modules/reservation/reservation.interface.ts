import { Model, Types } from "mongoose"
import { RESERVATION } from "../../../enums/service";

export type IReservation = {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    provider: Types.ObjectId;
    service: Types.ObjectId;
    status: RESERVATION;
    guest: number;
    date: String;
    price: number;
    txid: string;
}

export type ReservationModel = Model<IReservation, Record<string, unknown>>;
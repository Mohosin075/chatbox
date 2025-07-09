import { JwtPayload } from "jsonwebtoken";
import { IReservation } from "./reservation.interface";
import { Reservation } from "./reservation.model";
import { StatusCodes } from "http-status-codes";
import mongoose, { FilterQuery } from "mongoose";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { checkMongooseIDValidation } from "../../../shared/checkMongooseIDValidation";
import ApiError from "../../../errors/ApiError";
import QueryBuilder from "../../builder/QueryBuilder";
import { Service } from "../services/services.model";

const createReservationToDB = async (payload: IReservation): Promise<IReservation> => {

    const session = await mongoose.startSession();
    session.startTransaction();

    checkMongooseIDValidation(payload.service as any)

    const isExistService = await Service.findById(payload.service).lean();
    if (!isExistService) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Service not found');
    }

    payload.price = isExistService.price;
    payload.provider = isExistService.provider;

    try {



        const reservation = (await Reservation.create([payload], { session }))[0];
        if (!reservation) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created Reservation ');
        }

        const data = {
            text: "Someone has submitted a reservation" as string,
            receiver: isExistService.provider as mongoose.Types.ObjectId,
            referenceId: reservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();

        return reservation;

    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
};

const reservationsFromDB = async (user: JwtPayload, query: FilterQuery<any>): Promise<{ reservations: IReservation[], pagination: any, allStatus: any }> => {

    // Dynamically define the fields to populate
    const populateFields = [
        { path: "service" },
        { path: user.role === "PROVIDER" ? "user" : "provider", select: "name profile email countryCode phone" }
    ];

    const result = new QueryBuilder(Reservation.find({ $or: [{ provider: user?.id }, { user: user?.id }] }), query).paginate().filter();
    const reservations = await result.modelQuery.populate(populateFields).lean().exec();
    const pagination = await result.getPaginationInfo();

    // check how many reservation in each status
    const allStatus = await Promise.all(["Pending", "Accepted", "Rejected", "Canceled", "Completed"].map(
        async (status: any) => {

            const count = await Reservation.countDocuments({
                $or: [{ provider: user?.id }, { user: user?.id }],
                status: status
            });

            return {
                status,
                count
            }
        })
    );

    return { reservations, pagination, allStatus };
}

const reservationDetailsFromDB = async (id: string): Promise<IReservation> => {

    checkMongooseIDValidation(id as string)

    const reservation: IReservation | null = await Reservation.findById(id).populate("service").lean().exec();
    if (!reservation) throw new ApiError(StatusCodes.NOT_FOUND, 'Reservation not found');
    return reservation;
}

const approvedReservationInDB = async (id: string, status: string): Promise<IReservation> => {

    checkMongooseIDValidation(id as string)

    if (!status || !['Accepted', 'Rejected'].includes(status)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const isExistReservation = await Reservation.findById(id).lean();
    if (!isExistReservation) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Reservation not found');
    }

    try {

        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: id },
            { $set: { status: status } },
            { new: true, session }
        );

        if (!updatedReservation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update reservation');
        }

        const data = {
            text: "Your reservation has been " + status + "." as string,
            receiver: isExistReservation.user as mongoose.Types.ObjectId,
            referenceId: isExistReservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();
        return updatedReservation;
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
}


const cancelReservationInDB = async (id: string, user: JwtPayload): Promise<IReservation> => {

    checkMongooseIDValidation(id as string)

    const session = await mongoose.startSession();
    session.startTransaction();

    const isExistReservation = await Reservation.findOne(
        {
            _id: id,
            user: user.id
        }).lean().exec();

    if (!isExistReservation) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Reservation not found');
    }

    try {

        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: id, user: user.id },
            { $set: { status: "Canceled" } },
            { new: true, session }
        );

        if (!updatedReservation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update reservation');
        }

        const data = {
            text: "Your reservation has been Canceled." as string,
            receiver: isExistReservation.provider as mongoose.Types.ObjectId,
            referenceId: isExistReservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();
        return updatedReservation;
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
}


const completeReservationInDB = async (id: string, user: JwtPayload): Promise<IReservation> => {

    checkMongooseIDValidation(id as string);

    const session = await mongoose.startSession();
    session.startTransaction();

    const isExistReservation = await Reservation.findOne(
        {
            _id: id,
            user: user.id
        }).lean().exec();

    if (!isExistReservation) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Reservation not found');
    }

    try {

        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: id, user: user.id },
            { $set: { status: "Completed" } },
            { new: true, session }
        );

        if (!updatedReservation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Failed to update reservation');
        }

        const data = {
            text: "Your reservation has been Completed." as string,
            receiver: isExistReservation.provider as mongoose.Types.ObjectId,
            referenceId: isExistReservation._id as mongoose.Types.ObjectId,
            screen: "RESERVATION" as const
        }
        await sendNotifications(data, session);

        await session.commitTransaction();
        session.endSession();
        return updatedReservation;
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to Process order');
    }
}

const reservationSummerFromDB = async (user: JwtPayload): Promise<{}> => {

    // total earnings
    const totalEarnings = await Reservation.aggregate([
        {
            $match: { provider: user.id }
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$price" }
            }
        }
    ]);

    // total earnings today
    const today = new Date();
    const todayEarnings = await Reservation.aggregate([
        {
            $match: { barber: user.id, createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) } }
        },
        {
            $group: {
                _id: null,
                todayEarnings: { $sum: "$price" }
            }
        }
    ]);

    // total reservations today
    const todayReservations = await Reservation.countDocuments(
        {
            provider: user.id,
            createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) }
        } as any);

    // total reservations
    const totalServiceCount = await Service.countDocuments({ provider: user.id } as any);

    const data = {
        earnings: {
            total: totalEarnings[0]?.totalEarnings || 0,
            today: todayEarnings[0]?.todayEarnings || 0,
        },
        services: {
            todayReservation: todayReservations,
            total: totalServiceCount
        }
    }

    return data;
}

export const ReservationService = {
    createReservationToDB,
    approvedReservationInDB,
    reservationDetailsFromDB,
    reservationsFromDB,
    reservationSummerFromDB,
    cancelReservationInDB,
    completeReservationInDB
}
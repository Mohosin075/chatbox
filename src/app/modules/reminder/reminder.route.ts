import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReminderZodValidationSchema } from './reminder.validation';
import { StatusCodes } from 'http-status-codes';
import { ReminderController } from './reminder.controller';
import { getSingleFilePath } from '../../../shared/getFilePath';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import ApiError from '../../../errors/ApiError';
const router = express.Router();

router.route('/')
    .post(
        fileUploadHandler(),
        auth(USER_ROLES.USER),
        async (req, res, next) => {
            try {
                const image = getSingleFilePath(req.files, "image");
                req.body = { ...req.body, customer: req.user.id, image };
                next();
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to processed Reminder');
            }
        },
        validateRequest(ReminderZodValidationSchema),
        ReminderController.createReminder
    )
    .get(
        auth(USER_ROLES.USER),
        ReminderController.retrievedReminderFromDB
    )
    .patch(
        auth(USER_ROLES.USER),
        fileUploadHandler(),
        async (req, res, next) => {
            try {
                const image = getSingleFilePath(req.files, "image");
                req.body = { ...req.body, customer: req.user.id, image };
                next();
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to processed Reminder');
            }
        },
        validateRequest(ReminderZodValidationSchema),
        ReminderController.updateReminder
    );

export const ReminderRoutes = router;
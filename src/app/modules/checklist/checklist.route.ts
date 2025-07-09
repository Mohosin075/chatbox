import express from 'express';
import { ChecklistController } from './checklist.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ChecklistZodSchemaValidation } from './checklist.validation';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
const router = express.Router();

router.route('/')
    .post(
        auth(USER_ROLES.USER),
        async (req, res, next) => {
            try {
                req.body = { ...req.body, user: req.user.id };
                next();
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to processed checklist');
            }
        },
        validateRequest(ChecklistZodSchemaValidation),
        ChecklistController.createChecklist
    )
    .get(
        auth(USER_ROLES.USER),
        ChecklistController.retrievedChecklist
    )
    .patch(
        auth(USER_ROLES.USER),
        ChecklistController.completeChecklist
    );

export const ChecklistRoutes = router;
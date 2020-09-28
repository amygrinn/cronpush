import { Router } from 'express';
import createSchedule from './create-schedule';
import deleteSchedule from './delete-schedule';
import getSchedules from './get-schedules';
import patchSchedule from './patch-schedule';

const schedulesRouter = Router();

schedulesRouter.get('/', getSchedules);
schedulesRouter.post('/', createSchedule);
schedulesRouter.patch('/:scheduleId', patchSchedule);
schedulesRouter.delete('/:scheduleId', deleteSchedule);

export default schedulesRouter;

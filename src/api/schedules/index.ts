import { Router } from 'express';

import getSchedules from './get-schedules';
import createSchedule from './create-schedule';
import patchSchedule from './patch-schedule';
import deleteSchedule from './delete-schedule';

const schedulesRouter = Router();

schedulesRouter.get('/', getSchedules);
schedulesRouter.post('/', createSchedule);
schedulesRouter.patch('/:scheduleId', patchSchedule);
schedulesRouter.delete('/:scheduleId', deleteSchedule);

export default schedulesRouter;

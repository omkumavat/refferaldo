import express from 'express';
const router = express.Router();

import {authMiddleware} from '../middleware/authMiddleware.js';
import {requireRole} from '../middleware/roleMiddleware.js';
import {requireCompanyAccess} from '../middleware/companyAccessMiddleware.js';
import {getCompanyJobs} from '../controllers/companyController.js';

import {body,param} from 'express-validator';
import v from '../middleware/validationMiddleware.js';

router.get('/get-jobs',  getCompanyJobs)
// const companyFields = [body('name').optional().trim().isLength({
//     min: 2,
//     max: 150
// }), body('website').optional().isURL(), body('domain').optional().isLength({
//     min: 2,
//     max: 200
// })];
// router.get('/', c.list);
// router.get('/:id', param('id').isMongoId(), v, c.get);
// router.post('/', auth, role('company', 'admin'), [body('name').trim().isLength({
//     min: 2,
//     max: 150
// }), body('website').optional().isURL(), body('domain').optional().isLength({
//     min: 2,
//     max: 200
// })], v, c.create);
// router.put('/:id', auth, role('company', 'admin'), [param('id').isMongoId(), ...companyFields], v, access.requireCompanyAccess, c.update);
// router.delete('/:id', auth, role('company', 'admin'), param('id').isMongoId(), v, access.requireCompanyAccess, c.remove);
// router.post('/:id/verify', auth, role('admin'), [param('id').isMongoId(), body('status').isIn(['verified', 'rejected', 'pending'])], v, c.verify);
// router.get('/:id/employees', auth, param('id').isMongoId(), v, c.employees);
// router.post('/:id/employees', auth, role('company', 'admin'), [param('id').isMongoId(), body('userId').isMongoId(), body('designation').optional().isString(), body('department').optional().isString()], v, access.requireCompanyAccess, c.addEmployee);
// router.delete('/:id/employees/:userId', auth, role('company', 'admin'), [param('id').isMongoId(), param('userId').isMongoId()], v, access.requireCompanyAccess, c.removeEmployee);
// router.get('/:id/jobs', param('id').isMongoId(), v, c.jobs);
export default router;
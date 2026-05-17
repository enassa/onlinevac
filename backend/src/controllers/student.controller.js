import { createCrudController } from './crud.controller.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { studentService } from '../services/student.service.js';

const crudController = createCrudController(studentService, 'Student');

export const studentController = {
  ...crudController,

  async joinProgramme(request, response) {
    const student = await studentService.joinProgramme(request.params.id, request.body.programmeId);
    sendSuccess(response, student, 'Joined programme successfully');
  },
};

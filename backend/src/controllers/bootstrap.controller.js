import { bootstrapService } from '../services/bootstrap.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const bootstrapController = {
  async replaceAll(request, response) {
    const result = await bootstrapService.replaceAll(request.body);
    sendSuccess(response, result, 'Backend data bootstrapped');
  },
};

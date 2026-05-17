import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export function createCrudController(service, entityName) {
  return {
    async getAll(request, response) {
      const items = await service.getAll();
      sendSuccess(response, items, `${entityName} list retrieved`);
    },

    async getById(request, response) {
      const item = await service.getById(request.params.id);
      sendSuccess(response, item, `${entityName} retrieved`);
    },

    async create(request, response) {
      const item = await service.create(request.body);
      sendCreated(response, item, `${entityName} created`);
    },

    async update(request, response) {
      const item = await service.update(request.params.id, request.body);
      sendSuccess(response, item, `${entityName} updated`);
    },

    async delete(request, response) {
      const item = await service.delete(request.params.id);
      sendSuccess(response, item, `${entityName} deleted`);
    },
  };
}

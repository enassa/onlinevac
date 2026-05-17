import { normalizeDocument, normalizeDocuments } from '../utils/normalizeDocument.js';
import { createHttpError } from '../utils/createHttpError.js';

export function createCrudService(Model, entityName) {
  return {
    async getAll() {
      const documents = await Model.find().sort({ createdAt: 1 });
      return normalizeDocuments(documents);
    },

    async getById(id) {
      const document = await Model.findOne({ id });
      if (!document) throw createHttpError(404, `${entityName} not found`);
      return normalizeDocument(document);
    },

    async create(payload) {
      const document = await Model.create(payload);
      return normalizeDocument(document);
    },

    async update(id, payload) {
      const document = await Model.findOneAndUpdate({ id }, payload, { new: true, runValidators: true });
      if (!document) throw createHttpError(404, `${entityName} not found`);
      return normalizeDocument(document);
    },

    async delete(id) {
      const document = await Model.findOneAndDelete({ id });
      if (!document) throw createHttpError(404, `${entityName} not found`);
      return normalizeDocument(document);
    },

    async replaceAll(items) {
      await Model.deleteMany({});
      const documents = await Model.insertMany(items, { ordered: true });
      return normalizeDocuments(documents);
    },
  };
}

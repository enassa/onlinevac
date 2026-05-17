export function normalizeDocument(document) {
  if (!document) return null;
  const object = typeof document.toObject === 'function' ? document.toObject() : document;
  const { _id, __v, ...rest } = object;
  return rest;
}

export function normalizeDocuments(documents) {
  return documents.map((document) => normalizeDocument(document));
}

import type { RootState, AppDispatch } from '../app/store';

type StoreType = {
  getState: () => RootState;
  dispatch: AppDispatch;
};

let storeRef: StoreType | null = null;

export function setStoreRef(store: StoreType) {
  storeRef = store;
}

export function getStore(): StoreType {
  if (!storeRef) throw new Error('Store not initialized. Call setStoreRef first.');
  return storeRef;
}

export function getState(): RootState {
  return getStore().getState();
}

export function getDispatch(): AppDispatch {
  return getStore().dispatch;
}

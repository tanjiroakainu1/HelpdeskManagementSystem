/** Fired after every localStorage write via api.mutate / saveDb / resetDb */
type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeDbChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyDbChanged(): void {
  listeners.forEach((fn) => fn());
}

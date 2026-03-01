import { EventEmitter } from 'events';

// Global event emitter for real-time updates
const globalForEvents = global as unknown as { eventEmitter: EventEmitter };

export const eventEmitter = globalForEvents.eventEmitter ?? new EventEmitter();

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.eventEmitter = eventEmitter;
}

// Event types
export const EVENTS = {
  INCIDENT_CREATED: 'incident:created',
  INCIDENT_DELETED: 'incident:deleted',
  HELP_REQUEST_ACTIVATED: 'help:activated',
  HELP_REQUEST_DEACTIVATED: 'help:deactivated',
  HELP_OFFER_CREATED: 'offer:created',
  MESSAGE_SENT: 'message:sent',
  LOCATION_UPDATED: 'location:updated',
} as const;

// Helper to emit events
export function emitEvent(event: string, data: any) {
  eventEmitter.emit(event, data);
}

// Helper to subscribe to events
export function onEvent(event: string, callback: (data: any) => void) {
  eventEmitter.on(event, callback);
}

// Helper to unsubscribe
export function offEvent(event: string, callback: (data: any) => void) {
  eventEmitter.off(event, callback);
}

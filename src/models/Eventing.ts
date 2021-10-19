type Callback = () => void;

export class Eventing {
  events: { [key: string]: Callback[] } = {};

  on(eventName: string, callback: Callback): void {
    // ensures handler will return some array instead of undefined
    const handlers = this.events[eventName] || [];
    handlers.push(callback);
    this.events[eventName] = handlers;
  }

  trigger(eventName: string): void {
    const handlers = this.events[eventName];

    if (!handlers || this.events[eventName].length === 0) {
      // no event or the event doesn't have any callbacks
      return;
    }

    handlers.forEach((callback) => {
      callback();
    });
  }
}

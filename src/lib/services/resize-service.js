import { device } from "@/utils/detect";

const config = {
  resizeDebounceTime: 100,
};

let timeout;

class Service {
  listeners = [];

  onResize = (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(
      () => {
        this.listeners.forEach((listener) => listener(e));
      },
      device.mobile ? 500 : config.resizeDebounceTime, // some mobile browsers only update window dimensions when the rotate animation finishes
    );
  };

  listen = (listener) => {
    if (this.listeners.length === 0) {
      window.addEventListener("resize", this.onResize);

      if (device.mobile) {
        window.addEventListener("orientationchange", this.onResize);
      }
    }

    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  };

  dismiss = (listener) => {
    this.listeners = this.listeners.filter((l) => l !== listener);

    if (this.listeners.length === 0) {
      window.removeEventListener("resize", this.onResize);

      if (device.mobile) {
        window.removeEventListener("orientationchange", this.onResize);
      }
    }
  };
}

export const ResizeService = new Service();

import bowser from "bowser";

export const detector =
  typeof document !== "undefined"
    ? {
        ua: window.navigator.userAgent.toLowerCase(),
        base: bowser.getParser(window.navigator.userAgent),
        window,
        // https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
        isSpoofedIpad:
          (/iPad/.test(navigator.platform) ||
            (navigator.platform === "MacIntel" &&
              navigator.maxTouchPoints > 1)) &&
          !("MSStream" in window),
      }
    : {
        ua: "",
        base: {
          getOSName: () => "node",
          getOSVersion: () => "1",
          getBrowserName: () => "node",
          getBrowserVersion: () => "1",
          getPlatform: () => ({ type: "node", vendor: "node" }),
        },
        window: {
          devicePixelRatio: 1,
          innerWidth: 1440,
          innerHeight: 900,
          navigator: {
            vendor: "node",
            mediaDevices: null,
            maxTouchPoints: 0,
          },
          screen: {
            orientation: { type: "landscape-primary" },
          },
          matchMedia: null,
        },
        isSpoofedIpad: false,
      };

class OS {
  name;
  ios;
  android;
  windowsPhone;
  blackBerry;
  mac;
  windows;
  linux;
  chromeos;
  node;

  supportedBots = [
    "facebookexternalhit",
    "skypeuripreview",
    "baiduspider",
    "linkedinbot",
    "ia_archiver",
    "duckduckbot",
    "twitterbot",
    "googlebot",
    "yandexbot",
    "bingbot",
    "facebot",
    "tumblr",
    "slurp",
    "google (+https://developers.google.com/+/web/snippet/)",
    "https://developers.google.com/+/web/snippet/",
  ];
  /**
   * Initializes device and operating system properties based on detection logic.
   * @example
   * constructor()
   * // Sets internal properties based on the device's operating system.
   * @param {Object} detector - The detector object responsible for determining the operating system.
   * @returns {void} Initializes properties indicating the device's operating system.
   * @description
   *   - Determines the OS name using either a spoofed iPad detection or base OS detection.
   *   - Sets multiple boolean properties to indicate the specific detected operating system.
   *   - Handles common operating systems like iOS, Android, Windows, MacOS, and Linux.
   *   - Includes detection for platforms such as ChromeOS and Node.js.
   */
  constructor() {
    this.name = detector.isSpoofedIpad
      ? "ios"
      : detector.base.getOSName().toLowerCase();
    this.ios = this.name === "ios";
    this.android = this.name === "android";
    this.windowsPhone = this.name === "windows phone";
    this.blackBerry = this.name === "blackberry";
    this.mac = this.name === "macos";
    this.windows = this.name === "windows";
    this.linux = this.name === "linux";
    this.chromeos = this.name === "chrome os";
    this.node = this.name === "node";
  }
  get bot() {
    return this.supportedBots.some((bot) =>
      detector.ua.includes(bot.toLowerCase()),
    );
  }
  get version() {
    return detector.base.getOSVersion() || "0";
  }
  get majorVersion() {
    return parseInt(this.version.replace(/[^0-9.]/gi, ""), 10);
  }
}

class Browser {
  name;
  vendor;
  chrome;
  firefox;
  safari;
  edge;
  ie;
  opera;
  node;
  facebook;
  linkedIn;
  snapchat;
  whatsApp;
  twitter;
  weChat;
  tikTok;
  instagram;
  pinterest;
  inApp;

  /**
   * Initializes and determines the browser and application context from the user-agent.
   * @example
   * constructor()
   * Returns a browser information object with detected properties.
   * @param {none} This constructor does not take any parameters.
   * @returns {Object} An object with properties indicating the browser name, type, and whether the environment is an in-app browser.
   * @description
   *   - Relies on 'detector.ua' to identify the user-agent string to determine the browser context.
   *   - Identifies if the browser is 'microsoft-edge' using a specific workaround for user-agent string inconsistency.
   *   - Determines if the environment is an in-app browser based on regex pattern checks for popular social media apps.
   *   - Converts the browser vendor and name to lowercase for consistent property assignment.
   */
  constructor() {
    this.name = detector.ua.includes("edg/") // https://github.com/lancedikson/bowser/issues/416
      ? "microsoft-edge"
      : detector.base.getBrowserName().toLowerCase().replace(" ", "-");
    this.vendor = detector.window.navigator.vendor
      ? detector.window.navigator.vendor.toLowerCase()
      : "";
    this.chrome = this.name === "chrome";
    this.firefox = this.name === "firefox";
    this.safari = this.name === "safari";
    this.edge = this.name === "microsoft-edge";
    this.ie = this.name === "internet-explorer";
    this.opera = this.name === "opera";
    this.node = this.name === "node";
    this.instagram = /instagram/i.test(detector.ua);
    this.pinterest = /pinterest/i.test(detector.ua);
    this.facebook = /fban|fbav/i.test(detector.ua);
    this.linkedIn = /linkedin/i.test(detector.ua);
    this.snapchat = /snapchat/i.test(detector.ua);
    this.whatsApp = /whatsapp/i.test(detector.ua);
    this.twitter = /twitter/i.test(detector.ua);
    this.weChat = /wechat|micromessenger/i.test(detector.ua);
    this.tikTok = /musical_ly/i.test(detector.ua);
    this.inApp =
      this.instagram ||
      this.pinterest ||
      this.facebook ||
      this.linkedIn ||
      this.snapchat ||
      this.whatsApp ||
      this.twitter ||
      this.weChat ||
      this.tikTok;
  }
  get version() {
    return detector.base.getBrowserVersion() || "0";
  }
  get majorVersion() {
    return parseInt(this.version.replace(/[^0-9.]/gi, ""), 10);
  }
}

class Device {
  platform;
  type;
  model;
  phone;
  tablet;
  mobile;
  desktop;
  iphone;
  ipad;
  ipod;
  pixelRatio;
  node;
  browser;
  touch;
  hover;

  /**
   * Determines and stores the platform characteristics of the user's device.
   * @example
   * new onstructor()
   * // Returns an object with properties like type, model, phone, tablet, etc.
   * @param {none} No parameters are needed for initialization.
   * @returns {object} The device characteristics such as type, model, phone, tablet, etc.
   * @description
   *   - Detects if the device is a spoofed iPad and adjusts the platform details accordingly.
   *   - Utilizes the detector object to obtain detailed platform information.
   *   - Determines various device capabilities such as touch support and hovering ability.
   *   - Differentiates between node environment and browser environment.
   */
  constructor() {
    this.platform = detector.isSpoofedIpad
      ? { type: "tablet", vendor: "Apple", model: "iPad" }
      : detector.base.getPlatform();
    this.type = (this.platform.type || "").toLowerCase();
    this.model = (this.platform.model || "").toLowerCase();
    this.phone = this.type === "mobile";
    this.tablet = this.type === "tablet";
    this.mobile = this.phone || this.tablet;
    this.desktop = !this.mobile;
    this.iphone = this.model === "iphone";
    this.ipad = this.model === "ipad";
    this.ipod = this.model === "ipod";
    this.pixelRatio = detector.window.devicePixelRatio;
    this.node = this.type === "node";
    this.browser = !this.node;
    this.touch =
      "ontouchstart" in detector.window ||
      detector.window.navigator.maxTouchPoints > 0;
    this.hover = !!detector.window.matchMedia?.("(any-hover: hover)").matches;
  }
  /**
   * Determines the current screen orientation of the device.
   * @example
   * orientation()
   * 'portrait'
   * @returns {string} 'landscape' or 'portrait' depending on the screen orientation.
   * @description
   *   - Uses the deprecated `window.orientation` property as a primary check.
   *   - Falls back to `window.matchMedia` for orientation detection when available.
   *   - Utilizes `window.screen.orientation.type` to retrieve orientation type in absence of other methods.
   *   - Determines orientation by comparing width and height as a last resort.
   */
  get orientation() {
    if (window.orientation !== undefined) {
      return Math.abs(+window.orientation) === 90 ? "landscape" : "portrait";
    }
    if (typeof detector.window.matchMedia === "function") {
      return detector.window.matchMedia("(orientation: portrait)").matches ===
        true
        ? "portrait"
        : "landscape";
    }
    if (typeof detector.window.screen === "object") {
      const orientationType = (detector.window.screen.orientation || {}).type;

      if (typeof orientationType === "string") {
        return orientationType.split("-", 1)[0];
      }
    }
    const w = Math.max(
      document.documentElement.clientWidth,
      detector.window.innerWidth || 0,
    );
    const h = Math.max(
      document.documentElement.clientHeight,
      detector.window.innerHeight || 0,
    );

    return w < h ? "portrait" : "landscape";
  }
  get portrait() {
    return this.orientation === "portrait";
  }
  get landscape() {
    return this.orientation === "landscape";
  }
}

export const os = new OS();
export const browser = new Browser();
export const device = new Device();

class Detect {
  os = os;
  browser = browser;
  device = device;
  detector = detector;
}

export const detect = new Detect();

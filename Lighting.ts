const blinkstick = require("blinkstick");

export default class Layout {
  private device: any;
  private current_led_colour: string = "#000000";

  constructor(serial?: string) {
    if (serial) {
      blinkstick.findBySerial(serial, (err, data) => {
        if (err) throw Error("could not connect to the blink stick " + err);
        this.device = data;
      });
    } else {
      try {
        let device = blinkstick.findFirst();
        if (device != null) {
          this.device = device;
        } else {
          throw new Error("Could not connect to the blinkstick");
        }
      } catch (error) {
        throw new Error("Could not connect to the blinkstick " + error);
      }
    }
  }

  public turn_on = () => {
    this.current_led_colour = "#FFFFFF";
    this.device.setColor(this.current_led_colour);
  };

  public turn_off = () => {
    this.current_led_colour = "#000000";
    this.device.setColor(this.current_led_colour);
  };
}

let led = new Layout();
led.turn_off();

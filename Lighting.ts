const blinkstick = require("blinkstick");

export default class Lighting {
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

  private change_colour = (colour) => {
    if (colour.length === 7) {
      try {
        this.device.setColor(colour);
        this.current_led_colour = colour;
      } catch (error) {
        throw new Error("Could not change colour of the LEDS" + error);
      }
    } else {
      throw new Error(
        "could not change colour because the entered value to change_colour was not denoted as a 6 digit hex value\n example: #FFFFFF"
      );
    }
  };

  private alter_brightness = (inc_or_dec: "increment" | "decrement") => {
    let colourArray = this.current_led_colour.split("").slice(1, 7);
    colourArray.forEach((element, i) => {
      let value_number = parseInt(element);
      // check that it is a number
      if (!isNaN(value_number)) {
        switch (inc_or_dec) {
          case "increment":
            if (value_number === 9) {
              colourArray[i] = "A";
            } else {
              colourArray[i] = (value_number + 1).toString();
            }
            break;
          case "decrement":
            if (value_number !== 0) {
              colourArray[i] = (value_number - 1).toString();
            } else {
              console.log(
                "can not decrease brightness any more at character " +
                  (i + 2) +
                  " for " +
                  this.current_led_colour
              );
            }
            break;
        }
      } else {
        // check that it is a string
        if (typeof element === "string") {
          let e = element.toUpperCase();
          if (
            e === "A" ||
            e === "B" ||
            e === "C" ||
            e === "D" ||
            e === "E" ||
            e === "F"
          ) {
            let char_code = e.charCodeAt(0);
            switch (inc_or_dec) {
              case "increment":
                if (String.fromCharCode(char_code) !== "F") {
                  colourArray[i] = String.fromCharCode(char_code + 1);
                } else {
                  console.log(
                    "can not increase brightness any more at character " +
                      (i + 2) +
                      " for " +
                      this.current_led_colour
                  );
                }
                break;
              case "decrement":
                if (String.fromCharCode(char_code) === "A") {
                  colourArray[i] = "9";
                } else {
                  colourArray[i] = String.fromCharCode(char_code - 1);
                }
                break;
            }
          } else {
            throw new Error("not able to increase value " + element);
          }
        } else {
          throw new Error("not able to increase value " + element);
        }
      }
    });
    this.current_led_colour = "#" + colourArray.join("");
    this.device.setColor(this.current_led_colour);
    console.log(colourArray);
  };

  public init_12v_leds = () => {
    this.device.setMode(1);
  };

  public turn_on = () => {
    this.change_colour("#FFFFFF");
  };

  public turn_off = () => {
    this.change_colour("#000000");
  };

  public increase_brightness = (amount: number) => {
    for (let i = 0; i < amount; i++) {
      this.alter_brightness("increment");
    }
  };

  public decrease_brightness = (amount: number) => {
    for (let i = 0; i < amount; i++) {
      this.alter_brightness("decrement");
    }
  };
}

let led = new Lighting();
led.decrease_brightness(1);

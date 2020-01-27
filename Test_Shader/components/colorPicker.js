function ColorPicker() {
    const that = Reflect.construct(HTMLInputElement, [], this.constructor);

    that.type = "color";

    return that;
}

ColorPicker.prototype = Object.create(HTMLInputElement.prototype);
ColorPicker.prototype.constructor = ColorPicker;

customElements.define('color-picker', ColorPicker, { extends: "input" });
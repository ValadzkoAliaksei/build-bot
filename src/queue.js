export class Queue {
  constructor() {
    this.elements = [];
    this.autoElements = [];
  }
  getElement() {
    return this.elements[0];
  }
  getElements() {
    return this.elements;
  }
  push(e, auto) {
    return auto ? this.autoElements.push(e) : this.elements.push(e);
  }
  shift(auto) {
    return auto ? this.autoElements.shift() : this.elements.shift();
  }
  isEmpty() {
    return this.elements.length === 0;
  }
  getAutoElement() {
    return this.autoElements[0];
  }
  getAutoElements() {
    return this.autoElements;
  }
  shiftAuto() {
    return this.autoElements.shift();
  }
  isAutoEmpty() {
    return this.autoElements.length === 0;
  }
}

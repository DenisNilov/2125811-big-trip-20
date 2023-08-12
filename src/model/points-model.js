import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {

  #points = null;
  #service = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#points = this.#service.points;
  }

  get points() {
    return this.#points;
  }
}

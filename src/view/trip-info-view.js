import AbstractView from '../framework/view/abstract-view.js';
import { createTripInfoTemplate } from '../template/trip-info-template.js';

export default class TripInfoView extends AbstractView {

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({ pointsModel, destinationsModel, offersModel }) {
    super();
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get template() {
    return createTripInfoTemplate({
      pointsModel: this.#pointsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
  }
}

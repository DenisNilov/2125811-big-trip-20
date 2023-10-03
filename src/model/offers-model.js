export default class OffersModel {

  #offers = [];
  #pointsApiService = null;

  constructor(pointsApiService) {
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    const offers = await this.#pointsApiService.offers;
    this.#offers = offers;
  }

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
  }
}

export default class DestinationsModel {

  #destinations = [1];
  #pointsApiService = null;

  constructor(pointsApiService) {
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    const destinations = await this.#pointsApiService.destinations;
    this.#destinations = destinations;
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }
}

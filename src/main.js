import TripInfoView from './view/trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import { render, RenderPosition } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic h76sfS44wcl1s98j';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const tripFilltersElement = document.querySelector('.trip-controls__filters');
const mainContentElement = document.querySelector('.trip-events');
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);

const pointsModel = new PointsModel({
  service: pointsApiService,
  destinationsModel,
  offersModel
});

const filterModel = new FilterModel();


const boardPresenter = new BoardPresenter({
  boardContainer: mainContentElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  newPointButtonContainer: tripMainElement
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripFilltersElement,
  filterModel,
  pointsModel
});


render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

boardPresenter.init();
filterPresenter.init();
pointsModel.init();

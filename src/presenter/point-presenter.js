import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import { isDateEqual } from '../utils/point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
export default class PointPresenter {

  #pointListContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ pointListContainer, destinationsModel, offersModel, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;


    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestination: this.#destinationsModel.getById(this.#point.destination),
      pointOffers: this.#offersModel.getByType(this.#point.type),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#eventClickForm,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);

  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isDeleting: true
    });
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = !isDateEqual(this.#point.dateFrom, update.dateFrom)
      || !isDateEqual(this.#point.dateTo, update.DateTo)
      || (this.#point.basePrice !== update.basePrice);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };

  #eventClickForm = () => {
    this.#replaceFormToCard();
  };

}

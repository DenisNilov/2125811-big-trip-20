import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, EditType } from '../const.js';
import PointEditView from '../view/point-edit-view.js';

export default class NewPointPresenter {

  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointNewComponent = null;
  #destinationsModel = [];
  #offersModel = [];

  constructor({ pointListContainer, onDataChange, onDestroy, destinationsModel, offersModel }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }

    this.#pointNewComponent = new PointEditView({
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      type: EditType.CREATING,
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#resetClickHandler
    });

    render(this.#pointNewComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }


  destroy = (isCanceled) => {
    if (this.#pointNewComponent === null) {
      return;
    }

    this.#handleDestroy(isCanceled);

    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving() {
    this.#pointNewComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointNewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointNewComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #resetClickHandler = () => {
    this.destroy(true);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

}

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createPointEditTemplate } from '../template/point-edit-template.js';
import { EditType, POINT_EMPTY } from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class PointEditView extends AbstractStatefulView {

  #pointDestinations = null;
  #pointOffers = null;
  #onSubmitClick = null;
  #onResetClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;
  #type;

  constructor({ point = POINT_EMPTY, pointDestinations, pointOffers, onFormSubmit, onResetClick, onDeleteClick, type = EditType.EDITING }) {
    super();

    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;

    this._setState(PointEditView.parsePointToState(point));

    this.#onSubmitClick = onFormSubmit;
    this.#onResetClick = onResetClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#type = type;

    this._restoreHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (point) => this.updateElement(point);

  _restoreHandlers = () => {
    if (this.#type === EditType.EDITING) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetButtonClickHandler);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#formDeleteClickHandler);
    }

    if (this.#type === EditType.CREATING) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetButtonClickHandler);
    }

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeInputClick);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#distinationInputChange);

    const offerBlock = this.element.querySelector('.event__available-offers');

    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChange);

    this.#setDatepickers();
  };

  get template() {
    return createPointEditTemplate({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers,
      typeButton: this.#type
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(PointEditView.parseStateToPoint(this._state));
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #distinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#pointDestinations
      .find((pointDestination) => pointDestination.name === evt.target.value);

    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : null;

    this.updateElement({
      destination: selectedDestinationId
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      offers: checkedBoxes.map((element) => element.dataset.offerId)
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: evt.target.value
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.dateTo,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.dateFrom,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

}

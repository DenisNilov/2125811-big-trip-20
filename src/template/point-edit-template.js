import { createOffersList } from './point-edit-offers-template.js';
import { createDistinationsList } from './point-edit-distination-template.js';
import { createTypeList } from './point-edit-type-list.js';
import { createPointEditControlsTemplate } from './point-edit-control-template.js';
import { humanizePointDueDateTime } from '../utils/point.js';
import he from 'he';

function createPointEditTemplate({ state, pointDestinations, pointOffers, typeButton }) {
  const point = { ...state };
  const { basePrice, dateFrom, dateTo, destination, type, isDisabled, isSaving, isDeleting } = point;
  const pointDestination = pointDestinations.find((dest) => dest.id === destination);
  const currentOffers = createOffersList({ type, point, pointOffers, isDisabled });
  const cityName = pointDestination?.name ?? ' ';
  const cities = pointDestinations.map((city) => city.name);
  const types = pointOffers.map((city) => city.type);

  return (/* html */`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createTypeList({ type, types, isDisabled })}
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination"
          id="event-destination-1" type="text" name="event-destination"
          value="${he.encode(cityName)}" list="destination-list-1" autocomplete="off" required ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${cities.map((city) => (`<option value="${city}"></option>`)).join(' ')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text"
          name="event-start-time" value="${humanizePointDueDateTime(dateFrom, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text"
          name="event-end-time" value="${humanizePointDueDateTime(dateTo, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price"
          id="event-price-1" type="text" name="event-price"
          value="${basePrice}"
          oninput = "this.value = this.value.replace(/[^0-9]/g, '')"
          title="Enter a positive integer"
          required ${isDisabled ? 'disabled' : ''}
          >
        </div>

        ${createPointEditControlsTemplate({ typeButton, isDisabled, isSaving, isDeleting })}
      </header>

      <section class="event__details">
        <section class="event__section  event__section--offers ${currentOffers.length
      === 0 ? 'visually-hidden' : ''}">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${currentOffers}
          </div>
        </section>
        ${(pointDestinations !== null) ? createDistinationsList(pointDestination) : ' '}
      </section >
    </form >
    </li > `
  );
}

export { createPointEditTemplate };

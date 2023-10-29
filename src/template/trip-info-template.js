import { sortByDate, isSameMonth } from '../utils/trip-info.js';
import { humanizePointDueDateTime } from '../utils/point.js';

function createTripInfoTemplate({ pointsModel, destinationsModel, offersModel }) {

  const points = pointsModel.points;
  const startPoint = destinationsModel.getById(points[0]?.destination)?.name;
  const endPoint = destinationsModel.getById(points[points.length - 1]?.destination)?.name;

  const totalPrice = points?.reduce((total, point) => {
    const checkedOffers = offersModel.getById(point.type, point.offers);
    const checkedOffersPrice = checkedOffers?.reduce((sum, checkedOffer) => sum + checkedOffer.price, 0);
    total += checkedOffersPrice + point.basePrice;
    return total;
  }, 0);

  const startData = humanizePointDueDateTime(points[0]?.dateFrom, `${isSameMonth(points) ? 'MMM D' : 'D MMM'}`);
  const endData = humanizePointDueDateTime(points[points.length - 1]?.dateTo, `${isSameMonth(points) ? 'D' : 'D MMM'}`);
  const shortWaypoints = sortByDate(points).map((point) => destinationsModel.getById(point.destination)?.name);

  function showTravelRoute() {
    return points.length > 3 ?
      `${startPoint ? startPoint : ''} &mdash; . . . &mdash; ${endPoint ? endPoint : ''}` :
      shortWaypoints.join(' &mdash; ');
  }

  return (/* html */
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${showTravelRoute()}</h1>

      <p class="trip-info__dates">
      ${startData} &nbsp;&mdash;&nbsp;${endData}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice ? totalPrice : ''}</span>
    </p>
  </section>`
  );
}

export { createTripInfoTemplate };

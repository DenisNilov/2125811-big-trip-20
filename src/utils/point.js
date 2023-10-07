import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const DAY_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATA_TIME = 'DD/MM/YY HH:mm';
const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

function formatStringToDateTime(data) {
  return dayjs(data).format('YYYY-MM-DDTHH:mm');
}

function formatStringToShotrDate(data) {
  return dayjs(data).format(DAY_FORMAT);
}

function humanizePointDueDateTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATA_TIME) : '';
}

function formatStringToTime(data) {
  return dayjs(data).format(TIME_FORMAT);
}

function getPointDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }

  return pointDuration;
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo);
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function getPointsDateDifference(pointA, pointB) {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
}

function getPointsPriceDifference(pointA, pointB) {
  return pointA.basePrice - pointB.basePrice;
}

function getPointsDurationDifference(pointA, pointB) {
  const durationA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const durationB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);

  return durationB - durationA;
}

function isDateEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export {
  formatStringToDateTime,
  formatStringToShotrDate,
  formatStringToTime,
  getPointDuration,
  isPointFuture,
  isPointPresent,
  isPointPast,
  getPointsDateDifference,
  getPointsPriceDifference,
  getPointsDurationDifference,
  isDateEqual,
  humanizePointDueDateTime
};

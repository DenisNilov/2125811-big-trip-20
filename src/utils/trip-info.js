import dayjs from 'dayjs';

function getDateDiff(dateOne, dateTwo) {
  return dayjs(dateOne).unix() - dayjs(dateTwo).unix();
}


function sortByDate(points) {
  return points.sort((a, b) => getDateDiff(a.dateFrom, b.dateFrom));
}

function isSameMonth() {
  dayjs(waypoints[0]?.dateFrom).month() === dayjs(waypoints[waypoints.length - 1]?.dateTo).month();
}

export {
  sortByDate
};

'use strict';

function normalizeShortYear(year) {
  if (year < 50) year = 2000 + year;
  if (year < 100) year = 1900 + year;
  return year;
}

function YYYYMMDD(date) {
  return date.toISOString().substring(0, 10);
}

function weekDateToDate(year, week, day) {
  const firstDayOfYear = new Date(year, 0, 1);
  const days = 2 + day + (week - 1) * 7 - firstDayOfYear.getDay();
  return new Date(Date.UTC(year, 0, days));
}

function guessRequestParamsFromPeriod(period) {
  if (!period) return {};

  let year, month, day;

  const seperators = ['\\-', '_', '/', '\\', ' '];
  const sep = '[' + seperators.join('') + ']';

  // YYYY-MM-DD
  const fullDateRegExp = new RegExp('^(\\d{4})' + sep + '?(\\d\\d)' + sep + '?(\\d\\d)$', 'i');
  let isFullDate;
  [isFullDate, year, month, day] = period.match(fullDateRegExp) || [];
  if (isFullDate) {
    return { at: `${year}-${month}-${day}` };
  }

  // YYYY
  let isJustYear;
  [isJustYear, year ] = (period.match(/^(\d{4})$/) || []).map(v => parseInt(v));
  if (isJustYear) {
    return {
      from: YYYYMMDD(new Date(Date.UTC(year, 0, 1))),
      to: YYYYMMDD(new Date(Date.UTC(year, 12, 0))),
    };
  }

  let isCalendarWeek, cw;
  // YYYY cwX (calendar week notation)
  [isCalendarWeek, year, cw ] = (period.match(/^(\d{2,4})[-_/\\ ]?cw(\d{1,2})$/i) || [])
    .map(v => parseInt(v));
  if (isCalendarWeek && year && cw) {
    year = normalizeShortYear(year);
    return {
      from: YYYYMMDD(weekDateToDate(year, cw + 1, 0)),
      to: YYYYMMDD(weekDateToDate(year, cw + 2, -1)),
    };
  }

  // `YYYYMM`, `YYYYM`, `YYM` and with optional seperators
  let isYearAndMonth;
  [isYearAndMonth, year, month ] = (period.match(/^(\d{2,4})[-_/\\ ]?(\d{1,2})$/) || [])
    .map(v => parseInt(v));
  if (isYearAndMonth && year && month) {
    year = normalizeShortYear(year);
    return {
      from: YYYYMMDD(new Date(Date.UTC(year, month - 1, 1))),
      to: YYYYMMDD(new Date(Date.UTC(year, month, 0))),
    };
  }

  const periodLc = period.toLowerCase().replace(/-/g, '_');
  const now = new Date();

  // IDEA match for standard ISO 8601 period time strings
  // https://de.wikipedia.org/wiki/ISO_8601

  // use notation of "3d" or "5w" to translate into from and to time periods
  const matches = String(periodLc).match(/^(\d+)(d|w|m|y|day|week|month|year)s?$/);
  if (matches) {
    const from = new Date(now.getTime());
    const amount = parseInt(matches[1], 10);
    switch(matches[2].substring(0, 1)) {
      case 'd':
        from.setDate(from.getDate() - amount);
        break;
      case 'w':
          from.setDate(from.getDate() - amount * 7);
        break;
      case 'm':
        from.setMonth(from.getMonth() - amount);
        break;
      case 'y':
        console.log(parseInt(matches[1]));
        from.setFullYear(from.getFullYear() - amount);
        break;
    }
    return {
      from: YYYYMMDD(from),
      to: YYYYMMDD(now),
    };
  }

  if (period.match(/this/)) return { at: periodLc };

  // check if the period is a week day name and calculate the date of this
  // weekday, f.e. "friday" from last week becomes the date a string
  const weekdays = new Set(['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']);
  const weekdayIndex = [...weekdays].indexOf(periodLc.substr(0, 2));

  if (weekdayIndex >= 0) {
    const todayIndex = (new Date).getDay();
    if (todayIndex <= weekdayIndex) {
      now.setDate(now.getDate() - (7 - weekdayIndex + todayIndex));
    } else {
      now.setDate(now.getDate() - weekdayIndex - 1);
    }
    return {
      at: YYYYMMDD(now),
    };
  }

  return {
    at: periodLc,
  };
}

module.exports = {
  guessRequestParamsFromPeriod
};

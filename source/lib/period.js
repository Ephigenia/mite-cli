'use strict';

function guessRequestParamsFromPeriod(period) {
  if (!period) return {};

  const periodLc = period.toLowerCase().replace(/-/g, '_');
  const now = new Date();

  // IDEA match for standard ISO 8601 period time strings
  // https://de.wikipedia.org/wiki/ISO_8601

  // use notation of "3d" or "5w" to translate into from and to time periods
  const matches = String(periodLc).match(/^(\d+)(d|w|m|y|day|week|month|year)s?$/);
  if (matches) {
    const from = new Date(now.getTime());
    const amount = parseInt(matches[1], 10);
    switch(matches[2].substr(0, 1)) {
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
      from: from.toISOString().substr(0, 10),
      to: now.toISOString().substr(0, 10),
    };
  }

  // match YYYY
  let [ year ] = (period.match(/^\d{4}$/) || []);
  if (year) {
    return {
      at: year,
    };
  } else {
    // `YYYYMM`, `YYYYM`, `YYM` and with optional seperators
    let [ , year, month ] = (period.match(/^(\d{2,4})[-_/\\]?(\d{1,2})$/) || [])
      .map(v => parseInt(v));
    if (year, month) {
      if (year < 50) year = 2000 + year;
      if (year < 100) year = 1900 + year;
      return {
        from: new Date(year, month - 1, 0),
        to: new Date(year, month, 0),
      };
    }
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
      at: now.toISOString().substr(0, 10)
    };
  }

  return {
    at: periodLc,
  };
}

module.exports = {
  guessRequestParamsFromPeriod
};

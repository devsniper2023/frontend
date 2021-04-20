import {
  format,
  formatRelative,
  formatDistanceToNowStrict,
  intervalToDuration,
  formatDuration,
  differenceInSeconds,
} from 'date-fns';

type DateInput = Date | string | number;

const dateInputToDate = (date: DateInput) => new Date(date);

const dateIsValid = (date: Date) => !isNaN(new Date(date).getTime());

export const isValidDate = (date: DateInput) => {
  return date && dateIsValid(new Date(date));
};

const dateFormat = (d: DateInput, formatString: string) => {
  const date = dateInputToDate(d);

  if (dateIsValid(date)) {
    return format(date, formatString);
  }
  return '?';
};

const relativeNow = (d: DateInput) => {
  const date = dateInputToDate(d);

  if (dateIsValid(date)) {
    return formatRelative(date, new Date());
  }
  return '?';
};

const formatDistance = (d: DateInput) => {
  const date = dateInputToDate(d);

  if (dateIsValid(date)) {
    const diff = Math.abs(differenceInSeconds(date, new Date()));

    if (diff < 1) {
      return 'now';
    }

    return formatDistanceToNowStrict(date, {
      addSuffix: true,
    });
  }
  return '?';
};

const durationToParse = (duration: Duration) => {
  const { years, months, days, hours, minutes } = duration;
  if (years) {
    return {
      years,
      months,
      days,
    };
  } else if (months) {
    return {
      months,
      days,
      hours,
    };
  } else if (days) {
    return {
      days,
      hours,
      minutes,
    };
  } else {
    return duration;
  }
};

const DELIMITER = ', ';

/**
 * 1 hour, 7 minutes, 51 seconds => 1h, 7m, 51s
 * @param text
 */
const durationWordsShort = (text: string) => {
  const items = text.split(DELIMITER);

  const res = items
    .map((item) => {
      if (item) {
        const [value, unit] = item.split(' ');
        return `${value || 0}${unit?.charAt(0) || ''}`;
      }

      return '';
    })
    .filter((item) => !!item);
  return res.join(DELIMITER);
};

const durationWords = (
  seconds: number,
  options?: { includeSeconds: boolean; short?: boolean }
) => {
  const format = ['years', 'months', 'weeks', 'days', 'hours', 'minutes'];

  if (options?.includeSeconds) {
    format.push('seconds');
  }

  const intervalDuration = intervalToDuration({
    start: 0,
    end: new Date(seconds * 1000),
  });

  const res =
    seconds > 0
      ? formatDuration(durationToParse(intervalDuration), {
          delimiter: DELIMITER,
          format,
        })
      : // will render 0 seconds, by default it returns empty string
        formatDuration(durationToParse(intervalDuration), {
          delimiter: DELIMITER,
          format: ['seconds'],
          zero: true,
        });

  if (options?.short) {
    return durationWordsShort(res);
  }

  return res;
};

export const dateUtils = {
  dateInputToDate,
  isValidDate,
  short: (d: DateInput) => dateFormat(d, 'PP'),
  shortWithTime: (d: DateInput) => dateFormat(d, 'Pp'),
  format: dateFormat,
  relativeNow,
  formatDistance,
  durationWords,
};

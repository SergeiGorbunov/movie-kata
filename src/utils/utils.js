import { enGB } from 'date-fns/locale';
import { format } from 'date-fns';

const getCopyOfProps = (props) => {
  return JSON.parse(JSON.stringify(props));
};

export const getCorrectDate = (date) => {
  const dateInArray = getCopyOfProps(date).split('-');
  let correctDate = null;
  if (dateInArray[0]) {
    correctDate = format(new Date(...dateInArray), 'MMMM dd, yyyy', { locale: enGB });
  }
  return correctDate;
};

export const getShortTitle = (text) => {
  const MAX_LENGTH = 48;
  const OPTIMAL_AMOUNT_WORDS = 5;
  let shortTitle = getCopyOfProps(text);
  if (text.length > MAX_LENGTH) {
    shortTitle = text.split(' ').slice(0, OPTIMAL_AMOUNT_WORDS).join(' ');
    shortTitle += '...';
  }
  return shortTitle;
};

export const getGenresName = (genresIds, arrGenresObj) => {
  if (!genresIds) {
    return;
  }
  const names = getCopyOfProps(genresIds)
    .map((id) => arrGenresObj.find((obj) => obj.id === id))
    .filter((obj) => obj !== undefined);

  return names;
};

export const defineRateColor = (num) => {
  const color = { borderColor: '' };

  if (num < 3) {
    color.borderColor = '#E90000';
    return color;
  }
  if (num < 5) {
    color.borderColor = '#E97E00';
    return color;
  }
  if (num < 7) {
    color.borderColor = '#E9D100';
    return color;
  }
  if (num >= 7) {
    color.borderColor = '#66E900';
    return color;
  }
  return color;
};

import { getColor, getRandomNumber } from './utils';

export const chartJsDefaultTooltip = () => ({
  backgroundColor: getColor('gray-100'),
  borderColor: getColor('gray-300'),
  borderWidth: 1,
  titleColor: getColor('gray-1100'),
  callbacks: {
    labelTextColor() {
      return getColor('gray-1100');
    }
  }
});

export const getBubbleDataset = (count, rmin, rmax, min, max) => {
  const arr = Array.from(Array(count).keys());
  return arr.map(() => ({
    x: getRandomNumber(min, max),
    y: getRandomNumber(min, max),
    r: getRandomNumber(rmin, rmax)
  }));
};

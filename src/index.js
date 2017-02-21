import _ from 'lodash';
import jpeg from 'jpeg-js';
import fs from 'mz/fs';
import path from 'path';

const avg = (...args) => {
  const sum = args.reduce((acc, e) => {
    const newAcc = acc + e;
    return newAcc;
  }, 0);

  return sum / args.length;
};

const pixelToGrayscale = (...rgb) => avg(rgb);

const grayscaleToChar = (grade) => {
  if (grade < 25) {
    return ' ';
  } else if (grade < 50) {
    return '-';
  } else if (grade < 75) {
    return '|';
  } else if (grade < 100) {
    return '\\';
  } else if (grade < 125) {
    return '/';
  } else if (grade < 150) {
    return '*';
  } else if (grade < 175) {
    return '0';
  } else if (grade < 200) {
    return '8';
  } else if (grade < 225) {
    return '@';
  }

  return '';
};


const jpegToText = async (file) => {
  const jpegData = await fs.readFile(file);
  const rawJpegData = jpeg.decode(jpegData);
  const pixelArray = _.chunk(rawJpegData, 4);
  const grayscaleJpeg = pixelArray.map(pixelToGrayscale);
  const charJpeg = grayscaleJpeg.map(grayscaleToChar);
  const jpegRows = _.chunk(charJpeg, rawJpegData.width);
  const evenRows = jpegRows.filter((e, index) => index % 2 === 0);

  return evenRows.join('\n');
};

export default (file) => {
  console.log(file);
};

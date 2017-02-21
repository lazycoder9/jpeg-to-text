import _ from 'lodash';
import jpeg from 'jpeg-js';
import fs from 'fs';
import path from 'path';

const avg = (args) => {
  const sum = args.slice(0, -1).reduce((acc, e) => {
    const newAcc = acc + e;
    return newAcc;
  }, 0);
  return sum / args.length;
};

const pixelToGrayscale = rgb => (avg(rgb.slice(0, -1)));

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

export default (file) => {
  const fileName = path.basename(file, '.jpg');
  const outputFileName = `${fileName}.txt`;
  const jpegData = fs.readFileSync(file);
  const jpegRawData = jpeg.decode(jpegData, true);
  const pixelArray = _.chunk(jpegRawData.data, 4);
  const grayscaleJpeg = pixelArray.map(pixelToGrayscale);
  const charJpeg = grayscaleJpeg.map(grayscaleToChar);
  const jpegRows = _.chunk(charJpeg, jpegRawData.width).map(e => e.join(''));
  const evenRows = jpegRows.filter((e, index) => index % 2 === 0);
  const textPic = evenRows.join('\n');
  fs.writeFile(outputFileName, textPic, 'utf-8');
  return `Jpeg has been transformed to ${outputFileName}`;
};

import _ from 'lodash';
import jpeg from 'jpeg-js';
import fs from 'fs';
import path from 'path';

const avg = (args) => {
  const sum = args.reduce((acc, e) => {
    const newAcc = acc + e;
    return newAcc;
  }, 0);
  return sum / args.length;
};

const pixelToGrayscale = rgb => (avg(rgb.slice(0, -1)));

const grayscaleToChar = (grade) => {
  const chars = [' ', '-', '|', '\\', '/', '*', '?', '6', '8', '@'];
  const step = 255 / (chars.length - 1);
  return chars[chars.length - (Math.floor(grade / step) + 1)];
};

export default (file) => {
  const fileName = path.basename(file, '.jpg');
  const outputFileName = `${fileName}.txt`;
  const jpegData = fs.readFileSync(file);
  const jpegRawData = jpeg.decode(jpegData, true);
  const pixelArray = _.chunk(jpegRawData.data, 4);
  const charJpeg = pixelArray
    .map(pixelToGrayscale)
    .map(grayscaleToChar);
  const jpegRows = _.chunk(charJpeg, jpegRawData.width)
    .map(e => e.join(''))
    .filter((e, index) => index % 3 === 0)
    .join('\n');
  fs.writeFileSync(outputFileName, jpegRows, 'utf-8');
  return `Jpeg has been transformed to ${outputFileName}`;
};

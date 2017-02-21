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
  const grayscaleJpeg = pixelArray.map(pixelToGrayscale);
  const charJpeg = grayscaleJpeg.map(grayscaleToChar);
  const jpegRows = _.chunk(charJpeg, jpegRawData.width).map(e => e.join(''));
  const evenRows = jpegRows.filter((e, index) => index % 2 === 0);
  const textPic = evenRows.join('\n');
  fs.writeFile(outputFileName, textPic, 'utf-8');
  return `Jpeg has been transformed to ${outputFileName}`;
};

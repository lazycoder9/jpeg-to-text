#!/usr/bin/env node
import program from 'commander';
import jpegToText from '../';

program
  .version('0.0.1')
  .description('Transforms jpeg file to text  picture.')
  .arguments('<file>')
  .action(function (file) {
    console.log(jpegToText(file));
  })
  .parse(process.argv);

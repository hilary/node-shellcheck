const https = require('https');
const fs = require('fs');
const tar = require('tar');
const yauzl = require('yauzl');
const path = require('path');
var mkdirp = require("mkdirp");

function main() {  
  var filename;
  
  if (process.platform === "win32") {
    filename = `shellcheck-latest.zip`;
  }
  else {
    filename = `shellcheck-latest.${process.platform}.x86_64.tar.xz`;
  }
  
  const url = `https://github.com/koalaman/shellcheck/releases/download/latest/${filename}`;
  
  const isRedirect = (statusCode) => {
    return statusCode >= 300 && statusCode < 400;
  };
  
  const outputDir = `${__dirname}\\..\\temp`
  const outputFilename = `${outputDir}\\${filename}`
  const extractedDir = `${__dirname}\\..\\bin\\`
  const outputFile = fs.createWriteStream(outputFilename);
  
  mkdirp.sync(outputDir);
  mkdirp.sync(extractedDir);

  const download = (url) => {
    https
      .get(url, res => {
        if (isRedirect(res.statusCode)) {
          download(res.headers.location);
        } else {
          res.pipe(outputFile);
        }
      })
      .on('error', err => {
        console.log('Error: ' + err.message);
      });
  };
  
  console.log(`URL: '${url}'`);
  console.log(`Target file: '${outputFilename}'`);
  download(url);
  
  outputFile.on('finish', function() {
    if (process.platform === "win32") {  
      console.log(`Extracting archive: '${outputFilename}'`);
      console.log(`Target directory: '${extractedDir}'`);
      yauzl.open(outputFilename, {lazyEntries: true}, function(err, zipfile) {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on("entry", function(entry) {
          outfilename = `${extractedDir}${entry.fileName}`
          dir = path.dirname(outfilename)
          console.log(outfilename)
          console.log(dir)
          if (/\/$/.test(entry.fileName)) {
            // directory file names end with '/'
            mkdirp(outfilename, function(err) {
              if (err) throw err;
              zipfile.readEntry();
            });
          } else {
            // file entry
            zipfile.openReadStream(entry, function(err, readStream) {
              if (err) throw err;
              // ensure parent directory exists
              mkdirp.sync(dir)
              readStream.pipe(fs.createWriteStream(outfilename));
              readStream.on("end", function() {
                zipfile.readEntry();
              });
            });
          }
        });
      });
    } else {
      tar.x(  // or tar.extract(
        {
          file: filename
        }
      ).then(_=> { 
        console.log("Did it");
      });  
  }});
}

main();  

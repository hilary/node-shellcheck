const https = require('https');
const fs = require('fs');
const tar = require('tar');
const yauzl = require('yauzl');
const path = require('path');
var mkdirp = require("mkdirp");

const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
const decompressTarxz = require('decompress-tarxz');
const decompressTar = require('decompress-tar');
const decompressTarbz2 = require('decompress-tarbz2');
const decompressUnzip = require('decompress-unzip');
 
function main() {  
  var filename;
  
  if (process.platform === "win32") {
    filename = `shellcheck-latest.zip`;
  }
  else {
    filename = `shellcheck-latest.linux.x86_64.tar.xz`;
  }
  
  const url = `https://github.com/koalaman/shellcheck/releases/download/latest/${filename}`;
  
  const isRedirect = (statusCode) => {
    return statusCode >= 300 && statusCode < 400;
  };
  
  const outputDir = `${__dirname}\\..\\temp`
  const outputFilename = `${outputDir}\\${filename}`
  const extractedDir = `${__dirname}\\..\\bin\\`
  
  mkdirp.sync(outputDir);
  mkdirp.sync(extractedDir);
  var outputFile = fs.createWriteStream(outputFilename);

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
    if (filename.includes(".zip")) {  
      console.log(`Extracting archive: '${outputFilename}'`);
      console.log(`Target directory: '${extractedDir}'`);
      yauzl.open(outputFilename, {lazyEntries: true}, function(err, zipfile) {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on("entry", function(entry) {
          outfilename = `${extractedDir}${entry.fileName}`
          dir = path.dirname(outfilename)
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
      console.log(`Source archive: '${outputFilename}'`);
      console.log(`Target directory: '${extractedDir}'`);
            
      decompress(outputFilename, extractedDir, {
        plugins: [
          decompressTarxz(), decompressTar(), decompressTarbz2(), decompressTargz(), decompressUnzip()
        ],
        strip: 1
      }).then(files => {
        console.log('Files decompressed.');
      }).catch(err => {
        console.log(err)
      });
  }});
}

main();  

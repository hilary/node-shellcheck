/**
 * Download ShellCheck and extract to binary ('bin') folder.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import yauzl from 'yauzl';

import decompress from 'decompress';
import decompressTarxz from 'decompress-tarxz';
import decompressTar from 'decompress-tar';

/**
 * Return root directory of project.
 *
 * @return {string} Root directory of project where 'package.json' lives.
 */
function getProjectRoot() {
    let root = path.normalize(`${__dirname}/../`);
    if (fs.existsSync(`${root}/package.json`))
    {
        return root;
    }
    root = path.normalize(`${__dirname}/../../`);
    if (fs.existsSync(`${root}/package.json`))
    {
        return root;
    }
    return __dirname;
}
/**
 * Download shellcheck for either Linux or Windows and extract to 'bin' folder. This
 * will create a 'temp' folder and leave it there.
 */
function download() {
    let filename:string;

    if (process.platform === 'win32') {
        filename = `shellcheck-latest.zip`;
    } else {
        filename = `shellcheck-latest.${process.platform}.x86_64.tar.xz`;
    }

    console.log(`Installing ShellCheck on '${process.platform}' (${process.arch})`);

    const url = `https://github.com/koalaman/shellcheck/releases/download/latest/${filename}`;

    const isRedirect = (statusCode:number) => {
        return statusCode >= 300 && statusCode < 400;
    };

    const outputDir = path.normalize(`${getProjectRoot()}/temp`);
    const outputFilename = path.normalize(`${outputDir}/${filename}`);
    const extractedDir = path.normalize(`${getProjectRoot()}/bin/`);

    mkdirp.sync(outputDir);
    mkdirp.sync(extractedDir);
    const outputFile = fs.createWriteStream(outputFilename);

    const download = (url:string) => {
        https
            .get(url, (res:any) => {
                if (isRedirect(res.statusCode)) {
                    download(res.headers.location);
                } else {
                    res.pipe(outputFile);
                }
            })
            .on('error', (err:any) => {
                console.log('Error: ' + err.message);
            });
    };

    console.log(`URL: '${url}'`);
    console.log(`Target file: '${outputFilename}'`);
    download(url);

    outputFile.on('finish', function() {
        if (filename.includes('.zip')) {
            console.log(`Extracting archive: '${outputFilename}'`);
            console.log(`Target directory: '${extractedDir}'`);
            yauzl.open(outputFilename, {lazyEntries: true}, function(err:any, zipfile:any) {
                if (err) throw err;
                zipfile.readEntry();
                zipfile.on('entry', function(entry:any) {
                    const outfilename = `${extractedDir}${entry.fileName}`;
                    const dir = path.dirname(outfilename);
                    if (/\/$/.test(entry.fileName)) {
                        // directory file names end with '/'
                        mkdirp(outfilename).then(() => {
                            zipfile.readEntry();
                        }).catch((err) => {
                            console.log('Failed to read zip file entry.');
                            if (err) throw err;
                        });
                    } else {
                        // file entry
                        zipfile.openReadStream(entry, function(err:any, readStream:any) {
                            if (err) throw err;
                            // ensure parent directory exists
                            mkdirp.sync(dir);
                            readStream.pipe(fs.createWriteStream(outfilename));
                            readStream.on('end', function() {
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
                    decompressTarxz(), decompressTar()
                ],
                strip: 1
            }).then(() => {
                console.log('Files decompressed.');
            }).catch((err:any) => {
                console.log(err);
            });
        }
    });
}

export {download, getProjectRoot};

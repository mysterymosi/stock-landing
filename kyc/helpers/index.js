const Busboy = require("busboy");
module.exports = {
  sendJSONResponse(res, status, content) {
    res.status(status);
    res.json(content);
  },
  catchErrors(fn){
    return function (req, res, next) {
      return fn(req, res, next).catch(next);
    };
  },
  setUnixTimeDays(days) {
    const d = new Date();
  
    const unixTime = new Date().setTime((d.getTime() / 1000) + (86400 * days))
    return unixTime;
  },
  /**
   * Parses form with Busboy
   * @param {*} req 
   * @returns returns a promise which resolves an obejct {fileBuffer,fileType,fileName,fileEnc}
   */
  parseForm(req){
    return new Promise((resolve, reject) => {
      const form = new Busboy({ headers: req.headers })
      let chunks = []
      let fileInfo = {}
      let formdata = {}
      form.on('file', (field, file, filename, enc, mime) => {
        fileInfo = {...{
          filename,
          enc,
          mime
        }}
        file.on('data', data => {
          chunks.push(data)
        })

      })
      form.on('field',(key, value, keyTruncated, valueTruncated) =>{
        formdata[key] = value
      });
      form.on('finish', () => {
        const buf = Buffer.concat(chunks)
        resolve({ 
          fileBuffer: buf,
          fileInfo,
          formdata
        })
      })
      form.on('error', err => {
        reject(err)
      })
      req.pipe(form)
    })
  }
};

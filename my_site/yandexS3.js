const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: 'YCAJEySXQZRgvNF8BVmz7kzwH',
    secretAccessKey: 'YCN_fCVUlbqXq56_xT96tgskXQK6G-q-SduPu8G9',
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
});

const s3 = new AWS.S3();

const uploadToCloud = (files, callback) => {
    files.forEach(file => {
        const params = {
            Bucket: 'webium',
            Key: file.name,
            Body: file.data,
        };

        s3.upload(params, callback);
    });
}

module.exports = uploadToCloud
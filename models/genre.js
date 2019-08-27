const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    // 指向相关藏书的引用
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100,
    },
  }
);

// 虚拟属性'url'：藏书副本 URL
GenreSchema
  .virtual('url')
  .get(function () {
    return '/catalog/genre/' + this._id;
  });

// 导出 BookInstancec 模型
module.exports = mongoose.model('Genre', GenreSchema);
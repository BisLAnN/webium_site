const { Schema, model } = require('mongoose');

const lessonSchema = new Schema({
  lesson_name: { type: String, required: true },
  lesson_description: { type: String, required: true },
  course_link: { type: String, required: true },
}, { _id: false });

const sectionSchema = new Schema({
  section_name: { type: String, required: true },
  lessons: [lessonSchema],
}, { _id: false });

const courseSchema = new Schema({
  category: { type: String, required: true, default: 'Программирование'},
  name: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true, default: 'Разработчик' },
  sections: [sectionSchema],
});

module.exports = model('Course', courseSchema);

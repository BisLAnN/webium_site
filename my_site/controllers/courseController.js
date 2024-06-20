const Course = require('../models/Course');

class CourseController {
    async getCourses(req, res) {
        try {
            const courses = await Course.find()
            res.json(courses)
        }

        catch (e) {
            console.log(e)
        }
    }

    async addCourse(req, res) {
        try {
            const { name, author, description, sections } = req.body;
            const course = new Course({ name, author, description, sections });
            await course.save();
            res.json({ message: 'Новый курс успешно добавлен' });
        } catch (e) {
            console.error(e);
            res.status(400).json({ message: 'Ошибка при добавлении нового курса' });
        }
    }
    


    async deleteCourse(req, res) {
        const courseId = req.params.id;
        try {
            await Course.findByIdAndDelete(courseId);
            res.json({ message: 'Курс успешно удален' });

        }

        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка при удалении курса.' });
        }
    }

    async updateCourse(req, res) {
        const courseId = req.params.id;
        try {
            const { category, name, description, sections, lessons } = req.body;
            const updatedCourseData = {};

            if (category) updatedCourseData.category = category;
            if (name) updatedCourseData.name = name;
            if (description) updatedCourseData.description = description;
            if (sections && sections.length > 0) updatedCourseData.sections = sections;
            if (lessons && lessons.length > 0) updatedCourseData.lessons = lessons;
    
            const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedCourseData, { new: true });
            if (!updatedCourse) {
                return res.status(404).json({ message: 'Курс не найден' });
            }
            res.json(updatedCourse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка при обновлении курса' });
        }
    }
}
module.exports = new CourseController();
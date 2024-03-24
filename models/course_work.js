const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for lessons
const lessonSchema = new Schema({
    title: { type: String, required: true},
    content: { type: String, required: true },
    images: { type: String, default: '' }, 
    videos: { type: String, default: '' }, 
});

// lessonSchema.index({ title: 1 }, { unique: true });

// Define schema for problems/questions
const questionSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true },
    test_cases: { type: [{ input: String, output: String }], default: [] }, 
    solution_link: { type: String, default: '' },
    score: { type: Number, default: 0 }
});

// questionSchema.index({ title: 1 }, { unique: true });

// Define schema for assignments
const assignmentSchema = new Schema({
    title: { type: String, required: true},
    questions: [{ type: String,default: '' }],
    scores: [{ type: Number, default: 0 }],
    correct_answers: [{ type: String, default: '' }], 
});

// assignmentSchema.index({ title: 1 }, { unique: true });

// Define schema for items within a module
const moduleItemSchema = new Schema({
    type: { type: String, enum: ['lesson', 'question', 'assignment'], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true, unique: true },
    order: { type: Number, required: true },
});

moduleItemSchema.index({ itemId: 1 }, { unique: true });


// Define schema for modules within a course
const moduleSchema = new Schema({
    title: { type: String, required: true },
    items: { type: [moduleItemSchema], default: [] },
    order: { type: Number, required: true },
});

// moduleSchema.index({ title: 1 }, { unique: true });

// Define schema for courses
const courseSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: Date.now },
    modules: { type: [moduleSchema], default: [] }, 
    enrolled_students: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }], 
});

courseSchema.index({ title: 1 }, { unique: true });

// Define models
const Lesson = mongoose.model('Lesson', lessonSchema);
const Question = mongoose.model('Question', questionSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);
const ModuleItem = mongoose.model('ModuleItem', moduleItemSchema);
const Module = mongoose.model('Module', moduleSchema);
const Course = mongoose.model('Course', courseSchema);



async function temporaryData()
{
try {
    // Create a lesson

    const existingLesson = await Lesson.findOne({ title: 'Introduction to Strings' });
    if (!existingLesson) {

    const lesson = new Lesson({
        title: 'Introduction to Strings',
        content: 'This lesson covers basic concepts of strings in programming.',
        images: 'https://example.com/image1.jpg', 
        videos: 'https://example.com/video1.mp4' 
    });

    // Create a problem/question
    const question = new Question({
        title: 'Reverse a String',
        description: 'Write a function to reverse a given string.',
        test_cases: [{ input: 'hello', output: 'olleh' }, { input: 'world', output: 'dlrow' }],
        solution_link: 'https://example.com/solution',
        score: 10
    });

    // Create an assignment
    const assignment = new Assignment({
        title: 'Assignment 1',
        questions: ['reverse of hello'], 
        scores: [10],
        correct_answers: ['olleh'] 
    });

    // Create a module item for lesson
    const lessonModuleItem = new ModuleItem({
        type: 'lesson',
        itemId: lesson._id,
        order: 1
    });

    // Create a module item for problem/question
    const questionModuleItem = new ModuleItem({
        type: 'question',
        itemId: question._id,
        order: 2
    });

    // Create a module item for assignment
    const assignmentModuleItem = new ModuleItem({
        type: 'assignment',
        itemId: assignment._id,
        order: 3
    });

    // Create a module
    const module = new Module({
        title: 'String Operations',
        items: [lessonModuleItem, questionModuleItem, assignmentModuleItem],
        order: 1
    });

    // Create a course
    const course = new Course({
        title: 'Programming Basics',
        description: 'A course covering fundamental programming concepts.',
        start_date: new Date(),
        end_date: new Date(),
        modules: [module]
    });

    // Save all instances to the database
    Promise.all([
        lesson.save(),
        question.save(),
        assignment.save(),
        lessonModuleItem.save(),
        questionModuleItem.save(),
        assignmentModuleItem.save(),
        module.save(),
        course.save()
    ]).then(() => {
        console.log('Temporary Course Data added successfully');
        // mongoose.disconnect(); // Disconnect from MongoDB
    }).catch(error => {
        console.error('Course Saving Error : ',error);
        // mongoose.disconnect(); // Disconnect from MongoDB
    });
}
else
{
    console.log('Temporary Course data already exists:');
}
}
catch (error) {
    console.error('Course Schema Error:', error);
    // mongoose.disconnect(); // Disconnect from MongoDB
}
}
async function main(){
    await temporaryData();
}
main();


module.exports = {
    Lesson,
    Question,
    Assignment,
    ModuleItem,
    Module,
    Course,
};

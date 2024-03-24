let { Lesson, Question, Assignment, ModuleItem, Module, Course }=require("../models/course_work");


let coursecreator=async (req,res)=>{ 
    let courseData=req.body;
    try{
        const existingCourse = await Course.findOne({ title: courseData.title });
        if (!existingCourse) {

        await saveCourseData(courseData);
        res.send("Course Created"); 
        }
        else
        {
            res.send("Course already Present");
        }

        async function saveCourseData(courseData) {
            try {
                // Save the course
                const course = new Course({
                    title: courseData.title,
                    description: courseData.description,
                    start_date: courseData.start_date,
                    end_date: courseData.end_date,
                    modules: []
                });
                await course.save();
        
                // Iterate over modules
                for (const moduleData of courseData.modules) {
                    // Save module
                    const module = new Module({
                        title: moduleData.module_name,
                        items: [],
                        order: moduleData.order || 5 // You can adjust the order as needed
                    });
                    await module.save();
        
                    // Iterate over lessons in the module
                    for (const lessonData of moduleData.lessons) {
                        const lesson = new Lesson({
                            title: lessonData.title,
                            content: lessonData.content,
                            images: lessonData.images,
                            videos: lessonData.videos
                        });
                        await lesson.save();
        
                        // Add lesson to the module
                        const moduleItem = new ModuleItem({
                            type: 'lesson',
                            itemId: lesson._id,
                            order: lessonData.order || 5 // Assign order if provided, otherwise default to 1
                        });
                        await moduleItem.save();
                        module.items.push(moduleItem);
                    }
        
                    // Iterate over questions in the module
                    for (const questionData of moduleData.questions) {
                        const question = new Question({
                            title: questionData.title,
                            description: questionData.description,
                            test_cases: questionData.test_cases,
                            solution_link: questionData.solution_link,
                            score: questionData.score
                        });
                        await question.save();
        
                        // Add question to the module
                        const moduleItem = new ModuleItem({
                            type: 'question',
                            itemId: question._id,
                            order: questionData.order || 6 // Assign order if provided, otherwise default to 1
                        });
                        await moduleItem.save();
                        module.items.push(moduleItem);
                    }
        
                    // Iterate over assignments in the module
                    for (const assignmentData of moduleData.assignments) {
                        const assignment = new Assignment({
                            title: assignmentData.title,
                            questions: assignmentData.questions,
                            scores: assignmentData.scores,
                            correct_answers: assignmentData.correct_answers
                        });
                        await assignment.save();
        
                        // Add assignment to the module
                        const moduleItem = new ModuleItem({
                            type: 'assignment',
                            itemId: assignment._id,
                            order: assignmentData.order || 7 // Assign order if provided, otherwise default to 1
                        });
                        await moduleItem.save();
                        module.items.push(moduleItem);
                    }
        
                    // Save the module after all items have been added
                    await module.save();
        
                    // Add module to the course
                    course.modules.push(module);
                }
        
                // Save the course after all modules have been added
                await course.save();
                console.log('Course data saved successfully');

            } catch (error) {
                console.error('Error saving course data:', error);
                res.status(500).json({"err":"Error saving course data: "});
            }
        }

    // example request body
    //   const courseData = {
    //     "title": "Programming Basics",
    //     "description": "A course covering fundamental programming concepts.",
    //     "start_date": "2024-03-25",
    //     "end_date": "2024-06-25",
    //     "modules": [
    //         {
    //             "module_name": "String Operations",
    //             "order": 6,
    //             "lessons": [
    //                 {
    //                     "title": "Introduction to Strings",
    //                     "content": "This lesson covers basic concepts of strings in programming.",
    //                     "images": "https://example.com/image1.jpg",
    //                     "videos": "https://example.com/video1.mp4",
    //                     "order": 9
    //                 }
    //             ],
    //             "questions": [
    //                 {
    //                     "title": "Reverse a String",
    //                     "description": "Write a function to reverse a given string.",
    //                     "test_cases": [
    //                         { "input": "hello", "output": "olleh" },
    //                         { "input": "world", "output": "dlrow" }
    //                     ],
    //                     "solution_link": "https://example.com/solution",
    //                     "score": 10,
    //                     "order": 10
    //                 }
    //             ],
    //             "assignments": [
    //                 {
    //                     "title": "Assignment 1",
    //                     "questions": ["question_id1"],
    //                     "scores": [10],
    //                     "correct_answers": ["olleh"],
    //                     "order": 11
    //                 }
    //             ]
    //         }
    //     ]
    // };
    

    }catch(err){
        console.log(err);
        res.status(500).json({"err":"error in course creation"});
    }
}

module.exports={
    coursecreator,
}
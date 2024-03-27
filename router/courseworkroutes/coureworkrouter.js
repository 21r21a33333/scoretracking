const router=require('express').Router();
const { Lesson, CourseProblem, Assessments ,Module, Course }=require("../../models/course_work");



router.post('/content',async (req,res)=>{
  const current_module =   await Module.findById(req.body.module_id);
  let newLesson = await Lesson.create({
    lesson_no: (current_module.lessons.length || 0) + 1,
    contentype: 'text-material',
    lesson_title: req.body.lesson_title,
    lesson_points: 0,
    text_content: req.body.text_content,
  });
  
  await newLesson.save();

  current_module.lessons.push(newLesson._id);

  await current_module.save();

  res.send("added content");


});





router.post('/problem',async (req,res)=>{

  const current_module =   await Module.findById(req.body.module_id);
    let problems_data = await CourseProblem.create({
      problem_title: req.body.problem_title,
      problem_description: req.body.problem_description,
      sample_test_cases: req.body.sample_test_cases,
      hidden_test_cases: req.body.hidden_test_cases
});
 await problems_data.save();

let newLesson = await Lesson.create({
  lesson_no: (current_module.lessons.length || 0) + 1,
  contentype: 'problem',
  lesson_title: req.body.lesson_title,
  lesson_points: req.body.problem_points,
  problem_id: problems_data._id
});

await newLesson.save();

current_module.module_total_score = current_module.module_total_score+req.body.problem_points;

current_module.lessons.push(newLesson._id);

await current_module.save();

res.send("added problem");

});







router.post('/course',async (req,res)=>{

  let new_course =await Course.create({
    courseid: req.body.course_id,
    course_tags: req.body.course_tags,
    title: req.body.title,
    description: req.body.description,
    modules: [] 
});

await new_course.save();

res.send({"course_object_id":new_course._id});

// {
//   "course_id": "CS777",
//   "course_tags": ["Programming", "Computer Science"],
//   "title": "Introduction to Programming",
//   "description": "This course introduces basic programming concepts."
// }


}
);


router.post('/module',async (req,res)=>{

  const current_course = await Course.findOne({courseid:req.body.course_id});

  let newModule =await Module.create({
    module_title: req.body.module_title,
    module_no: (current_course.modules.length || 0) + 1,
    module_total_score: 0,
    lessons: [] 
});

await newModule.save();

current_course.modules.push(newModule._id);

await current_course.save();

res.send({"module_id": newModule._id});


// {
//   "course_id": "CS101",
//   "module_title": "Module 7"
// }

});




router.post('/assessment',async (req,res)=>{

  if(req.body.assessment_id)
  {
    const current_module =   await Module.findById(req.body.module_id);
    let problems_data = await CourseProblem.create({
      problem_title: req.body.problem_title,
      problem_description: req.body.problem_description,
      sample_test_cases: req.body.sample_test_cases,
      hidden_test_cases: req.body.hidden_test_cases
});



await problems_data.save();

const current_assessment =   await Assessments.findById(req.body.assessment_id);


  current_assessment.problems.push({
    problem_ref: problems_data._id, 
    points: req.body.problem_points
  });

  await current_assessment.save();


  const current_lesson =   await Lesson.findById(req.body.lesson_id);
  current_lesson.lesson_points = current_lesson.lesson_points+req.body.problem_points;
  await current_lesson.save();

  current_module.module_total_score = current_module.module_total_score+req.body.problem_points;

  


  res.send({"lesson_id":current_lesson._id,
               "assessment_id": current_assessment._id
             });
  }

  // {
  //   "module_id": "660432569946f44589c0154e",
  //   "problem_title": "Problem 1",
  //   "problem_description": "Description for Problem 1",
  //   "sample_test_cases": [
  //     { "input": "Sample Input 1", "output": "Sample Output 1" },
  //     { "input": "Sample Input 2", "output": "Sample Output 2" }
  //   ],
  //   "hidden_test_cases": [
  //     { "input": "Hidden Input 1", "output": "Hidden Output 1" },
  //     { "input": "Hidden Input 2", "output": "Hidden Output 2" }
  //   ],
  //   "assessment_id": "660432789946f44589c0155b",
  //   "problem_points": 20,
  //   "lesson_id": "660432789946f44589c0155f"
  // }
  

  else
  {
      const current_module =   await Module.findById(req.body.module_id);


      let problems_data = await CourseProblem.create({
      problem_title: req.body.problem_title,
      problem_description: req.body.problem_description,
      sample_test_cases: req.body.sample_test_cases,
      hidden_test_cases: req.body.hidden_test_cases
});



await problems_data.save();

let new_assessment = await Assessments.create({
  assignment_name: req.body.assignment_name,
  total_time: req.body.total_time,
  problems: [
      {
          problem_ref: problems_data._id, 
          points: req.body.problem_points
      }
  ]
});
await new_assessment.save();


let newLesson = await Lesson.create({
  lesson_no: (current_module.lessons.length || 0) + 1,
  contentype: 'assessment',
  lesson_title: req.body.lesson_title,
  lesson_points: req.body.problem_points,
  assessment_ref: new_assessment._id
});
await newLesson.save();


current_module.lessons.push(newLesson._id);
current_module.module_total_score = current_module.module_total_score+req.body.problem_points;
await current_module.save();


    res.send({"lesson_id":newLesson._id,
               "assessment_id": new_assessment._id
             });
  }


  // {
  //   "module_id": "660432569946f44589c0154e",
  //   "problem_title": "Problem 1",
  //   "problem_description": "Description for Problem 1",
  //   "sample_test_cases": [
  //     { "input": "Sample Input 1", "output": "Sample Output 1" },
  //     { "input": "Sample Input 2", "output": "Sample Output 2" }
  //   ],
  //   "hidden_test_cases": [
  //     { "input": "Hidden Input 1", "output": "Hidden Output 1" },
  //     { "input": "Hidden Input 2", "output": "Hidden Output 2" }
  //   ],
  //   "assignment_name": "Assignment 1",
  //   "total_time": 60,
  //   "problem_points": 20,
  //   "lesson_title": "Lesson 1"
  // }
  
});


module.exports=router;
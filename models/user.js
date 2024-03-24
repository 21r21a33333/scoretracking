const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    "roll_no": {
      "type": "string",
       "required": true,
      unique:true,
    },
    "name": {
      "type": "string",
      // "required": true
    },
    "password": {
      "type": "string",
      // "required": true
    },
    "codechef_handle": {
      "type": "string",
      "required": true
    },
    "leetcode_handle": {
      "type": "string",
      "required": true
    },
    "codeforces_handle": {
      "type": "string",
      "required": true
    },
    "hackerrank_handle": {
      "type": "string",
      "required": true
    },
    "spoj_handle": {
      "type": "string",
      "required": true
    },
    "leaderboard_ref": {
      "type": "ObjectId",
      "ref": "Leaderboard",
      "required": true
    },
    "credential_ref": {
        "type": "ObjectId",
        "ref": "Tracked_Scores",
        "required": true
    },
    "problems_solved": {
        "type": "ObjectId",
        "ref": "ProblemsSolvedByStudent",
        "required": true
    },
    "enrolled_courses": [{ "type": Schema.Types.ObjectId, ref: 'Course' }], // Enrolled courses for the user
  }
);

userSchema.index({roll_no: 1});
const Users = mongoose.model("User", userSchema);
module.exports = Users;

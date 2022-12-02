const grades = require('./grades.json')
const courseGradesReport = getCourseGradesReport()

process.send(courseGradesReport)

function getCourseGradesReport () {
  const gradesPerCourse = getGradesPerCourse()
  return getCourseGradesStats(gradesPerCourse)
}

function getGradesPerCourse () {
  const gradesPerCourse = {}
  for (const grade of grades) {
    if (!gradesPerCourse[grade.course]) gradesPerCourse[grade.course] = []
    gradesPerCourse[grade.course].push(grade.grade)
  }
  return gradesPerCourse
}

function getCourseGradesStats (gradesPerCourse) {
  const courses = Object.keys(gradesPerCourse)
  return courses.map((course) => ({
    course,
    highestGrade: Math.max(...gradesPerCourse[course]),
    logwertGrade: Math.min(...gradesPerCourse[course]),
    averageGrade: gradesPerCourse[course].reduce((p, c) => p + c, 0) / gradesPerCourse[course].length
  }))
}

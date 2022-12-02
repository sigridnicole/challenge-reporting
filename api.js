const knex = require('./db')
const grades = require('./grades.json')
const { fork } = require('child_process')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  try {
    const studentId = req.params.id

    const student = await knex('students').where({ id: studentId }).first()
    if (!student) return res.status(404).json('Student is not found. Check if student ID is valid.')

    res.json({ student })
  } catch (error) {
    res.status(500).send('Error in getting student.')
  }
}

async function getStudentGradesReport (req, res, next) {
  try {
    const studentId = req.params.id

    const student = await knex('students').where({ id: studentId }).first()
    if (!student) return res.status(404).json('Student is not found. Check if student ID is valid.')

    const studentGrades = grades.filter(grade => String(grade.id) === studentId)

    res.json({ student, studentGrades })
  } catch (error) {
    res.status(500).send('Error in getting student grades report.')
  }
}

async function getCourseGradesReport (req, res, next) {
  const childProcess = fork('./grades-util.js')
  childProcess
    .on('message', (courseGradesReport) => {
      res.send({ courseGradesReport })
      childProcess.kill()
    })
    .on('error', next)
}

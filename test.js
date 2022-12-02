const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student by id | [success]', async function (t) {
  const studentId = 1
  const url = `${endpoint}/student/${studentId}`
  try {
    const { data } = await jsonist.get(url)
    const expectedStudentData = { id: 1, first_name: 'John', last_name: 'Doe' }

    t.deepEqual(data.student, expectedStudentData, 'should get expected student data')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student by id | [failed] - not found', async function (t) {
  const studentId = 'x'
  const url = `${endpoint}/student/${studentId}`
  try {
    const { data, response } = await jsonist.get(url)

    t.isEqual(response.statusCode, 404, 'should return status code 404')
    t.isEqual(data, 'Student is not found. Check if student ID is valid.', 'should return error message', 'should return an error message')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student grades report | [success]', async function (t) {
  const studentId = 1
  const url = `${endpoint}/student/${studentId}/grades`
  try {
    const { data } = await jsonist.get(url)

    const expectedStudentData = { id: 1, first_name: 'John', last_name: 'Doe' }
    const expectedStudentGrades = [{ id: 1, course: 'Calculus', grade: 50 }, { id: 1, course: 'Microeconomics', grade: 43 }, { id: 1, course: 'Statistics', grade: 50 }, { id: 1, course: 'Astronomy', grade: 63 }]

    t.deepEqual(data.student, expectedStudentData, 'should get expected student data')
    t.deepEqual(data.studentGrades, expectedStudentGrades, 'should get expected student grades')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student grades report | [failed] - not found', async function (t) {
  const studentId = 'x'
  const url = `${endpoint}/student/${studentId}/grades`
  try {
    const { data, response } = await jsonist.get(url)

    t.isEqual(response.statusCode, 404, 'should return status code 404')
    t.isEqual(data, 'Student is not found. Check if student ID is valid.', 'should return error message', 'should return an error message')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get all courses grades report', async function (t) {
  const url = `${endpoint}/course/all/grades`
  try {
    const { data } = await jsonist.get(url)

    const courseGradesReport = [
      {
        course: 'Calculus',
        highestGrade: 100,
        logwertGrade: 0,
        averageGrade: 50.09270747689165
      },
      {
        course: 'Microeconomics',
        highestGrade: 100,
        logwertGrade: 0,
        averageGrade: 49.81138092966023
      },
      {
        course: 'Statistics',
        highestGrade: 100,
        logwertGrade: 0,
        averageGrade: 50.017376820961566
      },
      {
        course: 'Astronomy',
        highestGrade: 100,
        logwertGrade: 0,
        averageGrade: 50.03889013536759
      },
      {
        course: 'Philosophy',
        highestGrade: 100,
        logwertGrade: 0,
        averageGrade: 50.01606355689488
      }
    ]

    t.deepEqual(data.courseGradesReport, courseGradesReport, 'should output expected correct courses report')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})

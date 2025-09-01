const { readDB } = require('../models/db');

module.exports = (req, res) => {
  const db = readDB();
  const students = db.users.filter(u => u.role !== 'admin').length;
  const courses = db.courses.length;
  const qcms = db.qcms.length;
  const messages = db.messages.length;
  const enrollments = db.courses.reduce((acc, c) => acc + c.students.length, 0);
  res.json({ students, courses, qcms, messages, enrollments, successRate: 92, hours: db.courses.reduce((a,c)=>a+c.hours,0) });
};

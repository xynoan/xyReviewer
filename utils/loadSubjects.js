const fs = require('fs');
const path = require('path');

function loadSubjects() {
    const subjectsPath = path.join(__dirname, '..', 'subjects');
    const subjects = {};
    fs.readdirSync(subjectsPath).forEach(file => {
        const subjectName = path.parse(file).name;
        const subjectPath = path.join(subjectsPath, file);
        delete require.cache[require.resolve(subjectPath)];
        const loadedSubject = require(subjectPath);
        subjects[subjectName] = Array.isArray(loadedSubject) ? loadedSubject : [];
    });
    return subjects;
}

module.exports = loadSubjects;
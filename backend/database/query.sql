select * from study_sessions;
INSERT INTO study_sessions(subject,date,duration,notes) VALUES ("Physics", "2024-10-3", "10", "hello");
DELETE FROM study_sessions WHERE id=1;
DELETE from study_sessions WHERE subject= 'Mathematics';
select * from study_sessions;
WHERE date BETWEEN '2024-10-23' AND '2024-11-5';
DELETE from study_sessions;
WHERE date BETWEEN '2024-10-29' AND '2024-11-5';
UPDATE study_sessions;
set duration=45, notes='updated notes';
DROP table study_sessions;
SELECT id, subject, date, duration from study_sessions
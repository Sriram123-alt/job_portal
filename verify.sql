SELECT 'users' as 'table', count(*) as count FROM users
UNION ALL
SELECT 'jobs', count(*) FROM jobs
UNION ALL
SELECT 'applications', count(*) FROM applications
UNION ALL
SELECT 'seeker_profiles', count(*) FROM seeker_profiles
UNION ALL
SELECT 'recruiter_profiles', count(*) FROM recruiter_profiles;

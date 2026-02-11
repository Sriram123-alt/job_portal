-- Disable checks to allow dropping tables with constraints
SET FOREIGN_KEY_CHECKS = 0;

-- Drop legacy constraint from jobs table
-- The constraint name 'FKq4v0nwosiuabukh6vlo7414wd' was identified from your error log
ALTER TABLE jobs DROP FOREIGN KEY FKq4v0nwosiuabukh6vlo7414wd;

-- Optional: Clean up legacy tables that are no longer used by the current JPA entities
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS recruiter_profiles;
DROP TABLE IF EXISTS seeker_profiles;

-- Re-enable checks
SET FOREIGN_KEY_CHECKS = 1;

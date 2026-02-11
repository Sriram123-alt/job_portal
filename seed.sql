USE job_portal;

-- Insert a Recruiter if not exists
INSERT INTO recruiters (username, password, email, full_name, company_name, company_location)
VALUES ('recruiter1', '$2a$10$vI8qV.k6uC9FzYwJy3P.mO5jE.7yIq.tW.p9g.3o1U.jE.m8Z.m', 'recruiter1@example.com', 'John Recruiter', 'Tech Corp', 'San Francisco')
ON DUPLICATE KEY UPDATE id=id;

-- Get the recruiter ID (assuming it's the one we just inserted or already there)
SET @recruiter_id = (SELECT id FROM recruiters WHERE username = 'recruiter1');

-- Add correct FK if not exists
ALTER TABLE jobs ADD CONSTRAINT FK_job_recruiter FOREIGN KEY (posted_by) REFERENCES recruiters(id);

-- Insert 3 Jobs
INSERT INTO jobs (title, description, company, location, salary, required_skills, posted_at, posted_by)
VALUES 
('Senior Software Engineer', 'We are looking for a senior engineer with 5+ years of experience in Java.', 'Tech Corp', 'San Francisco', 150000, 'Java, Spring Boot, MySQL', NOW(), @recruiter_id),
('Frontend Developer', 'Looking for a React expert to build beautiful UIs.', 'Tech Corp', 'Remote', 120000, 'React, JavaScript, CSS', NOW(), @recruiter_id),
('DevOps Engineer', 'Maintain our CI/CD pipelines and AWS infrastructure.', 'Tech Corp', 'Austin', 140000, 'AWS, Docker, Kubernetes', NOW(), @recruiter_id);

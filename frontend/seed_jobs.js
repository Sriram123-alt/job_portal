import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const recruiter = {
    username: 'recruiter_bot',
    email: 'recruiter@example.com',
    password: 'password123',
    role: 'RECRUITER'
};

const jobTitles = [
    "Frontend Developer", "Backend Engineer", "Full Stack Developer", "DevOps Specialist",
    "UI/UX Designer", "Product Manager", "Data Scientist", "Machine Learning Engineer",
    "QA Engineer", "System Administrator", "Cloud Architect", "Mobile App Developer"
];

const companies = [
    "TechGlobal", "InnovateX", "SoftSol", "WebWizards", "DataMinds", "CloudSystems",
    "FutureTech", "DevSolutions", "AppWorks", "NetSecure"
];

const locations = [
    "New York, NY", "San Francisco, CA", "Remote", "Austin, TX", "London, UK",
    "Berlin, DE", "Toronto, ON", "Bangalore, IN", "Sydney, AU", "Chicago, IL"
];

const descriptions = [
    "We are looking for a skilled professional to join our dynamic team. Great benefits and remote options.",
    "Join a fast-paced startup working on cutting-edge technology. Experience with Java and React required.",
    "Seeking an experienced engineer to lead our core infrastructure team. Competitive salary and equity.",
    "Entry-level position open for enthusiastic learners. Mentorship provided."
];

async function seed() {
    try {
        console.log("1. Registering/Logging in Recruiter...");
        let token;
        try {
            await axios.post(`${API_URL}/auth/register`, recruiter);
            console.log("   Registered recruiter_bot.");
        } catch (e) {
            console.log("   Recruiter might already exist. Attempting login...");
        }

        const loginRes = await axios.post(`${API_URL}/auth/signin`, {
            username: recruiter.username,
            password: recruiter.password
        });
        token = loginRes.data.accessToken;
        console.log("   Login successful. Token acquired.");

        console.log("2. Posting 25 Jobs...");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        for (let i = 0; i < 25; i++) {
            const job = {
                title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
                company: companies[Math.floor(Math.random() * companies.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                salary: (Math.floor(Math.random() * 80) + 50) * 1000 // 50000 - 130000
            };

            await axios.post(`${API_URL}/jobs`, job, config);
            process.stdout.write("."); // Progress bar
        }
        console.log("\nDone! 25 jobs added successfully.");

    } catch (err) {
        console.error("\nError:", err.response ? err.response.data : err.message);
    }
}

seed();

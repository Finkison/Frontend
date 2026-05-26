export const mockData = {
  "/student/profile/": {
    "id": "student-profile-id",
    "grade": 12,
    "stream": "Natural Science",
    "target_score": 620,
    "predicted_score": 580,
    "streak_days": 18
  },
  "/student/dashboard/": {
    "student": {
      "grade": 12,
      "stream": "Natural Science",
      "predicted_score": 580,
      "target_score": 620,
      "streak_days": 18
    },
    "today_goal_questions": 30,
    "today_answered": 18,
    "streak_days": 18
  },
  "/student/progress/": [
    { "id": 1, "subject": "Mathematics", "topic": "Calculus & Limits", "accuracy_percent": 82, "questions_attempted": 120, "correct_count": 98 },
    { "id": 2, "subject": "Physics", "topic": "Electromagnetism", "accuracy_percent": 45, "questions_attempted": 80, "correct_count": 36 },
    { "id": 3, "subject": "Chemistry", "topic": "Chemical Equilibrium", "accuracy_percent": 68, "questions_attempted": 90, "correct_count": 61 },
    { "id": 4, "subject": "English", "topic": "Grammar & Sentence Structure", "accuracy_percent": 74, "questions_attempted": 150, "correct_count": 111 },
    { "id": 5, "subject": "Biology", "topic": "Genetics & Inheritance", "accuracy_percent": 38, "questions_attempted": 70, "correct_count": 27 }
  ],
  "/student/weak-areas/": [
    { "id": 2, "subject": "Physics", "topic": "Electromagnetism", "accuracy_percent": 45 },
    { "id": 5, "subject": "Biology", "topic": "Genetics & Inheritance", "accuracy_percent": 38 }
  ],
  "/student/score-trajectory/": {
    "current_predicted_score": 580,
    "target_score": 620
  },
  "/student/departments/": [
    {
      "id": 1,
      "name": "Software Engineering",
      "description": "Design, build, test, and maintain software systems. Very high demand globally.",
      "career_paths": ["Backend Engineer", "Frontend Engineer", "Mobile Developer"],
      "salary_projection": "$85,000 - $140,000",
      "demand_level": "Critical"
    },
    {
      "id": 2,
      "name": "Data Science & AI",
      "description": "Apply statistical analysis, machine learning, and data storytelling to solve business problems.",
      "career_paths": ["Data Analyst", "ML Engineer", "BI Developer"],
      "salary_projection": "$90,000 - $150,000",
      "demand_level": "High"
    },
    {
      "id": 3,
      "name": "Cybersecurity",
      "description": "Protect critical infrastructure, information systems, and networks from cyber threats.",
      "career_paths": ["Security Analyst", "Penetration Tester", "CISO"],
      "salary_projection": "$95,000 - $160,000",
      "demand_level": "Critical"
    },
    {
      "id": 4,
      "name": "Information Systems",
      "description": "Bridge business needs with tech solutions, managing ERP, CRM and business databases.",
      "career_paths": ["IT Project Manager", "Systems Analyst", "ERP Consultant"],
      "salary_projection": "$75,000 - $120,000",
      "demand_level": "Medium"
    }
  ],
  "/student/technology-tracks/": [
    {
      "id": 1,
      "title": "Python Foundations",
      "level": "Beginner",
      "description": "Master coding fundamentals with Python: data structures, OOP, and algorithms.",
      "skills": ["Variables & Loops", "Data Structures", "Functions", "OOP"],
      "learning_outcomes": ["Write python automation scripts", "Solve standard data structure challenges"],
      "progress": 85
    },
    {
      "id": 2,
      "title": "Full-Stack Web Development",
      "level": "Intermediate",
      "description": "Build end-to-end applications with HTML, CSS, React, and Django REST.",
      "skills": ["HTML5/CSS3", "React JS", "Django REST Framework", "SQLite/Postgres"],
      "learning_outcomes": ["Build highly interactive single page apps", "Design and integrate secure REST APIs"],
      "progress": 40
    },
    {
      "id": 3,
      "title": "Data & Machine Learning",
      "level": "Intermediate",
      "description": "Manipulate big datasets and train baseline machine learning models.",
      "skills": ["Numpy & Pandas", "Data Cleaning", "Scikit-Learn Modeling"],
      "learning_outcomes": ["Perform exploratory data analysis", "Deploy a functional prediction model"],
      "progress": 10
    }
  ],
  "/scholarships/": [
    { "id": 1, "title": "Tech Leaders Tomorrow", "provider": "Future Minds Foundation", "amount": "$10,000 / year", "deadline": "2026-09-15", "type": "Merit-Based", "eligibility": "GPA 3.8+, Tech major focus", "status": "Open" },
    { "id": 2, "title": "Global Excellence Grant", "provider": "EduWorld Alliance", "amount": "Full Tuition", "deadline": "2026-10-01", "type": "Need-and-Merit", "eligibility": "National exam score top 1%", "status": "Matched" },
    { "id": 3, "title": "Women in STEM Fellowship", "provider": "Ada Lovelace Org", "amount": "$15,000", "deadline": "2026-08-30", "type": "Diversity Merit", "eligibility": "Female, Grade 12, STEM interest", "status": "Open" }
  ],
  "/scholarships/matched/": [
    { "id": 2, "title": "Global Excellence Grant", "provider": "EduWorld Alliance", "amount": "Full Tuition", "deadline": "2026-10-01", "type": "Need-and-Merit", "eligibility": "National exam score top 1%", "status": "Matched" }
  ],
  "/leaderboard/": [
    { "rank": 1, "student_name": "Abebe Kebede", "score": 685, "school": "Lideta Cathedral Academy", "region": "Addis Ababa" },
    { "rank": 2, "student_name": "Sarah John", "score": 678, "school": "St. Joseph School", "region": "Addis Ababa" },
    { "rank": 3, "student_name": "Chala Bekele", "score": 672, "school": "Bole High School", "region": "Oromia" },
    { "rank": 4, "student_name": "Selam Tilahun", "score": 668, "school": "Hill Side School", "region": "Amhara" },
    { "rank": 5, "student_name": "Mulugeta Alene", "score": 661, "school": "St. Mary School", "region": "Tigray" }
  ],
  "/practice/history/": [
    { "id": "p1", "subject": "Mathematics", "score_percent": 82, "correct_count": 28, "total_questions": 30, "date": "2026-05-24" },
    { "id": "p2", "subject": "Physics", "score_percent": 65, "correct_count": 13, "total_questions": 20, "date": "2026-05-23" },
    { "id": "p3", "subject": "Chemistry", "score_percent": 75, "correct_count": 15, "total_questions": 20, "date": "2026-05-20" }
  ],
  "/parent/children/": [
    { "id": "child-1", "user__full_name": "Daniel Finkison", "grade": 12, "stream": "Natural Science", "predicted_score": 580 },
    { "id": "child-2", "user__full_name": "Lydia Finkison", "grade": 9, "stream": "General Science", "predicted_score": 495 }
  ],
  "/parent/child/child-1/progress/": {
    "child_id": "child-1",
    "name": "Daniel Finkison",
    "grade": 12,
    "predicted_score": 580,
    "weak_subjects": ["Physics", "Biology"],
    "department": "Software Engineering"
  },
  "/parent/child/child-2/progress/": {
    "child_id": "child-2",
    "name": "Lydia Finkison",
    "grade": 9,
    "predicted_score": 495,
    "weak_subjects": ["Mathematics"],
    "department": null
  },
  "/parent/alerts/": [
    { "id": 1, "message": "Daniel got an outstanding score of 82% in math calculus practice!", "is_read": false, "created_at": "2026-05-25T14:30:00Z" },
    { "id": 2, "message": "Daniel is tracking below 50% accuracy in Physics: Electromagnetism.", "is_read": false, "created_at": "2026-05-24T09:15:00Z" },
    { "id": 3, "message": "Lydia has a missed homework assignment in Chemistry Unit 2.", "is_read": true, "created_at": "2026-05-20T11:00:00Z" }
  ],
  "/school/students/": [
    { "id": "stud-1", "user__full_name": "Daniel Finkison", "grade": 12, "stream": "Natural Science", "target_score": 620, "predicted_score": 580, "streak_days": 18 },
    { "id": "stud-2", "user__full_name": "Betty Girmay", "grade": 12, "stream": "Natural Science", "target_score": 650, "predicted_score": 612, "streak_days": 24 },
    { "id": "stud-3", "user__full_name": "Naod Yoseph", "grade": 11, "stream": "Natural Science", "target_score": 590, "predicted_score": 510, "streak_days": 8 },
    { "id": "stud-4", "user__full_name": "Solomon Demeke", "grade": 12, "stream": "Social Science", "target_score": 580, "predicted_score": 542, "streak_days": 12 },
    { "id": "stud-5", "user__full_name": "Lydia Finkison", "grade": 9, "stream": "General Science", "target_score": 520, "predicted_score": 495, "streak_days": 5 }
  ],
  "/school/analytics/": {
    "total_students": 156,
    "average_predicted_score": 545,
    "top_performing_stream": "Natural Science 12A",
    "by_grade": [
      { "grade": 9, "count": 42 },
      { "grade": 10, "count": 38 },
      { "grade": 11, "count": 36 },
      { "grade": 12, "count": 40 }
    ],
    "national_percentile_avg": 84
  }
};

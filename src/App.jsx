import React, { useEffect, useMemo, useRef, useState } from "react";
import users from "./data/users.json";

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const passwordHash = await hashPassword(password);
      const user = users.find(
        (entry) =>
          entry.email.toLowerCase() === email.trim().toLowerCase() &&
          entry.passwordHash === passwordHash,
      );

      if (!user) {
        setError("That email and password combination isn’t recognized.");
        return;
      }

      onLogin(user);
    } catch {
      setError("Sign in is unavailable in this browser. Please try another browser.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <a className="brand" href="#" aria-label="Classroom home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>classroom<span className="brand-period">.</span></span>
        </a>
        <div className="login-intro">
          <span className="eyebrow">YOUR SCHOOL, IN ONE PLACE</span>
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to your school directory.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            autoComplete="email"
            autoFocus
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@school.com"
            required
            type="email"
            value={email}
          />
          <div className="label-row">
            <label htmlFor="password">Password</label>
            <span className="secure-note">Secure sign in</span>
          </div>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button login-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in…" : "Sign in"}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <div className="demo-access">
          <span className="demo-icon" aria-hidden="true">i</span>
          <p>
            <strong>Demo access</strong>
            <br />
            Admin: admin@example.com · Admin123!
            <br />
            Student: alice@example.com · Student123!
          </p>
        </div>
        <p className="login-footer">A brighter way to stay connected.</p>
      </section>
      <aside className="login-aside" aria-label="School community">
        <div className="aside-orbit orbit-one" />
        <div className="aside-orbit orbit-two" />
        <div className="aside-copy">
          <span className="eyebrow light-eyebrow">THE CLASSROOM COMMUNITY</span>
          <h2>Every student.<br />Every possibility.</h2>
          <p>One welcoming place to keep your school community connected.</p>
          <div className="community-note">
            <div className="avatar-stack" aria-hidden="true">
              <span>AJ</span><span>LW</span><span>SP</span><span>+2</span>
            </div>
            <span>Made for your whole school</span>
          </div>
        </div>
        <div className="aside-shape shape-a" />
        <div className="aside-shape shape-b" />
        <span className="aside-sparkle sparkle-a" aria-hidden="true">✳</span>
        <span className="aside-sparkle sparkle-b" aria-hidden="true">✳</span>
        <span className="aside-caption">GROWING TOGETHER · SINCE DAY ONE</span>
      </aside>
    </main>
  );
}

function DetailDialog({ user, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.focus();
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="dialog-title"
        aria-modal="true"
        className="detail-dialog"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <button aria-label="Close details" className="icon-button dialog-close" onClick={onClose} type="button">
          ×
        </button>
        <span className="eyebrow">STUDENT PROFILE</span>
        <div className="dialog-person">
          <span className="avatar avatar-large">{initials(user.userName)}</span>
          <div>
            <h2 id="dialog-title">{user.userName}</h2>
            <p>{user.standard} grade</p>
          </div>
        </div>
        <div className="detail-list">
          <DetailItem label="Email address" value={user.email} />
          <DetailItem label="Language" value={user.language} />
          <DetailItem label="Home address" value={user.address} />
          <div className="detail-item">
            <span>Subjects</span>
            <div className="subject-list">
              {user.subjects.map((subject) => <span className="subject-pill" key={subject}>{subject}</span>)}
            </div>
          </div>
        </div>
        <button className="primary-button dialog-done" onClick={onClose} type="button">Done</button>
      </section>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StudentProfile({ user }) {
  return (
    <section className="profile-card" aria-labelledby="profile-title">
      <div className="profile-cover">
        <span className="eyebrow">YOUR STUDENT PROFILE</span>
        <span className="cover-decoration" aria-hidden="true">✳</span>
      </div>
      <div className="profile-content">
        <span className="avatar avatar-profile">{initials(user.userName)}</span>
        <span className="student-badge">{user.standard} grade student</span>
        <h2 id="profile-title">{user.userName}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-details">
          <DetailItem label="Language" value={user.language} />
          <DetailItem label="Home address" value={user.address} />
        </div>
        <div className="profile-subjects">
          <h3>My subjects <span>{user.subjects.length}</span></h3>
          <div className="subject-list">
            {user.subjects.map((subject) => <span className="subject-pill" key={subject}>{subject}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Dashboard({ user, onLogout }) {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const isAdmin = user.userType === "admin";
  const students = users.filter((entry) => entry.userType === "student");
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter(
      (student) =>
        student.userName.toLowerCase().includes(query) ||
        student.subjects.some((subject) => subject.toLowerCase().includes(query)),
    );
  }, [search, students]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Classroom home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>classroom<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="user-role">{isAdmin ? "Administrator" : "Student"}</span>
          <span className="avatar avatar-small">{initials(user.userName)}</span>
          <button className="text-button" onClick={onLogout} type="button">Sign out</button>
        </div>
      </header>
      <main className="dashboard">
        <div className="welcome-row">
          <div>
            <span className="eyebrow">{isAdmin ? "SCHOOL DIRECTORY" : "YOUR CLASSROOM"}</span>
            <h1>{isAdmin ? "Good morning, Morgan" : `Hello, ${user.userName.split(" ")[0]}`}</h1>
            <p>{isAdmin ? "A little closer to every student, every day." : "Here’s a little snapshot of your school life."}</p>
          </div>
          <div aria-hidden="true" className="welcome-art">
            <span className="welcome-art-star">✳</span>
            <span className="welcome-art-circle" />
            <span className="welcome-art-dot" />
          </div>
        </div>
        {isAdmin ? (
          <>
            <section className="directory-panel" aria-labelledby="directory-title">
              <div className="panel-heading">
                <div>
                  <h2 id="directory-title">Student directory</h2>
                  <p>Your school community, all in one place.</p>
                </div>
                <span className="student-count">{students.length} students</span>
              </div>
              <label className="search-box">
                <span aria-hidden="true" className="search-icon">⌕</span>
                <span className="visually-hidden">Search students by name or subject</span>
                <input
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or subject..."
                  type="search"
                  value={search}
                />
                <kbd>⌘ K</kbd>
              </label>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Student</th>
                      <th scope="col">Email address</th>
                      <th scope="col">Subjects</th>
                      <th scope="col"><span className="visually-hidden">Details</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr key={student.email}>
                        <td>
                          <div className="student-name">
                            <span className={`avatar table-avatar avatar-tone-${index % 4}`}>{initials(student.userName)}</span>
                            <span><strong>{student.userName}</strong><small>{student.standard} grade</small></span>
                          </div>
                        </td>
                        <td className="muted-cell">{student.email}</td>
                        <td>
                          <div className="table-subjects">
                            {student.subjects.slice(0, 2).map((subject) => <span className="subject-pill" key={subject}>{subject}</span>)}
                            {student.subjects.length > 2 && <span className="more-subjects">+{student.subjects.length - 2}</span>}
                          </div>
                        </td>
                        <td className="action-cell">
                          <button className="details-button" onClick={() => setSelectedStudent(student)} type="button">
                            Details <span aria-hidden="true">↗</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td className="empty-state" colSpan="4">No students or subjects match “{search}”. Try another search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <span>Showing {filteredStudents.length} of {students.length} students</span>
                <span>Updated just now <span aria-hidden="true">·</span> All caught up</span>
              </div>
            </section>
            <p className="dashboard-note"><span aria-hidden="true">✳</span> Small connections make a big difference.</p>
          </>
        ) : (
          <>
            <StudentProfile user={user} />
            <p className="dashboard-note"><span aria-hidden="true">✳</span> Keep showing up. You’re doing great.</p>
          </>
        )}
      </main>
      <footer className="app-footer">
        <span>classroom<span className="brand-period">.</span></span>
        <span>Growing together, every day.</span>
      </footer>
      {selectedStudent && (
        <DetailDialog user={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return currentUser ? (
    <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />
  ) : (
    <Login onLogin={setCurrentUser} />
  );
}

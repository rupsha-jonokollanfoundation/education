import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import ClassesList from "../components/ClassesList";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, "students", user.uid));
      setStudent(snap.data());
      setLoading(false);
    };
    fetchStudent();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>Not logged in.</p>;
  if (student.status !== "active") return <p>Wait for admin approval to access classes.</p>;

  return (
    <div>
      <h2>Welcome {student.name}!</h2>
      <ClassesList classLevel={student.class_level} />
    </div>
  );
}

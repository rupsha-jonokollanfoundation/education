import { useEffect, useState } from "react";
import { db } from "../utils/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ClassesList({ classLevel }) {
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    const fetchClasses = async () => {
      const q = query(collection(db, "classes"), where("level", "==", classLevel));
      const snaps = await getDocs(q);
      setClasses(snaps.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchClasses();
  }, [classLevel]);

  if (!classes.length) return <p>No classes available yet.</p>;
  return (
    <ul>
      {classes.map(c => (
        <li key={c.id}><strong>{c.name}</strong>: {c.description}</li>
      ))}
    </ul>
  );
}

import { useState } from "react";
import { auth, db } from "../utils/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", class_level: "HSC" });
  const [message, setMessage] = useState("");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("Signing up...");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "students", userCred.user.uid), {
        name: form.name,
        email: form.email,
        status: "pending",
        class_level: form.class_level,
        created_at: new Date(),
      });

      // Call custom Next.js API Route to send admin email
      await fetch("/api/sendAdminApproval", {
        method: "POST",
        body: JSON.stringify({
          studentId: userCred.user.uid,
          studentEmail: form.email,
          studentName: form.name,
          classLevel: form.class_level,
        }),
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Sign up complete. Awaiting admin approval.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6}/>
      <select name="class_level" value={form.class_level} onChange={handleChange}>
        <option value="JSC">JSC</option>
        <option value="SSC">SSC</option>
        <option value="HSC">HSC</option>
      </select>
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
}

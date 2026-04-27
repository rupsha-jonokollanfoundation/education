import adminInit from "../../utils/firebaseAdmin";
import { firestore } from "firebase-admin";

adminInit();

export default async function handler(req, res) {
  const { studentId } = req.query;
  try {
    // Admin approves the student: set status = "active"
    await firestore().collection("students").doc(studentId).update({ status: "active" });
    res.send("Student Approved! ✅");
  } catch (e) {
    res.status(500).send("Approval failed: " + e.message);
  }
}

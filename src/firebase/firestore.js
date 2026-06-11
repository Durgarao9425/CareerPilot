import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { v4 as uuidv4 } from 'uuid';

// ─── User Profile ───────────────────────────────────────────────────────────

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
};

// ─── Resumes ─────────────────────────────────────────────────────────────────

export const createResume = async (uid, resumeData) => {
  const id = uuidv4();
  const ref = doc(db, 'users', uid, 'resumes', id);
  const payload = {
    id,
    ...resumeData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, payload);
  return { id, ...payload };
};

export const getResumes = async (uid) => {
  const q = query(
    collection(db, 'users', uid, 'resumes'),
    orderBy('updatedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getResume = async (uid, resumeId) => {
  const snap = await getDoc(doc(db, 'users', uid, 'resumes', resumeId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateResume = async (uid, resumeId, data) => {
  const ref = doc(db, 'users', uid, 'resumes', resumeId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

export const deleteResume = async (uid, resumeId) => {
  await deleteDoc(doc(db, 'users', uid, 'resumes', resumeId));
};

// ─── Cover Letters ────────────────────────────────────────────────────────────

export const saveCoverLetter = async (uid, data) => {
  const ref = collection(db, 'users', uid, 'coverLetters');
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
};

export const getCoverLetters = async (uid) => {
  const q = query(
    collection(db, 'users', uid, 'coverLetters'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteCoverLetter = async (uid, letterId) => {
  await deleteDoc(doc(db, 'users', uid, 'coverLetters', letterId));
};

// ─── ATS Reports ─────────────────────────────────────────────────────────────

export const saveATSReport = async (uid, data) => {
  const ref = collection(db, 'users', uid, 'atsReports');
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
};

export const getATSReports = async (uid) => {
  const q = query(
    collection(db, 'users', uid, 'atsReports'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteATSReport = async (uid, reportId) => {
  await deleteDoc(doc(db, 'users', uid, 'atsReports', reportId));
};

// ─── Activity Feed ────────────────────────────────────────────────────────────

export const getRecentActivity = async (uid) => {
  const [resumes, letters, reports] = await Promise.all([
    getResumes(uid),
    getCoverLetters(uid),
    getATSReports(uid),
  ]);

  const activities = [
    ...resumes.slice(0, 3).map((r) => ({
      type: 'resume',
      title: r.title || 'Untitled Resume',
      id: r.id,
      time: r.updatedAt,
    })),
    ...letters.slice(0, 2).map((l) => ({
      type: 'coverLetter',
      title: `Cover Letter — ${l.company || 'Unknown'}`,
      id: l.id,
      time: l.createdAt,
    })),
    ...reports.slice(0, 2).map((r) => ({
      type: 'ats',
      title: `ATS Report — ${r.score || 0}%`,
      id: r.id,
      time: r.createdAt,
    })),
  ];

  return activities
    .filter((a) => a.time)
    .sort((a, b) => b.time?.seconds - a.time?.seconds)
    .slice(0, 8);
};

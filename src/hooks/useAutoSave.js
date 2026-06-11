import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectResumeData, selectTemplate, setSaving, setLastSaved } from '@features/resume/resumeSlice';
import { selectUser } from '@features/auth/authSlice';
import { updateResume } from '@fb/firestore';
import toast from 'react-hot-toast';

export const useAutoSave = (resumeId, delay = 2000) => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectResumeData);
  const template = useSelector(selectTemplate);
  const user = useSelector(selectUser);
  const timerRef = useRef(null);
  const initialMount = useRef(true);

  const save = useCallback(async () => {
    if (!user?.uid || !resumeId) return;
    dispatch(setSaving(true));
    try {
      await updateResume(user.uid, resumeId, { data: resumeData, template });
      dispatch(setLastSaved(new Date().toISOString()));
    } catch (err) {
      console.error('Auto-save failed:', err);
      toast.error('Auto-save failed');
    } finally {
      dispatch(setSaving(false));
    }
  }, [user, resumeId, resumeData, template, dispatch]);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resumeData, template, save, delay]);

  return { save };
};

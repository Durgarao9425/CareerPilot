import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@layouts/DashboardLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { selectUser } from '@features/auth/authSlice';
import { updateUserProfile } from '@fb/firestore';
import { updateProfile } from 'firebase/auth';
import { auth } from '@fb/config';
import { generateInitials } from '@utils/helpers';
import { UserIcon, EnvelopeIcon, ShieldCheckIcon, CalendarIcon } from '@heroicons/react/24/outline';

const schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(200, 'Max 200 characters').optional(),
});

const Profile = () => {
  const user = useSelector(selectUser);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.displayName || '',
      title: '',
      location: '',
      bio: '',
    },
  });

  const onSubmit = async (data) => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
      await updateUserProfile(user.uid, data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-4xl">
        <div className="page-header">
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                generateInitials(user?.displayName || user?.email || 'U')
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-surface-900 dark:text-white">
                {user?.displayName || 'User'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-surface-500 mt-1">
                <EnvelopeIcon className="w-4 h-4" />
                {user?.email}
              </div>
              <span className="badge badge-primary mt-2">Free Plan</span>
            </div>
          </div>
        </motion.div>

        {/* Info Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: UserIcon, label: 'Account Type', value: 'Free' },
            { icon: ShieldCheckIcon, label: 'Verified', value: user?.email ? 'Yes' : 'No' },
            { icon: CalendarIcon, label: 'Member Since', value: '2024' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-1 text-primary-500" />
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{value}</p>
              <p className="text-xs text-surface-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="font-semibold font-display text-surface-900 dark:text-white mb-5">Edit Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" error={errors.displayName?.message} {...register('displayName')} />
            <Input label="Professional Title" placeholder="Software Engineer" error={errors.title?.message} {...register('title')} />
            <Input label="Location" placeholder="New York, NY" error={errors.location?.message} {...register('location')} />
            <div>
              <label className="label">Bio <span className="text-surface-400 font-normal">(optional)</span></label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="A brief bio about yourself..."
                {...register('bio')}
              />
              {errors.bio && <p className="text-xs text-danger-500 mt-1">{errors.bio.message}</p>}
            </div>
            <Button type="submit" loading={saving} className="w-full">Save Changes</Button>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

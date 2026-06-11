import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthLayout from '@layouts/AuthLayout';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { resetPassword } from '@fb/auth';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword(data.email);
      setSent(true);
    } catch {
      toast.error('Failed to send reset email. Check the address and try again.');
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll send you a link to reset it">
      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-success-500/10 flex items-center justify-center">
            <CheckCircleIcon className="w-8 h-8 text-success-500" />
          </div>
          <h3 className="text-white font-semibold text-lg">Email Sent!</h3>
          <p className="text-surface-400 text-sm">
            Check your inbox for a password reset link. It may take a few minutes.
          </p>
          <Link to="/login" className="inline-block text-primary-400 hover:text-primary-300 text-sm font-medium">
            ← Back to Sign In
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            className="bg-white/5 border-white/10 text-white placeholder-surface-500 focus:border-primary-500"
            {...register('email')}
          />
          <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
            Send Reset Link
          </Button>
          <p className="text-center text-sm text-surface-400">
            <Link to="/login" className="text-primary-400 hover:text-primary-300">← Back to Sign In</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;

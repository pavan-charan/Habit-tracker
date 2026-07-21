'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, LoginFormData } from '@/lib/validators';
import { apiClient } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.vance@personalos.dev',
      password: 'SecurePassword123!',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiClient.post('/auth/login', data);
      const { access_token, refresh_token } = res.data;
      localStorage.setItem('personalos_access_token', access_token);
      localStorage.setItem('personalos_refresh_token', refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07080b] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-neutral-800 shadow-2xl relative z-10 bg-neutral-900/80 backdrop-blur-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-900/40 mx-auto mb-4">
            P
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-neutral-400 mt-1.5">
            Sign in to access your PersonalOS Telemetry Dashboard
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            placeholder="alex.vance@personalos.dev"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Telemetry
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <span className="text-neutral-400">Don&apos;t have an account?</span>
          <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Create Account
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Encrypted JWT Authentication Standard</span>
        </div>
      </div>
    </div>
  );
}

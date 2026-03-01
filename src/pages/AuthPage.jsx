// src/pages/AuthPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../firebase/authService';
import { User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('كلمة المرور غير متطابقة');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        // تسجيل دخول
        await loginUser(formData.email, formData.password);
      } else {
        // تسجيل جديد
        await registerUser(formData.email, formData.password, formData.name);
      }
      navigate('/'); // 👈 حول للصفحة الرئيسية مش السلة
    } catch (error) {
      console.error('Auth error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('البريد الإلكتروني مستخدم بالفعل');
      } else if (error.code === 'auth/invalid-credential') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        setError('حدث خطأ. حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-heading font-bold text-center text-text-primary">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="mt-2 text-center text-text-muted">
            {isLogin ? 'مرحباً بعودتك!' : 'أنشئ حساب لتتمكن من الطلب'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-lg text-sm text-center border border-danger/20">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name field - for registration only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  الاسم كامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                    placeholder="محمد أحمد"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                  placeholder="example@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password - for registration only */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </>
            )}
          </button>

          {/* Toggle between login and register */}
          <p className="text-center text-text-muted">
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }}
              className="text-accent hover:text-accent/80 font-medium"
              disabled={loading}
            >
              {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
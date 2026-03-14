import { useAppStore } from '../../../store';
import { useRouter } from 'expo-router';
import { authService } from '../services';

export const useAuth = () => {
  const { user, token, refreshToken, setAuth, logout } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    if (refreshToken) {
      authService.logout(refreshToken).catch(() => {
        // ignore network errors on logout
      });
    }
    logout();
    router.replace('/auth/login');
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    setAuth,
    logout: handleLogout,
  };
};

import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import PageNavigation from '../components/PageNavigation';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';
import { useEffect, useState } from 'react';

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('jack@example.com');
  const [password, setPassword] = useState('qwerty');
  const navigate = useNavigate();
  const { handleLogin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    navigate('/app', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNavigation />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button
            onClick={async e => {
              try {
                await handleLogin(e, email, password);
                navigate('/app', { replace: true });
              } catch (error) {
                console.error(error.message);
              }
            }}
            type="primary"
          >
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}

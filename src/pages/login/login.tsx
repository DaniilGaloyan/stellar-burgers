import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '../../services/store';
import { login } from '../../services/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText(undefined);

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('pendingOrder');
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setErrorText(err || 'Ошибка авторизации');
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

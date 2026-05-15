import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch } from '../../services/store';
import { register } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText(undefined);

    dispatch(register({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setErrorText(err || 'Ошибка регистрации');
      });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

import TextInput from '../components/input/text.tsx';
import Button from '../components/input/button.tsx';
import {useEffect, useState} from 'react';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disableLogin, setDisableLogin] = useState<boolean>(true);

  useEffect(() => {
    setDisableLogin(username.length === 0 || password.length === 0)
  }, [username, password]);

  return ( 
    <>
      <div className="flex flex-col gap-4">
        <TextInput hint="Benutzername" type="text"/>
        <TextInput hint="Passwort" type="password"/>
        <Button title="Login" disabled={disableLogin}/>
      </div>
    </>
  )
}

export default Login;
import TextInput from '../components/input/text.tsx';
import Button from '../components/input/button.tsx';
import {useEffect, useState} from 'react';
import {checkAuth, LOGIN_JWT, setLoggedIn} from '../util/user.ts';
import {useMutation} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {FaEye, FaEyeSlash} from 'react-icons/fa';

const Login = () => {
  checkAuth();
  const [loginRequest, {loading, error}] = useMutation(LOGIN_JWT);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [disableLogin, setDisableLogin] = useState<boolean>(true);

  useEffect(() => {
    setDisableLogin(username.length === 0 || password.length === 0)
  }, [username, password]);

  const login = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    const deviceKind= 'Admin';
    loginRequest({variables: {username, password, deviceKind}}).then(res => {
      setLoggedIn(JSON.stringify(res.data.Auth.loginJwt))
      setContext((_, { headers }) => ({
        headers: {
          ...headers,
          authorization: res.data.Auth.loginJwt.jwtTokens.accessToken,
        },
      }))
    });
  }

  return ( 
    <>
      <div className="flex flex-col gap-2 max-w-2xl mx-auto my-auto p-4">
        <form onSubmit={login} className="flex flex-col gap-2">
          <TextInput error={error} content={username} update={value => setUsername(value)}  hint="Benutzername" type="text"/>
          <TextInput error={error}
            content={password}
            update={value => setPassword(value)}
            prependInnerActionIcon={{
              icon: showPassword ? (<FaEye data-testid="passwordToggle"/>) : (<FaEyeSlash data-testid="passwordToggle"/>),
              action: () => setShowPassword(!showPassword)}}
            hint="Passwort" type={showPassword ? 'text' : 'password'}/>
          <Button title="Login" loading={loading} disabled={disableLogin}/>
        </form>
      </div>
    </>
  )
}

export default Login;
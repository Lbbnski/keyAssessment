import {isLoggedIn, logout, LOGOUT_JWT} from '../../util/user.ts';
import Button from '../input/button.tsx';
import {useMutation} from '@apollo/client';

const Header = () => {
  const [logoutjwt] = useMutation(LOGOUT_JWT)
  const {clientMutationId} = JSON.parse(localStorage.getItem('token')||'{}')
  const logoutCallback = async () => {
    logout();
    if (clientMutationId) {
      await logoutjwt(clientMutationId)
    }
  }
  return (<>
    <div className="flex flex-row w-full border-b border-solid border-gray-300 p-4">
      {isLoggedIn() && <Button className="ml-auto" onClick={logoutCallback} title="Logout"/>}
    </div>
  </>)
}

export default Header
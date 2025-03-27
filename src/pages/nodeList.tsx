import {useEffect, useState} from 'react';

const NodeList = () => {
  const [list, setList] = useState<string[]>([])
  useEffect(() => {
    // GET_CONTENT()
    setList(['Test'])
  }, [])

  return (<>
    {list.map(value =>
      <div>{value}</div>)}
  </>)
}

export default NodeList;
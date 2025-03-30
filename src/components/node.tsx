interface NodeProps {
  title: string
  stretch?: boolean;
}
const Node = ({title}: NodeProps) => {
  return <div className="bg-white p-4 rounded-lg shadow-md mx-auto">
    <p>{title}</p>
  </div>
}

export default Node
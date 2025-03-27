import Spinner from '../spinner.tsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string
  disabled?: boolean
  loading?: boolean
};

const Button = ({title, disabled, loading = false, onClick, ...props}: ButtonProps) => {
  return <button
    disabled={disabled}
    onClick={onClick}
    {...props}>
    {title}
    {loading ?? (
      //https://flowbite.com/docs/components/spinner/
      <Spinner/>)}
  </button>
}

export default Button;
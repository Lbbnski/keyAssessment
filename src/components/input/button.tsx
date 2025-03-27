type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string
  disabled?: boolean
};

const Button = (props: ButtonProps) => {
  return <button
    disabled={props.disabled}
    onClick={props.onClick}
    {...props}>
    {props.title}
  </button>
}

export default Button;
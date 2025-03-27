import classNames from "classnames";
import {useState} from "react";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hint?: string;
  outlined?: boolean;
};
const TextInput = ({hint, outlined = true, ...props}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!event.target.value);
  };

  return (
    <div className="relative">
      {hint && (
        <label
          className={classNames(
            "absolute left-2 transition-all duration-200 pointer-events-none",
            {
              "-top-2.50 text-sm text-gray-600": isFocused || hasValue,
              "top-1/2 -translate-y-1/2 text-gray-400": !isFocused && !hasValue,
            }
          )}
        >
          {hint}
        </label>
      )}
      <input
        className={classNames(
          "w-full px-2 py-1 outline-none",
          {"border border-solid border-b-gray-600": outlined}
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(event) => setHasValue(!!event.target.value)}
        {...props}
      />
    </div>
  );
};

export default TextInput;
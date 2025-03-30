import React, {ReactNode} from 'react';
import classNames from 'classnames';
import {useState} from 'react';
import {ApolloError} from '@apollo/client';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hint?: string;
  outlined?: boolean;
  error?: ApolloError;
  update: (value: string) => void;
  prependInnerActionIcon?: { icon: ReactNode; action: () => void };
};

const TextInput: React.FC<TextInputProps> =
  ({hint, outlined = true, error, update, prependInnerActionIcon, ...props}: TextInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const id = props.id ? props.id : hint?.replace(/\s/g, '');

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!event.target.value);
    };

    return (<>
      <div className={classNames('relative', {'mb-5': error === undefined})}>
        {hint && ( 
          <label
            htmlFor={id}
            className={classNames(
              'absolute left-2 transition-all duration-200 pointer-events-none',
              {
                '-top-3 text-sm bg-white text-gray-600': isFocused || hasValue,
                'top-1/2 -translate-y-1/2 text-gray-400': !isFocused && !hasValue,
              }
            )}
          >
            {hint}
          </label>
        )}
        <input
          id={id}
          className={classNames(
            'w-full px-2 py-1 outline-none',
            {'border border-solid border-b-gray-600': outlined}
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(event) => update(event.target.value)}
          {...props}
        />
        {prependInnerActionIcon && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            onClick={prependInnerActionIcon?.action}
          >
            {prependInnerActionIcon?.icon}
          </button>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error.message}</div>
      )}
    </>
    );
  };

export default TextInput;
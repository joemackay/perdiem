import React from 'react';
import type { PressableProps, View } from 'react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const button = tv({
  slots: {
    container: 'my-2 flex flex-row items-center justify-center rounded-md px-4',
    label: 'font-inter text-sm',
    indicator: 'h-6 text-white',
  },

  variants: {
    variant: {
      default: {
        container: 'rounded-3xl bg-green-600 dark:bg-green-600',
        label: 'text-white dark:text-white',
        indicator: 'text-white dark:text-black',
      },
      secondary: {
        container: 'bg-[#262734]',
        label: 'text-[#AEB0B7]',
        indicator: 'text-white',
      },
      outline: {
        container: 'border border-white',
        label: 'text-black dark:text-white',
        indicator: 'text-black dark:text-white',
      },
      destructive: {
        container: 'bg-red-600',
        label: 'text-white',
        indicator: 'text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-black underline dark:text-white',
        indicator: 'text-black dark:text-white',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-black',
        indicator: 'text-black',
      },
    },
    size: {
      default: {
        container: 'h-10 px-4',
        label: 'text-base',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-2',
      },
      icon: { container: 'h-9 w-9' },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300 dark:bg-neutral-300',
        label: 'text-neutral-600 dark:text-neutral-600',
        indicator: 'text-neutral-400 dark:text-neutral-400',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      textClassName = '',
      children,
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size }),
      [variant, disabled, size]
    );

    const renderContent = () => {
      if (loading) {
        return (
          <ActivityIndicator
            size="small"
            className={styles.indicator()}
            testID={testID ? `${testID}-activity-indicator` : undefined}
          />
        );
      }

      if (children) {
        return (
          <Text
            testID={testID ? `${testID}-label` : undefined}
            className={styles.label({ className: textClassName })}
          >
            {children}
          </Text>
        );
      }

      return (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label({ className: textClassName })}
        >
          {text}
        </Text>
      );
    };

    return (
      <Pressable
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
      >
        {renderContent()}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';
import type { FC, ReactNode, HTMLProps, ElementType } from 'react';
import type * as CSS                                  from 'csstype';
import classnames                                     from 'classnames';

type DivProps = HTMLProps<HTMLDivElement>;

export type FlexProps = {
  direction?: CSS.Properties['flexDirection'];
  align?: CSS.Properties['alignItems'];
  justify?: CSS.Properties['justifyContent'];
  wrap?: CSS.Properties['flexWrap'];
  gap?: CSS.Properties['gap'];
  grow?: boolean;
  component?: ElementType;
  children: ReactNode;
};

const prefix = 'shared-ui-flex' as const;

export const FlexView: FC<DivProps & FlexProps> = ({
  direction,
  align,
  justify,
  wrap,
  gap,
  grow,
  style = {},
  className = '',
  component: Component = 'div',
  ...rest
}) => {
  return (
    <Component
      className={classnames(`${prefix}-display`, {
        [`${prefix}-direction-${direction}`]: direction,
        [`${prefix}-align-${align}`]: align,
        [`${prefix}-justify-${justify}`]: justify,
        [`${prefix}-wrap-${wrap}`]: wrap,
        [`${prefix}-grow`]: grow,
        [className]: className,
      })}
      style={{
        width: '100%',
        ...style,
        ...(typeof gap === 'undefined'
          ? {}
          : {
              gap: `${gap} !important`,
            }),
      }}
      {...rest}
    />
  );
};

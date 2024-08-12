import type { FC } from 'react';

import type { IconProps } from './IconFC';

export type WithOutlined = {
  outlined?: boolean;
};

export type DualIconFC = FC<IconProps & WithOutlined>;

import { parse } from './simple-parser';
import { toJsString } from './simple-array-translations';

export const transformString = input => toJsString(parse(input));

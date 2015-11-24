import { parse } from './simple-parser';
import { toJsTree } from './simple-array-translations';

export const transformString = input => toJsTree(parse(input)).printString();

import { parse } from './simple-parser';
import { toJsString } from './simple-array-translations';

export default input => toJsString(parse(input));

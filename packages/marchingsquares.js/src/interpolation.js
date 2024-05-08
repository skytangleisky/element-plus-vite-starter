/*
 *  Compute the distance of a value 'v' from 'a' through linear interpolation
 *  between the values of 'a' and 'b'
 *
 *  Note, that we assume that 'a' and 'b' have unit distance (i.e. 1)
 */
export const linear = (a, b, v) => a < b ? (v - a) / (b - a) : (a - v) / (a - b)


/*
 *  Compute the distance of a pair of values ('v0', 'v1') from 'a' through linear interpolation
 *  between the values of 'a' and 'b'
 *
 *  This function assumes that exactly one value, 'v0' or 'v1', is actually located
 *  between 'a' and 'b', and choses the right one automagically
 *
 *  Note, that we assume that 'a' and 'b' have unit distance (i.e. 1)
 */
export const linear_ab = (a, b, v0, v1) => {
  let min = Math.min(v0,v1);
  let max = Math.max(v0,v1);
  return a < b ? (a < min ? (min - a) / (b - a) : (max - a) / (b - a)) : (a > max ? (a - max) / (a - b) : (a - min) / (a - b))
}

/*
 *  Compute the distance of a pair of values ('v0', 'v1') from 'a' through linear interpolation
 *  between the values of 'a' and 'b'
 *
 *  This function automagically choses the value 'vN' that is closer to 'a'
 *
 *  Note, that we assume that 'a' and 'b' have unit distance (i.e. 1)
 */
export const linear_a = (a, b, minV, maxV) => a < b ? (minV - a) / (b - a) : (a - maxV) / (a - b);


/*
 *  Compute the distance of a pair of values ('v0', 'v1') from 'a' through linear interpolation
 *  between the values of 'a' and 'b'
 *
 *  This function automagically choses the value 'vN' that is closer to 'b'
 *
 *  Note, that we assume that 'a' and 'b' have unit distance (i.e. 1)
 */
export const linear_b = (a, b, minV, maxV) =>  a < b ? (maxV - a) / (b - a) : (a - minV) / (a - b);

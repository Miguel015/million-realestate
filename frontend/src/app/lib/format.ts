// Un formateador estable entre server y client
export const nf = new Intl.NumberFormat("en-US");

export function fmtMoney(n: number) {
  return nf.format(n);
}

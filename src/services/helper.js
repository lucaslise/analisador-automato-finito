import _ from 'lodash';

export const FINALIZADOR = '#';

export function isAFND(rules) {
  const afnd = rules.filter(({ value }) => {
    const naoTerminais = value.match(/[0-9a-z]/g);

    if (naoTerminais) {
      return JSON.stringify(naoTerminais) !== JSON.stringify(_.uniq(naoTerminais));
    }
  });

  return afnd.length > 0 ? true : false;
}

export function getNaoTerminais(rules) {
  const naoTerminais = rules.map(({ value }) => {
    return value.match(/[0-9a-z]/g);
  });

  return _.sortBy(_.uniq(_.flatten(naoTerminais)));
}

export function findNextRule(value, char) {
  const groups = value.split('|');

  let resp = groups.map(g => {
    g = g.replace(/ /g, '');

    if (g[0] === char) {
      return g[1] || 'X';
    } else if (g[1] === char) {
      return g[0];
    }
  });

  return _.compact(resp);
}

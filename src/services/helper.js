import _ from 'lodash';

export const FINALIZADOR = '#';
export const ALTERNATIVE_VARIABLE = 'X';

export function isAFND(rules) {
  const afnd = rules.filter(({ value }) => {
    const terminais = value.match(/[0-9a-z]/g);

    if (terminais) {
      return JSON.stringify(terminais) !== JSON.stringify(_.uniq(terminais));
    }
  });

  return afnd.length > 0;
}

export function getTerminais(rules) {
  const terminais = rules.map(({ value }) => value.match(/[0-9a-z]/g));

  return _.sortBy(_.uniq(_.flatten(terminais)));
}

export function findNextRule(value, char) {
  const groups = value.split('|');

  const resp = groups.map((g) => {
    g = g.replace(/ /g, '');

    if (g[0] === char) {
      return g[1] || ALTERNATIVE_VARIABLE;
    } if (g[1] === char) {
      return g[0];
    }
  });

  return _.compact(resp);
}

export function getNextVariablesRules(variables, rules, terminal) {
  const next = _.toArray(variables).map((n) => {
    const selectedRule = _.find(rules, o => o.name === n);
    if (selectedRule && selectedRule.value) {
      return findNextRule(selectedRule.value, terminal);
    }
  });

  return _.sortBy(_.uniq(_.compact(_.flatten(next))));
}

export function isFinished(variables, rules) {
  let finaliza = false;
  _.toArray(variables).forEach((n) => {
    if (n === ALTERNATIVE_VARIABLE) {
      finaliza = true;
      return;
    }

    const selectedRule = _.find(rules, o => o.name === n);
    if (selectedRule && selectedRule.value) {
      const isFinished = selectedRule.value.indexOf(FINALIZADOR) > -1;
      if (isFinished) {
        finaliza = true;
      }
    }
  });

  return finaliza;
}

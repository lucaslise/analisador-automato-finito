import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';
import {
  getTerminais, getNextVariablesRules, isFinished,
} from '../services/helper';

class Determinizacao extends Component {
  state = {
    oRules: [],
  };

  componentDidUpdate(nextProps) {
    const rules = nextProps.rules.map(rule => getTerminais(nextProps.originalRules).map((terminal) => {
      const next = getNextVariablesRules(rule.name, nextProps.originalRules, terminal);

      return {
        finished: isFinished(rule.name, this.props.originalRules),
        initialValue: rule.name,
        position: terminal,
        value: next,
      };
    }));

    let groupK = rules.map(rule => this.getGroups(rule, true));
    let groupKF = rules.map(rule => this.getGroups(rule, false));

    groupK = _.uniq(_.flatten(_.compact(groupK)));
    groupKF = _.uniq(_.flatten(_.compact(groupKF)));

    const result = this.calculaMinimizacao(groupK, groupKF, rules);

    if (JSON.stringify(this.state.oRules) !== JSON.stringify(result)) {
      this.setState({
        ...this.state,
        oRules: result,
      });
    }
  }

  compairIsSameGroup = (value1, value2, groups, rules) => {
    let result = false;

    getTerminais(this.props.originalRules).forEach((terminal) => {
      let first = [];
      let second = [];

      rules.forEach((rule) => {
        rule.forEach((r) => {
          if (r.position === terminal && `[${_.toString(r.initialValue)}]` === value1.replace(/ /g, '')) {
            first = `[${r.value.join(',')}]`;
          }

          if (r.position === terminal && `[${_.toString(r.initialValue)}]` === value2.replace(/ /g, '')) {
            second = `[${r.value.join(',')}]`;
          }
        });
      });

      let local = false;
      groups.every((group) => {
        const g = group.map(x => _.toString(x).replace(/ /g, ''));

        if (_.includes(g, first) && _.includes(g, second)) {
          local = true;
        }

        if (first.length === 2 || second.length === 2) {
          local = false;
          return false;
        }
      });

      result = local;

      if (result === false) return null;
    });

    return result;
  };

  rebuildLine = (side, groups, rules) => {
    let newGroupK = [];

    const result = side.map((group) => {
      newGroupK = [group[0]];
      for (let i = 1; i < group.length; i += 1) {
        const isValid = this.compairIsSameGroup(group[0], group[i], groups, rules);

        if (isValid) {
          newGroupK = _.uniq(_.concat(newGroupK, [group[i]]));
        }
      }

      return [newGroupK, _.reject(group, n => _.includes(newGroupK, n))];
    });

    const x1 = result.map(x => x[0]);
    const x2 = result.map(x => x[1]);
    return _.reject(_.compact(_.concat(x1, x2)), x => x.length === 0);
  }

  calculaMinimizacao = (groupK, groupKF, rules) => {
    const result = [{
      valueK: `{ ${groupK.join(', ')} }`,
      valueKF: `{ ${groupKF.join(', ')} }`,
    }];

    let resposta = [];
    let responseLeft = [groupK];
    let responseRight = [groupKF];

    for (let k = 0; k < 4; k += 1) {
      const groups = _.concat(responseLeft, responseRight);

      responseLeft = this.rebuildLine(responseLeft, groups, rules);
      responseRight = this.rebuildLine(responseRight, groups, rules);

      const sss = {
        valueK: responseLeft.map(n => `{ ${n} }`).join(', '),
        valueKF: responseRight.map(n => `{ ${n} }`).join(', '),
      };

      resposta = _.concat(resposta, sss);
    }

    return [
      ...result,
      ...resposta,
    ];
  }

  getGroups = (rule, finished) => {
    const response = _.map(rule, (r) => {
      const res = r.finished === finished && !_.isEmpty(r.initialValue) ? `[${_.toArray(r.initialValue).join(', ')}]` : null;
      return res;
    });

    return _.compact(response);
  }

  render() {
    const columns = [{
      title: 'K',
      align: 'center',
      dataIndex: 'valueK',
    },
    {
      title: 'K - F',
      align: 'center',
      dataIndex: 'valueKF',
    }];

    return (
      <Table title={() => 'Minimização'} bordered dataSource={this.state.oRules} columns={columns} pagination={false} />
    );
  }
}

Determinizacao.propTypes = {
  rules: PropTypes.array.isRequired,
  originalRules: PropTypes.array.isRequired,
};

export default Determinizacao;

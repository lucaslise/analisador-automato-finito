import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Tag } from 'antd';
import _ from 'lodash';
import {
  getTerminais, getNextVariablesRules, isFinished,
} from '../services/helper';
import AutomatoResultante from './AutomatoResultante';

class Determinizacao extends Component {
  state = {
    oRules: [],
    tRules: [],
    groupL: [],
    groupR: [],
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

    const minimization = this.calculaMinimizacao(groupK, groupKF, rules);
    const result = minimization.lines;
    const groupL = minimization.groupL;
    const groupR = minimization.groupR;

    if (JSON.stringify(this.state.oRules) !== JSON.stringify(result)) {
      this.setState({
        ...this.state,
        tRules: rules,
        oRules: result,
        groupL,
        groupR,
      });
    }
  }

  compairIsSameGroup = (value1, value2, groups, rules) => {
    let result = false;

    _.forEach(getTerminais(this.props.originalRules), (terminal) => {
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
      _.forEach(groups, (group) => {
        const g = group.map(x => _.toString(x).replace(/ /g, ''));

        if (_.includes(g, first) && _.includes(g, second)) {
          local = true;
        }

        if (first === '[]' || second === '[]') {
          local = false;
          return false;
        }
      });

      result = local;
      if (result === false) return false;
    });

    return result;
  };

  rebuildLine = (side, groups, rules) => {
    let newGroupK = [];

    const result = side.map((group) => {
      newGroupK = [group[0]];
      for (let i = 1; i < group.length; i += 1) {
        const isValid = this.compairIsSameGroup(group[0], group[i], groups, rules);
        // console.warn(isValid);
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
      valueK: <Tag>{`{ ${groupK.join(', ')} }`}</Tag>,
      valueKF: <Tag>{`{ ${groupKF.join(', ')} }`}</Tag>,
    }];

    let resposta = [];
    let responseLeft = [groupK];
    let responseRight = [groupKF];

    let isPossible = true;
    let groups = [];

    while (isPossible) {
      groups = _.concat(responseLeft, responseRight);

      responseLeft = this.rebuildLine(responseLeft, groups, rules);
      responseRight = this.rebuildLine(responseRight, groups, rules);

      const newLine = {
        valueK: responseLeft.map(n => <Tag>{`{ ${n.join(', ')} }`}</Tag>),
        valueKF: responseRight.map(n => <Tag>{`{ ${n.join(', ')} }`}</Tag>),
      };

      if (JSON.stringify(newLine) === JSON.stringify(resposta[resposta.length - 1])) {
        isPossible = false;
      } else {
        resposta = _.concat(resposta, newLine);
      }
    }

    return {
      groupL: responseLeft,
      groupR: responseRight,
      lines: [
        ...result,
        ...resposta,
      ],
    };
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
      title: 'F',
      align: 'center',
      dataIndex: 'valueK',
    },
    {
      title: 'F - K',
      align: 'center',
      dataIndex: 'valueKF',
    }];

    return (
      <Fragment>
        <Table title={() => 'Minimização'} bordered dataSource={this.state.oRules} columns={columns} pagination={false} />
        <AutomatoResultante
          groupL={this.state.groupL}
          groupR={this.state.groupR}
          rules={this.state.tRules}
          originalRules={this.props.originalRules}
        />
      </Fragment>
    );
  }
}

Determinizacao.propTypes = {
  rules: PropTypes.array.isRequired,
  originalRules: PropTypes.array.isRequired,
};

export default Determinizacao;

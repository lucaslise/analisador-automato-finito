import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, Card } from 'antd';
import _ from 'lodash';
import {
  getNextVariablesRules, getTerminais, FINALIZADOR, isFinished,
} from '../services/helper';
import Minimizacao from './Minimizacao';

class Determinizacao extends Component {
  state = {
    rules: [],
  };

  componentWillReceiveProps() {
    if (!_.isEmpty(this.state.rules)) {
      this.setState({
        rules: [],
      });
    }
  }

  ruleExist = (name) => {
    if (name) {
      const response = _.find(this.state.rules, rule => JSON.stringify(_.toArray(rule.name)) === JSON.stringify(_.toArray(name)));
      return !!response;
    }
  }

  insertNewRule = (name) => {
    if (!this.ruleExist(name)) {
      const rules = [
        ...this.state.rules,
        {
          name,
        },
      ];

      this.setState({
        ...this.state,
        rules,
      });
    }
  }

  render() {
    const addColumns = getTerminais(this.props.rules).map(terminal => ({
      title: terminal,
      key: terminal,
      width: 400,
      align: 'center',
      render: (rule) => {
        const next = getNextVariablesRules(rule.name, this.props.rules, terminal);
        if (next[0]) this.insertNewRule(next);

        return next.length ? `[${next.join(', ')}]` : '-';
      },
    }));

    const columns = [{
      key: 'name',
      width: 200,
      align: 'center',
      render: (rule) => {
        if (rule.initial) {
          return (
            <Fragment>
              {rule.value.indexOf(FINALIZADOR) > -1 ? '* ' : ''}
              <Icon type="arrow-right" style={{ fontSize: 10 }} />
            [
              {rule.name}
]
            </Fragment>
          );
        }

        const finaliza = isFinished(rule.name, this.props.rules);

        const response = finaliza ? `* [${rule.name}]` : `[${rule.name}]`;
        return response;
      },
    },
    ...addColumns,
    // {
    //   title: 'LLC',
    //   width: 75,
    //   align: 'center',
    //   render: () => <Icon type="close" theme="outlined" style={{ color: 'red' }} />,
    // },
    // {
    //   title: 'Vivo',
    //   align: 'center',
    //   width: 75,
    //   render: () => <Icon type="check" theme="outlined" style={{ color: 'green' }} />,
    // }
    ];

    const firstLine = _.head(this.props.rules);

    const { rules } = this.state;
    if (firstLine !== _.head(rules)) {
      rules[0] = firstLine;
    }

    if (this.state.rules !== rules) {
      this.setState({
        ...this.state,
        rules,
      });
    }

    return (
      <Fragment>
        <Table title={() => 'Determinização'} bordered dataSource={rules} columns={columns} pagination={false} style={{ marginBottom: 15 }} />
        <Minimizacao rules={rules} originalRules={this.props.rules} />
      </Fragment>
    );
  }
}

Determinizacao.propTypes = {
  rules: PropTypes.array.isRequired,
};

export default Determinizacao;

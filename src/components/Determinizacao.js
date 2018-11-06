import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Table } from 'antd';
import _ from 'lodash';
import { getNaoTerminais, FINALIZADOR, findNextRule } from '../services/helper';

class Determinizacao extends Component {
  state = {
    rules: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.rules !== this.props.rules) {
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
    const addColumns = getNaoTerminais(this.props.rules).map(naoTerminal => ({
      title: naoTerminal,
      key: naoTerminal,
      width: 400,
      align: 'center',
      render: (rule) => {
        let next = _.toArray(rule.name).map((n) => {
          const selectedRule = _.find(this.props.rules, o => o.name === n);
          if (selectedRule && selectedRule.value) {
            return findNextRule(selectedRule.value, naoTerminal);
          }
        });

        next = _.sortBy(_.uniq(_.compact(_.flatten(next))));

        if (next[0]) {
          this.insertNewRule(next);
        }

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
        let finaliza = false;
        _.toArray(rule.name).forEach((n) => {
          if (n === 'X') {
            finaliza = true;
            return;
          }

          const { rules } = this.props;

          const selectedRule = _.find(rules, o => o.name === n);
          if (selectedRule && selectedRule.value) {
            const isFinished = selectedRule.value.indexOf(FINALIZADOR) > -1;
            if (isFinished) {
              finaliza = true;
            }
          }
        });

        const response = finaliza ? `* [${rule.name}]` : `[${rule.name}]`;
        return response;
      },
    },
    ...addColumns,
    {
      title: 'LLC',
      width: 75,
      align: 'center',
      render: () => <Icon type="close" theme="outlined" style={{ color: 'red' }} />,
    },
    {
      title: 'Vivo',
      align: 'center',
      width: 75,
      render: () => <Icon type="check" theme="outlined" style={{ color: 'green' }} />,
    }];

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
      <Table bordered dataSource={rules} columns={columns} pagination={false} />
    );
  }
}

Determinizacao.propTypes = {
  rules: PropTypes.array.isRequired,
};

export default Determinizacao;

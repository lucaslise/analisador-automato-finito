import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AutoComplete, Button,
} from 'antd';
import _ from 'lodash';

// {
//   name: 'S',
//   value: 'aA | b | cS | c | #',
//   initial: true,
// },
// {
//   name: 'A',
//   value: 'aS | bC | b | cA',
//   initial: false,
// },
// {
//   name: 'B',
//   value: 'aA | cB | cS | c',
//   initial: false,
// },
// {
//   name: 'C',
//   value: 'aS | a | cC',
//   initial: false,
// },

class GramaticaRegular extends Component {
  state = {
    rules: [
      {
        name: 'A',
        value: 'aA | aB | bA',
        initial: true,
      },
      {
        name: 'B',
        value: 'aC',
        initial: false,
      },
      {
        name: 'C',
        value: 'bD',
        initial: false,
      },
      {
        name: 'D',
        value: 'aD | bD | #',
        initial: false,
      },
    ],
  };

  validateInput = (value) => {
    const input = value;

    let upperCase = 0;
    let downCase = 0;

    const result = input.split('').map((character) => {
      if (character === character.toUpperCase()) {
        upperCase += 1;
      } else {
        downCase += 1;
      }
      if (upperCase > 1 || downCase > 1) return;


      return character;
    });

    return result.join('');
  };

  handleChange = rule => (value) => {
    let { rules } = this.state;
    rules = _.map(rules, (r) => {
      if (r.name === rule.name) {
        const splittedRule = value.split(' ::= ');

        let v = splittedRule[1] ? splittedRule[1].replace(/\s+/g, ' ') : '';
        const valueSize = v.length;

        if (rule.value.length < valueSize && v[valueSize - 1] === ' ' && v[valueSize - 2] !== '|') v += '| ';

        r.name = splittedRule[0].replace(' ::=', '').replace('::=', '').replace(/\s+/g, ' ');

        v = v.split(' | ').map(v => this.validateInput(v)).join(' | ');

        r.value = v;
      }

      return r;
    });

    this.setState({
      rules,
      ...this.state,
    });

    this.props.onChangeRules(this.state.rules);
  }

  handleNewRule = () => {
    const { rules } = this.state;

    const currentRuleName = rules[rules.length - 1].name;
    let nextRuleName = 'A';

    if (currentRuleName !== 'S') {
      nextRuleName = this.getNextRuleName(currentRuleName);
    }

    const newRules = [
      ...rules,
      {
        name: nextRuleName,
        value: '',
      },
    ];

    this.props.onChangeRules(newRules);

    this.setState({
      ...this.state,
      rules: newRules,
    });
  }

  handleDeleteRule = rule => () => {
    const { rules } = this.state;

    const newRules = _.reject(rules, r => r === rule);

    this.props.onChangeRules(newRules);

    if (rule.name !== 'S') {
      this.setState({
        ...this.state,
        rules: newRules,
      });
    }
  }

  getFields = () => {
    const { rules } = this.state;
    return _.map(rules, (rule, index) => (
      <div>
        <AutoComplete
          key={index}
          onSearch={this.handleSearch}
          onChange={this.handleChange(rule)}
          value={`${rule.name} ::= ${rule.value}`}
          style={{ width: '250px' }}
        />
        <Button size="small" title="Remover Regra" onClick={this.handleDeleteRule(rule)} icon="delete" type="danger" style={{ marginLeft: 10, display: rule.initial ? 'none' : '' }} />
        <Button size="small" onClick={this.handleNewRule} style={{ marginLeft: 5, display: rules.length === index + 1 ? '-webkit-inline-box' : 'none' }} icon="plus" title="Nova Regra" />
      </div>
    ));
  }

  getNextRuleName = current => String.fromCharCode(current.charCodeAt(0) + 1)

  render() {
    return this.getFields();
  }
}

GramaticaRegular.propTypes = {
  onChangeRules: PropTypes.func.isRequired,
};

export default GramaticaRegular;

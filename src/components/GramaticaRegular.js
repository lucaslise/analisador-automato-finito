import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AutoComplete, Button, Popover, Tag,
} from 'antd';
import _ from 'lodash';

const helpContent = (
  <ul>
    <li>
Exemplo:
      <Tag>S ::= aA | bB | #</Tag>
    </li>
    <li>
Separador deve ser o caracter
      <Tag>|</Tag>
    </li>
    <li>
Finalizador identificado pelo caracter
      <Tag>#</Tag>
    </li>
  </ul>
);

class GramaticaRegular extends Component {
  state = {
    rules: [{
      name: 'S',
      value: '',
      initial: true,
    }],
  };

  handleChange = rule => (value) => {
    let { rules } = this.state;

    rules = _.map(rules, (r) => {
      if (r.name === rule.name) {
        let v = value.slice(6);
        const valueSize = v.length;

        if (rule.value.length < valueSize && v[valueSize - 1] === ' ' && v[valueSize - 2] !== '|') v += '| ';

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
          key={rule.name}
          onSearch={this.handleSearch}
          onChange={this.handleChange(rule)}
          value={`${rule.name} ::= ${rule.value}`}
          width={600}
        />
        <Button size="small" title="Remover Regra" onClick={this.handleDeleteRule(rule)} icon="delete" type="danger" style={{ marginLeft: 10, display: rule.initial ? 'none' : '' }} />
        <Button size="small" onClick={this.handleNewRule} style={{ marginLeft: 5, display: rules.length === index + 1 ? '-webkit-inline-box' : 'none' }}>
            Nova Regra
        </Button>
      </div>
    ));
  }

  getNextRuleName = current => String.fromCharCode(current.charCodeAt(0) + 1)

  render() {
    return (
      <div>
        <Popover content={helpContent} title="Ajuda" trigger="focus">
          <Button icon="question" style={{ float: 'right' }}>Ajuda</Button>
        </Popover>
        {this.getFields()}
      </div>
    );
  }
}

GramaticaRegular.propTypes = {
  onChangeRules: PropTypes.func.isRequired,
};

export default GramaticaRegular;

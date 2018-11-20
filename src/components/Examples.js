import React, { Component } from 'react';
import { Tag, Divider } from 'antd';

class Examples extends Component {
  state = {};

  render() {
    const tagStyle = {
      cursor: 'default',
      display: 'table',
      margin: 5,
    };

    const cardStyle = {
      height: '80vh',
      overflowY: 'auto',
    };

    return (
      <div style={cardStyle}>
        <Divider orientation="left">Exemplo 1</Divider>
        <Tag style={tagStyle}>S ::= aA | bB | #</Tag>
        <Tag style={tagStyle}>A ::= aA | aB | b</Tag>
        <Tag style={tagStyle}>B ::= aS | aA | bB | #</Tag>
        <Divider orientation="left">Exemplo 2</Divider>
        <Tag style={tagStyle}>S ::= aA | bB</Tag>
        <Tag style={tagStyle}>A ::= aS | aC | a</Tag>
        <Tag style={tagStyle}>B ::= bS | bD | b</Tag>
        <Tag style={tagStyle}>C ::= aB</Tag>
        <Tag style={tagStyle}>D ::= bA</Tag>
      </div>
    );
  }
}

Examples.propTypes = {};

export default Examples;

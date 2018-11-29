import React, { Component } from 'react';
import {
  Tag, Divider, Popover, Button, Collapse,
} from 'antd';

const { Panel } = Collapse;

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
        <Collapse>
          <Panel header="Ajuda" key="1">
            <ul>
              <li>
                Separador deve ser o caracter
                {' '}
                <Tag>|</Tag>
              </li>
              <li>
                Finalizador identificado pelo caracter
                {' '}
                <Tag>#</Tag>
              </li>
            </ul>
          </Panel>
          <Panel header="Exemplos" key="2">
            <Divider orientation="left">1</Divider>
            <Tag style={tagStyle}>S ::= aA | bB | #</Tag>
            <Tag style={tagStyle}>A ::= aA | aB | b</Tag>
            <Tag style={tagStyle}>B ::= aS | aA | bB | #</Tag>
            <Divider orientation="left">2</Divider>
            <Tag style={tagStyle}>S ::= aA | bB</Tag>
            <Tag style={tagStyle}>A ::= aS | aC | a</Tag>
            <Tag style={tagStyle}>B ::= bS | bD | b</Tag>
            <Tag style={tagStyle}>C ::= aB</Tag>
            <Tag style={tagStyle}>D ::= bA</Tag>
            <Divider orientation="left">3</Divider>
            <Tag style={tagStyle}>A ::= aA |  aB | bA</Tag>
            <Tag style={tagStyle}>B ::= aC </Tag>
            <Tag style={tagStyle}>C ::= bD</Tag>
            <Tag style={tagStyle}>D ::= aD | bD | #</Tag>
            <Divider orientation="left">4</Divider>
            <Tag style={tagStyle}>S ::= aA | bB | b | cS | c | #</Tag>
            <Tag style={tagStyle}>A ::= aS | a | bC | cA </Tag>
            <Tag style={tagStyle}>B ::= aA | cB | cS | c</Tag>
            <Tag style={tagStyle}>C ::= aS | a | cA | cC</Tag>
          </Panel>
        </Collapse>

      </div>
    );
  }
}

Examples.propTypes = {};

export default Examples;

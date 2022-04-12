import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

const Root = styled.div`
  width: 200px;
  height: 400px;
`;

const Text = styled.p`
  color: orange;
`;

const Index = () => <Text>tessst</Text>;

render(
  <React.StrictMode>
    <Root>
      <Index />
    </Root>
  </React.StrictMode>,
  document.getElementById('root')
);

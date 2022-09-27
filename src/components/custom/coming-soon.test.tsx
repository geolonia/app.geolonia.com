import React from 'react';
import { ComingSoon } from './coming-soon';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';

test('it should render without crash', () => {
  const component = renderer.create(
    <ComingSoon>
      <div style={{ width: 100, height: 100 }}>
        <span>{'hello'}</span>
      </div>
    </ComingSoon>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('it should render the label and inner content', async () => {
  const result = render(
    <ComingSoon label={'coming soon!'}>
      <div style={{ width: 100, height: 100 }}>
        <span>{'hello'}</span>
      </div>
    </ComingSoon>,
  );
  const labels = await result.findAllByText('coming soon!');
  const contents = await result.findAllByText('hello');
  expect(labels).toHaveLength(1);
  expect(contents).toHaveLength(1);
});

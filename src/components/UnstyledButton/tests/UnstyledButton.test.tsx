import React from 'react';
// eslint-disable-next-line no-restricted-imports
import {mountWithAppProvider, trigger} from 'test-utilities/legacy';
import {UnstyledLink} from 'components';

import {UnstyledButton} from '../UnstyledButton';

describe('<Button />', () => {
  describe('children', () => {
    const mockChildren = 'mock children';
    const mockUrl = 'https://google.com';

    it('renders the given children into the button', () => {
      const button = mountWithAppProvider(
        <UnstyledButton>{mockChildren}</UnstyledButton>,
      );
      expect(button.find('button').text()).toContain(mockChildren);
    });

    it('renders the given children into the UnstyledLink', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url={mockUrl}>{mockChildren}</UnstyledButton>,
      );
      expect(button.find(UnstyledLink).text()).toContain(mockChildren);
    });

    // Why is this reporting 2 nodes found?
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('renders the given children into the link when disabled', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url={mockUrl} disabled>
          {mockChildren}
        </UnstyledButton>,
      );
      expect(
        button
          .find('a')
          .findWhere((node) => node.prop('href') === undefined)
          .text(),
      ).toContain(mockChildren);
    });
  });

  describe('id', () => {
    const mockId = 'MockId';

    it('is passed into the button', () => {
      const button = mountWithAppProvider(<UnstyledButton id={mockId} />);
      expect(button.find('button').prop('id')).toBe(mockId);
    });

    it('is passed into the UnstyledLink', () => {
      const button = mountWithAppProvider(
        <UnstyledButton id={mockId} url="https://shopify.com" />,
      );
      expect(button.find(UnstyledLink).prop('id')).toBe(mockId);
    });

    it('is passed into the link when disabled', () => {
      const button = mountWithAppProvider(
        <UnstyledButton id={mockId} url="https://shopify.com" disabled />,
      );
      expect(
        button
          .find('a')
          .findWhere((node) => node.prop('href') === undefined)
          .prop('id'),
      ).toBe(mockId);
    });
  });

  describe('url', () => {
    const mockUrl = 'https://google.com';

    it('renders a link without an `href` when `disabled`', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url={mockUrl} disabled />,
      );
      expect(button.find('a').prop('href')).toBeUndefined();
    });

    it('renders a button when not present', () => {
      const button = mountWithAppProvider(<UnstyledButton />);
      expect(button.find('button').prop('href')).toBeUndefined();
    });

    it('omits subset of props when provided a `url`', () => {
      // Not including `disabled` or `loading`,
      // as that leads to a different code path.
      const mockUnpassedProps = {
        submit: true,
        ariaControls: 'mock aria controls',
        ariaExpanded: true,
        onKeyDown: noop,
        onKeyUp: noop,
        onKeyPress: noop,
      };
      const button = mountWithAppProvider(
        <UnstyledButton url={mockUrl} {...mockUnpassedProps} />,
      );

      expect(button.find(UnstyledLink).prop('url')).toBe(mockUrl);

      expect(button.find(UnstyledLink).prop('submit')).toBeUndefined();
      expect(button.find(UnstyledLink).prop('ariaControls')).toBeUndefined();
      expect(button.find(UnstyledLink).prop('ariaExpanded')).toBeUndefined();
      expect(button.find(UnstyledLink).prop('onKeyDown')).toBeUndefined();
      expect(button.find(UnstyledLink).prop('onKeyUp')).toBeUndefined();
      expect(button.find(UnstyledLink).prop('onKeyPress')).toBeUndefined();
    });
  });

  describe('external', () => {
    const mockUrl = 'https://google.com';

    it('gets passed into the UnstyledLink', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url={mockUrl} external />,
      );
      expect(button.find(UnstyledLink).prop('external')).toBeTruthy();
    });

    it('is false when not set', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url="https://google.com" />,
      );
      expect(button.find(UnstyledLink).prop('external')).toBeFalsy();
    });

    it('is not passed when `url` is missing', () => {
      const button = mountWithAppProvider(<UnstyledButton external />);
      expect(button.find('button').prop('external')).toBeUndefined();
    });

    it('is not passed when `url + disabled`', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url={mockUrl} external disabled />,
      );
      expect(button.find('a').prop('external')).toBeUndefined();
    });
  });

  describe('download', () => {
    const mockUrl = 'https://google.com';

    it('gets passed into the link as a boolean', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url="/foo" download />,
      );
      expect(button.find(UnstyledLink).prop('download')).toBe(true);
    });

    it('gets passed into the link as a string', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url="/foo" download="file.txt" />,
      );
      expect(button.find(UnstyledLink).prop('download')).toBe('file.txt');
    });

    it('is false when not set', () => {
      const button = mountWithAppProvider(<UnstyledButton url={mockUrl} />);
      expect(button.find(UnstyledLink).prop('download')).toBeFalsy();
    });

    it('is not passed when `url` is missing', () => {
      const button = mountWithAppProvider(<UnstyledButton download />);
      expect(button.find('button').prop('download')).toBeUndefined();
    });

    it('is not passed when `url + disabled`', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url={mockUrl} download disabled />,
      );
      expect(button.find('a').prop('download')).toBeUndefined();
    });
  });

  describe('submit', () => {
    it('sets a submit type on the button when present', () => {
      const button = mountWithAppProvider(<UnstyledButton submit />);
      expect(button.find('button').prop('type')).toBe('submit');
    });

    it('sets a button type on the button when not present', () => {
      const button = mountWithAppProvider(<UnstyledButton />);
      expect(button.find('button').prop('type')).toBe('button');
    });
  });

  describe('disabled', () => {
    const mockUrl = 'https://google.com';

    it('passes to `button`', () => {
      const button = mountWithAppProvider(<UnstyledButton disabled />);
      expect(button.find('button').prop('disabled')).toBeTruthy();
    });

    it('does not pass to link', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url={mockUrl} disabled />,
      );
      expect(button.find('a').prop('disabled')).toBeUndefined();
    });
  });

  describe('loading', () => {
    it('sets aria-busy on the button', () => {
      const button = mountWithAppProvider(<UnstyledButton loading />);
      expect(button.find('button').prop('aria-busy')).toBe(true);
    });

    it('does not set aria-busy when `url`', () => {
      const button = mountWithAppProvider(
        <UnstyledButton url="https://google.com" loading />,
      );
      expect(button.find(UnstyledLink).prop('aria-busy')).toBeUndefined();
    });
  });

  describe('accessibilityLabel', () => {
    const accessibilityLabel = 'mock accessibility label';

    it('sets an aria-label on the button', () => {
      const button = mountWithAppProvider(
        <UnstyledButton accessibilityLabel={accessibilityLabel} />,
      );
      expect(button.find('button').prop('aria-label')).toBe(accessibilityLabel);
    });

    it('sets an aria-label on the UnstyledLink', () => {
      const button = mountWithAppProvider(
        <UnstyledButton
          accessibilityLabel={accessibilityLabel}
          url="https://google.com"
        />,
      );
      expect(button.find(UnstyledLink).prop('aria-label')).toBe(
        accessibilityLabel,
      );
    });

    it('sets an aria-label on the link', () => {
      const button = mountWithAppProvider(
        <UnstyledButton
          accessibilityLabel={accessibilityLabel}
          url="https://google.com"
          disabled
        />,
      );
      expect(
        button
          .find('a')
          .findWhere((node) => node.prop('href') === undefined)
          .prop('aria-label'),
      ).toBe(accessibilityLabel);
    });
  });

  describe('role', () => {
    const mockRole = 'menuitem';

    it('is `undefined` by default', () => {
      const button = mountWithAppProvider(<UnstyledButton />);
      expect(button.find('button').prop('role')).toBeUndefined();
    });

    it('passes to button', () => {
      const button = mountWithAppProvider(<UnstyledButton role={mockRole} />);
      expect(button.find('button').prop('role')).toBe(mockRole);
    });

    it('passes to link', () => {
      const button = mountWithAppProvider(
        <UnstyledButton role={mockRole} url="https://google.com" />,
      );
      expect(button.find(UnstyledLink).prop('role')).toBe(mockRole);
    });
  });

  describe('ariaControls', () => {
    it('sets an aria-controls on the button', () => {
      const mockId = 'MockId';
      const button = mountWithAppProvider(
        <UnstyledButton ariaControls={mockId} />,
      );
      expect(button.find('button').prop('aria-controls')).toBe(mockId);
    });
  });

  describe('ariaExpanded', () => {
    it('sets an aria-expended on the button', () => {
      const button = mountWithAppProvider(<UnstyledButton ariaExpanded />);
      expect(button.find('button').prop('aria-expanded')).toBeTruthy();
    });
  });

  describe('pressed', () => {
    it('sets an aria-pressed on the button', () => {
      const warningSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const button = mountWithAppProvider(<UnstyledButton pressed />);
      expect(button.find('button').prop('aria-pressed')).toBeTruthy();

      warningSpy.mockRestore();
    });
  });

  describe('onClick()', () => {
    it('is called when the button is clicked', () => {
      const onClickSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onClick={onClickSpy} />,
      );
      trigger(button.find('button'), 'onClick');
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('is called when the link is clicked', () => {
      const onClickSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onClick={onClickSpy} url="https://google.com" />,
      );
      trigger(button.find(UnstyledLink), 'onClick');
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onMouseEnter()', () => {
    it('is called when the mouse enters button', () => {
      const onMouseEnterSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onMouseEnter={onMouseEnterSpy} />,
      );
      trigger(button.find('button'), 'onMouseEnter');
      expect(onMouseEnterSpy).toHaveBeenCalledTimes(1);
    });

    it('is called when the mouse enters link', () => {
      const onMouseEnterSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton
          onMouseEnter={onMouseEnterSpy}
          url="https://google.com"
        />,
      );
      trigger(button.find(UnstyledLink), 'onMouseEnter');
      expect(onMouseEnterSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onTouchEnter()', () => {
    it('is called when button is pressed', () => {
      const onTouchStartSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onTouchStart={onTouchStartSpy} />,
      );
      trigger(button.find('button'), 'onTouchStart');
      expect(onTouchStartSpy).toHaveBeenCalledTimes(1);
    });

    it('is called when link is pressed', () => {
      const onTouchStartSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton
          onTouchStart={onTouchStartSpy}
          url="https://google.com"
        />,
      );
      trigger(button.find(UnstyledLink), 'onTouchStart');
      expect(onTouchStartSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onFocus()', () => {
    it('is called when the button is focussed', () => {
      const onFocusSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onFocus={onFocusSpy} />,
      );
      trigger(button.find('button'), 'onFocus');
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    it('is called when the link is focussed', () => {
      const onFocusSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onFocus={onFocusSpy} url="https://google.com" />,
      );
      trigger(button.find(UnstyledLink), 'onFocus');
      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onBlur()', () => {
    it('is called when the button is blurred', () => {
      const onBlurSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onBlur={onBlurSpy} />,
      );
      trigger(button.find('button'), 'onBlur');
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('is called when the link is blurred', () => {
      const onBlurSpy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onBlur={onBlurSpy} url="https://google.com" />,
      );
      trigger(button.find(UnstyledLink), 'onBlur');
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onKeyPress()', () => {
    it('is called when a keypress event is registered on the button', () => {
      const spy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onKeyPress={spy}>Test</UnstyledButton>,
      ).find('button');
      trigger(button, 'onKeyPress');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onKeyUp()', () => {
    it('is called when a keyup event is registered on the button', () => {
      const spy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onKeyUp={spy}>Test</UnstyledButton>,
      ).find('button');
      trigger(button, 'onKeyUp');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onKeyDown()', () => {
    it('is called when a keydown event is registered on the button', () => {
      const spy = jest.fn();
      const button = mountWithAppProvider(
        <UnstyledButton onKeyDown={spy}>Test</UnstyledButton>,
      ).find('button');
      trigger(button, 'onKeyDown');
      expect(spy).toHaveBeenCalled();
    });
  });
});

function noop() {}

import { Platform, ViewStyle } from 'react-native';
import { isWeb } from './envDetails';

export const getWebStyles = (webStyles: any): ViewStyle => {
  if (isWeb) {
    return webStyles as ViewStyle;
  }
  return {} as ViewStyle;
};

export const getWebPointerStyles = (): ViewStyle => {
  if (isWeb) {
    return {
      cursor: 'pointer',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
    } as ViewStyle;
  }
  return {} as ViewStyle;
};

export const webButtonStyles = getWebStyles({
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  transition: 'all 0.2s ease',
  ':hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)'
  }
});

export const webContainerStyles = (isDesktop: boolean) => getWebStyles({
  minHeight: '100vh',
  maxWidth: isDesktop ? 1200 : '100%',
  marginHorizontal: isDesktop ? 'auto' : 0,
});

export const webMainStyles = (isDesktop: boolean) => getWebStyles({
  maxWidth: isDesktop ? 800 : '100%',
  marginHorizontal: isDesktop ? 'auto' : 0,
});

export const webInputStyles = getWebStyles({
  outline: 'none',
  ':focus': {
    borderColor: '#6A5AE0',
    borderWidth: 2
  }
});

export const webImageBackgroundStyles = getWebStyles({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
});

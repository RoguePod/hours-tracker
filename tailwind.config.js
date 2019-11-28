module.exports = {
  plugins: [],
  prefix: '',
  theme: {
    colors: {
      black: '#22292f',
      smoke: 'rgba(78, 142, 178, 0.6)',
      transparent: 'transparent',
      white: '#fff',
      blue: {
        200: '#f9fbfd',
        300: '#e6ebef',
        400: '#72a5c1',
        500: '#4e8eb2',
        600: '#3e728f'
      },
      gray: {
        300: '#f1f5f8',
        400: '#dae1e7',
        600: '#8795a1',
        700: '#606f7b'
      },
      green: {
        200: '#e3fcec',
        500: '#5bb14e',
        600: '#1f9d55',
        800: '#0f2f21'
      },
      orange: {
        500: '#f6993f',
        600: '#de751f'
      },
      purple: {
        500: '#9561e2',
        600: '#794acf'
      },
      red: {
        200: '#fcebea',
        500: '#b14e5b',
        600: '#8e3e49',
        800: '#3b0d0c'
      },
      teal: {
        500: '#4dc0b5',
        600: '#38a89d'
      }
    },
    fontFamily: {
      sans: ['Open Sans']
    },
    extend: {
      boxShadow: {
        'outline-error': '0 0 0 2px rgba(245, 101, 101, 0.5)'
      },
      fontSize: {
        xxs: '0.5rem'
      },
      inset: {
        '100': '100%'
      },
      maxWidth: {
        '40': '10rem',
        '44': '11rem',
        '64': '16rem'
      },
      minHeight: {
        '10': '2.5rem',
        '12': '3rem',
        '24': '6rem'
      },
      minWidth: {
        '24': '6rem',
        '52': '13rem',
        '128': '32rem'
      },
      spacing: {
        '128': '32rem'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'disabled'],
    borderWidth: ['responsive', 'last'],
    cursor: ['responsive', 'disabled'],
    margin: ['responsive', 'last']
  }
};

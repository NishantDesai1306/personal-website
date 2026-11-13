import { red, indigo, blue } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: blue[500],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  breakpoints: {
    // Bootstrap 4 grid breakpoints (https://getbootstrap.com/docs/4.1/layout/grid/),
    // so MUI media queries and the `col-*` classes switch at the same widths.
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    }
  }
});

export default theme;

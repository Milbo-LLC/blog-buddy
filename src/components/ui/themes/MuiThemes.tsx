import { createTheme, experimental_sx as sx } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#d9f6f5",
    },
    secondary: {
      main: "#00FF00", // SET TO SECOND COLOR
    },
    error: {
      main: "#FF0000", // SET TO ERROR COLOR
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "white",
          backgroundColor: "#173F5F",
        },
        input: {
          "&::placeholder": {
            opacity: 0.6,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          position: "absolute",
          right: 0,
          top: 50,
          borderRadius: 15,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          width: "100%",
          borderRadius: "10px",
          fieldset: {
            borderWidth: 0,
            backgroundOpacity: 0.4,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: "rgb(0, 0, 0, 0.4)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: "rgb(255, 255, 255, 0.4)",
          },
        },
      },
    },
    MuiTextField: {},
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
        },
      },
    },
  },
});

export default muiTheme;

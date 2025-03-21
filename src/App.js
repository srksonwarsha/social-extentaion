// import logo from './logo.svg';
import './App.css';
// import Form from './component/Form';
// import Form from './Component/Form'

// import { SnackbarProvider } from 'notistack';


import i18next from "i18next";
import { useTranslation } from "react-i18next";
import FormComponent from './Component/Form';
// import FormComponent from './Component/Form';

function App() {
  return (
    // <SnackbarProvider maxSnack={3}>
    <div className="App">
    <FormComponent />
    </div>
    // </SnackbarProvider>
  );
}

export default App;

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/fonts.css";
import "./assets/css/reset.css";
import "react-datepicker/dist/react-datepicker.min.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "./assets/css/style.css";
import "./assets/css/style_tablet.css";
import "./assets/css/style_pc.css";
import { Provider } from "react-redux";
import store from "./store";

import "swiper/css";
import "swiper/css/bundle";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);

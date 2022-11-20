import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { Provider } from "react-redux";
import store from "../components/store";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </Provider>
  );
}

export default MyApp;

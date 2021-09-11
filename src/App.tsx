import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from 'src/store';
import DialogProvider from 'src/providers/dialog/DialogProvider';
import MainContainer from 'src/containers/MainContainer';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const App = () => {
    return (
        <Provider store={store}>
            <DialogProvider>
                <MainContainer />
            </DialogProvider>
        </Provider>
    );
};

render(<App />, mainElement);

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { App, URLOpenListenerEvent } from '@capacitor/app';

const AppUrlListener: React.FC<any> = () => {
    let history = useHistory();
    useEffect(() => {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        const prefix = /\w+:\/\/[\w.]*/
        const slug = event.url.replace(prefix, '');
        console.log("DEEEPLINK", slug);
        if (slug) {
          history.push(slug);
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    }, []);
  
    return null;
  };
  
  export default AppUrlListener;
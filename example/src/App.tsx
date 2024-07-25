import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import * as CookieHandler from 'react-native-cookie-handler';
import { WebView } from 'react-native-webview';
import LogModal from './LogModal';

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [url, setUrl] = useState<string>('https://google.com');
  const [inputUrl, setInputUrl] = useState<string>(url);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, message]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getCookie = useCallback(async () => {
    try {
      const cookies = await CookieHandler.get(url, true);
      addLog(`Cookies: ${JSON.stringify(cookies, null, '\t')}`);
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  }, [url]);

  const getDomainFromUrl = useCallback(() => {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname;
    } catch (e) {
      // Fallback for environments without URL support
      const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
      return matches && matches[1];
    }
  }, [url]);

  const setCookie = useCallback(async () => {
    try {
      const domain = getDomainFromUrl();
      if (!domain) {
        addLog('Invalid URL, cannot set cookie.');
        return;
      }

      const cookie = {
        name: 'myCookie',
        value: 'myValue',
        domain: domain, // Use the domain instead of full URL
        path: '/',
        version: '1',
        expires: new Date(Date.now() + 86400 * 1000).toUTCString(), // 1 day from now
      };
      await CookieHandler.set(url, cookie, true);
      addLog('Cookie set successfully');
      getCookie();
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  }, [getDomainFromUrl, url, getCookie]);

  const clearAllCookies = useCallback(async () => {
    try {
      await CookieHandler.clearAll(true);
      addLog('All cookies cleared');
      getCookie();
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  }, [getCookie]);

  const clearCookiesForURL = useCallback(async () => {
    try {
      await CookieHandler.clearCookiesForURL(url, true);
      addLog('Cookies for URL cleared');
      getCookie();
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  }, [url, getCookie]);

  const clearSelectedCookiesForURL = useCallback(async () => {
    try {
      const cookieNames = ['myCookie'];
      await CookieHandler.clearSelectedCookiesForURL(url, cookieNames, true);
      addLog('Selected cookies for URL cleared');
      getCookie();
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  }, [url, getCookie]);

  useEffect(() => {
    getCookie();
  }, [getCookie]);

  const handleUrlChange = () => {
    setUrl(inputUrl);
    addLog(`URL changed to: ${inputUrl}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputUrl}
        onChangeText={setInputUrl}
        onSubmitEditing={handleUrlChange}
        placeholder="Enter URL"
        placeholderTextColor="gray"
      />
      <WebView
        originWhitelist={['*']}
        source={{ uri: url }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        style={styles.webView}
      />
      <TouchableOpacity style={styles.button} onPress={getCookie}>
        <Text style={styles.buttonText}>Get Cookies</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={setCookie}>
        <Text style={styles.buttonText}>Set Cookie</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={clearAllCookies}>
        <Text style={styles.buttonText}>Clear All Cookies</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={clearCookiesForURL}>
        <Text style={styles.buttonText}>Clear Cookies for URL</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={clearSelectedCookiesForURL}>
        <Text style={styles.buttonText}>Clear Selected Cookies for URL</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Show Logs</Text>
      </TouchableOpacity>

      <LogModal visible={modalVisible} logs={logs} onClose={() => setModalVisible(false)} onClearLogs={clearLogs} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  webView: {
    width: '100%',
    height: '100%',
    marginVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  button: {
    marginVertical: 5,
    padding: 5,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: 'green',
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 5,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
});

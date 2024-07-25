# react-native-cookie-handler

A React Native library for managing cookies on both iOS and Android platforms, including HTTP only cookies.

<img src="https://github.com/user-attachments/assets/70c65c5b-e40a-48f9-9330-e75cda026957" width="300" />
<img src="https://github.com/user-attachments/assets/562d5d25-bfed-44ef-8903-9852e547141f" width="300" />

## Installation

```sh
npm install react-native-cookie-handler
```

or

```sh
yarn add react-native-cookie-handler
```

### Additional Setup for iOS

If you're using this library in an iOS project, make sure to navigate to the `ios` directory and run `pod install` to install the necessary CocoaPods dependencies:

```sh
cd ios
pod install
```

## Supported platforms

| Platforms |     |
| --------- | --- |
| IOS       | ✓   |
| Android   | ✓   |

## Usage

### Importing the Library

```typescript
import * as CookieHandler from 'react-native-cookie-handler';
```

### API

#### `get(url: string, useWebkit?: boolean): Promise<{ [key: string]: string }>`

Get cookies for a specific URL.

```typescript
const cookies = await CookieHandler.get('https://example.com', true);
console.log(cookies);
```

#### `set(url: string, cookie: Cookie, useWebKit?: boolean): Promise<boolean>`

Set a cookie for a specific URL.

```typescript
const cookie = {
  name: 'myCookie',
  value: 'myValue',
  domain: 'example.com',
  path: '/',
  expires: new Date(Date.now() + 86400 * 1000).toUTCString(), // 1 day from now
};
await CookieHandler.set('https://example.com', cookie, true);
```

#### `clearAll(useWebKit?: boolean): Promise<void>`

Clear all cookies.

```typescript
await CookieHandler.clearAll(true);
```

#### `clearCookiesForURL(url: string, useWebkit?: boolean): Promise<void>`

Clear cookies for a specific URL.

```typescript
await CookieHandler.clearCookiesForURL('https://example.com', true);
```

#### `clearSelectedCookiesForURL(url: string, cookieNames: string[], useWebkit?: boolean): Promise<void>`

Clear selected cookies for a specific URL.

```typescript
await CookieHandler.clearSelectedCookiesForURL('https://example.com', ['myCookie'], true);
```

## Contributing

Contributions are welcome! Please check out the [issues](https://github.com/orcunorcun/react-native-cookie-handler/issues) page first to see if your issue has already been reported. If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

MIT

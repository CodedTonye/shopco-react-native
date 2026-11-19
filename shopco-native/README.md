# SHOP.CO — React Native (Expo)

React Native version of the SHOP.CO web project: same Redux Toolkit store and the same
DummyJSON API, with the screens rebuilt as native components.

- Expo SDK 58 (React Native 0.88, React 19)
- Redux Toolkit + React Redux
- React Navigation (bottom tabs + native stack)
- AsyncStorage for the saved sign-in

## Run it

```bash
npm install            # or: npx pnpm install  (then: npx pnpm approve-builds)
npx expo start
```

Scan the QR code with **Expo Go** (use the latest Expo Go from the App Store / Play Store —
it must support SDK 58), or press `a` for an Android emulator / `i` for the iOS simulator.

## Screens

| Web page | Native screen |
| --- | --- |
| Homepage | `Home` tab — hero, brand logos, New Arrivals, Top Selling (View All expands in place), dress styles, reviews |
| Category + Filters | `Shop` tab and `Category` screen — filter bottom sheet, sort chips, pagination |
| Product detail | `ProductDetail` — gallery, colour/size, quantity, tabs, reviews, related |
| Cart | `Cart` tab — quantities, promo code, order summary (badge on the tab) |
| Search (live) | `Search` — debounced search-as-you-type, opened from the search bar |
| Sign in / Sign up | `SignIn`, `SignUp`, plus an `Account` tab |

The top bar (logo, search, cart) is a sticky header on Home and a fixed header on Shop.
The announcement bar's "Sign Up Now" opens `SignUp`.

## Where things live

```
App.js                     Provider, safe area, restores saved sign-in
src/store/                 Redux slices (all API calls are createAsyncThunk here)
src/navigation/index.js    Tabs + stack
src/screens/               One file per screen
src/components/            Header, ProductCard, StarRating, BrandStrip, Footer, ...
src/theme.js               Colours and type sizes from the design
src/assets.js              Image and logo requires
assets/logos, assets/images
```

API calls: `src/store/productsSlice.js` (products, categories, search) and
`src/store/authSlice.js` (`POST /auth/login`, `POST /users/add`). They are unchanged
from the web project except auth storage, which now uses AsyncStorage.

## Fonts

Satoshi (body) and Integral CF (headings) are not bundled: Satoshi is free from Fontshare,
Integral CF is a paid font. Until you add them the phone's default font is used.
To add them: put the font files in `assets/fonts`, install `expo-font`
(`npx expo install expo-font`), load them in `App.js` with `useFonts`, then set the family
names in `src/theme.js` (`fonts.body`, `fonts.display`) and apply them in the styles.

## Notes

- Logos were converted from SVG to PNG so they work without extra native setup.
- DummyJSON has no colour/size data, so the colour and size filters are UI only (as on web).
- Price filter uses preset ranges instead of the web slider.
- Sign in only accepts DummyJSON's test users (e.g. `emilys` / `emilyspass`); sign up is simulated.

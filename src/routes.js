import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { RegionProvider } from './context/RegionContext';

const Landing = lazy(() => import('./pages/landing'));
const Home = lazy(() => import('./pages/home'));
const AboutUs = lazy(() => import('./pages/about'));
const ContactUs = lazy(() => import('./pages/contact'));
const Mission = lazy(() => import('./pages/mission'));
const Vision = lazy(() => import('./pages/vision'));
const Story = lazy(() => import('./pages/story'));
const Packages = lazy(() => import('./pages/packages'));
const PackageInfo = lazy(() => import('./pages/package-info'));
const Destinations = lazy(() => import('./pages/destinations'));
const BackWaters = lazy(() => import('./places/backwaters'));
const Arts = lazy(() => import('./places/arts'));
const Theyyam = lazy(() => import('./places/theyyam'));
const Ayurveda = lazy(() => import('./places/ayurveda'));

function AppRoutes() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="preloader">
            <div className="cssload-speeding-wheel" />
          </div>
        }
      >
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Landing} />
          <Route
            exact
            path="/kerala"
            render={(props) => (
              <RegionProvider region="Kerala">
                <Home {...props} region="Kerala" />
              </RegionProvider>
            )}
          />
          <Route
            exact
            path="/india"
            render={(props) => (
              <RegionProvider region="India">
                <Home {...props} region="India" />
              </RegionProvider>
            )}
          />
          <Route
            exact
            path="/world"
            render={(props) => (
              <RegionProvider region="World">
                <Home {...props} region="World" />
              </RegionProvider>
            )}
          />
          <Route path="/about" component={AboutUs} />
          <Route path="/destinations" component={Destinations} />
          <Route exact path="/packages" component={Packages} />
          <Route exact path="/package/:slug" component={PackageInfo} />
          <Route path="/contact" component={ContactUs} />
          <Route exact path="/mission" component={Mission} />
          <Route path="/vision" component={Vision} />
          <Route path="/our-story" component={Story} />
          <Route path="/backwaters" component={BackWaters} />
          <Route path="/theyyam" component={Theyyam} />
          <Route path="/ayurveda" component={Ayurveda} />
          <Route path="/arts" component={Arts} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;

import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

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
const DestinationInfo = lazy(() => import('./pages/destination-info'));
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
            render={(props) => <Home {...props} region="Kerala" />}
          />
          <Route
            exact
            path="/india"
            render={(props) => <Home {...props} region="India" />}
          />
          <Route
            exact
            path="/world"
            render={(props) => <Home {...props} region="World" />}
          />
          <Route path="/about" component={AboutUs} />
          <Route exact path="/destinations" component={Destinations} />
          <Route exact path="/destination/:slug" component={DestinationInfo} />
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

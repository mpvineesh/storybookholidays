import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
//import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import Home from './pages/home'
import AboutUs from './pages/about'
import ContactUs from './pages/contact'
import Mission from './pages/mission'
import Vision from './pages/vision'
import Story from './pages/story'
import Packages from './pages/packages'
import PackageInfo from './pages/package-info'
import Destinations from './pages/destinations';

class AppRoutes extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
          <Router>
            <Switch>
            <Suspense fallback={<div className="preloader"><div className="cssload-speeding-wheel"></div></div>}>
                <Route exact path="/" component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/about" component={AboutUs} />
                <Route path="/destinations" component={Destinations} />
                <Route exact path="/packages" component={Packages} />
                <Route exact path="/package" component={PackageInfo} />
                <Route path="/contact" component={ContactUs} />
                <Route exact path="/mission" component={Mission} />
                <Route path="/vision" component={Vision} />
                <Route path="/our-story" component={Story} />
                </Suspense>
            </Switch>
        </Router>

                // <Routes basename="/">
                        
                       
                    
                // </Routes>  
          
        );
    }
}

export default AppRoutes;

import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
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
import BackWaters from './places/backwaters'
import Arts from './places/arts'
import Theyyam from './places/theyyam'
import Kerala from './places/kerala'
import Ayurveda from './places/ayurveda'
import AdminDashboard from './pages/admin-dashboard'

class AppRoutes extends React.Component {
    render() {
        return (
          <Router>
            <Switch>
            <Suspense fallback={<div className="preloader"><div className="cssload-speeding-wheel"></div></div>}>
                <Route exact path="/admin" component={AdminDashboard} />
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
                <Route path="/backwaters" component={BackWaters} />
                <Route path="/theyyam" component={Theyyam} />
                <Route path="/ayurveda" component={Ayurveda} />
                <Route path="/kerala" component={Kerala} />
                <Route path="/arts" component={Arts} />
                </Suspense>
            </Switch>
        </Router>

                // <Routes basename="/">
                        
                       
                    
                // </Routes>  
          
        );
    }
}

export default AppRoutes;

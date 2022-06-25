import React, { Suspense, lazy } from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import DatService from '../services/dataService';

function Home() {
    const [packages, setPackages] = React.useState([]);
	React.useEffect(() => {
		const fetchData = async () => {
			let data = await new DatService().getPackages();

			setPackages(data.slice(0,4));
			console.log('data',data)
		}
		fetchData();
	}, []);
  return (
      <React.Fragment>
          <Header/>
            <main class="content">
                <div class="slider">
                    <ul class="slides">
                        <li data-background="/assets/images/slide-kumarakam.jpg">
                            <div class="container">
                                <div class="slide-caption col-md-4">
                                    <h2 class="slide-title">Kumarakom</h2>
                                    <p>Kuttanad backwaters drags the muse out of even the most poetically challenged. So, pack your quill and head for what are arguably the most beautiful acres along the kuttanad backwaters, to palm-fringed canals, clumps of coir retting in water, a fishing boat returning with the day’s catch</p>
                                </div>
                            </div>
                        </li>
                        <li data-background="/assets/images/slide7.jpg">
                            <div class="container">
                                <div class="slide-caption col-md-4">
                                    <h2 class="slide-title">Munnar</h2>
                                    <p>“A trip to Munnar is a journey through picturesque surroundings, but the most sought-after offering of the estates is the unbelievably pure air. There are also wild animals to spot, some trout fishing to be done etc., and the list is endless. But if lazing around is all that you want to do on your holiday, Munnar’s idyllic surroundings let you do that too.”</p>
                                </div>
                            </div>
                        </li>
                        <li data-background="/assets/images/slide3.jpg">
                            <div class="container">
                                <div class="slide-caption col-md-4">
                                    <h2 class="slide-title">Kovalam</h2>
                                    <p>Looking around this sun and sand paradise, its difficult to imagine that Kovalam was once just a pretty fishing village with a prettier beach. That was till the hippies discovered the hidden jewel.</p>
                                </div>
                            </div>
                        </li>

                        
                    </ul>
                    <div class="flexslider-controls">
                        <div class="container">
                            <ol class="flex-control-nav">
                                <li><a>1</a></li>
                                <li><a>2</a></li>
                                <li><a>3</a></li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div class="fullwidth-block features-section">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="feature left-icon wow fadeInLeft" data-wow-delay=".3s">
                                    <i class="icon-ticket"></i>
                                    <h3 class="feature-title">Wayanad</h3>
                                    <p>Wayanad is a confluence where the needs of the body, mind and soul are met. You can trek mountains and bathe under waterfalls balancing yourself on sharp rocks. You can simply lie down and dream as big as the sky’s expanse with a symphony of wild calls in the background. </p>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="feature left-icon wow fadeInLeft">
                                    <i class="icon-plane"></i>
                                    <h3 class="feature-title">Thekkady</h3>
                                    <p>There’s a peculiar charm in watching majestic elephants and bright-eyed tigers in an environment that is truly theirs and it is irresistible. Perhaps that appeal is to be found more in the Periyar Tiger Reserve than in any other sanctuaries in Kerala.</p>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="feature left-icon wow fadeInRight">
                                    <i class="icon-jetski"></i>
                                    <h3 class="feature-title">Valiyaparamba</h3>
                                    <p>The scenic Valiyaparamba backwaters,  numerous little islands, narrow strips of beaches and densely packed groves palm and areca nuts are fed by four swiftly flowing rivers. You can spend a whole day exploring the backwaters by houseboat.</p>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="feature left-icon wow fadeInRight" data-wow-delay=".3s">
                                    <i class="icon-shuttelcock"></i>
                                    <h3 class="feature-title">Athirappilly</h3>
                                    <p>The waterfall is recurring motif in Athirappilly. The Chalakudy river flows placidly through it all, past forests with many elephants, its poise broken only as it races down rocks to form  a canopy of white that’s the waterfall. Its natures gift to Athirappilly , lovingly treasured and unquestioningly shared with noisy strangers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="fullwidth-block offers-section" data-bg-color="#f1f1f1">
                    <div class="container">
                        <h2 class="section-title">The newest holiday offers</h2>
                        <div class="row">



                        {packages.map((pack, index) => {
						 
						 return(<div class="col-md-3 col-sm-6 col-xs-12" key={index}>
                                <article class="offer wow bounceIn">
                                    <figure class="featured-image"><img src={'assets/images/packages/'+pack.image} height="200" class="package-image" alt=""/></figure>
                                    <h2 class="entry-title"><a href="">{pack.title}</a></h2>
                                    <p>{pack.shortDescription}</p>
                                    <a href={'/package?name='+pack.packageName} class="button">See details</a>
                                </article>
                            </div>)
                            })}
                    
                        </div>
                    </div>
                </div>

                <div class="fullwidth-block testimonial-section">
                    <div class="container">
                        <h2 class="section-title">Testimonials</h2>
                        <div class="row">
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="testimonial wow fadeInUp">
                                    <figure class="avatar"><img src="/assets/images/anand.jpeg" alt=""/></figure>
                                    <blockquote class="testimonial-body">
                                        <p>They delivered the service word by word as they told me ... I ensure that I will use this service next time also..</p>
                                        <cite>Anand</cite>
                                        <span>Traveler</span>
                                    </blockquote>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="testimonial wow fadeInUp" data-wow-delay=".2s">
                                    <figure class="avatar"><img src="/assets/images/eraz.jpeg" alt=""/></figure>
                                    <blockquote class="testimonial-body">
                                        <p>Wonderful services provided by Story Book Holidays.  The hotels selection was great and the vehicle was maintained very well.  Thanks to the team who made my family trip a memorable one.</p>
                                        <cite>Eraz</cite>
                                        <span>Traveler</span>
                                    </blockquote>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="testimonial wow fadeInUp" data-wow-delay=".4s">
                                    <figure class="avatar"><img src="/assets/images/gregory.jpeg" alt=""/></figure>
                                    <blockquote class="testimonial-body">
                                        <p>The whole trip turned out to be very pleasant experience and quite economic. The accommodation arranged by Story Book Holidays are very excellent Many thanks to Story Book team for this excellent trip.</p>
                                        <cite>Gregory Vian , Australia</cite>
                                        <span>Traveler</span>
                                    </blockquote>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="testimonial wow fadeInUp" data-wow-delay=".6s">
                                    <figure class="avatar"><img src="/assets/images/vinay.jpeg" alt=""/></figure>
                                    <blockquote class="testimonial-body">
                                        <p>We enjoyed our tour in Kerala with Story Book Holidays. Especially their coordination and willingness to help in each and every city were excellent..</p>
                                        <cite>Vinay A Singh</cite>
                                        <span>Traveler</span>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
    <Footer/>
    </React.Fragment>
  );
}

export default Home;

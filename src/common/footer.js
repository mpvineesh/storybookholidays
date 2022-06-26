import React, { Suspense, lazy } from 'react';

function Footer() {
  return (
    <footer class="site-footer wow fadeInUp">
				<div class="footer-top">
					<div class="container">
						<div class="row">
							<div class="col-md-4 col-sm-6">
								<div class="widget">
									<h3 class="widget-title">About us</h3>
									<p>To help even common man’s dream about travel and exploration to come true. Life is a journey and traveling is a dream for some. When you come to  us, we add scripts to the beauty called travel.</p>
								</div>
							</div>
							<div class="col-md-3 col-sm-6">
								<div class="widget">
									<h3 class="widget-title">Helpful Links</h3>
									<ul class="list-arrow">
										<li><a href="/backwaters">Backwaters</a></li>
										<li><a href="/theyyam">Theyyam</a></li>
										<li><a href="/ayurveda">Ayurveda - Art of Living</a></li>
										<li><a href="/kerala">Introducion of Kerala</a></li>
										<li><a href="/arts">Performing Arts of Kerala</a></li>
									</ul>
								</div>
							</div>
							<div class="col-md-5 col-sm-6">
								<div class="widget widget-customer-info">
									<h3 class="widget-title">Customer Service</h3>
									<div class="cs-info">
										<p>Quality customer service is an experience of feeling valued or heard. Sometimes it’s an intangible component of why a guest may prefer one tourism or hospitality provider over another. There is something about quality customer service that you often can’t put your finger on — but you know it’s there. And it’s a critical factor for tourism success. Hence we follow our traditional system of treating our guests namely
"Athidhi Devo Bhava"  which means to treat your guest as GOD.  </p>
										<p>+91 94464 60533<br/> <a href="mailto:info@storybookholidays.com">info@storybookholidays.com</a></p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="footer-bottom">
					<div class="container">
						<div class="branding pull-left">
							<img src="/assets/images/logo/logo.png" alt="Story Book Holidays" width="120" height="72" class="logo"/>
							<h1 class="site-title"><a href="index.html">Story Book Holidays</a></h1>
							<small class="site-description">Explore the untold stories!</small>
						</div>

						<div class="contact-links pull-right">
							<div>
								<a href="https://goo.gl/maps/1vWdC9P62dLof5bD8"><i class="fa fa-map-marker"></i> Opp. Sreevalsam Auditorium, Theru Road, Nileshwar , Kasaragod</a>
								<a href="tel:+134453455345"><i class="fa fa-phone"></i> +91 94464 60533</a>
								<a href="mailto:info@storybookholidays.com"><i class="fa fa-envelope"></i> info@storybookholidays.com</a>
							</div>
							<div>
								<a href="https://goo.gl/maps/yoGWxrnNHb8XG7Z8A"><i class="fa fa-map-marker"></i> Cochin office :  2nd floor , Thahi complex, Chakkaraparambu road, Post Vennela, Kochi , Kerala</a>
								
							</div>
						</div>
					</div>
				</div>
				<div class="colophon">
					<div class="container">
						<p class="copy">Copyright 2021 Story Book Holidays,  All right reserved.</p>
					</div>
				</div>
				<a href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!" class="wa-float" target="_blank">
					<i class="fa fa-whatsapp wa-float-icon"></i>
				</a>
			</footer>
  );
}

export default Footer;

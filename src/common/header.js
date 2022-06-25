import React, { Suspense, lazy } from 'react';

function Header(props) {
  return (
    <header className={props.parent ? 'site-header wow fadeInDown': 'home site-header wow fadeInDown'}>
		<div class="container">
			<div class="header-content">
				<div class="branding">
					<img src="/assets/images/logo/logo.png" alt="Story Book Holidays" width="120" height="72" class="logo"/>
					<h1 class="site-title"><a href="/">Story Book Holidays</a></h1>
					<small class="site-description">Explore the untold stories!</small>
				</div>
				
				<nav class="main-navigation nav">
					<button type="button" class="menu-toggle"><i class="fa fa-bars"></i></button>
					<ul class="menu">
						<li class="menu-item"><a href="/">Home</a></li>
						<li><a href="/about">About Us <i class="fa fa-angle-down" aria-hidden="true"></i></a>
							<ul>
								<li><a href="/about#our-story">Our Story</a></li>
								<li><a href="/about#mission">Mission</a></li>
								<li><a href="/about#vision">Vision</a></li>
							</ul>
						</li>
						<li><a href="/packages">Holiday Packages <i class="fa fa-angle-down" aria-hidden="true"></i></a>
							<ul>
								<li><a href="/package?name=exotic-kerala">Exotic Kerala Package</a></li>
								<li><a href="/package?name=kerala-backwater">Kerala Back water Tour</a></li>
								<li><a href="/package?name=moemorising-munnar">Memorising Munnar</a></li>
								<li><a href="/package?name=simple-kerala">Simple Kerala Package</a></li>
								<li><a href="/package?name=wayanad-wild">Wayanad Wild</a></li>
								<li><a href="/package?name=amazing-kerala">Amazing Kerala Package</a></li>
								<li><a href="/package?name=best-kerala">Best Kerala Package</a></li>
							</ul>
						</li>
						<li class="menu-item"><a href="/destinations">Destinations</a></li>
						
						<li class="menu-item"><a href="/contact">Contact</a></li>
					</ul>
				</nav>
				
				<div class="social-links">
					<a href="#" class="facebook"><i class="fa fa-facebook"></i></a>
					<a href="#" class="twitter"><i class="fa fa-twitter"></i></a>
					<a href="https://instagram.com/story_book_holidays?igshid=xcyefcxv1e4m" class="instagram"><i class="fa fa-instagram"></i></a>
					<a href="https://wa.me/919446460533?text=Hello%20Storybook%20Holidays!" class="whatsapp"><i class="fa fa-whatsapp"></i></a>
				</div>
			</div>
			{props.parent && props.parent !== '' ?
			<nav class="breadcrumbs">
				<a href="/home">Home</a> &rarr;
				<span>{props.parent||''}</span>
			</nav>
			: null}
		</div>
	</header>
  );
}

export default Header;

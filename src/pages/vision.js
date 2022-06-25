import React, { Suspense, lazy } from 'react';
import Header from '../common/header';
import Footer from '../common/footer';

function Vision() {
  return (
    <React.Fragment>
      <Header parent="Vision"/>
	  <main class="content">
				<div class="fullwidth-block">
					<div class="container">
						<div class="row">
							<div class="col-md-12 wow fadeInLeft">
								<h2 class="section-title">Vision</h2>
								<figure>
									<img src="assets/images/dummy/figure-1.jpg" alt="" height="360" width="100%" />
								</figure>
								<p>To help even common man’s dream about travel and exploration to come true. Life is a journey and traveling is a dream for some. When you come to  us, we add scripts to the beauty called travel.</p>
								</div>
							
						</div>
					</div>

				</div>

				
			</main>

      <Footer/>
    </React.Fragment>
  );
}

export default Vision;

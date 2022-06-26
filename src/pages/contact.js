import React, { Suspense, lazy } from 'react';
import Header from '../common/header';
import Footer from '../common/footer';


function Contact() {
  return (

    <React.Fragment>
      <Header parent="Contact Us"/>
    <main class="content">
				<div class="fullwidth-block">
					<div class="container">
						<div class="alert alert-success" role="alert" id="email-success">
							Thank you for contacting Story Book Holidays. We will get back you soon!
						</div>
						<div class="row">
							<div class="col-md-4 wow fadeInLeft">
								<h4>Story Book Holidays</h4>
								<ul class="list-fa">
									<li><i class="fa fa-map-marker"></i>Opp. Sreevalsam Auditorium, Theru Road, Nileshwar, Kasaragod</li>
									<li><i class="fa fa-map-marker"></i>Cochin office :  2nd floor , Thahi complex, Chakkaraparambu road, Post Vennela, Kochi , Kerala</li>
									<li><i class="fa fa-phone"></i> +91 94464 60533</li>
									<li><i class="fa fa-envelope"></i>info@storybookholidays.com</li>
								</ul>

								<form method="POST" class="contact-form">
									<input type="text" required id="name"  placeholder="Your Name..."/>
									<input type="text" required id="subject" placeholder="Story Book Holidays..."/>
									<input type="text" required id="email" placeholder="Email"/>
									<textarea name=""  required id="message" placeholder="Message..."></textarea>
									<input type="button" required id="sendMail" class="button" value="Send Message"/>
								</form>
							</div>
							<div class="col-md-7 col-md-push-1 wow fadeInRight">
								<div class="map">
								<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.956898566006!2d75.12704641461241!3d12.25119609133138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDE1JzA0LjMiTiA3NcKwMDcnNDUuMyJF!5e0!3m2!1sen!2sin!4v1612680431482!5m2!1sen!2sin" width="600" height="520" frameborder="0" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
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

export default Contact;

import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';

function About() {

  return (
    <React.Fragment>
      <Seo
        title="About Us"
        description="Story Book Holidays is a Kerala-based curated travel agency founded by Justin Jose. Read our story, mission, and the inspiration behind every journey."
        path="/about"
      />
      <Header parent="About"/>
        <main class="content">
          <div class="fullwidth-block">
            <div class="container">
              <div class="row">
                <div class="col-md-12 wow fadeInLeft" id="our-story">
                  <h2 class="section-title">Our Story</h2>
                  <figure>
                    <img src="assets/images/aboutus.jpg" alt="" height="360" width="100%" />
                  </figure>
                  <p>As an ardent and passionate travel lover, I, Justin Jose, have always loved the aspects and prospects of tourism. To help people around the world  to explore and discover this marvelous creation called earth has always fascinated me to the core. This desire and passion has driven me to where I am today.</p>
                  <p>After a bachelor’s degree in Electronics from Hyderabad I joined the hospitality sector as a UNIT manager in a guest house, which happened unexpectedly. People coming there used to be excited when I said that I hail from Kerala. They used to ask me about many things starting from different tourist places in Kerala to different festivities celebrated there, climate, people etc. Quite often our discussions prolonged so much that we lost track of time. What I observed is that most of these conversations resulted in sparking a desire in them to visit Kerala.</p>
                  <p>During my tenure at the guest house I happened to meet a wonderful couple, Mr. and Mrs. Podas from Germany who used to visit India every year. During their stay they expressed their desire to visit my hometown in Kerala, i.e. Bekal. Bekal is a wonderful place with beautiful beaches and forts. This is when I realized that there are more people out there, whom I can help with their trips and I started taking interest in Tourism as a genuine career option. Later I joined Mar Ivanious College, Trivandrum, to pursue Post Graduation in Tourism. The HOD of the Tourism department in the college Mr. P J Varghese helped me a lot. He even also helped me with a part time job as a front office executive in one of the leading 3-star hotels in Trivandrum where I used to work after my college hours. That November Mr. and Mrs. Poldas informed me about their plan to visit Kerala. That was the first time I planned and managed the complete itinerary for a trip. Right from booking a hotel room to food, transportation, visit to local attractions such as Bekal beach, fort, village areas, churches, Temples etc. was arranged for them. Their happiness and satisfaction inspired me to bring many others like them to visit Kerala. During II year tenure of my Post Graduation I got an opportunity to work with KERALA TOURISM INFORMATION CENTER (a government entity). There I used to answer all tour related enquiries about destination, accommodation, festivals, time to visit Kerala etc. I got to learn a lot about Kerala Tourism in detail. This stint also helped me to learn about the tourist’s interest and tastes. </p>
                  <p>After my Post Graduation I joined a 5-star luxury resort in Kumarakom as an Activity Coordinator. I used to take the guests to interior villages of Kumarakom and to watch sunsets, a special attraction there. The guests used to share the details of their visit to different places in Kerala. From them I got to know that their visits were coordinated by different tour operators based in Kerala. After a brief stint there, I joined an inbound Tour operations firm based in Delhi. They brought tourists from Australia and New Zealand to India. I worked there for 2 years. That stay helped me to learn many things of the trade. </p>
                  <p>My passion for inbound tourism drove me to find an opportunity back in Kerala. Finally, I did get a chance in Calicut where my duty was to source people from the Middle East. Multiple visits to different regions like Dubai, Qatar, Abu Dhabi, Muscat etc. increased my confidence in converting the desire to travel in the people I met into reality. This ignited my passion to start doing all this on my own i.e., to start an Agency that focuses on inbound tourism to God’s own country, Kerala, not just from different parts of India but from across the world, far and wide.</p>
                </div>
                
                <div class="col-md-12 wow fadeInLeft" id="mission">
                  <h2 class="section-title">Mission</h2>
                 
                  <p>Our mission is to provide Quality and excellence to our customers promptly and exclusively.</p><p>Traveling with StoryBook stands for inspiration, for often surprising, touching encounters. Guided by the philosophy of \"traveling to yourself and others\", StoryBook invites you to get to know the most impressive regions of the Indian subcontinent and the most beautiful destinations in Kerala</p><p>Kerala is renowned for some of its unique cultural and geographical characteristics. The practices and traditions handed down from generation to generation, alongside some of the natural wonders that we have been blessed with, have attracted people to this land for centuries. From the ancient healthcare system of Ayurveda to our picturesque hill stations and diverse wildlife, we provide you with links to access a wide range of our specialities. We believe it is our duty to share these gifts with the rest of the world.</p><p>We are people who are well-versed in the fun and rigors of travelling. Storybook came together to help other people plan and book their dream vacations.</p>
                </div>
                <div class="col-md-12 wow fadeInLeft" id="vision">
                  <h2 class="section-title">Vision</h2>
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

export default About;

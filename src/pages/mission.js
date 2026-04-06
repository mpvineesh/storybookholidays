import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import DatService from '../services/dataService';

function Mission() {
	const [content, setContent] = React.useState('');
	React.useEffect(() => {
		const fetchData = async () => {
			let data = await new DatService().getContent('mission', 'content');
			setContent(data);
		}
		fetchData();
	}, []);
  return (
    <React.Fragment>
      <Header parent="Mission"/>
            <main class="content">
				<div class="fullwidth-block">
					<div class="container">
						<div class="row">
							<div class="col-md-12 wow fadeInLeft">
								<h2 class="section-title">Mission</h2>
								<figure>
									<img src="assets/images/dummy/figure-1.jpg" alt="" height="360" width="100%" />
								</figure>
								<p dangerouslySetInnerHTML={{__html: content}} />
								</div>
							
						</div>
					</div>

				</div>

				
			</main>

      <Footer/>
    </React.Fragment>
  );
}

export default Mission;

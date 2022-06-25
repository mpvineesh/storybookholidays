import React, { Suspense, lazy } from 'react';
import Header from '../common/header';
import Footer from '../common/footer';

import DatService from '../services/dataService';
import PackageData from '../services/packageData';

function Packages() {
	const [packages, setPackages] = React.useState([]);
	React.useEffect(() => {
		const fetchData = async () => {
			let data = await new DatService().getPackages();

			setPackages(data);
			console.log('data',data)
		}
		fetchData();
	}, []);
  return (
  <React.Fragment>
    <Header parent="Packages"/>
   		<main className="content">
			<div className="fullwidth-block">
				<div className="container">
					
					<div className="filterable-items">
					{packages.map((pack, index) => {
						 
						 return(<div key={index}  className="filterable-item south-america">
								<article className="offer-item">
									<figure className="featured-image">
										<img src={'assets/images/packages/'+pack.image} height="300" class="package-image" alt=""/>
									</figure>
									<h2 className="entry-title"><a href="/packages/test">{pack.title}</a></h2>
									<p>{pack.shortDescription}</p>
									<div className="price">
										<small>{pack.duration}</small>
									</div>
								</article>
							</div>)
					})}
						<div className="filterable-item south-america dummy-package" >
							<article className="offer-item">
								<figure className="featured-image">
									<img src="/assets/images/dummy/offer-thumbnail-1.jpg" alt=""/>
								</figure>
								<h2 className="entry-title"><a href="/packages/test">Efficitur efficitur convallis</a></h2>
								<p>Sed vitae fermentum lacus in augue massa pellentesque mauris vel iaculis sclerisque nulla</p>
								<div className="price">
									<small>/10 days</small>
								</div>
							</article>
						</div>
						
					</div>

					

				</div>

			</div>

			
		</main>
      <Footer/>
    </React.Fragment>
  );
}

export default Packages;

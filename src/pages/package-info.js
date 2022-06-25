import React, { Suspense, lazy } from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import { useParams, useLocation } from 'react-router-dom';

import DatService from '../services/dataService';
import PackageData from '../services/packageData';

function PackageInfo() {
	const [content, setContent] = React.useState([]);
	const [title, setTitle] = React.useState([]);
	const [image, setImage] = React.useState([]);
	const [duration, setDuration] = React.useState('');
	//const [packageName, setPackageName] = React.useState('');
	const [shortDesc, setShortDesc] = React.useState('');
	const params = useParams();
	const search = useLocation().search;  
	const name = new URLSearchParams(search).get('name');
    // print params to console
	const packageName = name;
	//setPackageName(packageName);
	React.useEffect(() => {
		const fetchData = async () => {
			let data = await new DatService().getPackageDetails(packageName);
			let content = await  new DatService().getFileData(packageName);
			setTitle(data.title);
			setDuration(data.duration);
			setShortDesc(data.shortDescription);
			setImage(data.image);
			console.log('data',data, content)
		}
		fetchData();
	}, []);

  return (
  <React.Fragment>
    <Header parent={title}/>
		<main class="content">
			<div class="fullwidth-block">
				<div class="container">
					<div class="row">
						<div class="col-md-12 wow fadeInLeft">
							<h2 class="section-title">{title}</h2>
							<figure>
								<img src={'assets/images/packages/'+image} alt="" height="360" width="100%" />
							</figure>
							<PackageData packageName={packageName}/>
							</div>
						</div>
					</div>
				</div>
			</main>
      	<Footer/>
    </React.Fragment>
  );
}

export default PackageInfo;

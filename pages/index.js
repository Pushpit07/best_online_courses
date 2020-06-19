import Layout from '../components/Layout';
import {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import {API} from '../config';
import Link from 'next/link';

const Home = ({categories}) => {

	const [popular, setPopular] = useState([]);

	useEffect(() => {
		loadPopular();
	}, []);

	const loadPopular = async () => {
		const response = await axios.get(`${API}/link/popular`);
		setPopular(response.data);
	};


	const handleClick = async (linkId) => {
		const response = await axios.put(`${API}/click-count`, {linkId});
		loadPopular();
	};

	const listOfLinks = () => (
		popular.map((l, i) => (
			<div key={i} className="row alert alert-secondary p-2 pb-3">
				<div className="col-md-8" onClick={() => handleClick(l._id)}>
					<a href={l.url} target="_blank">
						<h5 className="pt-2" style={{color: '#202020'}}>{l.title}</h5>
						<h6 className="pt-2" style={{fontSize: '12px', color: 'RoyalBlue',overflow: 'hidden'}}>{l.url}</h6>
					</a>
				</div>

				<div className="col-md-4 pt-2">
					<span className="float-right">{moment(l.createdAt).fromNow()} by {l.postedBy.name}</span>
				</div>

				<div className="col-md-12">
					<span className="badge text-dark" style={{marginLeft: '-4px'}}>{l.type} / {l.medium}</span>
					{l.categories.map((c, i) => (<span key={i} className="badge text-success">{c.name}</span>))}
					<span className="badge text-secondary float-right">{l.clicks} clicks</span>
				</div>
			</div>
		))
	)

	const listCategories = () => categories.map((c, i) => (
		<Link key={i} href={`links/${c.slug}`}>
			<a style={{ borderRadius: '3px', textDecoration: 'none'}} className="bg-light p-3 col-md-4">
				<div>
					<div className="row">
						<div className="col">
							<img 
								src={c.image && c.image.url} 
								alt={c.name} 
								style={{width: '100px', height:'auto'}}
								className="pr-3"
							/>
						</div>
						<div className="col-md-8"><h4 style={{color: '#404040'}}>{c.name}</h4></div>
					</div>
				</div>
			</a>
		</Link>
	));

	return(
		<Layout>
			<div className="row">
				<div className="col-md-12">
					<h1 className="font-weight-bold text-center" style={{fontFamily: 'tisa'}}>Find here the links of all the best courses on the Internet!</h1>
					<hr style={{background: '#C0C0C0'}}/>
					<br/>
					<h2 className="font-weight-bold" style={{marginLeft: '-17px', fontFamily: 'tisa'}}>Browse Courses/Tutorials</h2>
		
					<br/>
				</div>
			</div>

			<div className="row" style={{textDecoration: 'none'}}>
				{listCategories()}
			</div>
			<hr/>

			<div className="row pt-5">
				<h3 className="font-weight-bold pb-3" style={{fontFamily: 'tisa'}}>Top 5 trending today</h3>
				<div className="col-md-12 overflow-hidden">{listOfLinks()}</div>
			</div>
		</Layout>
	);
};

Home.getInitialProps = async () => {
	const response = await axios.get(`${API}/categories`);
	return {
		categories: response.data
	};
};

export default Home;
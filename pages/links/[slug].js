import {useState, useEffect, Fragment} from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import {API, APP_NAME} from '../../config';
import Link from 'next/link';
import Head from 'next/head';
import renderHTML from 'react-render-html';
import moment from 'moment';
//{new Date(l.createdAt).toLocaleString()}  - Awesome
import InfiniteScroll from 'react-infinite-scroller';

const stripHTML = data => data.replace(/<\/?[^>]+(>|$)/g, '');

const Links = ({query, category, links, totalLinks, linksLimit, linkSkip}) => {

	const [allLinks, setAllLinks] = useState(links);
	const [limit, setLimit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);
	const [popular,setPopular] = useState([]);

	const head = () => (
		<Head>
			<title>
				{category.name} | {APP_NAME}
			</title>
			<meta name="description" content={stripHTML(category.content.substring(0, 160))}/>
			<meta property="og:image" content={category.image.url}/>
			<meta property="og:title" content={category.name}/>
			<meta property="og:description" content={stripHTML(category.content.substring(0, 160))}/>
			<meta property="og:image:secure_url" content={category.image.url}/>
		</Head>
	)

	useEffect(() => {
		loadPopular();
	}, []);

	const loadPopular = async () => {
		const response = await axios.get(`${API}/link/popular/${category.slug}`);
		setPopular(response.data);
	};

	const loadUpdatedLinks = async () => {
		const response = await axios.post(`${API}/category/${query.slug}`);
		setAllLinks(response.data.links);
	}

	const handleClick = async linkId => {
		const response = await axios.put(`${API}/click-count`, {linkId});
		loadUpdatedLinks();
	}

	const handlePopularClick = async linkId => {
		const response = await axios.put(`${API}/click-count`, {linkId});
		location.reload();
		loadPopular();
	}

	const listOfPopularLinks = () => (
		popular.map((l, i) => (
			<div key={i} className="row alert alert-secondary p-2 pb-3">
				<div className="col-md-8" onClick={() => handlePopularClick(l._id)}>
					<a href={l.url} target="_blank">
						<h5 className="pt-2">{l.title}</h5>
						<h6 className="pt-2 text-danger" style={{fontSize: '12px'}}>{l.url}</h6>
					</a>
				</div>

				<div className="col-md-12">
					<span className="badge text-secondary" style={{marginLeft: '-4px'}}>{l.type} / {l.medium}</span>
					
					<span className="badge text-secondary float-right">{l.clicks} clicks</span>

					{l.categories.map((c, i) => (<span key={i} className="badge text-success">{c.name}</span>))}
				</div>
			</div>
		))
	)


	const listOfLinks = () => (
		allLinks.map((l, i) => (
			<div key={i} className="row alert alert-info p-2 pb-3">
				<div className="col-md-8" onClick={e => handleClick(l._id)}>
					<a href={l.url} target="_blank">
						<h5 className="pt-2">{l.title}</h5>
						<h6 className="pt-2 text-danger" style={{fontSize: '12px'}}>{l.url}</h6>
					</a>
				</div>
				<div className="col-md-4 pt-2">
					<span className="float-right">
						{moment(l.createdAt).fromNow()} by {l.postedBy.name}
					</span>
					<br/>
					
				</div>
				<div className="col-md-12">
					<span className="badge text-dark" style={{marginLeft: '-4px'}}>
						{l.type} / {l.medium}
					</span>
					
					{l.categories.map((c, i) => (
						<span key={i} className="badge text-success">{c.name}</span>
					))}
					<span className="badge text-secondary float-right">{l.clicks} clicks</span>
				</div>
			</div>
		))
	)


	const loadMore = async () => {
		let toSkip = skip + limit;
		const response = await axios.post(`${API}/category/${query.slug}`, {skip: toSkip, limit});
		setAllLinks([...allLinks, ...response.data.links]);
		setSize(response.data.links.length);
		setSkip(toSkip);
	}


	return (
		<Fragment>
			{head()}
			<Layout>
				<div className="row" style={{marginLeft: '-30px'}}>
					<div className="col-md-12">
						<h1 className="display-4 font-weight-bold">{category.name} - URLs / Links</h1>
						<hr/>
						<div className="col-md-8 lead alert alert-secondary pt-3" style={{display: 'inline-block'}}>{renderHTML(category.content || '')}</div>
						
						<div className="float-right" style={{display: 'inline-block'}}>
							<img src={category.image.url} alt={category.name} style={{width: 'auto', maxHeight: '165px'}}/>
						</div>
						<hr className="col-md-8 float-left"/>
					</div>
					
				</div>
				<br/>


				<InfiniteScroll
					pageStart={0}
					loadMore={loadMore}
					hasMore={size > 0 && size >= limit}
					loader= {
						<img key={0} src="/static/images/loading3.gif" alt="Loading..." className="center"/>
					}
				>
					<div className="row">
						<div className="col-md-8">
							{listOfLinks()}
						</div>
						<div className="col-md-4">
							<h2 className="lead font-weight-bold">Most popular in {category.name}</h2>
							<hr/>
							<div className="p-3">
								{listOfPopularLinks()}
							</div>
						</div>
					</div>
				</InfiniteScroll>
			</Layout>
		</Fragment>
	)
}


Links.getInitialProps = async ({query, req}) => {
	let skip = 0;
	let limit = 2;

	const response = await axios.post(`${API}/category/${query.slug}`, {skip, limit});
	return {
		query,
		category: response.data.category,
		links: response.data.links,
		totalLinks: response.data.links.length,
		linksLimit: limit,
		linkSkip: skip
	};
};
 


export default Links;
import {useState} from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import {API} from '../../../config';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import {getCookie} from '../../../helpers/auth';

const Links = ({token, links, totalLinks, linksLimit, linkSkip}) => {

	const [allLinks, setAllLinks] = useState(links);
	const [limit, setLimit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);

	const confirmDelete = (e, id) => {
		e.preventDefault();
		let answer = window.confirm(`Are you sure you want to delete?`);
		if(answer) {
			handleDelete(id);
		}
	};
	
	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(`${API}/link/admin/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			console.log('Link delete success', response);
			process.browser && window.location.reload();
		} catch (error) {
			console.log('Link delete error', error);
		}
	};

	const listOfLinks = () => (
		allLinks.map((l, i) => (
			<div key={i} className="row alert alert-secondary p-2 pb-3">
				<div className="col-md-8" onClick={e => handleClick(l._id)}>
					<a href={l.url} target="_blank">
						<h5 className="pt-2" style={{color: '#202020'}}>{l.title}</h5>
						<h6 className="pt-2" style={{fontSize: '12px',  color: 'RoyalBlue',overflow: 'hidden'}}>{l.url}</h6>
					</a>
				</div>
				<div className="col-md-4 pt-2">
					<span className="float-right">
						{moment(l.createdAt).fromNow()} by {l.postedBy.name}
					</span>
					<br/>
					<span className="badge text-secondary float-right">{l.clicks} clicks</span>
				</div>

				<div className="col-md-12">
					<span className="badge text-dark">
						{l.type} / {l.medium}
					</span>

					{l.categories.map((c, i) => (
						<span key={i} className="badge text-success">{c.name}</span>
					))}

					<span onClick={(e) => confirmDelete(e, l._id)} className="badge text-danger float-right" >
						<button className=" btn-danger btn-xs" 
								style={{borderRadius: '3px', 
										padding: '4px', 
										paddingLeft: '6px', 
										paddingRight: '6px'}}> Delete </button>
					</span>

					<Link href={`/user/link/${l._id}`}>
						<span  className="badge text-primary float-right">
							<button className=" btn-primary btn-xs" 
									style={{borderRadius: '3px', 
											padding: '4px', 
											paddingLeft: '6px', 
											paddingRight: '6px'}}> Update </button>
						</span>
					</Link>
				</div>
			</div>
		))
	)


	const loadMore = async () => {
		let toSkip = skip + limit;
		
		const response = await axios.post(`${API}/links`, {skip: toSkip, limit}, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		setAllLinks([...allLinks, ...response.data]);
		setSize(response.data.length);
		setSkip(toSkip);
	}

	return (
		<Layout>
			<div className="row" style={{marginLeft: '-30px'}}>
				<div className="col-md-12">
					<h1 className="display-4 font-weight-bold" style={{fontFamily: 'tisa'}}>All URLs / Links</h1>
				</div>
				
			</div>
			<br/>

			<InfiniteScroll
				pageStart={0}
				loadMore={loadMore}
				hasMore={size > 0 && size >= limit}
				loader= {
					<img key={0} src="/static/images/loading3.gif" alt="Loading..." className="center" style={{marginLeft: '380px'}}/>
				}
			>
				<div className="row">
					<div className="col-md-12">
						{listOfLinks()}
					</div>
					
				</div>
			</InfiniteScroll>
		</Layout>
	)
}


Links.getInitialProps = async ({req}) => {
	let skip = 0;
	let limit = 2;

	const token = getCookie('token', req);

	const response = await axios.post(`${API}/links`, {skip, limit}, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return {
		links: response.data,
		totalLinks: response.data.length,
		linksLimit: limit,
		linkSkip: skip,
		token
	};
};
 

export default withAdmin(Links);
import Layout from "../../components/Layout";
import axios from 'axios';
import Link from 'next/link';
import {API} from '../../config';
import Router from 'next/router';
import {getCookie} from '../../helpers/auth';
import withUser from '../withUser';
import moment from 'moment';

const User = ({user, token, userLinks}) => {


	const confirmDelete = (e, id) => {
		e.preventDefault();
		let answer = window.confirm(`Are you sure you want to delete?`);
		if(answer) {
			handleDelete(id);
		}
	};
	
	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(`${API}/link/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			console.log('Link delete success', response);
			Router.replace('/user');
		} catch (error) {
			console.log('Link delete error', error);
		}
	}

	const listOfLinks = () => userLinks.map((l,i) => (
		<div key={i} className="row alert alert-secondary p-2 pb-3">
			<div className="col-md-8">
				<a href={l.url} target="_blank">
					<h5 className="pt-2" style={{color: '#202020'}}>{l.title}</h5>
					<h6 className="pt-2" style={{fontSize: '12px', color: 'RoyalBlue', overflow: 'hidden'}}>{l.url}</h6>
				</a>
			</div>
			<div className="col-md-4 pt-2 float-right" >
				<span className="float-right">{moment(l.createdAt).fromNow()} by {l.postedBy.name}</span>

					

					<Link href={`/user/link/${l._id}`}>
						<span  className="badge text-primary pt-2 float-right">
							<button className=" btn-primary btn-xs" 
									style={{borderRadius: '3px', 
											padding: '4px', 
											paddingLeft: '6px', 
											paddingRight: '6px'}}> Update </button>
						</span>
					</Link>

					<span onClick={(e) => confirmDelete(e, l._id)} className="badge text-danger pt-2 float-right" >
						<button className=" btn-danger btn-xs" 
								style={{borderRadius: '3px', 
										padding: '4px', 
										paddingLeft: '6px', 
										paddingRight: '6px'}}> Delete </button>
					</span>
			</div>
				<div className="col-md-12">
					<span className="badge text-dark" style={{marginLeft: '-4px'}}>{l.type} / {l.medium}</span>
					{l.categories.map((c, i) => (<span key={i} className="badge text-success">{c.name}</span>))}
					<span className="badge text-secondary float-right pt-2">{l.clicks} clicks</span>
				</div>
				<div className="col-md-12">
					
					
				</div>
		</div>
	));


	return (
		<Layout>
			<h1 style={{display: 'inline'}} >{user.name}'s Dashboard    </h1>
			<h5 style={{display: 'inline'}}><span className="text-muted">/ {user.role}</span></h5>
			<hr/>
			<div className="row">
				<div className="col-md-4">
					<ul className="flex-column" style={{listStyleType:'none'}}>
						<li className="nav-item">
							<Link href="/user/link/create">
								<a className="nav-link">
									<button className="btn btn-dark">
										Submit a link
									</button>
								</a>
							</Link>
						</li>
						<li className="nav-item">
							<Link href="/user/profile/update">
								<a className="nav-link">
									<button className="btn btn-dark">
										Update my profile
									</button>
								</a>
							</Link>
						</li>
					</ul>
				</div>
				<div className="col-md-8">
					<h2>Your links</h2>
					<hr/>
					{listOfLinks()}
				</div>
				
			</div>
		</Layout>
	)
}

export default withUser(User);
import Layout from "../../components/Layout";
import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin = ({user}) => <Layout>
	<h1 style={{marginLeft: '15px'}}>Admin Dashboard</h1>
	<hr/>
	<br/>
	<div className="row">
		<div className="col-md-4">
			<ul className=" flex-column" style={{listStyleType:'none'}}>
				<li className="nav-item">
					<a href="/admin/category/create" className="nav-link"><button className="btn btn-primary btn-block">Create category</button></a>
				</li>
				<li className="nav-item">
					<Link href="/admin/category/read">
						<a className="nav-link"><button className="btn btn-primary btn-block">View categories</button></a> 
					</Link>
				</li>
				<li className="nav-item">
					<Link href="/admin/link/read">
						<a className="nav-link"><button className="btn btn-primary btn-block">All Links</button></a> 
					</Link>
				</li>
				<li className="nav-item">
					<Link href="/user/profile/update">
						<a className="nav-link"><button className="btn btn-primary btn-block">Update Profile</button></a> 
					</Link>
				</li>
			</ul>
		</div>
		<div className="col-md-8">

		</div>
	</div>
</Layout>;

export default withAdmin(Admin);
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import {isAuth, logout} from '../helpers/auth';
import 'nprogress/nprogress.css';

Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()

const Layout = ({children}) => {

	const head = () => (
		<React.Fragment>
			<link 
			rel="stylesheet" 
			href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" 
			integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" 
			crossOrigin="anonymous"
			/>
			
			<link rel="stylesheet" href="/static/css/styles.css"/>
		</React.Fragment>
	);

	const nav = () => (
        <ul className="nav sticky-top nav-tabs">
			
			<li className="nav-item">
				<Link href="/">
					<a className="nav-link text-light mb-0 h4" style={{marginTop: '-4px'}}>Home</a>	
				</Link>
			</li>

			<li className="nav-item">
				<Link href="/user/link/create">
					<a className="nav-link text-light mb-0 h5" >Submit a link</a>	
				</Link>
			</li>

			
			{
				process.browser && !isAuth() && (
					<React.Fragment>
						<li className="nav-item ml-auto ">
							<Link href="/login">
								<a className="nav-link text-light mb-0 h5"  >Login</a>	
							</Link>
						</li>

						<li className="nav-item">
							<Link href="/register">
								<a className="nav-link text-light mb-0 h5"  >Register</a>	
							</Link>
						</li>
					</React.Fragment>
				)
			}


			{
				process.browser && isAuth() && isAuth().role === 'admin' && (
					<li className="nav-item ml-auto">
						<Link href="/admin">
							<a className="nav-link text-light mb-0 h5"  >{isAuth().name}</a>	
						</Link>
					</li>
				)
			}


			{
				isAuth() && isAuth().role === 'subscriber' && (
					<li className="nav-item ml-auto">
						<Link href="/user">
							<a className="nav-link text-light mb-0 h5"  >{isAuth().name}</a>	
						</Link>
					</li>
				)
			}
			
			{isAuth() && (
				<li className="nav-item">
					<Link href="/login">
						<a onClick={logout} className="nav-link text-light mb-0 h5"  >
							Logout
						</a>	
					</Link>
				</li>
			)}

		</ul>
	);



	return (
		<React.Fragment>
			{head()} {nav()} <div className="container pt-5 pb-5 ">{children}</div>
		</React.Fragment>
	);
};

export default Layout;
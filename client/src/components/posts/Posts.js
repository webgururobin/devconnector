import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPosts } from '../../actions/post';

import Spinner from '../layouts/Spinner';
import PostItem from './PostItem';

export const Posts = ({ getPosts, post: { posts, loading } }) => {
	useEffect(() => {
		getPosts();
	}, [getPosts]);
	return loading ? (
		<Spinner />
	) : (
		<Fragment>
			<h1 className='large text-primary'>Posts</h1>
			<p className='lead'>
				<i className='fas fa-user'>Welcome to the community</i>
				{/*PostForm*/}
				<div className='posts'>
					{posts.map((post) => (
						<PostItem key={post._id} post={post} />
					))}
				</div>
			</p>
		</Fragment>
	);
};

Posts.propTypes = {
	getPosts: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

const mapDispatchToProps = {
	getPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);

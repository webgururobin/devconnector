import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPost } from '../../actions/post';

import Spinner from '../layouts/Spinner';
import PostItem from '../posts/PostItem';
import { Link } from 'react-router-dom';

export const Post = ({ getPost, post: { post, loading }, match }) => {
	useEffect(() => {
		getPost(match.params.id);
	}, [getPost]);

	return loading || post === null ? (
		<Spinner />
	) : (
		<Fragment>
			<Link to={`/posts`} className='btn'>
				Back to posts
			</Link>
			<PostItem post={post} showActions={false} />
		</Fragment>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

const mapDispatchToProps = { getPost };

export default connect(mapStateToProps, mapDispatchToProps)(Post);

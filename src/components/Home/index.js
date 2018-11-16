import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import agent from "../../agent";
import { CHANGE_SUBREDDIT, CHANGE_PAGE } from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state.common
});

const mapDispatchToProps = dispatch => ({
    onChangeSubreddit: (key, payload) =>
        dispatch({ type: CHANGE_SUBREDDIT, payload, key }),
    onChangePage: pageIndex => dispatch({ type: CHANGE_PAGE, pageIndex })
});

/**
 * ImageModel Component
 * @param  {Object} props [Properties for ImageModel Component]
 * @return Component.
 */
const ImageModel = props => {
    const closeImageModal = () => {
        props.closeImage();
    };

    if (props.value !== null) {
        return (
            <div className="modal is-active">
                <div className="image">
                    <div className="viewPort">
                        <div
                            onClick={closeImageModal}
                            className="modal-background"
                        />
                        <img className="maxWH" src={props.value} alt="" />
                    </div>
                </div>
                <button
                    onClick={closeImageModal}
                    className="modal-close is-large"
                    aria-label="close"
                />
            </div>
        );
    } else {
        return null;
    }
};

/**
 * RedditList Component
 * @param  {Object} props [Properties of a RedditList Component]
 * @return Component.
 */
const RedditList = props => {
    return (
        <div>
            {props.redditArr.map(article => {
                return (
                    <div className="box" key={article.id}>
                        <article className="media">
                            <div className="media-left">
                                <figure className="image is-128x128 hideOverflow">
                                    <img
                                        onClick={() =>
                                            props.onImageClick(article.image)
                                        }
                                        src={article.image}
                                        alt="Article"
                                    />
                                </figure>
                            </div>
                            <div className="media-content">
                                <div className="content">
                                    <p>
                                        <span className="subtitle">
                                            <strong>{article.title}</strong>
                                        </span>
                                        <br />
                                        <span className="article-author">
                                            {article.author}
                                        </span>
                                        <br />
                                        <small>
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={article.url}
                                            >
                                                {article.url}
                                            </a>
                                        </small>
                                    </p>
                                </div>
                                <nav className="level is-mobile article-meta">
                                    <div className="level-left">
                                        <div
                                            className="level-item"
                                            aria-label="reply"
                                        >
                                            <span className="icon is-small">
                                                <i
                                                    className="fas fa-angle-up"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            &nbsp;
                                            {article.upvotes}
                                            &nbsp;Upvotes
                                        </div>
                                        <div
                                            className="level-item"
                                            aria-label="retweet"
                                        >
                                            <span className="icon is-small">
                                                <i
                                                    className="fas fa-comments"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            &nbsp;
                                            {article.commentsCount}
                                            &nbsp;Comments
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </article>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * Pagination component.
 * @param  {Object} props [Properties for Pagination component.]
 * @return Component.
 */
const Pagination = props => {
    let liString = [];
    for (var i = 0; i < props.pages; i++) {
        let iVal = i + 1; // Adding 1 due to pagination text, which can't start from 0.
        if (i === props.pageIndex / 10) {
            liString.push(
                <li key={iVal}>
                    <a
                        onClick={props.clickPage}
                        className="pagination-link is-current"
                    >
                        {iVal}
                    </a>
                </li>
            );
        } else {
            liString.push(
                <li key={iVal}>
                    <a onClick={props.clickPage} className="pagination-link">
                        {iVal}
                    </a>
                </li>
            );
        }
    }

    return (
        <ul id="pagination_list" className="pagination-list">
            {liString}
        </ul>
    );
};

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null // Image state - Show | Hide.
        };
    }

    // Dispatch action on change of Subreddit.
    changeSubreddit = ev => {
        this.props.onChangeSubreddit(ev.label, agent.Home.subreddit);
    };

    // On Click on Image in feed.
    onImageClick = value => {
        this.setState({ image: value });
    };

    // Close ImageModal.
    onCloseImage = () => {
        this.setState({ image: null });
    };

    // Click Page Function.
    clickPage = ev => {
        let pageClicked = (Number(ev.target.innerHTML) - 1) * 10;

        // this.setState({ pageIndex: pageClicked });
        this.props.onChangePage(pageClicked);
    };

    /**
     * Close Image on pressing ESC key.
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    escFunction = event => {
        if (event.keyCode === 27) {
            this.setState({ image: null });
        }
    };

    // Binding ESC key function
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction);
    }

    // Remove event listener.
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction);
    }

    render() {
        let result = [];
        let redditBlock;
        let pagination;

        /**
         * Check whether URL is an Image or not.
         * @param  {String} url [URL of the image.]
         * @return {Boolean}    [Type of URL - True | False]
         */
        const checkURL = url => {
            return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
        };

        if (this.props.data !== null) {
            let data = this.props.data.data.children;

            result = data
                .map(value => ({
                    id: value.data.id,
                    title: value.data.title,
                    url: value.data.url,
                    image: value.data.url,
                    commentsCount: value.data.num_comments,
                    upvotes: value.data.ups,
                    author: value.data.author
                }))
                .filter(value => checkURL(value.url));

            let pages = Math.ceil(result.length / 10);

            if (pages > 1) {
                pagination = (
                    <Pagination
                        clickPage={this.clickPage}
                        pages={pages}
                        pageIndex={this.props.pageIndex}
                    />
                );
            } else {
                pagination = null;
            }

            if (result.length > 10) {
                result = result.slice(
                    this.props.pageIndex,
                    this.props.pageIndex + 10
                );
            }
        }

        if (result.length > 0) {
            redditBlock = (
                <RedditList
                    onImageClick={this.onImageClick}
                    redditArr={result}
                />
            );
        } else {
            redditBlock = <div>Select subreddit to display posts ...</div>;
            pagination = null;
        }

        return (
            <div>
                <nav className="navbar is-spaced has-shadow t-navbar">
                    <div className="container header">
                        <div className="navbar-menu is-active">
                            <div className="navbar-start">
                                <p className="is-size-5">
                                    &nbsp;
                                    {this.props.appName}
                                </p>
                            </div>
                        </div>
                    </div>
                </nav>
                <section className="section home">
                    <div className="container">
                        <div className="m-select-box">
                            <p className="subtitle">Select your subreddit</p>
                            <Select
                                onChange={this.changeSubreddit}
                                options={this.props.subreddits}
                                id="subreddits"
                                className="subreddits"
                            />
                        </div>

                        <div className="m-data">
                            <p className="subtitle">Posts</p>
                            {redditBlock}
                        </div>
                        <nav
                            className="pagination paginate"
                            aria-label="pagination"
                        >
                            {pagination}
                        </nav>
                    </div>
                </section>
                <ImageModel
                    closeImage={this.onCloseImage}
                    value={this.state.image}
                />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

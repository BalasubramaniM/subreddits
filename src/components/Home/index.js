import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import agent from "../../agent";
import { CHANGE_SUBREDDIT } from "../../constants/actionTypes";

const mapStateToProps = state => ({
    ...state.common
});

const mapDispatchToProps = dispatch => ({
    onChangeSubreddit: payload => dispatch({ type: CHANGE_SUBREDDIT, payload })
});

const RedditList = props => {
    return (
        <div>
            {props.redditArr.map(article => {
                return (
                    <div class="box">
                        <article class="media">
                            <div class="media-left">
                                <figure class="image is-64x64">
                                    <img src={article.image} alt="Article" />
                                </figure>
                            </div>
                            <div class="media-content">
                                <div class="content">
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
                                                href={article.url}
                                            >
                                                {article.url}
                                            </a>
                                        </small>
                                    </p>
                                </div>
                                <nav class="level is-mobile article-meta">
                                    <div class="level-left">
                                        <a
                                            class="level-item"
                                            aria-label="reply"
                                        >
                                            <span class="icon is-small">
                                                <i
                                                    class="fas fa-angle-up"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            &nbsp;
                                            {article.upvotes}
                                            &nbsp;Upvotes
                                        </a>
                                        <a
                                            class="level-item"
                                            aria-label="retweet"
                                        >
                                            <span class="icon is-small">
                                                <i
                                                    class="fas fa-comments"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            &nbsp;
                                            {article.commentsCount}
                                            &nbsp;Comments
                                        </a>
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

class Header extends React.Component {
    changeSubreddit = ev => {
        this.props.onChangeSubreddit(agent.Home.subreddit(ev.label));
    };

    render() {
        const subredditsOptions = [
            {
                value: 0,
                label: "alternativeart"
            },
            {
                value: 1,
                label: "pics"
            },
            {
                value: 2,
                label: "gifs"
            },
            {
                value: 3,
                label: "adviceanimals"
            },
            {
                value: 4,
                label: "cats"
            },
            {
                value: 5,
                label: "images"
            },
            {
                value: 6,
                label: "photoshopbattles"
            },
            {
                value: 7,
                label: "hmmm"
            },
            {
                value: 8,
                label: "all"
            },
            {
                value: 9,
                label: "aww"
            }
        ];

        var result = [];

        if (this.props.data !== null) {
            let data = this.props.data.data.children;

            result = data.map(value => ({
                title: value.data.title,
                url: value.data.url,
                image:
                    value.data.thumbnail === "self"
                        ? "https://bulma.io/images/placeholders/128x128.png"
                        : value.data.thumbnail,
                commentsCount: value.data.num_comments,
                upvotes: value.data.ups,
                author: value.data.author
            }));
        }

        let redditBlock;
        if (result.length > 0) {
            redditBlock = <RedditList redditArr={result} />;
        } else {
            redditBlock = <div>Select subreddit to display posts ...</div>;
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
                                options={subredditsOptions}
                                id="subreddits"
                                className="subreddits"
                            />
                        </div>

                        <div className="m-data">
                            <p className="subtitle">Posts</p>
                            {redditBlock}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

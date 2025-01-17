
CREATE TABLE posts (
    postid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_type VARCHAR(50) NOT NULL,
    date_posted DATE NOT NULL,
    likes INT NOT NULL,
    shares INT NOT NULL,
    comments INT NOT NULL
);


CREATE TABLE analytics (
    post_type VARCHAR(50) PRIMARY KEY,
    avg_likes FLOAT NOT NULL,
    avg_comments FLOAT NOT NULL,
    avg_shares FLOAT NOT NULL
);


CREATE OR REPLACE FUNCTION update_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO analytics (post_type, avg_likes, avg_comments, avg_shares)
    SELECT 
        post_type,
        AVG(likes)::FLOAT,
        AVG(comments)::FLOAT,
        AVG(shares)::FLOAT
    FROM posts
    GROUP BY post_type
    ON CONFLICT (post_type) DO UPDATE
    SET 
        avg_likes = EXCLUDED.avg_likes,
        avg_comments = EXCLUDED.avg_comments,
        avg_shares = EXCLUDED.avg_shares;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_analytics
AFTER INSERT OR UPDATE OR DELETE ON posts
FOR EACH STATEMENT
EXECUTE FUNCTION update_analytics();

CREATE TABLE hashtags (
    hashtag_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hashtag TEXT NOT NULL UNIQUE
);

CREATE TABLE post_hashtags (
    postid UUID REFERENCES posts(postid) ON DELETE CASCADE,
    hashtag_id UUID REFERENCES hashtags(hashtag_id) ON DELETE CASCADE,
    PRIMARY KEY (postid, hashtag_id)
);

CREATE TABLE hashtag_analytics (
    hashtag TEXT PRIMARY KEY,
    avg_likes FLOAT NOT NULL,
    avg_comments FLOAT NOT NULL,
    avg_shares FLOAT NOT NULL
);

CREATE OR REPLACE FUNCTION update_hashtag_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO hashtag_analytics (hashtag, avg_likes, avg_comments, avg_shares)
    SELECT 
        h.hashtag,
        AVG(p.likes)::FLOAT AS avg_likes,
        AVG(p.comments)::FLOAT AS avg_comments,
        AVG(p.shares)::FLOAT AS avg_shares
    FROM hashtags h
    JOIN post_hashtags ph ON h.hashtag_id = ph.hashtag_id
    JOIN posts p ON ph.postid = p.postid
    GROUP BY h.hashtag
    ON CONFLICT (hashtag) DO UPDATE
    SET 
        avg_likes = EXCLUDED.avg_likes,
        avg_comments = EXCLUDED.avg_comments,
        avg_shares = EXCLUDED.avg_shares;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hashtag_analytics
AFTER INSERT OR UPDATE OR DELETE ON post_hashtags
FOR EACH STATEMENT
EXECUTE FUNCTION update_hashtag_analytics();

CREATE TRIGGER trigger_update_hashtag_analytics_posts
AFTER INSERT OR UPDATE OR DELETE ON posts
FOR EACH STATEMENT
EXECUTE FUNCTION update_hashtag_analytics();
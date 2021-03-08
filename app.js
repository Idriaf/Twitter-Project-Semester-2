/* Look into using new bias scorer */

const express = require('express');
const bodyParser = require('body-parser');
const app = express()
var config = require('./config');
var Twit = require('twit');
var T = new Twit(config);

var Sentiment = require('sentiment');
var sentimentAnalysis = require('sentiment-analysis');

var sentiment = new Sentiment();
var sentiment_analysis = new sentimentAnalysis();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {status: null});
});

app.post('/', function (req, res) {
  var query = req.body.query;
  var limit = req.body.limit;
  var resultType = req.body.resulttype;

  var params  = {
    q: query,
    count: limit,
    tweet_mode: 'extended',
    lang: 'en',
    result_type: resultType,
  }
  T.get("search/tweets", params,
          function(err, data, response) {
            if (err) {
              console.log('Error: '+err);
            }
            else {
              var tweet_objects = data.statuses;
              var status = `Found ${tweet_objects.length} tweets for term: ${params.q} `;
              var tweets = [];
              for (var i = 0; i < tweet_objects.length; i++) {
                tweets.push(tweet_objects[i].full_text);
              }
              var sentiments = [];
              var newSentAnalysis = [];
              var labels = [];

              var retweetsEach = [];
              var favoritesEach = [];
              var followerEach = [];
              var charEach = [];
              var friendsEach = [];
              var influencer = [];
              var influencerNumber =[];
              var positiveSent = [];
              var neutralSent = [];
              var negativeSent = [];
              var inFluencerList =[];
              var nonInfluencerList = [];
              
            

              for (var i = 0; i < tweets.length; i++) {
                let { score } = sentiment.analyze(tweets[i])
                
                sentiments.push(Math.round(score));
                labels.push(i+1);
                text = tweet_objects[i].display_text_range;
                newSentScore =  sentiments[i];
                newSentScore = newSentScore.toFixed(3);

                charEach.push(Math.max.apply(null, tweet_objects[i].display_text_range))
         
                SentScoreAnalysis = sentimentAnalysis(tweets[i]);
                newSentAnalysis.push(SentScoreAnalysis);
/*                 console.log(newSentAnalysis, "new sent") */
                retweetsEach.push(tweet_objects[i].retweet_count);
                favoritesEach.push(tweet_objects[i].favorite_count);
                followerEach.push(tweet_objects[i].user.followers_count);
                friendsEach.push(tweet_objects[i].user.friends_count);

           /*      console.log(charEach, "CHAR EACH") */
      

                influencer.push(Boolean(friendsEach[i] <= 1000 & followerEach[i] >= 1000000));
                

                influencerNumber.push(friendsEach[i] <= 1000 & followerEach[i] >= 1000000);

              
                positiveSent.push(Number(newSentAnalysis[i]>=.1))

                neutralSent.push(Number(newSentAnalysis[i]> -.1 & newSentAnalysis[i]<.1, "Neutral Sent "))

                negativeSent.push(Number(newSentAnalysis[i]<=-.1, "Negative Sent"))
                
                console.log(positiveSent,"Positive Sent")
                console.log(neutralSent,"Neutral Sent")
                console.log(negativeSent,"Negative Sent")

                



                
               /*  console.log(influencerNumber[i]) */
/*                 influencer.push(friendsEach <= 1000 & followerEach >=1000000);
 */ 
           
 /*                console.log(retweetsEach, "retweet_count")
                console.log(favoritesEach, "favorites")
                console.log(followerEach, "followers")
                console.log(friendsEach, "friends")

                 *
                console.log(influencer)
                console.log(influencerNumber)

                console.log(Boolean(influencer[i]));

            */

            


/*                 console.log(data.statuses) */

              }
/*       console.log(newSentAnalysis, "new sent outside")
 */
              textMax = Math.max.apply(null, text)

     

              var sum = 0;
              for( var i = 0; i < tweets.length; i++ ){
                  sum += newSentAnalysis[i];
              }
              
              avg_sent= (sum / tweets.length);


              var sum = 0;
              for( var i = 0; i < influencerNumber.length; i++ ){
                  sum += influencerNumber[i];
              }
              InfluencerList = [];

              

              
              avg_InfluerencerNumber = (sum / influencerNumber.length)*100,'%';
              nonInfluencer = (100- avg_InfluerencerNumber);

              influencer_list = [avg_InfluerencerNumber,"%", nonInfluencer,"%"];



              var sum = 0;
              for( var i = 0; i < tweets.length; i++ ){
                  sum += positiveSent[i];
              }
              
              averagePositive = (sum / positiveSent.length)*100;

              console.log(averagePositive, "average Poistive SENT")

              var sum = 0;
              for( var i = 0; i < tweets.length; i++ ){
                  sum += neutralSent[i];
              }
              
              averageNuetral = (sum / neutralSent.length)*100;

              console.log(averageNuetral, "average Neutral SENT")

              
              var sum = 0;
              for( var i = 0; i < tweets.length; i++ ){
                  sum += negativeSent[i];
              }
              
              averageNegative= (sum / negativeSent.length)*100;

              console.log(averageNegative, "average Negative SENT")

              sentList = [averagePositive.toFixed(2),averageNuetral.toFixed(2),averageNegative.toFixed(2)];




              
              

              
              avg_InfluerencerNumber = (sum / influencerNumber.length)*100,'%';
              nonInfluencer = (100- avg_InfluerencerNumber);

              influencer_list = [avg_InfluerencerNumber, nonInfluencer];


              
              

              InsightsLis = [];
              InsightsListRetweets = [retweetsEach];
              InsightsListFavorites = [favoritesEach];
              InsightsListFollowers = [followerEach];
              InsightsStatuses = []

              charEachNew = [charEach];


              InsightsList = [retweetsEach,favoritesEach];



               

         /*      console.log(avg_InfluerencerNumber, "avg_InfluerencerNumber")
              console.log(nonInfluencer, "nonInfluencer") */


            
              

              var sum = 0;
              for( var i = 0; i < tweets.length; i++ ){
                  sum += tweet_objects[i].favorite_count;
              }
              


              avg_fav = Math.round(sum / tweets.length);

              var sum = 0;

              for( var i = 0; i < tweets.length; i++ ){
                sum += tweet_objects[i].retweet_count;
            }

              avg_retweet = Math.round(sum / tweets.length);

              retweet_count = tweets.retweet_count;
              var sum = 0;

              for( var i = 0; i < tweets.length; i++ ){
                sum +=  Math.max.apply(null, tweet_objects[i].display_text_range);
            }

              avg_Char = Math.round(sum / tweets.length);


              var sum = 0;

              for( var i = 0; i < tweets.length; i++ ){
                sum +=  Math.round(tweet_objects[i].user.followers_count);

            }

              Average_Followers = Math.round(sum / tweets.length);

/*               console.log(Average_Followers, "average followers")
 */
              var sum = 0;

              for( var i = 0; i < tweets.length; i++ ){
                sum +=  Math.round(tweet_objects[i].user.statuses_count);

            }

              Average_Status_count = Math.round(sum / tweets.length);

/*               console.log(Average_Status_count, "average status count")
 */
              var sum = 0;

              for( var i = 0; i < tweets.length; i++ ){
                sum +=  Math.round(tweet_objects[i].user.friends_count);

            }


            


          
            

              Average_friend_count = Math.round(sum / tweets.length);

              FriendsToFollower = Average_Followers/Average_friend_count;
              FavToRetweets = avg_retweet/avg_fav;
              FollowersToRetweets = Average_Followers/avg_retweet;
              FollowersToFavorites = Average_Followers/avg_fav;
              FollowersToStatuses = Average_Followers/ Average_Status_count;





              
            


            

/*               console.log(Average_friend_count, "average friend count")
 */
              res.render('index', {status: status, error: null,
                tweets: tweets, avg_InfluerencerNumber:avg_InfluerencerNumber, nonInfluencer:nonInfluencer, friendsEach: friendsEach, followerEach: followerEach, retweetsEach: retweetsEach, favoritesEach:favoritesEach, newSentAnalysis: newSentAnalysis, sentiments: sentiments, newSentScore: newSentScore,
                labels: labels,tweet_objects: tweet_objects, influencer: influencer,InsightsListFollowers:InsightsListFollowers, InsightsListFavorites: InsightsListFavorites, Average_friend_count:Average_friend_count,Average_Status_count:Average_Status_count, InsightsListFollowers:InsightsListFollowers, Average_friend_count:Average_friend_count,});
            }
          }
  );
});

app.listen(3000, function () {
  console.log('The app is listening on port 3000!')
});




/*  console.log(data.statuses)
Things to look into for metrics table extracting
1. friends_count
2. statuses_count
5. followers count
3. verified (number of varified accounts)
4. protected user
5. tweet to follow ratio
6. Friends to follow ratio
7. Day of the week
8. Impressions
9. Engagements
10. Favorites
11. Replies
12. Hashtag Clicks
13. Detail Click
*/

// full_text

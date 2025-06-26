const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Google profile received:', profile); // Debug log
      
      try {
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error("No email found in Google profile"));
        }

        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: "customer",
          });
          console.log('New user created:', user); // Debug log
        } else if (!user.googleId) {
          // Merge existing email account with Google auth
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error('Google Strategy Error:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  //console.log('Serializing user:', user.id); // Debug log
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  //console.log('Deserializing user:', id); // Debug log
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"));
    }
    done(null, user);
  } catch (err) {
    console.error('Deserialize Error:', err);
    done(err, null);
  }
});
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {HydratedDocument} from 'mongoose';
import {User, UserModel} from '../models/User';
import bcrypt from 'bcrypt';

export const passportConfig = () => {
  passport.use(
      new LocalStrategy(async (username, password, done) => {
        try {
          const foundUser: HydratedDocument<User> = await UserModel.findOne({
            email: username,
          });

          if (!foundUser) {
            return done(null, false, {message: 'Invalid username'});
          }

          if (!foundUser.emailVerified) {
            return done(null, false, {message: 'User\'s email not verified'});
          }

          const validPassword = await bcrypt.compare(
              password,
              foundUser.password,
          );
          if (!validPassword) {
            return done(null, false, {message: 'Invalid password'});
          }

          return done(null, foundUser);
        } catch (err) {
          if (err) return done(err);
        }
      }),
  );

  passport.serializeUser((user: HydratedDocument<User>, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: any, user: User) => {
      done(err, user);
    });
  });
};

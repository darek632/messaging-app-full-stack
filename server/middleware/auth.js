import passport from "passport"
// actual authentication.
// use the pre-loaded jwt strategy on whatever route requireAuth is called
const requireAuth = passport.authenticate("jwt", { session: false });

export default requireAuth;
const User = require("../models/user");

const seedUsers = async () => {
    const user = await User.fetchAll();
    if (!user.length) {
        return await new User({username: 'Simon', email: 'simon@mail.com'}).save();
    }
}

exports.seedDatabase = async () => {
    await seedUsers();
}

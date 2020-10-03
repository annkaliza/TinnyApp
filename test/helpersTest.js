const { assert, expect } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = testUsers["userRandomID"];
    expect(user).to.deep.equal(expectedOutput);
  });

  it('should return undefined for a invalid or non-existent email', function() {
    const user = getUserByEmail("user3@example.com", testUsers);
    assert.isUndefined(user, 'This user is not defined');
  });
});
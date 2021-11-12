const assert = require('chai').assert;

const { checkEmail, urlsForUser } = require('../helper');

const testUsers = {
  'aaaa': {
    id: 'aaaa',
    email: '101@gmail.com',
    password: '101'
  },
  'zzzz': {
    id: 'zzzz',
    email: '102@gmail.com',
    password: '102'
  }
};

const testUrls = {
  'aaaa': {
    longURL: 'http://www.youtube.com',
    userID: 'david'
  },
  'vvvv': {
    longURL: 'http://www.lighthouse.com',
    userID: 'david'
  },
  'ssss': {
    longURL: 'http://www.facebook.com',
    userID: 'bob'
  }
};

describe('#getUserByEmail', () => {
  it('should return a user with a valid email', () => {
    const user = checkEmail('101@gmail.com', testUsers);
    assert.equal(user, testUsers.aaaa);
  });

  it('Return undefined since email does not exist', () => {
    const user = checkEmail('103@example.com', testUsers);
    assert.equal(user, undefined);
  });
});

describe('#urlsForUser', () => {
  it('should return urls for a valid user', () => {
    const userUrls = urlsForUser('david', testUrls);
    const expectedResult = {
      'aaaa': {
        longURL: 'http://www.youtube.com',
        userID: 'david'
      },
      'vvvv': {
        longURL: 'http://www.lighthouse.com',
        userID: 'david'
      }
    };

    assert.deepEqual(userUrls, expectedResult);
  });

  it('Return an empty object if it does not exist', () => {
    const userUrls = urlsForUser('crystal', testUrls);
    assert.deepEqual(userUrls, {});
  });
});
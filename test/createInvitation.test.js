/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const expect = require('expect');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response0 = require('./response/readUser.response');
const response1 = require('./response/readInvitations.response');

describe('#createInvitations', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/current_user')
    .reply(200, response0.readUser)
    .post('/invitations')
    .reply(200, response1.readInvitations.data[0]);

  before(async () => {
    res = await fastly.createInvitation('john', 'jonny@example.com');
  });

  it('response should be a status 200', () => {
    expect(res.status).toBe(200);
  });

  it('response body should contain all properties', () => {
    expect(res.data).toStrictEqual(response1.readInvitations.data[0]);
  });
});

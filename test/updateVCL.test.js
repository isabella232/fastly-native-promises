'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = 'true';
/* eslint-env mocha */

const nock = require('nock');
const expect = require('expect');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const response = require('./response/updateVCL.response');

describe('#updateVCL', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .put('/service/SU1Z0isxPaozGVKXdv0eY/version/1/vcl/test-vcl')
    .reply(200, response.updateVCL);

  before(async () => {
    res = await fastly.updateVCL('1', 'test-vcl', { content: 'backend default {\n  .host = "127.0.0.1";\n  .port = "9092";\n}\n\nsub vcl_recv {\n    set req.backend = default;\n}\n\nsub vcl_hash {\n    set req.hash += req.url;\n    set req.hash += req.http.host;\n    set req.hash += "0";\n}' });
  });

  it('response should be a status 200', () => {
    expect(res.status).toBe(200);
  });

  it('response body should exist', () => {
    expect(res.data).toBeTruthy();
  });

  it('response body should be an object', () => {
    expect(typeof res.data).toBe('object');
  });

  it('response body properties should be created', () => {
    expect(res.data.name).toBe('test-vcl');
    expect(res.data.main).toBe(false);
    expect(res.data.content).toBe('backend default {\n  .host = "127.0.0.1";\n  .port = "9092";\n}\n\nsub vcl_recv {\n    set req.backend = default;\n}\n\nsub vcl_hash {\n    set req.hash += req.url;\n    set req.hash += req.http.host;\n    set req.hash += "0";\n}');
  });

  it('response body should contain all properties', () => {
    [
      'name',
      'content',
      'main',
      'service_id',
      'version',
    ].forEach((e) => {
      expect(Object.keys(res.data)).toContain(e);
    });
  });
});

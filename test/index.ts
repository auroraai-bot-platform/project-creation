import { assert } from 'chai';
import { describe, it } from 'mocha';
import { createProjects, LambdaRequest } from '../src/index';

const token = process.env.REST_API_TOKEN || 'TEST_TOKEN';

describe('test lambda handler', function() {
  it('should create a project and return 200 ok', async function() {

    const requestData: LambdaRequest = {
      authToken: token,
      botfrontBaseUrl: 'http://localhost:3030',
      projects: [
        {
          baseUrl: 'http://example.test',
          name: 'TESTPROJECT',
          nameSpace: 'bf-testproject',
          projectId: 'TESTPROJECTID'
        }
      ]
    };

    const result = await createProjects(requestData);
    console.log({result});
    if (!result) {
      assert.fail('No lambda response');
    }
    assert.strictEqual(result.statusCode, 200);
  });

  it('should fail because of missing authorization', async function() {

    const requestData: LambdaRequest = {
      authToken: '',
      botfrontBaseUrl: 'http://localhost:3030',
      projects: [
        {
          baseUrl: 'http://example.test',
          name: 'TESTPROJECT',
          nameSpace: 'bf-testproject',
          projectId: 'TESTPROJECTID'
        }
      ]
    };

    const result = await createProjects(requestData);

    if (!result) {
      assert.fail('No lambda response');
    }
    assert.strictEqual(result.statusCode, 503);
  });

});
import { assert } from 'chai';
import { describe, it } from 'mocha';
import { createProjects } from '../src/index';
import {LambdaRequest} from '../src/index';

const token = process.env.REST_API_TOKEN || 'TEST_TOKEN';

describe('test lambda handler', function() {
  it('should create a project and return 200 ok', async function() {

    const requestData: LambdaRequest = {
      botfrontBaseUrl: 'http://localhost:3030',
      projects: [
        {
          baseUrl: 'http://example.test',
          name: 'TESTPROJECT',
          nameSpace: 'bf-testproject',
          projectId: 'TESTPROJECTID',
          host: 'http://example.test',
          token: '1123',
          actionEndpoint: 'http://example.test',
          prodActionEndpoint: 'http://example.test',
          prodBaseUrl: 'http://example.test'
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
});